import React from 'react';
import { 
  FiUser, FiShoppingBag, FiDollarSign, FiBox, 
  FiClock, FiCheckCircle, FiTruck, FiHome,
  FiCalendar, FiSettings, FiPieChart, FiScissors
} from 'react-icons/fi';

function Dashboard() {
  const stats = [
    { title: "Customers", value: "142", icon: <FiUser className="text-blue-400" />, trend: "up" },
    { title: "Active Orders", value: "28", icon: <FiShoppingBag className="text-purple-400" />, trend: "up" },
    { title: "Revenue", value: "$8,420", icon: <FiDollarSign className="text-green-400" />, trend: "up" },
    { title: "Inventory", value: "42 rolls", icon: <FiBox className="text-yellow-400" />, trend: "down" }
  ];

  const orders = [
    { id: "#T-1024", customer: "Sarah Johnson", amount: "$185", status: "progress", icon: <FiClock className="text-amber-400" /> },
    { id: "#T-1023", customer: "Michael Chen", amount: "$220", status: "completed", icon: <FiCheckCircle className="text-emerald-400" /> },
    { id: "#T-1022", customer: "Emma Wilson", amount: "$150", status: "shipped", icon: <FiTruck className="text-blue-400" /> }
  ];

  const fabrics = [
    { type: "Cotton", quantity: "15 rolls", percent: 65 },
    { type: "Silk", quantity: "8 rolls", percent: 35 },
    { type: "Wool", quantity: "12 rolls", percent: 50 },
    { type: "Linen", quantity: "7 rolls", percent: 30 }
  ];

  const navItems = [
    { name: "Dashboard", icon: <FiHome />, active: true },
    { name: "Orders", icon: <FiShoppingBag /> },
    { name: "Customers", icon: <FiUser /> },
    { name: "Inventory", icon: <FiBox /> },
    { name: "Calendar", icon: <FiCalendar /> },
    { name: "Reports", icon: <FiPieChart /> },
    { name: "Settings", icon: <FiSettings /> }
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Yellow Sidebar Navigation */}
      <div className="w-64 bg-yellow-500 border-r border-yellow-600 p-4 hidden md:block">
        <div className="flex items-center space-x-2 mb-8 p-2">
          <FiScissors className="text-gray-900 text-xl" />
          <h2 className="text-xl font-bold text-gray-900">TailorPro</h2>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <a 
              key={index}
              href="#" 
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                item.active ? 'bg-yellow-400 text-gray-900 font-medium' : 'hover:bg-yellow-400 hover:text-gray-900 text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-yellow-600">
          <div className="p-3 text-sm text-gray-900">
            <p>Need help?</p>
            <p className="text-gray-800 font-medium mt-1">Contact Support</p>
          </div>
        </div>
      </div>

      {/* Mobile Navbar (yellow) */}
      <div className="md:hidden bg-yellow-500 border-b border-yellow-600 p-4 w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FiScissors className="text-gray-900 text-xl" />
            <h2 className="text-xl font-bold text-gray-900">TailorPro</h2>
          </div>
          <button className="p-2 text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's your business snapshot</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium">
              Settings
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium">
              New Order
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className="p-2 bg-gray-700 rounded-lg">
                  {stat.icon}
                </div>
              </div>
              <div className={`mt-3 text-xs font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend === 'up' ? '↑ 12% from last month' : '↓ 3% from last month'}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Section */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
            </div>
            
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-850 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-700 rounded-lg">
                      {order.icon}
                    </div>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-gray-400">{order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'progress' ? 'bg-amber-900 text-amber-300' :
                      order.status === 'completed' ? 'bg-emerald-900 text-emerald-300' :
                      'bg-blue-900 text-blue-300'
                    }`}>
                      {order.status === 'progress' ? 'In Progress' : 
                       order.status === 'completed' ? 'Completed' : 'Shipped'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-6">Fabric Inventory</h2>
            
            <div className="space-y-5">
              {fabrics.map((fabric, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{fabric.type}</span>
                    <span className="text-gray-400">{fabric.quantity}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-purple-500' :
                        index === 2 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${fabric.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex flex-col items-center">
                  <FiUser className="mb-1 text-blue-400" />
                  Add Client
                </button>
                <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex flex-col items-center">
                  <FiShoppingBag className="mb-1 text-purple-400" />
                  New Order
                </button>
                <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex flex-col items-center">
                  <FiBox className="mb-1 text-yellow-400" />
                  Add Fabric
                </button>
                <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex flex-col items-center">
                  <FiDollarSign className="mb-1 text-green-400" />
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;