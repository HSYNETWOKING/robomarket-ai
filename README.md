# RoboMarket AI — Next-Gen Cognitive Autonomous Hardware Marketplace & Web3 SaaS Ecosystem

---
Hassan Shahbaz, ACT AI, University of Education
https://robomarket-ai-vjiu.vercel.app/
- **🖥️ Video URL:** https://drive.google.com/drive/folders/1XtP_ohsJtnvpV6SeKOklliNQ9Hr8sLj1
## 1. Executive Summary & SaaS Architecture Paradigm

### Project Title
**RoboMarket AI**

### Project Tagline
*An Enterprise SaaS & Web3 Ecosystem for Autonomous Hardware Procurements, AI-Audited Security Diagnostics, Multi-Provider BYOK Key Management, and Decentralized Escrow Transactions.*

### Platform Overview
In the rapidly growing robotics and hardware automation industry, procuring industrial platforms (humanoid bipedal systems, 6-axis robotic arms, agricultural rovers, clinical delivery units) suffers from high capital risk, specification opacity, and lack of real-time technical verification.

**RoboMarket AI** resolves this challenge with an enterprise-grade SaaS marketplace platform integrated with **Google Gemini AI**, **Multi-Provider BYOK Key Vault**, **Web3 Wallet Payments**, **Decentralized Escrow Architecture**, and **Server-Side RBAC & Security Safeguards**.

```
+------------------------------------------------------------------------+
|                            ROBOMARKET AI                               |
|        Full-Stack Enterprise SaaS & Web3 Autonomous Marketplace        |
+-----------------------------------+------------------------------------+
|             CLIENT APP            |           SERVER GATEWAY           |
|  - React 18 SPA & Vite Engine     |  - Express JS Runtime & Security   |
|  - Tailwind Responsive Design     |  - Bcrypt Password Hashing & RBAC  |
|  - Lucide Icons & Motion          |  - Bearer Token Auth Middleware    |
+-----------------+-----------------+-----------------+------------------+
                  |                                   |
                  v                                   v
+-----------------------------------+------------------------------------+
|            AI & BYOK              |           WEB3 & SAAS              |
|  - Google Gemini @google/genai    |  - Multi-Wallet Connectors         |
|  - OpenAI, Claude, Grok, DeepSeek |  - Crypto Payment & Escrow Gateway |
|  - Client BYOK Key Vault          |  - SaaS Tier Matrix & Token Packs  |
|  - AI Advisor & Security Auditor  |  - Multi-Role Admin Workspace      |
+-----------------------------------+------------------------------------+
```

---

## 2. Platform Security, RBAC & Architectural Audit Summary

RoboMarket AI was subjected to a comprehensive multi-phase security and usability audit and upgraded with production-grade backend safeguards:

### Phase 1: Critical Security & Authentication
- **Server-Side Authentication Middleware (`authenticateToken`):** Mandated Bearer token authentication on all protected REST endpoints (`/api/auth/me`, `/api/robots` POST, `/api/orders` GET/POST/PUT, `/api/chats` GET/POST, `/api/admin/*`).
- **Server-Side Role-Based Access Control (`requireRole`):** Enforced strict role authorization on `/api/admin/*` routes for `admin` and `manager` roles. Managers are strictly forbidden from modifying user roles to Admin or issuing permanent bans.
- **Bcrypt Password Hashing:** Replaced legacy plaintext passwords with `bcryptjs` salted hashes (10 rounds) across user registration, password updates, and seeded demo credentials (`admin@robomarket.ai`, `manager@robomarket.ai`, `user@robomarket.ai`).
- **Password Strength Validation:** Enforced password complexity rules, rejecting empty or weak (<6 character) passwords during registration and authentication.
- **Sanitized Password Outputs:** Omitted password fields from all server responses (`/api/auth/me`, `/api/auth/login`, `/api/auth/register`, `/api/admin/users`).

### Phase 2: Routing & Cross-Tab Session Synchronization
- **Browser History Support:** Integrated `popstate` event handling to align application active tabs with browser back/forward navigation and URL paths (`/marketplace`, `/dashboard`, `/admin`, `/compare`, etc.).
- **Cross-Tab Session Sync:** Added `storage` event listeners for `robo_user` and `robo_token` to instantly sync login/logout state and role changes across open browser tabs.
- **Role Revalidation on Focus:** Implemented automatic `/api/auth/me` background verification on window focus to immediately catch server-side role updates.
- **Listing Creation Redirect:** Automatically redirects users to the "My Hardware Listings" view immediately upon submitting a new hardware listing.

### Phase 3: Dashboard Integrity & Destructive Action Protections
- **Inventory Sync:** Re-fetches fresh hardware inventory and listings after order creation, status changes, or admin approvals/rejections.
- **Confirmation Dialogs:** Added `window.confirm` safety prompts before high-impact destructive actions (role elevation, account suspension/ban, listing rejection).

### Phase 4: Mobile UI & Z-Index Polish
- **Body Scroll Lock:** Implemented `document.body.style.overflow = 'hidden'` when the mobile navigation drawer is active to prevent unwanted background page scrolling.
- **Responsive Table Containers:** Standardized all data tables (Admin Users, Orders, Hardware Listings, Wallet Payments) inside responsive horizontal scrolling containers (`overflow-x-auto`).
- **Layering & Z-Index Hierarchy:** Resolved overlay conflicts between floating alerts, sticky headers (`z-40`), and mobile drawers (`z-50`).

---

## 3. Platform Features & Operations Matrix

| Module | Core Capability | User Benefit | Technical Implementation |
| :--- | :--- | :--- | :--- |
| **Marketplace Catalog** | **Floor Division Views** | Targeted navigation through Industrial, Humanoid, Medical, Agricultural, and Security categories. | High-performance client-side category grouping & live state filters. |
| **BYOK API Vault** | **Bring Your Own Key** | Support for Gemini, OpenAI, Claude, Grok, DeepSeek, & Mistral to bypass rate limits. | Client-side encrypted storage vault with live ping tests & provider toggles. |
| **Web3 Wallet Connect** | **Multi-Chain Connectors** | Seamless connection with MetaMask, Rabby Wallet, WalletConnect, Coinbase Wallet, & Phantom. | Web3 provider modal with network toggles and address management. |
| **Crypto Payments** | **Multi-Chain Escrow** | Pay for hardware, subscriptions, or credit packs in ETH, USDT, USDC, SOL, MATIC, or BNB. | Interactive crypto checkout modal with gas estimation, block hashes, & receipts. |
| **SaaS Subscriptions** | **Tiered Access Matrix** | Free Explorer, Pro Contractor ($29/mo), and Enterprise Fleet ($199/mo) plans + Token Packs. | Feature comparison table with upgrade triggers and Web3 payment options. |
| **AI Security Audit** | **Automated Listing Scan** | Evaluates price logic, spec consistency, and generates authenticity index scores. | Server-side Gemini API analysis with local intelligent fallback. |
| **Specification Compare**| **Side-by-Side Floor** | Parameter-by-parameter alignment with AI-generated trade-off synthesis reports. | Comparative spec table with natural language Gemini trade-off explainer. |
| **Staff Admin Panel** | **Merchant Quality Board** | Inspect, audit, approve, or reject new merchant listing submissions with RBAC permissions. | Admin workspace with GTV metrics, user role management, and approval queues. |

---

## 4. Supported AI Providers & BYOK Architecture

### Multi-Provider API Key Vault
RoboMarket AI features a privacy-centric **Bring Your Own Key (BYOK)** architecture in `/src/components/ApiKeyVault.tsx`:

#### Supported Providers
1. **Google Gemini AI:** Gemini 3.6 Flash, Gemini 3.1 Pro (`AIzaSy...`)
2. **OpenAI:** GPT-4o, GPT-4o mini, o3-mini (`sk-proj-...`)
3. **Anthropic:** Claude 3.5 Sonnet, Claude 3 Opus (`sk-ant-...`)
4. **xAI:** Grok 2, Grok Vision (`xai-...`)
5. **DeepSeek:** DeepSeek R1, DeepSeek V3 (`sk-ds-...`)
6. **Mistral AI:** Mistral Large, Codestral (`mis-...`)

---

## 5. Directory & Project Structure

```
.
├── .env.example              # Environment variable declaration template
├── package.json              # Applet dependencies, dev, build, and start scripts
├── server.ts                 # Express JS backend with Bcrypt auth, RBAC, REST APIs, & Gemini
├── vite.config.ts            # Vite configuration for React & Tailwind CSS
├── tsconfig.json             # TypeScript compiler settings
├── data/                     # Persistent JSON database directory
│   ├── users.json            # User profile data & bcrypt password hashes
│   ├── robots.json           # Hardware marketplace listings
│   ├── chats.json            # Buyer-Seller message threads
│   └── orders.json           # Order & tracking records
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Main container component, popstate routing & session sync
│   ├── types.ts              # Global TypeScript interfaces & data models
│   ├── index.css             # Tailwind CSS entry imports & custom styles
│   └── components/
│       ├── AIAssistant.tsx        # Interactive AI Advisor & Chat-based checkout
│       ├── ApiKeyVault.tsx        # BYOK API key management & validation
│       ├── ChatComponent.tsx      # Buyer-Seller splitscreen inbox
│       ├── CompareRobots.tsx      # Side-by-side hardware spec comparison
│       ├── CryptoPaymentModal.tsx # Web3 checkout & escrow transaction modal
│       ├── Dashboards.tsx         # User & Admin management portals with confirmation dialogs
│       ├── Header.tsx             # Responsive header navigation & mobile scroll lock
│       ├── LandingPage.tsx        # Hero banner & catalog overview
│       ├── Marketplace.tsx        # Catalog filters & natural language AI search
│       ├── PricingMatrix.tsx      # SaaS subscription tier & credit pack plans
│       ├── RobotCard.tsx          # Listing card component
│       ├── RobotDetails.tsx       # Listing details view with AI Security Audit
│       ├── SellRobot.tsx          # Merchant hardware listing creation form
│       ├── StaticPages.tsx        # About, Terms, and Privacy documentation
│       ├── WalletPaymentsHistory.tsx # Web3 transaction log & receipt viewer
│       └── Web3WalletModal.tsx    # Wallet selection & network selector modal
```

---

## 6. Local Installation & Development Setup

### Prerequisites
- **Node.js:** Version 18.0.0 or higher
- **npm:** Package manager (included with Node.js)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd robomarket-ai
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure variables are populated:
```env
# Port Configuration
PORT=3000
NODE_ENV=development

# Google Gemini API Key (Optional if using BYOK in UI)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 7. Demo Credentials & RBAC Accounts

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@robomarket.ai` | `password123` | Full administrative control: Manage users, promote/demote roles, approve/reject listings, view system analytics. |
| **Manager** | `manager@robomarket.ai` | `password123` | Operational management: Approve/reject listings, view user lists, temporarily suspend accounts (cannot assign Admin role or issue permanent bans). |
| **User / Merchant** | `user@robomarket.ai` | `password123` | Standard account: Browse hardware, post listings (pending approval), place orders, chat with sellers. |

---

## 8. Quality Assurance & Audit Verification

- [x] **Authentication Security:** Bearer token authentication enforced on all protected endpoints.
- [x] **RBAC Controls:** Server-side authorization blocks non-admins from sensitive management APIs.
- [x] **Bcrypt Password Storage:** All passwords stored as bcrypt hashes with zero plain-text leaks in API responses.
- [x] **Routing & Sync:** Browser back/forward history and cross-tab session syncing verified.
- [x] **Mobile UX:** Mobile navigation drawer body scroll lock and overflow scrolling tables verified across screen sizes.
- [x] **Type Safety & Build:** Clean TypeScript compilation with zero errors (`tsc --noEmit`) and successful production bundle compilation.
