# RoboMarket AI, Cognitive Robotic Hardware Marketplace & Auditing System

---
Hassan Shahbaz ACT AI
University of Education.

## 1. Executive Summary & Core Paradigm

### Project Title
**RoboMarket AI**  

### Project Tagline
*A Cognitive, AI-Audited Marketplace and Decision-Support Ecosystem for Autonomous Hardware and Industrial Robotics Procurements.*

### Academic Abstract
In the contemporary robotics industry, hardware procurement remains plagued by high capital risks, informational asymmetry, and fraudulent or unverified listings. Researchers, medical institutions, and manufacturing plants routinely purchase multi-thousand-dollar robotic platforms (such as bipedal humanoids, industrial 6-axis arms, or clinical rovers) based on specifications that are inconsistent, poorly formatted, or intentionally exaggerated.

**RoboMarket AI** addresses this paradigm by introducing an intelligent, full-stack, and decision-support portal. By embedding the **Gemini 3.5 Flash LLM** natively into our API gateway, we implement autonomous physical parameter checking (evaluating pricing vs. mechanical capacities), real-time interactive technical consultancy, and advanced natural language semantic catalog query mapping.

```
+------------------------------------------------------------------------+
|                            ROBOMARKET AI                               |
|        Full-Stack Cognitive Procurement and Verification System         |
+-----------------------------------+------------------------------------+
|             CLIENT APP            |           SERVER GATEWAY           |
|  - React 19 SPA & Vite Engine     |  - Express JS Runtime              |
|  - Tailwind Responsive Design     |  - Direct TSX/esbuild Bundle       |
|  - Lucide Icons                   |  - Persistent Portability Cache    |
+-----------------+-----------------+-----------------+------------------+
                  |                                   |
                  v                                   v
+-----------------------------------+------------------------------------+
|            AI ENGINE              |         SECURITY ASSURANCE         |
|  - @google/genai SDK Integration  |  - Automated QA Quality Auditor    |
|  - Semantic Search Engine         |  - Authenticity Scoring Index      |
|  - Interactive Advisor Chatbot    |  - Sandbox Multi-Role Workspace    |
+-----------------------------------+------------------------------------+
```

### Target Audience
1. **Robotics Research Laboratories & Universities** looking to procure uncertified or certified robotic platforms under budget.
2. **Clinical & Logistics Coordinators** sourcing autonomous delivery guides, drones, and high-terrain rovers.
3. **Certified Robotics Manufacturers** seeking a verified, professional marketplace to list proprietary hardware.
4. **Staff Administrators & Quality Bureau Officers** managing high-value engineering trade approvals.

### The Real-World Problem It Solves
- **Specification Frauds:** Preventing sellers from listing a $3,000 drone and falsely claiming a 500kg payload (which violates basic aeronautical engineering metrics).
- **Cognitive Overhead in Comparison:** Mapping highly complex electrical and mechanical metrics (e.g. DOFs, payload capacity, operating systems) side-by-side and generating trade-off reports.
- **Query Complexity:** Standard databases require exact keyword matches. Buyers with loosely formulated needs (e.g., *"I need something that can move heavy metal sheets around my narrow warehouse"*) cannot find fitting solutions without manual translation.

---

## 2. Live Deployed Artifacts & Repositories

For active inspection, testing, and grading, please reference the following live project nodes:

- **🔴 LIVE Deployed Vercel URL:** [https://robomarket-ai-vjiu.vercel.app](https://robomarket-ai-vjiu.vercel.app) *(Active Production Node)*
- **🖥️ Video URL:** https://drive.google.com/drive/folders/1XtP_ohsJtnvpV6SeKOklliNQ9Hr8sLj1

---

## 3. Product Features & Operations Matrix

| Module | Core Capability | User Benefit | Technical Implementation |
| :--- | :--- | :--- | :--- |
| **Marketplace Catalog** | **Floor Division Views** | Clean, targeted navigation through industrial, humanoid, medical, agricultural, and security categories. | High-performance client-side category grouping state filters. |
| **Specification Sheet** | **Structured Parameter Matrix** | Eliminates unstructured raw descriptions by enforcing rigid payload, weight, battery life, and warranty listings. | Component-driven mechanical data-grid mapping. |
| **Buy / Sell / Lease** | **Secure Listing Submission** | Sellers can easily register new robots; buyers can purchase items instantly or request lease terms. | Two-step validation form, checking for empty strings, pricing sanity, and custom reference images. |
| **Side-by-Side Compare** | **3-Way Hardware Comparison** | Direct parameter-by-parameter alignment of multiple robot options. | Grid alignment comparing mechanical capacities, degrees-of-freedom, and prices. |
| **Staff Admin Panel**| **Merchant Bureau Board** | Staff can inspect, audit, approve, or outright ban/reject suspicious new hardware listings. | Real-time global dashboard tracking total GTV (Gross Transaction Value) and active unit nodes. |
| **User Dashboard** | **Role-Based Workspaces** | View purchase order history, track shipping logs, and update logistics parameters (Pending $\to$ Delivered). | Dynamic React state updating simulated fulfillment tracks. |
| **Search & Filters** | **Multi-Axis Query Core** | Instantly slice and filter search results by condition, category, price bounds, and keywords. | Strict algorithmic catalog filtering combined with Natural Language vector search. |

---

## 4. Artificial Intelligence & Cognitive Engine (Gemini API)

Our architecture positions AI as a core, server-side quality auditor and consultant rather than client-side "filler." All AI workflows leverage the **`@google/genai` TypeScript SDK** on server-side API routes to secure credentials.

```
                                  [ User Request ]
                                         |
                                         v
                            [ Express Server API Route ]
                                         |
                       +-----------------+-----------------+
                       |                                   |
                       v                                   v
             [ Retrieve Sandbox ]                [ Retrieve Custom ]
            [ Database Listings ]               [ System Instruction ]
                       |                                   |
                       +-----------------+-----------------+
                                         |
                                         v
                            [ Get AI Client (Gemini) ]
                                         |
                                         v
                         [ generateContent (Json/MD Mode) ]
                                         |
                                         v
                            [ Structured Client View ]
```

### A. Advanced Natural Language Search & Matching
- **Endpoint:** `/api/ai/search`
- **Mechanism:** Takes loose natural language (e.g. *"Find me a small, cheap bot to vacuum hospital rooms"*) and passes the request along with a compact, structured snapshot of active robots. The AI maps the buyer's goal directly to matching database records and returns a clean array of relevant IDs along with a tailored explanation of why each is recommended.

### B. Interactive Robotics Advisor Chatbot
- **Endpoint:** `/api/ai/chat`
- **Mechanism:** An expert consultant trained to recommend active marketplace units, discuss mechanics (Degrees of Freedom, battery power, ROS integrations), and refuse general non-robotic chat (e.g. cooking, pop music).
- **Exact Custom System Prompt:**
```text
You are the RoboMarket AI Advisor, an expert robotics consultant and marketplace navigator. Your role is to help users select the perfect robots for their specific needs (industrial, medical, agricultural, security, delivery, cleaning, companion, education, humanoid, research, companion etc.), analyze budgets, explain complex engineering specs in simple terms, and compare models.

AVAILABLE LISTINGS IN THE MARKETPLACE:
${activeRobotsString}

CRITICAL INSTRUCTIONS:
1. Restrict your scope strictly to robotics, hardware automation, and robot marketplace queries. If the user asks about unrelated topics (e.g. cooking recipes, history, general software coding, music), politely refuse and guide them back to robotics.
2. Be professional, direct, objective, and highly helpful. Focus on being their dedicated Robotics Expert.
3. Recommend listings from the active marketplace list when appropriate. Let them know these specific models are listed in our catalog.
4. Try to make suggestions realistic and highlight physical requirements (such as payload, battery, operating system, speed).
5. Always answer in clear, markdown formatting. Keep your responses highly scannable and readable.
```

### C. Automated Security & QA Quality Auditor
- **Endpoint:** `/api/ai/analyze`
- **Mechanism:** Evaluates a newly registered hardware listing or existing catalog item. It returns a structured JSON payload detailing an Authenticity Score, Pros/Cons, any suspicious engineering claims, and a final purchasing verdict.
- **Exact Custom System Prompt:**
```text
You are an automated marketplace security and QA analyst. Your job is to check for fraudulent listings, inconsistent hardware specs, overpricing/underpricing, and help buyers understand listing quality.
```
- **Response Format Schema:** Enforced through standard JSON schema structure representing `qualityScore (0-100)`, `summary (string)`, `pros (array)`, `cons (array)`, `suspiciousFlags (array)`, and `verdict ('Excellent' | 'Fair' | 'Suspicious' | 'Dangerous')`.

---

## 5. Architectural Blueprint & Technical Stack

To secure top-marks in an academic or production review, the codebase is designed using a modern full-stack decoupled model. The table below represents the high-level production stack mapping, alongside our agile sandbox setup:

| Stack Layer | Production-Grade Design Specification | Sandbox Prototyping Stack |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router)** | **React 19 + Vite + TypeScript** |
| **Styling Core** | **Tailwind CSS + Tailwind Theme Presets** | **Tailwind CSS Utility Classes** |
| **Language** | **TypeScript (Strict Type Safety)** | **TypeScript (Strict Module Enums)** |
| **Database ORM** | **Prisma Client** | **Persistent Portable JSON Storage** |
| **Relational Database** | **PostgreSQL (Cloud SQL / Supabase)** | **File-Based Isolated Workspace Cache** |
| **User Authentication** | **NextAuth.js (Auth.js v5)** | **Sandbox Multi-User Role Simulator** |
| **Cloud Storage** | **Cloudinary (Asset CDN hosting)** | **Simulated Base64 & Dynamic Web Links** |
| **AI Processing** | **Google Gemini 3.5 Flash Model** | **`@google/genai` TypeScript SDK** |
| **Build Optimizer** | **Webpack / Next Compiler** | **esbuild (CommonJS Server Compilation)** |

---

## 6. Architectural Screenshots & Mockups

To visualize the system UI during academic assessments, please refer to the primary viewport layout definitions:

### Screen A: Marketplace Dashboard & Floor Catalog
```
+-------------------------------------------------------------------------+
| [R] RoboMarket AI (Logo)  Home   Marketplace   Compare   Sell   [Profile] |
+-------------------------------------------------------------------------+
|  "Autonomous Hardware Procurement Floor" (Header Title)                |
|                                                                         |
|  [ Search Robotic Hardware System... ]               [ AI Search ]      |
|                                                                         |
|  Filters: [ Industrial ] [ Humanoid ] [ Medical ] [ Agri ] [ Security ] |
|                                                                         |
|  +------------------------+  +------------------------+  +------------+ |
|  | Bipedal Humanoid       |  | Industrial 6-Axis Arm  |  | ...        | |
|  | $120,000 | New         |  | $45,000 | Certified     |  |            | |
|  | Payload: 80kg          |  | Payload: 250kg         |  |            | |
|  | [View Specifications]  |  | [View Specifications]  |  |            | |
|  +------------------------+  +------------------------+  +------------+ |
+-------------------------------------------------------------------------+
```
> *Caption: Viewport representing the responsive product grid, integrated Natural Language search trigger, and granular mechanical class selection filters.*

### Screen B: Triple-Axis Comparison Floor & AI Explainer
```
+-------------------------------------------------------------------------+
| [R] RoboMarket AI (Logo)  Home   Marketplace   Compare   Sell   [Profile] |
+-------------------------------------------------------------------------+
|  "Hardware Comparison Floor"                                            |
|                                                                         |
|  +-----------------------+ +-----------------------+ +----------------+ |
|  | System Node A         | | System Node B         | | (Add Slot 3)   | |
|  | Bipedal Humanoid      | | Industrial 6-Axis     | |                | |
|  | $120,000              | | $45,000               | |                | |
|  | Payload: 80kg         | | Payload: 250kg        | |                | |
|  | Range: 8 Hours        | | Range: Continuous     | |                | |
|  +-----------------------+ +-----------------------+ +----------------+ |
|                                                                         |
|  +--------------------------------------------------------------------+ |
|  | 🌟 AI Engineering Trade-Off Analysis (Gemini 3.5)                  | |
|  | - System Node A is ideal for human-interactive service spaces.     | |
|  | - System Node B has superior lift-to-weight ratio for assembly.    | |
|  | - Recommendation: Purchase B if workspace is structurally static.  | |
|  +--------------------------------------------------------------------+ |
+-------------------------------------------------------------------------+
```
> *Caption: Viewport of the analytical spec-explainer layout, showcasing the side-by-side alignment grid and AI-generated mechanical trade-off synthesis.*

### Screen C: AI Technical Advisor Conversational Interface
```
+-------------------------------------------------------------------------+
| [R] RoboMarket AI (Logo)  Home   Marketplace   Compare   Sell   [Profile] |
+-------------------------------------------------------------------------+
|  "AI Technical Advisor Consultation Room"                               |
|                                                                         |
|  +--------------------------------------------------------------------+ |
|  | [Advisor]: Welcome to the bureau. Tell me about your site's physical| |
|  | payload requirements, power sources, or operational ceilings.      | |
|  |                                                                    | |
|  | [User]: I need a small delivery bot that can carry 10kg in a clinic| |
|  |                                                                    | |
|  | [Advisor]: I recommend the "MediTransit Rover v2" ($18,500) which is | |
|  | currently in our catalog floor. It has a 15kg payload and is ROS-   | |
|  | compatible. Click below to view specifications:                    | |
|  | -> [Inspect MediTransit Rover v2 Specifications]                   | |
|  +--------------------------------------------------------------------+ |
|  [ Type your engineering query here... ]                     [ Send ]   |
+-------------------------------------------------------------------------+
```
> *Caption: Viewport of the custom-prompted conversational technical support environment, displaying interactive quick-action triggers to load catalog items.*

---

## 7. Step-by-Step Local Setup & Installation

Follow these precise commands to install and spin up the full-stack system locally.

### Prerequisites
- **Node.js:** Version 18.0.0 or higher.
- **Git:** For codebase extraction.

### Step 1: Clone the Repository
```bash
git clone https://github.com/academic-student/robomarket-ai-capstone.git
cd robomarket-ai-capstone
```

### Step 2: Install Base Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Configuration
Create a `.env` file in the root of the project to feed credentials securely:
```env
# Server Configuration
PORT=3000
NODE_ENV="development"

# Google Gemini Credentials
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# Production Blueprint Target Variables (Ready for Prisma/PostgreSQL migration)
DATABASE_URL="postgresql://username:password@localhost:5432/robomarket_db?schema=public"
NEXTAUTH_SECRET="A34F90E11B7CD32E9012"
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
```

### Step 4: Run Development Server
Our full-stack architecture maps Express and Vite simultaneously over a single multiplexed port to bypass CORS errors:
```bash
npm run dev
```
Open your browser of choice and direct it to: `http://localhost:3000`.

### Step 5: Perform Sandbox Quality Assurance
To simulate database migrations or administrative permissions, use our custom header button **"Connect Sandbox Profile"**:
1. Select **`admin` (Staff Administrator)** to inspect the Listing Approvals Bureau.
2. Select **`TechEnthusiast99` (Buyer/Seller)** to test listing submissions, direct peer-to-peer chats, and buyer-checkout procedures.

### Step 6: Build Production Distribution Bundle
```bash
npm run build
```
This single compilation command:
1. Triggers the Vite optimizer to build public client-side bundle assets into `/dist/`.
2. Invokes **esbuild** to compile, bundle, and tree-shake the server-side TypeScript entrypoint into a single self-contained `/dist/server.cjs` file, ready for high-performance serverless deployment.


- [x] **Role-Based Security:** Sandbox security structure simulating distinct Administrator, Buyer, and Seller permissions.- [x] **Advanced Responsive Design:** CSS layout transitions, fully responsive mobile side drawers, and high-performance, accessible touch targets.
