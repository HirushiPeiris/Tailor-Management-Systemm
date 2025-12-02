import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import { 
  FiAlertTriangle, 
  FiClock, 
  FiPackage, 
  FiCalendar,
  FiUsers,
  FiScissors,
  FiShoppingBag,
  FiTrendingUp,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiBarChart2,
  FiPieChart,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFabricTable, setShowFabricTable] = useState(false);
  const [data, setData] = useState({
    fabricTypes: [],
    tailors: [],
    customers: [],
    orders: [],
    garmentTypes: [],
    fabricTypePercentages: []
  });

  const [percentages, setPercentages] = useState({});
  const [chartData, setChartData] = useState({
    distribution: [],
    status: [],
    trends: [],
    tailorsStatus: [],
    fabricTypeChart: []
  });

  // Blue color palettes
  const PIE_COLORS = ['#1e40af', '#3b82f6', '#0f488dff', '#85baf6ff', '#051d3aff', '#dbeafe'];
  const BAR_COLORS = ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];
  const FABRIC_COLORS = ['#1e40af', '#3b82f6', '#0f488dff', '#85baf6ff', '#051d3aff', '#dbeafe', '#1e3a8a', '#2563eb'];
  const TAILOR_STATUS_COLORS = ['#16a34a', '#dc2626'];
  const LINE_COLOR = '#1d4ed8';

  // Fetch all data from APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const baseUrl = 'https://tailorbackend.dockyardsoftware.com';

        const endpoints = [
          `${baseUrl}/Tailor/GetAllFabricType`,
          `${baseUrl}/Tailor/GetAllTailors`, 
          `${baseUrl}/Customer/GetAllCustomers`,
          `${baseUrl}/Order/GetOrders`,
          `${baseUrl}/Tailor/GetAllGarmentType`,
          `${baseUrl}/Tailor/GetFabTypePresentage`
        ];

        console.log('Starting API calls...');

        const responses = await Promise.all(
          endpoints.map(async (url, index) => {
            try {
              console.log(`Fetching from: ${url}`);
              const response = await fetch(url);
              
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              
              const data = await response.json();
              console.log(`Response from ${url}:`, data);
              
              if (data && Array.isArray(data.ResultSet)) {
                console.log(`Found ${data.ResultSet.length} items in ResultSet`);
                return data.ResultSet;
              } else {
                console.warn(`No ResultSet array found in response from ${url}:`, data);
                return [];
              }
            } catch (err) {
              console.error(`Failed to fetch ${url}:`, err);
              return [];
            }
          })
        );

        console.log('All API responses with counts:', responses.map(r => r.length));

        const newData = {
          fabricTypes: responses[0] || [],
          tailors: responses[1] || [],
          customers: responses[2] || [],
          orders: responses[3] || [],
          garmentTypes: responses[4] || [],
          fabricTypePercentages: responses[5] || []
        };

        console.log('Processed data counts:', {
          fabricTypes: newData.fabricTypes.length,
          tailors: newData.tailors.length,
          customers: newData.customers.length,
          orders: newData.orders.length,
          garmentTypes: newData.garmentTypes.length,
          fabricTypePercentages: newData.fabricTypePercentages.length
        });

        setData(newData);
        calculatePercentages(newData);
        prepareChartData(newData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate percentages for each category
  const calculatePercentages = (data) => {
    const totalCount = 
      (data.fabricTypes?.length || 0) +
      (data.tailors?.length || 0) + 
      (data.customers?.length || 0) +
      (data.orders?.length || 0) +
      (data.garmentTypes?.length || 0);

    console.log('Total count for percentages:', totalCount);

    if (totalCount === 0) {
      setPercentages({
        fabricTypes: 0,
        tailors: 0,
        customers: 0,
        orders: 0,
        garmentTypes: 0
      });
      return;
    }

    const percentages = {
      fabricTypes: ((data.fabricTypes?.length || 0) / totalCount * 100).toFixed(1),
      tailors: ((data.tailors?.length || 0) / totalCount * 100).toFixed(1),
      customers: ((data.customers?.length || 0) / totalCount * 100).toFixed(1),
      orders: ((data.orders?.length || 0) / totalCount * 100).toFixed(1),
      garmentTypes: ((data.garmentTypes?.length || 0) / totalCount * 100).toFixed(1)
    };

    console.log('Calculated percentages:', percentages);
    setPercentages(percentages);
  };

  // Prepare data for charts
  const prepareChartData = (data) => {
    const total = getTotal(data);
    console.log('Preparing chart data with total:', total);
    
    const distributionData = [
      { 
        name: 'Fabric Types', 
        value: data.fabricTypes?.length || 0, 
        percentage: total > 0 ? ((data.fabricTypes?.length || 0) / total * 100).toFixed(1) : 0 
      },
      { 
        name: 'Tailors', 
        value: data.tailors?.length || 0, 
        percentage: total > 0 ? ((data.tailors?.length || 0) / total * 100).toFixed(1) : 0 
      },
      { 
        name: 'Customers', 
        value: data.customers?.length || 0, 
        percentage: total > 0 ? ((data.customers?.length || 0) / total * 100).toFixed(1) : 0 
      },
      { 
        name: 'Orders', 
        value: data.orders?.length || 0, 
        percentage: total > 0 ? ((data.orders?.length || 0) / total * 100).toFixed(1) : 0 
      },
      { 
        name: 'Garment Types', 
        value: data.garmentTypes?.length || 0, 
        percentage: total > 0 ? ((data.garmentTypes?.length || 0) / total * 100).toFixed(1) : 0 
      }
    ];

    // Prepare fabric type percentage chart data - FIXED THIS PART
    const fabricTypeChartData = (data.fabricTypePercentages || [])
      .map(item => ({
        name: item.FabricTypeName || item.fabricTypeName || 'Unknown',
        percentage: parseFloat(item.FabricPercentage || item.fabricPercentage || item.percentage || 0),
        count: item.ItemCount || item.itemCount || item.count || 0,
        fabricTypeId: item.FabricTypeId || item.fabricTypeId,
        status: item.Status || item.status
      }))
      .filter(item => item.percentage > 0) // Only show fabrics with percentage > 0
      .sort((a, b) => b.percentage - a.percentage);

    console.log('Fabric type chart data:', fabricTypeChartData);

    const orderStatusData = (data.orders || []).reduce((acc, order) => {
      let status = order.status || order.Status || order.orderStatus || 'Pending';
      status = status.toLowerCase().trim();
      status = status.charAt(0).toUpperCase() + status.slice(1);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusChartData = Object.keys(orderStatusData).map(status => ({
      name: status,
      count: orderStatusData[status],
      percentage: data.orders?.length > 0 ? ((orderStatusData[status] / data.orders.length) * 100).toFixed(1) : 0
    }));

    const tailorsStatusData = (data.tailors || []).reduce((acc, tailor) => {
      let status = tailor.status || tailor.Status || tailor.isActive !== undefined ? (tailor.isActive ? 'Active' : 'Inactive') : 'Active';
      status = status.toLowerCase().trim();
      status = status.charAt(0).toUpperCase() + status.slice(1);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const tailorsStatusChartData = [
      { name: 'Active', count: tailorsStatusData['Active'] || 0, percentage: data.tailors?.length > 0 ? (((tailorsStatusData['Active'] || 0) / data.tailors.length) * 100).toFixed(1) : 0 },
      { name: 'Inactive', count: tailorsStatusData['Inactive'] || 0, percentage: data.tailors?.length > 0 ? (((tailorsStatusData['Inactive'] || 0) / data.tailors.length) * 100).toFixed(1) : 0 }
    ];

    const monthlyData = (data.orders || []).reduce((acc, order) => {
      const dateStr = order.orderDate || order.OrderDate || order.createdAt || order.CreatedAt || new Date().toISOString();
      const month = new Date(dateStr).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const trendData = Object.keys(monthlyData).map(month => ({
      month,
      orders: monthlyData[month]
    }));

    console.log('Chart data prepared:', {
      distribution: distributionData,
      status: statusChartData,
      trends: trendData,
      tailorsStatus: tailorsStatusChartData,
      fabricTypeChart: fabricTypeChartData
    });

    setChartData({
      distribution: distributionData,
      status: statusChartData,
      trends: trendData,
      tailorsStatus: tailorsStatusChartData,
      fabricTypeChart: fabricTypeChartData
    });
  };

  const getTotal = (data) => {
    return (
      (data.fabricTypes?.length || 0) +
      (data.tailors?.length || 0) +
      (data.customers?.length || 0) +
      (data.orders?.length || 0) +
      (data.garmentTypes?.length || 0)
    );
  };

  // Get recent orders (last 5 orders)
  const getRecentOrders = () => {
    if (!data.orders || data.orders.length === 0) return [];
    
    return data.orders
      .sort((a, b) => {
        const dateA = new Date(a.orderDate || a.OrderDate || a.createdAt || a.CreatedAt);
        const dateB = new Date(b.orderDate || b.OrderDate || b.createdAt || b.CreatedAt);
        return dateB - dateA;
      })
      .slice(0, 5);
  };

  // Get upcoming delivery alerts
  const getUpcomingDeliveries = () => {
    if (!data.orders || data.orders.length === 0) return [];
    
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return data.orders
      .filter(order => {
        const deliveryDate = new Date(order.deliveryDate || order.DeliveryDate);
        return deliveryDate >= today && deliveryDate <= nextWeek;
      })
      .sort((a, b) => {
        const dateA = new Date(a.deliveryDate || a.DeliveryDate);
        const dateB = new Date(b.deliveryDate || b.DeliveryDate);
        return dateA - dateB;
      });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'completed': return 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200/50';
      case 'in progress': return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50';
      case 'pending': return 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-200/50';
      case 'cancelled': return 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-200/50';
      default: return 'bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50';
    }
  };

  // Get delivery urgency
  const getDeliveryUrgency = (deliveryDate) => {
    if (!deliveryDate) return 'unknown';
    
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays <= 2) return 'urgent';
    if (diffDays <= 7) return 'upcoming';
    return 'normal';
  };

  // Handle fabric chart click to toggle table
  const handleFabricChartClick = () => {
    setShowFabricTable(!showFabricTable);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center p-6">
        <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div>
          <span className="text-slate-700 font-medium">Loading Dashboard Data...</span>
        </div>
      </div>
    );
  }

  const totalItems = getTotal(data);
  const recentOrders = getRecentOrders();
  const upcomingDeliveries = getUpcomingDeliveries();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-6 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
      {/* Header Section with 3D Effect */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center space-x-4 mb-3">
          <div className="p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
            <FiTrendingUp className="text-white text-xl" />
          </div>
          <div className="transform ">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-slate-600 mt-1">Real-time insights and analytics for your tailoring business</p>
          </div>
        </div>
      </div>

      {/* 3D Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 relative z-10">
        {[
          { 
            key: 'fabricTypes', 
            label: 'Fabric Types', 
            count: data.fabricTypes?.length || 0, 
            percentage: percentages.fabricTypes || 0,
            icon: FiScissors,
            color: 'from-blue-600 to-blue-700'
          },
          { 
            key: 'tailors', 
            label: 'Tailors', 
            count: data.tailors?.length || 0, 
            percentage: percentages.tailors || 0,
            icon: FiUsers,
            color: 'from-green-600 to-green-700'
          },
          { 
            key: 'customers', 
            label: 'Customers', 
            count: data.customers?.length || 0, 
            percentage: percentages.customers || 0,
            icon: FiUsers,
            color: 'from-purple-600 to-purple-700'
          },
          { 
            key: 'orders', 
            label: 'Orders', 
            count: data.orders?.length || 0, 
            percentage: percentages.orders || 0,
            icon: FiPackage,
            color: 'from-orange-600 to-orange-700'
          },
          { 
            key: 'garmentTypes', 
            label: 'Garment Types', 
            count: data.garmentTypes?.length || 0, 
            percentage: percentages.garmentTypes || 0,
            icon: FiShoppingBag,
            color: 'from-indigo-600 to-indigo-700'
          }
        ].map((item, index) => (
          <div key={item.key} className="group relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105`}></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{item.label}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-1">
                    {item.count}
                  </p>
                  <p className="text-sm font-semibold mt-1 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    {item.percentage}%
                  </p>
                </div>
                <div className={`p-3 bg-gradient-to-br ${item.color} rounded-2xl shadow-lg`}>
                  <item.icon className="text-white text-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 relative z-10">
        {/* Main Distribution Pie Chart */}
        {/* <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
              Overall Distribution
            </h3>
            {chartData.distribution && chartData.distribution.length > 0 && chartData.distribution.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.distribution.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.distribution.filter(item => item.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} items`, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                No distribution data available
              </div>
            )}
          </div>
        </div> */}

        {/* Main Distribution Pie Chart - Shows All Percentages with Smart Positioning */}
<div className="group relative">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
  <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
    <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
      Overall Distribution
    </h3>
    {chartData.distribution && chartData.distribution.length > 0 && chartData.distribution.some(item => item.value > 0) ? (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData.distribution.filter(item => item.value > 0)}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ 
              cx, 
              cy, 
              midAngle, 
              innerRadius, 
              outerRadius, 
              percent, 
              index 
            }) => {
              // Show ALL percentages
              const RADIAN = Math.PI / 180;
              const radius = outerRadius * 0.7; // Position label inside the segment
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              
              // For very small segments (<2%), use smaller font
              const fontSize = percent < 0.02 ? 9 : 11;
              
              return (
                <text
                  x={x}
                  y={y}
                  fill="#ffffff"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={fontSize}
                  fontWeight="bold"
                  className="drop-shadow-md"
                  stroke="#1e293b"
                  strokeWidth={0.5}
                >
                  {percent < 0.01 
                    ? `${(percent * 100).toFixed(1)}%` 
                    : `${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={1}
          >
            {chartData.distribution.filter(item => item.value > 0).map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={PIE_COLORS[index % PIE_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [`${value} items`, name]}
            contentStyle={{ 
              fontSize: '13px',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '11px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <div className="h-64 flex items-center justify-center text-slate-500">
        No distribution data available
      </div>
    )}
  </div>
</div>

        {/* Order Status Distribution */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
              Order Status Distribution
            </h3>
            {chartData.status && chartData.status.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.status}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'percentage') return [`${value}%`, 'Percentage'];
                      return [value, 'Count'];
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name="Order Count"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.status.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                No order status data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fabric Type Percentage Section */}
      <div className="mb-6 relative z-10">
        {/* Fabric Type Percentage Chart - Clickable */}
        <div 
          className="group relative cursor-pointer mb-4"
          onClick={handleFabricChartClick}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                  <FiBarChart2 className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Fabric Type Usage Percentage
                  </h3>
                  <p className="text-sm text-slate-600">Click to {showFabricTable ? 'hide' : 'show'} detailed table</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                {showFabricTable ? (
                  <FiChevronUp className="w-5 h-5" />
                ) : (
                  <FiChevronDown className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {showFabricTable ? 'Hide Table' : 'Show Table'}
                </span>
              </div>
            </div>
            {chartData.fabricTypeChart && chartData.fabricTypeChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.fabricTypeChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'percentage') return [`${value}%`, 'Percentage'];
                      if (name === 'count') return [value, 'Item Count'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="percentage" 
                    name="Usage Percentage"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.fabricTypeChart.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={FABRIC_COLORS[index % FABRIC_COLORS.length]}
                        className="cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                No fabric type data available
              </div>
            )}
          </div>
        </div>

        {/* Fabric Type Table - Conditionally Rendered */}
        {showFabricTable && (
          <div className="group relative mt-4 transition-all duration-300 ease-out">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 transform transition duration-300 group-hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                    <FiBarChart2 className="text-white text-lg" />
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Fabric Type Detailed Statistics
                  </h3>
                </div>
                <div className="flex items-center text-slate-600">
                  <span className="text-sm">Sorted by Usage %</span>
                </div>
              </div>
              
              {chartData.fabricTypeChart && chartData.fabricTypeChart.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-200/50">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
                        <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Fabric Type</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Item Count</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Percentage</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50">
                      {chartData.fabricTypeChart.map((fabric, index) => (
                        <tr 
                          key={index}
                          className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-3 shadow-lg"
                                style={{ backgroundColor: FABRIC_COLORS[index % FABRIC_COLORS.length] }}
                              ></div>
                              <span className="font-medium text-slate-800">
                                {fabric.name || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                              {fabric.count || 0}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-24 bg-slate-200 rounded-full h-2 mr-3">
                                <div 
                                  className="h-2 rounded-full shadow-lg"
                                  style={{ 
                                    width: `${fabric.percentage || 0}%`,
                                    backgroundColor: FABRIC_COLORS[index % FABRIC_COLORS.length]
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold text-slate-700">
                                {fabric.percentage ? parseFloat(fabric.percentage).toFixed(1) : 0}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                              fabric.status === 'Active' || fabric.status === null || fabric.status === undefined
                                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200/50' 
                                : 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-200/50'
                            }`}>
                              {fabric.status === 'Active' || fabric.status === null || fabric.status === undefined ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <FiBarChart2 className="text-4xl mx-auto mb-3 text-slate-400" />
                  <p className="text-lg">No fabric type data available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Charts Section - Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 relative z-10">
        {/* Order Trends */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
              Order Trends
            </h3>
            {chartData.trends && chartData.trends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke={LINE_COLOR}
                    strokeWidth={3}
                    dot={{ fill: LINE_COLOR, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#1e40af' }}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                No trend data available
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Deliveries */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Upcoming Deliveries
              </h3>
              <div className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 rounded-xl shadow-lg">
                <FiClock className="text-white text-sm" />
              </div>
            </div>
            {upcomingDeliveries.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {upcomingDeliveries.map((order, index) => {
                  const urgency = getDeliveryUrgency(order.deliveryDate || order.DeliveryDate);
                  const urgencyColors = {
                    overdue: 'bg-gradient-to-br from-red-500 to-red-600 text-white border-red-400',
                    today: 'bg-gradient-to-br from-red-500 to-red-600 text-white border-red-400',
                    urgent: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-400',
                    upcoming: 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-yellow-400',
                    normal: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400'
                  };
                  
                  return (
                    <div 
                      key={index}
                      className={`border rounded-2xl p-4 ${urgencyColors[urgency]} shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold">
                          Order #{order.orderId || order.OrderId || 'N/A'}
                        </span>
                        <FiClock className="text-lg" />
                      </div>
                      <div className="text-sm">
                        <div className="flex justify-between mb-2">
                          <span className="opacity-90">Delivery:</span>
                          <span className="font-medium">
                            {formatDate(order.deliveryDate || order.DeliveryDate)}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="opacity-90">Order Date:</span>
                          <span className="font-medium">
                            {formatDate(order.orderDate || order.OrderDate)}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium shadow-lg`}>
                            {urgency === 'today' ? 'Due Today!' : 
                             urgency === 'overdue' ? 'Overdue!' : 
                             urgency === 'urgent' ? 'Urgent' : 
                             urgency === 'upcoming' ? 'Upcoming' : 'Scheduled'}
                          </span>
                          {order.status && (
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || order.Status)}`}>
                              {order.status || order.Status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                <FiClock className="text-4xl mb-3 text-slate-400" />
                <p className="text-lg">No upcoming deliveries</p>
                <p className="text-sm mt-1">in the next 7 days</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center relative z-10">
        <button
          onClick={() => window.location.reload()}
          className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl flex items-center justify-center mx-auto"
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
          <FiRefreshCw className="mr-3 relative z-10" />
          <span className="relative z-10">Refresh Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;