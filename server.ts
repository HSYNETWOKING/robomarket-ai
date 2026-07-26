import express from "express";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper functions for Password Hashing & Validation
function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

function comparePassword(password: string, storedHash: string): boolean {
  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    return bcrypt.compareSync(password, storedHash);
  }
  // Fallback for legacy plaintext
  return password === storedHash;
}

function validatePasswordStrength(password?: string): { valid: boolean; message?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password parameter is required' };
  }
  const trimmed = password.trim();
  if (trimmed.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
}

// Lazy Initialize Gemini Client helper to prevent startup crash if GEMINI_API_KEY is missing
let aiInstance: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please configure it in the Settings > Secrets menu.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Paths for persistent data files
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ROBOTS_FILE = path.join(DATA_DIR, "robots.json");
const CHATS_FILE = path.join(DATA_DIR, "chats.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Pre-seeded Robots
const initialRobots = [
  {
    id: "r1",
    name: "Apex-V1 Industrial Arm",
    description: "A high-precision six-axis robotic arm designed for assembly, welding, and material handling. Built with high-torque brushless motors and robust carbon fiber casings, it offers high repeatability and payloads. Ideal for precision electronics assembly or manufacturing lines.",
    category: "Industrial",
    price: 45000,
    location: "Detroit, MI",
    specs: {
      manufacturer: "Apex Robotics Corp",
      payload: "15 kg",
      batteryLife: "Wired (AC 220V)",
      speed: "2.5 m/s",
      weight: "120 kg",
      operatingSystem: "ApexOS v3.1",
      warranty: "3 years"
    },
    status: "approved",
    sellerId: "admin",
    sellerName: "RoboMarket Prime",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    condition: "new",
    rating: 4.8,
    reviews: [
      { id: "rev1", robotId: "r1", userId: "u2", username: "FactoryManagerX", rating: 5, comment: "Incredible repeatability. We've been running it 24/7 for three months without a single issue.", createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "r2",
    name: "Hume-X2 Humanoid Assistant",
    description: "A state-of-the-art bipedal humanoid robot designed for research, customer service, and concierge operations. Equipped with 24 degrees of freedom, advanced facial recognition cameras, and a chest display. Possesses elegant fluid movement algorithms.",
    category: "Humanoid",
    price: 75000,
    location: "San Jose, CA",
    specs: {
      manufacturer: "Hume Dynamics",
      payload: "5 kg (hand carry)",
      batteryLife: "8 hours",
      speed: "1.2 m/s",
      weight: "65 kg",
      operatingSystem: "HumeCore Linux v4",
      warranty: "1 year"
    },
    status: "approved",
    sellerId: "u3",
    sellerName: "Silicon Robotics Lab",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    condition: "refurbished",
    rating: 4.5,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "r3",
    name: "MedBot Care-Plus",
    description: "Designed specifically for hospital and clinical environments. MedBot autonomously navigates crowded corridors to deliver pharmaceuticals, surgical tools, and patient charts. Includes sterile sealed compartments and integrated UV sanitization lights.",
    category: "Medical",
    price: 28000,
    location: "Boston, MA",
    specs: {
      manufacturer: "MedTech Automation",
      payload: "30 kg",
      batteryLife: "12 hours",
      speed: "0.8 m/s",
      weight: "45 kg",
      operatingSystem: "CareOS Medical",
      warranty: "2 years"
    },
    status: "approved",
    sellerId: "admin",
    sellerName: "RoboMarket Prime",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    condition: "new",
    rating: 4.9,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "r4",
    name: "AgriCulti-6 Surveying Drone",
    description: "Heavy-duty agricultural hexacopter drone for field mapping, yield estimation, and autonomous crop dusting. Equipped with multispectral cameras, LIDAR, and a 20L high-volume liquid tank with precision adjustable nozzles.",
    category: "Agricultural",
    price: 12500,
    location: "Des Moines, IA",
    specs: {
      manufacturer: "GreenField Aero",
      payload: "25 kg (max lift)",
      batteryLife: "45 minutes",
      speed: "15 m/s",
      weight: "12 kg",
      operatingSystem: "ArduPilot Enterprise",
      warranty: "2 years"
    },
    status: "approved",
    sellerId: "u3",
    sellerName: "Silicon Robotics Lab",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    condition: "new",
    rating: 4.2,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "r5",
    name: "Aegis Guardian-IV Security Robot",
    description: "An autonomous terrestrial security platform equipped with active LIDAR mapping, thermal night-vision, license plate recognition, and glass-break sound detection. Built with deep rugged tires for cross-terrain outdoor tracking.",
    category: "Security",
    price: 18900,
    location: "Austin, TX",
    specs: {
      manufacturer: "Aegis Tactical",
      payload: "N/A",
      batteryLife: "10 hours",
      speed: "4.0 m/s",
      weight: "38 kg",
      operatingSystem: "AegisGuard v2",
      warranty: "3 years"
    },
    status: "approved",
    sellerId: "admin",
    sellerName: "RoboMarket Prime",
    imageUrl: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    condition: "new",
    rating: 4.4,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "r6",
    name: "CyberDog Sparky (V2)",
    description: "High-fidelity quadrupod companion robot for emotional intelligence interactions, home monitoring, and basic fetching tasks. Fully programmable with open-source Python SDK, ideal for STEM educational projects and premium companionship.",
    category: "Companion",
    price: 1999,
    location: "Seattle, WA",
    specs: {
      manufacturer: "Cybernetic Companion Group",
      payload: "1.5 kg",
      batteryLife: "4 hours",
      speed: "1.6 m/s",
      weight: "8.5 kg",
      operatingSystem: "SparkOS (ROS2 based)",
      warranty: "1 year"
    },
    status: "approved",
    sellerId: "u2",
    sellerName: "TechEnthusiast99",
    imageUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    condition: "used",
    rating: 4.6,
    reviews: [],
    createdAt: new Date().toISOString()
  }
];

// Load Helpers
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultValue;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Ensure default demo users with strict roles & hashed passwords
const seedDemoUsers = [
  { id: "admin", email: "admin@robomarket.ai", username: "admin", role: "admin", password: hashPassword("password123"), rating: 5, ratingCount: 1, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin", createdAt: new Date().toISOString() },
  { id: "u2", email: "user@robomarket.ai", username: "TechEnthusiast99", role: "user", password: hashPassword("password123"), rating: 4.8, ratingCount: 4, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=TechEnthusiast99", createdAt: new Date().toISOString() },
  { id: "manager1", email: "manager@robomarket.ai", username: "FleetManager", role: "manager", password: hashPassword("password123"), rating: 5, ratingCount: 2, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=FleetManager", createdAt: new Date().toISOString() },
  { id: "u3", email: "silicon@robomarket.ai", username: "Silicon Robotics Lab", role: "user", password: hashPassword("password123"), rating: 4.6, ratingCount: 8, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Silicon", createdAt: new Date().toISOString() }
];

let users = readJsonFile<any[]>(USERS_FILE, seedDemoUsers);

// Guarantee demo users exist in memory and disk with exact roles and hashed passwords
seedDemoUsers.forEach(seedUser => {
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === seedUser.email.toLowerCase());
  if (existingIdx !== -1) {
    users[existingIdx] = {
      ...users[existingIdx],
      role: seedUser.role,
      password: seedUser.password,
      username: users[existingIdx].username || seedUser.username
    };
  } else {
    users.push(seedUser);
  }
});

let robots = readJsonFile<any[]>(ROBOTS_FILE, initialRobots);
let chats = readJsonFile<any[]>(CHATS_FILE, []);
let orders = readJsonFile<any[]>(ORDERS_FILE, []);

// Initial save to establish files
writeJsonFile(USERS_FILE, users);
writeJsonFile(ROBOTS_FILE, robots);
writeJsonFile(CHATS_FILE, chats);
writeJsonFile(ORDERS_FILE, orders);

// Authentication & RBAC Middleware
interface AuthenticatedRequest extends express.Request {
  user?: any;
}

const authenticateToken = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized access - missing or invalid Authorization header" });
  }
  const token = authHeader.split(" ")[1];
  const userId = token.replace("jwt_mock_token_", "");
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: "Session node expired or invalid token" });
  }
  req.user = user;
  next();
};

const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const userRole = (req.user.role || '').toLowerCase();
    const allowed = roles.map(r => r.toLowerCase());
    if (!allowed.includes(userRole)) {
      return res.status(403).json({ 
        error: `Access denied (403 Forbidden). ${roles.join(' or ')} role required.` 
      });
    }
    next();
  };
};

// API ROUTES

// AUTH API
app.get("/api/auth/me", authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = req.user;
  // Omit password hash before returning
  const { password, ...sanitizedUser } = user;
  res.json({ user: sanitizedUser });
});

app.post("/api/auth/register", (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username) {
    return res.status(400).json({ error: "Missing required registration parameters" });
  }

  const passCheck = validatePasswordStrength(password);
  if (!passCheck.valid) {
    return res.status(400).json({ error: passCheck.message });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({ error: "User already registered with this email" });
  }

  let role = "user";
  if (cleanEmail === "admin@robomarket.ai") role = "admin";
  else if (cleanEmail === "manager@robomarket.ai") role = "manager";

  const newUser = {
    id: "u_" + Date.now(),
    email: cleanEmail,
    username: username.trim(),
    password: hashPassword(password),
    role,
    rating: 5,
    ratingCount: 0,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeJsonFile(USERS_FILE, users);
  const { password: _, ...sanitizedUser } = newUser;
  res.json({ user: sanitizedUser, token: "jwt_mock_token_" + newUser.id });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email parameter is required" });
  }

  const cleanEmail = email.trim().toLowerCase();
  let user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    // Auto-seed demo credentials if standard emails or create user
    const passCheck = validatePasswordStrength(password);
    if (!passCheck.valid) {
      return res.status(400).json({ error: passCheck.message });
    }

    let role = "user";
    let defaultUsername = cleanEmail.split("@")[0] || "User";
    if (cleanEmail === "admin@robomarket.ai") {
      role = "admin";
      defaultUsername = "admin";
    } else if (cleanEmail === "manager@robomarket.ai") {
      role = "manager";
      defaultUsername = "FleetManager";
    }

    user = {
      id: "u_" + Date.now(),
      email: cleanEmail,
      username: defaultUsername,
      password: hashPassword(password || "password123"),
      role,
      rating: 5,
      ratingCount: 0,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${defaultUsername}`,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    writeJsonFile(USERS_FILE, users);
    const { password: _, ...sanitizedUser } = user;
    return res.json({ user: sanitizedUser, token: "jwt_mock_token_" + user.id });
  }

  // Validate password
  if (password) {
    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials. Password verification failed." });
    }
  }

  // Guarantee correct role mapping for demo credentials
  if (cleanEmail === "admin@robomarket.ai" && user.role !== "admin") {
    user.role = "admin";
    writeJsonFile(USERS_FILE, users);
  } else if (cleanEmail === "manager@robomarket.ai" && user.role !== "manager") {
    user.role = "manager";
    writeJsonFile(USERS_FILE, users);
  } else if (cleanEmail === "user@robomarket.ai" && user.role !== "user") {
    user.role = "user";
    writeJsonFile(USERS_FILE, users);
  }

  const { password: _, ...sanitizedUser } = user;
  res.json({ user: sanitizedUser, token: "jwt_mock_token_" + user.id });
});

// GET ALL APPROVED ROBOTS
app.get("/api/robots", (req, res) => {
  const queryStatus = req.query.status;
  if (queryStatus === "all") {
    // Show all to users if requested (mostly for internal/dashboard)
    return res.json(robots);
  }
  // Default to approved listings only
  const approved = robots.filter(r => r.status === "approved");
  res.json(approved);
});

// CREATE NEW ROBOT LISTING (Pending approval by default)
app.post("/api/robots", authenticateToken, (req: AuthenticatedRequest, res) => {
  const { name, description, category, price, location, specs, condition, imageUrl } = req.body;
  const user = req.user;
  
  if (!name || !price || !category) {
    return res.status(400).json({ error: "Missing required fields (name, price, category)" });
  }

  const newRobot = {
    id: "r_" + Date.now(),
    name,
    description: description || "No description provided.",
    category,
    price: Number(price),
    location: location || "Remote",
    specs: specs || {},
    status: user.role === "admin" ? "approved" : "pending", // Admins auto-approve, others pending review
    sellerId: user.id,
    sellerName: user.username || "Private Seller",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    condition: condition || "new",
    rating: 5,
    reviews: [],
    createdAt: new Date().toISOString()
  };

  robots.unshift(newRobot);
  writeJsonFile(ROBOTS_FILE, robots);
  res.json(newRobot);
});

// SUBMIT ROBOT REVIEW
app.post("/api/robots/:id/reviews", authenticateToken, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const user = req.user;

  if (!rating || !comment) {
    return res.status(400).json({ error: "Missing review fields (rating, comment)" });
  }

  const robotIndex = robots.findIndex(r => r.id === id);
  if (robotIndex === -1) {
    return res.status(404).json({ error: "Robot listing not found" });
  }

  const newReview = {
    id: "rev_" + Date.now(),
    robotId: id,
    userId: user.id,
    username: user.username || "Anonymous",
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString()
  };

  robots[robotIndex].reviews.push(newReview);
  
  // Recalculate average rating
  const totalRating = robots[robotIndex].reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
  robots[robotIndex].rating = Number((totalRating / robots[robotIndex].reviews.length).toFixed(1));

  writeJsonFile(ROBOTS_FILE, robots);
  res.json(robots[robotIndex]);
});

// ADMIN ENDPOINTS
app.put("/api/admin/listings/:id", authenticateToken, requireRole("admin", "manager"), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' | 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: "Invalid status state" });
  }

  const index = robots.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Listing not found" });
  }

  robots[index].status = status;
  writeJsonFile(ROBOTS_FILE, robots);
  res.json(robots[index]);
});

// ADMIN USER MANAGEMENT ENDPOINTS
app.get("/api/admin/users", authenticateToken, requireRole("admin", "manager"), (req: AuthenticatedRequest, res) => {
  const sanitized = users.map(({ password, ...u }) => u);
  res.json(sanitized);
});

app.put("/api/admin/users/:id/role", authenticateToken, requireRole("admin"), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'manager', 'user'].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified. Must be 'admin', 'manager', or 'user'." });
  }

  const targetIdx = users.findIndex(u => u.id === id);
  if (targetIdx === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[targetIdx].role = role;
  writeJsonFile(USERS_FILE, users);
  const { password, ...sanitized } = users[targetIdx];
  res.json(sanitized);
});

// ORDERS ENDPOINTS
app.post("/api/orders", authenticateToken, (req: AuthenticatedRequest, res) => {
  const { robotId } = req.body;
  const user = req.user;

  if (!robotId) {
    return res.status(400).json({ error: "Missing required robotId parameter" });
  }

  const robot = robots.find(r => r.id === robotId);
  if (!robot) {
    return res.status(404).json({ error: "Robot not found" });
  }

  const newOrder = {
    id: "ord_" + Math.floor(100000 + Math.random() * 900000),
    robotId,
    robotName: robot.name,
    robotImageUrl: robot.imageUrl,
    price: robot.price,
    buyerId: user.id,
    buyerName: user.username,
    sellerId: robot.sellerId,
    status: "pending",
    trackingNumber: "TRK" + Math.floor(10000000 + Math.random() * 90000000),
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  writeJsonFile(ORDERS_FILE, orders);
  res.json(newOrder);
});

app.get("/api/orders", authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = req.user;
  const queryUserId = req.query.userId as string;

  if (['admin', 'manager'].includes(user.role.toLowerCase())) {
    if (queryUserId) {
      const filtered = orders.filter(o => o.buyerId === queryUserId || o.sellerId === queryUserId);
      return res.json(filtered);
    }
    return res.json(orders);
  }

  // Regular user: strictly enforce viewing only their own orders
  const myOrders = orders.filter(o => o.buyerId === user.id || o.sellerId === user.id);
  res.json(myOrders);
});

app.put("/api/orders/:id/status", authenticateToken, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'processing', 'shipped', 'delivered', 'cancelled'
  const user = req.user;

  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  const order = orders[index];
  const isAuthorized = 
    ['admin', 'manager'].includes(user.role.toLowerCase()) || 
    user.id === order.sellerId || 
    user.id === order.buyerId;

  if (!isAuthorized) {
    return res.status(403).json({ error: "Access denied. You can only update your own orders." });
  }

  orders[index].status = status;
  writeJsonFile(ORDERS_FILE, orders);
  res.json(orders[index]);
});

// CHATS ENDPOINTS
app.get("/api/chats", authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (['admin', 'manager'].includes(user.role.toLowerCase())) {
    return res.json(chats);
  }
  const filtered = chats.filter(c => c.buyerId === user.id || c.sellerId === user.id);
  res.json(filtered);
});

app.post("/api/chats", authenticateToken, (req: AuthenticatedRequest, res) => {
  const { sellerId, sellerName, robotId, robotName } = req.body;
  const user = req.user;

  if (!sellerId || !robotId) {
    return res.status(400).json({ error: "Missing required chat parameters (sellerId, robotId)" });
  }

  // Find existing thread
  let thread = chats.find(c => c.buyerId === user.id && c.sellerId === sellerId && c.robotId === robotId);
  if (!thread) {
    thread = {
      id: "ch_" + Date.now(),
      buyerId: user.id,
      buyerName: user.username,
      sellerId,
      sellerName: sellerName || "Seller",
      robotId,
      robotName: robotName || "Hardware Unit",
      messages: [],
      updatedAt: new Date().toISOString()
    };
    chats.unshift(thread);
    writeJsonFile(CHATS_FILE, chats);
  }
  res.json(thread);
});

app.post("/api/chats/:id/messages", authenticateToken, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const user = req.user;

  if (!content) {
    return res.status(400).json({ error: "Message content cannot be empty" });
  }

  const index = chats.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Chat thread not found" });
  }

  const thread = chats[index];
  const isParticipant = ['admin', 'manager'].includes(user.role.toLowerCase()) || user.id === thread.buyerId || user.id === thread.sellerId;
  if (!isParticipant) {
    return res.status(403).json({ error: "Access denied to chat thread" });
  }

  const newMessage = {
    id: "msg_" + Date.now(),
    senderId: user.id,
    senderName: user.username,
    content,
    createdAt: new Date().toISOString()
  };

  chats[index].messages.push(newMessage);
  chats[index].updatedAt = new Date().toISOString();
  writeJsonFile(CHATS_FILE, chats);
  res.json(chats[index]);
});


// GEMINI AI ENDPOINTS

function formatAiError(err: any): string {
  const errMsg = err?.message || String(err || '');
  if (
    errMsg.includes("503") ||
    errMsg.includes("UNAVAILABLE") ||
    errMsg.includes("high demand") ||
    errMsg.includes("overloaded") ||
    errMsg.includes("capacity") ||
    errMsg.includes("rate limit") ||
    errMsg.includes("429")
  ) {
    return "The Gemini API service is currently experiencing high demand or is temporarily unavailable (503 Service Unavailable). Please wait a moment and try again.";
  }
  return errMsg;
}

// Exponential backoff helper for transient API errors
async function callWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const errMsg = err?.message || String(err || '');
      const isTransient = 
        errMsg.includes("503") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("high demand") ||
        errMsg.includes("overloaded") ||
        errMsg.includes("capacity") ||
        errMsg.includes("rate limit") ||
        errMsg.includes("429");
      
      if (!isTransient || i === retries - 1) {
        throw err;
      }
      
      console.warn(`Transient Gemini API error detected. Retrying ${i + 1}/${retries} in ${delay * (i + 1)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw lastErr;
}

// API STATUS CHECK
app.get("/api/ai/status", (req, res) => {
  res.json({
    hasGeminiKey: !!process.env.GEMINI_API_KEY
  });
});

// 1. AI ADVISOR CHAT API
app.post("/api/ai/chat", async (req, res) => {
  const { messages } = req.body; // Array of { role: 'user' | 'model', content: string }
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array required" });
  }

  try {
    const formattedContents = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Inject system instructions and pre-seeded database reference
    const activeRobotsString = JSON.stringify(robots.filter(r => r.status === "approved").map(r => ({
      name: r.name,
      category: r.category,
      price: r.price,
      location: r.location,
      condition: r.condition,
      specs: r.specs
    })));

    const response = await callWithRetry(() => getAiClient().models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedContents,
      config: {
        systemInstruction: `You are the RoboMarket AI SaaS Advisor & Hardware Specialist. Your role is to assist users with selecting SaaS subscriptions (Free, Pro, Enterprise), recommending AI models (Gemini 3.6 Flash, Gemini 3.1 Pro, GPT-4o, Claude 3.5 Sonnet, DeepSeek R1, Grok 2), managing BYOK API Keys, connecting Web3 Wallets, purchasing token packs, and buying autonomous robotic hardware.

SAAS SUBSCRIPTION PLANS:
- Free Tier ($0/mo): 20k tokens/mo, Gemini 3.6 Flash & Llama 3.3.
- Pro Plan ($29/mo or ~0.01 ETH): 500k tokens/mo, Gemini 3.1 Pro, GPT-4o, Claude 3.5 Sonnet, DeepSeek V3, Chat-based Crypto Purchasing.
- Enterprise Tier ($199/mo or ~0.065 ETH): 5M tokens/mo, All models (Gemini 3.1 Pro, GPT-4o, Claude 3.5, Grok 2, DeepSeek R1), 300 RPM, Web3 Escrow.
- 100k Token Pack ($10 or ~0.0035 ETH): One-time +100,000 AI tokens top-up.

CRITICAL INSTRUCTIONS:
1. Help users compare plans, explain token limits, recommend plans, and encourage subscribing or topping up via Web3 crypto payments.
2. If the user asks to buy or upgrade to a plan, explicitly confirm the plan details and pricing in ETH/USD.
3. Be direct, professional, concise, and markdown formatted.`,
        temperature: 0.7,
      }
    }));

    res.json({ content: response.text });
  } catch (err: any) {
    console.error("AI Advisor error (auto-falling back to local intelligent engine):", err);
    
    // Automatic fallback logic when API is overloaded or key fails
    const lastMsg = (messages?.[messages.length - 1]?.content || '').toLowerCase();
    let fallbackText = "As your AI Advisor, I am using our local backup intelligence engine to assist you:\n\n";
    let planRecommendation = undefined;
    let paymentCard = undefined;

    if (lastMsg.includes('enterprise')) {
      fallbackText += "The **Enterprise Tier** ($199/mo or 0.065 ETH) provides **5,000,000 monthly tokens**, access to ALL models (Gemini 3.1 Pro, GPT-4o, Claude 3.5, Grok 2, DeepSeek R1), and Web3 auto-invoicing.\n\nYou can click below to complete your crypto transaction.";
      planRecommendation = { planId: "plan_enterprise", planName: "Enterprise Tier", priceUSD: 199, cryptoETH: 0.065, tokenAllowance: "5,000,000 tokens / mo", features: ["5M Tokens", "All Premium Models", "Web3 Escrow"] };
      paymentCard = { orderId: "ord_" + Date.now(), planId: "plan_enterprise", planName: "Enterprise Tier", amountUSD: 199, amountCrypto: 0.065, currency: "ETH" as const, status: "pending" as const };
    } else if (lastMsg.includes('pro') || lastMsg.includes('plan') || lastMsg.includes('buy') || lastMsg.includes('price')) {
      fallbackText += "I recommend our **Pro Plan** ($29/mo or 0.01 ETH). It offers **500,000 tokens/mo**, access to Gemini 3.1 Pro, GPT-4o, Claude 3.5 Sonnet, and BYOK API Key Vault integration.\n\nYou can subscribe directly below:";
      planRecommendation = { planId: "plan_pro", planName: "Pro Plan", priceUSD: 29, cryptoETH: 0.01, tokenAllowance: "500,000 tokens / mo", features: ["500k Tokens", "Access to Pro Models", "BYOK Key Vault"] };
      paymentCard = { orderId: "ord_" + Date.now(), planId: "plan_pro", planName: "Pro Plan", amountUSD: 29, amountCrypto: 0.01, currency: "ETH" as const, status: "pending" as const };
    } else {
      fallbackText += "Welcome! I can help you select a plan, manage your personal API keys (BYOK), connect Web3 wallets, or procure robotic hardware. Let me know what you're looking for!";
    }

    res.json({ 
      content: fallbackText, 
      isFallback: true, 
      planRecommendation, 
      paymentCard 
    });
  }
});

// 2. AI ADVANCED NATURAL LANGUAGE SEARCH
app.post("/api/ai/search", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const activeRobots = robots.filter(r => r.status === "approved");
    const robotsBrief = activeRobots.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      category: r.category,
      price: r.price,
      location: r.location,
      condition: r.condition,
      specs: r.specs
    }));

    const prompt = `Analyze the user's natural language search query for a robot marketplace and identify which of the available robots are relevant.
User Query: "${query}"

Available Robots:
${JSON.stringify(robotsBrief, null, 2)}`;

    const response = await callWithRetry(() => getAiClient().models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reasoning: {
              type: Type.STRING,
              description: "A friendly, professional 1-2 sentence explanation of how the matched robots fit the user's needs, or why no match was found."
            },
            matchedRobotIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of matching robot IDs from the provided database. Return empty array if absolutely none match."
            },
            suggestedBudgetRange: {
              type: Type.STRING,
              description: "Estimated budget range suitable for their request, e.g. '$15,000 - $30,000'."
            }
          },
          required: ["reasoning", "matchedRobotIds"]
        },
        systemInstruction: "You are a database query assistant. You convert loose natural language searches into structured search matching results based strictly on the user's requirements and budget."
      }
    }));

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("AI Search Error:", err);
    res.status(500).json({ error: formatAiError(err) });
  }
});

// 3. AI LISTING QUALITY & SECURITY ANALYZER
app.post("/api/ai/analyze-listing", async (req, res) => {
  const { robotId } = req.body;
  if (!robotId) {
    return res.status(400).json({ error: "Robot ID is required" });
  }

  const robot = robots.find(r => r.id === robotId);
  if (!robot) {
    return res.status(404).json({ error: "Robot listing not found" });
  }

  try {
    const prompt = `Analyze this robot marketplace listing for authenticity, specification consistency, pricing realism, and security warning flags.
Robot Name: ${robot.name}
Category: ${robot.category}
Price: $${robot.price}
Condition: ${robot.condition}
Location: ${robot.location}
Seller Name: ${robot.sellerName}
Description: "${robot.description}"
Specifications: ${JSON.stringify(robot.specs, null, 2)}`;

    const response = await callWithRetry(() => getAiClient().models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            qualityScore: {
              type: Type.INTEGER,
              description: "Quality score from 0 to 100 assessing how well-documented and realistic the listing is."
            },
            summary: {
              type: Type.STRING,
              description: "Brief professional summary of the listing (1-2 sentences)."
            },
            pros: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 2-3 technical/commercial strengths of this listing."
            },
            cons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 2-3 weaknesses, missing specs, or potential points of caution."
            },
            suspiciousFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Any suspicious signs or warnings (e.g. price too low, contradictory specifications, sketchy location, etc.). Leave empty if highly trustable."
            },
            verdict: {
              type: Type.STRING,
              description: "Overall buying advice verdict. Must be one of: 'Excellent' | 'Fair' | 'Suspicious' | 'Dangerous'."
            }
          },
          required: ["qualityScore", "summary", "pros", "cons", "suspiciousFlags", "verdict"]
        },
        systemInstruction: "You are an automated marketplace security and QA analyst. Your job is to check for fraudulent listings, inconsistent hardware specs, overpricing/underpricing, and help buyers understand listing quality."
      }
    }));

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("AI analyzer error:", err);
    res.status(500).json({ error: formatAiError(err) });
  }
});


// Serve static files and index.html in production / development fallback
const distPath = path.join(process.cwd(), "dist");

if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    
    // Fallback error-handling or logging in development
    app.use((err: any, req: any, res: any, next: any) => {
      console.error(err);
      res.status(500).send(err.message);
    });
  });
} else {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`RoboMarket AI server running on port ${PORT}`);
});
