// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   FiSearch, 
//   FiUserPlus, 
//   FiX, 
//   FiEdit2, 
//   FiCheckCircle, 
//   FiAlertCircle, 
//   FiChevronLeft, 
//   FiChevronRight,
//   FiUsers,
//   FiUser,
//   FiPhone,
//   FiMail,
//   FiMapPin,
//   FiChevronDown,
//   FiChevronUp
// } from 'react-icons/fi';
// import { 
//   GetAllCustomers,
//   GetCustomerByID,
//   AddCustomer,
//   UpdateCustomerDetails,
//   SearchCustomersByEmail 
// } from '../actions/customerActions';

// const Customers = () => {
//   const dispatch = useDispatch();

//   // Redux store data
//   const { loading: loadingAll, responseBody: customers, msg: errorAll } = useSelector(state => state.customerList);
//   const { loading: loadingSingle, responseBody: currentCustomer, msg: errorSingle } = useSelector(state => state.customerDetails);
//   const { loading: adding, msg: addError } = useSelector(state => state.customerAdd || {});
//   const { loading: updating, msg: updateError } = useSelector(state => state.customersUpdate || {});

//   const { loading: searching, responseBody: searchResults, msg: searchError } = useSelector(state => state.customerSearch);

//   // UI states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     FullName: '',
//     Email: '',
//     PhoneNumber: '',
//     Address: '',
//     States: 'A' 
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentCustomerId, setCurrentCustomerId] = useState(null);
//   const [notification, setNotification] = useState(null);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // Validation state
//   const [errors, setErrors] = useState({});

//   // Mobile responsive state
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);

//   // Loading & error handling
//   const isLoading = loadingAll || loadingSingle || adding || searching || updating;
//   const combinedError = errorAll || errorSingle || addError || searchError || updateError;

//   // Handle resize for mobile responsiveness
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       setIsSmallMobile(window.innerWidth < 480);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Check for duplicate customers
//   const checkForDuplicateCustomer = (customerData) => {
//     if (!Array.isArray(customers)) return false;
    
//     const existingCustomer = customers.find(customer => {
//       // Check by phone number (exact match)
//       const phoneMatch = customer.PhoneNumber === customerData.PhoneNumber;
      
//       // Check by email if provided (exact match, case insensitive)
//       const emailMatch = customerData.Email && 
//                         customer.Email && 
//                         customer.Email.toLowerCase() === customerData.Email.toLowerCase();
      
//       return phoneMatch || emailMatch;
//     });
    
//     return existingCustomer;
//   };

//   // Sort customers and handle search by ID, Email, OR Name
//   const getSortedDisplayData = () => {
//     let data = [];
    
//     if (searchTerm.trim() === '') {
//       data = Array.isArray(customers) ? [...customers] : [];
//     } else if (!isNaN(searchTerm)) {
//       // Search by ID - check both currentCustomer and filter from all customers
//       const idSearchResults = [];
//       if (currentCustomer && currentCustomer.CustomerId?.toString().includes(searchTerm)) {
//         idSearchResults.push(currentCustomer);
//       }
//       // Also search in all customers by ID
//       const filteredById = Array.isArray(customers) 
//         ? customers.filter(customer => 
//             customer.CustomerId?.toString().includes(searchTerm)
//           )
//         : [];
      
//       data = [...idSearchResults, ...filteredById];
//     } else {
//       // Search by Email OR Name in all customers
//       data = Array.isArray(customers) 
//         ? customers.filter(customer => 
//             customer.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             customer.FullName?.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//         : [];
//     }
    
//     // Remove duplicates and sort
//     const uniqueData = data.filter((customer, index, self) => 
//       index === self.findIndex(c => c.CustomerId === customer.CustomerId)
//     );
    
//     // Sort by CustomerId in descending order (newest first)
//     return uniqueData.sort((a, b) => {
//       const idA = parseInt(a.CustomerId) || 0;
//       const idB = parseInt(b.CustomerId) || 0;
//       return idB - idA; // Descending order
//     });
//   };

//   const displayData = getSortedDisplayData();

//   // Calculate stats for cards
//   const totalCustomers = displayData.length;
//   const activeCustomers = displayData.filter(c => c.States === 'A').length;
//   const inactiveCustomers = displayData.filter(c => c.States === 'I').length;

//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentCustomers = displayData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(displayData.length / itemsPerPage);

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

//   // Reset to first page when search changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, displayData.length]);

//   // Fetch all customers on mount
//   useEffect(() => {
//     dispatch(GetAllCustomers());
//   }, [dispatch]);

//   // Auto-hide notifications
//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => setNotification(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   // Populate form when editing
//   useEffect(() => {
//     if (currentCustomer && isEditing) {
//       setFormData({
//         FullName: currentCustomer.FullName || '',
//         Email: currentCustomer.Email || '',
//         PhoneNumber: currentCustomer.PhoneNumber || '',
//         Address: currentCustomer.Address || '',
//         States: currentCustomer.States || 'A'
//       });
//     }
//   }, [currentCustomer, isEditing]);

//   // Search handler
//   const handleSearch = () => {
//     if (searchTerm.trim() === '') {
//       dispatch(GetAllCustomers());
//     } else if (!isNaN(searchTerm)) {
//       dispatch(GetCustomerByID(searchTerm));
//     } else {
//       dispatch(SearchCustomersByEmail(searchTerm));
//     }
//   };

//   // Input change handler
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Validation function - UPDATED: Email is optional even when editing
//   const validateForm = () => {
//     let tempErrors = {};
    
//     // Always validate these fields
//     if (!formData.FullName || formData.FullName.length < 3) {
//       tempErrors.FullName = 'Full name is required (min 3 characters).';
//     }
//     if (!formData.PhoneNumber || !/^[0-9]{10}$/.test(formData.PhoneNumber)) {
//       tempErrors.PhoneNumber = 'Phone number must be exactly 10 digits.';
//     }
    
//     // Only validate email format if provided (not required)
//     if (formData.Email && !/\S+@\S+\.\S+/.test(formData.Email)) {
//       tempErrors.Email = 'Please enter a valid email address.';
//     }
    
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   // ✅ UPDATED SUBMIT HANDLER with duplicate check
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setNotification(null);

//     if (!validateForm()) {
//       setNotification({ type: 'error', message: 'Please fix the errors before submitting.' });
//       return;
//     }

//     try {
//       // Check for duplicate customer (only for new customers, not when editing)
//       if (!isEditing) {
//         const duplicateCustomer = checkForDuplicateCustomer(formData);
//         if (duplicateCustomer) {
//           setNotification({ 
//             type: 'error', 
//             message: `Customer already exists! A customer with this phone number or email already exists (ID: ${duplicateCustomer.CustomerId}).` 
//           });
//           return;
//         }
//       }

//       let result;
//       if (isEditing) {
//         // Include ALL customer data for update
//         const customerData = { 
//           ...formData, 
//           CustomerId: currentCustomerId 
//         };
        
//         result = await dispatch(UpdateCustomerDetails(customerData));
//       } else {
//         // For new customers, set default status to Active and only send required fields
//         const newCustomerData = {
//           FullName: formData.FullName,
//           PhoneNumber: formData.PhoneNumber,
//           Email: formData.Email || '', // Optional for new customers
//           Address: formData.Address || '', // Optional for new customers
//           States: 'A' // Always set to Active for new customers
//         };
//         result = await dispatch(AddCustomer(newCustomerData));
//       }

//       // Check if result exists and has type property
//       if (result && result.type && result.type.endsWith('SUCCESS')) {
//         setNotification({ 
//           type: 'success', 
//           message: `Customer successfully ${isEditing ? 'updated' : 'added'}.` 
//         });
//         setShowModal(false);
//         resetForm();
//         dispatch(GetAllCustomers()); // Refresh the list
//       } else {
//         const errorMsg = result?.payload?.msg || result?.msg || 'An error occurred during submission.';
//         setNotification({ type: 'error', message: errorMsg });
//       }
//     } catch (error) {
//       console.error('Submit error:', error);
//       setNotification({ type: 'error', message: 'An unexpected error occurred.' });
//     }
//   };

//   // Edit handler
//   const handleEdit = (customerId) => {
//     setCurrentCustomerId(customerId);
//     setIsEditing(true);
//     setShowModal(true);
//     dispatch(GetCustomerByID(customerId));
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       FullName: '',
//       Email: '',
//       PhoneNumber: '',
//       Address: '',
//       States: 'A' // Default to Active
//     });
//     setErrors({});
//     setIsEditing(false);
//     setCurrentCustomerId(null);
//   };

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

//   // Generate page numbers for pagination - Mobile responsive
//   const getPageNumbers = () => {
//     if (totalPages <= (isMobile ? 2 : 3)) {
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }
    
//     let startPage = Math.max(1, currentPage - (isMobile ? 0 : 1));
//     let endPage = Math.min(totalPages, currentPage + (isMobile ? 1 : 1));
    
//     // Adjust if we're at the beginning
//     if (currentPage === 1) {
//       endPage = isMobile ? 2 : 3;
//     }
//     // Adjust if we're at the end
//     if (currentPage === totalPages) {
//       startPage = totalPages - (isMobile ? 1 : 2);
//     }
    
//     return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
//   };

// return (
//   <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-3 sm:p-4 md:p-6 relative overflow-hidden">
//     {/* 3D Background Elements */}
//     <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//     <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
    
//     {/* 3D Notification - Mobile Responsive - MOVED OUTSIDE MODAL with higher z-index */}
//     {notification && (
//       <div
//         className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-6 z-[60] p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center animate-slide-in ${
//           notification.type === 'success' 
//             ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200/50 border-l-4 border-l-green-400' 
//             : 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200/50 border-l-4 border-l-rose-400'
//         }`}
//         role="alert"
//       >
//         <div className="bg-white/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 backdrop-blur-sm">
//           {notification.type === 'success' ? <FiCheckCircle size={isMobile ? 16 : 18} /> : <FiAlertCircle size={isMobile ? 16 : 18} />}
//         </div>
//         <span className="font-semibold text-xs sm:text-sm flex-1">{notification.message}</span>
//       </div>
//     )}

//       {/* Header Section with 3D Effect - Mobile Responsive */}
//       <div className="relative z-10 mb-4 sm:mb-6 md:mb-8">
//         <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3">
//           <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
//             <FiUsers className="text-white text-base sm:text-lg md:text-xl" />
//           </div>
//           <div className="transform  flex-1 min-w-0">
//             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
//               Customer Management
//             </h1>
//             <p className="text-slate-600 mt-0.5 text-xs sm:text-sm md:text-base truncate">
//               Manage your customer profiles and information
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards - Mobile Responsive */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 relative z-10">
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Total Customers</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {totalCustomers}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
//                 <FiUsers className="text-white text-sm sm:text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Active</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {activeCustomers}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
//                 <FiUser className="text-white text-sm sm:text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Inactive</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {inactiveCustomers}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
//                 <FiUser className="text-white text-sm sm:text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search + Add button - Mobile Responsive */}
//       <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
//         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
//           <div className="relative flex-grow group">
//             <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//             <input
//               type="text"
//               placeholder="Search by ID, Name, or Email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//               className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
//               disabled={isLoading}
//             />
//             <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={isMobile ? 18 : 20} />
//           </div>
//           <button
//             onClick={() => { resetForm(); setShowModal(true); }}
//             className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 w-full sm:w-auto"
//             disabled={isLoading}
//           >
//             <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//             <FiUserPlus className="mr-2 sm:mr-3 relative z-10" size={isMobile ? 18 : 20} />
//             <span className="relative z-10 text-sm sm:text-base">Add Customer</span>
//           </button>
//         </div>
//       </div>

//       {/* 3D Table - FIXED Mobile Responsive Layout */}
//       {isLoading ? (
//         <div className="relative z-10 text-center py-8 sm:py-12">
//           <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl border border-white/20">
//             <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-800"></div>
//             <span className="text-slate-700 font-medium text-sm sm:text-base">Loading customers...</span>
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Desktop Table */}
//           {!isMobile && (
//             <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                       <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">ID</th>
//                       <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">Name</th>
//                       <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">Email</th>
//                       <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">Phone</th>
//                       <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">Address</th>
//                       <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">Status</th>
//                       <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-200/50">
//                     {currentCustomers.length > 0 ? (
//                       currentCustomers.map(customer => (
//                         <tr key={customer.CustomerId} className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group">
//                           <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-m">
//                             {customer.CustomerId}
//                           </td>
//                           <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                             {customer.FullName}
//                           </td>
//                           <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                             {customer.Email}
//                           </td>
//                           <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                             {customer.PhoneNumber}
//                           </td>
//                           <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate" title={customer.Address}>
//                             {customer.Address}
//                           </td>
//                           <td className="px-3 sm:px-4 md:px-6 py-3 text-center sm:py-4">
//                             {getStatusBadge(customer.States)}
//                           </td>
//                           <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
//                             <button
//                               onClick={() => handleEdit(customer.CustomerId)}
//                               className="inline-flex items-center justify-center p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
//                               title="Edit Customer"
//                               disabled={isLoading}
//                             >
//                               <FiEdit2 size={14} />
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={7} className="text-center py-8 sm:py-12">
//                           <div className="flex flex-col items-center space-y-2 sm:space-y-3">
//                             <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                               <FiUsers className="text-slate-500 text-lg sm:text-xl" />
//                             </div>
//                             <p className="text-slate-500 font-medium text-sm sm:text-base">
//                               {searchTerm ? 'No matching customers found' : 'No customers available'}
//                             </p>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Mobile Cards Layout */}
//           {isMobile && (
//             <div className="relative z-10 space-y-3 mb-4 sm:mb-6">
//               {currentCustomers.length > 0 ? (
//                 currentCustomers.map(customer => (
//                   <div 
//                     key={customer.CustomerId} 
//                     className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-4 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
//                   >
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex-1 min-w-0">
//                         <h3 className="text-slate-800 font-medium text-base truncate">
//                           {customer.FullName}
//                         </h3>
//                         <div className="mt-1 space-y-1 text-xs text-slate-600">
//                           {customer.Email && (
//                             <div className="flex items-center">
//                               <FiMail className="mr-2 flex-shrink-0" size={12} />
//                               <span className="truncate">{customer.Email}</span>
//                             </div>
//                           )}
//                           <div className="flex items-center">
//                             <FiPhone className="mr-2 flex-shrink-0" size={12} />
//                             <span>{customer.PhoneNumber}</span>
//                           </div>
//                           {customer.Address && (
//                             <div className="flex items-start">
//                               <FiMapPin className="mr-2 mt-0.5 flex-shrink-0" size={12} />
//                               <span className="truncate flex-1">{customer.Address}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2 ml-3">
//                         {getStatusBadge(customer.States)}
//                         <button
//                           onClick={() => handleEdit(customer.CustomerId)}
//                           className="inline-flex items-center justify-center p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                           title="Edit Customer"
//                           disabled={isLoading}
//                         >
//                           <FiEdit2 size={14} />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-2 mt-2">
//                       <span>ID: {customer.CustomerId}</span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
//                   <div className="flex flex-col items-center space-y-3">
//                     <div className="p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                       <FiUsers className="text-slate-500 text-xl" />
//                     </div>
//                     <p className="text-slate-500 font-medium">
//                       {searchTerm ? 'No matching customers found' : 'No customers available'}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* 3D Pagination - Mobile Responsive */}
//           {displayData.length > itemsPerPage && (
//             <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 space-y-3 sm:space-y-0">
//               <div className="text-xs sm:text-sm text-slate-600 font-medium">
//                 Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, displayData.length)} of{' '}
//                 {displayData.length}
//               </div>
//               <div className="flex items-center space-x-1 sm:space-x-2">
//                 <button
//                   onClick={goToPrevPage}
//                   disabled={currentPage === 1}
//                   className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                 >
//                   <FiChevronLeft size={isSmallMobile ? 12 : 14} />
//                 </button>

//                 {getPageNumbers().map((pageNumber) => (
//                   <button
//                     key={pageNumber}
//                     onClick={() => goToPage(pageNumber)}
//                     className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm min-w-[32px] sm:min-w-[36px] ${
//                       pageNumber === currentPage
//                         ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
//                         : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                     }`}
//                   >
//                     {pageNumber}
//                   </button>
//                 ))}

//                 <button
//                   onClick={goToNextPage}
//                   disabled={currentPage === totalPages}
//                   className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                 >
//                   <FiChevronRight size={isSmallMobile ? 12 : 14} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* 3D Modal - Mobile Responsive */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
//           <div className="relative w-full max-w-md sm:max-w-lg max-h-[90vh] ">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl sm:rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-4 md:p-6">
//               <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
//                 <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
//                   <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
//                     <FiUserPlus className="text-white text-sm sm:text-base md:text-lg" />
//                   </div>
//                   <h2 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
//                     {isEditing ? 'Edit Customer' : 'Add New Customer'}
//                   </h2>
//                 </div>
//                 <button 
//                   onClick={() => { setShowModal(false); resetForm(); }} 
//                   className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-100/50 transition-colors duration-200 flex-shrink-0 ml-2"
//                 >
//                   <FiX size={isSmallMobile ? 18 : 20} />
//                 </button>
//               </div>

//               {/* {combinedError && (
//                 <div className="mb-3 sm:mb-4 md:mb-6 p-2.5 sm:p-3 md:p-4 text-red-700 bg-gradient-to-r from-red-50 to-red-100 rounded-xl sm:rounded-2xl border border-red-200 shadow-inner text-xs sm:text-sm">
//                   {combinedError}
//                 </div>
//               )} */}

//               <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Full Name </label>
//                   <input
//                     type="text"
//                     name="FullName"
//                     value={formData.FullName}
//                     onChange={handleInputChange}
//                     className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
//                       errors.FullName ? 'border-red-500' : 'border-slate-200'
//                     }`}
//                     required
//                     disabled={adding || updating}
//                   />
//                   {errors.FullName && <p className="text-red-500 text-xs mt-1.5 sm:mt-2">{errors.FullName}</p>}
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Phone </label>
//                   <input
//                     type="tel"
//                     name="PhoneNumber"
//                     value={formData.PhoneNumber}
//                     onChange={handleInputChange}
//                     className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
//                       errors.PhoneNumber ? 'border-red-500' : 'border-slate-200'
//                     }`}
//                     required
//                     disabled={adding || updating}
//                   />
//                   {errors.PhoneNumber && <p className="text-red-500 text-xs mt-1.5 sm:mt-2">{errors.PhoneNumber}</p>}
//                 </div>

//                 {/* Email - Optional for both new and editing customers */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
//                     Email (Optional)
//                   </label>
//                   <input
//                     type="email"
//                     name="Email"
//                     value={formData.Email}
//                     onChange={handleInputChange}
//                     className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
//                       errors.Email ? 'border-red-500' : 'border-slate-200'
//                     }`}
//                     disabled={adding || updating}
//                   />
//                   {errors.Email && <p className="text-red-500 text-xs mt-1.5 sm:mt-2">{errors.Email}</p>}
//                 </div>

//                 {/* Address - Optional */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
//                     Address (Optional)
//                   </label>
//                   <textarea
//                     name="Address"
//                     value={formData.Address}
//                     onChange={handleInputChange}
//                     rows="2"
//                     className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
//                       errors.Address ? 'border-red-500' : 'border-slate-200'
//                     }`}
//                     disabled={adding || updating}
//                   ></textarea>
//                   {errors.Address && <p className="text-red-500 text-xs mt-1.5 sm:mt-2">{errors.Address}</p>}
//                 </div>

//                 {/* Status - Only show when editing */}
//                 {isEditing && (
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Status </label>
//                     <select
//                       name="States"
//                       value={formData.States}
//                       onChange={handleInputChange}
//                       className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
//                         errors.States ? 'border-red-500' : 'border-slate-200'
//                       }`}
//                       required
//                       disabled={adding || updating}
//                     >
//                       <option value="A">Active</option>
//                       <option value="I">Inactive</option>
//                     </select>
//                     {errors.States && <p className="text-red-500 text-xs mt-1.5 sm:mt-2">{errors.States}</p>}
//                   </div>
//                 )}

//                 {/* Actions */}
//                 <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4 md:pt-6">
//                   <button 
//                     type="button" 
//                     onClick={() => { setShowModal(false); resetForm(); }}
//                     className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-slate-300 rounded-xl sm:rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base order-2 sm:order-1" 
//                     disabled={adding || updating}
//                   >
//                     Cancel
//                   </button>
//                   <button 
//                     type="submit"
//                     className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base order-1 sm:order-2" 
//                     disabled={adding || updating}
//                   >
//                     {adding || updating ? 'Processing...' : isEditing ? 'Update Customer' : 'Add Customer'}
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

// export default Customers;


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiSearch, 
  FiUserPlus, 
  FiX, 
  FiEdit2, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiChevronLeft, 
  FiChevronRight,
  FiUsers,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { 
  GetAllCustomers,
  GetCustomerByID,
  AddCustomer,
  UpdateCustomerDetails,
  SearchCustomersByEmail 
} from '../actions/customerActions';

const Customers = () => {
  const dispatch = useDispatch();

  // Redux store data
  const { loading: loadingAll, responseBody: customers, msg: errorAll } = useSelector(state => state.customerList);
  const { loading: loadingSingle, responseBody: currentCustomer, msg: errorSingle } = useSelector(state => state.customerDetails);
  const { loading: adding, msg: addError } = useSelector(state => state.customerAdd || {});
  const { loading: updating, msg: updateError } = useSelector(state => state.customersUpdate || {});

  const { loading: searching, responseBody: searchResults, msg: searchError } = useSelector(state => state.customerSearch);

  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    PhoneNumber: '',
    Address: '',
    States: 'A' 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Validation state
  const [errors, setErrors] = useState({});

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);

  // Loading & error handling
  const isLoading = loadingAll || loadingSingle || adding || searching || updating;
  const combinedError = errorAll || errorSingle || addError || searchError || updateError;

  // Handle resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check for duplicate customers
  const checkForDuplicateCustomer = (customerData) => {
    if (!Array.isArray(customers)) return false;
    
    const existingCustomer = customers.find(customer => {
      // Check by phone number (exact match)
      const phoneMatch = customer.PhoneNumber === customerData.PhoneNumber;
      
      // Check by email if provided (exact match, case insensitive)
      const emailMatch = customerData.Email && 
                        customer.Email && 
                        customer.Email.toLowerCase() === customerData.Email.toLowerCase();
      
      return phoneMatch || emailMatch;
    });
    
    return existingCustomer;
  };

  // Helper function to display field values with "Not Provided" for empty values
  const displayFieldValue = (value) => {
    return value && value.trim() !== '' ? value : 'Not Provided';
  };

  // Sort customers and handle search by ID, Email, OR Name
  const getSortedDisplayData = () => {
    let data = [];
    
    if (searchTerm.trim() === '') {
      data = Array.isArray(customers) ? [...customers] : [];
    } else if (!isNaN(searchTerm)) {
      // Search by ID - check both currentCustomer and filter from all customers
      const idSearchResults = [];
      if (currentCustomer && currentCustomer.CustomerId?.toString().includes(searchTerm)) {
        idSearchResults.push(currentCustomer);
      }
      // Also search in all customers by ID
      const filteredById = Array.isArray(customers) 
        ? customers.filter(customer => 
            customer.CustomerId?.toString().includes(searchTerm)
          )
        : [];
      
      data = [...idSearchResults, ...filteredById];
    } else {
      // Search by Email OR Name in all customers
      data = Array.isArray(customers) 
        ? customers.filter(customer => 
            customer.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.FullName?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];
    }
    
    // Remove duplicates and sort
    const uniqueData = data.filter((customer, index, self) => 
      index === self.findIndex(c => c.CustomerId === customer.CustomerId)
    );
    
    // Sort by CustomerId in descending order (newest first)
    return uniqueData.sort((a, b) => {
      const idA = parseInt(a.CustomerId) || 0;
      const idB = parseInt(b.CustomerId) || 0;
      return idB - idA; // Descending order
    });
  };

  const displayData = getSortedDisplayData();

  // Calculate stats for cards
  const totalCustomers = displayData.length;
  const activeCustomers = displayData.filter(c => c.States === 'A').length;
  const inactiveCustomers = displayData.filter(c => c.States === 'I').length;

  // Pagination calculations - FIXED: Use actual CustomerIds for range display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = displayData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayData.length / itemsPerPage);

  // ✅ FIXED: Get actual CustomerId ranges for pagination summary
  const getPaginationRange = () => {
    if (currentCustomers.length === 0) {
      return { startId: 0, endId: 0 };
    }
    
    // Since displayData is sorted in descending order, the first item on current page has highest ID
    const startId = currentCustomers[0]?.CustomerId || 0;
    // Last item on current page has lowest ID
    const endId = currentCustomers[currentCustomers.length - 1]?.CustomerId || 0;
    
    return { startId, endId };
  };

  const { startId, endId } = getPaginationRange();

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
  }, [searchTerm, displayData.length]);

  // Fetch all customers on mount
  useEffect(() => {
    dispatch(GetAllCustomers());
  }, [dispatch]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Populate form when editing
  useEffect(() => {
    if (currentCustomer && isEditing) {
      setFormData({
        FullName: currentCustomer.FullName || '',
        Email: currentCustomer.Email || '',
        PhoneNumber: currentCustomer.PhoneNumber || '',
        Address: currentCustomer.Address || '',
        States: currentCustomer.States || 'A'
      });
    }
  }, [currentCustomer, isEditing]);

  // Search handler
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      dispatch(GetAllCustomers());
    } else if (!isNaN(searchTerm)) {
      dispatch(GetCustomerByID(searchTerm));
    } else {
      dispatch(SearchCustomersByEmail(searchTerm));
    }
  };

  // Phone input handler to prevent non-numeric input
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    
    // Only allow numbers and limit to 10 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    
    // Update form data
    setFormData(prev => ({ 
      ...prev, 
      PhoneNumber: numericValue 
    }));
    
    // Clear error when user starts typing
    if (errors.PhoneNumber) {
      setErrors(prev => ({ ...prev, PhoneNumber: '' }));
    }
  };

  // Name input handler
  const handleNameChange = (e) => {
    const value = e.target.value;
    
    // Allow letters, spaces, and common name characters
    const cleanValue = value.replace(/[^a-zA-Z\s\-'.]/g, '');
    
    setFormData(prev => ({ 
      ...prev, 
      FullName: cleanValue 
    }));
    
    if (errors.FullName) {
      setErrors(prev => ({ ...prev, FullName: '' }));
    }
  };

  // Address input handler
  const handleAddressChange = (e) => {
    const value = e.target.value;
    
    setFormData(prev => ({ 
      ...prev, 
      Address: value 
    }));
    
    if (errors.Address) {
      setErrors(prev => ({ ...prev, Address: '' }));
    }
  };

  // Email input handler
  const handleEmailChange = (e) => {
    const value = e.target.value;
    
    setFormData(prev => ({ 
      ...prev, 
      Email: value 
    }));
    
    if (errors.Email) {
      setErrors(prev => ({ ...prev, Email: '' }));
    }
  };

  // Status change handler
  const handleStatusChange = (e) => {
    const value = e.target.value;
    
    setFormData(prev => ({ 
      ...prev, 
      States: value 
    }));
    
    if (errors.States) {
      setErrors(prev => ({ ...prev, States: '' }));
    }
  };

  // ✅ UPDATED VALIDATION: Address is required, Email is optional, Phone exactly 10 digits
  const validateForm = () => {
    let tempErrors = {};
    
    // Name validation - required and minimum length
    if (!formData.FullName || formData.FullName.trim().length === 0) {
      tempErrors.FullName = 'Full name is required.';
    } else if (formData.FullName.trim().length < 3) {
      tempErrors.FullName = 'Full name must be at least 3 characters.';
    } else if (formData.FullName.trim().length > 100) {
      tempErrors.FullName = 'Full name cannot exceed 100 characters.';
    }
    
    // Phone validation - exactly 10 digits
    if (!formData.PhoneNumber || formData.PhoneNumber.trim().length === 0) {
      tempErrors.PhoneNumber = 'Phone number is required.';
    } else if (!/^[0-9]{10}$/.test(formData.PhoneNumber)) {
      tempErrors.PhoneNumber = 'Phone number must be exactly 10 digits.';
    }
    
    // ✅ Address is REQUIRED
    if (!formData.Address || formData.Address.trim().length === 0) {
      tempErrors.Address = 'Address is required.';
    } else if (formData.Address.trim().length < 10) {
      tempErrors.Address = 'Address must be at least 10 characters long.';
    } else if (formData.Address.trim().length > 500) {
      tempErrors.Address = 'Address cannot exceed 500 characters.';
    }
    
    // ✅ Email validation - only if provided (optional)
    if (formData.Email && formData.Email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.Email.trim())) {
        tempErrors.Email = 'Please enter a valid email address.';
      } else if (formData.Email.trim().length > 100) {
        tempErrors.Email = 'Email cannot exceed 100 characters.';
      }
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ✅ UPDATED SUBMIT HANDLER with duplicate check
  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null);

    if (!validateForm()) {
      setNotification({ type: 'error', message: 'Please fix the errors before submitting.' });
      return;
    }

    try {
      // Check for duplicate customer (only for new customers, not when editing)
      if (!isEditing) {
        const duplicateCustomer = checkForDuplicateCustomer(formData);
        if (duplicateCustomer) {
          setNotification({ 
            type: 'error', 
            message: `Customer already exists! A customer with this phone number or email already exists (ID: ${duplicateCustomer.CustomerId}).` 
          });
          return;
        }
      }

      let result;
      if (isEditing) {
        // Include ALL customer data for update
        const customerData = { 
          ...formData, 
          CustomerId: currentCustomerId 
        };
        
        result = await dispatch(UpdateCustomerDetails(customerData));
      } else {
        // For new customers, set default status to Active
        const newCustomerData = {
          FullName: formData.FullName.trim(),
          PhoneNumber: formData.PhoneNumber,
          Email: formData.Email?.trim() || '', // Optional for new customers
          Address: formData.Address.trim(), // Required for new customers
          States: 'A' // Always set to Active for new customers
        };
        result = await dispatch(AddCustomer(newCustomerData));
      }

      // Check if result exists and has type property
      if (result && result.type && result.type.endsWith('SUCCESS')) {
        setNotification({ 
          type: 'success', 
          message: `Customer successfully ${isEditing ? 'updated' : 'added'}.` 
        });
        setShowModal(false);
        resetForm();
        dispatch(GetAllCustomers()); // Refresh the list
      } else {
        const errorMsg = result?.payload?.msg || result?.msg || 'An error occurred during submission.';
        setNotification({ type: 'error', message: errorMsg });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setNotification({ type: 'error', message: 'An unexpected error occurred.' });
    }
  };

  // Edit handler
  const handleEdit = (customerId) => {
    setCurrentCustomerId(customerId);
    setIsEditing(true);
    setShowModal(true);
    dispatch(GetCustomerByID(customerId));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      FullName: '',
      Email: '',
      PhoneNumber: '',
      Address: '',
      States: 'A' // Default to Active
    });
    setErrors({});
    setIsEditing(false);
    setCurrentCustomerId(null);
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

  // Generate page numbers for pagination - Mobile responsive
  const getPageNumbers = () => {
    if (totalPages <= (isMobile ? 2 : 3)) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    let startPage = Math.max(1, currentPage - (isMobile ? 0 : 1));
    let endPage = Math.min(totalPages, currentPage + (isMobile ? 1 : 1));
    
    // Adjust if we're at the beginning
    if (currentPage === 1) {
      endPage = isMobile ? 2 : 3;
    }
    // Adjust if we're at the end
    if (currentPage === totalPages) {
      startPage = totalPages - (isMobile ? 1 : 2);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-3 sm:p-4 md:p-6 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
      {/* 3D Notification - Mobile Responsive - MOVED OUTSIDE MODAL with higher z-index */}
      {notification && (
        <div
          className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-6 z-[60] p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center animate-slide-in ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200/50 border-l-4 border-l-green-400' 
              : 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200/50 border-l-4 border-l-rose-400'
          }`}
        >
          <div className="bg-white/20 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 backdrop-blur-sm">
            {notification.type === 'success' ? <FiCheckCircle size={isMobile ? 16 : 18} /> : <FiAlertCircle size={isMobile ? 16 : 18} />}
          </div>
          <span className="font-semibold text-xs sm:text-sm flex-1">{notification.message}</span>
        </div>
      )}

      {/* Header Section with 3D Effect - Mobile Responsive */}
      <div className="relative z-10 mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3">
          <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
            <FiUsers className="text-white text-base sm:text-lg md:text-xl" />
          </div>
          <div className="transform  flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
              Customer Management
            </h1>
            <p className="text-slate-600 mt-0.5 text-xs sm:text-sm md:text-base truncate">
              Manage your customer profiles and information
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 relative z-10">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Total Customers</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {totalCustomers}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
                <FiUsers className="text-white text-sm sm:text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Active</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {activeCustomers}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
                <FiUser className="text-white text-sm sm:text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Inactive</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {inactiveCustomers}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
                <FiUser className="text-white text-sm sm:text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Add button - Mobile Responsive */}
      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <div className="relative flex-grow group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
            <input
              type="text"
              placeholder="Search by ID, Name, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
              disabled={isLoading}
            />
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={isMobile ? 18 : 20} />
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 w-full sm:w-auto"
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
            <FiUserPlus className="mr-2 sm:mr-3 relative z-10" size={isMobile ? 18 : 20} />
            <span className="relative z-10 text-sm sm:text-base">Add Customer</span>
          </button>
        </div>
      </div>

      {/* 3D Table - FIXED Mobile Responsive Layout */}
      {isLoading ? (
        <div className="relative z-10 text-center py-8 sm:py-12">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl border border-white/20">
            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-800"></div>
            <span className="text-slate-700 font-medium text-sm sm:text-base">Loading customers...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          {!isMobile && (
            <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
                      <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">ID</th>
                      <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">Name</th>
                      <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">Email</th>
                      <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">Phone</th>
                      <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">Address</th>
                      <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">Status</th>
                      <th className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-center text-slate-700 font-semibold text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50">
                    {currentCustomers.length > 0 ? (
                      currentCustomers.map(customer => (
                        <tr key={customer.CustomerId} className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group">
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-m">
                            {customer.CustomerId}
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                            {customer.FullName}
                          </td>
                          {/* ✅ FIXED: Display "Not Provided" for empty Email */}
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                            {displayFieldValue(customer.Email)}
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                            {customer.PhoneNumber}
                          </td>
                          {/* ✅ FIXED: Display "Not Provided" for empty Address */}
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate" title={customer.Address || 'Not Provided'}>
                            {displayFieldValue(customer.Address)}
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 text-center sm:py-4">
                            {getStatusBadge(customer.States)}
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
                            <button
                              onClick={() => handleEdit(customer.CustomerId)}
                              className="inline-flex items-center justify-center p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
                              title="Edit Customer"
                              disabled={isLoading}
                            >
                              <FiEdit2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-8 sm:py-12">
                          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                            <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                              <FiUsers className="text-slate-500 text-lg sm:text-xl" />
                            </div>
                            <p className="text-slate-500 font-medium text-sm sm:text-base">
                              {searchTerm ? 'No matching customers found' : 'No customers available'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mobile Cards Layout */}
          {isMobile && (
            <div className="relative z-10 space-y-3 mb-4 sm:mb-6">
              {currentCustomers.length > 0 ? (
                currentCustomers.map(customer => (
                  <div 
                    key={customer.CustomerId} 
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-4 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-800 font-medium text-base truncate">
                          {customer.FullName}
                        </h3>
                        <div className="mt-1 space-y-1 text-xs text-slate-600">
                          {/* ✅ FIXED: Display "Not Provided" for empty Email */}
                          <div className="flex items-center">
                            <FiMail className="mr-2 flex-shrink-0" size={12} />
                            <span className="truncate">{displayFieldValue(customer.Email)}</span>
                          </div>
                          <div className="flex items-center">
                            <FiPhone className="mr-2 flex-shrink-0" size={12} />
                            <span>{customer.PhoneNumber}</span>
                          </div>
                          {/* ✅ FIXED: Display "Not Provided" for empty Address */}
                          <div className="flex items-start">
                            <FiMapPin className="mr-2 mt-0.5 flex-shrink-0" size={12} />
                            <span className="truncate flex-1">{displayFieldValue(customer.Address)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-3">
                        {getStatusBadge(customer.States)}
                        <button
                          onClick={() => handleEdit(customer.CustomerId)}
                          className="inline-flex items-center justify-center p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                          title="Edit Customer"
                          disabled={isLoading}
                        >
                          <FiEdit2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-2 mt-2">
                      <span>ID: {customer.CustomerId}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                      <FiUsers className="text-slate-500 text-xl" />
                    </div>
                    <p className="text-slate-500 font-medium">
                      {searchTerm ? 'No matching customers found' : 'No customers available'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ✅ FIXED: 3D Pagination with Correct ID Range Display */}
          {displayData.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 space-y-3 sm:space-y-0">
              {/* ✅ FIXED: Show actual CustomerId ranges instead of array positions */}
              <div className="text-xs sm:text-sm text-slate-600 font-medium">
                {currentCustomers.length > 0 ? (
                  <>
                    Showing IDs {startId}–{endId} of {displayData.length} customers
                  </>
                ) : (
                  `Showing 0 of ${displayData.length} customers`
                )}
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
        </>
      )}

      {/* 3D Modal - Mobile Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="relative w-full max-w-md sm:max-w-lg max-h-[90vh] ">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl sm:rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                    <FiUserPlus className="text-white text-sm sm:text-base md:text-lg" />
                  </div>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
                    {isEditing ? 'Edit Customer' : 'Add New Customer'}
                  </h2>
                </div>
                <button 
                  onClick={() => { setShowModal(false); resetForm(); }} 
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-100/50 transition-colors duration-200 flex-shrink-0 ml-2"
                >
                  <FiX size={isSmallMobile ? 18 : 20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="FullName"
                    value={formData.FullName}
                    onChange={handleNameChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
                      errors.FullName ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="Enter full name (required)"
                    required
                    disabled={adding || updating}
                  />
                  {errors.FullName && <p className="text-red-500 text-xs mt-1.5 sm:mt-2">{errors.FullName}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="PhoneNumber"
                    value={formData.PhoneNumber}
                    onChange={handlePhoneChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
                      errors.PhoneNumber ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="Enter 10-digit phone number (required)"
                    maxLength="10"
                    required
                    disabled={adding || updating}
                  />
                  {errors.PhoneNumber && <p className="text-red-500 text-xs mt-1.5 sm:mt-2">{errors.PhoneNumber}</p>}
                  <p className="text-xs text-slate-500 mt-1">Example: 0771234567</p>
                </div>

                {/* Email - Optional */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    Email Address <span className="text-slate-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleEmailChange}
                    placeholder="Enter email address (optional)"
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
                      errors.Email ? 'border-red-500' : 'border-slate-200'
                    }`}
                    disabled={adding || updating}
                  />
                  {errors.Email && <p className="text-red-500 text-xs mt-1.5 sm:mt-2">{errors.Email}</p>}
                </div>

                {/* Address - REQUIRED */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="Address"
                    value={formData.Address}
                    onChange={handleAddressChange}
                    rows="3"
                    placeholder="Enter complete address including street, city, and postal code (required)"
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
                      errors.Address ? 'border-red-500' : 'border-slate-200'
                    }`}
                    required
                    disabled={adding || updating}
                  ></textarea>
                  {errors.Address && <p className="text-red-500 text-xs mt-1.5 sm:mt-2">{errors.Address}</p>}
                  <p className="text-xs text-slate-500 mt-1">Minimum 10 characters</p>
                </div>

                {/* Status - Only show when editing */}
                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="States"
                      value={formData.States}
                      onChange={handleStatusChange}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm sm:text-base ${
                        errors.States ? 'border-red-500' : 'border-slate-200'
                      }`}
                      required
                      disabled={adding || updating}
                    >
                      <option value="A">Active</option>
                      <option value="I">Inactive</option>
                    </select>
                    {errors.States && <p className="text-red-500 text-xs mt-1.5 sm:mt-2">{errors.States}</p>}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4 md:pt-6">
                  <button 
                    type="button" 
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-slate-300 rounded-xl sm:rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base order-2 sm:order-1" 
                    disabled={adding || updating}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base order-1 sm:order-2" 
                    disabled={adding || updating}
                  >
                    {adding || updating ? 'Processing...' : isEditing ? 'Update Customer' : 'Add Customer'}
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

export default Customers;