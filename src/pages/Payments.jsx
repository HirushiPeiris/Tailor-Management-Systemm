import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiPlus,
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit,
  FiCreditCard,
  FiTrendingUp,
  FiClock,
  FiAlertTriangle,
  FiDollarSign
} from 'react-icons/fi';
import { 
  FaMoneyBillWave
} from 'react-icons/fa';

// Redux actions
import { 
  GetAllPayment, 
  AddPayment
} from '../actions/paymentActions';

// Import GetOrders action to get order details for priority filtering
import { GetOrders } from '../actions/orderAction';

// Payment method configurations
const paymentMethods = [
  {
    id: 'cash',
    name: 'Cash',
    icon: FaMoneyBillWave,
    description: 'Pay with cash on delivery',
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-gradient-to-br from-slate-50 to-slate-100',
    borderColor: 'border-slate-200'
  }
];

// Function to format numbers with thousand separators
const formatNumberWithCommas = (number) => {
  if (number === null || number === undefined || isNaN(number)) return '0.00';
  return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

function Payments() {
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    responseBody: paymentsData, 
    loading: paymentsLoading, 
    error: paymentsError,
    msg: paymentsMsg 
  } = useSelector(state => state.getAllPayment);

  const { 
    loading: addPaymentLoading, 
    error: addPaymentError,
    msg: addPaymentMsg 
  } = useSelector(state => state.addPayment);

  // Orders state for priority filtering
  const { 
    responseBody: allOrdersData,
    loading: ordersLoading,
    error: ordersError
  } = useSelector(state => state.orderList);

  // Local state management
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showMethodSelection, setShowMethodSelection] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [notification, setNotification] = useState(null);
  const [formError, setFormError] = useState('');
  const [activeTab, setActiveTab] = useState('payments'); // 'payments' or 'pending'
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all', 'priority', 'high', 'urgent'
  
  const [payment, setPayment] = useState({
    orderId: '',
    paidAmount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    method: 'Cash',
    status: 'Pending'
  });

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);

  // Handle resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter only cash payments and sort by PaymentId descending (newest first)
  const cashPayments = paymentsData && Array.isArray(paymentsData) 
    ? paymentsData
        .filter(p => p.Method === 'Cash')
        .map(p => ({
          ...p,
          PaidAmount: parseFloat(p.PaidAmount) || 0,
          PaymentId: parseInt(p.PaymentId) || p.PaymentId,
          OrderId: parseInt(p.OrderId) || p.OrderId,
          Status: p.Status || 'Pending'
        }))
        .sort((a, b) => (b.PaymentId || 0) - (a.PaymentId || 0))
    : [];

  // Get all orders with their payment status
  const allOrders = allOrdersData && Array.isArray(allOrdersData) 
    ? allOrdersData.map(order => ({
        ...order,
        OrderId: parseInt(order.OrderId) || order.OrderId,
        CustomerId: parseInt(order.CustomerId) || order.CustomerId,
        TotalAmount: parseFloat(order.TotalAmount) || 0,
        AdvanceAmount: parseFloat(order.AdvanceAmount) || 0,
        BalanceAmount: parseFloat(order.BalanceAmount) || 0,
        // Calculate balance if not provided
        calculatedBalance: parseFloat(order.TotalAmount || 0) - parseFloat(order.AdvanceAmount || 0),
        // Check if order has any payment
        hasPayment: cashPayments.some(payment => payment.OrderId === order.OrderId),
        // Get payment status if exists
        paymentStatus: cashPayments.find(payment => payment.OrderId === order.OrderId)?.Status || 'No Payment',
        // Get latest payment for this order
        latestPayment: cashPayments.filter(payment => payment.OrderId === order.OrderId)
          .sort((a, b) => new Date(b.PaymentDate) - new Date(a.PaymentDate))[0]
      }))
    : [];

  // Get in-progress AND priority orders that haven't been paid (no completed payments)
  const inProgressAndPriorityUnpaidOrders = allOrders.filter(order => {
    const hasCompletedPayment = cashPayments.some(
      payment => payment.OrderId === order.OrderId && payment.Status === 'Completed'
    );
    
    // Check if order is in progress OR priority (applying the same logic as Orders component)
    const isInProgress = order.Status === 'In Progress' || 
                        order.Status === 'inprogress' || 
                        order.Status === 'Processing' ||
                        order.OrderStatus === 'In Progress';
    
    // Check if order is priority (using the same logic as Orders component)
    const isPriority = order.Status === 'priority' || 
                      order.Priority === 'High' || 
                      order.Priority === 'Urgent' ||
                      order.Priority === 'priority';
    
    return (isInProgress || isPriority) && !hasCompletedPayment;
  });

  // Filter priority in-progress unpaid orders with enhanced priority detection
  const getPriorityInProgressOrders = (priorityLevel = 'all') => {
    let filtered = inProgressAndPriorityUnpaidOrders;
    
    // Apply priority filter - matching the Orders component logic
    if (priorityLevel === 'priority') {
      filtered = filtered.filter(order => 
        order.Status === 'priority' || 
        order.Priority === 'High' || 
        order.Priority === 'Urgent' ||
        order.Priority === 'priority'
      );
    } else if (priorityLevel === 'high') {
      filtered = filtered.filter(order => 
        order.Priority === 'High' || order.Priority === 'Urgent'
      );
    } else if (priorityLevel === 'urgent') {
      filtered = filtered.filter(order => order.Priority === 'Urgent');
    }
    
    // Sort by priority and due date (matching Orders component logic)
    return filtered.sort((a, b) => {
      // Priority order matching your Orders component
      const priorityOrder = { 
        'Urgent': 1, 
        'High': 2, 
        'priority': 3, // Added priority status
        'Normal': 4, 
        'Low': 5 
      };
      
      const priorityA = priorityOrder[a.Priority] || priorityOrder[a.Status] || 4;
      const priorityB = priorityOrder[b.Priority] || priorityOrder[b.Status] || 4;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, sort by due date or delivery date
      const dateA = a.DueDate ? new Date(a.DueDate) : (a.DeliveryDate ? new Date(a.DeliveryDate) : new Date());
      const dateB = b.DueDate ? new Date(b.DueDate) : (b.DeliveryDate ? new Date(b.DeliveryDate) : new Date());
      return dateA - dateB;
    });
  };

  const priorityInProgressOrders = getPriorityInProgressOrders(priorityFilter);

  // Calculate statistics - FIXED: Count all cash payments as completed
  const totalRevenue = cashPayments.reduce((sum, p) => sum + (p.PaidAmount || 0), 0);
  
  // FIXED: Since your payment records might not have 'Completed' status,
  // count ALL cash payments as completed (because they're in the table)
  const completedPaymentsCount = cashPayments.length;
  
  const inProgressUnpaidCount = inProgressAndPriorityUnpaidOrders.length;

  // Filter payments for search
  const filteredPayments = cashPayments.filter(
    (p) =>
      p.OrderId?.toString().includes(search.toLowerCase()) ||
      p.Status?.toLowerCase().includes(search.toLowerCase())
  );

  // Filter in-progress orders for search
  const filteredInProgressOrders = priorityInProgressOrders.filter(
    (order) =>
      order.OrderId?.toString().includes(search.toLowerCase()) ||
      order.CustomerId?.toString().includes(search.toLowerCase()) ||
      order.Priority?.toLowerCase().includes(search.toLowerCase()) ||
      order.Status?.toLowerCase().includes(search.toLowerCase()) ||
      order.CustomerName?.toLowerCase().includes(search.toLowerCase()) ||
      (order.Customer?.Name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (order.Customer?.FullName?.toLowerCase() || '').includes(search.toLowerCase())
  );

  // Pagination logic for payments
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const currentInProgressOrders = filteredInProgressOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    (activeTab === 'payments' ? filteredPayments.length : filteredInProgressOrders.length) / itemsPerPage
  );

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, priorityFilter]);

  // Pagination 3-page sliding window
  const getPageNumbers = () => {
    if (totalPages <= (isMobile ? 2 : 3)) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    let startPage = Math.max(1, currentPage - (isMobile ? 0 : 1));
    let endPage = Math.min(totalPages, currentPage + (isMobile ? 1 : 1));
    
    if (currentPage === 1) {
      endPage = isMobile ? 2 : 3;
    }
    if (currentPage === totalPages) {
      startPage = totalPages - (isMobile ? 1 : 2);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pageNumbers = getPageNumbers();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  // Open add payment modal with order pre-filled
  const openAddModal = (order) => {
    setShowMethodSelection(true);
    setPayment({
      orderId: order?.OrderId || '',
      paidAmount: order?.BalanceAmount || order?.calculatedBalance || order?.TotalAmount || '',
      paymentDate: new Date().toISOString().split('T')[0],
      method: 'Cash',
      status: 'Pending'
    });
    setEditingId(null);
    setFormError('');
  };

  // Open edit payment modal
  const openEditModal = (id) => {
    const pay = cashPayments.find((p) => p.PaymentId === id);
    if (pay) {
      setPayment({
        orderId: pay.OrderId,
        paidAmount: pay.PaidAmount,
        paymentDate: pay.PaymentDate,
        method: 'Cash',
        status: pay.Status || 'Pending'
      });
      setEditingId(id);
      setFormError('');
      setShowModal(true);
    }
  };

  // Select payment method
  const selectPaymentMethod = (method) => {
    setSelectedMethod(method);
    setPayment(prev => ({ ...prev, method: 'Cash' }));
    setShowMethodSelection(false);
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!payment.orderId || !payment.paidAmount || !payment.paymentDate) {
      setFormError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (isNaN(payment.paidAmount) || Number(payment.paidAmount) <= 0) {
      setFormError('Paid amount must be a positive number');
      setLoading(false);
      return;
    }

    // Prepare payment data for API
    const paymentData = {
      OrderId: Number(payment.orderId),
      PaidAmount: Number(payment.paidAmount),
      PaymentDate: payment.paymentDate,
      Method: 'Cash',
      Status: payment.status
    };

    try {
      // Dispatch AddPayment action
      await dispatch(AddPayment(paymentData));
      
      // Show success notification
      setNotification({ 
        type: 'success', 
        message: editingId ? 'Payment updated successfully!' : 'Payment added successfully!' 
      });
      
      // Close modal and refresh data
      setShowModal(false);
      dispatch(GetAllPayment());
      dispatch(GetOrders()); // Refresh orders to update payment status
      
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: 'Failed to process payment. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Get priority display info
  const getPriorityInfo = (order) => {
    // Check both Status and Priority fields like in Orders component
    const priorityValue = order.Status === 'priority' ? 'priority' : (order.Priority || 'Normal');
    
    switch (priorityValue) {
      case 'priority':
        return {
          color: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
          borderColor: 'border-l-red-400',
          bgColor: 'bg-gradient-to-r from-white to-red-50/30',
          icon: <FiAlertTriangle className="mr-1" size={12} />,
          text: 'Priority'
        };
      case 'Urgent':
        return {
          color: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
          borderColor: 'border-l-red-400',
          bgColor: 'bg-gradient-to-r from-white to-red-50/30',
          icon: <FiAlertTriangle className="mr-1" size={12} />,
          text: 'Urgent'
        };
      case 'High':
        return {
          color: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
          borderColor: 'border-l-orange-400',
          bgColor: 'bg-gradient-to-r from-white to-orange-50/30',
          icon: <FiClock className="mr-1" size={12} />,
          text: 'High'
        };
      case 'Low':
        return {
          color: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
          borderColor: 'border-l-green-400',
          bgColor: 'bg-gradient-to-r from-white to-green-50/30',
          icon: <FiCheckCircle className="mr-1" size={12} />,
          text: 'Low'
        };
      default:
        return {
          color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
          borderColor: 'border-l-blue-400',
          bgColor: 'bg-gradient-to-r from-white to-blue-50/30',
          icon: <FiCheckCircle className="mr-1" size={12} />,
          text: 'Normal'
        };
    }
  };

  // Get status display info - SIMPLIFIED without toggle buttons
  const getStatusInfo = (status) => {
    const statusLower = (status || '').toLowerCase();
    const isActive = statusLower === 'completed';
    
    if (isActive) {
      return { 
        text: 'Completed', 
        color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50'
      };
    } else {
      return { 
        text: 'Pending', 
        color: 'bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50'
      };
    }
  };

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return 'Invalid date';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${formatNumberWithCommas(amount)}`;
  };

  // Load payments and orders on component mount
  useEffect(() => {
    dispatch(GetAllPayment());
    dispatch(GetOrders());
  }, [dispatch]);

  // Handle notifications from Redux actions
  useEffect(() => {
    if (addPaymentMsg) {
      if (addPaymentError) {
        setNotification({ type: 'error', message: addPaymentMsg });
      }
      setLoading(false);
    }
  }, [addPaymentMsg, addPaymentError]);

  useEffect(() => {
    if (paymentsError) {
      setNotification({ type: 'error', message: paymentsMsg || 'Failed to load payments' });
    }
  }, [paymentsError, paymentsMsg]);

  useEffect(() => {
    if (ordersError) {
      setNotification({ type: 'error', message: 'Failed to load orders' });
    }
  }, [ordersError]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Debug: Log payment data to console
  useEffect(() => {
    if (paymentsData && !paymentsLoading) {
      console.log('Payment Data from API:', paymentsData);
      console.log('Filtered Cash Payments:', cashPayments);
      console.log('Completed Payments Count:', cashPayments.length);
    }
  }, [paymentsData, paymentsLoading, cashPayments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-3 sm:p-4 md:p-6 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
      {/* 3D Notification */}
      {notification && (
        <div
          className={`fixed top-4 sm:top-6 right-4 sm:right-6 z-50 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center transition-all duration-500 transform ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200/50 border-l-4 border-l-blue-400' 
              : notification.type === 'error'
              ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200/50 border-l-4 border-l-rose-400'
              : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-yellow-200/50 border-l-4 border-l-yellow-400'
          } animate-bounce-in`}
          role="alert"
        >
          <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
            {notification.type === 'success' ? (
              <FiCheckCircle className="text-white" size={16} />
            ) : notification.type === 'error' ? (
              <FiAlertCircle className="text-white" size={16} />
            ) : (
              <FiAlertCircle className="text-white" size={16} />
            )}
          </div>
          <span className="font-semibold text-xs sm:text-sm">{notification.message}</span>
        </div>
      )}

      {/* Header Section with 3D Effect */}
      <div className="relative z-10 mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
          {/* Left side: Title and icon */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
              <FiCreditCard className="text-white text-lg sm:text-xl" />
            </div>
            <div className="transform ">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Cash Payments
              </h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">
                {activeTab === 'payments' ? 'Process and monitor cash payment transactions' : 'Manage pending payments'}
              </p>
            </div>
          </div>

          {/* Right side: Tabs Navigation */}
          <div className="w-full lg:w-auto mt-3 lg:mt-0">
            <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/20">
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                  activeTab === 'payments'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                Payment History
              </button>
              <button
                onClick={() => setActiveTab('inprogress')}
                className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                  activeTab === 'inprogress'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                Pending Payments
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Stats Cards - Only 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 relative z-10">
        {/* Total Revenue Card */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Total Revenue</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
                <FiTrendingUp className="text-white text-sm sm:text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Completed Payments Card - Shows ALL cash payments count */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Completed Payments</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
                  {completedPaymentsCount}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
                <FiCheckCircle className="text-white text-sm sm:text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Payments Card */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Pending Payments</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
                  {inProgressUnpaidCount}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
                <FiClock className="text-white text-sm sm:text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row flex-grow gap-3 sm:gap-4 w-full">
          <div className="relative flex-grow group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
            <input
              type="text"
              placeholder={
                activeTab === 'payments' 
                  ? "Search by Order ID or Status" 
                  : "Search by Order ID, Customer ID, or Status"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
            />
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'payments' ? (
        /* Payment History Content */
        <PaymentHistoryContent 
          paymentsLoading={paymentsLoading}
          currentPayments={currentPayments}
          paymentsError={paymentsError}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getStatusInfo={getStatusInfo}
          openEditModal={openEditModal}
          filteredPayments={filteredPayments}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          pageNumbers={pageNumbers}
          isMobile={isMobile}
          isSmallMobile={isSmallMobile}
        />
      ) : (
        /* Pending Orders Content - Table View */
        <PendingOrdersTableContent
          ordersLoading={ordersLoading || paymentsLoading}
          filteredInProgressOrders={filteredInProgressOrders}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getPriorityInfo={getPriorityInfo}
          openAddModal={openAddModal}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          pageNumbers={pageNumbers}
          isMobile={isMobile}
          isSmallMobile={isSmallMobile}
        />
      )}

      {/* Payment Method Selection Modal */}
      {showMethodSelection && (
        <PaymentMethodModal
          setShowMethodSelection={setShowMethodSelection}
          paymentMethods={paymentMethods}
          selectPaymentMethod={selectPaymentMethod}
          isMobile={isMobile}
          isSmallMobile={isSmallMobile}
        />
      )}

      {/* Add/Edit Payment Modal */}
      {showModal && (
        <PaymentModal
          setShowModal={setShowModal}
          setFormError={setFormError}
          editingId={editingId}
          payment={payment}
          formError={formError}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          addPaymentLoading={addPaymentLoading}
          loading={loading}
          isMobile={isMobile}
          isSmallMobile={isSmallMobile}
        />
      )}
    </div>
  );
}

// Separate component for Payment History Content
const PaymentHistoryContent = ({
  paymentsLoading,
  currentPayments,
  paymentsError,
  formatCurrency,
  formatDate,
  getStatusInfo,
  openEditModal,
  filteredPayments,
  itemsPerPage,
  currentPage,
  totalPages,
  setCurrentPage,
  pageNumbers,
  isMobile,
  isSmallMobile
}) => {
  if (paymentsLoading) {
    return (
      <div className="relative z-10 flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = currentPage * itemsPerPage;

  return (
    <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Payment ID</th>
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Order ID</th>
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Amount</th>
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Date</th>
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {currentPayments.length > 0 ? (
              currentPayments.map((p) => {
                const statusInfo = getStatusInfo(p.Status || 'Pending');
                
                return (
                  <tr key={p.PaymentId} className="hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30 border-l-4 border-l-blue-400 group">
                    <td className="px-2 py-3 text-center text-slate-600 text-sm whitespace-nowrap">
                      {p.PaymentId}
                    </td>
                    <td className="px-2 py-3 text-center text-slate-600 text-sm whitespace-nowrap">
                      {p.OrderId}
                    </td>
                    <td className="px-2 py-3 text-center text-slate-600 text-sm whitespace-nowrap">
                      {formatCurrency(p.PaidAmount)}
                    </td>
                    <td className="px-2 py-3 text-center text-slate-600 text-sm whitespace-nowrap">
                      {formatDate(p.PaymentDate)}
                    </td>
                    <td className="px-2 py-3 text-center text-slate-600 text-sm whitespace-nowrap">
                      <span className="text-slate-600">Cash</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 sm:py-12">
                  <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                      <FiCreditCard className="text-slate-500 text-lg sm:text-xl" />
                    </div>
                    <p className="text-slate-500 font-medium text-sm sm:text-base">
                      {paymentsError ? 'Failed to load payments' : 'No cash payments found'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards for Payments */}
      <div className="lg:hidden p-4 space-y-4">
        {currentPayments.length > 0 ? (
          currentPayments.map((p) => {
            const statusInfo = getStatusInfo(p.Status || 'Pending');
            
            return (
              <div key={p.PaymentId} className="rounded-2xl p-4 shadow-lg bg-gradient-to-r from-white to-blue-50/30 border-l-4 border-l-blue-400">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Payment ID</p>
                    <p className="text-sm font-semibold text-slate-700">{p.PaymentId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Order ID</p>
                    <p className="text-sm font-semibold text-slate-700">{p.OrderId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Amount</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {formatCurrency(p.PaidAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Date</p>
                    <p className="text-sm font-semibold text-slate-700">{formatDate(p.PaymentDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Method</p>
                    <p className="text-sm font-semibold text-slate-600">Cash</p>
                  </div>
                  <span className={`inline-flex items-center justify-center w-24 px-2 py-1.5 rounded-full font-semibold text-xs tracking-wide ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                <FiCreditCard className="text-slate-500 text-xl" />
              </div>
              <p className="text-slate-500 font-medium">
                {paymentsError ? 'Failed to load payments' : 'No cash payments found'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredPayments.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
          <div className="text-xs sm:text-sm text-slate-600 font-medium">
            Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredPayments.length)} of{' '}
            {filteredPayments.length}
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              <FiChevronLeft size={isSmallMobile ? 12 : 14} />
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm min-w-[32px] sm:min-w-[36px] ${
                  page === currentPage
                    ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              <FiChevronRight size={isSmallMobile ? 12 : 14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Separate component for Pending Orders Table Content
const PendingOrdersTableContent = ({
  ordersLoading,
  filteredInProgressOrders,
  formatCurrency,
  formatDate,
  getPriorityInfo,
  openAddModal,
  itemsPerPage,
  currentPage,
  totalPages,
  setCurrentPage,
  pageNumbers,
  isMobile,
  isSmallMobile
}) => {
  if (ordersLoading) {
    return (
      <div className="relative z-10 flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const currentItems = filteredInProgressOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = currentPage * itemsPerPage;

  return (
    <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
      {/* Desktop Table for Pending Orders */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Order ID</th>
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Customer ID</th>
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Order Date</th>
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Delivery Date</th>
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Status</th>
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Total Amount</th>
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Advance Amount</th>
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Balance Amount</th>
              <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Updated Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {currentItems.length > 0 ? (
              currentItems.map((order) => {
                const priorityInfo = getPriorityInfo(order);
                const balanceAmount = order.BalanceAmount || order.calculatedBalance || 0;
                
                return (
                  <tr key={order.OrderId} className="hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-orange-50/30 border-l-4 border-l-orange-400 group">
                    <td className="px-2 py-3 text-center text-slate-600 text-sm font-semibold whitespace-nowrap">
                      {order.OrderId}
                    </td>
                    <td className="px-2 py-3 text-center text-slate-600 text-sm whitespace-nowrap">
                      {order.CustomerId}
                    </td>
                    <td className="px-2 py-3 text-center text-slate-600 text-sm whitespace-nowrap">
                      {formatDate(order.OrderDate)}
                    </td>
                    <td className="px-2 py-3 text-center text-slate-600 text-sm whitespace-nowrap">
                      {formatDate(order.DeliveryDate)}
                    </td>
                    <td className="px-2 py-3 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center px-2 py-1.5 rounded-full font-semibold text-xs tracking-wide ${priorityInfo.color} whitespace-nowrap`}>
                        {priorityInfo.icon}
                        {priorityInfo.text}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center text-slate-600 text-sm font-semibold whitespace-nowrap">
                      {formatCurrency(order.TotalAmount)}
                    </td>
                    <td className="px-2 py-3 text-center text-slate-600 text-sm whitespace-nowrap">
                      {formatCurrency(order.AdvanceAmount)}
                    </td>
                    <td className="px-2 py-3 text-center text-slate-600 text-sm font-semibold whitespace-nowrap">
                      {formatCurrency(balanceAmount)}
                    </td>
                    <td className="px-2 py-3 text-center text-slate-600 text-sm whitespace-nowrap">
                      {formatDate(order.UpdatedDate)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-8 sm:py-12">
                  <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                      <FiClock className="text-slate-500 text-lg sm:text-xl" />
                    </div>
                    <p className="text-slate-500 font-medium text-sm sm:text-base">
                      No pending orders found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards for Pending Orders */}
      <div className="lg:hidden p-4 space-y-4">
        {currentItems.length > 0 ? (
          currentItems.map((order) => {
            const priorityInfo = getPriorityInfo(order);
            const balanceAmount = order.BalanceAmount || order.calculatedBalance || 0;
            
            return (
              <div key={order.OrderId} className="rounded-2xl p-4 shadow-lg bg-gradient-to-r from-white to-orange-50/30 border-l-4 border-l-orange-400">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Order ID</p>
                    <p className="text-sm font-semibold text-slate-700">{order.OrderId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Customer ID</p>
                    <p className="text-sm font-semibold text-slate-700">{order.CustomerId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Order Date</p>
                    <p className="text-sm font-semibold text-slate-700">{formatDate(order.OrderDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Delivery Date</p>
                    <p className="text-sm font-semibold text-slate-700">{formatDate(order.DeliveryDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${priorityInfo.color}`}>
                      {priorityInfo.icon}
                      {priorityInfo.text}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Updated Date</p>
                    <p className="text-sm font-semibold text-slate-700">{formatDate(order.UpdatedDate)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 font-medium">Total</p>
                    <p className="text-sm font-semibold text-slate-800">{formatCurrency(order.TotalAmount)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 font-medium">Advance</p>
                    <p className="text-sm font-semibold text-slate-700">{formatCurrency(order.AdvanceAmount)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 font-medium">Balance</p>
                    <p className="text-sm font-semibold text-slate-800">{formatCurrency(balanceAmount)}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                <FiClock className="text-slate-500 text-xl" />
              </div>
              <p className="text-slate-500 font-medium">
                No pending orders found
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination for Pending Orders */}
      {filteredInProgressOrders.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
          <div className="text-xs sm:text-sm text-slate-600 font-medium">
            Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredInProgressOrders.length)} of{' '}
            {filteredInProgressOrders.length}
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              <FiChevronLeft size={isSmallMobile ? 12 : 14} />
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm min-w-[32px] sm:min-w-[36px] ${
                  page === currentPage
                    ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              <FiChevronRight size={isSmallMobile ? 12 : 14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Separate Payment Method Modal Component
const PaymentMethodModal = ({ setShowMethodSelection, paymentMethods, selectPaymentMethod, isMobile, isSmallMobile }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
    <div className="relative w-full max-w-md mx-2 sm:mx-4">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setShowMethodSelection(false)}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
        >
          <FiX className="text-lg sm:text-xl" />
        </button>

        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
            <FaMoneyBillWave className="text-white text-base sm:text-lg" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Select Payment Method
          </h2>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => selectPaymentMethod(method)}
                className={`w-full p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 transform backdrop-blur-sm ${method.bgColor} ${method.borderColor} hover:border-transparent group text-left`}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-white/50 rounded-xl shadow-inner">
                    <IconComponent className={`text-xl sm:text-2xl bg-gradient-to-r ${method.color} bg-clip-text text-transparent`} />
                  </div>
                  <FiCheckCircle className="text-gray-300 group-hover:text-blue-500 transition-colors duration-300" size={18} />
                </div>
                <h3 className={`font-bold mb-2 text-base sm:text-lg text-slate-800`}>
                  {method.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{method.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

// Separate Payment Modal Component
const PaymentModal = ({
  setShowModal,
  setFormError,
  editingId,
  payment,
  formError,
  handleChange,
  handleSubmit,
  addPaymentLoading,
  loading,
  isMobile,
  isSmallMobile
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
    <div className="relative w-full max-w-2xl mx-2 sm:mx-4">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            setShowModal(false);
            setFormError('');
          }}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
        >
          <FiX className="text-lg sm:text-xl" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl">
            <FaMoneyBillWave className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {editingId ? 'Edit Cash Payment' : 'Add Cash Payment'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Cash payment details
            </p>
          </div>
        </div>

        {formError && (
          <div className="mb-4 p-3 text-rose-700 bg-gradient-to-r from-rose-50 to-red-50 rounded-2xl border border-rose-200 shadow-inner text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Order ID <span className="text-rose-500"></span>
              </label>
              <input
                type="number"
                name="orderId"
                value={payment.orderId}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm"
                placeholder="Enter Order ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Paid Amount <span className="text-rose-500"></span>
              </label>
              <input
                type="number"
                step="0.01"
                name="paidAmount"
                value={payment.paidAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Payment Date <span className="text-rose-500"></span>
              </label>
              <input
                type="date"
                name="paymentDate"
                value={payment.paymentDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status <span className="text-rose-500"></span>
              </label>
              <select
                name="status"
                value={payment.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm"
                required
              >
                {editingId ? (
                  <option value="Completed">Completed</option>
                ) : (
                  <>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setFormError('');
              }}
              className="px-4 py-2 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addPaymentLoading || loading}
              className="px-4 py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm order-1 sm:order-2"
            >
              {(addPaymentLoading || loading) ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs sm:text-sm">Processing...</span>
                </div>
              ) : editingId ? (
                'Update Payment'
              ) : (
                'Add Cash Payment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default Payments;


// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   FiPlus,
//   FiSearch,
//   FiX,
//   FiChevronLeft,
//   FiChevronRight,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiEdit,
//   FiSave,
//   FiToggleLeft,
//   FiToggleRight,
//   FiActivity,
//   FiArchive,
//   FiCreditCard,
//   FiDollarSign,
//   FiTrendingUp,
//   FiBarChart2,
//   FiClock,
//   FiAlertTriangle,
//   FiFilter
// } from 'react-icons/fi';
// import { 
//   FaMoneyBillWave
// } from 'react-icons/fa';

// // Redux actions
// import { 
//   GetAllPayment, 
//   AddPayment,
//   GetPaymentByOrderID
// } from '../actions/paymentActions';

// // Import GetOrders action to get order details for priority filtering
// import { GetOrders } from '../actions/orderAction';

// // Payment method configurations
// const paymentMethods = [
//   {
//     id: 'cash',
//     name: 'Cash',
//     icon: FaMoneyBillWave,
//     description: 'Pay with cash on delivery',
//     color: 'from-slate-500 to-slate-600',
//     bgColor: 'bg-gradient-to-br from-slate-50 to-slate-100',
//     borderColor: 'border-slate-200'
//   }
// ];

// // Function to format numbers with thousand separators
// const formatNumberWithCommas = (number) => {
//   if (number === null || number === undefined || isNaN(number)) return '0.00';
//   return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// };

// function Payments() {
//   const dispatch = useDispatch();
  
//   // Redux state
//   const { 
//     responseBody: paymentsData, 
//     loading: paymentsLoading, 
//     error: paymentsError,
//     msg: paymentsMsg 
//   } = useSelector(state => state.getAllPayment);

//   const { 
//     loading: addPaymentLoading, 
//     error: addPaymentError,
//     msg: addPaymentMsg 
//   } = useSelector(state => state.addPayment);

//   // Orders state for priority filtering
//   const { 
//     responseBody: allOrdersData,
//     loading: ordersLoading,
//     error: ordersError
//   } = useSelector(state => state.orderList);

//   // Local state management
//   const [search, setSearch] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [showMethodSelection, setShowMethodSelection] = useState(false);
//   const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
//   const [notification, setNotification] = useState(null);
//   const [formError, setFormError] = useState('');
//   const [activeTab, setActiveTab] = useState('payments'); // 'payments' or 'pending'
//   const [priorityFilter, setPriorityFilter] = useState('all'); // 'all', 'priority', 'high', 'urgent'
  
//   const [payment, setPayment] = useState({
//     orderId: '',
//     paidAmount: '',
//     paymentDate: new Date().toISOString().split('T')[0],
//     method: 'Cash',
//     status: 'Pending'
//   });

//   // Editing state
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // Filter only cash payments and sort by PaymentId descending (newest first)
//   const cashPayments = paymentsData && Array.isArray(paymentsData) 
//     ? paymentsData
//         .filter(p => p.Method === 'Cash')
//         .map(p => ({
//           ...p,
//           PaidAmount: parseFloat(p.PaidAmount) || 0,
//           PaymentId: parseInt(p.PaymentId) || p.PaymentId,
//           OrderId: parseInt(p.OrderId) || p.OrderId
//         }))
//         .sort((a, b) => (b.PaymentId || 0) - (a.PaymentId || 0))
//     : [];

//   // Get all orders with their payment status
//   const allOrders = allOrdersData && Array.isArray(allOrdersData) 
//     ? allOrdersData.map(order => ({
//         ...order,
//         OrderId: parseInt(order.OrderId) || order.OrderId,
//         TotalAmount: parseFloat(order.TotalAmount) || 0,
//         // Check if order has any payment
//         hasPayment: cashPayments.some(payment => payment.OrderId === order.OrderId),
//         // Get payment status if exists
//         paymentStatus: cashPayments.find(payment => payment.OrderId === order.OrderId)?.Status || 'No Payment',
//         // Get latest payment for this order
//         latestPayment: cashPayments.filter(payment => payment.OrderId === order.OrderId)
//           .sort((a, b) => new Date(b.PaymentDate) - new Date(a.PaymentDate))[0]
//       }))
//     : [];

//   // UPDATED: Get in-progress AND priority orders that haven't been paid (no completed payments)
//   const inProgressAndPriorityUnpaidOrders = allOrders.filter(order => {
//     const hasCompletedPayment = cashPayments.some(
//       payment => payment.OrderId === order.OrderId && payment.Status === 'Completed'
//     );
    
//     // Check if order is in progress OR priority (applying the same logic as Orders component)
//     const isInProgress = order.Status === 'In Progress' || 
//                         order.Status === 'inprogress' || 
//                         order.Status === 'Processing' ||
//                         order.OrderStatus === 'In Progress';
    
//     // Check if order is priority (using the same logic as Orders component)
//     const isPriority = order.Status === 'priority' || 
//                       order.Priority === 'High' || 
//                       order.Priority === 'Urgent' ||
//                       order.Priority === 'priority';
    
//     return (isInProgress || isPriority) && !hasCompletedPayment;
//   });

//   // UPDATED: Filter priority in-progress unpaid orders with enhanced priority detection
//   const getPriorityInProgressOrders = (priorityLevel = 'all') => {
//     let filtered = inProgressAndPriorityUnpaidOrders;
    
//     // Apply priority filter - matching the Orders component logic
//     if (priorityLevel === 'priority') {
//       filtered = filtered.filter(order => 
//         order.Status === 'priority' || 
//         order.Priority === 'High' || 
//         order.Priority === 'Urgent' ||
//         order.Priority === 'priority'
//       );
//     } else if (priorityLevel === 'high') {
//       filtered = filtered.filter(order => 
//         order.Priority === 'High' || order.Priority === 'Urgent'
//       );
//     } else if (priorityLevel === 'urgent') {
//       filtered = filtered.filter(order => order.Priority === 'Urgent');
//     }
    
//     // Sort by priority and due date (matching Orders component logic)
//     return filtered.sort((a, b) => {
//       // Priority order matching your Orders component
//       const priorityOrder = { 
//         'Urgent': 1, 
//         'High': 2, 
//         'priority': 3, // Added priority status
//         'Normal': 4, 
//         'Low': 5 
//       };
      
//       const priorityA = priorityOrder[a.Priority] || priorityOrder[a.Status] || 4;
//       const priorityB = priorityOrder[b.Priority] || priorityOrder[b.Status] || 4;
      
//       if (priorityA !== priorityB) {
//         return priorityA - priorityB;
//       }
      
//       // If same priority, sort by due date or delivery date
//       const dateA = a.DueDate ? new Date(a.DueDate) : (a.DeliveryDate ? new Date(a.DeliveryDate) : new Date());
//       const dateB = b.DueDate ? new Date(b.DueDate) : (b.DeliveryDate ? new Date(b.DeliveryDate) : new Date());
//       return dateA - dateB;
//     });
//   };

//   const priorityInProgressOrders = getPriorityInProgressOrders(priorityFilter);

//   // UPDATED: Calculate statistics including priority orders
//   const totalRevenue = cashPayments.reduce((sum, p) => sum + (p.PaidAmount || 0), 0);
//   const completedPayments = cashPayments.filter(p => p.Status === 'Completed').length;
//   const inProgressUnpaidCount = inProgressAndPriorityUnpaidOrders.length;
  
//   // Priority counts
//   const priorityCount = inProgressAndPriorityUnpaidOrders.filter(order => 
//     order.Status === 'priority' || order.Priority === 'High' || order.Priority === 'Urgent'
//   ).length;
  
//   const highPriorityCount = inProgressAndPriorityUnpaidOrders.filter(order => 
//     order.Priority === 'High' || order.Priority === 'Urgent'
//   ).length;
  
//   const urgentPriorityCount = inProgressAndPriorityUnpaidOrders.filter(order => 
//     order.Priority === 'Urgent'
//   ).length;

//   // Filter payments for search
//   const filteredPayments = cashPayments.filter(
//     (p) =>
//       p.OrderId?.toString().includes(search.toLowerCase()) ||
//       p.Status?.toLowerCase().includes(search.toLowerCase())
//   );

//   // Filter in-progress orders for search
//   const filteredInProgressOrders = priorityInProgressOrders.filter(
//     (order) =>
//       order.OrderId?.toString().includes(search.toLowerCase()) ||
//       order.Priority?.toLowerCase().includes(search.toLowerCase()) ||
//       order.Status?.toLowerCase().includes(search.toLowerCase()) ||
//       order.CustomerName?.toLowerCase().includes(search.toLowerCase()) ||
//       (order.Customer?.Name?.toLowerCase() || '').includes(search.toLowerCase()) ||
//       (order.Customer?.FullName?.toLowerCase() || '').includes(search.toLowerCase())
//   );

//   // Pagination logic for payments
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
//   const currentInProgressOrders = filteredInProgressOrders.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(
//     (activeTab === 'payments' ? filteredPayments.length : filteredInProgressOrders.length) / itemsPerPage
//   );

//   // Reset pagination when tab changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeTab, priorityFilter]);

//   // Pagination 3-page sliding window
//   const pageNumbers = [];
//   const maxPageButtons = 3;
//   let startPage = Math.max(1, currentPage - 1);
//   let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
//   if (endPage - startPage + 1 < maxPageButtons) {
//     startPage = Math.max(1, endPage - maxPageButtons + 1);
//   }
//   for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPayment((prev) => ({ ...prev, [name]: value }));
//     if (formError) setFormError('');
//   };

//   // Open add payment modal with order pre-filled
//   const openAddModal = (order) => {
//     setShowMethodSelection(true);
//     setPayment({
//       orderId: order?.OrderId || '',
//       paidAmount: order?.TotalAmount || '',
//       paymentDate: new Date().toISOString().split('T')[0],
//       method: 'Cash',
//       status: 'Pending'
//     });
//     setEditingId(null);
//     setFormError('');
//   };

//   // Open edit payment modal
//   const openEditModal = (id) => {
//     const pay = cashPayments.find((p) => p.PaymentId === id);
//     if (pay) {
//       setPayment({
//         orderId: pay.OrderId,
//         paidAmount: pay.PaidAmount,
//         paymentDate: pay.PaymentDate,
//         method: 'Cash',
//         status: pay.Status || 'Pending'
//       });
//       setEditingId(id);
//       setFormError('');
//       setShowModal(true);
//     }
//   };

//   // Select payment method
//   const selectPaymentMethod = (method) => {
//     setSelectedMethod(method);
//     setPayment(prev => ({ ...prev, method: 'Cash' }));
//     setShowMethodSelection(false);
//     setShowModal(true);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!payment.orderId || !payment.paidAmount || !payment.paymentDate) {
//       setFormError('Please fill in all required fields');
//       setLoading(false);
//       return;
//     }

//     if (isNaN(payment.paidAmount) || Number(payment.paidAmount) <= 0) {
//       setFormError('Paid amount must be a positive number');
//       setLoading(false);
//       return;
//     }

//     // Prepare payment data for API
//     const paymentData = {
//       OrderId: Number(payment.orderId),
//       PaidAmount: Number(payment.paidAmount),
//       PaymentDate: payment.paymentDate,
//       Method: 'Cash',
//       Status: payment.status
//     };

//     try {
//       // Dispatch AddPayment action
//       await dispatch(AddPayment(paymentData));
      
//       // Show success notification
//       setNotification({ 
//         type: 'success', 
//         message: editingId ? 'Payment updated successfully!' : 'Payment added successfully!' 
//       });
      
//       // Close modal and refresh data
//       setShowModal(false);
//       dispatch(GetAllPayment());
//       dispatch(GetOrders()); // Refresh orders to update payment status
      
//     } catch (error) {
//       setNotification({ 
//         type: 'error', 
//         message: 'Failed to process payment. Please try again.' 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UPDATED: Get priority display info - enhanced to handle priority status
//   const getPriorityInfo = (order) => {
//     // Check both Status and Priority fields like in Orders component
//     const priorityValue = order.Status === 'priority' ? 'priority' : (order.Priority || 'Normal');
    
//     switch (priorityValue) {
//       case 'priority':
//         return {
//           color: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
//           borderColor: 'border-l-red-400',
//           bgColor: 'bg-gradient-to-r from-white to-red-50/30',
//           icon: <FiAlertTriangle className="mr-1" size={12} />,
//           text: 'Priority'
//         };
//       case 'Urgent':
//         return {
//           color: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
//           borderColor: 'border-l-red-400',
//           bgColor: 'bg-gradient-to-r from-white to-red-50/30',
//           icon: <FiAlertTriangle className="mr-1" size={12} />,
//           text: 'Urgent'
//         };
//       case 'High':
//         return {
//           color: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
//           borderColor: 'border-l-orange-400',
//           bgColor: 'bg-gradient-to-r from-white to-orange-50/30',
//           icon: <FiClock className="mr-1" size={12} />,
//           text: 'High'
//         };
//       case 'Low':
//         return {
//           color: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
//           borderColor: 'border-l-green-400',
//           bgColor: 'bg-gradient-to-r from-white to-green-50/30',
//           icon: <FiCheckCircle className="mr-1" size={12} />,
//           text: 'Low'
//         };
//       default:
//         return {
//           color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
//           borderColor: 'border-l-blue-400',
//           bgColor: 'bg-gradient-to-r from-white to-blue-50/30',
//           icon: <FiCheckCircle className="mr-1" size={12} />,
//           text: 'Normal'
//         };
//     }
//   };

//   // Get status display info
//   const getStatusInfo = (status) => {
//     const isActive = status === 'Completed';
    
//     if (isActive) {
//       return { 
//         text: 'Completed', 
//         color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50',
//         icon: <FiToggleRight className="mr-1" size={12} />
//       };
//     } else {
//       return { 
//         text: 'Pending', 
//         color: 'bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50',
//         icon: <FiToggleLeft className="mr-1" size={12} />
//       };
//     }
//   };

//   // Format date to YYYY-MM-DD
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not set';
//     try {
//       return new Date(dateString).toISOString().split('T')[0];
//     } catch {
//       return 'Invalid date';
//     }
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return `Rs. ${formatNumberWithCommas(amount)}`;
//   };

//   // Handle priority stats card click
//   const handlePriorityStatsClick = () => {
//     setActiveTab('inprogress');
//     setPriorityFilter('priority'); // Show priority orders by default
//   };

//   // Handle in-progress stats card click
//   const handleInProgressStatsClick = () => {
//     setActiveTab('inprogress');
//     setPriorityFilter('all'); // Show all in-progress and priority
//   };

//   // Handle urgent stats card click
//   const handleUrgentStatsClick = () => {
//     setActiveTab('inprogress');
//     setPriorityFilter('urgent'); // Show urgent priority
//   };

//   // Load payments and orders on component mount
//   useEffect(() => {
//     dispatch(GetAllPayment());
//     dispatch(GetOrders());
//   }, [dispatch]);

//   // Handle notifications from Redux actions
//   useEffect(() => {
//     if (addPaymentMsg) {
//       if (addPaymentError) {
//         setNotification({ type: 'error', message: addPaymentMsg });
//       }
//       setLoading(false);
//     }
//   }, [addPaymentMsg, addPaymentError]);

//   useEffect(() => {
//     if (paymentsError) {
//       setNotification({ type: 'error', message: paymentsMsg || 'Failed to load payments' });
//     }
//   }, [paymentsError, paymentsMsg]);

//   useEffect(() => {
//     if (ordersError) {
//       setNotification({ type: 'error', message: 'Failed to load orders' });
//     }
//   }, [ordersError]);

//   // Auto-hide notification
//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => setNotification(null), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 sm:p-6 relative overflow-hidden">
//       {/* 3D Background Elements */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
//       {/* 3D Notification */}
//       {notification && (
//         <div
//           className={`fixed top-4 sm:top-6 right-4 sm:right-6 z-50 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center transition-all duration-500 transform ${
//             notification.type === 'success' 
//               ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200/50 border-l-4 border-l-blue-400' 
//               : notification.type === 'error'
//               ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200/50 border-l-4 border-l-rose-400'
//               : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-yellow-200/50 border-l-4 border-l-yellow-400'
//           } animate-bounce-in`}
//           role="alert"
//         >
//           <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
//             {notification.type === 'success' ? (
//               <FiCheckCircle className="text-white" size={16} />
//             ) : notification.type === 'error' ? (
//               <FiAlertCircle className="text-white" size={16} />
//             ) : (
//               <FiAlertCircle className="text-white" size={16} />
//             )}
//           </div>
//           <span className="font-semibold text-xs sm:text-sm">{notification.message}</span>
//         </div>
//       )}

//       {/* Header Section with 3D Effect - UPDATED to include tabs in same line */}
//       <div className="relative z-10 mb-6 sm:mb-8">
//         <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
//           {/* Left side: Title and icon */}
//           <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
//             <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
//               <FiCreditCard className="text-white text-lg sm:text-xl" />
//             </div>
//             <div className="transform ">
//               <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                 Cash Payments
//               </h1>
//               <p className="text-slate-600 mt-1 text-sm sm:text-base">
//                 {activeTab === 'payments' ? 'Process and monitor cash payment transactions' : 'Manage priority and in-progress orders'}
//               </p>
//             </div>
//           </div>

//           {/* Right side: Tabs Navigation - MOVED TO TOP RIGHT */}
//           <div className="w-full lg:w-auto">
//             <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/20">
//               <button
//                 onClick={() => setActiveTab('payments')}
//                 className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
//                   activeTab === 'payments'
//                     ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
//                     : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
//                 }`}
//               >
//                 Payment History
//               </button>
//               <button
//                 onClick={() => setActiveTab('inprogress')}
//                 className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
//                   activeTab === 'inprogress'
//                     ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
//                     : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
//                 }`}
//               >
//                 Pending Payments
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 3D Stats Cards - Mobile Responsive */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 relative z-10">
//         {/* Total Revenue Card */}
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium">Total Revenue</p>
//                 <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                   {formatCurrency(totalRevenue)}
//                 </p>
//               </div>
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiTrendingUp className="text-white text-base sm:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Completed Payments Card - UPDATED to show number of completed payments */}
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium">Completed Payments</p>
//                 <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                   {completedPayments}
//                 </p>
//               </div>
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiCheckCircle className="text-white text-base sm:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* NEW: Priority Orders Card - Clickable */}
//         <div 
//           className="group relative cursor-pointer transform transition duration-300 hover:scale-105"
//           onClick={handlePriorityStatsClick}
//         >
//           {/* <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium">Priority</p>
//                 <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                   {priorityCount}
//                 </p>
//               </div>
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiAlertTriangle className="text-white text-base sm:text-lg" />
//               </div>
//             </div>
//           </div> */}
//         </div>

//         {/* In Progress Unpaid Card - Clickable */}
//         <div 
//           className="group relative cursor-pointer transform transition duration-300 hover:scale-105"
//           onClick={handleInProgressStatsClick}
//         >
//           <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium"> Pending Payments</p>
//                 <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                   {inProgressUnpaidCount}
//                 </p>
//               </div>
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiClock className="text-white text-base sm:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* UPDATED: Priority Filter for In Progress Orders */}
//       {/* {activeTab === 'inprogress' && (
//         <div className="relative z-10 mb-6">
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setPriorityFilter('all')}
//               className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
//                 priorityFilter === 'all'
//                   ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg'
//                   : 'bg-white text-slate-600 hover:bg-slate-50 shadow-lg'
//               }`}
//             >
//               All Pending ({inProgressUnpaidCount})
//             </button>
//             <button
//               onClick={() => setPriorityFilter('priority')}
//               className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
//                 priorityFilter === 'priority'
//                   ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
//                   : 'bg-white text-slate-600 hover:bg-slate-50 shadow-lg'
//               }`}
//             >
//               Priority ({priorityCount})
//             </button> */}
//             {/* <button
//               onClick={() => setPriorityFilter('high')}
//               className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
//                 priorityFilter === 'high'
//                   ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg'
//                   : 'bg-white text-slate-600 hover:bg-slate-50 shadow-lg'
//               }`}
//             >
//               High Priority ({highPriorityCount})
//             </button>
//             <button
//               onClick={() => setPriorityFilter('urgent')}
//               className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
//                 priorityFilter === 'urgent'
//                   ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
//                   : 'bg-white text-slate-600 hover:bg-slate-50 shadow-lg'
//               }`}
//             >
//               Urgent ({urgentPriorityCount})
//             </button> */}
//           {/* </div>
//         </div>
//       )} */}

//       {/* Search Bar */}
//       <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
//         <div className="flex flex-col sm:flex-row flex-grow gap-3 sm:gap-4 w-full">
//           <div className="relative flex-grow group">
//             <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//             <input
//               type="text"
//               placeholder={
//                 activeTab === 'payments' 
//                   ? "Search by Order ID or Status" 
//                   : "Search by Order ID, Priority, or Customer"
//               }
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
//             />
//             <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
//           </div>
//         </div>
//       </div>

//       {/* Content based on active tab */}
//       {activeTab === 'payments' ? (
//         /* Payment History Content */
//         <PaymentHistoryContent 
//           paymentsLoading={paymentsLoading}
//           currentPayments={currentPayments}
//           paymentsError={paymentsError}
//           formatCurrency={formatCurrency}
//           formatDate={formatDate}
//           getStatusInfo={getStatusInfo}
//           openEditModal={openEditModal}
//           filteredPayments={filteredPayments}
//           itemsPerPage={itemsPerPage}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           setCurrentPage={setCurrentPage}
//           pageNumbers={pageNumbers}
//         />
//       ) : (
//         /* In Progress Orders Content */
//         <InProgressOrdersContent
//           ordersLoading={ordersLoading || paymentsLoading}
//           filteredInProgressOrders={filteredInProgressOrders}
//           formatCurrency={formatCurrency}
//           formatDate={formatDate}
//           getPriorityInfo={getPriorityInfo}
//           openAddModal={openAddModal}
//           priorityFilter={priorityFilter}
//           itemsPerPage={itemsPerPage}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           setCurrentPage={setCurrentPage}
//           pageNumbers={pageNumbers}
//         />
//       )}

//       {/* Payment Method Selection Modal */}
//       {showMethodSelection && (
//         <PaymentMethodModal
//           setShowMethodSelection={setShowMethodSelection}
//           paymentMethods={paymentMethods}
//           selectPaymentMethod={selectPaymentMethod}
//         />
//       )}

//       {/* Add/Edit Payment Modal */}
//       {showModal && (
//         <PaymentModal
//           setShowModal={setShowModal}
//           setFormError={setFormError}
//           editingId={editingId}
//           payment={payment}
//           formError={formError}
//           handleChange={handleChange}
//           handleSubmit={handleSubmit}
//           addPaymentLoading={addPaymentLoading}
//           loading={loading}
//         />
//       )}
//     </div>
//   );
// }

// // Separate component for Payment History Content
// const PaymentHistoryContent = ({
//   paymentsLoading,
//   currentPayments,
//   paymentsError,
//   formatCurrency,
//   formatDate,
//   getStatusInfo,
//   openEditModal,
//   filteredPayments,
//   itemsPerPage,
//   currentPage,
//   totalPages,
//   setCurrentPage,
//   pageNumbers
// }) => {
//   if (paymentsLoading) {
//     return (
//       <div className="relative z-10 flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-6">
//       {/* Desktop Table */}
//       <div className="hidden lg:block overflow-x-auto">
//         <table className="w-full min-w-[600px]">
//           <thead>
//             <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//               <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-slate-700 font-semibold text-xs text-center sm:text-sm uppercase tracking-wider">Payment ID</th>
//               <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-slate-700 font-semibold text-xs text-center sm:text-sm uppercase tracking-wider">Order ID</th>
//               <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-slate-700 font-semibold text-xs text-center sm:text-sm uppercase tracking-wider">Amount</th>
//               <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-slate-700 font-semibold text-xs text-center sm:text-sm uppercase tracking-wider">Date</th>
//               <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-slate-700 font-semibold text-xs text-center sm:text-sm uppercase tracking-wider">Method</th>
//               {/* <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Status</th>
//               <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Actions</th> */}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-200/50">
//             {currentPayments.length > 0 ? (
//               currentPayments.map((p) => {
//                 const statusInfo = getStatusInfo(p.Status || 'Pending');
                
//                 return (
//                   <tr key={p.PaymentId} className="hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30 border-l-4 border-l-blue-400 group">
//                     <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base">
//                       {p.PaymentId}
//                     </td>
//                     <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base">
//                       {p.OrderId}
//                     </td>
//                     <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base">
//                       {formatCurrency(p.PaidAmount)}
//                     </td>
//                     <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base">
//                       {formatDate(p.PaymentDate)}
//                     </td>
//                     <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base">
//                       <span className="text-slate-600">Cash</span>
//                     </td>
//                     {/* <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base">
//                       <span className={`inline-flex items-center justify-center w-28 px-3 py-2 rounded-full font-semibold text-xs tracking-wide ${statusInfo.color}`}>
//                         {statusInfo.icon}
//                         {statusInfo.text}
//                       </span>
//                     </td> */}
//                     {/* <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
//                       <div className="flex justify-center space-x-2">
//                         <button
//                           onClick={() => openEditModal(p.PaymentId)}
//                           className="p-2 sm:p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                           title="Edit Payment"
//                         >
//                           <FiEdit size={14} />
//                         </button>
//                       </div>
//                     </td> */}
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center py-8 sm:py-12">
//                   <div className="flex flex-col items-center space-y-3">
//                     <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                       <FiCreditCard className="text-slate-500 text-lg sm:text-xl" />
//                     </div>
//                     <p className="text-slate-500 font-medium text-sm sm:text-base">
//                       {paymentsError ? 'Failed to load payments' : 'No cash payments found'}
//                     </p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Cards for Payments */}
//       <div className="lg:hidden p-4 space-y-4">
//         {currentPayments.length > 0 ? (
//           currentPayments.map((p) => {
//             const statusInfo = getStatusInfo(p.Status || 'Pending');
            
//             return (
//               <div key={p.PaymentId} className="rounded-2xl p-4 shadow-lg bg-gradient-to-r from-white to-blue-50/30 border-l-4 border-l-blue-400">
//                 <div className="grid grid-cols-2 gap-4 mb-3">
//                   <div>
//                     <p className="text-xs text-slate-500 font-medium">Payment ID</p>
//                     <p className="text-sm font-semibold text-slate-700">{p.PaymentId}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500 font-medium">Order ID</p>
//                     <p className="text-sm font-semibold text-slate-700">{p.OrderId}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500 font-medium">Amount</p>
//                     <p className="text-sm font-semibold text-slate-700">
//                       {formatCurrency(p.PaidAmount)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500 font-medium">Date</p>
//                     <p className="text-sm font-semibold text-slate-700">{formatDate(p.PaymentDate)}</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-slate-500 font-medium">Method</p>
//                     <p className="text-sm font-semibold text-slate-600">Cash</p>
//                   </div>
//                   <span className={`inline-flex items-center justify-center w-24 px-2 py-1.5 rounded-full font-semibold text-xs tracking-wide ${statusInfo.color}`}>
//                     {statusInfo.icon}
//                     {statusInfo.text}
//                   </span>
//                 </div>
                
//                 {/* <div className="flex justify-center mt-3">
//                   <button
//                     onClick={() => openEditModal(p.PaymentId)}
//                     className="w-full py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
//                   >
//                     <FiEdit size={14} />
//                     <span className="text-sm font-medium">Edit Payment</span>
//                   </button>
//                 </div> */}
//               </div>
//             );
//           })
//         ) : (
//           <div className="text-center py-8">
//             <div className="flex flex-col items-center space-y-3">
//               <div className="p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                 <FiCreditCard className="text-slate-500 text-xl" />
//               </div>
//               <p className="text-slate-500 font-medium">
//                 {paymentsError ? 'Failed to load payments' : 'No cash payments found'}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {filteredPayments.length > itemsPerPage && (
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           setCurrentPage={setCurrentPage}
//           pageNumbers={pageNumbers}
//           filteredData={filteredPayments}
//           indexOfFirstItem={currentPage * itemsPerPage - itemsPerPage}
//           indexOfLastItem={currentPage * itemsPerPage}
//         />
//       )}
//     </div>
//   );
// };

// // Separate component for In Progress Orders Content
// const InProgressOrdersContent = ({
//   ordersLoading,
//   filteredInProgressOrders,
//   formatCurrency,
//   formatDate,
//   getPriorityInfo,
//   openAddModal,
//   priorityFilter,
//   itemsPerPage,
//   currentPage,
//   totalPages,
//   setCurrentPage,
//   pageNumbers
// }) => {
//   if (ordersLoading) {
//     return (
//       <div className="relative z-10 flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//       </div>
//     );
//   }

//   const currentItems = filteredInProgressOrders.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="relative z-10">
//       <div className="mb-4">
//         <h3 className="text-lg font-semibold text-slate-700">
//           {priorityFilter === 'all' && 'All Pending Payments (In Progress + Priority)'}
//           {priorityFilter === 'priority' && 'Priority Orders'}
//           {priorityFilter === 'high' && 'High Priority Orders'}
//           {priorityFilter === 'urgent' && 'Urgent Priority Orders'}
//           <span className="ml-2 text-slate-500 text-sm font-normal">
//             ({filteredInProgressOrders.length} orders)
//           </span>
//         </h3>
//       </div>

//       {currentItems.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//           {currentItems.map((order) => {
//             const priorityInfo = getPriorityInfo(order);
//             return (
//               <div key={order.OrderId} className={`rounded-2xl p-4 shadow-lg border-l-4 ${priorityInfo.borderColor} ${priorityInfo.bgColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
//                 <div className="flex justify-between items-start mb-3">
//                   <div>
//                     <h3 className="font-bold text-slate-800">Order {order.OrderId}</h3>
//                     <p className="text-sm text-slate-600">
//                       {order.CustomerName || order.Customer?.Name || order.Customer?.FullName || `Customer ${order.OrderId}`}
//                     </p>
//                   </div>
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${priorityInfo.color}`}>
//                     {priorityInfo.icon}
//                     {priorityInfo.text}
//                   </span>
//                 </div>
                
//                 <div className="space-y-2 mb-4">
//                   <div className="flex justify-between">
//                     <span className="text-slate-600 text-sm">Amount:</span>
//                     <span className="font-semibold text-slate-800">{formatCurrency(order.TotalAmount)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-slate-600 text-sm">Order Date:</span>
//                     <span className="font-semibold text-slate-800">{formatDate(order.OrderDate)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-slate-600 text-sm">Status:</span>
//                     <span className="font-semibold text-orange-600">{order.Status || order.OrderStatus}</span>
//                   </div>
//                   {order.DeliveryDate && (
//                     <div className="flex justify-between">
//                       <span className="text-slate-600 text-sm">Delivery Date:</span>
//                       <span className={`font-semibold ${new Date(order.DeliveryDate) < new Date() ? 'text-red-600' : 'text-slate-800'}`}>
//                         {formatDate(order.DeliveryDate)}
//                       </span>
//                     </div>
//                   )}
//                   <div className="flex justify-between">
//                     <span className="text-slate-600 text-sm">Payment Status:</span>
//                     <span className="font-semibold text-red-600">Not Paid</span>
//                   </div>
//                 </div>

//                 {/* <button
//                   onClick={() => openAddModal(order)}
//                   className="w-full py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
//                 >
//                   <FiPlus size={14} />
//                   <span className="text-sm font-medium">Add Payment</span>
//                 </button> */}
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="text-center py-12 bg-white/50 rounded-2xl shadow-inner">
//           <div className="flex flex-col items-center space-y-3">
//             <div className="p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl">
//               <FiCheckCircle className="text-slate-500 text-xl" />
//             </div>
//             <p className="text-slate-500 font-medium">No pending orders found</p>
//             <p className="text-slate-400 text-sm">
//               {priorityFilter !== 'all' ? 'Try changing the priority filter' : 'All orders have been paid or no pending orders exist'}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Pagination for In Progress Orders */}
//       {filteredInProgressOrders.length > itemsPerPage && (
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           setCurrentPage={setCurrentPage}
//           pageNumbers={pageNumbers}
//           filteredData={filteredInProgressOrders}
//           indexOfFirstItem={(currentPage - 1) * itemsPerPage}
//           indexOfLastItem={currentPage * itemsPerPage}
//         />
//       )}
//     </div>
//   );
// };

// // Separate Pagination Component
// const Pagination = ({
//   currentPage,
//   totalPages,
//   setCurrentPage,
//   pageNumbers,
//   filteredData,
//   indexOfFirstItem,
//   indexOfLastItem
// }) => (
//   <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 gap-3 sm:gap-0">
//     <div className="text-xs sm:text-sm text-slate-600 font-medium">
//       Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredData.length)} of{' '}
//       {filteredData.length}
//     </div>
//     <div className="flex items-center space-x-1 sm:space-x-2">
//       <button
//         onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//         disabled={currentPage === 1}
//         className="p-2 sm:p-2.5 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//       >
//         <FiChevronLeft size={14} />
//       </button>

//       {pageNumbers.map((page) => (
//         <button
//           key={page}
//           onClick={() => setCurrentPage(page)}
//           className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
//             currentPage === page
//               ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
//               : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//           }`}
//         >
//           {page}
//         </button>
//       ))}

//       <button
//         onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//         disabled={currentPage === totalPages}
//         className="p-2 sm:p-2.5 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//       >
//         <FiChevronRight size={14} />
//       </button>
//     </div>
//   </div>
// );

// // Separate Payment Method Modal Component
// const PaymentMethodModal = ({ setShowMethodSelection, paymentMethods, selectPaymentMethod }) => (
//   <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
//     <div className="relative w-full max-w-md mx-2 sm:mx-4">
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//       <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
//         <button
//           onClick={() => setShowMethodSelection(false)}
//           className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//         >
//           <FiX className="text-lg sm:text-xl" />
//         </button>

//         <div className="flex items-center space-x-3 mb-4 sm:mb-6">
//           <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//             <FaMoneyBillWave className="text-white text-base sm:text-lg" />
//           </div>
//           <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//             Select Payment Method
//           </h2>
//         </div>

//         <div className="space-y-4">
//           {paymentMethods.map((method) => {
//             const IconComponent = method.icon;
//             return (
//               <button
//                 key={method.id}
//                 onClick={() => selectPaymentMethod(method)}
//                 className={`w-full p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 transform backdrop-blur-sm ${method.bgColor} ${method.borderColor} hover:border-transparent group text-left`}
//               >
//                 <div className="flex items-center justify-between mb-3 sm:mb-4">
//                   <div className="p-2 sm:p-3 bg-white/50 rounded-xl shadow-inner">
//                     <IconComponent className={`text-xl sm:text-2xl bg-gradient-to-r ${method.color} bg-clip-text text-transparent`} />
//                   </div>
//                   <FiCheckCircle className="text-gray-300 group-hover:text-blue-500 transition-colors duration-300" size={18} />
//                 </div>
//                 <h3 className={`font-bold mb-2 text-base sm:text-lg text-slate-800`}>
//                   {method.name}
//                 </h3>
//                 <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{method.description}</p>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Separate Payment Modal Component
// const PaymentModal = ({
//   setShowModal,
//   setFormError,
//   editingId,
//   payment,
//   formError,
//   handleChange,
//   handleSubmit,
//   addPaymentLoading,
//   loading
// }) => (
//   <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
//     <div className="relative w-full max-w-2xl mx-2 sm:mx-4">
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//       <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
//         <button
//           onClick={() => {
//             setShowModal(false);
//             setFormError('');
//           }}
//           className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//         >
//           <FiX className="text-lg sm:text-xl" />
//         </button>

//         <div className="flex items-center space-x-3 mb-4 sm:mb-6">
//           <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//             <FaMoneyBillWave className="text-white text-base sm:text-lg" />
//           </div>
//           <div>
//             <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//               {editingId ? 'Edit Cash Payment' : 'Add Cash Payment'}
//             </h2>
//             <p className="text-slate-600 text-xs sm:text-sm">
//               Cash payment details
//             </p>
//           </div>
//         </div>

//         {formError && (
//           <div className="mb-4 sm:mb-6 p-3 sm:p-4 text-rose-700 bg-gradient-to-r from-rose-50 to-red-50 rounded-2xl border border-rose-200 shadow-inner">
//             {formError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Order ID <span className="text-rose-500"></span>
//               </label>
//               <input
//                 type="number"
//                 name="orderId"
//                 value={payment.orderId}
//                 onChange={handleChange}
//                 className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-200 rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                 placeholder="Enter Order ID"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Paid Amount <span className="text-rose-500"></span>
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 name="paidAmount"
//                 value={payment.paidAmount}
//                 onChange={handleChange}
//                 className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-200 rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                 placeholder="0.00"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Payment Date <span className="text-rose-500"></span>
//               </label>
//               <input
//                 type="date"
//                 name="paymentDate"
//                 value={payment.paymentDate}
//                 onChange={handleChange}
//                 className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-200 rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Status <span className="text-rose-500"></span>
//               </label>
//               <select
//                 name="status"
//                 value={payment.status}
//                 onChange={handleChange}
//                 className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-200 rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                 required
//               >
//                 {editingId ? (
//                   <option value="Completed">Completed</option>
//                 ) : (
//                   <>
//                     <option value="Pending">Pending</option>
//                     <option value="Completed">Completed</option>
//                     <option value="Failed">Failed</option>
//                     <option value="Refunded">Refunded</option>
//                   </>
//                 )}
//               </select>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
//             <button
//               type="button"
//               onClick={() => {
//                 setShowModal(false);
//                 setFormError('');
//               }}
//               className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base order-2 sm:order-1"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={addPaymentLoading || loading}
//               className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base order-1 sm:order-2"
//             >
//               {(addPaymentLoading || loading) ? (
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span className="text-xs sm:text-sm">Processing...</span>
//                 </div>
//               ) : editingId ? (
//                 'Update Payment'
//               ) : (
//                 'Add Cash Payment'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>
// );

// export default Payments;
//.............................................................................................................
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   FiPlus,
//   FiSearch,
//   FiX,
//   FiChevronLeft,
//   FiChevronRight,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiEdit,
//   FiSave,
//   FiToggleLeft,
//   FiToggleRight,
//   FiActivity,
//   FiArchive,
//   FiCreditCard,
//   FiDollarSign,
//   FiTrendingUp,
//   FiBarChart2,
//   FiClock,
//   FiAlertTriangle,
//   FiFilter
// } from 'react-icons/fi';
// import { 
//   FaMoneyBillWave
// } from 'react-icons/fa';

// // Redux actions
// import { 
//   GetAllPayment, 
//   AddPayment,
//   GetPaymentByOrderID
// } from '../actions/paymentActions';

// // Import GetOrders action to get order details for priority filtering
// import { GetOrders } from '../actions/orderAction';

// // Payment method configurations
// const paymentMethods = [
//   {
//     id: 'cash',
//     name: 'Cash',
//     icon: FaMoneyBillWave,
//     description: 'Pay with cash on delivery',
//     color: 'from-slate-500 to-slate-600',
//     bgColor: 'bg-gradient-to-br from-slate-50 to-slate-100',
//     borderColor: 'border-slate-200'
//   }
// ];

// // Function to format numbers with thousand separators
// const formatNumberWithCommas = (number) => {
//   if (number === null || number === undefined || isNaN(number)) return '0.00';
//   return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// };

// function Payments() {
//   const dispatch = useDispatch();
  
//   // Redux state
//   const { 
//     responseBody: paymentsData, 
//     loading: paymentsLoading, 
//     error: paymentsError,
//     msg: paymentsMsg 
//   } = useSelector(state => state.getAllPayment);

//   const { 
//     loading: addPaymentLoading, 
//     error: addPaymentError,
//     msg: addPaymentMsg 
//   } = useSelector(state => state.addPayment);

//   // Orders state for priority filtering
//   const { 
//     responseBody: allOrdersData,
//     loading: ordersLoading,
//     error: ordersError
//   } = useSelector(state => state.orderList);

//   // Local state management
//   const [search, setSearch] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [showMethodSelection, setShowMethodSelection] = useState(false);
//   const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
//   const [notification, setNotification] = useState(null);
//   const [formError, setFormError] = useState('');
//   const [activeTab, setActiveTab] = useState('payments'); // 'payments' or 'pending'
//   const [priorityFilter, setPriorityFilter] = useState('all'); // 'all', 'priority', 'high', 'urgent'
  
//   const [payment, setPayment] = useState({
//     orderId: '',
//     paidAmount: '',
//     paymentDate: new Date().toISOString().split('T')[0],
//     method: 'Cash',
//     status: 'Pending'
//   });

//   // Editing state
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // Filter only cash payments and sort by PaymentId descending (newest first)
//   const cashPayments = paymentsData && Array.isArray(paymentsData) 
//     ? paymentsData
//         .filter(p => p.Method === 'Cash')
//         .map(p => ({
//           ...p,
//           PaidAmount: parseFloat(p.PaidAmount) || 0,
//           PaymentId: parseInt(p.PaymentId) || p.PaymentId,
//           OrderId: parseInt(p.OrderId) || p.OrderId
//         }))
//         .sort((a, b) => (b.PaymentId || 0) - (a.PaymentId || 0))
//     : [];

//   // Get all orders with their payment status
//   const allOrders = allOrdersData && Array.isArray(allOrdersData) 
//     ? allOrdersData.map(order => ({
//         ...order,
//         OrderId: parseInt(order.OrderId) || order.OrderId,
//         TotalAmount: parseFloat(order.TotalAmount) || 0,
//         // Check if order has any payment
//         hasPayment: cashPayments.some(payment => payment.OrderId === order.OrderId),
//         // Get payment status if exists
//         paymentStatus: cashPayments.find(payment => payment.OrderId === order.OrderId)?.Status || 'No Payment',
//         // Get latest payment for this order
//         latestPayment: cashPayments.filter(payment => payment.OrderId === order.OrderId)
//           .sort((a, b) => new Date(b.PaymentDate) - new Date(a.PaymentDate))[0]
//       }))
//     : [];

//   // UPDATED: Get in-progress AND priority orders that haven't been paid (no completed payments)
//   const inProgressAndPriorityUnpaidOrders = allOrders.filter(order => {
//     const hasCompletedPayment = cashPayments.some(
//       payment => payment.OrderId === order.OrderId && payment.Status === 'Completed'
//     );
    
//     // Check if order is in progress OR priority (applying the same logic as Orders component)
//     const isInProgress = order.Status === 'In Progress' || 
//                         order.Status === 'inprogress' || 
//                         order.Status === 'Processing' ||
//                         order.OrderStatus === 'In Progress';
    
//     // Check if order is priority (using the same logic as Orders component)
//     const isPriority = order.Status === 'priority' || 
//                       order.Priority === 'High' || 
//                       order.Priority === 'Urgent' ||
//                       order.Priority === 'priority';
    
//     return (isInProgress || isPriority) && !hasCompletedPayment;
//   });

//   // UPDATED: Filter priority in-progress unpaid orders with enhanced priority detection
//   const getPriorityInProgressOrders = (priorityLevel = 'all') => {
//     let filtered = inProgressAndPriorityUnpaidOrders;
    
//     // Apply priority filter - matching the Orders component logic
//     if (priorityLevel === 'priority') {
//       filtered = filtered.filter(order => 
//         order.Status === 'priority' || 
//         order.Priority === 'High' || 
//         order.Priority === 'Urgent' ||
//         order.Priority === 'priority'
//       );
//     } else if (priorityLevel === 'high') {
//       filtered = filtered.filter(order => 
//         order.Priority === 'High' || order.Priority === 'Urgent'
//       );
//     } else if (priorityLevel === 'urgent') {
//       filtered = filtered.filter(order => order.Priority === 'Urgent');
//     }
    
//     // Sort by priority and due date (matching Orders component logic)
//     return filtered.sort((a, b) => {
//       // Priority order matching your Orders component
//       const priorityOrder = { 
//         'Urgent': 1, 
//         'High': 2, 
//         'priority': 3, // Added priority status
//         'Normal': 4, 
//         'Low': 5 
//       };
      
//       const priorityA = priorityOrder[a.Priority] || priorityOrder[a.Status] || 4;
//       const priorityB = priorityOrder[b.Priority] || priorityOrder[b.Status] || 4;
      
//       if (priorityA !== priorityB) {
//         return priorityA - priorityB;
//       }
      
//       // If same priority, sort by due date or delivery date
//       const dateA = a.DueDate ? new Date(a.DueDate) : (a.DeliveryDate ? new Date(a.DeliveryDate) : new Date());
//       const dateB = b.DueDate ? new Date(b.DueDate) : (b.DeliveryDate ? new Date(b.DeliveryDate) : new Date());
//       return dateA - dateB;
//     });
//   };

//   const priorityInProgressOrders = getPriorityInProgressOrders(priorityFilter);

//   // UPDATED: Calculate statistics including priority orders
//   const totalRevenue = cashPayments.reduce((sum, p) => sum + (p.PaidAmount || 0), 0);
//   const completedPayments = cashPayments.filter(p => p.Status === 'Completed').length;
//   const inProgressUnpaidCount = inProgressAndPriorityUnpaidOrders.length;
  
//   // Priority counts
//   const priorityCount = inProgressAndPriorityUnpaidOrders.filter(order => 
//     order.Status === 'priority' || order.Priority === 'High' || order.Priority === 'Urgent'
//   ).length;
  
//   const highPriorityCount = inProgressAndPriorityUnpaidOrders.filter(order => 
//     order.Priority === 'High' || order.Priority === 'Urgent'
//   ).length;
  
//   const urgentPriorityCount = inProgressAndPriorityUnpaidOrders.filter(order => 
//     order.Priority === 'Urgent'
//   ).length;

//   // Filter payments for search
//   const filteredPayments = cashPayments.filter(
//     (p) =>
//       p.OrderId?.toString().includes(search.toLowerCase()) ||
//       p.Status?.toLowerCase().includes(search.toLowerCase())
//   );

//   // Filter in-progress orders for search
//   const filteredInProgressOrders = priorityInProgressOrders.filter(
//     (order) =>
//       order.OrderId?.toString().includes(search.toLowerCase()) ||
//       order.Priority?.toLowerCase().includes(search.toLowerCase()) ||
//       order.Status?.toLowerCase().includes(search.toLowerCase()) ||
//       order.CustomerName?.toLowerCase().includes(search.toLowerCase()) ||
//       (order.Customer?.Name?.toLowerCase() || '').includes(search.toLowerCase()) ||
//       (order.Customer?.FullName?.toLowerCase() || '').includes(search.toLowerCase())
//   );

//   // Pagination logic for payments
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
//   const currentInProgressOrders = filteredInProgressOrders.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(
//   (activeTab === 'payments' ? filteredPayments.length : filteredInProgressOrders.length) / itemsPerPage
// );

//   // Reset pagination when tab changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeTab, priorityFilter]);

//   // Pagination 3-page sliding window
//   const pageNumbers = [];
//   const maxPageButtons = 3;
//   let startPage = Math.max(1, currentPage - 1);
//   let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
//   if (endPage - startPage + 1 < maxPageButtons) {
//     startPage = Math.max(1, endPage - maxPageButtons + 1);
//   }
//   for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPayment((prev) => ({ ...prev, [name]: value }));
//     if (formError) setFormError('');
//   };

//   // Open add payment modal with order pre-filled
//   const openAddModal = (order) => {
//     setShowMethodSelection(true);
//     setPayment({
//       orderId: order?.OrderId || '',
//       paidAmount: order?.TotalAmount || '',
//       paymentDate: new Date().toISOString().split('T')[0],
//       method: 'Cash',
//       status: 'Pending'
//     });
//     setEditingId(null);
//     setFormError('');
//   };

//   // Open edit payment modal
//   const openEditModal = (id) => {
//     const pay = cashPayments.find((p) => p.PaymentId === id);
//     if (pay) {
//       setPayment({
//         orderId: pay.OrderId,
//         paidAmount: pay.PaidAmount,
//         paymentDate: pay.PaymentDate,
//         method: 'Cash',
//         status: pay.Status || 'Pending'
//       });
//       setEditingId(id);
//       setFormError('');
//       setShowModal(true);
//     }
//   };

//   // Select payment method
//   const selectPaymentMethod = (method) => {
//     setSelectedMethod(method);
//     setPayment(prev => ({ ...prev, method: 'Cash' }));
//     setShowMethodSelection(false);
//     setShowModal(true);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!payment.orderId || !payment.paidAmount || !payment.paymentDate) {
//       setFormError('Please fill in all required fields');
//       setLoading(false);
//       return;
//     }

//     if (isNaN(payment.paidAmount) || Number(payment.paidAmount) <= 0) {
//       setFormError('Paid amount must be a positive number');
//       setLoading(false);
//       return;
//     }

//     // Prepare payment data for API
//     const paymentData = {
//       OrderId: Number(payment.orderId),
//       PaidAmount: Number(payment.paidAmount),
//       PaymentDate: payment.paymentDate,
//       Method: 'Cash',
//       Status: payment.status
//     };

//     try {
//       // Dispatch AddPayment action
//       await dispatch(AddPayment(paymentData));
      
//       // Show success notification
//       setNotification({ 
//         type: 'success', 
//         message: editingId ? 'Payment updated successfully!' : 'Payment added successfully!' 
//       });
      
//       // Close modal and refresh data
//       setShowModal(false);
//       dispatch(GetAllPayment());
//       dispatch(GetOrders()); // Refresh orders to update payment status
      
//     } catch (error) {
//       setNotification({ 
//         type: 'error', 
//         message: 'Failed to process payment. Please try again.' 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UPDATED: Get priority display info - enhanced to handle priority status
//   const getPriorityInfo = (order) => {
//     // Check both Status and Priority fields like in Orders component
//     const priorityValue = order.Status === 'priority' ? 'priority' : (order.Priority || 'Normal');
    
//     switch (priorityValue) {
//       case 'priority':
//         return {
//           color: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
//           borderColor: 'border-l-red-400',
//           bgColor: 'bg-gradient-to-r from-white to-red-50/30',
//           icon: <FiAlertTriangle className="mr-1" size={12} />,
//           text: 'Priority'
//         };
//       case 'Urgent':
//         return {
//           color: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
//           borderColor: 'border-l-red-400',
//           bgColor: 'bg-gradient-to-r from-white to-red-50/30',
//           icon: <FiAlertTriangle className="mr-1" size={12} />,
//           text: 'Urgent'
//         };
//       case 'High':
//         return {
//           color: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
//           borderColor: 'border-l-orange-400',
//           bgColor: 'bg-gradient-to-r from-white to-orange-50/30',
//           icon: <FiClock className="mr-1" size={12} />,
//           text: 'High'
//         };
//       case 'Low':
//         return {
//           color: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
//           borderColor: 'border-l-green-400',
//           bgColor: 'bg-gradient-to-r from-white to-green-50/30',
//           icon: <FiCheckCircle className="mr-1" size={12} />,
//           text: 'Low'
//         };
//       default:
//         return {
//           color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
//           borderColor: 'border-l-blue-400',
//           bgColor: 'bg-gradient-to-r from-white to-blue-50/30',
//           icon: <FiCheckCircle className="mr-1" size={12} />,
//           text: 'Normal'
//         };
//     }
//   };

//   // Get status display info
//   const getStatusInfo = (status) => {
//     const isActive = status === 'Completed';
    
//     if (isActive) {
//       return { 
//         text: 'Completed', 
//         color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50',
//         icon: <FiToggleRight className="mr-1" size={12} />
//       };
//     } else {
//       return { 
//         text: 'Pending', 
//         color: 'bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50',
//         icon: <FiToggleLeft className="mr-1" size={12} />
//       };
//     }
//   };

//   // Format date to YYYY-MM-DD
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not set';
//     try {
//       return new Date(dateString).toISOString().split('T')[0];
//     } catch {
//       return 'Invalid date';
//     }
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return `Rs. ${formatNumberWithCommas(amount)}`;
//   };

//   // Handle priority stats card click
//   const handlePriorityStatsClick = () => {
//     setActiveTab('inprogress');
//     setPriorityFilter('priority'); // Show priority orders by default
//   };

//   // Handle in-progress stats card click
//   const handleInProgressStatsClick = () => {
//     setActiveTab('inprogress');
//     setPriorityFilter('all'); // Show all in-progress and priority
//   };

//   // Handle urgent stats card click
//   const handleUrgentStatsClick = () => {
//     setActiveTab('inprogress');
//     setPriorityFilter('urgent'); // Show urgent priority
//   };

//   // Load payments and orders on component mount
//   useEffect(() => {
//     dispatch(GetAllPayment());
//     dispatch(GetOrders());
//   }, [dispatch]);

//   // Handle notifications from Redux actions
//   useEffect(() => {
//     if (addPaymentMsg) {
//       if (addPaymentError) {
//         setNotification({ type: 'error', message: addPaymentMsg });
//       }
//       setLoading(false);
//     }
//   }, [addPaymentMsg, addPaymentError]);

//   useEffect(() => {
//     if (paymentsError) {
//       setNotification({ type: 'error', message: paymentsMsg || 'Failed to load payments' });
//     }
//   }, [paymentsError, paymentsMsg]);

//   useEffect(() => {
//     if (ordersError) {
//       setNotification({ type: 'error', message: 'Failed to load orders' });
//     }
//   }, [ordersError]);

//   // Auto-hide notification
//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => setNotification(null), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 sm:p-6 relative overflow-hidden">
//       {/* 3D Background Elements */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
//       {/* 3D Notification */}
//       {notification && (
//         <div
//           className={`fixed top-4 sm:top-6 right-4 sm:right-6 z-50 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center transition-all duration-500 transform ${
//             notification.type === 'success' 
//               ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200/50 border-l-4 border-l-blue-400' 
//               : notification.type === 'error'
//               ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200/50 border-l-4 border-l-rose-400'
//               : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-yellow-200/50 border-l-4 border-l-yellow-400'
//           } animate-bounce-in`}
//           role="alert"
//         >
//           <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
//             {notification.type === 'success' ? (
//               <FiCheckCircle className="text-white" size={16} />
//             ) : notification.type === 'error' ? (
//               <FiAlertCircle className="text-white" size={16} />
//             ) : (
//               <FiAlertCircle className="text-white" size={16} />
//             )}
//           </div>
//           <span className="font-semibold text-xs sm:text-sm">{notification.message}</span>
//         </div>
//       )}

//       {/* Header Section with 3D Effect */}
//       <div className="relative z-10 mb-6 sm:mb-8">
//         <div className="flex items-center space-x-3 sm:space-x-4 mb-3">
//           <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
//             <FiCreditCard className="text-white text-lg sm:text-xl" />
//           </div>
//           <div className="transform ">
//             <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//               Cash Payments
//             </h1>
//             <p className="text-slate-600 mt-1 text-sm sm:text-base">
//               {activeTab === 'payments' ? 'Process and monitor cash payment transactions' : 'Manage priority and in-progress orders'}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* 3D Stats Cards - Mobile Responsive */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 relative z-10">
//         {/* Total Revenue Card */}
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium">Total Revenue</p>
//                 <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                   {formatCurrency(totalRevenue)}
//                 </p>
//               </div>
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiTrendingUp className="text-white text-base sm:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Completed Payments Card */}
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium">Completed</p>
//                 <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                   {completedPayments}
//                 </p>
//               </div>
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiCheckCircle className="text-white text-base sm:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* NEW: Priority Orders Card - Clickable */}
//         <div 
//           className="group relative cursor-pointer transform transition duration-300 hover:scale-105"
//           onClick={handlePriorityStatsClick}
//         >
//           <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium">Priority</p>
//                 <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                   {priorityCount}
//                 </p>
//               </div>
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiAlertTriangle className="text-white text-base sm:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* In Progress Unpaid Card - Clickable */}
//         <div 
//           className="group relative cursor-pointer transform transition duration-300 hover:scale-105"
//           onClick={handleInProgressStatsClick}
//         >
//           <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium">All Pending</p>
//                 <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                   {inProgressUnpaidCount}
//                 </p>
//               </div>
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiClock className="text-white text-base sm:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs Navigation */}
//       <div className="relative z-10 mb-6">
//         <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/20">
//           <button
//             onClick={() => setActiveTab('payments')}
//             className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
//               activeTab === 'payments'
//                 ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
//                 : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
//             }`}
//           >
//             Payment History
//           </button>
//           <button
//             onClick={() => setActiveTab('inprogress')}
//             className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
//               activeTab === 'inprogress'
//                 ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
//                 : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
//             }`}
//           >
//             Pending Payments
//           </button>
//         </div>
//       </div>

//       {/* UPDATED: Priority Filter for In Progress Orders */}
//       {activeTab === 'inprogress' && (
//         <div className="relative z-10 mb-6">
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setPriorityFilter('all')}
//               className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
//                 priorityFilter === 'all'
//                   ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg'
//                   : 'bg-white text-slate-600 hover:bg-slate-50 shadow-lg'
//               }`}
//             >
//               All Pending ({inProgressUnpaidCount})
//             </button>
//             <button
//               onClick={() => setPriorityFilter('priority')}
//               className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
//                 priorityFilter === 'priority'
//                   ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
//                   : 'bg-white text-slate-600 hover:bg-slate-50 shadow-lg'
//               }`}
//             >
//               Priority ({priorityCount})
//             </button>
//             {/* <button
//               onClick={() => setPriorityFilter('high')}
//               className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
//                 priorityFilter === 'high'
//                   ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg'
//                   : 'bg-white text-slate-600 hover:bg-slate-50 shadow-lg'
//               }`}
//             >
//               High Priority ({highPriorityCount})
//             </button>
//             <button
//               onClick={() => setPriorityFilter('urgent')}
//               className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
//                 priorityFilter === 'urgent'
//                   ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
//                   : 'bg-white text-slate-600 hover:bg-slate-50 shadow-lg'
//               }`}
//             >
//               Urgent ({urgentPriorityCount})
//             </button> */}
//           </div>
//         </div>
//       )}

//       {/* Search Bar */}
//       <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
//         <div className="flex flex-col sm:flex-row flex-grow gap-3 sm:gap-4 w-full">
//           <div className="relative flex-grow group">
//             <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//             <input
//               type="text"
//               placeholder={
//                 activeTab === 'payments' 
//                   ? "Search by Order ID or Status" 
//                   : "Search by Order ID, Priority, or Customer"
//               }
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
//             />
//             <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
//           </div>
//         </div>
//       </div>

//       {/* Content based on active tab */}
//       {activeTab === 'payments' ? (
//         /* Payment History Content */
//         <PaymentHistoryContent 
//           paymentsLoading={paymentsLoading}
//           currentPayments={currentPayments}
//           paymentsError={paymentsError}
//           formatCurrency={formatCurrency}
//           formatDate={formatDate}
//           getStatusInfo={getStatusInfo}
//           openEditModal={openEditModal}
//           filteredPayments={filteredPayments}
//           itemsPerPage={itemsPerPage}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           setCurrentPage={setCurrentPage}
//           pageNumbers={pageNumbers}
//         />
//       ) : (
//         /* In Progress Orders Content */
//         <InProgressOrdersContent
//           ordersLoading={ordersLoading || paymentsLoading}
//           filteredInProgressOrders={filteredInProgressOrders}
//           formatCurrency={formatCurrency}
//           formatDate={formatDate}
//           getPriorityInfo={getPriorityInfo}
//           openAddModal={openAddModal}
//           priorityFilter={priorityFilter}
//           itemsPerPage={itemsPerPage}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           setCurrentPage={setCurrentPage}
//           pageNumbers={pageNumbers}
//         />
//       )}

//       {/* Payment Method Selection Modal */}
//       {showMethodSelection && (
//         <PaymentMethodModal
//           setShowMethodSelection={setShowMethodSelection}
//           paymentMethods={paymentMethods}
//           selectPaymentMethod={selectPaymentMethod}
//         />
//       )}

//       {/* Add/Edit Payment Modal */}
//       {showModal && (
//         <PaymentModal
//           setShowModal={setShowModal}
//           setFormError={setFormError}
//           editingId={editingId}
//           payment={payment}
//           formError={formError}
//           handleChange={handleChange}
//           handleSubmit={handleSubmit}
//           addPaymentLoading={addPaymentLoading}
//           loading={loading}
//         />
//       )}
//     </div>
//   );
// }

// // Separate component for Payment History Content
// const PaymentHistoryContent = ({
//   paymentsLoading,
//   currentPayments,
//   paymentsError,
//   formatCurrency,
//   formatDate,
//   getStatusInfo,
//   openEditModal,
//   filteredPayments,
//   itemsPerPage,
//   currentPage,
//   totalPages,
//   setCurrentPage,
//   pageNumbers
// }) => {
//   if (paymentsLoading) {
//     return (
//       <div className="relative z-10 flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-6">
//       {/* Desktop Table */}
//       <div className="hidden lg:block overflow-x-auto">
//         <table className="w-full min-w-[600px]">
//           <thead>
//             <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//               <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-slate-700 font-semibold text-xs text-center sm:text-sm uppercase tracking-wider">Payment ID</th>
//               <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-slate-700 font-semibold text-xs text-center sm:text-sm uppercase tracking-wider">Order ID</th>
//               <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-slate-700 font-semibold text-xs text-center sm:text-sm uppercase tracking-wider">Amount</th>
//               <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-slate-700 font-semibold text-xs text-center sm:text-sm uppercase tracking-wider">Date</th>
//               <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-slate-700 font-semibold text-xs text-center sm:text-sm uppercase tracking-wider">Method</th>
//               {/* <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Status</th>
//               <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Actions</th> */}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-200/50">
//             {currentPayments.length > 0 ? (
//               currentPayments.map((p) => {
//                 const statusInfo = getStatusInfo(p.Status || 'Pending');
                
//                 return (
//                   <tr key={p.PaymentId} className="hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30 border-l-4 border-l-blue-400 group">
//                     <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base">
//                       {p.PaymentId}
//                     </td>
//                     <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base">
//                       {p.OrderId}
//                     </td>
//                     <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base">
//                       {formatCurrency(p.PaidAmount)}
//                     </td>
//                     <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base">
//                       {formatDate(p.PaymentDate)}
//                     </td>
//                     <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base">
//                       <span className="text-slate-600">Cash</span>
//                     </td>
//                     {/* <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base">
//                       <span className={`inline-flex items-center justify-center w-28 px-3 py-2 rounded-full font-semibold text-xs tracking-wide ${statusInfo.color}`}>
//                         {statusInfo.icon}
//                         {statusInfo.text}
//                       </span>
//                     </td> */}
//                     {/* <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
//                       <div className="flex justify-center space-x-2">
//                         <button
//                           onClick={() => openEditModal(p.PaymentId)}
//                           className="p-2 sm:p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                           title="Edit Payment"
//                         >
//                           <FiEdit size={14} />
//                         </button>
//                       </div>
//                     </td> */}
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center py-8 sm:py-12">
//                   <div className="flex flex-col items-center space-y-3">
//                     <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                       <FiCreditCard className="text-slate-500 text-lg sm:text-xl" />
//                     </div>
//                     <p className="text-slate-500 font-medium text-sm sm:text-base">
//                       {paymentsError ? 'Failed to load payments' : 'No cash payments found'}
//                     </p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Cards for Payments */}
//       <div className="lg:hidden p-4 space-y-4">
//         {currentPayments.length > 0 ? (
//           currentPayments.map((p) => {
//             const statusInfo = getStatusInfo(p.Status || 'Pending');
            
//             return (
//               <div key={p.PaymentId} className="rounded-2xl p-4 shadow-lg bg-gradient-to-r from-white to-blue-50/30 border-l-4 border-l-blue-400">
//                 <div className="grid grid-cols-2 gap-4 mb-3">
//                   <div>
//                     <p className="text-xs text-slate-500 font-medium">Payment ID</p>
//                     <p className="text-sm font-semibold text-slate-700">{p.PaymentId}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500 font-medium">Order ID</p>
//                     <p className="text-sm font-semibold text-slate-700">{p.OrderId}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500 font-medium">Amount</p>
//                     <p className="text-sm font-semibold text-slate-700">
//                       {formatCurrency(p.PaidAmount)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500 font-medium">Date</p>
//                     <p className="text-sm font-semibold text-slate-700">{formatDate(p.PaymentDate)}</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-slate-500 font-medium">Method</p>
//                     <p className="text-sm font-semibold text-slate-600">Cash</p>
//                   </div>
//                   <span className={`inline-flex items-center justify-center w-24 px-2 py-1.5 rounded-full font-semibold text-xs tracking-wide ${statusInfo.color}`}>
//                     {statusInfo.icon}
//                     {statusInfo.text}
//                   </span>
//                 </div>
                
//                 {/* <div className="flex justify-center mt-3">
//                   <button
//                     onClick={() => openEditModal(p.PaymentId)}
//                     className="w-full py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
//                   >
//                     <FiEdit size={14} />
//                     <span className="text-sm font-medium">Edit Payment</span>
//                   </button>
//                 </div> */}
//               </div>
//             );
//           })
//         ) : (
//           <div className="text-center py-8">
//             <div className="flex flex-col items-center space-y-3">
//               <div className="p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                 <FiCreditCard className="text-slate-500 text-xl" />
//               </div>
//               <p className="text-slate-500 font-medium">
//                 {paymentsError ? 'Failed to load payments' : 'No cash payments found'}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {filteredPayments.length > itemsPerPage && (
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           setCurrentPage={setCurrentPage}
//           pageNumbers={pageNumbers}
//           filteredData={filteredPayments}
//           indexOfFirstItem={currentPage * itemsPerPage - itemsPerPage}
//           indexOfLastItem={currentPage * itemsPerPage}
//         />
//       )}
//     </div>
//   );
// };

// // Separate component for In Progress Orders Content
// const InProgressOrdersContent = ({
//   ordersLoading,
//   filteredInProgressOrders,
//   formatCurrency,
//   formatDate,
//   getPriorityInfo,
//   openAddModal,
//   priorityFilter,
//   itemsPerPage,
//   currentPage,
//   totalPages,
//   setCurrentPage,
//   pageNumbers
// }) => {
//   if (ordersLoading) {
//     return (
//       <div className="relative z-10 flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
//       </div>
//     );
//   }

//   const currentItems = filteredInProgressOrders.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="relative z-10">
//       <div className="mb-4">
//         <h3 className="text-lg font-semibold text-slate-700">
//           {priorityFilter === 'all' && 'All Pending Orders (In Progress + Priority)'}
//           {priorityFilter === 'priority' && 'Priority Orders'}
//           {priorityFilter === 'high' && 'High Priority Orders'}
//           {priorityFilter === 'urgent' && 'Urgent Priority Orders'}
//           <span className="ml-2 text-slate-500 text-sm font-normal">
//             ({filteredInProgressOrders.length} orders)
//           </span>
//         </h3>
//       </div>

//       {currentItems.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//           {currentItems.map((order) => {
//             const priorityInfo = getPriorityInfo(order);
//             return (
//               <div key={order.OrderId} className={`rounded-2xl p-4 shadow-lg border-l-4 ${priorityInfo.borderColor} ${priorityInfo.bgColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
//                 <div className="flex justify-between items-start mb-3">
//                   <div>
//                     <h3 className="font-bold text-slate-800">Order {order.OrderId}</h3>
//                     <p className="text-sm text-slate-600">
//                       {order.CustomerName || order.Customer?.Name || order.Customer?.FullName || `Customer ${order.OrderId}`}
//                     </p>
//                   </div>
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${priorityInfo.color}`}>
//                     {priorityInfo.icon}
//                     {priorityInfo.text}
//                   </span>
//                 </div>
                
//                 <div className="space-y-2 mb-4">
//                   <div className="flex justify-between">
//                     <span className="text-slate-600 text-sm">Amount:</span>
//                     <span className="font-semibold text-slate-800">{formatCurrency(order.TotalAmount)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-slate-600 text-sm">Order Date:</span>
//                     <span className="font-semibold text-slate-800">{formatDate(order.OrderDate)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-slate-600 text-sm">Status:</span>
//                     <span className="font-semibold text-orange-600">{order.Status || order.OrderStatus}</span>
//                   </div>
//                   {order.DeliveryDate && (
//                     <div className="flex justify-between">
//                       <span className="text-slate-600 text-sm">Delivery Date:</span>
//                       <span className={`font-semibold ${new Date(order.DeliveryDate) < new Date() ? 'text-red-600' : 'text-slate-800'}`}>
//                         {formatDate(order.DeliveryDate)}
//                       </span>
//                     </div>
//                   )}
//                   <div className="flex justify-between">
//                     <span className="text-slate-600 text-sm">Payment Status:</span>
//                     <span className="font-semibold text-red-600">Not Paid</span>
//                   </div>
//                 </div>

//                 {/* <button
//                   onClick={() => openAddModal(order)}
//                   className="w-full py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
//                 >
//                   <FiPlus size={14} />
//                   <span className="text-sm font-medium">Add Payment</span>
//                 </button> */}
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="text-center py-12 bg-white/50 rounded-2xl shadow-inner">
//           <div className="flex flex-col items-center space-y-3">
//             <div className="p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl">
//               <FiCheckCircle className="text-slate-500 text-xl" />
//             </div>
//             <p className="text-slate-500 font-medium">No pending orders found</p>
//             <p className="text-slate-400 text-sm">
//               {priorityFilter !== 'all' ? 'Try changing the priority filter' : 'All orders have been paid or no pending orders exist'}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Pagination for In Progress Orders */}
//       {filteredInProgressOrders.length > itemsPerPage && (
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           setCurrentPage={setCurrentPage}
//           pageNumbers={pageNumbers}
//           filteredData={filteredInProgressOrders}
//           indexOfFirstItem={(currentPage - 1) * itemsPerPage}
//           indexOfLastItem={currentPage * itemsPerPage}
//         />
//       )}
//     </div>
//   );
// };

// // Separate Pagination Component
// const Pagination = ({
//   currentPage,
//   totalPages,
//   setCurrentPage,
//   pageNumbers,
//   filteredData,
//   indexOfFirstItem,
//   indexOfLastItem
// }) => (
//   <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 gap-3 sm:gap-0">
//     <div className="text-xs sm:text-sm text-slate-600 font-medium">
//       Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredData.length)} of{' '}
//       {filteredData.length}
//     </div>
//     <div className="flex items-center space-x-1 sm:space-x-2">
//       <button
//         onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//         disabled={currentPage === 1}
//         className="p-2 sm:p-2.5 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//       >
//         <FiChevronLeft size={14} />
//       </button>

//       {pageNumbers.map((page) => (
//         <button
//           key={page}
//           onClick={() => setCurrentPage(page)}
//           className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
//             currentPage === page
//               ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
//               : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//           }`}
//         >
//           {page}
//         </button>
//       ))}

//       <button
//         onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//         disabled={currentPage === totalPages}
//         className="p-2 sm:p-2.5 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//       >
//         <FiChevronRight size={14} />
//       </button>
//     </div>
//   </div>
// );

// // Separate Payment Method Modal Component
// const PaymentMethodModal = ({ setShowMethodSelection, paymentMethods, selectPaymentMethod }) => (
//   <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
//     <div className="relative w-full max-w-md mx-2 sm:mx-4">
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//       <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
//         <button
//           onClick={() => setShowMethodSelection(false)}
//           className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//         >
//           <FiX className="text-lg sm:text-xl" />
//         </button>

//         <div className="flex items-center space-x-3 mb-4 sm:mb-6">
//           <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//             <FaMoneyBillWave className="text-white text-base sm:text-lg" />
//           </div>
//           <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//             Select Payment Method
//           </h2>
//         </div>

//         <div className="space-y-4">
//           {paymentMethods.map((method) => {
//             const IconComponent = method.icon;
//             return (
//               <button
//                 key={method.id}
//                 onClick={() => selectPaymentMethod(method)}
//                 className={`w-full p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 transform backdrop-blur-sm ${method.bgColor} ${method.borderColor} hover:border-transparent group text-left`}
//               >
//                 <div className="flex items-center justify-between mb-3 sm:mb-4">
//                   <div className="p-2 sm:p-3 bg-white/50 rounded-xl shadow-inner">
//                     <IconComponent className={`text-xl sm:text-2xl bg-gradient-to-r ${method.color} bg-clip-text text-transparent`} />
//                   </div>
//                   <FiCheckCircle className="text-gray-300 group-hover:text-blue-500 transition-colors duration-300" size={18} />
//                 </div>
//                 <h3 className={`font-bold mb-2 text-base sm:text-lg text-slate-800`}>
//                   {method.name}
//                 </h3>
//                 <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{method.description}</p>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Separate Payment Modal Component
// const PaymentModal = ({
//   setShowModal,
//   setFormError,
//   editingId,
//   payment,
//   formError,
//   handleChange,
//   handleSubmit,
//   addPaymentLoading,
//   loading
// }) => (
//   <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
//     <div className="relative w-full max-w-2xl mx-2 sm:mx-4">
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//       <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
//         <button
//           onClick={() => {
//             setShowModal(false);
//             setFormError('');
//           }}
//           className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//         >
//           <FiX className="text-lg sm:text-xl" />
//         </button>

//         <div className="flex items-center space-x-3 mb-4 sm:mb-6">
//           <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//             <FaMoneyBillWave className="text-white text-base sm:text-lg" />
//           </div>
//           <div>
//             <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//               {editingId ? 'Edit Cash Payment' : 'Add Cash Payment'}
//             </h2>
//             <p className="text-slate-600 text-xs sm:text-sm">
//               Cash payment details
//             </p>
//           </div>
//         </div>

//         {formError && (
//           <div className="mb-4 sm:mb-6 p-3 sm:p-4 text-rose-700 bg-gradient-to-r from-rose-50 to-red-50 rounded-2xl border border-rose-200 shadow-inner">
//             {formError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Order ID <span className="text-rose-500"></span>
//               </label>
//               <input
//                 type="number"
//                 name="orderId"
//                 value={payment.orderId}
//                 onChange={handleChange}
//                 className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-200 rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                 placeholder="Enter Order ID"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Paid Amount <span className="text-rose-500"></span>
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 name="paidAmount"
//                 value={payment.paidAmount}
//                 onChange={handleChange}
//                 className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-200 rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                 placeholder="0.00"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Payment Date <span className="text-rose-500"></span>
//               </label>
//               <input
//                 type="date"
//                 name="paymentDate"
//                 value={payment.paymentDate}
//                 onChange={handleChange}
//                 className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-200 rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Status <span className="text-rose-500"></span>
//               </label>
//               <select
//                 name="status"
//                 value={payment.status}
//                 onChange={handleChange}
//                 className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-200 rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                 required
//               >
//                 {editingId ? (
//                   <option value="Completed">Completed</option>
//                 ) : (
//                   <>
//                     <option value="Pending">Pending</option>
//                     <option value="Completed">Completed</option>
//                     <option value="Failed">Failed</option>
//                     <option value="Refunded">Refunded</option>
//                   </>
//                 )}
//               </select>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
//             <button
//               type="button"
//               onClick={() => {
//                 setShowModal(false);
//                 setFormError('');
//               }}
//               className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base order-2 sm:order-1"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={addPaymentLoading || loading}
//               className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base order-1 sm:order-2"
//             >
//               {(addPaymentLoading || loading) ? (
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span className="text-xs sm:text-sm">Processing...</span>
//                 </div>
//               ) : editingId ? (
//                 'Update Payment'
//               ) : (
//                 'Add Cash Payment'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>
// );

// export default Payments;