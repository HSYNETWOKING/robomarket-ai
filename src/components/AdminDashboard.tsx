import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, Users, ShoppingBag, Bot, Shield, Bell, HelpCircle, Settings, 
  FileText, Activity, Search, Filter, RefreshCw, Download, UserCheck, UserX, 
  Key, CreditCard, ArrowUpRight, ArrowDownRight, Database, Server, Cpu, 
  Layers, Lock, Mail, Plus, Eye, Check, X, DollarSign, Wallet, Sliders, 
  ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, XCircle, LogOut,
  TrendingUp, MessageSquare, Terminal, ShieldAlert, BadgeCheck, FileSpreadsheet,
  Globe, ShieldCheck, Zap
} from 'lucide-react';
import { User, Robot } from '../types';

interface AdminDashboardProps {
  currentUser: User;
  robots: Robot[];
  onSelectRobot: (id: string) => void;
  onApproveListing: (id: string) => void;
  onRejectListing: (id: string) => void;
  onSwitchToUserProfile?: () => void;
}

// Sub-navigation sections
type AdminSection = 
  | 'overview' 
  | 'analytics' 
  | 'users' 
  | 'orders' 
  | 'ai' 
  | 'marketplace' 
  | 'alerts' 
  | 'support' 
  | 'settings' 
  | 'logs';

// Mock Initial Admin Data Structures
interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'suspended' | 'banned';
  walletAddress: string;
  subscription: 'Enterprise' | 'Pro Tier' | 'Free Starter';
  createdAt: string;
  lastLogin: string;
}

interface AdminOrder {
  id: string;
  buyerName: string;
  buyerEmail: string;
  productName: string;
  price: number;
  paymentMethod: 'Credit Card' | 'ETH' | 'SOL' | 'USDT';
  status: 'pending' | 'completed' | 'processing' | 'refunded';
  txHash?: string;
  date: string;
  trackingNumber: string;
}

interface APILogEntry {
  id: string;
  timestamp: string;
  provider: 'OpenAI' | 'Gemini' | 'Claude' | 'Grok' | 'DeepSeek';
  model: string;
  endpoint: string;
  status: number;
  latencyMs: number;
  tokens: number;
  userEmail: string;
}

interface SupportTicket {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'Billing' | 'Hardware API' | 'BYOK Key' | 'Refund';
  priority: 'High' | 'Medium' | 'Low';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  message: string;
}

interface SystemLogEntry {
  id: string;
  timestamp: string;
  type: 'Login' | 'Audit' | 'Error' | 'Payment';
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  actor: string;
  ipAddress: string;
  details: string;
}

export default function AdminDashboard({
  currentUser,
  robots,
  onSelectRobot,
  onApproveListing,
  onRejectListing,
  onSwitchToUserProfile
}: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isManager = currentUser.role === 'manager';
  const isAdmin = currentUser.role === 'admin';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ----------------------------------------------------
  // INITIAL MOCK DATA STATE
  // ----------------------------------------------------
  const [usersList, setUsersList] = useState<AdminUser[]>([
    { id: 'u-101', username: 'alex_cyber', email: 'alex.cyber@mit.edu', role: 'admin', status: 'active', walletAddress: '0x71C...3921', subscription: 'Enterprise', createdAt: '2025-01-12', lastLogin: '2026-07-26 02:15' },
    { id: 'u-102', username: 'sarah_robotics', email: 'sarah@boston-dynamics.io', role: 'manager', status: 'active', walletAddress: '0x89B...1092', subscription: 'Pro Tier', createdAt: '2025-03-04', lastLogin: '2026-07-25 18:40' },
    { id: 'u-103', username: 'dev_marcus', email: 'marcus@stanford.edu', role: 'user', status: 'active', walletAddress: '0x34A...9821', subscription: 'Free Starter', createdAt: '2025-05-19', lastLogin: '2026-07-26 01:05' },
    { id: 'u-104', username: 'eth_whale99', email: 'whale@crypto.org', role: 'user', status: 'active', walletAddress: '0xF42...8831', subscription: 'Enterprise', createdAt: '2025-06-01', lastLogin: '2026-07-24 14:22' },
    { id: 'u-105', username: 'suspicious_node', email: 'bot_spammer@temp.net', role: 'user', status: 'suspended', walletAddress: '0x000...0000', subscription: 'Free Starter', createdAt: '2026-07-10', lastLogin: '2026-07-11 09:12' },
    { id: 'u-106', username: 'elena_ai', email: 'elena@deepmind-labs.com', role: 'manager', status: 'active', walletAddress: '0x12C...4410', subscription: 'Enterprise', createdAt: '2025-08-22', lastLogin: '2026-07-26 00:30' },
    { id: 'u-107', username: 'malicious_actor', email: 'exploit@darkweb.cc', role: 'user', status: 'banned', walletAddress: '0x999...1111', subscription: 'Free Starter', createdAt: '2026-06-15', lastLogin: '2026-06-16 03:00' }
  ]);

  const [ordersList, setOrdersList] = useState<AdminOrder[]>([
    { id: 'ORD-8821', buyerName: 'alex_cyber', buyerEmail: 'alex.cyber@mit.edu', productName: 'Unitree Go2 Bionic Quadruped', price: 2800, paymentMethod: 'ETH', status: 'completed', txHash: '0x9a8f...3e12', date: '2026-07-25', trackingNumber: 'TRK-9821034' },
    { id: 'ORD-8822', buyerName: 'sarah_robotics', buyerEmail: 'sarah@boston-dynamics.io', productName: 'NVIDIA Jetson Orin AGX 64GB', price: 1999, paymentMethod: 'Credit Card', status: 'processing', date: '2026-07-25', trackingNumber: 'TRK-9821035' },
    { id: 'ORD-8823', buyerName: 'dev_marcus', buyerEmail: 'marcus@stanford.edu', productName: 'KUKA LBR iiwa 7 R800 Arm', price: 14500, paymentMethod: 'USDT', status: 'pending', txHash: '0x32b1...88a0', date: '2026-07-26', trackingNumber: 'TRK-9821036' },
    { id: 'ORD-8824', buyerName: 'eth_whale99', buyerEmail: 'whale@crypto.org', productName: 'Agility Robotics Digit V4', price: 42000, paymentMethod: 'ETH', status: 'completed', txHash: '0x77c2...11f9', date: '2026-07-24', trackingNumber: 'TRK-9821037' },
    { id: 'ORD-8825', buyerName: 'dev_marcus', buyerEmail: 'marcus@stanford.edu', productName: 'Ouster OS1 32-Channel LiDAR', price: 3400, paymentMethod: 'SOL', status: 'refunded', txHash: '0x12a9...55b2', date: '2026-07-20', trackingNumber: 'TRK-9821038' }
  ]);

  const [apiLogs] = useState<APILogEntry[]>([
    { id: 'log-1', timestamp: '2026-07-26 02:22:10', provider: 'Gemini', model: 'gemini-2.5-flash', endpoint: '/api/v1/generate', status: 200, latencyMs: 82, tokens: 420, userEmail: 'alex.cyber@mit.edu' },
    { id: 'log-2', timestamp: '2026-07-26 02:21:55', provider: 'OpenAI', model: 'gpt-4o', endpoint: '/api/v1/chat', status: 200, latencyMs: 145, tokens: 890, userEmail: 'sarah@boston-dynamics.io' },
    { id: 'log-3', timestamp: '2026-07-26 02:20:12', provider: 'Claude', model: 'claude-3-7-sonnet', endpoint: '/api/v1/analyze', status: 200, latencyMs: 160, tokens: 1250, userEmail: 'elena@deepmind-labs.com' },
    { id: 'log-4', timestamp: '2026-07-26 02:18:40', provider: 'DeepSeek', model: 'deepseek-r1', endpoint: '/api/v1/reason', status: 200, latencyMs: 98, tokens: 620, userEmail: 'whale@crypto.org' },
    { id: 'log-5', timestamp: '2026-07-26 02:15:02', provider: 'Grok', model: 'grok-3', endpoint: '/api/v1/synth', status: 429, latencyMs: 310, tokens: 0, userEmail: 'bot_spammer@temp.net' }
  ]);

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    { id: 'TCK-401', userName: 'dev_marcus', userEmail: 'marcus@stanford.edu', subject: 'Refund Request for LiDAR OS1 order', category: 'Refund', priority: 'High', status: 'in_progress', createdAt: '2026-07-25 14:10', message: 'The LiDAR arrived with cracked packaging. I requested a refund.' },
    { id: 'TCK-402', userName: 'sarah_robotics', userEmail: 'sarah@boston-dynamics.io', subject: 'Custom BYOK Key Rate Limits question', category: 'BYOK Key', priority: 'Medium', status: 'open', createdAt: '2026-07-26 01:20', message: 'How do I raise the TPM limit when injecting custom Anthropic keys?' },
    { id: 'TCK-403', userName: 'eth_whale99', userEmail: 'whale@crypto.org', subject: 'Crypto transaction verification delay', category: 'Billing', priority: 'Low', status: 'resolved', createdAt: '2026-07-24 10:00', message: 'Transaction on Arbitrum was confirmed after 12 blocks.' }
  ]);

  const [systemLogs] = useState<SystemLogEntry[]>([
    { id: 'sys-101', timestamp: '2026-07-26 02:20:00', type: 'Login', level: 'INFO', actor: 'alex_cyber', ipAddress: '192.168.1.42', details: 'Admin login successfully authenticated via Web3 OAuth.' },
    { id: 'sys-102', timestamp: '2026-07-26 02:15:30', type: 'Audit', level: 'WARN', actor: 'sarah_robotics', ipAddress: '172.16.0.8', details: 'Approved new hardware listing: Unitree Aliango.' },
    { id: 'sys-103', timestamp: '2026-07-26 01:45:10', type: 'Error', level: 'ERROR', actor: 'SYSTEM', ipAddress: '10.0.4.12', details: 'OpenAI API transient timeout on gpt-4o fallback route.' },
    { id: 'sys-104', timestamp: '2026-07-25 22:10:04', type: 'Payment', level: 'INFO', actor: 'eth_whale99', ipAddress: '198.51.100.2', details: 'Crypto wallet verified $42,000 ETH deposit to cold ledger.' }
  ]);

  // System settings state
  const [siteConfig, setSiteConfig] = useState({
    appName: 'RoboMarketSaaS',
    maintenanceMode: false,
    accentColor: '#059669',
    supportedChains: 'Ethereum, Solana, Polygon, Arbitrum',
    defaultAIModel: 'gemini-2.5-flash',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: '587',
    twoFactorEnforced: true,
    requireWalletSignature: true
  });

  // State for user management modal/search
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'manager' | 'user'>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // State for order management search/filter
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'completed' | 'processing' | 'refunded'>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchesSearch = u.username.toLowerCase().includes(userSearch.toLowerCase()) || 
                            u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.walletAddress.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [usersList, userSearch, userRoleFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return ordersList.filter(o => {
      return orderFilter === 'all' || o.status === orderFilter;
    });
  }, [ordersList, orderFilter]);

  // Pending hardware listings from props
  const pendingRobots = useMemo(() => robots.filter(r => r.status === 'pending'), [robots]);
  const approvedRobots = useMemo(() => robots.filter(r => r.status === 'approved'), [robots]);

  // Fetch actual users list from server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('robo_token');
        const res = await fetch('/api/admin/users', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setUsersList(data.map((u: any) => ({
              id: u.id,
              username: u.username,
              email: u.email,
              role: u.role || 'user',
              status: u.status || 'active',
              walletAddress: u.walletAddress || `0x${u.id.slice(0, 4)}...1234`,
              subscription: u.role === 'admin' ? 'Enterprise' : u.role === 'manager' ? 'Pro Tier' : 'Free Starter',
              createdAt: u.createdAt ? u.createdAt.slice(0, 10) : '2025-01-01',
              lastLogin: new Date().toISOString().slice(0, 16).replace('T', ' ')
            })));
          }
        }
      } catch (err) {
        console.error("Error fetching users from server:", err);
      }
    };
    fetchUsers();
  }, []);

  // Handlers for User Actions
  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'manager' | 'user') => {
    if (isManager && newRole === 'admin') {
      showToast('RBAC Warning: Managers cannot assign Admin rights.');
      return;
    }

    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('robo_token');
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        showToast(`User role updated to ${newRole.toUpperCase()}.`);
        if (selectedUser?.id === userId) {
          setSelectedUser(prev => prev ? { ...prev, role: newRole } : null);
        }
      } else {
        const data = await response.json();
        showToast(`Error: ${data.error || 'Failed to update user role'}`);
      }
    } catch (err) {
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showToast(`User role updated to ${newRole.toUpperCase()}.`);
    }
  };

  const handleUpdateStatus = (userId: string, newStatus: 'active' | 'suspended' | 'banned') => {
    if (isManager && newStatus === 'banned') {
      showToast('RBAC Warning: Managers can only suspend users, not permanently ban.');
      return;
    }

    if (newStatus === 'suspended' || newStatus === 'banned') {
      if (!window.confirm(`Are you sure you want to ${newStatus.toUpperCase()} this user account?`)) {
        return;
      }
    }

    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    showToast(`User status changed to ${newStatus.toUpperCase()}.`);
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleResetPassword = (email: string) => {
    showToast(`Password reset link dispatched to ${email}`);
  };

  // Handlers for Orders
  const handleUpdateOrderStatus = (orderId: string, status: AdminOrder['status']) => {
    setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order ${orderId} updated to ${status.toUpperCase()}`);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  // Handlers for Tickets
  const handleResolveTicket = (ticketId: string) => {
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'resolved' } : t));
    showToast(`Ticket ${ticketId} resolved.`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm" id="admin-dashboard-container">
      
      {/* Toast Notification Bar */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[1000] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-700 animate-slide-down">
          <BadgeCheck className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-bold font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Toggle Sidebar Nav"
          >
            <Sliders className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                RoboMarket Admin Panel
              </span>
              <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase border ${
                isAdmin ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {isAdmin ? 'Super Admin' : 'Manager Access'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Enterprise Node v4.8 • Real-time Monitoring & Orchestration
            </p>
          </div>
        </div>

        {/* Live System Status & Switch Account */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>All 5 AI Engines Operational (42ms)</span>
          </div>

          {onSwitchToUserProfile && (
            <button
              onClick={onSwitchToUserProfile}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Users className="h-3.5 w-3.5 text-slate-500" />
              <span>User Profile View</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Body with Sidebar + Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <aside className={`bg-white border-r border-slate-200/80 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`} id="admin-sidebar">
          
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            
            {/* 1. Dashboard Overview */}
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'overview' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>Dashboard Overview</span>}
            </button>

            {/* 2. Analytics */}
            <button
              onClick={() => setActiveSection('analytics')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'analytics' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>Analytics</span>}
            </button>

            {/* 3. User Management */}
            <button
              onClick={() => setActiveSection('users')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'users' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>User Management</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="text-[10px] bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                  {usersList.length}
                </span>
              )}
            </button>

            {/* 4. Orders & Payments */}
            <button
              onClick={() => setActiveSection('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'orders' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ShoppingBag className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Orders & Payments</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono font-bold">
                  {ordersList.filter(o => o.status === 'pending').length} pending
                </span>
              )}
            </button>

            {/* 5. AI Management */}
            <button
              onClick={() => setActiveSection('ai')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'ai' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Bot className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>AI Management</span>}
            </button>

            {/* 6. Marketplace Management */}
            <button
              onClick={() => setActiveSection('marketplace')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'marketplace' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Layers className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Marketplace</span>}
              </div>
              {!sidebarCollapsed && pendingRobots.length > 0 && (
                <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">
                  {pendingRobots.length}
                </span>
              )}
            </button>

            {/* 7. Price Alerts */}
            <button
              onClick={() => setActiveSection('alerts')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'alerts' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Bell className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>Price Alerts</span>}
            </button>

            {/* 8. Support */}
            <button
              onClick={() => setActiveSection('support')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'support' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <HelpCircle className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>Support Tickets</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono">
                  {supportTickets.filter(t => t.status !== 'resolved').length}
                </span>
              )}
            </button>

            {/* 9. System Settings */}
            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'settings' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>System Settings</span>}
            </button>

            {/* 10. Logs */}
            <button
              onClick={() => setActiveSection('logs')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'logs' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Terminal className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>Audit & System Logs</span>}
            </button>

          </nav>

          {/* Sidebar Footer User Info */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-slate-200 bg-slate-50/80">
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="h-9 w-9 rounded-full border border-emerald-300 bg-white object-cover"
                />
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-slate-900 block truncate">{currentUser.username}</span>
                  <span className="text-[10px] text-slate-500 font-mono block truncate">{currentUser.email}</span>
                </div>
              </div>
            </div>
          )}

        </aside>

        {/* Right Main Content Panel */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-50">
          
          {/* SECTION 1: DASHBOARD OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-6 animate-fade-in" id="admin-overview-section">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">Executive Dashboard Overview</h1>
                  <p className="text-xs text-slate-500">Live operational telemetry, revenue breakdown & active queues.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => showToast('Data metrics synced with Cloud SQL & Ledger.')}
                    className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    title="Refresh Data"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => showToast('CSV Report generated and downloaded.')}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs flex items-center space-x-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export Financial Report</span>
                  </button>
                </div>
              </div>

              {/* Required 11 KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                
                {/* Total Users */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono font-bold uppercase">Total Users</span>
                    <Users className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-xl font-black text-slate-900 mt-1">12,840</p>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> +14.2% this month
                  </span>
                </div>

                {/* Active Users */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono font-bold uppercase">Active Users</span>
                    <UserCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-xl font-black text-slate-900 mt-1">8,920</p>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> 69.4% engagement rate
                  </span>
                </div>

                {/* Connected Wallets */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono font-bold uppercase">Connected Wallets</span>
                    <Wallet className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-xl font-black text-slate-900 mt-1">4,150</p>
                  <span className="text-[10px] text-purple-600 font-semibold flex items-center mt-1">
                    ETH • SOL • Polygon
                  </span>
                </div>

                {/* Total Revenue */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono font-bold uppercase">Total Revenue</span>
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-xl font-black text-emerald-600 mt-1">$1,482,900</p>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                    All time ARR
                  </span>
                </div>

                {/* Crypto Revenue */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono font-bold uppercase">Crypto Revenue</span>
                    <CreditCard className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="text-xl font-black text-slate-900 mt-1">$642,100</p>
                  <span className="text-[10px] text-amber-600 font-semibold mt-1 block">
                    43.3% of all volume
                  </span>
                </div>

                {/* Monthly Revenue */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono font-bold uppercase">Monthly Revenue</span>
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-xl font-black text-slate-900 mt-1">$128,450</p>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> +8.4% vs last mo
                  </span>
                </div>

                {/* Active Subscriptions */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono font-bold uppercase">Active Subscriptions</span>
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  </div>
                  <p className="text-xl font-black text-slate-900 mt-1">3,210</p>
                  <span className="text-[10px] text-indigo-600 font-semibold mt-1 block">
                    Pro & Enterprise Tiers
                  </span>
                </div>

                {/* AI Requests Today */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono font-bold uppercase">AI Requests Today</span>
                    <Zap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-xl font-black text-slate-900 mt-1">842,100</p>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                    ~9.7 req/sec avg
                  </span>
                </div>

                {/* API Health Summary */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono font-bold uppercase">API Health</span>
                    <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-xl font-black text-emerald-600 mt-1">99.98%</p>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                    5 Providers operational
                  </span>
                </div>

                {/* Open Orders */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono font-bold uppercase">Open Orders</span>
                    <ShoppingBag className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="text-xl font-black text-slate-900 mt-1">48</p>
                  <span className="text-[10px] text-amber-600 font-semibold mt-1 block">
                    In fulfillment queue
                  </span>
                </div>

                {/* Pending Payments */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono font-bold uppercase">Pending Payments</span>
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                  </div>
                  <p className="text-xl font-black text-rose-600 mt-1">12</p>
                  <span className="text-[10px] text-rose-600 font-semibold mt-1 block">
                    Awaiting block confirmation
                  </span>
                </div>

              </div>

              {/* Marketplace Approval Banner */}
              {pendingRobots.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShieldAlert className="h-6 w-6 text-amber-600 animate-bounce" />
                    <div>
                      <h3 className="text-xs font-bold text-amber-900">Pending Merchant Submissions ({pendingRobots.length})</h3>
                      <p className="text-[11px] text-amber-700">Robotic hardware listings are awaiting seller audit review before going live.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection('marketplace')}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    Review Queue
                  </button>
                </div>
              )}

              {/* Quick Actions & Recent Orders Table */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Orders Overview */}
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">Latest Platform Transactions</h2>
                    <button 
                      onClick={() => setActiveSection('orders')}
                      className="text-xs text-emerald-600 hover:underline font-bold cursor-pointer"
                    >
                      View All ({ordersList.length}) →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-[10px] font-mono uppercase text-slate-400 border-b border-slate-100">
                          <th className="p-2">Order ID</th>
                          <th className="p-2">Buyer</th>
                          <th className="p-2">Product</th>
                          <th className="p-2">Price</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {ordersList.slice(0, 4).map(o => (
                          <tr key={o.id} className="hover:bg-slate-50">
                            <td className="p-2 font-mono font-bold text-emerald-700">{o.id}</td>
                            <td className="p-2 font-medium text-slate-800">{o.buyerName}</td>
                            <td className="p-2 text-slate-600 truncate max-w-[150px]">{o.productName}</td>
                            <td className="p-2 font-mono font-bold text-slate-900">${o.price.toLocaleString()}</td>
                            <td className="p-2">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono ${
                                o.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                o.status === 'processing' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AI Provider Telemetry */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">AI Engines Latency</h2>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">5 Online</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        <span className="font-bold text-slate-800">Gemini 2.5 Flash</span>
                      </div>
                      <span className="font-mono text-emerald-600 font-bold">85 ms</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        <span className="font-bold text-slate-800">OpenAI GPT-4o</span>
                      </div>
                      <span className="font-mono text-slate-700 font-bold">145 ms</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        <span className="font-bold text-slate-800">Claude Sonnet 3.7</span>
                      </div>
                      <span className="font-mono text-slate-700 font-bold">160 ms</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        <span className="font-bold text-slate-800">DeepSeek R1</span>
                      </div>
                      <span className="font-mono text-slate-700 font-bold">98 ms</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        <span className="font-bold text-slate-800">Grok 3</span>
                      </div>
                      <span className="font-mono text-slate-700 font-bold">110 ms</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 2: ANALYTICS */}
          {activeSection === 'analytics' && (
            <div className="space-y-6 animate-fade-in" id="admin-analytics-section">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Platform Analytics & AI Telemetry</h1>
                <p className="text-xs text-slate-500">Revenue growth, model token consumption, and payment gateway distribution.</p>
              </div>

              {/* Analytics Visualization Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Revenue Growth Chart Simulation */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="text-xs font-bold text-slate-900 uppercase font-mono">Monthly Revenue Growth ($ USD vs Crypto)</h2>
                    <span className="text-[10px] font-mono text-slate-400">Q1-Q3 2026</span>
                  </div>

                  <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100">
                    {[
                      { month: 'Jan', usd: 65, crypto: 40 },
                      { month: 'Feb', usd: 72, crypto: 48 },
                      { month: 'Mar', usd: 88, crypto: 55 },
                      { month: 'Apr', usd: 95, crypto: 68 },
                      { month: 'May', usd: 110, crypto: 80 },
                      { month: 'Jun', usd: 125, crypto: 95 },
                      { month: 'Jul', usd: 142, crypto: 110 },
                    ].map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                        <div className="w-full flex gap-1 items-end h-full justify-center">
                          <div 
                            style={{ height: `${(d.usd / 150) * 100}%` }} 
                            className="w-1/2 bg-emerald-600 rounded-t-md group-hover:bg-emerald-700 transition-all relative"
                            title={`USD: $${d.usd}k`}
                          />
                          <div 
                            style={{ height: `${(d.crypto / 150) * 100}%` }} 
                            className="w-1/2 bg-amber-500 rounded-t-md group-hover:bg-amber-600 transition-all relative"
                            title={`Crypto: $${d.crypto}k`}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 font-bold">{d.month}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center space-x-6 text-xs font-bold font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="h-3 w-3 bg-emerald-600 rounded-xs"></span>
                      <span>Fiat / Credit Card ($1.48M)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="h-3 w-3 bg-amber-500 rounded-xs"></span>
                      <span>Crypto Ledger ($642K)</span>
                    </div>
                  </div>
                </div>

                {/* AI Token Consumption per Model */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="text-xs font-bold text-slate-900 uppercase font-mono">Most Used AI Models (Tokens Executed)</h2>
                    <span className="text-[10px] text-emerald-600 font-mono font-bold">12.4M Tokens/day</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Gemini 2.5 Flash</span>
                        <span className="font-mono text-emerald-600">5.8M (46.7%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: '46.7%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>OpenAI GPT-4o</span>
                        <span className="font-mono text-blue-600">3.2M (25.8%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '25.8%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Claude Sonnet 3.7</span>
                        <span className="font-mono text-purple-600">1.9M (15.3%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full rounded-full" style={{ width: '15.3%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>DeepSeek R1 / V3</span>
                        <span className="font-mono text-indigo-600">1.1M (8.8%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: '8.8%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Grok 3</span>
                        <span className="font-mono text-slate-700">0.4M (3.4%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-slate-700 h-full rounded-full" style={{ width: '3.4%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 3: USER MANAGEMENT */}
          {activeSection === 'users' && (
            <div className="space-y-6 animate-fade-in" id="admin-users-section">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">User Management Directory</h1>
                  <p className="text-xs text-slate-500">Manage user credentials, roles, suspensions, and wallet details.</p>
                </div>
                {isManager && (
                  <span className="text-xs bg-amber-50 border border-amber-200 text-amber-800 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    Manager Mode (Restricted Role Allocation)
                  </span>
                )}
              </div>

              {/* Filters Bar */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by username, email, wallet..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>

              {/* Users Data Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        <th className="p-3.5">User Identity</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Wallet</th>
                        <th className="p-3.5">Tier</th>
                        <th className="p-3.5">Joined</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">
                            <div>
                              <span>{u.username}</span>
                              <span className="text-[10px] text-slate-400 font-mono block font-normal">{u.email}</span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                              u.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                              u.role === 'manager' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                              u.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              u.status === 'suspended' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">{u.walletAddress}</td>
                          <td className="p-3.5 font-semibold text-emerald-700">{u.subscription}</td>
                          <td className="p-3.5 font-mono text-[10px] text-slate-400">{u.createdAt}</td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] cursor-pointer"
                            >
                              Manage User
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* User Management Action Modal */}
              {selectedUser && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <h2 className="text-base font-black text-slate-900">Manage User Account</h2>
                        <p className="text-xs text-slate-500 font-mono">{selectedUser.email}</p>
                      </div>
                      <button onClick={() => setSelectedUser(null)} className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Change Role */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 font-mono uppercase">Change Account Role</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['admin', 'manager', 'user'] as const).map(role => (
                          <button
                            key={role}
                            onClick={() => handleUpdateRole(selectedUser.id, role)}
                            className={`py-2 text-xs font-bold rounded-xl border capitalize cursor-pointer ${
                              selectedUser.role === role ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Suspend / Ban */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 font-mono uppercase">Account Status & Enforcement</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleUpdateStatus(selectedUser.id, 'active')}
                          className="py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedUser.id, 'suspended')}
                          className="py-2 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Suspend
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedUser.id, 'banned')}
                          className="py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Ban User
                        </button>
                      </div>
                    </div>

                    {/* Password Reset */}
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                      <button
                        onClick={() => handleResetPassword(selectedUser.email)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Send Password Reset Email
                      </button>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Done
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* SECTION 4: ORDERS & PAYMENTS */}
          {activeSection === 'orders' && (
            <div className="space-y-6 animate-fade-in" id="admin-orders-section">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Orders, Invoices & Crypto Transactions</h1>
                <p className="text-xs text-slate-500">Monitor transactions, process refunds, verify crypto block hashes.</p>
              </div>

              {/* Order Status Tabs */}
              <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
                {(['all', 'pending', 'processing', 'completed', 'refunded'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setOrderFilter(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      orderFilter === tab ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab} Orders
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        <th className="p-3.5">Order ID</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Hardware Item</th>
                        <th className="p-3.5">Price</th>
                        <th className="p-3.5">Payment Method</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-mono font-bold text-emerald-700">{o.id}</td>
                          <td className="p-3.5 font-semibold text-slate-900">{o.buyerName}</td>
                          <td className="p-3.5 text-slate-700 font-medium">{o.productName}</td>
                          <td className="p-3.5 font-mono font-bold text-slate-900">${o.price.toLocaleString()}</td>
                          <td className="p-3.5">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {o.paymentMethod}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                              o.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              o.status === 'processing' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              o.status === 'refunded' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Detail Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <h2 className="text-base font-black text-slate-900">Order {selectedOrder.id}</h2>
                        <p className="text-xs text-slate-500 font-mono">Customer: {selectedOrder.buyerEmail}</p>
                      </div>
                      <button onClick={() => setSelectedOrder(null)} className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl space-y-1 text-xs">
                      <p><span className="font-bold text-slate-700">Product:</span> {selectedOrder.productName}</p>
                      <p><span className="font-bold text-slate-700">Total Price:</span> ${selectedOrder.price.toLocaleString()}</p>
                      <p><span className="font-bold text-slate-700">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                      {selectedOrder.txHash && <p><span className="font-bold text-slate-700">Block TX Hash:</span> <span className="font-mono text-[10px] text-emerald-600">{selectedOrder.txHash}</span></p>}
                      <p><span className="font-bold text-slate-700">Tracking Number:</span> <span className="font-mono text-[10px]">{selectedOrder.trackingNumber}</span></p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 font-mono uppercase">Update Order Status</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'completed')}
                          className="py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'processing')}
                          className="py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Dispatch / Ship
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'refunded')}
                          className="py-2 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Issue Refund
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-right">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* SECTION 5: AI MANAGEMENT */}
          {activeSection === 'ai' && (
            <div className="space-y-6 animate-fade-in" id="admin-ai-section">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">AI Engine Gateway & Provider Health</h1>
                <p className="text-xs text-slate-500">Monitor OpenAI, Gemini, Claude, Grok & DeepSeek API integrations and logs.</p>
              </div>

              {/* Provider Health Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { name: 'Gemini', model: 'gemini-2.5-flash', status: '100% Uptime', latency: '85ms' },
                  { name: 'OpenAI', model: 'gpt-4o', status: '99.9% Uptime', latency: '145ms' },
                  { name: 'Claude', model: 'sonnet-3.7', status: '99.8% Uptime', latency: '160ms' },
                  { name: 'Grok', model: 'grok-3', status: '99.7% Uptime', latency: '110ms' },
                  { name: 'DeepSeek', model: 'deepseek-r1', status: '99.9% Uptime', latency: '98ms' }
                ].map((p, i) => (
                  <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-xs">{p.name}</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">{p.model}</span>
                    <div className="pt-2 flex justify-between text-[10px] font-mono font-bold">
                      <span className="text-emerald-600">{p.status}</span>
                      <span className="text-slate-600">{p.latency}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Realtime API Logs Stream */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h2 className="text-xs font-bold text-slate-900 uppercase font-mono">Live API Execution Logs</h2>
                  <span className="text-[10px] font-mono text-slate-400">Showing last 5 requests</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-400">
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Provider</th>
                        <th className="p-3">Model</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Latency</th>
                        <th className="p-3">Tokens</th>
                        <th className="p-3">User</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {apiLogs.map(l => (
                        <tr key={l.id} className="hover:bg-slate-50 font-mono">
                          <td className="p-3 text-[10px] text-slate-500">{l.timestamp}</td>
                          <td className="p-3 font-bold text-slate-900">{l.provider}</td>
                          <td className="p-3 text-slate-600">{l.model}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              l.status === 200 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-800">{l.latencyMs} ms</td>
                          <td className="p-3 text-emerald-600 font-bold">{l.tokens}</td>
                          <td className="p-3 text-[10px] text-slate-500">{l.userEmail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* SECTION 6: MARKETPLACE MANAGEMENT */}
          {activeSection === 'marketplace' && (
            <div className="space-y-6 animate-fade-in" id="admin-marketplace-section">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Marketplace Hardware Catalog Management</h1>
                <p className="text-xs text-slate-500">Approve seller robot listings, manage categories, check inventory.</p>
              </div>

              {/* Pending Approvals Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h2 className="text-xs font-bold text-slate-900 uppercase font-mono">Pending Hardware Approvals ({pendingRobots.length})</h2>
                </div>

                {pendingRobots.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-400">
                          <th className="p-3">Robot Profile</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Seller</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pendingRobots.map(r => (
                          <tr key={r.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">{r.name}</td>
                            <td className="p-3 font-mono text-emerald-600 font-bold">${r.price.toLocaleString()}</td>
                            <td className="p-3 text-slate-600">{r.category}</td>
                            <td className="p-3 text-slate-500 font-mono text-[10px]">{r.sellerName}</td>
                            <td className="p-3 text-right space-x-1.5">
                              <button
                                onClick={() => onSelectRobot(r.id)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[10px] cursor-pointer"
                              >
                                View Specs
                              </button>
                              <button
                                onClick={() => onApproveListing(r.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to reject this hardware listing?")) {
                                    onRejectListing(r.id);
                                  }
                                }}
                                className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg font-bold text-[10px] cursor-pointer"
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-4 text-center">No hardware listings currently pending audit approval.</p>
                )}
              </div>

              {/* Active Catalog Overview */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <h2 className="text-xs font-bold text-slate-900 uppercase font-mono border-b border-slate-100 pb-2">Active Live Products ({approvedRobots.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {approvedRobots.map(r => (
                    <div key={r.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">{r.name}</span>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold">${r.price.toLocaleString()}</span>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SECTION 7: PRICE ALERTS */}
          {activeSection === 'alerts' && (
            <div className="space-y-6 animate-fade-in" id="admin-alerts-section">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Price Alerts & Notification Engine</h1>
                <p className="text-xs text-slate-500">Monitor automated hardware price threshold triggers & notification logs.</p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <h2 className="text-xs font-bold text-slate-900 uppercase font-mono border-b border-slate-100 pb-2">Configured User Alerts</h2>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Unitree Go2 Alert</span>
                      <span className="text-[10px] text-slate-500 font-mono">Trigger when price drops below $2,500</span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">Active</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">NVIDIA Jetson AGX Alert</span>
                      <span className="text-[10px] text-slate-500 font-mono">Trigger when price drops below $1,800</span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: SUPPORT TICKETS */}
          {activeSection === 'support' && (
            <div className="space-y-6 animate-fade-in" id="admin-support-section">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Customer Support & Helpdesk Desk</h1>
                <p className="text-xs text-slate-500">Respond to user inquiries, hardware warranty disputes, and technical tickets.</p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-400">
                        <th className="p-3.5">Ticket ID</th>
                        <th className="p-3.5">User</th>
                        <th className="p-3.5">Subject</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Priority</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {supportTickets.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-mono font-bold text-slate-900">{t.id}</td>
                          <td className="p-3.5 font-semibold text-slate-800">{t.userName}</td>
                          <td className="p-3.5 text-slate-700 max-w-[200px] truncate">{t.subject}</td>
                          <td className="p-3.5 font-mono text-[10px] text-slate-600">{t.category}</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                              t.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {t.priority}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                              t.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {t.status !== 'resolved' && (
                              <button
                                onClick={() => handleResolveTicket(t.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Resolve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: SYSTEM SETTINGS */}
          {activeSection === 'settings' && (
            <div className="space-y-6 animate-fade-in" id="admin-settings-section">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Platform Global System Settings</h1>
                <p className="text-xs text-slate-500">Branding, maintenance mode, security policies, SMTP server credentials.</p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-6 max-w-3xl">
                
                {/* General Configuration */}
                <div className="space-y-3">
                  <h2 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider border-b border-slate-100 pb-2">Site & Branding Configuration</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Application Name</label>
                      <input
                        type="text"
                        value={siteConfig.appName}
                        onChange={e => setSiteConfig({ ...siteConfig, appName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Default AI Engine</label>
                      <select
                        value={siteConfig.defaultAIModel}
                        onChange={e => setSiteConfig({ ...siteConfig, defaultAIModel: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 cursor-pointer"
                      >
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                        <option value="gpt-4o">OpenAI GPT-4o</option>
                        <option value="claude-3-7-sonnet">Claude Sonnet 3.7</option>
                        <option value="deepseek-r1">DeepSeek R1</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Maintenance Mode Toggle */}
                <div className="flex items-center justify-between bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">System Maintenance Mode</span>
                    <span className="text-[10px] text-slate-500">Lock non-admin logins for scheduled database migration.</span>
                  </div>
                  <button
                    onClick={() => {
                      if (isManager) {
                        showToast('RBAC Notice: Only Super Admins can toggle Maintenance Mode.');
                        return;
                      }
                      setSiteConfig({ ...siteConfig, maintenanceMode: !siteConfig.maintenanceMode });
                      showToast(`Maintenance mode ${!siteConfig.maintenanceMode ? 'ENABLED' : 'DISABLED'}`);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      siteConfig.maintenanceMode ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {siteConfig.maintenanceMode ? 'ACTIVE (LOCKED)' : 'DISABLED'}
                  </button>
                </div>

                {/* Save Settings Action */}
                <div className="pt-4 border-t border-slate-100 text-right">
                  <button
                    onClick={() => showToast('System Configuration saved to database.')}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    Save All Settings
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 10: LOGS */}
          {activeSection === 'logs' && (
            <div className="space-y-6 animate-fade-in" id="admin-logs-section">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Security & System Audit Logs</h1>
                <p className="text-xs text-slate-500">Full audit trail of admin logins, payment events, and error traces.</p>
              </div>

              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 font-mono text-xs shadow-xl space-y-3 overflow-x-auto">
                <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                  <span>AUDIT_STREAM_LOGS</span>
                  <span>4 EVENTS LISTED</span>
                </div>

                <div className="space-y-2">
                  {systemLogs.map(s => (
                    <div key={s.id} className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-start space-x-3 text-[11px]">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                        s.level === 'INFO' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        s.level === 'WARN' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        [{s.level}]
                      </span>
                      <div className="flex-1">
                        <span className="text-slate-400">{s.timestamp}</span> • <span className="text-emerald-400 font-bold">{s.actor}</span> ({s.ipAddress})
                        <p className="text-slate-200 mt-0.5">{s.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
