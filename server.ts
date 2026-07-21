import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

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

// Databases variables
let users = readJsonFile<any[]>(USERS_FILE, [
  { id: "admin", email: "admin@robomarket.ai", username: "admin", role: "admin", rating: 5, ratingCount: 1, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin", createdAt: new Date().toISOString() },
  { id: "u2", email: "user@robomarket.ai", username: "TechEnthusiast99", role: "user", rating: 4.8, ratingCount: 4, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=TechEnthusiast99", createdAt: new Date().toISOString() },
  { id: "u3", email: "silicon@robomarket.ai", username: "Silicon Robotics Lab", role: "user", rating: 4.6, ratingCount: 8, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Silicon", createdAt: new Date().toISOString() }
]);

let robots = readJsonFile<any[]>(ROBOTS_FILE, initialRobots);
let chats = readJsonFile<any[]>(CHATS_FILE, []);
let orders = readJsonFile<any[]>(ORDERS_FILE, []);

// Initial save to establish files
writeJsonFile(USERS_FILE, users);
writeJsonFile(ROBOTS_FILE, robots);
writeJsonFile(CHATS_FILE, chats);
writeJsonFile(ORDERS_FILE, orders);

// API ROUTES

// AUTH API
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized access - no secure token" });
  }
  const token = authHeader.split(" ")[1];
  const userId = token.replace("jwt_mock_token_", "");
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: "Session node expired or invalid" });
  }
  res.json({ user });
});

app.post("/api/auth/register", (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username) {
    return res.status(400).json({ error: "Missing required registration parameters" });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "User already registered with this email" });
  }

  const newUser = {
    id: "u_" + Date.now(),
    email,
    username,
    password: password || "password123",
    role: "user",
    rating: 5,
    ratingCount: 0,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeJsonFile(USERS_FILE, users);
  res.json({ user: newUser, token: "jwt_mock_token_" + newUser.id });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email parameter is required" });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // Auto-create to provide high usability in AI Studio sandbox!
    const username = email.split("@")[0] || "User" + Math.floor(Math.random() * 1000);
    const newUser = {
      id: "u_" + Date.now(),
      email,
      username,
      password: password || "password123",
      role: "user",
      rating: 5,
      ratingCount: 0,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeJsonFile(USERS_FILE, users);
    return res.json({ user: newUser, token: "jwt_mock_token_" + newUser.id });
  }

  // Verify password if entered
  if (password && user.password && user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials. Please double check password." });
  }

  res.json({ user, token: "jwt_mock_token_" + user.id });
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
app.post("/api/robots", (req, res) => {
  const { name, description, category, price, location, specs, condition, sellerId, sellerName, imageUrl } = req.body;
  
  if (!name || !price || !category || !sellerId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newRobot = {
    id: "r_" + Date.now(),
    name,
    description: description || "No description provided.",
    category,
    price: Number(price),
    location: location || "Remote",
    specs: specs || {},
    status: "pending", // Pending admin review
    sellerId,
    sellerName: sellerName || "Private Seller",
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
app.post("/api/robots/:id/reviews", (req, res) => {
  const { id } = req.params;
  const { userId, username, rating, comment } = req.body;

  if (!userId || !rating || !comment) {
    return res.status(400).json({ error: "Missing review fields" });
  }

  const robotIndex = robots.findIndex(r => r.id === id);
  if (robotIndex === -1) {
    return res.status(404).json({ error: "Robot listing not found" });
  }

  const newReview = {
    id: "rev_" + Date.now(),
    robotId: id,
    userId,
    username: username || "Anonymous",
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
app.put("/api/admin/listings/:id", (req, res) => {
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

// ORDERS ENDPOINTS
app.post("/api/orders", (req, res) => {
  const { robotId, buyerId, buyerName } = req.body;
  if (!robotId || !buyerId) {
    return res.status(400).json({ error: "Missing order components" });
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
    buyerId,
    buyerName,
    sellerId: robot.sellerId,
    status: "pending",
    trackingNumber: "TRK" + Math.floor(10000000 + Math.random() * 90000000),
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  writeJsonFile(ORDERS_FILE, orders);
  res.json(newOrder);
});

app.get("/api/orders", (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.json(orders);
  }
  const filtered = orders.filter(o => o.buyerId === userId || o.sellerId === userId);
  res.json(filtered);
});

app.put("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'processing', 'shipped', 'delivered'

  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  orders[index].status = status;
  writeJsonFile(ORDERS_FILE, orders);
  res.json(orders[index]);
});

// CHATS ENDPOINTS
app.get("/api/chats", (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.json(chats);
  const filtered = chats.filter(c => c.buyerId === userId || c.sellerId === userId);
  res.json(filtered);
});

app.post("/api/chats", (req, res) => {
  const { buyerId, buyerName, sellerId, sellerName, robotId, robotName } = req.body;
  if (!buyerId || !sellerId || !robotId) {
    return res.status(400).json({ error: "Missing thread creators" });
  }

  // Find existing thread
  let thread = chats.find(c => c.buyerId === buyerId && c.sellerId === sellerId && c.robotId === robotId);
  if (!thread) {
    thread = {
      id: "ch_" + Date.now(),
      buyerId,
      buyerName,
      sellerId,
      sellerName,
      robotId,
      robotName,
      messages: [],
      updatedAt: new Date().toISOString()
    };
    chats.unshift(thread);
    writeJsonFile(CHATS_FILE, chats);
  }
  res.json(thread);
});

app.post("/api/chats/:id/messages", (req, res) => {
  const { id } = req.params;
  const { senderId, senderName, content } = req.body;

  const index = chats.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Chat thread not found" });
  }

  const newMessage = {
    id: "msg_" + Date.now(),
    senderId,
    senderName,
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

    const response = await getAiClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: `You are the RoboMarket AI Advisor, an expert robotics consultant and marketplace navigator. Your role is to help users select the perfect robots for their specific needs (industrial, medical, agricultural, security, delivery, cleaning, companion, education, humanoid, research, companion etc.), analyze budgets, explain complex engineering specs in simple terms, and compare models.

AVAILABLE LISTINGS IN THE MARKETPLACE:
${activeRobotsString}

CRITICAL INSTRUCTIONS:
1. Restrict your scope strictly to robotics, hardware automation, and robot marketplace queries. If the user asks about unrelated topics (e.g. cooking recipes, history, general software coding, music), politely refuse and guide them back to robotics.
2. Be professional, direct, objective, and highly helpful. Focus on being their dedicated Robotics Expert.
3. Recommend listings from the active marketplace list when appropriate. Let them know these specific models are listed in our catalog.
4. Try to make suggestions realistic and highlight physical requirements (such as payload, battery, operating system, speed).
5. Always answer in clear, markdown formatting. Keep your responses highly scannable and readable.`,
        temperature: 0.7,
      }
    });

    res.json({ content: response.text });
  } catch (err: any) {
    console.error("AI Advisor error:", err);
    res.status(500).json({ error: formatAiError(err) });
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

    const response = await getAiClient().models.generateContent({
      model: "gemini-3.5-flash",
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
    });

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

    const response = await getAiClient().models.generateContent({
      model: "gemini-3.5-flash",
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
    });

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
