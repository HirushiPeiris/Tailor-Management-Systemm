// import React, { useState, useEffect, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   FiShoppingBag, 
//   FiClock, 
//   FiCheckCircle, 
//   FiDollarSign, 
//   FiSearch,
//   FiChevronLeft,
//   FiChevronRight,
//   FiRotateCw,
//   FiAlertCircle,
//   FiX,
//   FiCheckCircle as FiCheckCircleSolid,
//   FiUser,
//   FiDownload,
//   FiBarChart2,
//   FiCalendar
// } from 'react-icons/fi';
// import { RentalReprot } from '../actions/RentalReportActions';
// import { GetAllCustomers } from '../actions/customerActions';
// import { ReturnCloth } from '../actions/rentalAction';
// import * as XLSX from 'xlsx';

// const formatCurrency = (amount) => {
//   return parseFloat(amount || 0).toLocaleString('en-IN', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   });
// };

// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   return new Date(dateString).toLocaleString();
// };

// // Helper functions for date filtering
// const getCurrentDate = () => {
//   return new Date().toISOString().split('T')[0];
// };

// const formatToYYYYMMDD = (dateString) => {
//   if (!dateString) return '';
//   return new Date(dateString).toLocaleDateString('en-IN');
// };

// const getMonthName = (dateString) => {
//   if (!dateString) return '';
//   return new Date(dateString).toLocaleDateString('en-IN', { month: 'long' });
// };

// const RentalTransactions = () => {
//   const dispatch = useDispatch();
  
//   // Get data from Redux store
//   const { responseBody: transactions = [], loading, error, msg } = useSelector(state => state.rentalReport);
  
//   // Get return cloth state
//   const returnClothState = useSelector((state) => state.returnCloth || {});
//   const returnLoading = returnClothState.loading || false;
//   const returnSuccess = returnClothState.success || false;
//   const returnMessage = returnClothState.message || null;

//   // Get customers data
//   const customerState = useSelector((state) => state.customerList || {});
//   const customerData = useMemo(() => {
//     if (!customerState) return [];
    
//     if (customerState.ResultSet && Array.isArray(customerState.ResultSet)) {
//       return customerState.ResultSet;
//     }
//     else if (customerState.responseBody && Array.isArray(customerState.responseBody)) {
//       return customerState.responseBody;
//     }
//     else if (Array.isArray(customerState.data)) {
//       return customerState.data;
//     }
//     else if (Array.isArray(customerState)) {
//       return customerState;
//     }
//     else {
//       return [];
//     }
//   }, [customerState]);

//   // State for filters
//   const [filters, setFilters] = useState({
//     searchTerm: '',
//     filterType: 'all', // 'all', 'day', 'month', 'year'
//     date: '',
//     status: 'all'
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [showReturnModal, setShowReturnModal] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [returnFormData, setReturnFormData] = useState({
//     RentalId: "",
//     IsDamaged: 0,
//     DamagePrice: "0"
//   });
//   const [notification, setNotification] = useState({ message: "", type: "" });
//   const [itemsPerPage] = useState(10);

//   // Fetch data when component mounts
//   useEffect(() => {
//     dispatch(RentalReprot());
//     dispatch(GetAllCustomers());
//   }, [dispatch]);

//  useEffect(() => {
//   if (returnSuccess && returnMessage) {
//     setNotification({ type: 'success', message: returnMessage });
//     setShowReturnModal(false);
//     setReturnFormData({ RentalId: "", IsDamaged: 0, DamagePrice: "0" });
//     dispatch(RentalReprot());
    
//     // Clear the return success state after showing notification
//     const timer = setTimeout(() => {
//     }, 100);
//   }
// }, [returnSuccess, returnMessage, dispatch]);
//   // Only show error notifications, not success messages for data loading
//   useEffect(() => {
//     if (error) {
//       setNotification({ type: 'error', message: error });
//     }
    
//   }, [error, msg, loading]);

//   // Auto-hide notification
//   useEffect(() => {
//     if (notification.message) {
//       const timer = setTimeout(() => setNotification({ message: "", type: "" }), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   // Mobile responsive state
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);

//   // Handle resize for mobile responsiveness
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       setIsSmallMobile(window.innerWidth < 480);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Function to get customer name by ID
//   const getCustomerNameById = useMemo(() => {
//     return (customerId) => {
//       if (!customerId || !customerData.length) return "Unknown Customer";
      
//       const customer = customerData.find(cust => 
//         cust.CustomerId === customerId || 
//         cust.CustomerId?.toString() === customerId?.toString() ||
//         cust.id === customerId ||
//         cust._id === customerId
//       );
      
//       return customer?.FullName || customer?.CustomerName || customer?.name || `Customer ${customerId}`;
//     };
//   }, [customerData]);

//   // Enhanced transactions with customer names
//   const enhancedTransactions = useMemo(() => {
//     if (!Array.isArray(transactions)) return [];
    
//     return transactions.map(transaction => ({
//       ...transaction,
//       CustomerName: getCustomerNameById(transaction.CustomerId),
//       // Add formatted dates for easier filtering
//       RentDateFormatted: transaction.RentDate ? new Date(transaction.RentDate) : null,
//       ReturnDateFormatted: transaction.ReturnDate ? new Date(transaction.ReturnDate) : null
//     }));
//   }, [transactions, getCustomerNameById]);

//   // Handle filter changes
//   const handleFilterChange = (filterName, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterName]: value
//     }));
//     setCurrentPage(1); // Reset to first page when filters change
//   };

//   // Filter transactions based on all filters
//   const filteredTransactions = useMemo(() => {
//     let filtered = Array.isArray(enhancedTransactions) ? enhancedTransactions : [];
    
//     // Filter by search term
//     if (filters.searchTerm) {
//       filtered = filtered.filter(t => 
//         t.RentalId?.toString().includes(filters.searchTerm) ||
//         t.ClothId?.toString().includes(filters.searchTerm) ||
//         t.CustomerId?.toString().includes(filters.searchTerm) ||
//         t.CustomerName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
//         t.RequestedColor?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
//         t.RequestedSize?.toLowerCase().includes(filters.searchTerm.toLowerCase())
//       );
//     }
    
//     // Filter by status
//     if (filters.status !== 'all') {
//       filtered = filtered.filter(t => t.Status?.toLowerCase() === filters.status.toLowerCase());
//     }
    
//     // Filter by date
//     if (filters.date && filters.filterType !== 'all') {
//       const selectedDate = new Date(filters.date);
      
//       filtered = filtered.filter(t => {
//         if (!t.RentDateFormatted) return false;
        
//         const rentDate = t.RentDateFormatted;
        
//         switch (filters.filterType) {
//           case 'day':
//             return rentDate.toDateString() === selectedDate.toDateString();
            
//           case 'month':
//             return rentDate.getMonth() === selectedDate.getMonth() && 
//                    rentDate.getFullYear() === selectedDate.getFullYear();
            
//           case 'year':
//             return rentDate.getFullYear() === selectedDate.getFullYear();
            
//           default:
//             return true;
//         }
//       });
//     }
    
//     return filtered.sort((a, b) => (b.RentalId || 0) - (a.RentalId || 0));
//   }, [enhancedTransactions, filters]);

//   // Calculate statistics
//   const totalRentals = filteredTransactions.length;
//   const totalRevenue = filteredTransactions
//     .filter(t => t.FinalAmount)
//     .reduce((sum, t) => sum + parseFloat(t.FinalAmount || 0), 0);
  
//   // Calculate Damage Fee total and Final Amount total
//   const totalDamageFee = filteredTransactions
//     .reduce((sum, t) => sum + parseFloat(t.DamageFee || 0), 0);
  
//   const totalFinalAmount = filteredTransactions
//     .reduce((sum, t) => sum + parseFloat(t.FinalAmount || 0), 0);

//   // Pagination Logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentRecords = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

//   const goToPage = (num) => setCurrentPage(num);
//   const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
//   const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

//   const getPageNumbers = () => {
//     if (totalPages <= (isMobile ? 2 : 3)) {
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }
    
//     let startPage = Math.max(1, currentPage - (isMobile ? 0 : 1));
//     let endPage = Math.min(totalPages, currentPage + (isMobile ? 1 : 1));
    
//     if (currentPage === 1) {
//       endPage = isMobile ? 2 : 3;
//     }
//     if (currentPage === totalPages) {
//       startPage = totalPages - (isMobile ? 1 : 2);
//     }
    
//     return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'rented': return 'text-blue-600 bg-blue-100';
//       case 'returned': return 'text-green-600 bg-green-100';
//       default: return 'text-gray-600 bg-gray-100';
//     }
//   };

//   // Return cloth functionality
//   const handleReturnClick = (transaction) => {
//     setSelectedTransaction(transaction);
//     setReturnFormData({
//       RentalId: transaction.RentalId,
//       IsDamaged: 0,
//       DamagePrice: "0"
//     });
//     setShowReturnModal(true);
//   };

//   const handleReturnSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Update the transaction in localStorage (same logic as RentalCloths component)
//       const savedTransactions = localStorage.getItem('rentalTransactions');
//       if (savedTransactions) {
//         const transactions = JSON.parse(savedTransactions);
//         const updatedTransactions = transactions.map(transaction => {
//           if (transaction.RentalId.toString() === returnFormData.RentalId.toString()) {
//             return {
//               ...transaction,
//               Status: "Returned",
//               ReturnDate: new Date().toISOString(),
//               DamageFee: returnFormData.IsDamaged ? parseFloat(returnFormData.DamagePrice) : 0,
//               FinalAmount: (parseFloat(transaction.RentPrice) + (returnFormData.IsDamaged ? parseFloat(returnFormData.DamagePrice) : 0)).toFixed(2)
//             };
//           }
//           return transaction;
//         });
//         localStorage.setItem('rentalTransactions', JSON.stringify(updatedTransactions));
//       }

//       // Dispatch the ReturnCloth action with the form data
//       await dispatch(ReturnCloth(returnFormData));
      
//     } catch (error) {
//       console.error("Error returning cloth:", error);
//       setNotification({ type: 'error', message: 'Failed to return cloth' });
//     }
//   };

//   const handleReturnInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setReturnFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
//     }));
//   };

//   // Export to Excel function
//   const exportToExcel = () => {
//     try {
//       // Prepare data for export
//       const exportData = filteredTransactions.map(transaction => ({
//         'Rental ID': transaction.RentalId,
//         'Cloth ID': transaction.ClothId,
//         'Customer Name': transaction.CustomerName,
//         'Customer ID': transaction.CustomerId,
//         'Quantity': transaction.Quantity,
//         'Color': transaction.RequestedColor,
//         'Size': transaction.RequestedSize,
//         'Rent Price': parseFloat(transaction.RentPrice || 0),
//         'Rent Date': formatDate(transaction.RentDate),
//         'Return Date': formatDate(transaction.ReturnDate),
//         'Damage Fee': parseFloat(transaction.DamageFee || 0),
//         'Final Amount': parseFloat(transaction.FinalAmount || 0),
//         'Status': transaction.Status
//       }));

//       // Create workbook and worksheet
//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.json_to_sheet(exportData);

//       // Add worksheet to workbook
//       XLSX.utils.book_append_sheet(wb, ws, 'Rental Transactions');

//       // Generate Excel file and download
//       const fileName = `Rental_Transactions_${new Date().toISOString().split('T')[0]}.xlsx`;
//       XLSX.writeFile(wb, fileName);

//       setNotification({ type: 'success', message: 'Excel report downloaded successfully!' });
//     } catch (error) {
//       console.error('Error exporting to Excel:', error);
//       setNotification({ type: 'error', message: 'Failed to export Excel report' });
//     }
//   };

//   // Add loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-slate-600">Loading rental transactions...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-3 sm:p-4 md:p-6 relative overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
//       {/* Notification */}
//       {notification.message && (
//         <div
//           className={`fixed top-6 right-6 z-[9999] p-4 rounded-2xl shadow-2xl flex items-center animate-slide-in ${
//             notification.type === "success" 
//               ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200/50 border-l-4 border-l-green-400" 
//               : "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200/50 border-l-4 border-l-rose-400"
//           }`}
//         >
//           <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
//             {notification.type === "success" ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
//           </div>
//           <span className="font-semibold text-sm">{notification.message}</span>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="relative z-10 mb-4 sm:mb-6 md:mb-8">
//         <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3">
//           <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
//             <FiShoppingBag className="text-white text-base sm:text-lg md:text-xl" />
//           </div>
//           <div className="transform  flex-1 min-w-0">
//             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
//               Rental Transactions
//             </h1>
//             <p className="text-slate-600 mt-0.5 text-xs sm:text-sm md:text-base truncate">
//               Track all rental activities and returns
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Statistics Cards - Removed Active Rentals */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 relative z-10">
//         {/* Total Rentals Card */}
//         <div className="bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-slate-600 text-sm font-medium mb-1">Total Rentals</p>
//               <p className="text-2xl sm:text-3xl font-bold text-slate-800">{totalRentals}</p>
//             </div>
//             <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
//               <FiShoppingBag className="text-white text-lg sm:text-xl" />
//             </div>
//           </div>
//         </div>

//         {/* Total Revenue Card */}
//         <div className="bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-slate-600 text-sm font-medium mb-1">Total Revenue</p>
//               <p className="text-lg sm:text-xl font-bold text-black-600">
//                 Rs. {formatCurrency(totalRevenue)}
//               </p>
//             </div>
//             <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
//               <FiDollarSign className="text-white text-lg sm:text-xl" />
//             </div>
//           </div>
//         </div>

//         {/* Total Damage Fee Card */}
//         <div className="bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-slate-600 text-sm font-medium mb-1">Total Damage Fee</p>
//               <p className="text-lg sm:text-xl font-bold text-black-600">
//                 Rs. {formatCurrency(totalDamageFee)}
//               </p>
//             </div>
//             <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg">
//               <FiAlertCircle className="text-white text-lg sm:text-xl" />
//             </div>
//           </div>
//         </div>

//         {/* Total Final Amount Card */}
//         <div className="bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-slate-600 text-sm font-medium mb-1">Total Final Amount</p>
//               <p className="text-lg sm:text-xl font-bold text-black-600">
//                 Rs. {formatCurrency(totalFinalAmount)}
//               </p>
//             </div>
//             <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
//               <FiBarChart2 className="text-white text-lg sm:text-xl" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Filters Section */}
// <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
//   <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
//     {/* Search Input */}
//     <div className="relative flex-grow group">
//       <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//       <input
//         type="text"
//         placeholder="Search by Rental ID, Cloth ID, Customer Name...."
//         value={filters.searchTerm}
//         onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
//         className="relative w-full pl-10 pr-4 py-2.5 md:pl-12 md:pr-6 md:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-[11px] sm:text-xs md:text-sm lg:text-base"
//       />
//       <FiSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={14} />
//     </div>

//           {/* Date Filter Type */}
//           <select
//             value={filters.filterType}
//             onChange={(e) => handleFilterChange('filterType', e.target.value)}
//             className="px-3 sm:px-4 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-medium transition-all duration-300 text-sm sm:text-base"
//           >
//             <option value="all">All Time</option>
//             <option value="day">Day Wise</option>
//             <option value="month">Month Wise</option>
//             <option value="year">Year Wise</option>
//           </select>

          
//           {/* Single Date Picker */}
// <div className="relative flex-grow group">
//   <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//   <input
//     type="date"
//     value={filters.date}
//     onChange={(e) => handleFilterChange('date', e.target.value)}
//     className="relative w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-medium transition-all duration-300 text-sm sm:text-base"
//     max={getCurrentDate()}
//   />
// </div>

//           {/* Status Filter and Export */}
//           <div className="flex gap-2 sm:gap-3">
//             <select
//               value={filters.status}
//               onChange={(e) => handleFilterChange('status', e.target.value)}
//               className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-medium transition-all duration-300 text-sm sm:text-base"
//             >
//               <option value="all">All Status</option>
//               <option value="rented">Rented</option>
//               <option value="returned">Returned</option>
//             </select>

//             <button 
//               onClick={exportToExcel}
//               className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95"
//             >
//               <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//               <FiDownload className="mr-2 sm:mr-3 relative z-10" size={isMobile ? 18 : 20} />
//               <span className="relative z-10 text-sm sm:text-base">Export</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Filter Info Display */}
//       {filters.date && filters.filterType !== 'all' && (
//         <div className="relative z-10 mb-4">
//           <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50">
//             <p className="text-blue-800 font-medium text-sm">
//               Showing rentals for:{' '}
//               {filters.filterType === 'day' && `Day: ${formatToYYYYMMDD(filters.date)}`}
//               {filters.filterType === 'month' && `Month: ${getMonthName(filters.date)} ${new Date(filters.date).getFullYear()}`}
//               {filters.filterType === 'year' && `Year: ${new Date(filters.date).getFullYear()}`}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Enhanced 3D Table */}
//       <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Rental ID</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Cloth ID</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Customer</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Qty</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Color</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Size</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Rent Price</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Rent Date</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Return Date</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Damage Fee</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Final Amount</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Status</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-200/50">
//               {currentRecords.length > 0 ? (
//                 currentRecords.map((transaction, index) => (
//                   <tr 
//                     key={transaction.RentalId || index} 
//                     className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
//                   >
//                     <td className="px-2 py-3 text-slate-600 text-sm font-mono">
//                       {transaction.RentalId}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       {transaction.ClothId}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       <div className="flex items-center">
//                         <div>
//                           <div className="font-normal">{transaction.CustomerName}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm text-center">
//                       {transaction.Quantity}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       <div className="flex items-center">
//                         <div 
//                           className="w-3 h-3 rounded-full border border-gray-300 mr-2 shadow-sm"
//                           style={{ backgroundColor: transaction.RequestedColor?.toLowerCase() }}
//                         ></div>
//                         <span className="capitalize">
//                           {transaction.RequestedColor}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       {transaction.RequestedSize}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       Rs. {formatCurrency(transaction.RentPrice)}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm max-w-[120px] truncate" title={formatDate(transaction.RentDate)}>
//                       {formatDate(transaction.RentDate)}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm max-w-[120px] truncate" title={formatDate(transaction.ReturnDate)}>
//                       {formatDate(transaction.ReturnDate)}
//                     </td>
//                     <td className="px-2 py-3 text-red-600 text-sm">
//                       {transaction.DamageFee > 0 ? `Rs. ${formatCurrency(transaction.DamageFee)}` : '-'}
//                     </td>
//                     <td className="px-2 py-3 text-green-700 text-sm font-semibold">
//                       Rs. {formatCurrency(transaction.FinalAmount)}
//                     </td>
//                     <td className="px-2 py-3">
//                       <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.Status)}`}>
//                         {transaction.Status}
//                       </span>
//                     </td>
//                     <td className="px-2 py-3">
//                       {transaction.Status === "Rented" && (
//                         <button
//                           onClick={() => handleReturnClick(transaction)}
//                           className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
//                           title="Return Cloth"
//                         >
//                           <FiRotateCw size={14} />
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="13" className="text-center py-8 sm:py-12">
//                     <div className="flex flex-col items-center space-y-2 sm:space-y-3">
//                       <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                         <FiShoppingBag className="text-slate-500 text-lg sm:text-xl" />
//                       </div>
//                       <p className="text-slate-500 font-medium text-sm sm:text-base">
//                         {filters.searchTerm || filters.status !== "all" || (filters.date && filters.filterType !== 'all')
//                           ? "No transactions found matching your criteria" 
//                           : "No rental transactions available"}
//                       </p>
//                       {error && (
//                         <p className="text-red-500 text-sm">Error: {error}</p>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Enhanced Pagination */}
//         {filteredTransactions.length > itemsPerPage && (
//           <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
//             <div className="text-xs sm:text-sm text-slate-600 font-medium">
//               Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredTransactions.length)} of{' '}
//               {filteredTransactions.length}
//             </div>
//             <div className="flex items-center space-x-1 sm:space-x-2">
//               <button
//                 onClick={goToPrevPage}
//                 disabled={currentPage === 1}
//                 className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//               >
//                 <FiChevronLeft size={isSmallMobile ? 12 : 14} />
//               </button>

//               {getPageNumbers().map((num) => (
//                 <button
//                   key={num}
//                   onClick={() => goToPage(num)}
//                   className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm min-w-[32px] sm:min-w-[36px] ${
//                     num === currentPage
//                       ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
//                       : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                   }`}
//                 >
//                   {num}
//                 </button>
//               ))}

//               <button
//                 onClick={goToNextPage}
//                 disabled={currentPage === totalPages}
//                 className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//               >
//                 <FiChevronRight size={isSmallMobile ? 12 : 14} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Enhanced 3D Modal */}
//       {showReturnModal && selectedTransaction && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
//           <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-700 rounded-3xl blur opacity-20"></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <button
//                 onClick={() => setShowReturnModal(false)}
//                 className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200"
//               >
//                 <FiX className="text-lg" />
//               </button>

//               <div className="flex items-center space-x-3 mb-4">
//                 <div className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl">
//                   <FiRotateCw className="text-white text-lg" />
//                 </div>
//                 <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                   Return Rental Cloth
//                 </h2>
//               </div>

//               <form onSubmit={handleReturnSubmit} className="space-y-4">
//                 <div className="bg-slate-50 rounded-2xl p-4">
//                   <h3 className="text-sm font-medium text-slate-700 mb-3">Transaction Details</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
//                     <div>
//                       <span className="text-slate-600">Rental ID:</span>
//                       <span className="font-medium ml-2">{selectedTransaction.RentalId}</span>
//                     </div>
//                     <div>
//                       <span className="text-slate-600">Cloth ID:</span>
//                       <span className="font-medium ml-2">{selectedTransaction.ClothId}</span>
//                     </div>
//                     <div>
//                       <span className="text-slate-600">Customer:</span>
//                       <span className="font-medium ml-2">{selectedTransaction.CustomerName}</span>
//                     </div>
//                     <div>
//                       <span className="text-slate-600">Rent Price:</span>
//                       <span className="font-medium ml-2">Rs. {formatCurrency(selectedTransaction.RentPrice)}</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-3">
//                   <input
//                     type="checkbox"
//                     name="IsDamaged"
//                     checked={returnFormData.IsDamaged === 1}
//                     onChange={handleReturnInputChange}
//                     className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
//                   />
//                   <label className="text-sm font-medium text-slate-700">Is the cloth damaged?</label>
//                 </div>
                
//                 {returnFormData.IsDamaged === 1 && (
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Damage Price (Rs.)</label>
//                     <input
//                       type="number"
//                       name="DamagePrice"
//                       value={returnFormData.DamagePrice}
//                       onChange={handleReturnInputChange}
//                       min="0"
//                       step="0.01"
//                       className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 text-sm"
//                       placeholder="Enter damage price"
//                     />
//                   </div>
//                 )}
                
//                 <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowReturnModal(false)}
//                     className="px-4 py-2 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm order-2 sm:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={returnLoading}
//                     className="px-4 py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm order-1 sm:order-2"
//                   >
//                     {returnLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         <span>Returning...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FiRotateCw size={16} />
//                         <span>Return Cloth</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RentalTransactions;




import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiShoppingBag, 
  FiClock, 
  FiCheckCircle, 
  FiDollarSign, 
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiRotateCw,
  FiAlertCircle,
  FiX,
  FiCheckCircle as FiCheckCircleSolid,
  FiUser,
  FiDownload,
  FiBarChart2,
  FiCalendar
} from 'react-icons/fi';
import { RentalReprot } from '../actions/RentalReportActions';
import { GetAllCustomers } from '../actions/customerActions';
import { ReturnCloth } from '../actions/rentalAction';
import * as XLSX from 'xlsx';

const formatCurrency = (amount) => {
  return parseFloat(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

// Helper functions for date filtering
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

const formatToYYYYMMDD = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN');
};

const getMonthName = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', { month: 'long' });
};

const RentalTransactions = () => {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { responseBody: transactions = [], loading, error, msg } = useSelector(state => state.rentalReport);
  
  // Get return cloth state
  const returnClothState = useSelector((state) => state.returnCloth || {});
  const returnLoading = returnClothState.loading || false;

  // Get customers data
  const customerState = useSelector((state) => state.customerList || {});
  const customerData = useMemo(() => {
    if (!customerState) return [];
    
    if (customerState.ResultSet && Array.isArray(customerState.ResultSet)) {
      return customerState.ResultSet;
    }
    else if (customerState.responseBody && Array.isArray(customerState.responseBody)) {
      return customerState.responseBody;
    }
    else if (Array.isArray(customerState.data)) {
      return customerState.data;
    }
    else if (Array.isArray(customerState)) {
      return customerState;
    }
    else {
      return [];
    }
  }, [customerState]);

  // State for filters
  const [filters, setFilters] = useState({
    searchTerm: '',
    filterType: 'all', // 'all', 'day', 'month', 'year'
    date: '',
    status: 'all'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [returnFormData, setReturnFormData] = useState({
    RentalId: "",
    IsDamaged: 0,
    DamagePrice: "0"
  });
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [itemsPerPage] = useState(10);

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(RentalReprot());
    dispatch(GetAllCustomers());
  }, [dispatch]);

  // Only show error notifications, not success messages for data loading
  useEffect(() => {
    if (error) {
      setNotification({ type: 'error', message: error });
    }
  }, [error, msg, loading]);

  // Auto-hide notification
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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

  // Function to get customer name by ID
  const getCustomerNameById = useMemo(() => {
    return (customerId) => {
      if (!customerId || !customerData.length) return "Unknown Customer";
      
      const customer = customerData.find(cust => 
        cust.CustomerId === customerId || 
        cust.CustomerId?.toString() === customerId?.toString() ||
        cust.id === customerId ||
        cust._id === customerId
      );
      
      return customer?.FullName || customer?.CustomerName || customer?.name || `Customer ${customerId}`;
    };
  }, [customerData]);

  // Enhanced transactions with customer names
  const enhancedTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    
    return transactions.map(transaction => ({
      ...transaction,
      CustomerName: getCustomerNameById(transaction.CustomerId),
      // Add formatted dates for easier filtering
      RentDateFormatted: transaction.RentDate ? new Date(transaction.RentDate) : null,
      ReturnDateFormatted: transaction.ReturnDate ? new Date(transaction.ReturnDate) : null
    }));
  }, [transactions, getCustomerNameById]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Filter transactions based on all filters
  const filteredTransactions = useMemo(() => {
    let filtered = Array.isArray(enhancedTransactions) ? enhancedTransactions : [];
    
    // Filter by search term
    if (filters.searchTerm) {
      filtered = filtered.filter(t => 
        t.RentalId?.toString().includes(filters.searchTerm) ||
        t.ClothId?.toString().includes(filters.searchTerm) ||
        t.CustomerId?.toString().includes(filters.searchTerm) ||
        t.CustomerName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        t.RequestedColor?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        t.RequestedSize?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.Status?.toLowerCase() === filters.status.toLowerCase());
    }
    
    // Filter by date
    if (filters.date && filters.filterType !== 'all') {
      const selectedDate = new Date(filters.date);
      
      filtered = filtered.filter(t => {
        if (!t.RentDateFormatted) return false;
        
        const rentDate = t.RentDateFormatted;
        
        switch (filters.filterType) {
          case 'day':
            return rentDate.toDateString() === selectedDate.toDateString();
            
          case 'month':
            return rentDate.getMonth() === selectedDate.getMonth() && 
                   rentDate.getFullYear() === selectedDate.getFullYear();
            
          case 'year':
            return rentDate.getFullYear() === selectedDate.getFullYear();
            
          default:
            return true;
        }
      });
    }
    
    return filtered.sort((a, b) => (b.RentalId || 0) - (a.RentalId || 0));
  }, [enhancedTransactions, filters]);

  // Calculate statistics
  const totalRentals = filteredTransactions.length;
  const totalRevenue = filteredTransactions
    .filter(t => t.FinalAmount)
    .reduce((sum, t) => sum + parseFloat(t.FinalAmount || 0), 0);
  
  // Calculate Damage Fee total and Final Amount total
  const totalDamageFee = filteredTransactions
    .reduce((sum, t) => sum + parseFloat(t.DamageFee || 0), 0);
  
  const totalFinalAmount = filteredTransactions
    .reduce((sum, t) => sum + parseFloat(t.FinalAmount || 0), 0);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const goToPage = (num) => setCurrentPage(num);
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'rented': return 'text-blue-600 bg-blue-100';
      case 'returned': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Return cloth functionality
  const handleReturnClick = (transaction) => {
    setSelectedTransaction(transaction);
    setReturnFormData({
      RentalId: transaction.RentalId,
      IsDamaged: 0,
      DamagePrice: "0"
    });
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update the transaction in localStorage (same logic as RentalCloths component)
      const savedTransactions = localStorage.getItem('rentalTransactions');
      if (savedTransactions) {
        const transactions = JSON.parse(savedTransactions);
        const updatedTransactions = transactions.map(transaction => {
          if (transaction.RentalId.toString() === returnFormData.RentalId.toString()) {
            return {
              ...transaction,
              Status: "Returned",
              ReturnDate: new Date().toISOString(),
              DamageFee: returnFormData.IsDamaged ? parseFloat(returnFormData.DamagePrice) : 0,
              FinalAmount: (parseFloat(transaction.RentPrice) + (returnFormData.IsDamaged ? parseFloat(returnFormData.DamagePrice) : 0)).toFixed(2)
            };
          }
          return transaction;
        });
        localStorage.setItem('rentalTransactions', JSON.stringify(updatedTransactions));
      }

      // Dispatch the ReturnCloth action with the form data
      await dispatch(ReturnCloth(returnFormData));
      
      // Show success message and close modal only after successful return
      setNotification({ type: 'success', message: 'Cloth returned successfully!' });
      setShowReturnModal(false);
      setReturnFormData({ RentalId: "", IsDamaged: 0, DamagePrice: "0" });
      dispatch(RentalReprot()); // Refresh the data
      
    } catch (error) {
      console.error("Error returning cloth:", error);
      setNotification({ type: 'error', message: 'Failed to return cloth' });
    }
  };

  const handleReturnInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReturnFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  // Export to Excel function
  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = filteredTransactions.map(transaction => ({
        'Rental ID': transaction.RentalId,
        'Cloth ID': transaction.ClothId,
        'Customer Name': transaction.CustomerName,
        'Customer ID': transaction.CustomerId,
        'Quantity': transaction.Quantity,
        'Color': transaction.RequestedColor,
        'Size': transaction.RequestedSize,
        'Rent Price': parseFloat(transaction.RentPrice || 0),
        'Rent Date': formatDate(transaction.RentDate),
        'Return Date': formatDate(transaction.ReturnDate),
        'Damage Fee': parseFloat(transaction.DamageFee || 0),
        'Final Amount': parseFloat(transaction.FinalAmount || 0),
        'Status': transaction.Status
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Rental Transactions');

      // Generate Excel file and download
      const fileName = `Rental_Transactions_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      setNotification({ type: 'success', message: 'Excel report downloaded successfully!' });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      setNotification({ type: 'error', message: 'Failed to export Excel report' });
    }
  };

  // Add loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading rental transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-3 sm:p-4 md:p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
      {/* Notification */}
      {notification.message && (
        <div
          className={`fixed top-6 right-6 z-[9999] p-4 rounded-2xl shadow-2xl flex items-center animate-slide-in ${
            notification.type === "success" 
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200/50 border-l-4 border-l-green-400" 
              : "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200/50 border-l-4 border-l-rose-400"
          }`}
        >
          <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
            {notification.type === "success" ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
          </div>
          <span className="font-semibold text-sm">{notification.message}</span>
        </div>
      )}

{/* Header Section */}
      <div className="relative z-10 mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3">
          <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
            <FiShoppingBag className="text-white text-base sm:text-lg md:text-xl" />
          </div>
          <div className="transform  flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
              Rental Transactions
            </h1>
            <p className="text-slate-600 mt-0.5 text-xs sm:text-sm md:text-base truncate">
              Track all rental activities and returns
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards - Removed Active Rentals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 relative z-10">
        {/* Total Rentals Card */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Rentals</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">{totalRentals}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <FiShoppingBag className="text-white text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Revenue</p>
              <p className="text-lg sm:text-xl font-bold text-black-600">
                Rs. {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
              <FiDollarSign className="text-white text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        {/* Total Damage Fee Card */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Damage Fee</p>
              <p className="text-lg sm:text-xl font-bold text-black-600">
                Rs. {formatCurrency(totalDamageFee)}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg">
              <FiAlertCircle className="text-white text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        {/* Total Final Amount Card */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Final Amount</p>
              <p className="text-lg sm:text-xl font-bold text-black-600">
                Rs. {formatCurrency(totalFinalAmount)}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
              <FiBarChart2 className="text-white text-lg sm:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters Section */}
<div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
    {/* Search Input */}
    <div className="relative flex-grow group">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
      <input
        type="text"
        placeholder="Search by Rental ID, Cloth ID, Customer Name...."
        value={filters.searchTerm}
        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
        className="relative w-full pl-10 pr-4 py-2.5 md:pl-12 md:pr-6 md:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-[11px] sm:text-xs md:text-sm lg:text-base"
      />
      <FiSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={14} />
    </div>

          {/* Date Filter Type */}
          <select
            value={filters.filterType}
            onChange={(e) => handleFilterChange('filterType', e.target.value)}
            className="px-3 sm:px-4 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-medium transition-all duration-300 text-sm sm:text-base"
          >
            <option value="all">All Time</option>
            <option value="day">Day Wise</option>
            <option value="month">Month Wise</option>
            <option value="year">Year Wise</option>
          </select>

          
          {/* Single Date Picker */}
<div className="relative flex-grow group">
  <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
  <input
    type="date"
    value={filters.date}
    onChange={(e) => handleFilterChange('date', e.target.value)}
    className="relative w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-medium transition-all duration-300 text-sm sm:text-base"
    max={getCurrentDate()}
  />
</div>

          {/* Status Filter and Export */}
          <div className="flex gap-2 sm:gap-3">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-medium transition-all duration-300 text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="rented">Rented</option>
              <option value="returned">Returned</option>
            </select>

            <button 
              onClick={exportToExcel}
              className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95"
            >
              <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
              <FiDownload className="mr-2 sm:mr-3 relative z-10" size={isMobile ? 18 : 20} />
              <span className="relative z-10 text-sm sm:text-base">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Info Display */}
      {filters.date && filters.filterType !== 'all' && (
        <div className="relative z-10 mb-4">
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50">
            <p className="text-blue-800 font-medium text-sm">
              Showing rentals for:{' '}
              {filters.filterType === 'day' && `Day: ${formatToYYYYMMDD(filters.date)}`}
              {filters.filterType === 'month' && `Month: ${getMonthName(filters.date)} ${new Date(filters.date).getFullYear()}`}
              {filters.filterType === 'year' && `Year: ${new Date(filters.date).getFullYear()}`}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced 3D Table */}
      <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Rental ID</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Cloth ID</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Customer</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Qty</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Color</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Size</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Rent Price</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Rent Date</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Return Date</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Damage Fee</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Final Amount</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50">
              {currentRecords.length > 0 ? (
                currentRecords.map((transaction, index) => (
                  <tr 
                    key={transaction.RentalId || index} 
                    className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
                  >
                    <td className="px-2 py-3 text-slate-600 text-sm font-mono">
                      {transaction.RentalId}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      {transaction.ClothId}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      <div className="flex items-center">
                        <div>
                          <div className="font-normal">{transaction.CustomerName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm text-center">
                      {transaction.Quantity}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300 mr-2 shadow-sm"
                          style={{ backgroundColor: transaction.RequestedColor?.toLowerCase() }}
                        ></div>
                        <span className="capitalize">
                          {transaction.RequestedColor}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      {transaction.RequestedSize}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      Rs. {formatCurrency(transaction.RentPrice)}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm max-w-[120px] truncate" title={formatDate(transaction.RentDate)}>
                      {formatDate(transaction.RentDate)}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm max-w-[120px] truncate" title={formatDate(transaction.ReturnDate)}>
                      {formatDate(transaction.ReturnDate)}
                    </td>
                    <td className="px-2 py-3 text-red-600 text-sm">
                      {transaction.DamageFee > 0 ? `Rs. ${formatCurrency(transaction.DamageFee)}` : '-'}
                    </td>
                    <td className="px-2 py-3 text-green-700 text-sm font-semibold">
                      Rs. {formatCurrency(transaction.FinalAmount)}
                    </td>
                    <td className="px-2 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.Status)}`}>
                        {transaction.Status}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      {transaction.Status === "Rented" && (
                        <button
                          onClick={() => handleReturnClick(transaction)}
                          className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
                          title="Return Cloth"
                        >
                          <FiRotateCw size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="text-center py-8 sm:py-12">
                    <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                      <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                        <FiShoppingBag className="text-slate-500 text-lg sm:text-xl" />
                      </div>
                      <p className="text-slate-500 font-medium text-sm sm:text-base">
                        {filters.searchTerm || filters.status !== "all" || (filters.date && filters.filterType !== 'all')
                          ? "No transactions found matching your criteria" 
                          : "No rental transactions available"}
                      </p>
                      {error && (
                        <p className="text-red-500 text-sm">Error: {error}</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        {filteredTransactions.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
            <div className="text-xs sm:text-sm text-slate-600 font-medium">
              Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredTransactions.length)} of{' '}
              {filteredTransactions.length}
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <FiChevronLeft size={isSmallMobile ? 12 : 14} />
              </button>

              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  onClick={() => goToPage(num)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm min-w-[32px] sm:min-w-[36px] ${
                    num === currentPage
                      ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <FiChevronRight size={isSmallMobile ? 12 : 14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced 3D Modal */}
      {showReturnModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-700 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
              <button
                onClick={() => setShowReturnModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200"
              >
                <FiX className="text-lg" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl">
                  <FiRotateCw className="text-white text-lg" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Return Rental Cloth
                </h2>
              </div>

              <form onSubmit={handleReturnSubmit} className="space-y-4">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Transaction Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-600">Rental ID:</span>
                      <span className="font-medium ml-2">{selectedTransaction.RentalId}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Cloth ID:</span>
                      <span className="font-medium ml-2">{selectedTransaction.ClothId}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Customer:</span>
                      <span className="font-medium ml-2">{selectedTransaction.CustomerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Rent Price:</span>
                      <span className="font-medium ml-2">Rs. {formatCurrency(selectedTransaction.RentPrice)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="IsDamaged"
                    checked={returnFormData.IsDamaged === 1}
                    onChange={handleReturnInputChange}
                    className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label className="text-sm font-medium text-slate-700">Is the cloth damaged?</label>
                </div>
                
                {returnFormData.IsDamaged === 1 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Damage Price (Rs.)</label>
                    <input
                      type="number"
                      name="DamagePrice"
                      value={returnFormData.DamagePrice}
                      onChange={handleReturnInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 text-sm"
                      placeholder="Enter damage price"
                    />
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReturnModal(false)}
                    className="px-4 py-2 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={returnLoading}
                    className="px-4 py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm order-1 sm:order-2"
                  >
                    {returnLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Returning...</span>
                      </>
                    ) : (
                      <>
                        <FiRotateCw size={16} />
                        <span>Return Cloth</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalTransactions;