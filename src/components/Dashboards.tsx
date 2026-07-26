import React, { useState, useEffect } from 'react';
import { Shield, CreditCard, LayoutGrid, AlertCircle } from 'lucide-react';
import { User, Robot, Order } from '../types';
import AdminDashboard from './AdminDashboard';

interface DashboardsProps {
  currentUser: User | null;
  robots: Robot[];
  onSelectRobot: (id: string) => void;
  onApproveListing: (id: string) => void;
  onRejectListing: (id: string) => void;
}

export default function Dashboards({
  currentUser,
  robots,
  onSelectRobot,
  onApproveListing,
  onRejectListing,
  requestedTab
}: DashboardsProps & { requestedTab?: string }) {
  const userRole = (currentUser?.role || '').toLowerCase();
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';
  const isAdminOrManager = isAdmin || isManager;
  
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'listings' | 'admin'>(
    isAdminOrManager ? 'admin' : 'orders'
  );

  const [rbacRedirectNotice, setRbacRedirectNotice] = useState(false);
  
  // User Profile Dashboard states
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch orders associated with current user
  const fetchUserOrders = async () => {
    if (!currentUser) return;
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('robo_token');
      const response = await fetch(`/api/orders?userId=${currentUser.id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserOrders(data);
      }
    } catch (err) {
      console.error("Error fetching user orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
    
    // RBAC Route Enforcement
    if (requestedTab === 'admin-dashboard' || requestedTab === 'admin') {
      if (isAdminOrManager) {
        setActiveSubTab('admin');
        setRbacRedirectNotice(false);
      } else {
        // Non-admin attempted to visit admin route
        setActiveSubTab('orders');
        setRbacRedirectNotice(true);
      }
    } else if (isAdminOrManager && !requestedTab) {
      setActiveSubTab('admin');
      setRbacRedirectNotice(false);
    } else if (!isAdminOrManager) {
      if (activeSubTab === 'admin') {
        setActiveSubTab('orders');
        setRbacRedirectNotice(true);
      }
    }
  }, [currentUser, robots, requestedTab]);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('robo_token');
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchUserOrders();
      }
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center" id="dashboard-unauthorized">
        <h2 className="text-xl font-black text-slate-900">Dashboard Locked</h2>
        <p className="text-xs text-slate-500 mt-2">Connect a profile from the header to access account history.</p>
      </div>
    );
  }

  // If Admin or Manager, render full Enterprise SaaS Admin Panel exclusively (No User Profile page shown)
  if (isAdminOrManager && activeSubTab === 'admin') {
    return (
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 py-2">
        <AdminDashboard
          currentUser={currentUser}
          robots={robots}
          onSelectRobot={onSelectRobot}
          onApproveListing={onApproveListing}
          onRejectListing={onRejectListing}
        />
      </div>
    );
  }

  // Standard User Profile View (Orders & My Hardware Listings) - No Admin Widgets
  const myListings = robots.filter(r => r.sellerId === currentUser.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" id="dashboard-viewport">
      
      {/* RBAC Enforcement Banner for Non-Admin Users trying to access /admin/dashboard */}
      {rbacRedirectNotice && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-rose-800 text-xs font-medium animate-fade-in shadow-xs">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <div>
            <span className="font-bold block text-sm">Access Denied (403 Forbidden)</span>
            <span>Administrative privileges (ADMIN role) are required to access `/admin/dashboard`. You have been redirected to your User Dashboard.</span>
          </div>
        </div>
      )}

      {/* User Profile Overview Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 mb-8 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="h-16 w-16 rounded-2xl border-2 border-slate-200 bg-slate-50 p-1 shadow-2xs object-cover"
          />
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center space-x-2">
              <span>{currentUser.username}</span>
              <span className="text-[9px] font-bold font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                {userRole === 'manager' ? 'Fleet Manager' : 'User Account'}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Email: <span className="text-slate-800 font-mono font-semibold">{currentUser.email}</span></p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Joined Node: {new Date(currentUser.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Navigation controllers */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              activeSubTab === 'orders' ? 'bg-emerald-600 text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Orders / Purchases
          </button>
          
          <button
            onClick={() => setActiveSubTab('listings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              activeSubTab === 'listings' ? 'bg-emerald-600 text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            My Hardware Listings
          </button>
        </div>
      </div>

      {/* SUB-TABS WORKSPACES */}

      {/* 1. ORDERS / PURCHASES TAB */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6" id="dashboard-orders-tab">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">Purchase History & Logistics</h2>
          </div>

          {loadingOrders ? (
            <p className="text-xs text-slate-400 italic">Connecting to shipping servers...</p>
          ) : userOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userOrders.map((order) => (
                <div key={order.id} className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 shadow-2xs flex space-x-4 transition-all">
                  <img
                    src={order.robotImageUrl}
                    alt={order.robotName}
                    className="h-16 w-16 object-cover rounded-xl border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono text-emerald-700">Order ID: {order.id}</span>
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                        order.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        order.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900">{order.robotName}</h3>
                    <p className="text-xs font-black text-emerald-600">${order.price.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-400 font-mono">Tracking: {order.trackingNumber}</p>

                    {/* Logistics simulation triggers if user is the seller! */}
                    {order.sellerId === currentUser.id && order.status !== 'delivered' && (
                      <div className="pt-2 flex gap-1.5 border-t border-slate-100 mt-1.5">
                        <span className="text-[8px] text-slate-400 font-mono self-center">Fulfillment:</span>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[8px] font-bold px-2 py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs"
                          >
                            Set Processing
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                            className="bg-purple-600 hover:bg-purple-700 text-[8px] font-bold px-2 py-1.5 rounded-lg text-white cursor-pointer transition-colors shadow-2xs"
                          >
                            Dispatch/Ship
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-[8px] font-bold px-2 py-1.5 rounded-lg text-white cursor-pointer transition-colors shadow-2xs"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-4 bg-white border border-slate-200/80 rounded-2xl text-center shadow-2xs">
              No transactions listed. Explore the marketplace catalog to place an order.
            </p>
          )}
        </div>
      )}

      {/* 2. MY HARDWARE LISTINGS TAB */}
      {activeSubTab === 'listings' && (
        <div className="space-y-6" id="dashboard-listings-tab">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <LayoutGrid className="h-5 w-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">Registered Hardware Catalog</h2>
          </div>

          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myListings.map((robot) => (
                <div key={robot.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={robot.imageUrl}
                      alt={robot.name}
                      className="h-14 w-14 object-cover rounded-xl border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{robot.name}</h3>
                      <p className="text-xs font-bold text-emerald-600 mt-0.5">${robot.price.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{robot.category} • {robot.condition}</p>
                    </div>
                  </div>

                  <div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider font-bold uppercase border ${
                      robot.status === 'approved' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : robot.status === 'pending'
                        ? 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}>
                      {robot.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-4 bg-white border border-slate-200/80 rounded-2xl text-center shadow-2xs">
              You haven't listed any robotic hardware yet. Visit the "List Hardware" section to list items.
            </p>
          )}
        </div>
      )}

    </div>
  );
}
