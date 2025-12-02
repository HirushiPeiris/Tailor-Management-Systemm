// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//     FiPlus, 
//     FiSearch, 
//     FiEdit2, 
//     FiX, 
//     FiChevronLeft, 
//     FiChevronRight, 
//     FiEye, 
//     FiEyeOff,
//     FiUser,
//     FiPhone,
//     FiMail,
//     FiTool,
//     FiCheckCircle,
//     FiAlertCircle,
//     FiUsers
// } from 'react-icons/fi';
// import { GetAllTailors, AddTailors, UpdateTailorDetails } from '../actions/tailorAction';

// const Tailors = () => {
//     const dispatch = useDispatch();

//     // Redux state selectors
//     const { responseBody: tailors = [], loading, msg: fetchError } = useSelector(
//         (state) => state.tailorList || {}
//     );
//     const { responseBody: addedTailor = {}, loading: adding, msg: addError } = useSelector(
//         (state) => state.tailorAdd || {}
//     );
//     const { responseBody: updatedTailor = {}, loading: updating, msg: updateError } = useSelector(
//         (state) => state.tailorsUpdate || {}
//     );

//     // UI state
//     const [search, setSearch] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [tailor, setTailor] = useState({
//         TailorId: null,
//         TailorName: '',
//         Email: '',
//         PasswordHash: '',
//         Phone: '',
//         Skills: '',
//         States: 'A',
//     });
//     const [formError, setFormError] = useState('');
//     const [successMsg, setSuccessMsg] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
    
//     // Mobile responsive state
//     const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
//     // Pagination state
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(8);

//     // Handle resize for mobile responsiveness
//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 768);
//         };

//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     // Fetch all tailors on component mount
//     useEffect(() => {
//         dispatch(GetAllTailors());
//     }, [dispatch]);

//     // Handle success notifications for both add and update
//     useEffect(() => {
//         // Handle successful addition
//         if (Object.keys(addedTailor).length > 0 && !addError && !adding) {
//             handleSuccess('added');
//         }

//         // Handle successful update
//         if (Object.keys(updatedTailor).length > 0 && !updateError && !updating) {
//             handleSuccess('updated');
//         }
//     }, [addedTailor, updatedTailor, addError, updateError, adding, updating]);

//     const handleSuccess = (action) => {
//         setShowModal(false);
//         setTailor({
//             TailorId: null,
//             TailorName: '',
//             Email: '',
//             PasswordHash: '',
//             Phone: '',
//             Skills: '',
//             States: 'A',
//         });
//         dispatch(GetAllTailors());
//         setSuccessMsg(`Tailor successfully ${action}!`);
//         setTimeout(() => setSuccessMsg(''), 3000);
//         setIsEditing(false);
//         setFormError('');
//     };

//     // Filter and sort tailors in descending order
//     const filteredTailors = (Array.isArray(tailors) ? [...tailors] : [])
//         .filter((t) => {
//             if (!search) return true;
//             const normalizedSearch = search.toLowerCase();
//             return (
//                 t.Name?.toLowerCase().includes(normalizedSearch) ||
//                 t.Email?.toLowerCase().includes(normalizedSearch) ||
//                 String(t.TailorId) === normalizedSearch
//             );
//         })
//         .sort((a, b) => {
//             const idA = parseInt(a.TailorId) || 0;
//             const idB = parseInt(b.TailorId) || 0;
//             return idB - idA; // Descending order
//         });

//     // Pagination calculations
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentTailors = filteredTailors.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredTailors.length / itemsPerPage);

//     // Pagination handlers
//     const goToNextPage = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     const goToPrevPage = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     const goToPage = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     // Reset to first page when search changes
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [search]);

//     // Generate page numbers for pagination
//     const getPageNumbers = () => {
//         const pageNumbers = [];
//         const maxVisiblePages = 3;
        
//         if (totalPages <= maxVisiblePages) {
//             for (let i = 1; i <= totalPages; i++) {
//                 pageNumbers.push(i);
//             }
//         } else {
//             if (currentPage === 1) {
//                 pageNumbers.push(1, 2, 3);
//             } else if (currentPage === totalPages) {
//                 pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
//             } else {
//                 pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
//             }
//         }
        
//         return pageNumbers;
//     };

//     const openAddModal = () => {
//         setIsEditing(false);
//         setTailor({
//             TailorId: null,
//             TailorName: '',
//             Email: '',
//             PasswordHash: '',
//             Phone: '',
//             Skills: '',
//             States: 'A',
//         });
//         setFormError('');
//         setShowPassword(false);
//         setShowModal(true);
//     };

//     const openEditModal = (currentTailor) => {
//         setIsEditing(true);
//         setTailor({
//             TailorId: currentTailor.TailorId,
//             TailorName: currentTailor.Name,
//             Email: currentTailor.Email,
//             Phone: currentTailor.Phone,
//             Skills: currentTailor.Skills,
//             PasswordHash: '', // Don't show password in edit mode
//             States: currentTailor.States || 'A',
//         });
//         setFormError('');
//         setShowModal(true);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
        
//         // Phone number validation - only allow numbers and limit to 10 digits
//         if (name === 'Phone') {
//             // Remove all non-digit characters
//             const numbersOnly = value.replace(/\D/g, '');
//             // Limit to 10 digits
//             const limitedNumbers = numbersOnly.slice(0, 10);
//             setTailor((prev) => ({ ...prev, [name]: limitedNumbers }));
//         } else {
//             setTailor((prev) => ({ ...prev, [name]: value }));
//         }
//     };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setFormError('');

//         if (!tailor.TailorName || !tailor.Email) {
//             setFormError('Please fill in all required fields (Name, Email).');
//             return;
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(tailor.Email)) {
//             setFormError('Invalid email address.');
//             return;
//         }
        
//         // Phone number validation - must be exactly 10 digits if provided
//         if (tailor.Phone && tailor.Phone.length !== 10) {
//             setFormError('Phone number must be exactly 10 digits.');
//             return;
//         }
        
//         if (!isEditing && !tailor.PasswordHash) {
//             setFormError('Please enter a password for a new tailor.');
//             return;
//         }

//         try {
//             if (isEditing) {
//                 const updatePayload = {
//                     TailorId: tailor.TailorId,
//                     TailorName: tailor.TailorName,
//                     Email: tailor.Email,
//                     Phone: tailor.Phone,
//                     Skills: tailor.Skills,
//                     States: tailor.States
//                 };
//                 await dispatch(UpdateTailorDetails(updatePayload));
//             } else {
//                 const addPayload = {
//                     Name: tailor.TailorName,
//                     Phone: tailor.Phone,
//                     Skills: tailor.Skills,
//                     Email: tailor.Email,
//                     PasswordHash: tailor.PasswordHash,
//                     States: 'A'
//                 };
//                 await dispatch(AddTailors(addPayload));
//             }
//             // Success is handled in the useEffect above
//         } catch (error) {
//             console.error(isEditing ? 'Failed to update tailor:' : 'Failed to add tailor:', error);
//             setFormError(
//                 isEditing ? 'Failed to update tailor. Please try again.' : 'Failed to add tailor. Please try again.'
//             );
//         }
//     };

// const getStatusBadge = (status) => {
//   switch (status) {
//     case 'A':
//       return (
//         <span className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 rounded-full text-xs bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50 font-sm">
//           Active
//         </span>
//       );
//     case 'I':
//       return (
//         <span className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 rounded-full text-xs bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50 font-sm">
//           Inactive
//         </span>
//       );
//     default:
//       return (
//         <span className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 rounded-full text-xs bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50 font-sm">
//           Unknown
//         </span>
//       );
//   }
// };

//     // Combined error message from various sources
//     const combinedError = fetchError?.msg || addError?.msg || updateError?.msg || formError;

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
//                     <p className="mt-4 text-slate-700 font-medium">Loading tailors...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 sm:p-6 relative overflow-hidden">
//             {/* 3D Background Elements */}
//             <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-blue-800/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//             <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-800/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
            
//             {/* Success Notification - Green Color */}
//             {successMsg && (
//                 <div
//                     className="fixed top-4 left-4 right-4 sm:top-6 sm:left-auto sm:right-6 z-50 p-3 sm:p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl shadow-2xl flex items-center animate-slide-in max-w-sm sm:max-w-md mx-auto"
//                     role="alert"
//                 >
//                     <div className="bg-white/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 backdrop-blur-sm flex-shrink-0">
//                         <FiCheckCircle className="text-white" size={16} />
//                     </div>
//                     <span className="font-semibold text-xs sm:text-sm truncate">{successMsg}</span>
//                 </div>
//             )}

//             {/* Error Notification - Red Color */}
//             {combinedError && !showModal && (
//                 <div
//                     className="fixed top-4 left-4 right-4 sm:top-6 sm:left-auto sm:right-6 z-50 p-3 sm:p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl shadow-2xl flex items-center animate-slide-in max-w-sm sm:max-w-md mx-auto"
//                     role="alert"
//                 >
//                     <div className="bg-white/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 backdrop-blur-sm flex-shrink-0">
//                         <FiAlertCircle className="text-white" size={16} />
//                     </div>
//                     <span className="font-semibold text-xs sm:text-sm truncate">{combinedError}</span>
//                 </div>
//             )}

//             <div className="relative z-10 max-w-9xl mx-auto">
//                 {/* Header Section with 3D Effect - Mobile Optimized */}
//                 <div className="mb-6 sm:mb-8">
//                     <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
//                         <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-2xl transform ">
//                             <FiUsers className="text-white text-lg sm:text-xl" />
//                         </div>
//                         <div className="transform ">
//                             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                                 Tailor Management
//                             </h1>
//                             <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage your tailor profiles and information</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* 3D Stats Cards - Mobile Optimized */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
//                     <div className="group relative">
//                         <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//                         <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-slate-600 text-xs sm:text-sm font-medium">Total Tailors</p>
//                                     <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                                         {filteredTailors.length}
//                                     </p>
//                                 </div>
//                                 <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-lg">
//                                     <FiUsers className="text-white text-base sm:text-lg" />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="group relative">
//                         <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//                         <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-slate-600 text-xs sm:text-sm font-medium">Active</p>
//                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                                         {filteredTailors.filter(t => t.States === 'A').length}
//                                     </p>
//                                 </div>
//                                 <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
//                                     <FiCheckCircle className="text-white text-base sm:text-lg" />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="group relative sm:col-span-2 lg:col-span-1">
//                         <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//                         <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-slate-600 text-xs sm:text-sm font-medium">Inactive</p>
//                                     <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                                         {filteredTailors.filter(t => t.States === 'I').length}
//                                     </p>
//                                 </div>
//                                 <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-lg">
//                                     <FiAlertCircle className="text-white text-base sm:text-lg" />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Search and Action Bar - 3D Design - Mobile Optimized */}
//                 <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
//                     <div className="relative flex-grow group">
//                         <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//                         <div className="relative flex items-center">
//                             <FiSearch className="absolute left-3 sm:left-4 text-slate-400 z-10" size={18} />
//                             <input
//                                 type="text"
//                                 placeholder="Search tailors by name, email, or ID..."
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 className="relative w-full pl-10 sm:pl-12 pr-3 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
//                                 disabled={loading}
//                             />
//                         </div>
//                     </div>
//                     <button
//                         onClick={openAddModal}
//                         className="relative group bg-gradient-to-br from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl sm:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 whitespace-nowrap min-w-[120px] sm:min-w-auto"
//                     >
//                         <div className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//                         <FiPlus className="mr-2 sm:mr-3 relative z-10" size={18} />
//                         <span className="relative z-10 text-sm sm:text-base">Add Tailor</span>
//                     </button>
//                 </div>

//                 {/* Desktop Table */}
//                 {!isMobile && (
//                     <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 overflow-hidden mb-4 sm:mb-6">
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead>
//                                     <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Tailor ID</th>
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Name</th>
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Phone</th>
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Skills</th>
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Email</th>
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Status</th>
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-slate-200/50">
//                                     {currentTailors.length > 0 ? (
//                                         currentTailors.map((t) => (
//                                             <tr key={t.TailorId} className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 group">
//                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[100px] sm:max-w-[200px] truncate">{t.TailorId}</td>
//                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[120px] sm:max-w-[200px] truncate">
//                                                     {t.Name}
//                                                 </td>
//                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[120px] sm:max-w-[200px] truncate">{t.Phone || 'N/A'}</td>
//                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[120px] sm:max-w-[200px] truncate">{t.Skills || 'Not specified'}</td>
//                                                 <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[150px] sm:max-w-[200px] truncate">{t.Email}</td>
//                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[100px] sm:max-w-[200px] truncate">{getStatusBadge(t.States)}</td>
//                                                 <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
//                                                     <button
//                                                         onClick={() => openEditModal(t)}
//                                                         className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
//                                                         title="Edit Tailor"
//                                                     >
//                                                         <FiEdit2 size={14} />
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan="7" className="text-center py-8 sm:py-12">
//                                                 <div className="flex flex-col items-center space-y-2 sm:space-y-3">
//                                                     <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl sm:rounded-2xl shadow-inner">
//                                                         <FiUsers className="text-slate-500 text-lg sm:text-xl" />
//                                                     </div>
//                                                     <p className="text-slate-500 font-medium text-sm sm:text-base">No tailors found</p>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* 3D Pagination */}
//                         {filteredTailors.length > itemsPerPage && (
//                             <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
//                                 <div className="text-xs sm:text-sm text-slate-600 font-medium">
//                                     Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredTailors.length)} of{' '}
//                                     {filteredTailors.length}
//                                 </div>
//                                 <div className="flex items-center space-x-1 sm:space-x-2">
//                                     <button
//                                         onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                                         disabled={currentPage === 1}
//                                         className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                                     >
//                                         <FiChevronLeft size={14} />
//                                     </button>

//                                     {getPageNumbers().map((page) => (
//                                         <button
//                                             key={page}
//                                             onClick={() => setCurrentPage(page)}
//                                             className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
//                                                 currentPage === page
//                                                     ? 'bg-gradient-to-br from-blue-800 to-blue-900 text-white shadow-2xl scale-105 border-transparent'
//                                                     : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                                             }`}
//                                         >
//                                             {page}
//                                         </button>
//                                     ))}

//                                     <button
//                                         onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                                         disabled={currentPage === totalPages}
//                                         className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                                     >
//                                         <FiChevronRight size={14} />
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* Mobile Cards Layout */}
//                 {isMobile && (
//                     <div className="space-y-3 mb-4">
//                         {currentTailors.length > 0 ? (
//                             currentTailors.map((t) => (
//                                 <div 
//                                     key={t.TailorId} 
//                                     className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-3 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
//                                 >
//                                     <div className="flex justify-between items-start mb-2">
//                                         <div className="flex-1 min-w-0">
//                                             <h3 className="text-slate-800 text-sm font-medium mb-1 truncate">
//                                                 {t.Name}
//                                             </h3>
//                                             <div className="space-y-1 text-xs text-slate-600">
//                                                 <div className="flex items-center">
//                                                     <span className="font-medium mr-2">ID:</span>
//                                                     <span>{t.TailorId}</span>
//                                                 </div>
//                                                 <div className="flex items-center">
//                                                     <span className="font-medium mr-2">Phone:</span>
//                                                     <span className="truncate">{t.Phone || 'N/A'}</span>
//                                                 </div>
//                                                 <div className="flex items-center">
//                                                     <span className="font-medium mr-2">Email:</span>
//                                                     <span className="truncate">{t.Email}</span>
//                                                 </div>
//                                                 <div className="flex items-center">
//                                                     <span className="font-medium mr-2">Skills:</span>
//                                                     <span className="truncate">{t.Skills || 'Not specified'}</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="flex flex-col items-end space-y-2 ml-2">
//                                             {getStatusBadge(t.States)}
//                                             <button
//                                                 onClick={() => openEditModal(t)}
//                                                 className="p-2 bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                                                 title="Edit Tailor"
//                                             >
//                                                 <FiEdit2 size={12} />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="text-center py-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20">
//                                 <div className="flex flex-col items-center space-y-2">
//                                     <div className="p-3 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-inner">
//                                         <FiUsers className="text-slate-500 text-lg" />
//                                     </div>
//                                     <p className="text-slate-500 font-medium text-sm">
//                                         {search ? 'No matching tailors found' : 'No tailors available'}
//                                     </p>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Mobile Pagination */}
//                         {filteredTailors.length > itemsPerPage && (
//                             <div className="flex flex-col sm:flex-row items-center justify-between px-3 py-3 bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-xl shadow-xl border border-white/20 space-y-2 sm:space-y-0">
//                                 <div className="text-xs text-slate-600 font-medium">
//                                     Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredTailors.length)} of{' '}
//                                     {filteredTailors.length}
//                                 </div>
//                                 <div className="flex items-center space-x-1">
//                                     <button
//                                         onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                                         disabled={currentPage === 1}
//                                         className="p-1.5 rounded-lg border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40"
//                                     >
//                                         <FiChevronLeft size={12} />
//                                     </button>

//                                     {getPageNumbers().map((page) => (
//                                         <button
//                                             key={page}
//                                             onClick={() => setCurrentPage(page)}
//                                             className={`px-2 py-1 rounded-lg border font-medium transition-all duration-300 transform hover:scale-105 text-xs min-w-[32px] ${
//                                                 currentPage === page
//                                                     ? 'bg-gradient-to-br from-blue-800 to-blue-900 text-white shadow-xl scale-105 border-transparent'
//                                                     : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                                             }`}
//                                         >
//                                             {page}
//                                         </button>
//                                     ))}

//                                     <button
//                                         onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                                         disabled={currentPage === totalPages}
//                                         className="p-1.5 rounded-lg border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40"
//                                     >
//                                         <FiChevronRight size={12} />
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* 3D Modal - Mobile Optimized */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
//                     <div className="relative w-full max-w-sm sm:max-w-md">
//                         <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl sm:rounded-3xl blur opacity-20 transform "></div>
//                         <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6">
//                             <div className="flex items-center justify-between mb-4 sm:mb-6">
//                                 <div className="flex items-center space-x-2 sm:space-x-3">
//                                     <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-lg">
//                                         <FiUser className="text-white text-base sm:text-lg" />
//                                     </div>
//                                     <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                                         {isEditing ? 'Edit Tailor' : 'Add New Tailor'}
//                                     </h2>
//                                 </div>
//                                 <button 
//                                     onClick={() => { setShowModal(false); setFormError(''); }}
//                                     className="p-1 sm:p-2 text-slate-400 hover:text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                                 >
//                                     <FiX size={20} />
//                                 </button>
//                             </div>

//                             {formError && (
//                                 <div className="mb-4 sm:mb-6 p-3 sm:p-4 text-red-700 bg-gradient-to-r from-red-50 to-red-100 rounded-xl sm:rounded-2xl border border-red-200 shadow-inner">
//                                     <div className="flex items-center">
//                                         <FiAlertCircle className="mr-2" size={16} />
//                                         <span className="text-sm sm:text-base">{formError}</span>
//                                     </div>
//                                 </div>
//                             )}

//                             <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
//                                             Name <span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="TailorName"
//                                             value={tailor.TailorName}
//                                             onChange={handleChange}
//                                             className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                                             placeholder="Tailor's full name"
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
//                                             Phone {tailor.Phone && `(${tailor.Phone.length}/10)`}
//                                         </label>
//                                         <input
//                                             type="tel"
//                                             name="Phone"
//                                             value={tailor.Phone}
//                                             onChange={handleChange}
//                                             className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
//                                                 tailor.Phone && tailor.Phone.length !== 10 && tailor.Phone.length > 0 
//                                                     ? 'border-red-300' 
//                                                     : 'border-slate-200'
//                                             }`}
//                                             placeholder="Enter 10-digit phone number"
//                                             maxLength={10}
//                                         />
//                                         {tailor.Phone && tailor.Phone.length !== 10 && (
//                                             <p className="text-red-500 text-xs mt-1">
//                                                 Phone number must be exactly 10 digits
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Skills</label>
//                                     <input
//                                         type="text"
//                                         name="Skills"
//                                         value={tailor.Skills}
//                                         onChange={handleChange}
//                                         className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                                         placeholder="e.g., Alterations, Custom Fitting, Embroidery"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
//                                         Email <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="email"
//                                         name="Email"
//                                         value={tailor.Email}
//                                         onChange={handleChange}
//                                         className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                                         placeholder="tailor@example.com"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//                                     {isEditing && (
//                                         <div>
//                                             <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Status</label>
//                                             <select
//                                                 name="States"
//                                                 value={tailor.States}
//                                                 onChange={handleChange}
//                                                 className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                                                 required
//                                             >
//                                                 <option value="A">Active</option>
//                                                 <option value="I">Inactive</option>
//                                             </select>
//                                         </div>
//                                     )}

//                                     {!isEditing && (
//                                         <div className="relative">
//                                             <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
//                                                 Password <span className="text-red-500">*</span>
//                                             </label>
//                                             <input
//                                                 type={showPassword ? "text" : "password"}
//                                                 name="PasswordHash"
//                                                 value={tailor.PasswordHash}
//                                                 onChange={handleChange}
//                                                 className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                                                 placeholder="Enter password"
//                                                 required
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={togglePasswordVisibility}
//                                                 className="absolute right-2 sm:right-3 top-9 sm:top-11 text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1"
//                                             >
//                                                 {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="flex justify-end gap-2 sm:gap-4 pt-4 sm:pt-6">
//                                     <button
//                                         type="button"
//                                         onClick={() => { setShowModal(false); setFormError(''); }}
//                                         className="px-4 sm:px-6 py-2 sm:py-3 border border-slate-300 rounded-xl sm:rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
//                                         disabled={adding || updating}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-br from-blue-800 to-blue-900 text-white font-semibold rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
//                                         disabled={adding || updating || (tailor.Phone && tailor.Phone.length !== 10)}
//                                     >
//                                         {isEditing ? (updating ? 'Updating...' : 'Update Tailor') : (adding ? 'Adding...' : 'Add Tailor')}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Tailors;



// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//     FiPlus, 
//     FiSearch, 
//     FiEdit2, 
//     FiX, 
//     FiChevronLeft, 
//     FiChevronRight, 
//     FiEye, 
//     FiEyeOff,
//     FiUser,
//     FiPhone,
//     FiMail,
//     FiTool,
//     FiCheckCircle,
//     FiAlertCircle,
//     FiUsers
// } from 'react-icons/fi';
// import { GetAllTailors, AddTailors, UpdateTailorDetails } from '../actions/tailorAction';

// const Tailors = () => {
//     const dispatch = useDispatch();

//     // Redux state selectors
//     const { responseBody: tailors = [], loading, msg: fetchError } = useSelector(
//         (state) => state.tailorList || {}
//     );
//     const { responseBody: addedTailor = {}, loading: adding, msg: addError } = useSelector(
//         (state) => state.tailorAdd || {}
//     );
//     const { responseBody: updatedTailor = {}, loading: updating, msg: updateError } = useSelector(
//         (state) => state.tailorsUpdate || {}
//     );

//     // UI state
//     const [search, setSearch] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [tailor, setTailor] = useState({
//         TailorId: null,
//         TailorName: '',
//         Email: '',
//         PasswordHash: '',
//         Phone: '',
//         Skills: '',
//         States: 'A',
//     });
//     const [formError, setFormError] = useState('');
//     const [fieldErrors, setFieldErrors] = useState({});
//     const [successMsg, setSuccessMsg] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
    
//     // Mobile responsive state
//     const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
//     // Pagination state
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(8);

//     // Handle resize for mobile responsiveness
//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 768);
//         };

//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     // Fetch all tailors on component mount
//     useEffect(() => {
//         dispatch(GetAllTailors());
//     }, [dispatch]);

//     // Handle success notifications for both add and update
//     useEffect(() => {
//         // Handle successful addition
//         if (Object.keys(addedTailor).length > 0 && !addError && !adding) {
//             handleSuccess('added');
//         }

//         // Handle successful update
//         if (Object.keys(updatedTailor).length > 0 && !updateError && !updating) {
//             handleSuccess('updated');
//         }
//     }, [addedTailor, updatedTailor, addError, updateError, adding, updating]);

//     const handleSuccess = (action) => {
//         setShowModal(false);
//         setTailor({
//             TailorId: null,
//             TailorName: '',
//             Email: '',
//             PasswordHash: '',
//             Phone: '',
//             Skills: '',
//             States: 'A',
//         });
//         dispatch(GetAllTailors());
//         setSuccessMsg(`Tailor successfully ${action}!`);
//         setTimeout(() => setSuccessMsg(''), 3000);
//         setIsEditing(false);
//         setFormError('');
//         setFieldErrors({});
//     };

//     // Filter and sort tailors in descending order
//     const filteredTailors = (Array.isArray(tailors) ? [...tailors] : [])
//         .filter((t) => {
//             if (!search) return true;
//             const normalizedSearch = search.toLowerCase();
//             return (
//                 t.Name?.toLowerCase().includes(normalizedSearch) ||
//                 t.Email?.toLowerCase().includes(normalizedSearch) ||
//                 String(t.TailorId) === normalizedSearch
//             );
//         })
//         .sort((a, b) => {
//             const idA = parseInt(a.TailorId) || 0;
//             const idB = parseInt(b.TailorId) || 0;
//             return idB - idA; // Descending order
//         });

//     // Pagination calculations
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentTailors = filteredTailors.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredTailors.length / itemsPerPage);

//     // Pagination handlers
//     const goToNextPage = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     const goToPrevPage = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     const goToPage = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     // Reset to first page when search changes
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [search]);

//     // Generate page numbers for pagination
//     const getPageNumbers = () => {
//         const pageNumbers = [];
//         const maxVisiblePages = 3;
        
//         if (totalPages <= maxVisiblePages) {
//             for (let i = 1; i <= totalPages; i++) {
//                 pageNumbers.push(i);
//             }
//         } else {
//             if (currentPage === 1) {
//                 pageNumbers.push(1, 2, 3);
//             } else if (currentPage === totalPages) {
//                 pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
//             } else {
//                 pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
//             }
//         }
        
//         return pageNumbers;
//     };

//     // Validation functions
//     const validateName = (name) => {
//         if (!name.trim()) {
//             return 'Name is required';
//         }
//         if (name.trim().length < 2) {
//             return 'Name must be at least 2 characters long';
//         }
//         if (name.trim().length > 50) {
//             return 'Name must not exceed 50 characters';
//         }
//         if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
//             return 'Name can only contain letters and spaces';
//         }
//         return '';
//     };

//     const validatePhone = (phone) => {
//         if (phone && phone.length !== 10) {
//             return 'Phone number must be exactly 10 digits';
//         }
//         if (phone && !/^\d+$/.test(phone)) {
//             return 'Phone number can only contain digits';
//         }
//         return '';
//     };

//     const validateSkills = (skills) => {
//         if (skills && skills.length > 100) {
//             return 'Skills must not exceed 100 characters';
//         }
//         return '';
//     };

//     const validateEmail = (email) => {
//         if (!email.trim()) {
//             return ''; // Email is optional
//         }
        
//         let finalEmail = '';
//         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
//         // If user entered full email, use it as is
//         if (emailRegex.test(email)) {
//             finalEmail = email;
//         } else {
//             // If user entered only the first part, append @gmail.com
//             finalEmail = `${email}@gmail.com`;
//         }
        
//         // Validate the final email format
//         if (!emailRegex.test(finalEmail)) {
//             return 'Please enter a valid email address';
//         }
        
//         // Validate username part
//         const username = email.includes('@') ? email.split('@')[0] : email;
//         if (username.length > 30) {
//             return 'Email username must not exceed 30 characters';
//         }
//         if (!/^[a-zA-Z0-9._%+-]+$/.test(username)) {
//             return 'Email can only contain letters, numbers, and special characters (._%+-)';
//         }
        
//         return '';
//     };

//     const validatePassword = (password) => {
//         if (!isEditing && !password) {
//             return 'Password is required for new tailor';
//         }
//         if (!isEditing && password && password.length < 6) {
//             return 'Password must be at least 6 characters long';
//         }
//         if (!isEditing && password && password.length > 20) {
//             return 'Password must not exceed 20 characters';
//         }
//         return '';
//     };

//     const validateField = (name, value) => {
//         switch (name) {
//             case 'TailorName':
//                 return validateName(value);
//             case 'Phone':
//                 return validatePhone(value);
//             case 'Skills':
//                 return validateSkills(value);
//             case 'Email':
//                 return validateEmail(value);
//             case 'PasswordHash':
//                 return validatePassword(value);
//             default:
//                 return '';
//         }
//     };

//     const openAddModal = () => {
//         setIsEditing(false);
//         setTailor({
//             TailorId: null,
//             TailorName: '',
//             Email: '',
//             PasswordHash: '',
//             Phone: '',
//             Skills: '',
//             States: 'A',
//         });
//         setFormError('');
//         setFieldErrors({});
//         setShowPassword(false);
//         setShowModal(true);
//     };

//     const openEditModal = (currentTailor) => {
//         setIsEditing(true);
//         setTailor({
//             TailorId: currentTailor.TailorId,
//             TailorName: currentTailor.Name,
//             Email: currentTailor.Email ? currentTailor.Email.replace('@gmail.com', '') : '',
//             Phone: currentTailor.Phone,
//             Skills: currentTailor.Skills,
//             PasswordHash: '', // Don't show password in edit mode
//             States: currentTailor.States || 'A',
//         });
//         setFormError('');
//         setFieldErrors({});
//         setShowModal(true);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
        
//         let processedValue = value;
        
//         // Phone number validation - only allow numbers and limit to 10 digits
//         if (name === 'Phone') {
//             // Remove all non-digit characters
//             const numbersOnly = value.replace(/\D/g, '');
//             // Limit to 10 digits
//             processedValue = numbersOnly.slice(0, 10);
//         }
        
//         // Name validation - only allow letters and spaces
//         if (name === 'TailorName') {
//             // Allow only letters and spaces
//             processedValue = value.replace(/[^a-zA-Z\s]/g, '');
//         }
        
//         // Skills validation - allow letters, numbers, spaces, and common punctuation
//         if (name === 'Skills') {
//             processedValue = value.slice(0, 100); // Limit to 100 characters
//         }
        
//         // Email validation - allow only valid email characters
//         if (name === 'Email') {
//             processedValue = value.slice(0, 30); // Limit username to 30 characters
//         }
        
//         // Password validation
//         if (name === 'PasswordHash' && !isEditing) {
//             processedValue = value.slice(0, 20); // Limit to 20 characters
//         }

//         setTailor((prev) => ({ ...prev, [name]: processedValue }));

//         // Validate field in real-time
//         const error = validateField(name, processedValue);
//         setFieldErrors((prev) => ({
//             ...prev,
//             [name]: error
//         }));
//     };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const validateAllFields = () => {
//         const errors = {};
        
//         errors.TailorName = validateName(tailor.TailorName);
//         errors.Phone = validatePhone(tailor.Phone);
//         errors.Skills = validateSkills(tailor.Skills);
//         errors.Email = validateEmail(tailor.Email);
        
//         if (!isEditing) {
//             errors.PasswordHash = validatePassword(tailor.PasswordHash);
//         }

//         setFieldErrors(errors);
        
//         // Check if there are any errors
//         return Object.values(errors).every(error => error === '');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setFormError('');

//         // Validate all fields
//         if (!validateAllFields()) {
//             setFormError('Please fix the validation errors before submitting.');
//             return;
//         }

//         // Email processing
//         let finalEmail = '';
//         if (tailor.Email.trim()) {
//             const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//             if (emailRegex.test(tailor.Email)) {
//                 finalEmail = tailor.Email;
//             } else {
//                 finalEmail = `${tailor.Email}@gmail.com`;
//             }
//         }

//         try {
//             if (isEditing) {
//                 const updatePayload = {
//                     TailorId: tailor.TailorId,
//                     TailorName: tailor.TailorName.trim(),
//                     Email: finalEmail,
//                     Phone: tailor.Phone,
//                     Skills: tailor.Skills.trim(),
//                     States: tailor.States
//                 };
//                 await dispatch(UpdateTailorDetails(updatePayload));
//             } else {
//                 const addPayload = {
//                     Name: tailor.TailorName.trim(),
//                     Phone: tailor.Phone,
//                     Skills: tailor.Skills.trim(),
//                     Email: finalEmail,
//                     PasswordHash: tailor.PasswordHash,
//                     States: 'A'
//                 };
//                 await dispatch(AddTailors(addPayload));
//             }
//             // Success is handled in the useEffect above
//         } catch (error) {
//             console.error(isEditing ? 'Failed to update tailor:' : 'Failed to add tailor:', error);
//             setFormError(
//                 isEditing ? 'Failed to update tailor. Please try again.' : 'Failed to add tailor. Please try again.'
//             );
//         }
//     };

//     const getStatusBadge = (status) => {
//         switch (status) {
//             case 'A':
//                 return (
//                     <span className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 rounded-full text-xs bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50 font-sm">
//                         Active
//                     </span>
//                 );
//             case 'I':
//                 return (
//                     <span className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 rounded-full text-xs bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50 font-sm">
//                         Inactive
//                     </span>
//                 );
//             default:
//                 return (
//                     <span className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 rounded-full text-xs bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50 font-sm">
//                         Unknown
//                     </span>
//                 );
//         }
//     };

//     // Combined error message from various sources
//     const combinedError = fetchError?.msg || addError?.msg || updateError?.msg || formError;

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
//                     <p className="mt-4 text-slate-700 font-medium">Loading tailors...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 sm:p-6 relative overflow-hidden">
//             {/* 3D Background Elements */}
//             <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-blue-800/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//             <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-800/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
            
//             {/* Success Notification - Green Color */}
//             {successMsg && (
//                 <div
//                     className="fixed top-4 left-4 right-4 sm:top-6 sm:left-auto sm:right-6 z-50 p-3 sm:p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl shadow-2xl flex items-center animate-slide-in max-w-sm sm:max-w-md mx-auto"
//                     role="alert"
//                 >
//                     <div className="bg-white/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 backdrop-blur-sm flex-shrink-0">
//                         <FiCheckCircle className="text-white" size={16} />
//                     </div>
//                     <span className="font-semibold text-xs sm:text-sm truncate">{successMsg}</span>
//                 </div>
//             )}

//             {/* Error Notification - Red Color */}
//             {combinedError && !showModal && (
//                 <div
//                     className="fixed top-4 left-4 right-4 sm:top-6 sm:left-auto sm:right-6 z-50 p-3 sm:p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl shadow-2xl flex items-center animate-slide-in max-w-sm sm:max-w-md mx-auto"
//                     role="alert"
//                 >
//                     <div className="bg-white/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 backdrop-blur-sm flex-shrink-0">
//                         <FiAlertCircle className="text-white" size={16} />
//                     </div>
//                     <span className="font-semibold text-xs sm:text-sm truncate">{combinedError}</span>
//                 </div>
//             )}

//             <div className="relative z-10 max-w-9xl mx-auto">
//                 {/* Header Section with 3D Effect - Mobile Optimized */}
//                 <div className="mb-6 sm:mb-8">
//                     <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
//                         <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-2xl transform ">
//                             <FiUsers className="text-white text-lg sm:text-xl" />
//                         </div>
//                         <div className="transform ">
//                             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                                 Tailor Management
//                             </h1>
//                             <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage your tailor profiles and information</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* 3D Stats Cards - Mobile Optimized */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
//                     <div className="group relative">
//                         <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//                         <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-slate-600 text-xs sm:text-sm font-medium">Total Tailors</p>
//                                     <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                                         {filteredTailors.length}
//                                     </p>
//                                 </div>
//                                 <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-lg">
//                                     <FiUsers className="text-white text-base sm:text-lg" />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="group relative">
//                         <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//                         <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-slate-600 text-xs sm:text-sm font-medium">Active</p>
//                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                                         {filteredTailors.filter(t => t.States === 'A').length}
//                                     </p>
//                                 </div>
//                                 <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
//                                     <FiCheckCircle className="text-white text-base sm:text-lg" />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="group relative sm:col-span-2 lg:col-span-1">
//                         <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//                         <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-slate-600 text-xs sm:text-sm font-medium">Inactive</p>
//                                     <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
//                                         {filteredTailors.filter(t => t.States === 'I').length}
//                                     </p>
//                                 </div>
//                                 <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-lg">
//                                     <FiAlertCircle className="text-white text-base sm:text-lg" />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Search and Action Bar - 3D Design - Mobile Optimized */}
//                 <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
//                     <div className="relative flex-grow group">
//                         <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//                         <div className="relative flex items-center">
//                             <FiSearch className="absolute left-3 sm:left-4 text-slate-400 z-10" size={18} />
//                             <input
//                                 type="text"
//                                 placeholder="Search tailors by name, email, or ID..."
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 className="relative w-full pl-10 sm:pl-12 pr-3 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
//                                 disabled={loading}
//                             />
//                         </div>
//                     </div>
//                     <button
//                         onClick={openAddModal}
//                         className="relative group bg-gradient-to-br from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl sm:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 whitespace-nowrap min-w-[120px] sm:min-w-auto"
//                     >
//                         <div className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//                         <FiPlus className="mr-2 sm:mr-3 relative z-10" size={18} />
//                         <span className="relative z-10 text-sm sm:text-base">Add Tailor</span>
//                     </button>
//                 </div>

//                 {/* Desktop Table */}
//                 {!isMobile && (
//                     <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 overflow-hidden mb-4 sm:mb-6">
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead>
//                                     <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Tailor ID</th>
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Name</th>
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Phone</th>
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Skills</th>
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider w-1/3 min-w-[250px]">Email</th>
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Status</th>
//                                         <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-slate-200/50">
//                                     {currentTailors.length > 0 ? (
//                                         currentTailors.map((t) => (
//                                             <tr key={t.TailorId} className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 group">
//                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[100px] sm:max-w-[200px] truncate">{t.TailorId}</td>
//                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[120px] sm:max-w-[200px] truncate">
//                                                     {t.Name}
//                                                 </td>
//                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[120px] sm:max-w-[200px] truncate">{t.Phone || 'N/A'}</td>
//                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[120px] sm:max-w-[200px] truncate">{t.Skills || 'Not specified'}</td>
//                                                 <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base break-words min-w-[250px]">
//                                                     {t.Email || 'N/A'}
//                                                 </td>
//                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[100px] sm:max-w-[200px] truncate">{getStatusBadge(t.States)}</td>
//                                                 <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
//                                                     <button
//                                                         onClick={() => openEditModal(t)}
//                                                         className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
//                                                         title="Edit Tailor"
//                                                     >
//                                                         <FiEdit2 size={14} />
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan="7" className="text-center py-8 sm:py-12">
//                                                 <div className="flex flex-col items-center space-y-2 sm:space-y-3">
//                                                     <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl sm:rounded-2xl shadow-inner">
//                                                         <FiUsers className="text-slate-500 text-lg sm:text-xl" />
//                                                     </div>
//                                                     <p className="text-slate-500 font-medium text-sm sm:text-base">No tailors found</p>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* 3D Pagination */}
//                         {filteredTailors.length > itemsPerPage && (
//                             <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
//                                 <div className="text-xs sm:text-sm text-slate-600 font-medium">
//                                     Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredTailors.length)} of{' '}
//                                     {filteredTailors.length}
//                                 </div>
//                                 <div className="flex items-center space-x-1 sm:space-x-2">
//                                     <button
//                                         onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                                         disabled={currentPage === 1}
//                                         className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                                     >
//                                         <FiChevronLeft size={14} />
//                                     </button>

//                                     {getPageNumbers().map((page) => (
//                                         <button
//                                             key={page}
//                                             onClick={() => setCurrentPage(page)}
//                                             className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
//                                                 currentPage === page
//                                                     ? 'bg-gradient-to-br from-blue-800 to-blue-900 text-white shadow-2xl scale-105 border-transparent'
//                                                     : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                                             }`}
//                                         >
//                                             {page}
//                                         </button>
//                                     ))}

//                                     <button
//                                         onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                                         disabled={currentPage === totalPages}
//                                         className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                                     >
//                                         <FiChevronRight size={14} />
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* Mobile Cards Layout */}
//                 {isMobile && (
//                     <div className="space-y-3 mb-4">
//                         {currentTailors.length > 0 ? (
//                             currentTailors.map((t) => (
//                                 <div 
//                                     key={t.TailorId} 
//                                     className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-3 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
//                                 >
//                                     <div className="flex justify-between items-start mb-2">
//                                         <div className="flex-1 min-w-0">
//                                             <h3 className="text-slate-800 text-sm font-medium mb-1 truncate">
//                                                 {t.Name}
//                                             </h3>
//                                             <div className="space-y-1 text-xs text-slate-600">
//                                                 <div className="flex items-center">
//                                                     <span className="font-medium mr-2">ID:</span>
//                                                     <span>{t.TailorId}</span>
//                                                 </div>
//                                                 <div className="flex items-center">
//                                                     <span className="font-medium mr-2">Phone:</span>
//                                                     <span className="truncate">{t.Phone || 'N/A'}</span>
//                                                 </div>
//                                                 <div className="flex items-center">
//                                                     <span className="font-medium mr-2">Email:</span>
//                                                     <span className="break-all">{t.Email || 'N/A'}</span>
//                                                 </div>
//                                                 <div className="flex items-center">
//                                                     <span className="font-medium mr-2">Skills:</span>
//                                                     <span className="truncate">{t.Skills || 'Not specified'}</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="flex flex-col items-end space-y-2 ml-2">
//                                             {getStatusBadge(t.States)}
//                                             <button
//                                                 onClick={() => openEditModal(t)}
//                                                 className="p-2 bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                                                 title="Edit Tailor"
//                                             >
//                                                 <FiEdit2 size={12} />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="text-center py-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20">
//                                 <div className="flex flex-col items-center space-y-2">
//                                     <div className="p-3 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-inner">
//                                         <FiUsers className="text-slate-500 text-lg" />
//                                     </div>
//                                     <p className="text-slate-500 font-medium text-sm">
//                                         {search ? 'No matching tailors found' : 'No tailors available'}
//                                     </p>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Mobile Pagination */}
//                         {filteredTailors.length > itemsPerPage && (
//                             <div className="flex flex-col sm:flex-row items-center justify-between px-3 py-3 bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-xl shadow-xl border border-white/20 space-y-2 sm:space-y-0">
//                                 <div className="text-xs text-slate-600 font-medium">
//                                     Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredTailors.length)} of{' '}
//                                     {filteredTailors.length}
//                                 </div>
//                                 <div className="flex items-center space-x-1">
//                                     <button
//                                         onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                                         disabled={currentPage === 1}
//                                         className="p-1.5 rounded-lg border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40"
//                                     >
//                                         <FiChevronLeft size={12} />
//                                     </button>

//                                     {getPageNumbers().map((page) => (
//                                         <button
//                                             key={page}
//                                             onClick={() => setCurrentPage(page)}
//                                             className={`px-2 py-1 rounded-lg border font-medium transition-all duration-300 transform hover:scale-105 text-xs min-w-[32px] ${
//                                                 currentPage === page
//                                                     ? 'bg-gradient-to-br from-blue-800 to-blue-900 text-white shadow-xl scale-105 border-transparent'
//                                                     : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                                             }`}
//                                         >
//                                             {page}
//                                         </button>
//                                     ))}

//                                     <button
//                                         onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                                         disabled={currentPage === totalPages}
//                                         className="p-1.5 rounded-lg border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40"
//                                     >
//                                         <FiChevronRight size={12} />
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* 3D Modal - Mobile Optimized */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
//                     <div className="relative w-full max-w-md sm:max-w-lg">
//                         <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl sm:rounded-3xl blur opacity-20 transform "></div>
//                         <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6">
//                             <div className="flex items-center justify-between mb-4 sm:mb-6">
//                                 <div className="flex items-center space-x-2 sm:space-x-3">
//                                     <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-lg">
//                                         <FiUser className="text-white text-base sm:text-lg" />
//                                     </div>
//                                     <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                                         {isEditing ? 'Edit Tailor' : 'Add New Tailor'}
//                                     </h2>
//                                 </div>
//                                 <button 
//                                     onClick={() => { setShowModal(false); setFormError(''); setFieldErrors({}); }}
//                                     className="p-1 sm:p-2 text-slate-400 hover:text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                                 >
//                                     <FiX size={20} />
//                                 </button>
//                             </div>

//                             {formError && (
//                                 <div className="mb-4 sm:mb-6 p-3 sm:p-4 text-red-700 bg-gradient-to-r from-red-50 to-red-100 rounded-xl sm:rounded-2xl border border-red-200 shadow-inner">
//                                     <div className="flex items-center">
//                                         <FiAlertCircle className="mr-2" size={16} />
//                                         <span className="text-sm sm:text-base">{formError}</span>
//                                     </div>
//                                 </div>
//                             )}

//                             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
//                                 {/* Name Field - Full Width */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
//                                         Name <span className="text-red-500"></span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="TailorName"
//                                         value={tailor.TailorName}
//                                         onChange={handleChange}
//                                         className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
//                                             fieldErrors.TailorName ? 'border-red-300' : 'border-slate-200'
//                                         }`}
//                                         placeholder="Tailor's full name "
//                                         required
//                                     />
//                                     {fieldErrors.TailorName && (
//                                         <p className="text-red-500 text-xs mt-1">{fieldErrors.TailorName}</p>
//                                     )}
//                                 </div>

//                                 {/* Phone Field - Full Width */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
//                                         Phone {tailor.Phone && `(${tailor.Phone.length}/10)`}
//                                     </label>
//                                     <input
//                                         type="tel"
//                                         name="Phone"
//                                         value={tailor.Phone}
//                                         onChange={handleChange}
//                                         className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
//                                             fieldErrors.Phone ? 'border-red-300' : 'border-slate-200'
//                                         }`}
//                                         placeholder="Enter 10-digit phone number "
//                                         maxLength={10}
//                                     />
//                                     {fieldErrors.Phone && (
//                                         <p className="text-red-500 text-xs mt-1">{fieldErrors.Phone}</p>
//                                     )}
//                                 </div>

//                                 {/* Skills Field - Full Width */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
//                                         Skills {tailor.Skills}
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="Skills"
//                                         value={tailor.Skills}
//                                         onChange={handleChange}
//                                         className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
//                                             fieldErrors.Skills ? 'border-red-300' : 'border-slate-200'
//                                         }`}
//                                         placeholder="e.g., Alterations, Custom Fitting, Embroidery"
//                                     />
//                                     {fieldErrors.Skills && (
//                                         <p className="text-red-500 text-xs mt-1">{fieldErrors.Skills}</p>
//                                     )}
//                                 </div>

//                                 {/* Email Field - Full Width */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
//                                         Email (Optional) 
//                                     </label>
//                                     <div className="relative">
//                                         <input
//                                             type="text"
//                                             name="Email"
//                                             value={tailor.Email}
//                                             onChange={handleChange}
//                                             className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base pr-20 ${
//                                                 fieldErrors.Email ? 'border-red-300' : 'border-slate-200'
//                                             }`}
//                                             placeholder="username"
//                                         />
//                                         <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                             <span className="text-slate-500 text-sm">@gmail.com</span>
//                                         </div>
//                                     </div>
//                                     {fieldErrors.Email && (
//                                         <p className="text-red-500 text-xs mt-1">{fieldErrors.Email}</p>
//                                     )}
//                                     <p className="text-xs text-slate-500 mt-1">
//                                         Enter only the username part. @gmail.com will be added automatically.
//                                     </p>
//                                 </div>

//                                 {/* Conditional Fields - Full Width */}
//                                 {isEditing ? (
//                                     // Status Field for Edit Mode
//                                     <div>
//                                         <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Status</label>
//                                         <select
//                                             name="States"
//                                             value={tailor.States}
//                                             onChange={handleChange}
//                                             className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
//                                             required
//                                         >
//                                             <option value="A">Active</option>
//                                             <option value="I">Inactive</option>
//                                         </select>
//                                     </div>
//                                 ) : (
//                                     // Password Field for Add Mode
//                                     <div className="relative">
//                                         <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
//                                             Password <span className="text-red-500"></span> {tailor.PasswordHash && `(${tailor.PasswordHash.length}/20)`}
//                                         </label>
//                                         <input
//                                             type={showPassword ? "text" : "password"}
//                                             name="PasswordHash"
//                                             value={tailor.PasswordHash}
//                                             onChange={handleChange}
//                                             className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
//                                                 fieldErrors.PasswordHash ? 'border-red-300' : 'border-slate-200'
//                                             }`}
//                                             placeholder="Enter password (minimum 6 characters)"
//                                             required={!isEditing}
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={togglePasswordVisibility}
//                                             className="absolute right-2 sm:right-3 top-9 sm:top-11 text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1"
//                                         >
//                                             {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
//                                         </button>
//                                         {fieldErrors.PasswordHash && (
//                                             <p className="text-red-500 text-xs mt-1">{fieldErrors.PasswordHash}</p>
//                                         )}
//                                     </div>
//                                 )}

//                                 {/* Action Buttons */}
//                                 <div className="flex justify-end gap-2 sm:gap-4 pt-4 sm:pt-6">
//                                     <button
//                                         type="button"
//                                         onClick={() => { setShowModal(false); setFormError(''); setFieldErrors({}); }}
//                                         className="px-4 sm:px-6 py-2 sm:py-3 border border-slate-300 rounded-xl sm:rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
//                                         disabled={adding || updating}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-br from-blue-800 to-blue-900 text-white font-semibold rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
//                                         disabled={adding || updating || Object.values(fieldErrors).some(error => error !== '')}
//                                     >
//                                         {isEditing ? (updating ? 'Updating...' : 'Update Tailor') : (adding ? 'Adding...' : 'Add Tailor')}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Tailors;




import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    FiPlus, 
    FiSearch, 
    FiEdit2, 
    FiX, 
    FiChevronLeft, 
    FiChevronRight, 
    FiEye, 
    FiEyeOff,
    FiUser,
    FiPhone,
    FiMail,
    FiTool,
    FiCheckCircle,
    FiAlertCircle,
    FiUsers
} from 'react-icons/fi';
import { GetAllTailors, AddTailors, UpdateTailorDetails } from '../actions/tailorAction';

const Tailors = () => {
    const dispatch = useDispatch();

    // Redux state selectors
    const { responseBody: tailors = [], loading, msg: fetchError } = useSelector(
        (state) => state.tailorList || {}
    );
    const { responseBody: addedTailor = {}, loading: adding, msg: addError } = useSelector(
        (state) => state.tailorAdd || {}
    );
    const { responseBody: updatedTailor = {}, loading: updating, msg: updateError } = useSelector(
        (state) => state.tailorsUpdate || {}
    );

    // UI state
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [tailor, setTailor] = useState({
        TailorId: null,
        TailorName: '',
        Email: '',
        PasswordHash: '',
        Phone: '',
        Skills: '',
        States: 'A',
    });
    const [formError, setFormError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Track if an actual update was performed
    const [updatePerformed, setUpdatePerformed] = useState(false);
    
    // Mobile responsive state
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    // Handle resize for mobile responsiveness
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch all tailors on component mount
    useEffect(() => {
        dispatch(GetAllTailors());
    }, [dispatch]);

    // FIXED: Handle success notifications only when actual updates are performed
    useEffect(() => {
        // Only show success if an update was actually performed
        if (updatePerformed) {
            // Handle successful addition
            if (Object.keys(addedTailor).length > 0 && !addError && !adding) {
                handleSuccess('added');
            }

            // Handle successful update
            if (Object.keys(updatedTailor).length > 0 && !updateError && !updating) {
                handleSuccess('updated');
            }
        }
    }, [addedTailor, updatedTailor, addError, updateError, adding, updating, updatePerformed]);

    const handleSuccess = (action) => {
        setShowModal(false);
        setTailor({
            TailorId: null,
            TailorName: '',
            Email: '',
            PasswordHash: '',
            Phone: '',
            Skills: '',
            States: 'A',
        });
        dispatch(GetAllTailors());
        setSuccessMsg(`Tailor successfully ${action}!`);
        setTimeout(() => {
            setSuccessMsg('');
            setUpdatePerformed(false); // Reset after showing success
        }, 3000);
        setIsEditing(false);
        setFormError('');
        setFieldErrors({});
    };

    // Filter and sort tailors in descending order
    const filteredTailors = (Array.isArray(tailors) ? [...tailors] : [])
        .filter((t) => {
            if (!search) return true;
            const normalizedSearch = search.toLowerCase();
            return (
                t.Name?.toLowerCase().includes(normalizedSearch) ||
                t.Email?.toLowerCase().includes(normalizedSearch) ||
                String(t.TailorId) === normalizedSearch
            );
        })
        .sort((a, b) => {
            const idA = parseInt(a.TailorId) || 0;
            const idB = parseInt(b.TailorId) || 0;
            return idB - idA; // Descending order
        });

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTailors = filteredTailors.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTailors.length / itemsPerPage);

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

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage === 1) {
                pageNumbers.push(1, 2, 3);
            } else if (currentPage === totalPages) {
                pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }
        
        return pageNumbers;
    };

    // Validation functions
    const validateName = (name) => {
        if (!name.trim()) {
            return 'Name is required';
        }
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters long';
        }
        if (name.trim().length > 50) {
            return 'Name must not exceed 50 characters';
        }
        if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
            return 'Name can only contain letters and spaces';
        }
        return '';
    };

    const validatePhone = (phone) => {
        if (phone && phone.length !== 10) {
            return 'Phone number must be exactly 10 digits';
        }
        if (phone && !/^\d+$/.test(phone)) {
            return 'Phone number can only contain digits';
        }
        return '';
    };

    const validateSkills = (skills) => {
        if (skills && skills.length > 100) {
            return 'Skills must not exceed 100 characters';
        }
        return '';
    };

    const validateEmail = (email) => {
        if (!email.trim()) {
            return ''; // Email is optional
        }
        
        let finalEmail = '';
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        // If user entered full email, use it as is
        if (emailRegex.test(email)) {
            finalEmail = email;
        } else {
            // If user entered only the first part, append @gmail.com
            finalEmail = `${email}@gmail.com`;
        }
        
        // Validate the final email format
        if (!emailRegex.test(finalEmail)) {
            return 'Please enter a valid email address';
        }
        
        // Validate username part
        const username = email.includes('@') ? email.split('@')[0] : email;
        if (username.length > 30) {
            return 'Email username must not exceed 30 characters';
        }
        if (!/^[a-zA-Z0-9._%+-]+$/.test(username)) {
            return 'Email can only contain letters, numbers, and special characters (._%+-)';
        }
        
        return '';
    };

    const validatePassword = (password) => {
        if (!isEditing && !password) {
            return 'Password is required for new tailor';
        }
        if (!isEditing && password && password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        if (!isEditing && password && password.length > 20) {
            return 'Password must not exceed 20 characters';
        }
        return '';
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'TailorName':
                return validateName(value);
            case 'Phone':
                return validatePhone(value);
            case 'Skills':
                return validateSkills(value);
            case 'Email':
                return validateEmail(value);
            case 'PasswordHash':
                return validatePassword(value);
            default:
                return '';
        }
    };

    const openAddModal = () => {
        setIsEditing(false);
        setTailor({
            TailorId: null,
            TailorName: '',
            Email: '',
            PasswordHash: '',
            Phone: '',
            Skills: '',
            States: 'A',
        });
        setFormError('');
        setFieldErrors({});
        setShowPassword(false);
        setShowModal(true);
    };

    const openEditModal = (currentTailor) => {
        setIsEditing(true);
        setTailor({
            TailorId: currentTailor.TailorId,
            TailorName: currentTailor.Name,
            Email: currentTailor.Email ? currentTailor.Email.replace('@gmail.com', '') : '',
            Phone: currentTailor.Phone,
            Skills: currentTailor.Skills,
            PasswordHash: '', // Don't show password in edit mode
            States: currentTailor.States || 'A',
        });
        setFormError('');
        setFieldErrors({});
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let processedValue = value;
        
        // Phone number validation - only allow numbers and limit to 10 digits
        if (name === 'Phone') {
            // Remove all non-digit characters
            const numbersOnly = value.replace(/\D/g, '');
            // Limit to 10 digits
            processedValue = numbersOnly.slice(0, 10);
        }
        
        // Name validation - only allow letters and spaces
        if (name === 'TailorName') {
            // Allow only letters and spaces
            processedValue = value.replace(/[^a-zA-Z\s]/g, '');
        }
        
        // Skills validation - allow letters, numbers, spaces, and common punctuation
        if (name === 'Skills') {
            processedValue = value.slice(0, 100); // Limit to 100 characters
        }
        
        // Email validation - allow only valid email characters
        if (name === 'Email') {
            processedValue = value.slice(0, 30); // Limit username to 30 characters
        }
        
        // Password validation
        if (name === 'PasswordHash' && !isEditing) {
            processedValue = value.slice(0, 20); // Limit to 20 characters
        }

        setTailor((prev) => ({ ...prev, [name]: processedValue }));

        // Validate field in real-time
        const error = validateField(name, processedValue);
        setFieldErrors((prev) => ({
            ...prev,
            [name]: error
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateAllFields = () => {
        const errors = {};
        
        errors.TailorName = validateName(tailor.TailorName);
        errors.Phone = validatePhone(tailor.Phone);
        errors.Skills = validateSkills(tailor.Skills);
        errors.Email = validateEmail(tailor.Email);
        
        if (!isEditing) {
            errors.PasswordHash = validatePassword(tailor.PasswordHash);
        }

        setFieldErrors(errors);
        
        // Check if there are any errors
        return Object.values(errors).every(error => error === '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Validate all fields
        if (!validateAllFields()) {
            setFormError('Please fix the validation errors before submitting.');
            return;
        }

        // Mark that an update is being performed
        setUpdatePerformed(true);

        // Email processing
        let finalEmail = '';
        if (tailor.Email.trim()) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (emailRegex.test(tailor.Email)) {
                finalEmail = tailor.Email;
            } else {
                finalEmail = `${tailor.Email}@gmail.com`;
            }
        }

        try {
            if (isEditing) {
                const updatePayload = {
                    TailorId: tailor.TailorId,
                    TailorName: tailor.TailorName.trim(),
                    Email: finalEmail,
                    Phone: tailor.Phone,
                    Skills: tailor.Skills.trim(),
                    States: tailor.States
                };
                await dispatch(UpdateTailorDetails(updatePayload));
            } else {
                const addPayload = {
                    Name: tailor.TailorName.trim(),
                    Phone: tailor.Phone,
                    Skills: tailor.Skills.trim(),
                    Email: finalEmail,
                    PasswordHash: tailor.PasswordHash,
                    States: 'A'
                };
                await dispatch(AddTailors(addPayload));
            }
            // Success is handled in the useEffect above
        } catch (error) {
            console.error(isEditing ? 'Failed to update tailor:' : 'Failed to add tailor:', error);
            setFormError(
                isEditing ? 'Failed to update tailor. Please try again.' : 'Failed to add tailor. Please try again.'
            );
            setUpdatePerformed(false); // Reset since update failed
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'A':
                return (
                    <span className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 rounded-full text-xs bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50 font-sm">
                        Active
                    </span>
                );
            case 'I':
                return (
                    <span className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 rounded-full text-xs bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50 font-sm">
                        Inactive
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 rounded-full text-xs bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50 font-sm">
                        Unknown
                    </span>
                );
        }
    };

    // Combined error message from various sources
    const combinedError = fetchError?.msg || addError?.msg || updateError?.msg || formError;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
                    <p className="mt-4 text-slate-700 font-medium">Loading tailors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 sm:p-6 relative overflow-hidden">
            {/* 3D Background Elements */}
            <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-blue-800/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-800/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
            
            {/* Success Notification - Green Color - FIXED: Only shows when updatePerformed is true */}
            {successMsg && updatePerformed && (
                <div
                    className="fixed top-4 left-4 right-4 sm:top-6 sm:left-auto sm:right-6 z-50 p-3 sm:p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl shadow-2xl flex items-center animate-slide-in max-w-sm sm:max-w-md mx-auto"
                    role="alert"
                >
                    <div className="bg-white/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 backdrop-blur-sm flex-shrink-0">
                        <FiCheckCircle className="text-white" size={16} />
                    </div>
                    <span className="font-semibold text-xs sm:text-sm truncate">{successMsg}</span>
                </div>
            )}

            {/* Error Notification - Red Color */}
            {combinedError && !showModal && (
                <div
                    className="fixed top-4 left-4 right-4 sm:top-6 sm:left-auto sm:right-6 z-50 p-3 sm:p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl shadow-2xl flex items-center animate-slide-in max-w-sm sm:max-w-md mx-auto"
                    role="alert"
                >
                    <div className="bg-white/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 backdrop-blur-sm flex-shrink-0">
                        <FiAlertCircle className="text-white" size={16} />
                    </div>
                    <span className="font-semibold text-xs sm:text-sm truncate">{combinedError}</span>
                </div>
            )}

            <div className="relative z-10 max-w-9xl mx-auto">
                {/* Header Section with 3D Effect - Mobile Optimized */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
                        <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-2xl transform ">
                            <FiUsers className="text-white text-lg sm:text-xl" />
                        </div>
                        <div className="transform ">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                Tailor Management
                            </h1>
                            <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage your tailor profiles and information</p>
                        </div>
                    </div>
                </div>

                {/* 3D Stats Cards - Mobile Optimized */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-600 text-xs sm:text-sm font-medium">Total Tailors</p>
                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
                                        {filteredTailors.length}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-lg">
                                    <FiUsers className="text-white text-base sm:text-lg" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-600 text-xs sm:text-sm font-medium">Active</p>
                                   <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
                                        {filteredTailors.filter(t => t.States === 'A').length}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
                                    <FiCheckCircle className="text-white text-base sm:text-lg" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative sm:col-span-2 lg:col-span-1">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-600 text-xs sm:text-sm font-medium">Inactive</p>
                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
                                        {filteredTailors.filter(t => t.States === 'I').length}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-lg">
                                    <FiAlertCircle className="text-white text-base sm:text-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Action Bar - 3D Design - Mobile Optimized */}
                <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="relative flex-grow group">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
                        <div className="relative flex items-center">
                            <FiSearch className="absolute left-3 sm:left-4 text-slate-400 z-10" size={18} />
                            <input
                                type="text"
                                placeholder="Search tailors by name, email, or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="relative w-full pl-10 sm:pl-12 pr-3 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="relative group bg-gradient-to-br from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl sm:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 whitespace-nowrap min-w-[120px] sm:min-w-auto"
                    >
                        <div className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
                        <FiPlus className="mr-2 sm:mr-3 relative z-10" size={18} />
                        <span className="relative z-10 text-sm sm:text-base">Add Tailor</span>
                    </button>
                </div>

                {/* Desktop Table */}
                {!isMobile && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 overflow-hidden mb-4 sm:mb-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
                                        <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Tailor ID</th>
                                        <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Name</th>
                                        <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Phone</th>
                                        <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Skills</th>
                                        {/* FIXED: Email column with proper width and no truncation */}
                                        <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider min-w-[200px] w-1/3">Email</th>
                                        <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-left text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Status</th>
                                        <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/50">
                                    {currentTailors.length > 0 ? (
                                        currentTailors.map((t) => (
                                            <tr key={t.TailorId} className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 group">
                                               <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base">{t.TailorId}</td>
                                               <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base">
                                                    {t.Name}
                                                </td>
                                               <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base">{t.Phone || 'N/A'}</td>
                                               <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base">{t.Skills || 'Not specified'}</td>
                                                {/* FIXED: Email cell with proper styling to show full email */}
                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base break-all min-w-[200px] max-w-[300px]">
                                                    {t.Email || 'N/A'}
                                                </td>
                                               <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base">{getStatusBadge(t.States)}</td>
                                                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
                                                    <button
                                                        onClick={() => openEditModal(t)}
                                                        className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
                                                        title="Edit Tailor"
                                                    >
                                                        <FiEdit2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-8 sm:py-12">
                                                <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                                                    <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl sm:rounded-2xl shadow-inner">
                                                        <FiUsers className="text-slate-500 text-lg sm:text-xl" />
                                                    </div>
                                                    <p className="text-slate-500 font-medium text-sm sm:text-base">No tailors found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* 3D Pagination */}
                        {filteredTailors.length > itemsPerPage && (
                            <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
                                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                                    Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredTailors.length)} of{' '}
                                    {filteredTailors.length}
                                </div>
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                                    >
                                        <FiChevronLeft size={14} />
                                    </button>

                                    {getPageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
                                                currentPage === page
                                                    ? 'bg-gradient-to-br from-blue-800 to-blue-900 text-white shadow-2xl scale-105 border-transparent'
                                                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
                    <div className="space-y-3 mb-4">
                        {currentTailors.length > 0 ? (
                            currentTailors.map((t) => (
                                <div 
                                    key={t.TailorId} 
                                    className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-3 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-slate-800 text-sm font-medium mb-1 truncate">
                                                {t.Name}
                                            </h3>
                                            <div className="space-y-1 text-xs text-slate-600">
                                                <div className="flex items-center">
                                                    <span className="font-medium mr-2">ID:</span>
                                                    <span>{t.TailorId}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-medium mr-2">Phone:</span>
                                                    <span className="truncate">{t.Phone || 'N/A'}</span>
                                                </div>
                                                {/* FIXED: Mobile email display with proper break-all */}
                                                <div className="flex items-start">
                                                    <span className="font-medium mr-2 mt-0.5 flex-shrink-0">Email:</span>
                                                    <span className="break-all flex-1">{t.Email || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-medium mr-2">Skills:</span>
                                                    <span className="truncate">{t.Skills || 'Not specified'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end space-y-2 ml-2">
                                            {getStatusBadge(t.States)}
                                            <button
                                                onClick={() => openEditModal(t)}
                                                className="p-2 bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                                                title="Edit Tailor"
                                            >
                                                <FiEdit2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20">
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="p-3 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-inner">
                                        <FiUsers className="text-slate-500 text-lg" />
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm">
                                        {search ? 'No matching tailors found' : 'No tailors available'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Mobile Pagination */}
                        {filteredTailors.length > itemsPerPage && (
                            <div className="flex flex-col sm:flex-row items-center justify-between px-3 py-3 bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-xl shadow-xl border border-white/20 space-y-2 sm:space-y-0">
                                <div className="text-xs text-slate-600 font-medium">
                                    Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredTailors.length)} of{' '}
                                    {filteredTailors.length}
                                </div>
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-1.5 rounded-lg border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40"
                                    >
                                        <FiChevronLeft size={12} />
                                    </button>

                                    {getPageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-2 py-1 rounded-lg border font-medium transition-all duration-300 transform hover:scale-105 text-xs min-w-[32px] ${
                                                currentPage === page
                                                    ? 'bg-gradient-to-br from-blue-800 to-blue-900 text-white shadow-xl scale-105 border-transparent'
                                                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
            </div>

            {/* 3D Modal - Mobile Optimized */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="relative w-full max-w-md sm:max-w-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl sm:rounded-3xl blur opacity-20 transform "></div>
                        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl shadow-lg">
                                        <FiUser className="text-white text-base sm:text-lg" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                        {isEditing ? 'Edit Tailor' : 'Add New Tailor'}
                                    </h2>
                                </div>
                                <button 
                                    onClick={() => { setShowModal(false); setFormError(''); setFieldErrors({}); }}
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

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                {/* Name Field - Full Width */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                                        Name <span className="text-red-500"></span>
                                    </label>
                                    <input
                                        type="text"
                                        name="TailorName"
                                        value={tailor.TailorName}
                                        onChange={handleChange}
                                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
                                            fieldErrors.TailorName ? 'border-red-300' : 'border-slate-200'
                                        }`}
                                        placeholder="Tailor's full name "
                                        required
                                    />
                                    {fieldErrors.TailorName && (
                                        <p className="text-red-500 text-xs mt-1">{fieldErrors.TailorName}</p>
                                    )}
                                </div>

                                {/* Phone Field - Full Width */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                                        Phone {tailor.Phone && `(${tailor.Phone.length}/10)`}
                                    </label>
                                    <input
                                        type="tel"
                                        name="Phone"
                                        value={tailor.Phone}
                                        onChange={handleChange}
                                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
                                            fieldErrors.Phone ? 'border-red-300' : 'border-slate-200'
                                        }`}
                                        placeholder="Enter 10-digit phone number "
                                        maxLength={10}
                                    />
                                    {fieldErrors.Phone && (
                                        <p className="text-red-500 text-xs mt-1">{fieldErrors.Phone}</p>
                                    )}
                                </div>

                                {/* Skills Field - Full Width */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                                        Skills {tailor.Skills}
                                    </label>
                                    <input
                                        type="text"
                                        name="Skills"
                                        value={tailor.Skills}
                                        onChange={handleChange}
                                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
                                            fieldErrors.Skills ? 'border-red-300' : 'border-slate-200'
                                        }`}
                                        placeholder="e.g., Alterations, Custom Fitting, Embroidery"
                                    />
                                    {fieldErrors.Skills && (
                                        <p className="text-red-500 text-xs mt-1">{fieldErrors.Skills}</p>
                                    )}
                                </div>

                                {/* Email Field - Full Width */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                                        Email (Optional) 
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="Email"
                                            value={tailor.Email}
                                            onChange={handleChange}
                                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base pr-20 ${
                                                fieldErrors.Email ? 'border-red-300' : 'border-slate-200'
                                            }`}
                                            placeholder="username"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-slate-500 text-sm">@gmail.com</span>
                                        </div>
                                    </div>
                                    {fieldErrors.Email && (
                                        <p className="text-red-500 text-xs mt-1">{fieldErrors.Email}</p>
                                    )}
                                    <p className="text-xs text-slate-500 mt-1">
                                        Enter only the username part. @gmail.com will be added automatically.
                                    </p>
                                </div>

                                {/* Conditional Fields - Full Width */}
                                {isEditing ? (
                                    // Status Field for Edit Mode
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">Status</label>
                                        <select
                                            name="States"
                                            value={tailor.States}
                                            onChange={handleChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base"
                                            required
                                        >
                                            <option value="A">Active</option>
                                            <option value="I">Inactive</option>
                                        </select>
                                    </div>
                                ) : (
                                    // Password Field for Add Mode
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                                            Password <span className="text-red-500"></span> {tailor.PasswordHash && `(${tailor.PasswordHash.length}/20)`}
                                        </label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="PasswordHash"
                                            value={tailor.PasswordHash}
                                            onChange={handleChange}
                                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
                                                fieldErrors.PasswordHash ? 'border-red-300' : 'border-slate-200'
                                            }`}
                                            placeholder="Enter password (minimum 6 characters)"
                                            required={!isEditing}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-2 sm:right-3 top-9 sm:top-11 text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1"
                                        >
                                            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                        </button>
                                        {fieldErrors.PasswordHash && (
                                            <p className="text-red-500 text-xs mt-1">{fieldErrors.PasswordHash}</p>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2 sm:gap-4 pt-4 sm:pt-6">
                                    <button
                                        type="button"
                                        onClick={() => { setShowModal(false); setFormError(''); setFieldErrors({}); }}
                                        className="px-4 sm:px-6 py-2 sm:py-3 border border-slate-300 rounded-xl sm:rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                                        disabled={adding || updating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-br from-blue-800 to-blue-900 text-white font-semibold rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
                                        disabled={adding || updating || Object.values(fieldErrors).some(error => error !== '')}
                                    >
                                        {isEditing ? (updating ? 'Updating...' : 'Update Tailor') : (adding ? 'Adding...' : 'Add Tailor')}
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

export default Tailors;