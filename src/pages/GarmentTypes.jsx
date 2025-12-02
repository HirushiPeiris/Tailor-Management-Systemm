// import React, { useState, useEffect } from 'react';
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
//   FiLayers
// } from 'react-icons/fi';
// import { useDispatch, useSelector } from 'react-redux';
// import { GetAllGarmentType, AddGarmentType, UpdateGarmentType, GetAllInactiveGarmentType } from '../actions/garmentTypeAction';

// function GarmentTypes() {
//   const dispatch = useDispatch();

//   // Redux selectors
//   const garmentTypeList = useSelector((state) => state.garmentTypeList || {});
//   const { loading, responseBody: activeGarments = [] } = garmentTypeList;

//   const garmentTypeAdd = useSelector((state) => state.garmentTypeAdd || {});
//   const { loading: adding, error: addError, msg: addMsg } = garmentTypeAdd;

//   const garmentTypeUpdate = useSelector((state) => state.garmentTypeUpdate || {});
//   const { loading: updating, error: updateError, msg: updateMsg } = garmentTypeUpdate;

//   const InactiveGarmentType = useSelector((state) => state.InactiveGarmentType || {});
//   const { loading: loadingInactive, responseBody: inactiveGarments = [] } = InactiveGarmentType;

//   // State management
//   const [search, setSearch] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [garmentName, setGarmentName] = useState('');
//   const [formError, setFormError] = useState('');
//   const [notification, setNotification] = useState(null);
  
//   // State for editing
//   const [editingId, setEditingId] = useState(null);
//   const [editName, setEditName] = useState('');

//   // State for status toggle confirmation
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [garmentToToggle, setGarmentToToggle] = useState(null);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(8);

//   // Fetch both active and inactive garments
//   useEffect(() => {
//     dispatch(GetAllGarmentType());
//     dispatch(GetAllInactiveGarmentType({}));
//   }, [dispatch]);

//   // Show success/error toast after add or update
//   useEffect(() => {
//     if (!adding && (addMsg || addError)) {
//       if (addError) {
//         setNotification({ type: 'error', message: addError || 'Failed to add garment type!' });
//       } else if (addMsg) {
//         setNotification({ type: 'success', message: addMsg || 'Garment type added successfully!' });
//         setShowModal(false);
//         setGarmentName('');
//         dispatch(GetAllGarmentType());
//         dispatch(GetAllInactiveGarmentType({}));
//       }
//       const timer = setTimeout(() => setNotification(null), 1500);
//       return () => clearTimeout(timer);
//     }
//   }, [addMsg, addError, adding, dispatch]);

//   useEffect(() => {
//     if (!updating && (updateMsg || updateError)) {
//       if (updateError) {
//         setNotification({ type: 'error', message: updateError || 'Failed to update garment type!' });
//       } else if (updateMsg) {
//         setNotification({ type: 'success', message: updateMsg || 'Garment type updated successfully!' });
//         setEditingId(null);
//         setEditName('');
//         dispatch(GetAllGarmentType());
//         dispatch(GetAllInactiveGarmentType({}));
//       }
//       const timer = setTimeout(() => setNotification(null), 1500);
//       return () => clearTimeout(timer);
//     }
//   }, [updateMsg, updateError, updating, dispatch]);

//   // Combine active and inactive garments for display
//   const allGarments = [
//     ...(Array.isArray(activeGarments) ? activeGarments.map(garment => ({ ...garment, status: 'A' })) : []),
//     ...(Array.isArray(inactiveGarments) ? inactiveGarments.map(garment => ({ ...garment, status: 'I' })) : [])
//   ];

//   // Handle add garment type with duplicate check
//   const handleAddGarment = (e) => {
//     e.preventDefault();
//     const name = garmentName.trim();
//     if (!name) {
//       setFormError('Please enter a garment name');
//       return;
//     }

// const exists = allGarments.some(
//   (g) => g.GarmentTypeName.toLowerCase() === name.toLowerCase()
// );
// if (exists) {
//   setNotification({ type: 'error', message: 'Garment type already exists!' });
//   // ADD THIS TIMER
//   setTimeout(() => setNotification(null), 1500);
//   return;
// }
//     setFormError('');
//     dispatch(AddGarmentType({ GarmentTypeName: name }));
//   };

//   // Handle edit garment type
//   const handleEditClick = (garment) => {
//     setEditingId(garment.GarmentTypeId);
//     setEditName(garment.GarmentTypeName);
//   };

//   // Handle save edited garment type
//   const handleSaveEdit = (garment) => {
//     const name = editName.trim();
//     if (!name) {
//       setNotification({ type: 'error', message: 'Please enter a garment name' });
//       return;
//     }

//     const exists = allGarments.some(
//   (g) => 
//     g.GarmentTypeId !== garment.GarmentTypeId && 
//     g.GarmentTypeName.toLowerCase() === name.toLowerCase()
// );
// if (exists) {
//   setNotification({ type: 'error', message: 'Garment type already exists!' });
//   // ADD THIS TIMER
//   setTimeout(() => setNotification(null), 1500);
//   return;
// }

//     const updateData = {
//       GarmentTypeId: garment.GarmentTypeId,
//       GarmentTypeName: name,
//       Status: garment.status || garment.Status || 'A'
//     };

//     dispatch(UpdateGarmentType(updateData));
//   };

//   // Handle status toggle confirmation
//   const handleStatusToggleClick = (garment) => {
//     setGarmentToToggle(garment);
//     setShowStatusModal(true);
//   };

//   // Handle confirmed status toggle
//   const handleConfirmStatusToggle = () => {
//     if (!garmentToToggle) return;

//     const currentStatus = garmentToToggle.status || garmentToToggle.Status;
//     const newStatus = (currentStatus === 'A' || !currentStatus) ? 'I' : 'A';
    
//     const updateData = {
//       GarmentTypeId: garmentToToggle.GarmentTypeId,
//       GarmentTypeName: garmentToToggle.GarmentTypeName,
//       Status: newStatus
//     };

//     dispatch(UpdateGarmentType(updateData));
//     setShowStatusModal(false);
//     setGarmentToToggle(null);
//   };

//   // Handle cancel status toggle
//   const handleCancelStatusToggle = () => {
//     setShowStatusModal(false);
//     setGarmentToToggle(null);
//   };

//   // Handle cancel edit
//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditName('');
//   };

//   // Get status display text and color
//   const getStatusInfo = (garment) => {
//     const status = garment.status || garment.Status;
//     const isActive = status === 'A' || !status;
    
//     if (isActive) {
//       return { 
//         text: 'Active', 
//         color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50',
//         icon: <FiToggleRight className="mr-1" size={12} />
//       };
//     } else {
//       return { 
//         text: 'Inactive', 
//         color: 'bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50',
//         icon: <FiToggleLeft className="mr-1" size={12} />
//       };
//     }
//   };

//   // Get row styling based on status
//   const getRowClass = (garment) => {
//     const status = garment.status || garment.Status;
//     const isActive = status === 'A' || !status;
    
//     return isActive 
//       ? 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30 border-l-4 border-l-blue-400' 
//       : 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50/30 border-l-4 border-l-slate-300';
//   };

//   // Pagination logic
//   const filteredGarments = allGarments.filter((g) =>
//     (g.GarmentTypeName || '').toLowerCase().includes(search.toLowerCase())
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentGarments = filteredGarments.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredGarments.length / itemsPerPage);

//   // Pagination 3-page sliding window
//   const pageNumbers = [];
//   const maxPageButtons = 3;
//   let startPage = Math.max(1, currentPage - 1);
//   let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
//   if (endPage - startPage + 1 < maxPageButtons) {
//     startPage = Math.max(1, endPage - maxPageButtons + 1);
//   }
//   for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

//   // Loading state
//   const isLoading = loading || loadingInactive;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 md:p-6 relative overflow-hidden">
//       {/* 3D Background Elements */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
//       {/* 3D Notification */}
//       {notification && (
//         <div
//           className={`fixed top-6 right-6 z-[100] p-4 rounded-2xl shadow-2xl flex items-center transition-all duration-500 transform ${
//             notification.type === 'success' 
//               ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-blue-200/50 border-l-4 border-l-blue-400' 
//               : notification.type === 'error'
//               ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200/50 border-l-4 border-l-rose-400'
//               : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-blue-200/50 border-l-4 border-l-blue-400'
//           } animate-bounce-in`}
//           role="alert"
//         >
//           <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
//             {notification.type === 'success' ? (
//               <FiCheckCircle className="text-white" size={18} />
//             ) : notification.type === 'error' ? (
//               <FiAlertCircle className="text-white" size={18} />
//             ) : (
//               <FiActivity className="text-white" size={18} />
//             )}
//           </div>
//           <span className="font-semibold text-sm">{notification.message}</span>
//         </div>
//       )}

//       {/* Header Section with 3D Effect */}
//       <div className="relative z-10 mb-6 md:mb-8">
//         <div className="flex items-center space-x-4 mb-3">
//           <div className="p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
//             <FiLayers className="text-white text-lg md:text-xl" />
//           </div>
//           <div className="transform ">
//             <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//               Garment Types
//             </h1>
//             <p className="text-slate-600 mt-1 text-sm md:text-base">Manage your garment inventory</p>
//           </div>
//         </div>
//       </div>

//       {/* 3D Stats Cards - Moved above search bar */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Total Types</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {allGarments.length}
//                 </p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiLayers className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Active</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {allGarments.filter(g => (g.status || g.Status) === 'A' || !g.status).length}
//                 </p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
//                 <FiActivity className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-700 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Inactive</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {allGarments.filter(g => (g.status || g.Status) === 'I').length}
//                 </p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl shadow-lg">
//                 <FiArchive className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search + Add button - 3D Design */}
//       <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 md:mb-8">
//         <div className="flex flex-col md:flex-row flex-grow space-y-4 md:space-y-0 md:space-x-4 w-full">
//           <div className="relative flex-grow group">
//             <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//             <input
//               type="text"
//               placeholder="Search garment types..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//                 className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
//               disabled={isLoading}
//             />
//             <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
//           </div>
//           <button
//             onClick={() => setShowModal(true)}
//             className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 md:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 w-full md:w-auto"
//           >
//             <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//             <FiPlus className="mr-2 relative z-10" size={18} /> 
//             <span className="relative z-10">Add Garment Type</span>
//           </button>
//         </div>
//       </div>

//       {/* 3D Table */}
//       {isLoading ? (
//         <div className="relative z-10 text-center py-8 md:py-12">
//           <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-2xl border border-white/20">
//             <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-blue-800"></div>
//             <span className="text-slate-700 font-medium text-sm md:text-base">Loading garment types...</span>
//           </div>
//         </div>
//       ) : (
//         <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[600px]">
//               <thead>
//                 <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-left text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Garment ID</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-left text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Garment Type</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200/50">
//                 {currentGarments.length > 0 ? (
//                   currentGarments.map((g, i) => {
//                     const statusInfo = getStatusInfo(g);
//                     const rowClass = getRowClass(g);
                    
//                     return (
//                       <tr key={g.GarmentTypeId || i} className={`${rowClass} group`}>
//                         <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                           {g.GarmentTypeId || 'N/A'}
//                         </td>
//                         <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                           {editingId === g.GarmentTypeId ? (
//                             <div className="flex items-center space-x-2 md:space-x-3">
//                               <input
//                                 type="text"
//                                 value={editName}
//                                 onChange={(e) => setEditName(e.target.value)}
//                                 className="flex-1 px-2 md:px-3 py-1 md:py-2 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm shadow-inner text-sm"
//                                 onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(g)}
//                               />
//                               <div className="flex space-x-1 md:space-x-2">
//                                 <button
//                                   onClick={() => handleSaveEdit(g)}
//                                   disabled={updating}
//                                   className="p-1 md:p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
//                                   title="Save"
//                                 >
//                                   <FiSave size={12} />
//                                 </button>
//                                 <button
//                                   onClick={handleCancelEdit}
//                                   className="p-1 md:p-2 bg-gradient-to-br from-slate-500 to-slate-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                                   title="Cancel"
//                                 >
//                                   <FiX size={12} />
//                                 </button>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="flex items-center">
//                               <span 
//                                 className="text-slate-800 text-sm md:text-base cursor-pointer hover:text-slate-900 transition-colors duration-200"
//                                 onClick={() => handleEditClick(g)}
//                                 title="Click to edit"
//                               >
//                                 {g.GarmentTypeName}
//                               </span>
//                             </div>
//                           )}
//                         </td>
//                         <td className="py-3 md:py-4 px-4 md:px-6 text-center">
//                           <button
//                             onClick={() => handleStatusToggleClick(g)}
//                             disabled={updating}
//                             className={`inline-flex items-center justify-center w-20 md:w-24 px-2 md:px-3 py-1 md:py-2 rounded-full text-xs tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg ${statusInfo.color} hover:shadow-xl disabled:opacity-50`}
//                             title={`Click to ${statusInfo.text === 'Active' ? 'deactivate' : 'activate'}`}
//                           >
//                             {statusInfo.icon}
//                             {statusInfo.text}
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="3" className="text-center py-8 md:py-12">
//                       <div className="flex flex-col items-center space-y-3">
//                         <div className="p-3 md:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                           <FiLayers className="text-slate-500 text-lg md:text-xl" />
//                         </div>
//                         <p className="text-slate-500 font-medium">No garment types found</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* 3D Pagination */}
//           {filteredGarments.length > itemsPerPage && (
//             <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-4 md:space-y-0">
//               <div className="text-sm text-slate-600">
//                 Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredGarments.length)} of{' '}
//                 {filteredGarments.length}
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                 >
//                   <FiChevronLeft size={14} />
//                 </button>

//                 {pageNumbers.map((page) => (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`px-2 md:px-3.5 py-1 md:py-1.5 rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-sm ${
//                       currentPage === page
//                         ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
//                         : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}

//                 <button
//                   onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                 >
//                   <FiChevronRight size={14} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Add Garment Type Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-md">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <button
//                 onClick={() => {
//                   setShowModal(false);
//                   setFormError('');
//                   setGarmentName('');
//                 }}
//                 className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//               >
//                 <FiX className="text-lg md:text-xl" />
//               </button>

//               <div className="flex items-center space-x-3 mb-4 md:mb-6">
//                 <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                   <FiPlus className="text-white text-base md:text-lg" />
//                 </div>
//                 <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                   Add Garment Type
//                 </h2>
//               </div>

//               {formError && (
//                 <div className="mb-4 md:mb-6 p-3 md:p-4 text-rose-700 bg-gradient-to-r from-rose-50 to-red-50 rounded-2xl border border-rose-200 shadow-inner text-sm">
//                   {formError}
//                 </div>
//               )}

//               <form onSubmit={handleAddGarment} className="space-y-4">
//                 <div>
//                   <label htmlFor="garmentName" className="block text-sm font-medium text-slate-700 mb-2">
//                     Garment Name <span className="text-rose-500"></span>
//                   </label>
//                   <input
//                     type="text"
//                     id="garmentName"
//                     value={garmentName}
//                     onChange={(e) => {
//                       setGarmentName(e.target.value);
//                       if (formError) setFormError('');
//                     }}
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     placeholder="e.g., Shirt, Trousers, Jacket"
//                   />
//                 </div>

//                 <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowModal(false);
//                       setFormError('');
//                       setGarmentName('');
//                     }}
//                     className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={adding}
//                     className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm md:text-base order-1 md:order-2"
//                   >
//                     {adding ? (
//                       <div className="flex items-center space-x-2">
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         <span>Saving...</span>
//                       </div>
//                     ) : (
//                       'Save Garment Type'
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Status Toggle Confirmation Modal */}
//       {showStatusModal && garmentToToggle && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-md">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <button
//                 onClick={handleCancelStatusToggle}
//                 className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//               >
//                 <FiX className="text-lg md:text-xl" />
//               </button>

//               <div className="flex items-center space-x-3 mb-4 md:mb-6">
//                 <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                   <FiAlertCircle className="text-white text-base md:text-lg" />
//                 </div>
//                 <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                   Confirm Status Change
//                 </h2>
//               </div>

//               <div className="mb-6">
//                 <p className="text-slate-700 text-sm md:text-base mb-4">
//                   Are you sure you want to change the status of <strong>"{garmentToToggle.GarmentTypeName}"</strong> from{' '}
//                   <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusInfo(garmentToToggle).color}`}>
//                     {getStatusInfo(garmentToToggle).text}
//                   </span>{' '}
//                   to{' '}
//                   <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
//                     (garmentToToggle.status || garmentToToggle.Status) === 'A' || !garmentToToggle.status
//                       ? 'bg-gradient-to-br from-slate-500 to-slate-600 text-white'
//                       : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
//                   }`}>
//                     {(garmentToToggle.status || garmentToToggle.Status) === 'A' || !garmentToToggle.status ? 'Inactive' : 'Active'}
//                   </span>?
//                 </p>
//                 <p className="text-slate-500 text-xs md:text-sm">
//                   This action will {((garmentToToggle.status || garmentToToggle.Status) === 'A' || !garmentToToggle.status) ? 'disable' : 'enable'} the garment type.
//                 </p>
//               </div>

//               <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4">
//                 <button
//                   onClick={handleCancelStatusToggle}
//                   className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleConfirmStatusToggle}
//                   disabled={updating}
//                   className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm md:text-base order-1 md:order-2"
//                 >
//                   {updating ? (
//                     <div className="flex items-center space-x-2">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       <span>Updating...</span>
//                     </div>
//                   ) : (
//                     'Confirm Change'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default GarmentTypes;



import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit,
  FiSave,
  FiToggleLeft,
  FiToggleRight,
  FiActivity,
  FiArchive,
  FiLayers
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllGarmentType, AddGarmentType, UpdateGarmentType, GetAllInactiveGarmentType } from '../actions/garmentTypeAction';

function GarmentTypes() {
  const dispatch = useDispatch();

  // Redux selectors
  const garmentTypeList = useSelector((state) => state.garmentTypeList || {});
  const { loading, responseBody: activeGarments = [] } = garmentTypeList;

  const garmentTypeAdd = useSelector((state) => state.garmentTypeAdd || {});
  const { loading: adding, error: addError, msg: addMsg } = garmentTypeAdd;

  const garmentTypeUpdate = useSelector((state) => state.garmentTypeUpdate || {});
  const { loading: updating, error: updateError, msg: updateMsg } = garmentTypeUpdate;

  const InactiveGarmentType = useSelector((state) => state.InactiveGarmentType || {});
  const { loading: loadingInactive, responseBody: inactiveGarments = [] } = InactiveGarmentType;

  // State management
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [garmentName, setGarmentName] = useState('');
  const [formError, setFormError] = useState('');
  const [notification, setNotification] = useState(null);
  
  // State for editing
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  // State for status toggle confirmation
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [garmentToToggle, setGarmentToToggle] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Fetch both active and inactive garments
  useEffect(() => {
    dispatch(GetAllGarmentType());
    dispatch(GetAllInactiveGarmentType({}));
  }, [dispatch]);

  // Show success/error toast after add - WITH PROPER CLEANUP
  useEffect(() => {
    let timer;
    
    if (!adding && (addMsg || addError)) {
      if (addError) {
        setNotification({ type: 'error', message: addError || 'Failed to add garment type!' });
      } else if (addMsg) {
        setNotification({ type: 'success', message: addMsg || 'Garment type added successfully!' });
        setShowModal(false);
        setGarmentName('');
        dispatch(GetAllGarmentType());
        dispatch(GetAllInactiveGarmentType({}));
      }
      timer = setTimeout(() => setNotification(null), 3000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [addMsg, addError, adding, dispatch]);

  // Show success/error toast after update - WITH PROPER CLEANUP
  useEffect(() => {
    let timer;
    
    if (!updating && (updateMsg || updateError)) {
      if (updateError) {
        setNotification({ type: 'error', message: updateError || 'Failed to update garment type!' });
      } else if (updateMsg) {
        setNotification({ type: 'success', message: updateMsg || 'Garment type updated successfully!' });
        setEditingId(null);
        setEditName('');
        dispatch(GetAllGarmentType());
        dispatch(GetAllInactiveGarmentType({}));
      }
      timer = setTimeout(() => setNotification(null), 3000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [updateMsg, updateError, updating, dispatch]);

  // Cleanup notifications when component unmounts
  useEffect(() => {
    return () => {
      setNotification(null);
    };
  }, []);

  // Reset notification when search changes or pagination changes
  useEffect(() => {
    setNotification(null);
  }, [search, currentPage]);

  // Combine active and inactive garments for display and sort in descending order by GarmentTypeId
  const allGarments = [
    ...(Array.isArray(activeGarments) ? activeGarments.map(garment => ({ ...garment, status: 'A' })) : []),
    ...(Array.isArray(inactiveGarments) ? inactiveGarments.map(garment => ({ ...garment, status: 'I' })) : [])
  ].sort((a, b) => {
    // Sort by GarmentTypeId in descending order (newest first)
    return (b.GarmentTypeId || 0) - (a.GarmentTypeId || 0);
  });

  // Handle add garment type with duplicate check
  const handleAddGarment = (e) => {
    e.preventDefault();
    const name = garmentName.trim();
    if (!name) {
      setFormError('Please enter a garment name');
      return;
    }

    const exists = allGarments.some(
      (g) => g.GarmentTypeName.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setNotification({ type: 'error', message: 'Garment type already exists!' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setFormError('');
    dispatch(AddGarmentType({ GarmentTypeName: name }));
  };

  // Handle edit garment type
  const handleEditClick = (garment) => {
    setEditingId(garment.GarmentTypeId);
    setEditName(garment.GarmentTypeName);
  };

  // Handle save edited garment type
  const handleSaveEdit = (garment) => {
    const name = editName.trim();
    if (!name) {
      setNotification({ type: 'error', message: 'Please enter a garment name' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const exists = allGarments.some(
      (g) => 
        g.GarmentTypeId !== garment.GarmentTypeId && 
        g.GarmentTypeName.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setNotification({ type: 'error', message: 'Garment type already exists!' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const updateData = {
      GarmentTypeId: garment.GarmentTypeId,
      GarmentTypeName: name,
      Status: garment.status || garment.Status || 'A'
    };

    dispatch(UpdateGarmentType(updateData));
  };

  // Handle status toggle confirmation
  const handleStatusToggleClick = (garment) => {
    setGarmentToToggle(garment);
    setShowStatusModal(true);
  };

  // Handle confirmed status toggle
  const handleConfirmStatusToggle = () => {
    if (!garmentToToggle) return;

    const currentStatus = garmentToToggle.status || garmentToToggle.Status;
    const newStatus = (currentStatus === 'A' || !currentStatus) ? 'I' : 'A';
    
    const updateData = {
      GarmentTypeId: garmentToToggle.GarmentTypeId,
      GarmentTypeName: garmentToToggle.GarmentTypeName,
      Status: newStatus
    };

    dispatch(UpdateGarmentType(updateData));
    setShowStatusModal(false);
    setGarmentToToggle(null);
  };

  // Handle cancel status toggle
  const handleCancelStatusToggle = () => {
    setShowStatusModal(false);
    setGarmentToToggle(null);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  // Get status display text and color
  const getStatusInfo = (garment) => {
    const status = garment.status || garment.Status;
    const isActive = status === 'A' || !status;
    
    if (isActive) {
      return { 
        text: 'Active', 
        color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50',
        icon: <FiToggleRight className="mr-1" size={12} />
      };
    } else {
      return { 
        text: 'Inactive', 
        color: 'bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50',
        icon: <FiToggleLeft className="mr-1" size={12} />
      };
    }
  };

  // Get row styling based on status
  const getRowClass = (garment) => {
    const status = garment.status || garment.Status;
    const isActive = status === 'A' || !status;
    
    return isActive 
      ? 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30 border-l-4 border-l-blue-400' 
      : 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50/30 border-l-4 border-l-slate-300';
  };

  // Pagination logic
  const filteredGarments = allGarments.filter((g) =>
    (g.GarmentTypeName || '').toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGarments = filteredGarments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGarments.length / itemsPerPage);

  // Pagination 3-page sliding window
  const pageNumbers = [];
  const maxPageButtons = 3;
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  // Loading state
  const isLoading = loading || loadingInactive;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 md:p-6 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
      {/* 3D Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-[100] p-4 rounded-2xl shadow-2xl flex items-center transition-all duration-500 transform backdrop-blur-none ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200/50 border-l-4 border-l-green-400' 
              : notification.type === 'error'
              ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200/50 border-l-4 border-l-rose-400'
              : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-blue-200/50 border-l-4 border-l-blue-400'
          } animate-bounce-in`}
          role="alert"
        >
          <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
            {notification.type === 'success' ? (
              <FiCheckCircle className="text-white" size={18} />
            ) : notification.type === 'error' ? (
              <FiAlertCircle className="text-white" size={18} />
            ) : (
              <FiActivity className="text-white" size={18} />
            )}
          </div>
          <span className="font-semibold text-sm">{notification.message}</span>
        </div>
      )}

      {/* Header Section with 3D Effect */}
      <div className="relative z-10 mb-6 md:mb-8">
        <div className="flex items-center space-x-4 mb-3">
          <div className="p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
            <FiLayers className="text-white text-lg md:text-xl" />
          </div>
          <div className="transform ">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Garment Types
            </h1>
            <p className="text-slate-600 mt-1 text-sm md:text-base">Manage your garment inventory</p>
          </div>
        </div>
      </div>

      {/* 3D Stats Cards - Moved above search bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Types</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {allGarments.length}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
                <FiLayers className="text-white text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {allGarments.filter(g => (g.status || g.Status) === 'A' || !g.status).length}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <FiActivity className="text-white text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-700 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Inactive</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {allGarments.filter(g => (g.status || g.Status) === 'I').length}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl shadow-lg">
                <FiArchive className="text-white text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Add button - 3D Design */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row flex-grow space-y-4 md:space-y-0 md:space-x-4 w-full">
          <div className="relative flex-grow group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
            <input
              type="text"
              placeholder="Search garment types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
              disabled={isLoading}
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 md:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 w-full md:w-auto"
          >
            <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
            <FiPlus className="mr-2 relative z-10" size={18} /> 
            <span className="relative z-10">Add Garment Type</span>
          </button>
        </div>
      </div>

      {/* 3D Table */}
      {isLoading ? (
        <div className="relative z-10 text-center py-8 md:py-12">
          <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-2xl border border-white/20">
            <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-blue-800"></div>
            <span className="text-slate-700 font-medium text-sm md:text-base">Loading garment types...</span>
          </div>
        </div>
      ) : (
        <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
                  <th className="py-3 md:py-4 px-4 md:px-6 text-left text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Garment ID</th>
                  <th className="py-3 md:py-4 px-4 md:px-6 text-left text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Garment Type</th>
                  <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {currentGarments.length > 0 ? (
                  currentGarments.map((g, i) => {
                    const statusInfo = getStatusInfo(g);
                    const rowClass = getRowClass(g);
                    
                    return (
                      <tr key={g.GarmentTypeId || i} className={`${rowClass} group`}>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                          {g.GarmentTypeId || 'N/A'}
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                          {editingId === g.GarmentTypeId ? (
                            <div className="flex items-center space-x-2 md:space-x-3">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-1 px-2 md:px-3 py-1 md:py-2 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm shadow-inner text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(g)}
                              />
                              <div className="flex space-x-1 md:space-x-2">
                                <button
                                  onClick={() => handleSaveEdit(g)}
                                  disabled={updating}
                                  className="p-1 md:p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                                  title="Save"
                                >
                                  <FiSave size={12} />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1 md:p-2 bg-gradient-to-br from-slate-500 to-slate-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                                  title="Cancel"
                                >
                                  <FiX size={12} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span 
                                className="text-slate-800 text-sm md:text-base cursor-pointer hover:text-slate-900 transition-colors duration-200"
                                onClick={() => handleEditClick(g)}
                                title="Click to edit"
                              >
                                {g.GarmentTypeName}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                          <button
                            onClick={() => handleStatusToggleClick(g)}
                            disabled={updating}
                            className={`inline-flex items-center justify-center w-20 md:w-24 px-2 md:px-3 py-1 md:py-2 rounded-full text-xs tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg ${statusInfo.color} hover:shadow-xl disabled:opacity-50`}
                            title={`Click to ${statusInfo.text === 'Active' ? 'deactivate' : 'activate'}`}
                          >
                            {statusInfo.icon}
                            {statusInfo.text}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-8 md:py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="p-3 md:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                          <FiLayers className="text-slate-500 text-lg md:text-xl" />
                        </div>
                        <p className="text-slate-500 font-medium">No garment types found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 3D Pagination */}
          {filteredGarments.length > itemsPerPage && (
            <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-4 md:space-y-0">
              <div className="text-sm text-slate-600">
                Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredGarments.length)} of{' '}
                {filteredGarments.length}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                >
                  <FiChevronLeft size={14} />
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 md:px-3.5 py-1 md:py-1.5 rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-sm ${
                      currentPage === page
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
                  className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                >
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Garment Type Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormError('');
                  setGarmentName('');
                }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
              >
                <FiX className="text-lg md:text-xl" />
              </button>

              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                  <FiPlus className="text-white text-base md:text-lg" />
                </div>
                <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Add Garment Type
                </h2>
              </div>

              {formError && (
                <div className="mb-4 md:mb-6 p-3 md:p-4 text-rose-700 bg-gradient-to-r from-rose-50 to-red-50 rounded-2xl border border-rose-200 shadow-inner text-sm">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddGarment} className="space-y-4">
                <div>
                  <label htmlFor="garmentName" className="block text-sm font-medium text-slate-700 mb-2">
                    Garment Name <span className="text-rose-500"></span>
                  </label>
                  <input
                    type="text"
                    id="garmentName"
                    value={garmentName}
                    onChange={(e) => {
                      setGarmentName(e.target.value);
                      if (formError) setFormError('');
                    }}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    placeholder="e.g., Shirt, Trousers, Jacket"
                  />
                </div>

                <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormError('');
                      setGarmentName('');
                    }}
                    className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm md:text-base order-1 md:order-2"
                  >
                    {adding ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      'Save Garment Type'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Status Toggle Confirmation Modal */}
      {showStatusModal && garmentToToggle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
              <button
                onClick={handleCancelStatusToggle}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
              >
                <FiX className="text-lg md:text-xl" />
              </button>

              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                  <FiAlertCircle className="text-white text-base md:text-lg" />
                </div>
                <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Confirm Status Change
                </h2>
              </div>

              <div className="mb-6">
                <p className="text-slate-700 text-sm md:text-base mb-4">
                  Are you sure you want to change the status of <strong>"{garmentToToggle.GarmentTypeName}"</strong> from{' '}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusInfo(garmentToToggle).color}`}>
                    {getStatusInfo(garmentToToggle).text}
                  </span>{' '}
                  to{' '}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    (garmentToToggle.status || garmentToToggle.Status) === 'A' || !garmentToToggle.status
                      ? 'bg-gradient-to-br from-slate-500 to-slate-600 text-white'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                  }`}>
                    {(garmentToToggle.status || garmentToToggle.Status) === 'A' || !garmentToToggle.status ? 'Inactive' : 'Active'}
                  </span>?
                </p>
                <p className="text-slate-500 text-xs md:text-sm">
                  This action will {((garmentToToggle.status || garmentToToggle.Status) === 'A' || !garmentToToggle.status) ? 'disable' : 'enable'} the garment type.
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4">
                <button
                  onClick={handleCancelStatusToggle}
                  className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStatusToggle}
                  disabled={updating}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm md:text-base order-1 md:order-2"
                >
                  {updating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    'Confirm Change'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GarmentTypes;