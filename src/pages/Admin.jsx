// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   FiSearch,
//   FiUserPlus,
//   FiX,
//   FiEye,
//   FiEyeOff,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiChevronLeft,
//   FiChevronRight,
//   FiUsers,
//   FiUser,
//   FiShield,
//   FiMail,
//   FiCalendar
// } from "react-icons/fi";
// import { AddAdmin, GetAllAdmins } from "../actions/adminAction";

// function Admins() {
//   const dispatch = useDispatch();

//   // ✅ Redux states
//   const { responseBody: admins = [], loading, msg, error } = useSelector(
//     (state) => state.adminsList || {}
//   );

//   const { 
//     responseBody: addAdminResponse = {}, 
//     loading: adding, 
//     msg: addMsg, 
//     error: addError 
//   } = useSelector((state) => state.adminAdd || {});

//   // ✅ Local states
//   const [search, setSearch] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");
//   const [formError, setFormError] = useState("");

//   const [formData, setFormData] = useState({
//     Email: "",
//     PasswordHash: "",
//   });

//   // ✅ Mobile responsive state
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   // ✅ Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;

//   // ✅ Handle resize for mobile responsiveness
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // ✅ Fetch Admins on page load
//   useEffect(() => {
//     dispatch(GetAllAdmins());
//   }, [dispatch]);

//   // ✅ Handle notifications for add admin success/error
//   useEffect(() => {
//     if (addAdminResponse && Object.keys(addAdminResponse).length > 0 && !addError && !adding) {
//       setSuccessMsg("Admin added successfully!");
//       setShowModal(false);
//       setFormData({ Email: "", PasswordHash: "" });
//       dispatch(GetAllAdmins());
//       setTimeout(() => setSuccessMsg(""), 3000);
//     }

//     if (addError) {
//       setFormError(addMsg || "Failed to add admin. Please try again.");
//     }
//   }, [addAdminResponse, addError, addMsg, adding, dispatch]);

//   // ✅ Filter Admins and sort in DESCENDING order by AdminId
//   const filteredAdmins = admins
//     .filter(
//       (admin) =>
//         admin.AdminId?.toString().includes(search.toLowerCase()) ||
//         admin.Email?.toLowerCase().includes(search.toLowerCase())
//     )
//     .sort((a, b) => {
//       const idA = parseInt(a.AdminId) || 0;
//       const idB = parseInt(b.AdminId) || 0;
//       return idB - idA; // DESCENDING order (highest ID first)
//     });

//   // ✅ Pagination logic
//   const totalPages = Math.ceil(filteredAdmins.length / recordsPerPage);
//   const startIndex = (currentPage - 1) * recordsPerPage;
//   const currentRecords = filteredAdmins.slice(
//     startIndex,
//     startIndex + recordsPerPage
//   );

//   // ✅ Dynamic page numbers (show max 3 pages)
//   const getPageNumbers = () => {
//     let pages = [];
//     if (totalPages <= 3) {
//       pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//     } else if (currentPage === 1) {
//       pages = [1, 2, 3];
//     } else if (currentPage === totalPages) {
//       pages = [totalPages - 2, totalPages - 1, totalPages];
//     } else {
//       pages = [currentPage - 1, currentPage, currentPage + 1];
//     }
//     return pages.filter((p) => p > 0 && p <= totalPages);
//   };

//   // ✅ Format date to YYYY-MM-DD
//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   // ✅ Handle form input
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ✅ Check if admin already exists
//   const checkAdminExists = (email) => {
//     return admins.some(admin => 
//       admin.Email.toLowerCase() === email.toLowerCase()
//     );
//   };

//   // ✅ Validate form
//   const validateForm = () => {
//     if (!formData.Email.trim() || !formData.PasswordHash.trim()) {
//       setFormError("All fields are required!");
//       return false;
//     }
//     if (!/\S+@\S+\.\S+/.test(formData.Email)) {
//       setFormError("Please enter a valid email address!");
//       return false;
//     }
//     if (formData.PasswordHash.length < 6) {
//       setFormError("Password must be at least 6 characters long!");
//       return false;
//     }
//     if (checkAdminExists(formData.Email)) {
//       setFormError("Admin with this email already exists!");
//       return false;
//     }
//     return true;
//   };

//   // ✅ Submit AddAdmin form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormError("");

//     if (!validateForm()) return;

//     await dispatch(AddAdmin(formData));
//     // Success/error handling is done in the useEffect above
//   };

//   // ✅ Reset to first page when search changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search]);

//   // ✅ Reset form
//   const resetForm = () => {
//     setFormData({ Email: "", PasswordHash: "" });
//     setFormError("");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 sm:p-6 relative overflow-hidden">
//       {/* 3D Background Elements */}
//       <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
//       {/* Blur Overlay for Notifications */}
//       {(successMsg || formError || error) && (
//         <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>
//       )}

//       {/* Success Notification - Green Color */}
//       {successMsg && (
//         <div
//           className="fixed top-4 left-4 right-4 sm:top-6 sm:left-auto sm:right-6 z-[100] p-3 sm:p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl shadow-2xl flex items-center animate-slide-in max-w-sm sm:max-w-md mx-auto"
//           role="alert"
//         >
//           <div className="bg-white/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 backdrop-blur-sm flex-shrink-0">
//             <FiCheckCircle className="text-white" size={16} />
//           </div>
//           <span className="font-semibold text-xs sm:text-sm truncate">{successMsg}</span>
//         </div>
//       )}

//       {/* Error Notification - Red Color */}
//       {(formError || error) && (
//         <div
//           className="fixed top-4 left-4 right-4 sm:top-6 sm:left-auto sm:right-6 z-[100] p-3 sm:p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl shadow-2xl flex items-center animate-slide-in max-w-sm sm:max-w-md mx-auto"
//           role="alert"
//         >
//           <div className="bg-white/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 backdrop-blur-sm flex-shrink-0">
//             <FiAlertCircle className="text-white" size={16} />
//           </div>
//           <span className="font-semibold text-xs sm:text-sm truncate">{formError || error}</span>
//         </div>
//       )}

//       {/* Header Section with 3D Effect - Mobile Optimized */}
//       <div className="relative z-10 mb-6 sm:mb-8">
//         <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
//           <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-2xl transform ">
//             <FiShield className="text-white text-lg sm:text-xl" />
//           </div>
//           <div className="transform ">
//             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//               Admin Management
//             </h1>
//             <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage your administrator accounts</p>
//           </div>
//         </div>
//       </div>

//       {/* 3D Stats Cards - Mobile Optimized */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 relative z-10">
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium">Total Admins</p>
//                 <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                   {filteredAdmins.length}
//                 </p>
//               </div>
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiUsers className="text-white text-base sm:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium">Active Now</p>
//                 <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                   {filteredAdmins.length}
//                 </p>
//               </div>
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiUser className="text-white text-base sm:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative sm:col-span-2 lg:col-span-1">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium">This Page</p>
//                 <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                   {currentRecords.length}
//                 </p>
//               </div>
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiShield className="text-white text-base sm:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search + Add button - 3D Design - Mobile Optimized */}
//       <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
//         <div className="relative flex-grow group">
//           <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative flex items-center">
//             <FiSearch className="absolute left-3 sm:left-4 text-slate-400 z-10" size={18} />
//             <input
//               type="text"
//               placeholder="Search by Admin ID or Email..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="relative w-full pl-10 sm:pl-12 pr-3 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
//               disabled={loading}
//             />
//           </div>
//         </div>
//         <button
//           onClick={() => { resetForm(); setShowModal(true); }}
//           className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl sm:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 min-w-[120px] sm:min-w-auto"
//           disabled={loading}
//         >
//           <div className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//           <FiUserPlus className="mr-2 sm:mr-3 relative z-10" size={18} />
//           <span className="relative z-10 text-sm sm:text-base">Add Admin</span>
//         </button>
//       </div>

//       {/* 3D Table */}
//       {loading ? (
//         <div className="relative z-10 text-center py-8 sm:py-12">
//           <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border border-white/20">
//             <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-800"></div>
//             <span className="text-slate-700 font-medium text-sm sm:text-base">Loading admins...</span>
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Desktop Table */}
//           {!isMobile && (
//             <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                     <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Admin ID</th>
//                     <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Email</th>
//                     <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Created Date</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-200/50">
//                   {currentRecords.length > 0 ? (
//                     currentRecords.map((admin, index) => (
//                       <tr key={admin.AdminId} className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group">
//                         <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[120px] sm:max-w-[200px] truncate">
//                           {admin.AdminId || "-"}
//                         </td>
//                         <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[150px] sm:max-w-[200px] truncate">
//                           {admin.Email}
//                         </td>
//                         <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[120px] sm:max-w-[200px] truncate">
//                           {formatDate(admin.CreatedAt)}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="3" className="text-center py-8 sm:py-12">
//                         <div className="flex flex-col items-center space-y-2 sm:space-y-3">
//                           <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl sm:rounded-2xl shadow-inner">
//                             <FiShield className="text-slate-500 text-lg sm:text-xl" />
//                           </div>
//                           <p className="text-slate-500 font-medium text-sm sm:text-base">
//                             {search ? 'No matching admins found' : 'No admins available'}
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>

//               {/* 3D Pagination */}
//               {filteredAdmins.length > recordsPerPage && (
//                 <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
//                   <div className="text-xs sm:text-sm text-slate-600 font-medium">
//                     Showing {startIndex + 1}–{Math.min(startIndex + recordsPerPage, filteredAdmins.length)} of{' '}
//                     {filteredAdmins.length}
//                   </div>
//                   <div className="flex items-center space-x-1 sm:space-x-2">
//                     <button
//                       onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                       disabled={currentPage === 1}
//                       className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                     >
//                       <FiChevronLeft size={14} />
//                     </button>

//                     {getPageNumbers().map((pageNumber) => (
//                       <button
//                         key={pageNumber}
//                         onClick={() => setCurrentPage(pageNumber)}
//                         className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
//                           pageNumber === currentPage
//                             ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
//                             : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                         }`}
//                       >
//                         {pageNumber}
//                       </button>
//                     ))}

//                     <button
//                       onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                       disabled={currentPage === totalPages}
//                       className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                     >
//                       <FiChevronRight size={14} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Mobile Cards Layout */}
//           {isMobile && (
//             <div className="relative z-10 space-y-3 mb-4">
//               {currentRecords.length > 0 ? (
//                 currentRecords.map((admin) => (
//                   <div 
//                     key={admin.AdminId} 
//                     className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-3 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <div className="flex-1 min-w-0">
//                         <h3 className="text-slate-800 text-sm font-medium mb-1 truncate">
//                           {admin.Email}
//                         </h3>
//                         <div className="space-y-1 text-xs text-slate-600">
//                           <div className="flex items-center">
//                             <span className="font-medium mr-2">ID:</span>
//                             <span className="truncate">{admin.AdminId || "-"}</span>
//                           </div>
//                           <div className="flex items-center">
//                             <span className="font-medium mr-2">Created:</span>
//                             <span>{formatDate(admin.CreatedAt)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20">
//                   <div className="flex flex-col items-center space-y-2">
//                     <div className="p-3 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-inner">
//                       <FiShield className="text-slate-500 text-lg" />
//                     </div>
//                     <p className="text-slate-500 font-medium text-sm">
//                       {search ? 'No matching admins found' : 'No admins available'}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Mobile Pagination */}
//               {filteredAdmins.length > recordsPerPage && (
//                 <div className="flex flex-col sm:flex-row items-center justify-between px-3 py-3 bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-xl shadow-xl border border-white/20 space-y-2 sm:space-y-0">
//                   <div className="text-xs text-slate-600 font-medium">
//                     Showing {startIndex + 1}–{Math.min(startIndex + recordsPerPage, filteredAdmins.length)} of{' '}
//                     {filteredAdmins.length}
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <button
//                       onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                       disabled={currentPage === 1}
//                       className="p-1.5 rounded-lg border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40"
//                     >
//                       <FiChevronLeft size={12} />
//                     </button>

//                     {getPageNumbers().map((pageNumber) => (
//                       <button
//                         key={pageNumber}
//                         onClick={() => setCurrentPage(pageNumber)}
//                         className={`px-2 py-1 rounded-lg border font-medium transition-all duration-300 transform hover:scale-105 text-xs min-w-[32px] ${
//                           pageNumber === currentPage
//                             ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-xl scale-105 border-transparent'
//                             : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                         }`}
//                       >
//                         {pageNumber}
//                       </button>
//                     ))}

//                     <button
//                       onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                       disabled={currentPage === totalPages}
//                       className="p-1.5 rounded-lg border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40"
//                     >
//                       <FiChevronRight size={12} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </>
//       )}

//       {/* 3D Modal - Mobile Optimized */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
//           <div className="relative w-full max-w-sm sm:max-w-md">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl sm:rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6">
//               <div className="flex items-center justify-between mb-4 sm:mb-6">
//                 <div className="flex items-center space-x-2 sm:space-x-3">
//                   <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-xl sm:rounded-2xl shadow-lg">
//                     <FiUserPlus className="text-white text-base sm:text-lg" />
//                   </div>
//                   <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                     Add New Admin
//                   </h2>
//                 </div>
//                 <button 
//                   onClick={() => { setShowModal(false); resetForm(); }} 
//                   className="p-1 sm:p-2 text-slate-400 hover:text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               {formError && (
//                 <div className="mb-4 sm:mb-6 p-3 sm:p-4 text-red-700 bg-gradient-to-r from-red-50 to-red-100 rounded-xl sm:rounded-2xl border border-red-200 shadow-inner">
//                   <div className="flex items-center">
//                     <FiAlertCircle className="mr-2" size={16} />
//                     <span className="text-sm sm:text-base">{formError}</span>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Email Address *</label>
//                   <input
//                     type="email"
//                     name="Email"
//                     value={formData.Email}
//                     onChange={handleChange}
//                     placeholder="Enter admin email address"
//                     className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                     required
//                     disabled={adding}
//                   />
//                 </div>

//                 {/* Password with toggle */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Password *</label>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="PasswordHash"
//                     value={formData.PasswordHash}
//                     onChange={handleChange}
//                     placeholder="Enter secure password"
//                     className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                     required
//                     disabled={adding}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-2 sm:right-3 top-9 sm:top-11 text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1"
//                   >
//                     {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
//                   </button>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex justify-end gap-2 sm:gap-4 pt-4 sm:pt-6">
//                   <button 
//                     type="button" 
//                     onClick={() => { setShowModal(false); resetForm(); }}
//                     className="px-4 sm:px-6 py-2 sm:py-3 border border-slate-300 rounded-xl sm:rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base" 
//                     disabled={adding}
//                   >
//                     Cancel
//                   </button>
//                   <button 
//                     type="submit"
//                     className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base" 
//                     disabled={adding}
//                   >
//                     {adding ? 'Creating...' : 'Create Admin'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Admins;






// Admins.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiSearch,
  FiUserPlus,
  FiX,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiUser,
  FiShield,
  FiMail,
  FiCalendar
} from "react-icons/fi";
import { AddAdmin, GetAllAdmins } from "../actions/adminAction";

function Admins() {
  const dispatch = useDispatch();

  // ✅ Redux states
  const { responseBody: admins = [], loading, msg, error } = useSelector(
    (state) => state.adminsList || {}
  );

  const { 
    responseBody: addAdminResponse = {}, 
    loading: adding, 
    msg: addMsg, 
    error: addError 
  } = useSelector((state) => state.adminAdd || {});

  // ✅ Local states
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formError, setFormError] = useState("");
  const [hasRecentlyAdded, setHasRecentlyAdded] = useState(false); // ✅ ADD THIS

  const [formData, setFormData] = useState({
    Email: "",
    PasswordHash: "",
  });

  // ✅ Mobile responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // ✅ Handle resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Fetch Admins on page load AND reset states
  useEffect(() => {
    dispatch(GetAllAdmins());
    // ✅ Clear any existing success messages when component mounts
    setSuccessMsg("");
    setFormError("");
    setHasRecentlyAdded(false); // ✅ Reset the flag
  }, [dispatch]);

  // ✅ Handle notifications for add admin success/error - FIXED
  useEffect(() => {
    console.log('🔄 Add Admin Effect - Status:', { 
      addAdminResponse, 
      addError, 
      addMsg, 
      adding,
      hasRecentlyAdded
    });

    // ✅ Only show success if we have a response AND we recently added an admin
    if (addAdminResponse && Object.keys(addAdminResponse).length > 0 && !addError && !adding && hasRecentlyAdded) {
      console.log('✅ Add Admin Success - Closing modal and refreshing');
      setSuccessMsg("Admin added successfully!");
      setShowModal(false);
      setFormData({ Email: "", PasswordHash: "" });
      setFormError("");
      dispatch(GetAllAdmins()); // Refresh the table
      
      setTimeout(() => {
        setSuccessMsg("");
        setHasRecentlyAdded(false); // ✅ Reset the flag after showing message
      }, 3000);
    }

    // Handle add error
    if (addError && !adding && hasRecentlyAdded) {
      console.log('❌ Add Admin Error:', addError);
      setFormError(addError || "Failed to add admin. Please try again.");
      setHasRecentlyAdded(false); // ✅ Reset flag on error too
    }
  }, [addAdminResponse, addError, addMsg, adding, dispatch, hasRecentlyAdded]);

  // ✅ Filter Admins and sort in DESCENDING order by AdminId
  const filteredAdmins = admins
    .filter(
      (admin) =>
        admin.AdminId?.toString().includes(search.toLowerCase()) ||
        admin.Email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const idA = parseInt(a.AdminId) || 0;
      const idB = parseInt(b.AdminId) || 0;
      return idB - idA; // DESCENDING order (highest ID first)
    });

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredAdmins.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredAdmins.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // ✅ Dynamic page numbers (show max 3 pages)
  const getPageNumbers = () => {
    let pages = [];
    if (totalPages <= 3) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage === 1) {
      pages = [1, 2, 3];
    } else if (currentPage === totalPages) {
      pages = [totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [currentPage - 1, currentPage, currentPage + 1];
    }
    return pages.filter((p) => p > 0 && p <= totalPages);
  };

  // ✅ Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ✅ Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    if (formError) setFormError("");
  };

  // ✅ Check if admin already exists
  const checkAdminExists = (email) => {
    return admins.some(admin => 
      admin.Email.toLowerCase() === email.toLowerCase()
    );
  };

  // ✅ Validate form
  const validateForm = () => {
    if (!formData.Email.trim() || !formData.PasswordHash.trim()) {
      setFormError("All fields are required!");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      setFormError("Please enter a valid email address!");
      return false;
    }
    if (formData.PasswordHash.length < 6) {
      setFormError("Password must be at least 6 characters long!");
      return false;
    }
    if (checkAdminExists(formData.Email)) {
      setFormError("Admin with this email already exists!");
      return false;
    }
    return true;
  };

  // ✅ Submit AddAdmin form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg(""); // Clear previous success messages
    setHasRecentlyAdded(true); // ✅ SET THE FLAG when submitting form

    if (!validateForm()) {
      setHasRecentlyAdded(false); // ✅ Reset flag if validation fails
      return;
    }

    try {
      await dispatch(AddAdmin(formData));
      // Success/error handling is done in the useEffect above
    } catch (error) {
      console.error('❌ Form submission error:', error);
      setFormError("Failed to add admin. Please try again.");
      setHasRecentlyAdded(false); // ✅ Reset flag on error
    }
  };

  // ✅ Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ✅ Reset form
  const resetForm = () => {
    setFormData({ Email: "", PasswordHash: "" });
    setFormError("");
    setHasRecentlyAdded(false); // ✅ Reset flag when closing modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 sm:p-6 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
      {/* REMOVED: Blur Overlay for Notifications - No blur screen when form closes */}

      {/* Success Notification - Green Color */}
      {successMsg && (
        <div
          className="fixed top-4 left-4 right-4 sm:top-6 sm:left-auto sm:right-6 z-[100] p-3 sm:p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl shadow-2xl flex items-center animate-slide-in max-w-sm sm:max-w-md mx-auto"
          role="alert"
        >
          <div className="bg-white/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 backdrop-blur-sm flex-shrink-0">
            <FiCheckCircle className="text-white" size={16} />
          </div>
          <span className="font-semibold text-xs sm:text-sm truncate">{successMsg}</span>
        </div>
      )}

      {/* Error Notification - Red Color */}
      {(formError || error) && (
        <div
          className="fixed top-4 left-4 right-4 sm:top-6 sm:left-auto sm:right-6 z-[100] p-3 sm:p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl shadow-2xl flex items-center animate-slide-in max-w-sm sm:max-w-md mx-auto"
          role="alert"
        >
          <div className="bg-white/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 backdrop-blur-sm flex-shrink-0">
            <FiAlertCircle className="text-white" size={16} />
          </div>
          <span className="font-semibold text-xs sm:text-sm truncate">{formError || error}</span>
        </div>
      )}

      {/* Header Section with 3D Effect - Mobile Optimized */}
      <div className="relative z-10 mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
          <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-2xl transform ">
            <FiShield className="text-white text-lg sm:text-xl" />
          </div>
          <div className="transform ">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Admin Management
            </h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage your administrator accounts</p>
          </div>
        </div>
      </div>

      {/* Search + Add button - 3D Design - Mobile Optimized */}
      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="relative flex-grow group">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative flex items-center">
            <FiSearch className="absolute left-3 sm:left-4 text-slate-400 z-10" size={18} />
            <input
              type="text"
              placeholder="Search by Admin ID or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="relative w-full pl-10 sm:pl-12 pr-3 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
              disabled={loading}
            />
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl sm:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 min-w-[120px] sm:min-w-auto"
          disabled={loading}
        >
          <div className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
          <FiUserPlus className="mr-2 sm:mr-3 relative z-10" size={18} />
          <span className="relative z-10 text-sm sm:text-base">Add Admin</span>
        </button>
      </div>

      {/* 3D Table */}
      {loading ? (
        <div className="relative z-10 text-center py-8 sm:py-12">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border border-white/20">
            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-800"></div>
            <span className="text-slate-700 font-medium text-sm sm:text-base">Loading admins...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          {!isMobile && (
            <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
                    <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Admin ID</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Email</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50">
                  {currentRecords.length > 0 ? (
                    currentRecords.map((admin, index) => (
                      <tr key={admin.AdminId} className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group">
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[120px] sm:max-w-[200px] truncate">
                          {admin.AdminId || "-"}
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[150px] sm:max-w-[200px] truncate">
                          {admin.Email}
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[120px] sm:max-w-[200px] truncate">
                          {formatDate(admin.CreatedAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-8 sm:py-12">
                        <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                          <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl sm:rounded-2xl shadow-inner">
                            <FiShield className="text-slate-500 text-lg sm:text-xl" />
                          </div>
                          <p className="text-slate-500 font-medium text-sm sm:text-base">
                            {search ? 'No matching admins found' : 'No admins available'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* 3D Pagination */}
              {filteredAdmins.length > recordsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
                  <div className="text-xs sm:text-sm text-slate-600 font-medium">
                    Showing {startIndex + 1}–{Math.min(startIndex + recordsPerPage, filteredAdmins.length)} of{' '}
                    {filteredAdmins.length}
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                    >
                      <FiChevronLeft size={14} />
                    </button>

                    {getPageNumbers().map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
                          pageNumber === currentPage
                            ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
                            : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                    >
                      <FiChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Cards Layout */}
          {isMobile && (
            <div className="relative z-10 space-y-3 mb-4">
              {currentRecords.length > 0 ? (
                currentRecords.map((admin) => (
                  <div 
                    key={admin.AdminId} 
                    className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-3 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-800 text-sm font-medium mb-1 truncate">
                          {admin.Email}
                        </h3>
                        <div className="space-y-1 text-xs text-slate-600">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">ID:</span>
                            <span className="truncate">{admin.AdminId || "-"}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Created:</span>
                            <span>{formatDate(admin.CreatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-inner">
                      <FiShield className="text-slate-500 text-lg" />
                    </div>
                    <p className="text-slate-500 font-medium text-sm">
                      {search ? 'No matching admins found' : 'No admins available'}
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile Pagination */}
              {filteredAdmins.length > recordsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-3 py-3 bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-xl shadow-xl border border-white/20 space-y-2 sm:space-y-0">
                  <div className="text-xs text-slate-600 font-medium">
                    Showing {startIndex + 1}–{Math.min(startIndex + recordsPerPage, filteredAdmins.length)} of{' '}
                    {filteredAdmins.length}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40"
                    >
                      <FiChevronLeft size={12} />
                    </button>

                    {getPageNumbers().map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-2 py-1 rounded-lg border font-medium transition-all duration-300 transform hover:scale-105 text-xs min-w-[32px] ${
                          pageNumber === currentPage
                            ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-xl scale-105 border-transparent'
                            : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40"
                    >
                      <FiChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* 3D Modal - Mobile Optimized */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="relative w-full max-w-sm sm:max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl sm:rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-xl sm:rounded-2xl shadow-lg">
                    <FiUserPlus className="text-white text-base sm:text-lg" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Add New Admin
                  </h2>
                </div>
                <button 
                  onClick={() => { setShowModal(false); resetForm(); }} 
                  className="p-1 sm:p-2 text-slate-400 hover:text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
                >
                  <FiX size={20} />
                </button>
              </div>

              {formError && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 text-red-700 bg-gradient-to-r from-red-50 to-red-100 rounded-xl sm:rounded-2xl border border-red-200 shadow-inner">
                  <div className="flex items-center">
                    <FiAlertCircle className="mr-2" size={16} />
                    <span className="text-sm sm:text-base">{formError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    placeholder="Enter admin email address"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
                    required
                    disabled={adding}
                  />
                </div>

                {/* Password with toggle */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Password *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="PasswordHash"
                    value={formData.PasswordHash}
                    onChange={handleChange}
                    placeholder="Enter secure password"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
                    required
                    disabled={adding}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 sm:right-3 top-9 sm:top-11 text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 sm:gap-4 pt-4 sm:pt-6">
                  <button 
                    type="button" 
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-4 sm:px-6 py-2 sm:py-3 border border-slate-300 rounded-xl sm:rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base" 
                    disabled={adding}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base" 
                    disabled={adding}
                  >
                    {adding ? 'Creating...' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admins;