// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Report as ReportAction } from '../actions/reportAction';
// import * as XLSX from 'xlsx';
// import {
//   FiSearch,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiChevronLeft,
//   FiChevronRight,
//   FiUsers,
//   FiTrendingUp,
//   FiDollarSign,
//   FiPackage,
//   FiCalendar,
//   FiDownload
// } from 'react-icons/fi';

// const Report = () => {
//   const dispatch = useDispatch();
//   const { responseBody, loading, error, msg } = useSelector((state) => state.report);
  
//   const [filteredData, setFilteredData] = useState([]);
//   const [filters, setFilters] = useState({
//     status: '',
//     date: '',
//     filterType: 'all', // 'all', 'day', 'month', 'year'
//     searchTerm: ''
//   });

//   // Mobile responsive state
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   useEffect(() => {
//     dispatch(ReportAction());
//   }, [dispatch]);

//   useEffect(() => {
//     if (responseBody && Array.isArray(responseBody)) {
//       const sortedData = [...responseBody].sort((a, b) => {
//         const idA = parseInt(a.OrderId) || 0;
//         const idB = parseInt(b.OrderId) || 0;
//         return idB - idA;
//       });
//       setFilteredData(sortedData);
//     }
//   }, [responseBody]);

//   // Handle resize for mobile responsiveness
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       setIsSmallMobile(window.innerWidth < 480);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Apply filters
//   useEffect(() => {
//     if (responseBody && Array.isArray(responseBody)) {
//       let filtered = responseBody;

//       // Date filtering based on selection
//       if (filters.date && filters.filterType !== 'all') {
//         const selectedDate = new Date(filters.date);
        
//         switch (filters.filterType) {
//           case 'day':
//             // Filter by specific day
//             filtered = filtered.filter(item => {
//               const itemDate = new Date(item.OrderDate);
//               return itemDate.toDateString() === selectedDate.toDateString();
//             });
//             break;
            
//           case 'month':
//             // Filter by month (January to December)
//             filtered = filtered.filter(item => {
//               const itemDate = new Date(item.OrderDate);
//               return itemDate.getMonth() === selectedDate.getMonth() && 
//                      itemDate.getFullYear() === selectedDate.getFullYear();
//             });
//             break;
            
//           case 'year':
//             // Filter by year
//             filtered = filtered.filter(item => {
//               const itemDate = new Date(item.OrderDate);
//               return itemDate.getFullYear() === selectedDate.getFullYear();
//             });
//             break;
            
//           default:
//             break;
//         }
//       }

//       if (filters.status) {
//         filtered = filtered.filter(item => 
//           item.Status?.toLowerCase().includes(filters.status.toLowerCase())
//         );
//       }

//       if (filters.searchTerm) {
//         const term = filters.searchTerm.toLowerCase();
//         filtered = filtered.filter(item =>
//           item.FullName?.toLowerCase().includes(term) ||
//           item.PhoneNumber?.includes(term) ||
//           item.fabricName?.toLowerCase().includes(term) ||
//           item.garmentName?.toLowerCase().includes(term) ||
//           item.OrderId?.toString().includes(term)
//         );
//       }

//       const sortedFiltered = filtered.sort((a, b) => {
//         const idA = parseInt(a.OrderId) || 0;
//         const idB = parseInt(b.OrderId) || 0;
//         return idB - idA;
//       });

//       setFilteredData(sortedFiltered);
//       setCurrentPage(1);
//     }
//   }, [filters, responseBody]);

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   // Get current date in YYYY-MM-DD format for the date picker
//   const getCurrentDate = () => {
//     return new Date().toISOString().split('T')[0];
//   };

//   // Get month name from date
//   const getMonthName = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('default', { month: 'long' });
//   };

//   // Format date to YYYY-MM-DD
//   const formatToYYYYMMDD = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const day = String(date.getDate()).padStart(2, '0');
//       return `${year}-${month}-${day}`;
//     } catch {
//       return dateString;
//     }
//   };

//   // Excel Export Function - UPDATED to use Price instead of TotalAmount
//   const exportToExcel = () => {
//     if (!filteredData.length) {
//       alert('No data to export!');
//       return;
//     }

//     const excelData = filteredData.map(item => ({
//       'Order ID': item.OrderId || 'N/A',
//       'Order Item ID': item.OrderItemId || 'N/A',
//       'Customer Name': item.FullName || 'N/A',
//       'Phone Number': item.PhoneNumber || 'N/A',
//       'Garment': item.garmentName || 'N/A',
//       'Fabric': item.fabricName || 'N/A',
//       'Order Date': formatToYYYYMMDD(item.OrderDate),
//       'Delivery Date': formatToYYYYMMDD(item.DeliveryDate),
//       'Price': parseFloat(item.Price || 0).toLocaleString(), // CHANGED: TotalAmount to Price
//       'Status': item.Status || 'Unknown'
//     }));

//     const ws = XLSX.utils.json_to_sheet(excelData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

//     const fileName = `Sales_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
//     XLSX.writeFile(wb, fileName);
//   };

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentReports = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   // Pagination handlers
//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const goToPrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const goToPage = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // Generate page numbers for pagination
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

//   // Keep the original formatDate function for display purposes if needed elsewhere
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   // Calculate stats - UPDATED to use Price instead of TotalAmount
//   const totalOrders = responseBody?.length || 0;
//   const completedOrders = responseBody?.filter(item => item.Status?.toLowerCase() === 'completed').length || 0;
//   const pendingOrders = responseBody?.filter(item => 
//     item.Status?.toLowerCase() === 'pending' || 
//     item.Status?.toLowerCase() === 'in progress'
//   ).length || 0;
//   const totalRevenue = responseBody?.reduce((sum, item) => sum + parseFloat(item.Price || 0), 0) || 0; // CHANGED: TotalAmount to Price

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center p-4">
//         <div className="relative z-10 text-center">
//           <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div>
//             <span className="text-slate-700 font-medium">Loading reports...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center p-4">
//         <div className="relative z-10 text-center">
//           <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
//             <div className="text-red-500 text-center">
//               <FiAlertCircle className="w-12 h-12 mx-auto mb-4" />
//               <h3 className="text-lg font-bold text-slate-800 mb-2">Error Loading Reports</h3>
//               <p className="text-slate-600">{error}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-3 sm:p-4 md:p-6 relative overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>

//       {/* Header Section */}
//       <div className="relative z-10 mb-4 sm:mb-6 md:mb-8">
//         <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3">
//           <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
//             <FiTrendingUp className="text-white text-base sm:text-lg md:text-xl" />
//           </div>
//           <div className="transform  flex-1 min-w-0">
//             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
//               Sales Report
//             </h1>
//             <p className="text-slate-600 mt-0.5 text-xs sm:text-sm md:text-base truncate">
//               Comprehensive overview of all orders with detailed analytics
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 relative z-10">
//         {/* Total Revenue */}
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Total Revenue</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   Rs. {totalRevenue.toLocaleString()}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
//                 <FiDollarSign className="text-white text-sm sm:text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Total Orders */}
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Total Orders</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {totalOrders}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
//                 <FiPackage className="text-white text-sm sm:text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Completed Orders */}
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Completed</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {completedOrders}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
//                 <FiCheckCircle className="text-white text-sm sm:text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Pending Orders */}
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">In Progress</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {pendingOrders}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
//                 <FiCalendar className="text-white text-sm sm:text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search + Filters */}
//       <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
//         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
//           {/* Search Input */}
//           <div className="relative flex-grow group">
//             <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//             <input
//               type="text"
//               placeholder="Search by Order ID, Customer Name, Phone, or Product..."
//               value={filters.searchTerm}
//               onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
//               className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
//             />
//             <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={isMobile ? 18 : 20} />
//           </div>

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
//           <input
//             type="date"
//             value={filters.date}
//             onChange={(e) => handleFilterChange('date', e.target.value)}
//             className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-medium transition-all duration-300 text-sm sm:text-base"
//             max={getCurrentDate()}
//           />

//           {/* Status Filter and Export */}
//           <div className="flex gap-2 sm:gap-3">
//             <select
//               value={filters.status}
//               onChange={(e) => handleFilterChange('status', e.target.value)}
//               className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-medium transition-all duration-300 text-sm sm:text-base"
//             >
//               <option value="">All Status</option>
//               <option value="completed">Completed</option>
//               <option value="pending">Pending</option>
//               <option value="in progress">In Progress</option>
//               <option value="cancelled">Cancelled</option>
//               <option value="delivered">Delivered</option>
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
//               Showing orders for:{' '}
//               {filters.filterType === 'day' && `Day: ${formatToYYYYMMDD(filters.date)}`}
//               {filters.filterType === 'month' && `Month: ${getMonthName(filters.date)} ${new Date(filters.date).getFullYear()}`}
//               {filters.filterType === 'year' && `Year: ${new Date(filters.date).getFullYear()}`}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Reports Table */}
//       <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
//         {/* Desktop Table with 10 Columns */}
//         {!isMobile && (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Order ID</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Order Item ID</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Customer Name</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Phone Number</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Garment</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Fabric</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Order Date</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Delivery Date</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Price (Rs)</th> {/* CHANGED: Amount to Price */}
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200/50">
//                 {currentReports.length > 0 ? (
//                   currentReports.map((report, index) => (
//                     <tr 
//                       key={`${report.OrderId}-${report.OrderItemId}-${index}`} 
//                       className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
//                     >
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.OrderId || 'N/A'}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.OrderItemId || 'N/A'}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.FullName || 'N/A'}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.PhoneNumber || 'N/A'}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.garmentName || 'N/A'}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.fabricName || 'N/A'}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {formatToYYYYMMDD(report.OrderDate)}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {formatToYYYYMMDD(report.DeliveryDate)}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {parseFloat(report.Price || 0).toLocaleString()} {/* CHANGED: TotalAmount to Price */}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.Status || 'Unknown'}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={10} className="text-center py-8 sm:py-12">
//                       <div className="flex flex-col items-center space-y-2 sm:space-y-3">
//                         <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                           <FiPackage className="text-slate-500 text-lg sm:text-xl" />
//                         </div>
//                         <p className="text-slate-500 font-medium text-sm sm:text-base">
//                           {filters.searchTerm || filters.status || filters.date ? 'No matching orders found' : 'No orders available'}
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Mobile Cards Layout */}
//         {isMobile && (
//           <div className="p-4 space-y-3">
//             {currentReports.length > 0 ? (
//               currentReports.map((report, index) => (
//                 <div 
//                   key={`${report.OrderId}-${report.OrderItemId}-${index}`}
//                   className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-4 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
//                 >
//                   <div className="grid grid-cols-2 gap-2 text-xs">
//                     <div><span className="font-semibold">Order ID:</span> {report.OrderId}</div>
//                     <div><span className="font-semibold">Item ID:</span> {report.OrderItemId}</div>
//                     <div><span className="font-semibold">Customer:</span> {report.FullName}</div>
//                     <div><span className="font-semibold">Phone:</span> {report.PhoneNumber}</div>
//                     <div><span className="font-semibold">Garment:</span> {report.garmentName}</div>
//                     <div><span className="font-semibold">Fabric:</span> {report.fabricName}</div>
//                     <div><span className="font-semibold">Order Date:</span> {formatToYYYYMMDD(report.OrderDate)}</div>
//                     <div><span className="font-semibold">Delivery:</span> {formatToYYYYMMDD(report.DeliveryDate)}</div>
//                     <div><span className="font-semibold">Price:</span> Rs. {parseFloat(report.Price || 0).toLocaleString()}</div> {/* CHANGED: Amount to Price */}
//                     <div><span className="font-semibold">Status:</span> {report.Status}</div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <div className="flex flex-col items-center space-y-3">
//                   <div className="p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                     <FiPackage className="text-slate-500 text-xl" />
//                   </div>
//                   <p className="text-slate-500 font-medium">
//                     {filters.searchTerm || filters.status || filters.date ? 'No matching orders found' : 'No orders available'}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Pagination */}
//         {filteredData.length > itemsPerPage && (
//           <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
//             <div className="text-xs sm:text-sm text-slate-600 font-medium">
//               Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredData.length)} of{' '}
//               {filteredData.length}
//             </div>
//             <div className="flex items-center space-x-1 sm:space-x-2">
//               <button
//                 onClick={goToPrevPage}
//                 disabled={currentPage === 1}
//                 className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//               >
//                 <FiChevronLeft size={isSmallMobile ? 12 : 14} />
//               </button>

//               {getPageNumbers().map((pageNumber) => (
//                 <button
//                   key={pageNumber}
//                   onClick={() => goToPage(pageNumber)}
//                   className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm min-w-[32px] sm:min-w-[36px] ${
//                     pageNumber === currentPage
//                       ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
//                       : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                   }`}
//                 >
//                   {pageNumber}
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
//     </div>
//   );
// };

// export default Report;



// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Report as ReportAction } from '../actions/reportAction';
// import * as XLSX from 'xlsx';
// import {
//   FiSearch,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiChevronLeft,
//   FiChevronRight,
//   FiUsers,
//   FiTrendingUp,
//   FiDollarSign,
//   FiPackage,
//   FiCalendar,
//   FiDownload
// } from 'react-icons/fi';

// const Report = () => {
//   const dispatch = useDispatch();
//   const { responseBody, loading, error, msg } = useSelector((state) => state.report);
  
//   const [filteredData, setFilteredData] = useState([]);
//   const [filters, setFilters] = useState({
//     status: '',
//     date: '',
//     filterType: 'all', // 'all', 'day', 'month', 'year'
//     searchTerm: ''
//   });

//   // Mobile responsive state
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   useEffect(() => {
//     dispatch(ReportAction());
//   }, [dispatch]);

//   useEffect(() => {
//     if (responseBody && Array.isArray(responseBody)) {
//       const sortedData = [...responseBody].sort((a, b) => {
//         const idA = parseInt(a.OrderId) || 0;
//         const idB = parseInt(b.OrderId) || 0;
//         return idB - idA;
//       });
//       setFilteredData(sortedData);
//     }
//   }, [responseBody]);

//   // Handle resize for mobile responsiveness
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       setIsSmallMobile(window.innerWidth < 480);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Apply filters
//   useEffect(() => {
//     if (responseBody && Array.isArray(responseBody)) {
//       let filtered = responseBody;

//       // Date filtering based on selection
//       if (filters.date && filters.filterType !== 'all') {
//         const selectedDate = new Date(filters.date);
        
//         switch (filters.filterType) {
//           case 'day':
//             // Filter by specific day
//             filtered = filtered.filter(item => {
//               const itemDate = new Date(item.OrderDate);
//               return itemDate.toDateString() === selectedDate.toDateString();
//             });
//             break;
            
//           case 'month':
//             // Filter by month (January to December)
//             filtered = filtered.filter(item => {
//               const itemDate = new Date(item.OrderDate);
//               return itemDate.getMonth() === selectedDate.getMonth() && 
//                      itemDate.getFullYear() === selectedDate.getFullYear();
//             });
//             break;
            
//           case 'year':
//             // Filter by year
//             filtered = filtered.filter(item => {
//               const itemDate = new Date(item.OrderDate);
//               return itemDate.getFullYear() === selectedDate.getFullYear();
//             });
//             break;
            
//           default:
//             break;
//         }
//       }

//       if (filters.status) {
//         filtered = filtered.filter(item => 
//           item.Status?.toLowerCase().includes(filters.status.toLowerCase())
//         );
//       }

//       if (filters.searchTerm) {
//         const term = filters.searchTerm.toLowerCase();
//         filtered = filtered.filter(item =>
//           item.FullName?.toLowerCase().includes(term) ||
//           item.PhoneNumber?.includes(term) ||
//           item.fabricName?.toLowerCase().includes(term) ||
//           item.garmentName?.toLowerCase().includes(term) ||
//           item.OrderId?.toString().includes(term)
//         );
//       }

//       const sortedFiltered = filtered.sort((a, b) => {
//         const idA = parseInt(a.OrderId) || 0;
//         const idB = parseInt(b.OrderId) || 0;
//         return idB - idA;
//       });

//       setFilteredData(sortedFiltered);
//       setCurrentPage(1);
//     }
//   }, [filters, responseBody]);

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   // Get current date in YYYY-MM-DD format for the date picker
//   const getCurrentDate = () => {
//     return new Date().toISOString().split('T')[0];
//   };

//   // Get month name from date
//   const getMonthName = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('default', { month: 'long' });
//   };

//   // Format date to YYYY-MM-DD
//   const formatToYYYYMMDD = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const day = String(date.getDate()).padStart(2, '0');
//       return `${year}-${month}-${day}`;
//     } catch {
//       return dateString;
//     }
//   };

//   // Professional Excel Export Function with Single Header and Table Format
//   const exportToExcel = () => {
//     if (!filteredData.length) {
//       alert('No data to export!');
//       return;
//     }

//     // Prepare the data for Excel
//     const excelData = filteredData.map(item => ({
//       'Order ID': item.OrderId || 'N/A',
//       'Order Item ID': item.OrderItemId || 'N/A',
//       'Customer Name': item.FullName || 'N/A',
//       'Phone Number': item.PhoneNumber || 'N/A',
//       'Garment': item.garmentName || 'N/A',
//       'Fabric': item.fabricName || 'N/A',
//       'Order Date': formatToYYYYMMDD(item.OrderDate),
//       'Delivery Date': formatToYYYYMMDD(item.DeliveryDate),
//       'Price (Rs)': parseFloat(item.Price || 0),
//       'Status': item.Status || 'Unknown'
//     }));

//     // Create workbook
//     const wb = XLSX.utils.book_new();
    
//     // Create headers array
//     const headers = ['Order ID', 'Order Item ID', 'Customer Name', 'Phone Number', 'Garment', 'Fabric', 'Order Date', 'Delivery Date', 'Price (Rs)', 'Status'];
    
//     // Create data rows
//     const dataRows = excelData.map(row => [
//       row['Order ID'],
//       row['Order Item ID'],
//       row['Customer Name'],
//       row['Phone Number'],
//       row['Garment'],
//       row['Fabric'],
//       row['Order Date'],
//       row['Delivery Date'],
//       row['Price (Rs)'],
//       row['Status']
//     ]);

//     // Combine headers and data
//     const allData = [
//       headers, // Single header row
//       ...dataRows // All data rows
//     ];

//     // Create worksheet
//     const ws = XLSX.utils.aoa_to_sheet(allData);

//     // Set column widths for better readability
//     const colWidths = [
//       { wch: 12 }, // Order ID
//       { wch: 15 }, // Order Item ID
//       { wch: 20 }, // Customer Name
//       { wch: 15 }, // Phone Number
//       { wch: 15 }, // Garment
//       { wch: 15 }, // Fabric
//       { wch: 12 }, // Order Date
//       { wch: 12 }, // Delivery Date
//       { wch: 12 }, // Price (Rs)
//       { wch: 15 }  // Status
//     ];
//     ws['!cols'] = colWidths;

//     // Add auto-filter to headers (creates filter dropdowns in Excel)
//     if (allData.length > 1) {
//       ws['!autofilter'] = {
//         ref: XLSX.utils.encode_range({
//           s: { r: 0, c: 0 },
//           e: { r: allData.length - 1, c: headers.length - 1 }
//         })
//       };
//     }

//     // Add the worksheet to the workbook
//     XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

//     // Generate filename
//     const timestamp = new Date().toISOString().split('T')[0];
//     const fileName = `Tailoring_Sales_Report_${timestamp}.xlsx`;

//     // Export the file
//     XLSX.writeFile(wb, fileName);
//   };

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentReports = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   // Pagination handlers
//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const goToPrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const goToPage = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // Generate page numbers for pagination
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

//   // Keep the original formatDate function for display purposes if needed elsewhere
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   // Calculate stats - UPDATED to track delivered instead of completed
//   const totalOrders = responseBody?.length || 0;
//   const deliveredOrders = responseBody?.filter(item => item.Status?.toLowerCase() === 'delivered').length || 0;
//   const pendingOrders = responseBody?.filter(item => 
//     item.Status?.toLowerCase() === 'in progress' || 
//     item.Status?.toLowerCase() === 'priority'
//   ).length || 0;
//   const totalRevenue = responseBody?.reduce((sum, item) => sum + parseFloat(item.Price || 0), 0) || 0;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center p-4">
//         <div className="relative z-10 text-center">
//           <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div>
//             <span className="text-slate-700 font-medium">Loading reports...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center p-4">
//         <div className="relative z-10 text-center">
//           <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
//             <div className="text-red-500 text-center">
//               <FiAlertCircle className="w-12 h-12 mx-auto mb-4" />
//               <h3 className="text-lg font-bold text-slate-800 mb-2">Error Loading Reports</h3>
//               <p className="text-slate-600">{error}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-3 sm:p-4 md:p-6 relative overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>

//       {/* Header Section */}
//       <div className="relative z-10 mb-4 sm:mb-6 md:mb-8">
//         <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3">
//           <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
//             <FiTrendingUp className="text-white text-base sm:text-lg md:text-xl" />
//           </div>
//           <div className="transform  flex-1 min-w-0">
//             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
//               Sales Report
//             </h1>
//             <p className="text-slate-600 mt-0.5 text-xs sm:text-sm md:text-base truncate">
//               Comprehensive overview of all orders with detailed analytics
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 relative z-10">
//         {/* Total Revenue */}
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Total Revenue</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   Rs. {totalRevenue.toLocaleString()}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
//                 <FiDollarSign className="text-white text-sm sm:text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Total Orders */}
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Total Orders</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {totalOrders}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
//                 <FiPackage className="text-white text-sm sm:text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Delivered Orders - CHANGED from Completed to Delivered */}
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Delivered</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {deliveredOrders}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
//                 <FiCheckCircle className="text-white text-sm sm:text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* In Progress Orders */}
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">In Progress</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {pendingOrders}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
//                 <FiCalendar className="text-white text-sm sm:text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search + Filters */}
//       <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
//         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
//           {/* Search Input */}
//           <div className="relative flex-grow group">
//             <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//             <input
//               type="text"
//               placeholder="Search by Order ID, Customer Name, Phone, or Product..."
//               value={filters.searchTerm}
//               onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
//               className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
//             />
//             <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={isMobile ? 18 : 20} />
//           </div>

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
//           <input
//             type="date"
//             value={filters.date}
//             onChange={(e) => handleFilterChange('date', e.target.value)}
//             className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-medium transition-all duration-300 text-sm sm:text-base"
//             max={getCurrentDate()}
//           />

//           {/* Status Filter and Export - UPDATED with only inprogress, priority, delivered */}
//           <div className="flex gap-2 sm:gap-3">
//             <select
//               value={filters.status}
//               onChange={(e) => handleFilterChange('status', e.target.value)}
//               className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-medium transition-all duration-300 text-sm sm:text-base"
//             >
//               <option value="">All Status</option>
//               <option value="in progress">In Progress</option>
//               <option value="priority">Priority</option>
//               <option value="delivered">Delivered</option>
//             </select>

//             <button 
//               onClick={exportToExcel}
//               className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95"
//             >
//               <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//               <FiDownload className="mr-2 sm:mr-3 relative z-10" size={isMobile ? 18 : 20} />
//               <span className="relative z-10 text-sm sm:text-base">Export Excel</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Filter Info Display */}
//       {filters.date && filters.filterType !== 'all' && (
//         <div className="relative z-10 mb-4">
//           <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50">
//             <p className="text-blue-800 font-medium text-sm">
//               Showing orders for:{' '}
//               {filters.filterType === 'day' && `Day: ${formatToYYYYMMDD(filters.date)}`}
//               {filters.filterType === 'month' && `Month: ${getMonthName(filters.date)} ${new Date(filters.date).getFullYear()}`}
//               {filters.filterType === 'year' && `Year: ${new Date(filters.date).getFullYear()}`}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Reports Table */}
//       <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
//         {/* Desktop Table with 10 Columns */}
//         {!isMobile && (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Order ID</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Order Item ID</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Customer Name</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Phone Number</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Garment</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Fabric</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Order Date</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Delivery Date</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Price (Rs)</th>
//                   <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200/50">
//                 {currentReports.length > 0 ? (
//                   currentReports.map((report, index) => (
//                     <tr 
//                       key={`${report.OrderId}-${report.OrderItemId}-${index}`} 
//                       className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
//                     >
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.OrderId || 'N/A'}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.OrderItemId || 'N/A'}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.FullName || 'N/A'}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.PhoneNumber || 'N/A'}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.garmentName || 'N/A'}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.fabricName || 'N/A'}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {formatToYYYYMMDD(report.OrderDate)}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {formatToYYYYMMDD(report.DeliveryDate)}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {parseFloat(report.Price || 0).toLocaleString()}
//                       </td>
//                       <td className="px-2 py-3 text-slate-600 text-sm">
//                         {report.Status || 'Unknown'}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={10} className="text-center py-8 sm:py-12">
//                       <div className="flex flex-col items-center space-y-2 sm:space-y-3">
//                         <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                           <FiPackage className="text-slate-500 text-lg sm:text-xl" />
//                         </div>
//                         <p className="text-slate-500 font-medium text-sm sm:text-base">
//                           {filters.searchTerm || filters.status || filters.date ? 'No matching orders found' : 'No orders available'}
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Mobile Cards Layout */}
//         {isMobile && (
//           <div className="p-4 space-y-3">
//             {currentReports.length > 0 ? (
//               currentReports.map((report, index) => (
//                 <div 
//                   key={`${report.OrderId}-${report.OrderItemId}-${index}`}
//                   className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-4 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
//                 >
//                   <div className="grid grid-col-2 gap-2 text-xs">
//                     <div><span className="font-semibold">Order ID:</span> {report.OrderId}</div>
//                     <div><span className="font-semibold">Item ID:</span> {report.OrderItemId}</div>
//                     <div><span className="font-semibold">Customer:</span> {report.FullName}</div>
//                     <div><span className="font-semibold">Phone:</span> {report.PhoneNumber}</div>
//                     <div><span className="font-semibold">Garment:</span> {report.garmentName}</div>
//                     <div><span className="font-semibold">Fabric:</span> {report.fabricName}</div>
//                     <div><span className="font-semibold">Order Date:</span> {formatToYYYYMMDD(report.OrderDate)}</div>
//                     <div><span className="font-semibold">Delivery:</span> {formatToYYYYMMDD(report.DeliveryDate)}</div>
//                     <div><span className="font-semibold">Price:</span> Rs. {parseFloat(report.Price || 0).toLocaleString()}</div>
//                     <div><span className="font-semibold">Status:</span> {report.Status}</div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <div className="flex flex-col items-center space-y-3">
//                   <div className="p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                     <FiPackage className="text-slate-500 text-xl" />
//                   </div>
//                   <p className="text-slate-500 font-medium">
//                     {filters.searchTerm || filters.status || filters.date ? 'No matching orders found' : 'No orders available'}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Pagination */}
//         {filteredData.length > itemsPerPage && (
//           <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
//             <div className="text-xs sm:text-sm text-slate-600 font-medium">
//               Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredData.length)} of{' '}
//               {filteredData.length}
//             </div>
//             <div className="flex items-center space-x-1 sm:space-x-2">
//               <button
//                 onClick={goToPrevPage}
//                 disabled={currentPage === 1}
//                 className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//               >
//                 <FiChevronLeft size={isSmallMobile ? 12 : 14} />
//               </button>

//               {getPageNumbers().map((pageNumber) => (
//                 <button
//                   key={pageNumber}
//                   onClick={() => goToPage(pageNumber)}
//                   className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm min-w-[32px] sm:min-w-[36px] ${
//                     pageNumber === currentPage
//                       ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
//                       : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                   }`}
//                 >
//                   {pageNumber}
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
//     </div>
//   );
// };

// export default Report;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Report as ReportAction } from '../actions/reportAction';
import * as XLSX from 'xlsx';
import {
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiTrendingUp,
  FiDollarSign,
  FiPackage,
  FiCalendar,
  FiDownload
} from 'react-icons/fi';

const Report = () => {
  const dispatch = useDispatch();
  const { responseBody, loading, error, msg } = useSelector((state) => state.report);
  
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    filterType: 'all', // 'all', 'day', 'month', 'year'
    searchTerm: ''
  });

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(ReportAction());
  }, [dispatch]);

  useEffect(() => {
    if (responseBody && Array.isArray(responseBody)) {
      const sortedData = [...responseBody].sort((a, b) => {
        const idA = parseInt(a.OrderId) || 0;
        const idB = parseInt(b.OrderId) || 0;
        return idB - idA;
      });
      setFilteredData(sortedData);
    }
  }, [responseBody]);

  // Handle resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply filters
  useEffect(() => {
    if (responseBody && Array.isArray(responseBody)) {
      let filtered = responseBody;

      // Date filtering based on selection
      if (filters.date && filters.filterType !== 'all') {
        const selectedDate = new Date(filters.date);
        
        switch (filters.filterType) {
          case 'day':
            // Filter by specific day
            filtered = filtered.filter(item => {
              const itemDate = new Date(item.OrderDate);
              return itemDate.toDateString() === selectedDate.toDateString();
            });
            break;
            
          case 'month':
            // Filter by month (January to December)
            filtered = filtered.filter(item => {
              const itemDate = new Date(item.OrderDate);
              return itemDate.getMonth() === selectedDate.getMonth() && 
                     itemDate.getFullYear() === selectedDate.getFullYear();
            });
            break;
            
          case 'year':
            // Filter by year
            filtered = filtered.filter(item => {
              const itemDate = new Date(item.OrderDate);
              return itemDate.getFullYear() === selectedDate.getFullYear();
            });
            break;
            
          default:
            break;
        }
      }

      if (filters.status) {
        filtered = filtered.filter(item => 
          item.Status?.toLowerCase().includes(filters.status.toLowerCase())
        );
      }

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(item =>
          item.FullName?.toLowerCase().includes(term) ||
          item.PhoneNumber?.includes(term) ||
          item.fabricName?.toLowerCase().includes(term) ||
          item.garmentName?.toLowerCase().includes(term) ||
          item.OrderId?.toString().includes(term)
        );
      }

      const sortedFiltered = filtered.sort((a, b) => {
        const idA = parseInt(a.OrderId) || 0;
        const idB = parseInt(b.OrderId) || 0;
        return idB - idA;
      });

      setFilteredData(sortedFiltered);
      setCurrentPage(1);
    }
  }, [filters, responseBody]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Get current date in YYYY-MM-DD format for the date picker
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get month name from date
  const getMonthName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long' });
  };

  // Format date to YYYY-MM-DD
  const formatToYYYYMMDD = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return dateString;
    }
  };

  // Format price to two decimal places
  const formatPrice = (price) => {
    const num = parseFloat(price || 0);
    return num.toFixed(2);
  };

  // Format price with thousands separators and two decimal places for display
  const formatPriceDisplay = (price) => {
    const num = parseFloat(price || 0);
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Professional Excel Export Function with Single Header and Table Format
  const exportToExcel = () => {
    if (!filteredData.length) {
      alert('No data to export!');
      return;
    }

    // Prepare the data for Excel
    const excelData = filteredData.map(item => ({
      'Order ID': item.OrderId || 'N/A',
      'Order Item ID': item.OrderItemId || 'N/A',
      'Customer Name': item.FullName || 'N/A',
      'Phone Number': item.PhoneNumber || 'N/A',
      'Garment': item.garmentName || 'N/A',
      'Fabric': item.fabricName || 'N/A',
      'Order Date': formatToYYYYMMDD(item.OrderDate),
      'Delivery Date': formatToYYYYMMDD(item.DeliveryDate),
      'Price (Rs)': formatPrice(item.Price), // Use formatted price with two decimals
      'Status': item.Status || 'Unknown'
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Create headers array
    const headers = ['Order ID', 'Order Item ID', 'Customer Name', 'Phone Number', 'Garment', 'Fabric', 'Order Date', 'Delivery Date', 'Price (Rs)', 'Status'];
    
    // Create data rows
    const dataRows = excelData.map(row => [
      row['Order ID'],
      row['Order Item ID'],
      row['Customer Name'],
      row['Phone Number'],
      row['Garment'],
      row['Fabric'],
      row['Order Date'],
      row['Delivery Date'],
      row['Price (Rs)'],
      row['Status']
    ]);

    // Combine headers and data
    const allData = [
      headers, // Single header row
      ...dataRows // All data rows
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(allData);

    // Set column widths for better readability
    const colWidths = [
      { wch: 12 }, // Order ID
      { wch: 15 }, // Order Item ID
      { wch: 20 }, // Customer Name
      { wch: 15 }, // Phone Number
      { wch: 15 }, // Garment
      { wch: 15 }, // Fabric
      { wch: 12 }, // Order Date
      { wch: 12 }, // Delivery Date
      { wch: 12 }, // Price (Rs)
      { wch: 15 }  // Status
    ];
    ws['!cols'] = colWidths;

    // Add auto-filter to headers (creates filter dropdowns in Excel)
    if (allData.length > 1) {
      ws['!autofilter'] = {
        ref: XLSX.utils.encode_range({
          s: { r: 0, c: 0 },
          e: { r: allData.length - 1, c: headers.length - 1 }
        })
      };
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `Tailoring_Sales_Report_${timestamp}.xlsx`;

    // Export the file
    XLSX.writeFile(wb, fileName);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
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

  // Keep the original formatDate function for display purposes if needed elsewhere
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Calculate stats - UPDATED to track delivered instead of completed
  const totalOrders = responseBody?.length || 0;
  const deliveredOrders = responseBody?.filter(item => item.Status?.toLowerCase() === 'delivered').length || 0;
  const pendingOrders = responseBody?.filter(item => 
    item.Status?.toLowerCase() === 'in progress' || 
    item.Status?.toLowerCase() === 'priority'
  ).length || 0;
  const totalRevenue = responseBody?.reduce((sum, item) => sum + parseFloat(item.Price || 0), 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center p-4">
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div>
            <span className="text-slate-700 font-medium">Loading reports...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center p-4">
        <div className="relative z-10 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="text-red-500 text-center">
              <FiAlertCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">Error Loading Reports</h3>
              <p className="text-slate-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-3 sm:p-4 md:p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>

      {/* Header Section */}
      <div className="relative z-10 mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3">
          <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
            <FiTrendingUp className="text-white text-base sm:text-lg md:text-xl" />
          </div>
          <div className="transform  flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
              Sales Report
            </h1>
            <p className="text-slate-600 mt-0.5 text-xs sm:text-sm md:text-base truncate">
              Overview of orders with analytics
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 relative z-10">
        {/* Total Revenue */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Total Revenue (Rs.)</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {formatPriceDisplay(totalRevenue)}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
                <FiDollarSign className="text-white text-sm sm:text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Total Orders</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {totalOrders}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
                <FiPackage className="text-white text-sm sm:text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Delivered Orders - CHANGED from Completed to Delivered */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Delivered</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {deliveredOrders}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
                <FiCheckCircle className="text-white text-sm sm:text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* In Progress Orders */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">In Progress</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {pendingOrders}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
                <FiCalendar className="text-white text-sm sm:text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          {/* Search Input */}
          <div className="relative flex-grow group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
            <input
              type="text"
              placeholder="Search by Order ID, Customer Details, or Product..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
            />
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={isMobile ? 18 : 20} />
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
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-medium transition-all duration-300 text-sm sm:text-base"
            max={getCurrentDate()}
          />

          {/* Status Filter and Export - UPDATED with only inprogress, priority, delivered */}
          <div className="flex gap-2 sm:gap-3">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-medium transition-all duration-300 text-sm sm:text-base"
            >
              <option value="">All Status</option>
              <option value="in progress">In Progress</option>
              <option value="priority">Priority</option>
              <option value="delivered">Delivered</option>
            </select>

            <button 
              onClick={exportToExcel}
              className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95"
            >
              <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
              <FiDownload className="mr-2 sm:mr-3 relative z-10" size={isMobile ? 18 : 20} />
              <span className="relative z-10 text-sm sm:text-base">Export Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Info Display */}
      {filters.date && filters.filterType !== 'all' && (
        <div className="relative z-10 mb-4">
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50">
            <p className="text-blue-800 font-medium text-sm">
              Showing orders for:{' '}
              {filters.filterType === 'day' && `Day: ${formatToYYYYMMDD(filters.date)}`}
              {filters.filterType === 'month' && `Month: ${getMonthName(filters.date)} ${new Date(filters.date).getFullYear()}`}
              {filters.filterType === 'year' && `Year: ${new Date(filters.date).getFullYear()}`}
            </p>
          </div>
        </div>
      )}

      {/* Reports Table */}
      <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
        {/* Desktop Table with 10 Columns */}
        {!isMobile && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
                  <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Order ID</th>
                  <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Order Item ID</th>
                  <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Customer Name</th>
                  <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Phone Number</th>
                  <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Garment</th>
                  <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Fabric</th>
                  <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Order Date</th>
                  <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Delivery Date</th>
                  <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Price (Rs)</th>
                  <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {currentReports.length > 0 ? (
                  currentReports.map((report, index) => (
                    <tr 
                      key={`${report.OrderId}-${report.OrderItemId}-${index}`} 
                      className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
                    >
                      <td className="px-2 py-3 text-slate-600 text-sm">
                        {report.OrderId || 'N/A'}
                      </td>
                      <td className="px-2 py-3 text-slate-600 text-sm">
                        {report.OrderItemId || 'N/A'}
                      </td>
                      <td className="px-2 py-3 text-slate-600 text-sm">
                        {report.FullName || 'N/A'}
                      </td>
                      <td className="px-2 py-3 text-slate-600 text-sm">
                        {report.PhoneNumber || 'N/A'}
                      </td>
                      <td className="px-2 py-3 text-slate-600 text-sm">
                        {report.garmentName || 'N/A'}
                      </td>
                      <td className="px-2 py-3 text-slate-600 text-sm">
                        {report.fabricName || 'N/A'}
                      </td>
                      <td className="px-2 py-3 text-slate-600 text-sm">
                        {formatToYYYYMMDD(report.OrderDate)}
                      </td>
                      <td className="px-2 py-3 text-slate-600 text-sm">
                        {formatToYYYYMMDD(report.DeliveryDate)}
                      </td>
                      <td className="px-2 py-3 text-slate-600 text-sm font-medium">
                        {formatPriceDisplay(report.Price)}
                      </td>
                      <td className="px-2 py-3 text-slate-600 text-sm">
                        {report.Status || 'Unknown'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center py-8 sm:py-12">
                      <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                        <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                          <FiPackage className="text-slate-500 text-lg sm:text-xl" />
                        </div>
                        <p className="text-slate-500 font-medium text-sm sm:text-base">
                          {filters.searchTerm || filters.status || filters.date ? 'No matching orders found' : 'No orders available'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards Layout */}
        {isMobile && (
          <div className="p-4 space-y-3">
            {currentReports.length > 0 ? (
              currentReports.map((report, index) => (
                <div 
                  key={`${report.OrderId}-${report.OrderItemId}-${index}`}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-4 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="grid grid-col-2 gap-2 text-xs">
                    <div><span className="font-semibold">Order ID:</span> {report.OrderId}</div>
                    <div><span className="font-semibold">Item ID:</span> {report.OrderItemId}</div>
                    <div><span className="font-semibold">Customer:</span> {report.FullName}</div>
                    <div><span className="font-semibold">Phone:</span> {report.PhoneNumber}</div>
                    <div><span className="font-semibold">Garment:</span> {report.garmentName}</div>
                    <div><span className="font-semibold">Fabric:</span> {report.fabricName}</div>
                    <div><span className="font-semibold">Order Date:</span> {formatToYYYYMMDD(report.OrderDate)}</div>
                    <div><span className="font-semibold">Delivery:</span> {formatToYYYYMMDD(report.DeliveryDate)}</div>
                    <div><span className="font-semibold">Price:</span> Rs. {formatPriceDisplay(report.Price)}</div>
                    <div><span className="font-semibold">Status:</span> {report.Status}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                    <FiPackage className="text-slate-500 text-xl" />
                  </div>
                  <p className="text-slate-500 font-medium">
                    {filters.searchTerm || filters.status || filters.date ? 'No matching orders found' : 'No orders available'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredData.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
            <div className="text-xs sm:text-sm text-slate-600 font-medium">
              Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredData.length)} of{' '}
              {filteredData.length}
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <FiChevronLeft size={isSmallMobile ? 12 : 14} />
              </button>

              {getPageNumbers().map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm min-w-[32px] sm:min-w-[36px] ${
                    pageNumber === currentPage
                      ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {pageNumber}
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
    </div>
  );
};

export default Report;