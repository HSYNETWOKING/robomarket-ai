import React, { useState, useEffect } from 'react';
import { Shield, CreditCard, LayoutGrid, Heart, Eye, ArrowUpRight, BarChart3, Users, ClipboardCheck, Ban, Check, Truck, CheckCircle } from 'lucide-react';
import { User, Robot, Order } from '../types';

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
  onRejectListing
}: DashboardsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'listings' | 'wishlist' | 'admin'>('orders');
  
  // Dashboard states
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch orders associated with current user
  const fetchUserOrders = async () => {
    if (!currentUser) return;
    setLoadingOrders(true);
    try {
      const response = await fetch(`/api/orders?userId=${currentUser.id}`);
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
    // Default to admin tab if user has role of admin and they visit
    if (currentUser?.role === 'admin') {
      setActiveSubTab('admin');
    }
  }, [currentUser, robots]);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
        <h2 className="text-xl font-bold text-zinc-850 dark:text-zinc-200">Dashboard is locked</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Connect a sandbox profile from the header to view accounts.</p>
      </div>
    );
  }

  // Get user uploaded robots
  const myListings = robots.filter(r => r.sellerId === currentUser.id);

  // Get wishlisted robots
  const myWishlist = robots.filter(r => r.status === 'approved'); // Wishlist ids filtered in App level

  // Admin stats (visible if role is admin)
  const pendingRobots = robots.filter(r => r.status === 'pending');
  const approvedRobotsCount = robots.filter(r => r.status === 'approved').length;
  const totalGTV = userOrders.reduce((acc, o) => acc + o.price, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="dashboard-viewport">
      
      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="h-16 w-16 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-1 shadow-sm"
          />
          <div>
            <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white flex items-center space-x-2">
              <span>{currentUser.username}</span>
              {currentUser.role === 'admin' && (
                <span className="text-[9px] font-bold font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-955/20 border border-amber-200 dark:border-amber-900/50 px-2 py-0.5 rounded uppercase">
                  Staff Administrator
                </span>
              )}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Email address: <span className="text-zinc-700 dark:text-zinc-300 font-mono">{currentUser.email}</span></p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">Joined Node: {new Date(currentUser.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Dynamic sub tab controllers */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm min-h-[38px] ${
              activeSubTab === 'orders' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950' : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white'
            }`}
          >
            Orders / Purchases
          </button>
          
          <button
            onClick={() => setActiveSubTab('listings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm min-h-[38px] ${
              activeSubTab === 'listings' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950' : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white'
            }`}
          >
            My Hardware Listings
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveSubTab('admin')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border cursor-pointer shadow-sm min-h-[38px] ${
                activeSubTab === 'admin' 
                  ? 'bg-amber-600 border-amber-500 text-white' 
                  : 'bg-amber-50 dark:bg-amber-955/20 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Panel ({pendingRobots.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-TABS WORKSPACES */}

      {/* 1. ORDERS / PURCHASES TAB */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6" id="dashboard-orders-tab">
          <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider">Purchase History & Logistics</h2>
          </div>

          {loadingOrders ? (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">Connecting to shipping servers...</p>
          ) : userOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userOrders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl p-4 shadow-sm flex space-x-4 transition-all duration-200">
                  <img
                    src={order.robotImageUrl}
                    alt={order.robotName}
                    className="h-16 w-16 object-cover rounded-lg border border-zinc-200 dark:border-zinc-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono text-blue-700 dark:text-blue-400">Order ID: {order.id}</span>
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                        order.status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40' :
                        order.status === 'processing' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40' :
                        order.status === 'shipped' ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40 animate-pulse' :
                        'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{order.robotName}</h3>
                    <p className="text-xs font-black text-zinc-900 dark:text-white">${order.price.toLocaleString()}</p>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono">Logistics reference: {order.trackingNumber}</p>

                    {/* Logistics simulation triggers if user is the seller! */}
                    {order.sellerId === currentUser.id && order.status !== 'delivered' && (
                      <div className="pt-2 flex gap-1.5 border-t border-zinc-100 dark:border-zinc-800 mt-1.5">
                        <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-mono self-center">Fulfillment:</span>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                            className="bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[8px] font-bold px-2 py-1.5 rounded cursor-pointer transition-colors shadow-sm min-h-[32px]"
                          >
                            Set Processing
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                            className="bg-purple-600 hover:bg-purple-700 text-[8px] font-bold px-2 py-1.5 rounded text-white cursor-pointer transition-colors shadow-sm min-h-[32px]"
                          >
                            Dispatch/Ship
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                            className="bg-green-600 hover:bg-green-750 text-[8px] font-bold px-2 py-1.5 rounded text-white cursor-pointer transition-colors shadow-sm min-h-[32px]"
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
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center shadow-sm">
              No transactions listed. Explore the marketplace catalog to place an order.
            </p>
          )}
        </div>
      )}

      {/* 2. MY HARDWARE LISTINGS TAB */}
      {activeSubTab === 'listings' && (
        <div className="space-y-6" id="dashboard-listings-tab">
          <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <LayoutGrid className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider">Registered Hardware Catalog</h2>
          </div>

          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myListings.map((robot) => (
                <div key={robot.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={robot.imageUrl}
                      alt={robot.name}
                      className="h-14 w-14 object-cover rounded-lg border border-zinc-200 dark:border-zinc-800"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-zinc-900 dark:text-white">{robot.name}</h3>
                      <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 mt-0.5">${robot.price.toLocaleString()}</p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">{robot.category} • {robot.condition}</p>
                    </div>
                  </div>

                  <div>
                    <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-bold uppercase border ${
                      robot.status === 'approved' 
                        ? 'bg-green-50 dark:bg-green-950/25 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400' 
                        : robot.status === 'pending'
                        ? 'bg-amber-50 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 animate-pulse'
                        : 'bg-red-50 dark:bg-red-950/25 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
                    }`}>
                      {robot.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center shadow-sm">
              You haven't listed any robotic hardware yet. Visit the "Sell Robot" tab to list.
            </p>
          )}
        </div>
      )}      {/* 3. STAFF ADMINISTRATOR PANEL TAB */}
      {activeSubTab === 'admin' && currentUser.role === 'admin' && (
        <div className="space-y-8" id="dashboard-admin-tab">
          
          {/* STATS TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex items-center space-x-3.5">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 p-2.5 rounded-lg text-blue-600 dark:text-blue-400">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase block">Active Listings</span>
                <span className="text-base font-extrabold text-zinc-900 dark:text-white">{approvedRobotsCount} units</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex items-center space-x-3.5">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-2.5 rounded-lg text-amber-700 dark:text-amber-400">
                <ClipboardCheck className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase block">Pending Reviews</span>
                <span className="text-base font-extrabold text-amber-700 dark:text-amber-400">{pendingRobots.length} units</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex items-center space-x-3.5">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 p-2.5 rounded-lg text-green-700 dark:text-green-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase block">Transactional GTV</span>
                <span className="text-base font-extrabold text-green-700 dark:text-green-400">${totalGTV.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex items-center space-x-3.5">
              <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 p-2.5 rounded-lg text-purple-700 dark:text-purple-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase block">Security Accounts</span>
                <span className="text-base font-extrabold text-zinc-900 dark:text-white">3 active</span>
              </div>
            </div>
          </div>

          {/* LISTINGS APPROVAL TABLE */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider">Merchant Quality Approvals Bureau</h2>
            </div>

            {pendingRobots.length > 0 ? (
              <div className="overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-zinc-50/80 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        <th className="p-3">Robot Profile</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Class/Category</th>
                        <th className="p-3">Seller</th>
                        <th className="p-3 text-right">Approval Decisions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {pendingRobots.map((robot) => (
                        <tr key={robot.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center space-x-3">
                              <img
                                src={robot.imageUrl}
                                alt={robot.name}
                                className="h-10 w-10 object-cover rounded border border-zinc-200 dark:border-zinc-800"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="font-bold text-zinc-800 dark:text-zinc-100 block">{robot.name}</span>
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">{robot.location}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                            ${robot.price.toLocaleString()}
                          </td>
                          <td className="p-3 text-zinc-700 dark:text-zinc-300">
                            {robot.category}
                          </td>
                          <td className="p-3 text-zinc-500 dark:text-zinc-400 font-mono text-[10px]">
                            {robot.sellerName}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => onSelectRobot(robot.id)}
                                className="bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-[10px] px-2.5 py-1.5 rounded text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer shadow-sm min-h-[32px]"
                                title="Inspect specifications closely"
                              >
                                Inspect Specs
                              </button>
                              <button
                                onClick={() => onApproveListing(robot.id)}
                                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors cursor-pointer shadow-sm min-h-[32px] min-w-[32px] flex items-center justify-center"
                                title="Approve to Go Live"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onRejectListing(robot.id)}
                                className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40 p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/35 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                                title="Reject Listing"
                              >
                                <Ban className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 italic p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center shadow-sm">
                All merchant listings are audited and active on the catalog floor. No pending approval reviews.
              </p>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
