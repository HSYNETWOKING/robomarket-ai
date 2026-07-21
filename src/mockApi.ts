// RoboMarket Client-Side Mock Database & API Interceptor Fallback
// This file runs inside the browser and intercept /api calls if the backend is unreachable (e.g., on Vercel static deployments)
import { User, Robot } from './types';

// Declare a global flag on the window object
declare global {
  interface Window {
    __ROBO_USE_MOCK__?: boolean;
    __ROBO_MOCK_INITIALIZED__?: boolean;
  }
}

// Initial default datasets matching server.ts exactly
const initialUsers: User[] = [
  { id: "admin", email: "admin@robomarket.ai", username: "admin", role: "admin", rating: 5, ratingCount: 1, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin", createdAt: new Date().toISOString() },
  { id: "u2", email: "user@robomarket.ai", username: "TechEnthusiast99", role: "user", rating: 4.8, ratingCount: 4, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=TechEnthusiast99", createdAt: new Date().toISOString() },
  { id: "u3", email: "silicon@robomarket.ai", username: "Silicon Robotics Lab", role: "user", rating: 4.6, ratingCount: 8, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Silicon", createdAt: new Date().toISOString() }
];

const initialRobots: Robot[] = [
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
    name: "Aegis Guardian-IV Security Platform",
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
      operatingSystem: "AegisOS Tactical",
      warranty: "2 years"
    },
    status: "approved",
    sellerId: "admin",
    sellerName: "RoboMarket Prime",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    condition: "new",
    rating: 4.6,
    reviews: [],
    createdAt: new Date().toISOString()
  }
];

// Helper to load/save from localStorage
function getStore<T>(key: string, initial: T): T {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initial;
  }
}

function setStore<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Intercept routing logic
export function initMockDatabase() {
  if (window.__ROBO_MOCK_INITIALIZED__) return;
  window.__ROBO_MOCK_INITIALIZED__ = true;

  // Initialize store databases if empty
  const getRobots = () => getStore<Robot[]>('mock_robots', initialRobots);
  const setRobots = (r: Robot[]) => setStore('mock_robots', r);

  const getUsers = () => getStore<User[]>('mock_users', initialUsers);
  const setUsers = (u: User[]) => setStore('mock_users', u);

  const getChats = () => getStore<any[]>('mock_chats', []);
  const setChats = (c: any[]) => setStore('mock_chats', c);

  const getOrders = () => getStore<any[]>('mock_orders', []);
  const setOrders = (o: any[]) => setStore('mock_orders', o);

  // Auto-detect server availability on startup
  fetch('/api/robots?status=all')
    .then(res => {
      // If server returns an HTML index block (Vercel SPA fallback) or 404/500, we use mock mode
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('json')) {
        console.warn("⚠️ RoboMarket Server returned non-JSON/error. Switching to fully autonomous client-side Simulation/LocalStorage mode.");
        window.__ROBO_USE_MOCK__ = true;
      } else {
        console.log("✅ RoboMarket express API backend is alive. Using standard live server routes.");
        window.__ROBO_USE_MOCK__ = false;
      }
    })
    .catch(() => {
      console.warn("⚠️ RoboMarket server unreachable. Switching to fully autonomous client-side Simulation/LocalStorage mode.");
      window.__ROBO_USE_MOCK__ = true;
    });

  // Preserve reference to native fetch
  const nativeFetch = window.fetch;

  const customFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    // If not an API route or if mock is disabled, pass directly to real fetch
    if (!urlStr.includes('/api/') || window.__ROBO_USE_MOCK__ === false) {
      try {
        const res = await nativeFetch(input, init);
        // If it's a 404 or Vercel HTML fallback, and we are on vercel.app, trigger automatic hot-swap
        const contentType = res.headers.get('content-type') || '';
        if ((res.status === 404 || contentType.includes('html')) && window.location.hostname.includes('vercel.app')) {
          console.warn("⚠️ Detected serverless routing failure on Vercel. Auto-triggering hot-swap to LocalStorage Database Mode.");
          window.__ROBO_USE_MOCK__ = true;
          // Retry the request through the mock router below
        } else {
          return res;
        }
      } catch (err) {
        if (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('localhost') || true) {
          console.warn("⚠️ Connection failed. Redirecting request to LocalStorage DB.");
          window.__ROBO_USE_MOCK__ = true;
          // Fall through to mock router
        } else {
          throw err;
        }
      }
    }

    // --- CLIENT-SIDE MOCK ROUTER (Runs completely browser-side) ---
    const method = (init?.method || 'GET').toUpperCase();
    const bodyObj = init?.body ? JSON.parse(init.body as string) : null;
    
    console.log(`[Mock DB Intercept] ${method} -> ${urlStr}`, bodyObj);

    // Dynamic responses generator helper
    const createJSONResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    // 1. Authentication Nodes
    if (urlStr.includes('/api/auth/me')) {
      const authHeader = init?.headers ? (init.headers as any)['Authorization'] : null;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return createJSONResponse({ error: 'Unauthorized access' }, 401);
      }
      const token = authHeader.split(' ')[1];
      const userId = token.replace('jwt_mock_token_', '');
      const user = getUsers().find(u => u.id === userId);
      if (!user) {
        return createJSONResponse({ error: 'Session expired' }, 401);
      }
      return createJSONResponse({ user });
    }

    if (urlStr.includes('/api/auth/register')) {
      const { email, username, password } = bodyObj || {};
      const users = getUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return createJSONResponse({ error: 'Email already registered' }, 400);
      }
      const newUser: User = {
        id: "u_" + Date.now(),
        email,
        username,
        role: "user",
        rating: 5,
        ratingCount: 0,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        createdAt: new Date().toISOString()
      };
      setUsers([...users, newUser]);
      return createJSONResponse({ user: newUser, token: "jwt_mock_token_" + newUser.id });
    }

    if (urlStr.includes('/api/auth/login')) {
      const { email, password } = bodyObj || {};
      const users = getUsers();
      let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // Auto-create to mimic dynamic sandbox experience
      if (!user) {
        const username = email.split('@')[0] || "User" + Math.floor(Math.random() * 1000);
        user = {
          id: "u_" + Date.now(),
          email,
          username,
          role: email.includes('admin') ? "admin" : "user",
          rating: 5,
          ratingCount: 0,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
          createdAt: new Date().toISOString()
        };
        setUsers([...users, user]);
      }
      return createJSONResponse({ user, token: "jwt_mock_token_" + user.id });
    }

    // 2. Robots Catalog Nodes
    if (urlStr.includes('/api/robots')) {
      // POST review
      if (method === 'POST' && urlStr.match(/\/api\/robots\/([^\/]+)\/reviews/)) {
        const match = urlStr.match(/\/api\/robots\/([^\/]+)\/reviews/);
        const robotId = match ? match[1] : '';
        const { rating, comment, userId, username } = bodyObj || {};
        
        const robots = getRobots();
        const robotIndex = robots.findIndex(r => r.id === robotId);
        if (robotIndex !== -1) {
          const newReview = {
            id: "rev_" + Date.now(),
            robotId,
            userId,
            username,
            rating: Number(rating),
            comment,
            createdAt: new Date().toISOString()
          };
          robots[robotIndex].reviews = robots[robotIndex].reviews || [];
          robots[robotIndex].reviews.push(newReview);
          
          // Recompute average rating
          const totalRating = robots[robotIndex].reviews.reduce((sum, r) => sum + r.rating, 0);
          robots[robotIndex].rating = Number((totalRating / robots[robotIndex].reviews.length).toFixed(1));
          
          setRobots(robots);
          return createJSONResponse({ success: true, review: newReview });
        }
        return createJSONResponse({ error: 'Robot not found' }, 404);
      }

      // Add a listing
      if (method === 'POST') {
        const robots = getRobots();
        const newRobot: Robot = {
          id: "r_" + Date.now(),
          ...bodyObj,
          status: bodyObj.status || 'pending',
          rating: 5,
          reviews: [],
          createdAt: new Date().toISOString()
        };
        setRobots([...robots, newRobot]);
        return createJSONResponse({ success: true, robot: newRobot });
      }

      // GET listings
      const robots = getRobots();
      return createJSONResponse(robots);
    }

    // 3. Admin Permissions Panel
    if (urlStr.includes('/api/admin/listings/')) {
      const match = urlStr.match(/\/api\/admin\/listings\/([^\/]+)/);
      const robotId = match ? match[1] : '';
      const { status } = bodyObj || {};
      
      const robots = getRobots();
      const idx = robots.findIndex(r => r.id === robotId);
      if (idx !== -1) {
        robots[idx].status = status;
        setRobots(robots);
        return createJSONResponse({ success: true });
      }
      return createJSONResponse({ error: 'Robot listing node not found' }, 404);
    }

    // 4. Transaction Orders
    if (urlStr.includes('/api/orders')) {
      // Create Order
      if (method === 'POST') {
        const orders = getOrders();
        const newOrder = {
          id: "ord_" + Date.now(),
          ...bodyObj,
          trackingNumber: "TRK-" + Math.floor(Math.random() * 9000000 + 1000000),
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        setOrders([...orders, newOrder]);
        return createJSONResponse({ success: true, order: newOrder });
      }

      // Get Orders
      const url = new URL(urlStr, window.location.origin);
      const userId = url.searchParams.get('userId');
      const orders = getOrders();
      const filtered = userId 
        ? orders.filter(o => o.buyerId === userId || o.sellerId === userId)
        : orders;
      return createJSONResponse(filtered);
    }

    // Order status tracking node
    if (urlStr.match(/\/api\/orders\/([^\/]+)\/status/)) {
      const match = urlStr.match(/\/api\/orders\/([^\/]+)\/status/);
      const orderId = match ? match[1] : '';
      const { status } = bodyObj || {};
      
      const orders = getOrders();
      const idx = orders.findIndex(o => o.id === orderId);
      if (idx !== -1) {
        orders[idx].status = status;
        setOrders(orders);
        return createJSONResponse({ success: true, order: orders[idx] });
      }
      return createJSONResponse({ error: 'Order reference not found' }, 404);
    }

    // 5. Communications Chat Module
    if (urlStr.includes('/api/chats')) {
      // Append Messages
      if (method === 'POST' && urlStr.match(/\/api\/chats\/([^\/]+)\/messages/)) {
        const match = urlStr.match(/\/api\/chats\/([^\/]+)\/messages/);
        const threadId = match ? match[1] : '';
        const { senderId, senderName, content, text } = bodyObj || {};
        
        const chats = getChats();
        const threadIdx = chats.findIndex(c => c.id === threadId);
        if (threadIdx !== -1) {
          const newMessage = {
            id: "msg_" + Date.now(),
            senderId,
            senderName,
            content: content || text || "",
            createdAt: new Date().toISOString()
          };
          chats[threadIdx].messages = chats[threadIdx].messages || [];
          chats[threadIdx].messages.push(newMessage);
          setChats(chats);

          // Simulated Merchant Response Loop (Adds real-time feel to static sandbox!)
          const thread = chats[threadIdx];
          const isUserChattingWithAdmin = thread.sellerId === 'admin';
          if (senderId !== thread.sellerId) {
            setTimeout(() => {
              const replyChats = getChats();
              const replyIdx = replyChats.findIndex(c => c.id === threadId);
              if (replyIdx !== -1) {
                const replyText = isUserChattingWithAdmin
                  ? `Hello ${senderName}! Our automated quality bureau has registered your specification query regarding the "${thread.robotName || 'Hardware Unit'}". A procurement officer will approve shipment logistics shortly. Is there any particular parameter you want to review?`
                  : `Greetings from ${thread.sellerName}! Thank you for your interest in the "${thread.robotName}". The listing is fully calibrated and ready for transit. Feel free to complete checkout, and I will dispatch logistics immediately!`;
                
                const sellerReply = {
                  id: "msg_" + (Date.now() + 100),
                  senderId: thread.sellerId,
                  senderName: thread.sellerName,
                  content: replyText,
                  createdAt: new Date().toISOString()
                };
                replyChats[replyIdx].messages.push(sellerReply);
                setChats(replyChats);
                // Dispatch event to update the state in-place
                window.dispatchEvent(new CustomEvent('robo_new_message', { detail: { threadId } }));
              }
            }, 1500);
          }

          return createJSONResponse(newMessage);
        }
        return createJSONResponse({ error: 'Chat thread not found' }, 404);
      }

      // Fetch Thread Messages
      if (method === 'GET' && urlStr.match(/\/api\/chats\/([^\/]+)\/messages/)) {
        const match = urlStr.match(/\/api\/chats\/([^\/]+)\/messages/);
        const threadId = match ? match[1] : '';
        const thread = getChats().find(c => c.id === threadId);
        return createJSONResponse(thread?.messages || []);
      }

      // Create or Fetch Thread
      if (method === 'POST') {
        const { buyerId, buyerName, sellerId, sellerName, robotId, robotName } = bodyObj || {};
        const chats = getChats();
        let thread = chats.find(c => c.buyerId === buyerId && c.robotId === robotId);
        if (!thread) {
          thread = {
            id: "ch_" + Date.now(),
            buyerId,
            buyerName,
            sellerId,
            sellerName,
            robotId,
            robotName,
            messages: [
              {
                id: "msg_init",
                senderId: sellerId,
                senderName: sellerName,
                content: `Negotiation node active. Let's discuss specifications, delivery, or custom software integration presets for "${robotName}".`,
                createdAt: new Date().toISOString()
              }
            ],
            createdAt: new Date().toISOString()
          };
          setChats([...chats, thread]);
        }
        return createJSONResponse(thread);
      }

      // Get user threads list
      const url = new URL(urlStr, window.location.origin);
      const userId = url.searchParams.get('userId');
      const chats = getChats();
      const filtered = userId 
        ? chats.filter(c => c.buyerId === userId || c.sellerId === userId)
        : chats;
      return createJSONResponse(filtered);
    }

    // 6. COGNITIVE AI ROUTINES (Fallback Gemini AI Simulations)
    if (urlStr.includes('/api/ai/status')) {
      return createJSONResponse({ hasGeminiKey: true });
    }

    if (urlStr.includes('/api/ai/chat')) {
      const { messages } = bodyObj || {};
      const lastMsg = messages?.[messages.length - 1]?.content || '';
      const promptLower = lastMsg.toLowerCase();

      // Dynamic AI Advisor Consultation Simulation
      let aiResponseText = `I have logged your specification query. As your RoboMarket AI Consultant, I am analyzing our active catalog floor to match your engineering and payload bounds.\n\n`;

      if (promptLower.includes('humanoid') || promptLower.includes('bipedal') || promptLower.includes('hume')) {
        aiResponseText += `🤖 **Hume-X2 Humanoid Assistant** ($75,000) is highly recommended for your operational scenario. Developed by *Hume Dynamics*, it features 24 Degrees of Freedom, 8 hours of battery power, and runs HumeCore Linux v4. It's ideally matched for human-centric service navigation.`;
      } else if (promptLower.includes('industrial') || promptLower.includes('arm') || promptLower.includes('axis') || promptLower.includes('weld')) {
        aiResponseText += `⚙️ **Apex-V1 Industrial Arm** ($45,000) is perfectly matched for precise engineering workflows. It operates on AC 220V power and handles a 15kg payload with high-torque brushless motors. Perfect for automated welding and micro-assembly tasks.`;
      } else if (promptLower.includes('medical') || promptLower.includes('hospital') || promptLower.includes('sterile') || promptLower.includes('pharmacy')) {
        aiResponseText += `🏥 **MedBot Care-Plus** ($28,000) features autonomous corridor pathing, sterilized payload holds, and a 12-hour continuous battery cycle. Enforced by *MedTech Automation*, this model handles patients' charts and critical tool transport smoothly.`;
      } else if (promptLower.includes('drone') || promptLower.includes('fly') || promptLower.includes('agri') || promptLower.includes('field')) {
        aiResponseText += `🛸 **AgriCulti-6 Surveying Drone** ($12,500) excels in multi-spectral field mapping and aerial spraying. It supports a 25kg lift load with its 6 carbon rotors and features specialized custom flight controllers.`;
      } else if (promptLower.includes('security') || promptLower.includes('outdoor') || promptLower.includes('guard')) {
        aiResponseText += `🛡️ **Aegis Guardian-IV Security Platform** ($18,900) is ideal for terrestrial tracking. Features night-vision thermal scanners, active LIDAR telemetry, and weatherized deep-tread tires.`;
      } else {
        aiResponseText += `Currently, our catalog floor has high-fidelity active nodes across **Industrial, Humanoid, Medical, Agricultural, and Security** categories.\n\nCould you specify your ideal **payload capacity (kg)**, **budget constraints**, or **power requirements**? This will help me narrow down our certified hardware solutions.`;
      }

      // Add warning or refusal for off-topic non-robotic chat (matches prompt instructions)
      if (promptLower.includes('recipe') || promptLower.includes('cook') || promptLower.includes('song') || promptLower.includes('sing') || promptLower.includes('game')) {
        aiResponseText = `⚠️ **System Policy Restriction**: As the RoboMarket AI Advisor, my core system instructions restrict my conversational scope strictly to autonomous hardware platforms, industrial engineering specs, and catalog navigation. I cannot assist with non-robotic queries. Let's redirect back to your robotic hardware needs!`;
      }

      return createJSONResponse({ response: aiResponseText });
    }

    if (urlStr.includes('/api/ai/search')) {
      const { query } = bodyObj || {};
      const qLower = (query || '').toLowerCase();
      const robots = getRobots();
      
      // Perform semantic lookup matching categories or keywords
      const matched = robots.filter(r => 
        r.name.toLowerCase().includes(qLower) ||
        r.category.toLowerCase().includes(qLower) ||
        r.description.toLowerCase().includes(qLower)
      );

      const responseText = matched.length > 0
        ? `Found **${matched.length} units** matching your physical catalog parameters. I recommend analyzing the physical spec matrix side-by-side.`
        : `No direct keywords match your loose query. However, based on general payload and operating systems, our industrial automation catalog has certified platforms ready to service your query.`;

      return createJSONResponse({
        matches: matched.map(m => m.id),
        explanation: responseText
      });
    }

    if (urlStr.includes('/api/ai/analyze-listing') || urlStr.includes('/api/ai/analyze')) {
      // Retrieve the robot parameters being audited
      const robot = bodyObj?.robot || bodyObj || {};
      const price = Number(robot.price || 0);
      const name = robot.name || 'Custom Hardware Listing';
      const category = robot.category || 'General Automation';

      let qualityScore = 88;
      let verdict = 'Excellent';
      const suspiciousFlags = [];
      const pros = ["High durability chassis", "Excellent dollar-to-payload performance"];
      const cons = ["High energy consumption profile"];

      // Simulated realistic specification validation loops!
      if (price < 1000) {
        qualityScore = 45;
        verdict = 'Suspicious';
        suspiciousFlags.push("Pricing index is extremely low for high-capacity robotic components.");
        cons.push("Unusually low price suggests salvaged parts or incomplete warranty terms.");
      } else if (price > 100000) {
        pros.push("Certified premium industrial-grade support tier");
        cons.push("Substantial capital investment required");
      }

      if (robot.description?.length < 30) {
        qualityScore -= 15;
        suspiciousFlags.push("Insufficient specification description provided by merchant node.");
      }

      return createJSONResponse({
        qualityScore: Math.max(10, Math.min(100, qualityScore)),
        summary: `Quality assurance audit completed successfully for system node "${name}" listed under class "${category}".`,
        pros,
        cons,
        suspiciousFlags: suspiciousFlags.length > 0 ? suspiciousFlags : ["No critical specifications inconsistencies flagged in safety audit."],
        verdict
      });
    }

    // Default fallback 404 for unrecognized mock endpoints
    return createJSONResponse({ error: `Mock endpoint path unrecognized: ${urlStr}` }, 404);
  };

  // Safe patch of window.fetch using Object.defineProperty to bypass strict setter constraints
  try {
    Object.defineProperty(window, 'fetch', {
      value: customFetch,
      writable: true,
      configurable: true,
      enumerable: true
    });
    console.log("🌟 Successfully registered secure shadowing for window.fetch API interception.");
  } catch (err) {
    console.warn("⚠️ Failed defining window.fetch via Object.defineProperty. Trying direct override as fallback:", err);
    try {
      window.fetch = customFetch;
    } catch (directErr) {
      console.error("❌ Critical: Failed standard global fetch interception bypass entirely:", directErr);
    }
  }

}
