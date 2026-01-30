import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, Search, LogOut, Lock, RefreshCcw } from 'lucide-react';
import { Order } from '../types';
import { getOrders, updateOrderStatus } from '../services/orderService';
import { verifyPassword, checkSession, setSession, setAdminPassword, getAdminPassword } from '../services/authService';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for existing session
    if (checkSession() && getAdminPassword()) {
      setIsAuthenticated(true);
    }
  }, []);

  const loadOrders = async () => {
    setIsLoadingData(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (e) {
      console.error("Failed to load orders");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setError('');

    try {
      const isValid = await verifyPassword(password);
      if (isValid) {
        setIsAuthenticated(true);
        setSession(true);
        setAdminPassword(password);
      } else {
        setError('Invalid credentials');
      }
    } catch (e) {
      setError('Authentication failed');
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSession(false);
    setPassword('');
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    // Optimistic UI update for immediate feedback
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    
    // Perform actual update
    await updateOrderStatus(id, newStatus);
  };

  const filteredOrders = orders.filter(order => 
    order.customer.emri.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.includes(searchTerm)
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
          
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-primary">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-serif text-primary mb-2">Magie Admin</h2>
            <p className="text-secondary text-sm">Secure Access Area</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-all"
                placeholder="Enter Password"
                autoFocus
                disabled={isChecking}
              />
              {error && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}
            </div>
            <button 
              type="submit" 
              disabled={isChecking}
              className="w-full bg-primary text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors uppercase tracking-widest text-xs disabled:opacity-70 flex justify-center items-center"
            >
              {isChecking ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Access Dashboard'}
            </button>
          </form>
          
          <button 
            onClick={onBack} 
            className="w-full mt-6 text-sm text-secondary hover:text-primary flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-serif font-bold text-primary">Orders Dashboard</h1>
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">{orders.length} total</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={loadOrders} className="text-secondary hover:text-primary p-2" title="Refresh">
              <RefreshCcw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onBack} className="text-sm text-secondary hover:text-primary">
              View Shop
            </button>
            <button onClick={handleLogout} className="text-secondary hover:text-red-500 flex items-center gap-2">
              <span className="text-xs hidden md:inline">Logout</span>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by name, email or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-medium">
                  <th className="p-4">Status</th>
                  <th className="p-4">Order Details</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoadingData ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-400">
                      <div className="flex justify-center items-center gap-2">
                         <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                         Loading orders...
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-400">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-xs font-mono text-gray-500">#{order.id.slice(0, 8)}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-primary">{order.customer.emri} {order.customer.mbiemri}</div>
                        <div className="text-xs text-gray-500">{order.customer.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-700">{order.customer.qyteti}</div>
                        <div className="text-xs text-gray-500">{order.customer.shteti}</div>
                        <div className="text-xs text-gray-400 mt-1 truncate max-w-[150px]" title={order.customer.adresa}>{order.customer.adresa}</div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-xs text-gray-600 flex items-center">
                              <span className="font-bold mr-1">{item.quantity}x</span> {item.product.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-serif font-medium">
                        ${order.total}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => toggleStatus(order.id, order.status)}
                          className={`text-xs font-medium hover:underline ${
                            order.status === 'pending' ? 'text-green-600' : 'text-yellow-600'
                          }`}
                        >
                          Mark {order.status === 'pending' ? 'Completed' : 'Pending'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
