// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   FiPlusSquare,
//   FiX,
//   FiEdit2,
//   FiSearch,
//   FiChevronLeft,
//   FiChevronRight,
//   FiImage,
//   FiUser,
//   FiScissors,
//   FiTool,
//   FiCheckCircle,
//   FiAlertCircle
// } from "react-icons/fi";
// import Select from "react-select";
// import {
//   GetMeasurementsByCustomerId,
//   AddMeasurement,
//   UpdateMeasurement,
//   GetAllMeasurements,
// } from "../actions/measurementActions";
// import { GetAllGarmentType } from "../actions/garmentTypeAction";
// import { GetAllCustomers } from "../actions/customerActions";

// const Measurements = () => {
//   const dispatch = useDispatch();

//   const [showModal, setShowModal] = useState(false);
//   const [editingMeasurement, setEditingMeasurement] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [file, setFile] = useState(null);
//   const [itemsPerPage] = useState(10);
//   const [notification, setNotification] = useState({ message: "", type: "" });
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const [formData, setFormData] = useState({
//     CustomerId: "",
//     GarmentTypeId: "",
//     Neck: "",
//     Chest: "",
//     Waist: "",
//     Length: "",
//     Description: "",
//     YardsRequired: "",
//   });

//   const { responseBody: allMeasurements = [] } =
//     useSelector((state) => state.getAllMeasurements) || {};

//   const { responseBody: garmentTypes = [] } =
//     useSelector((state) => state.garmentTypeList || {});

//   const { responseBody: customers = [] } =
//     useSelector((state) => state.customerList || {});

//   const { responseBody: measurementsByCustomer = [] } =
//     useSelector((state) => state.getMeasurementsByCustomerId) || {};

//   // Mobile responsive state
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);

//   // Auto-hide notification
//   useEffect(() => {
//     if (notification.message) {
//       const timer = setTimeout(() => setNotification({ message: "", type: "" }), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   // Handle resize for mobile responsiveness
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       setIsSmallMobile(window.innerWidth < 480);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // UPDATED: Sort measurements in descending order by MeasurementId
//   const getSortedMeasurements = () => {
//     let data = [];
    
//     if (searchTerm) {
//       data = Array.isArray(measurementsByCustomer) ? [...measurementsByCustomer] : [];
//     } else {
//       data = Array.isArray(allMeasurements) ? [...allMeasurements] : [];
//     }
    
//     // Sort by MeasurementId in descending order (newest first)
//     return data.sort((a, b) => {
//       const idA = parseInt(a.MeasurementId) || 0;
//       const idB = parseInt(b.MeasurementId) || 0;
//       return idB - idA; // Descending order
//     });
//   };

//   const measurements = getSortedMeasurements();

//   useEffect(() => {
//     dispatch(GetAllMeasurements());
//     dispatch(GetAllGarmentType());
//     dispatch(GetAllCustomers());
//   }, [dispatch]);

//   // ✅ NEW: Get customer suggestions for search
//   const getCustomerSuggestions = () => {
//     if (!searchTerm) return [];
    
//     return customers
//       .filter(customer => 
//         customer.FullName.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//       .slice(0, 5); // Limit to 5 suggestions
//   };

//   const customerSuggestions = getCustomerSuggestions();

//   // ✅ NEW: Handle real-time search
//   useEffect(() => {
//     if (searchTerm.trim()) {
//       const foundCustomer = customers.find(customer => 
//         customer.FullName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
      
//       if (foundCustomer) {
//         dispatch(GetMeasurementsByCustomerId(foundCustomer.CustomerId));
//       } else {
//         // If no customer found, show all measurements
//         dispatch(GetAllMeasurements());
//       }
//     } else {
//       // If search term is empty, show all measurements
//       dispatch(GetAllMeasurements());
//     }
//   }, [searchTerm, customers, dispatch]);

//   // Pagination Logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentMeasurements = measurements.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );
//   const totalPages = Math.ceil(measurements.length / itemsPerPage);

//   const goToPage = (num) => setCurrentPage(num);
//   const goToPrevPage = () =>
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   const goToNextPage = () =>
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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

//   // ✅ NEW: Handle customer selection from suggestions
//   const handleCustomerSelect = (customer) => {
//     setSearchTerm(customer.FullName);
//     setShowSuggestions(false);
//     dispatch(GetMeasurementsByCustomerId(customer.CustomerId));
//   };

//   // ✅ NEW: Handle input change with suggestions
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setShowSuggestions(true);
//   };

//   // Modal handlers
//   const openAddModal = () => {
//     setFormData({
//       CustomerId: "",
//       GarmentTypeId: "",
//       Neck: "",
//       Chest: "",
//       Waist: "",
//       Length: "",
//       Description: "",
//       YardsRequired: "",
//     });
//     setFile(null);
//     setEditingMeasurement(null);
//     setErrorMessage("");
//     setShowModal(true);
//   };

//   const openEditModal = (measurement) => {
//     setFormData({
//       MeasurementId: measurement.MeasurementId,
//       CustomerId: measurement.CustomerId,
//       GarmentTypeId: measurement.GarmentTypeId,
//       Neck: measurement.Neck,
//       Chest: measurement.Chest,
//       Waist: measurement.Waist,
//       Length: measurement.Length,
//       Description: measurement.Description || "",
//       YardsRequired: measurement.YardsRequired || ""
//     });
//     setEditingMeasurement(measurement);
//     setFile(null);
//     setErrorMessage("");
//     setShowModal(true);
//   };

//   // Input Handlers with STRICT positive number validation
//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     // Validate measurement fields for positive numbers only (0 or positive)
//     if (['Neck', 'Chest', 'Waist', 'Length','YardsRequired'].includes(name)) {
//       // Allow empty, 0, or positive numbers with decimals
//       if (value === '' || value === '0' || /^\d*\.?\d*$/.test(value)) {
//         const numValue = parseFloat(value);
        
//         // STRICT VALIDATION: Only allow 0 or positive numbers
//         if (value !== '' && numValue < 0) {
//           setNotification({ 
//             type: 'error', 
//             message: `❌ ${name} cannot be negative! ` 
//           });
//           return; // Don't update the state for negative values
//         }
        
//         // If valid, update the state
//         setFormData((prev) => ({ ...prev, [name]: value }));
//       }
//       // If invalid characters, don't update the state
//     } else {
//       // For non-measurement fields, update normally
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Enhanced validation on blur for measurement fields
//   const handleMeasurementBlur = (e) => {
//     const { name, value } = e.target;
    
//     if (['Neck', 'Chest', 'Waist', 'Length','YardsRequired'].includes(name) && value !== '') {
//       const numValue = parseFloat(value);
      
//       // Final validation check
//       if (numValue < 0) {
//         setNotification({ 
//           type: 'error', 
//           message: `❌ ${name} cannot be negative! Value has been reset to empty.` 
//         });
//         setFormData((prev) => ({ ...prev, [name]: '' }));
//       }
//     }
//   };

//   const handleFileChange = (e) => setFile(e.target.files[0]);

//   // STRICT Validation function - Only allow 0 or positive numbers
//   const validateForm = () => {
//     // Required fields validation
//     if (!formData.CustomerId) {
//       setNotification({ type: 'error', message: "❌ Please select a customer." });
//       return false;
//     }

//     if (!formData.GarmentTypeId) {
//       setNotification({ type: 'error', message: "❌ Please select a garment type." });
//       return false;
//     }

//     // STRICT POSITIVE NUMBER VALIDATION - Only 0 or positive numbers allowed
//     const measurementFields = ['Neck', 'Chest', 'Waist', 'Length','YardsRequired'];
//     for (const field of measurementFields) {
//       const value = formData[field];
//       if (value && value !== "") {
//         const numValue = parseFloat(value);
//         if (isNaN(numValue) || numValue < 0) {
//           setNotification({ 
//             type: 'error', 
//             message: `❌ ${field}  Negative values are not allowed!` 
//           });
//           return false;
//         }
//       }
//     }

//     // File validation (optional)
//     if (file) {
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
//       if (!validTypes.includes(file.type)) {
//         setNotification({ 
//           type: 'error', 
//           message: "❌ Please upload a valid image file (JPEG, PNG, GIF only)." 
//         });
//         return false;
//       }

//       if (file.size > 5 * 1024 * 1024) { // 5MB limit
//         setNotification({ 
//           type: 'error', 
//           message: "❌ Image size should be less than 5MB." 
//         });
//         return false;
//       }
//     }

//     setErrorMessage("");
//     return true;
//   };

//   // ✅ FIXED: Enhanced success detection function
//   const isOperationSuccessful = (result) => {
//     if (!result) return false;
    
//     // Check for explicit success flags
//     if (result.success === true || result.payload?.success === true) return true;
    
//     // Check for HTTP status codes
//     if (result.status === 200 || result.payload?.status === 200) return true;
    
//     // Check for specific success messages
//     if (result.Result === "Success!!" || result.payload?.Result === "Success!!") return true;
    
//     // If we have data/ID, assume success
//     if (result.MeasurementId || result.payload?.MeasurementId) return true;
//     if (result.data?.MeasurementId || result.payload?.data?.MeasurementId) return true;
    
//     // If no explicit error, assume success
//     if (!result.error && !result.payload?.error) return true;
    
//     return false;
//   };

//   // ✅ FIXED: Submit Add / Update with proper success detection
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const data = new FormData();
//       if (file) data.append("file", file);
//       data.append("GarmentTypeId", formData.GarmentTypeId);
//       data.append("Neck", formData.Neck || 0);
//       data.append("Chest", formData.Chest || 0);
//       data.append("Waist", formData.Waist || 0);
//       data.append("Length", formData.Length || 0);
//       data.append("Description", formData.Description || "");
//       data.append("CustomerId", formData.CustomerId);
//        data.append("YardsRequired", formData.YardsRequired || 0);

//       let result;
//       if (editingMeasurement) {
//         data.append("MeasurementId", formData.MeasurementId);
//         result = await dispatch(UpdateMeasurement(data));
//       } else {
//         result = await dispatch(AddMeasurement(data));
//       }

//       // ✅ FIXED: Use the enhanced success detection
//       if (isOperationSuccessful(result)) {
//         setNotification({ 
//           type: 'success', 
//           message: `✅ ${editingMeasurement ? "Measurement updated successfully!" : "Measurement added successfully!"}` 
//         });
//         setShowModal(false);
//         dispatch(GetAllMeasurements());
//       } else {
//         // Extract error message from various possible locations
//         const errorMsg = result?.error || 
//                         result?.payload?.error || 
//                         result?.message || 
//                         result?.payload?.message || 
//                         'Operation failed. Please try again.';
//         setNotification({ type: 'error', message: `❌ ${errorMsg}` });
//       }
//     } catch (error) {
//       setNotification({ 
//         type: 'error', 
//         message: `❌ Error: ${error.message || 'Failed to save measurement'}` 
//       });
//     }
//   };

//   const getCustomerName = (id) => {
//     const c = customers.find((x) => x.CustomerId === id);
//     return c ? c.FullName : `ID ${id}`;
//   };
  
//   const getGarmentTypeName = (id) => {
//     const g = garmentTypes.find((x) => x.GarmentTypeId === id);
//     return g ? g.GarmentTypeName : `ID ${id}`;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-3 sm:p-4 md:p-6 relative overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
//       {/* ✅ ENHANCED 3D Notification */}
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
// <div className="relative z-10 mb-6 sm:mb-8">
//   <div className="flex items-center space-x-3 sm:space-x-4 mb-3">
//     <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
//       <FiTool className="text-white text-lg sm:text-xl" />
//     </div>
//     <div className="transform ">
//       <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//         Measurements
//       </h1>
//       <p className="text-slate-600 mt-1 text-sm sm:text-base">
//         Manage customer measurements and specifications
//       </p>
//     </div>
//   </div>
// </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 relative z-10">
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Total Measurements</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {measurements.length}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
//                 <FiTool className="text-white text-sm sm:text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div className="min-w-0 flex-1">
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Customers</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {customers.length}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
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
//                 <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Garment Types</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {garmentTypes.length}
//                 </p>
//               </div>
//               <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
//                 <FiScissors className="text-white text-sm sm:text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ✅ UPDATED: Search + Add button with real-time search */}
//       <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
//         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
//           {/* Search Input */}
// <div className="relative flex-grow group">
//   <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//   <input
//     type="text"
//     placeholder="Search by Customer Name..."
//     value={searchTerm}
//     onChange={handleSearchChange}
//     className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
//   />
//   <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={isMobile ? 18 : 20} />
// </div>

//           {/* <button
//             onClick={openAddModal}
//             className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95"
//           >
//             <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//             <FiPlusSquare className="mr-2 sm:mr-3 relative z-10" size={isMobile ? 18 : 20} />
//             <span className="relative z-10 text-sm sm:text-base">Add Measurement</span>
//           </button> */}
//         </div>
//       </div>

//       {/* Enhanced 3D Table */}
//       <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">ID</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Customer</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Garment Type</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Neck(inch)</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Chest(inch)</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Waist(inch)</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Length(inch)</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Yards Required</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Description</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Image</th>
//                 <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-200/50">
//               {currentMeasurements.length > 0 ? (
//                 currentMeasurements.map((m) => (
//                   <tr 
//                     key={m.MeasurementId} 
//                     className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
//                   >
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       {m.MeasurementId}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       {getCustomerName(m.CustomerId)}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       {getGarmentTypeName(m.GarmentTypeId)}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       {m.Neck || "-"}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       {m.Chest || "-"}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       {m.Waist || "-"}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       {m.Length || "-"}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       {m.YardsRequired || "-"}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm max-w-[120px] truncate" title={m.Description}>
//                       {m.Description || "-"}
//                     </td>
//                     <td className="px-2 py-3 text-slate-600 text-sm">
//                       {m.IMAGEURL ? (
//                         <div className="relative group/image">
//                           <div className="absolute inset-0 bg-blue-800 rounded-lg blur-md opacity-20 group-hover/image:opacity-30 transition duration-300"></div>
//                           <img
//                             src={m.IMAGEURL}
//                             alt="Measurement"
//                             className="relative w-8 h-8 rounded-lg border border-slate-200 object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
//                           />
//                         </div>
//                       ) : (
//                         <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center bg-slate-100 shadow-lg">
//                           <FiImage className="text-slate-400" size={12} />
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-2 py-3">
//                       <button
//                         onClick={() => openEditModal(m)}
//                         className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
//                         title="Edit Measurement"
//                       >
//                         <FiEdit2 size={14} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="11" className="text-center py-8 sm:py-12">
//                     <div className="flex flex-col items-center space-y-2 sm:space-y-3">
//                       <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                         <FiTool className="text-slate-500 text-lg sm:text-xl" />
//                       </div>
//                       <p className="text-slate-500 font-medium text-sm sm:text-base">
//                         {searchTerm ? `No measurements found for "${searchTerm}"` : "No measurements found"}
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Enhanced Pagination */}
//         {measurements.length > itemsPerPage && (
//           <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
//             <div className="text-xs sm:text-sm text-slate-600 font-medium">
//               Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, measurements.length)} of{' '}
//               {measurements.length}
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
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
//           <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-700 rounded-3xl blur opacity-20"></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200"
//               >
//                 <FiX className="text-lg" />
//               </button>

//               <div className="flex items-center space-x-3 mb-4">
//                 <div className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl">
//                   <FiTool className="text-white text-lg" />
//                 </div>
//                 <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                   {editingMeasurement ? "Edit Measurement" : "Add Measurement"}
//                 </h2>
//               </div>

//               {errorMessage && (
//                 <div className="mb-4 p-3 text-red-700 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl border border-red-200 shadow-lg text-sm">
//                   {errorMessage}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Customer */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Customer *
//                     </label>
//                     <Select
//                       options={customers.map((c) => ({
//                         value: c.CustomerId,
//                         label: c.FullName,
//                       }))}
//                       value={
//                         formData.CustomerId
//                           ? {
//                               value: formData.CustomerId,
//                               label: customers.find(
//                                 (c) => c.CustomerId === formData.CustomerId
//                               )?.FullName,
//                             }
//                           : null
//                       }
//                       onChange={(selected) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           CustomerId: selected.value,
//                         }))
//                       }
//                       placeholder="Select Customer"
//                       isSearchable
//                       className="react-select-container"
//                       classNamePrefix="react-select"
//                     />
//                   </div>

//                   {/* Garment Type */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Garment Type *
//                     </label>
//                     <Select
//                       options={garmentTypes.map((g) => ({
//                         value: g.GarmentTypeId,
//                         label: g.GarmentTypeName,
//                       }))}
//                       value={
//                         formData.GarmentTypeId
//                           ? {
//                               value: formData.GarmentTypeId,
//                               label: garmentTypes.find(
//                                 (g) => g.GarmentTypeId === formData.GarmentTypeId
//                               )?.GarmentTypeName,
//                             }
//                           : null
//                       }
//                       onChange={(selected) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           GarmentTypeId: selected.value,
//                         }))
//                       }
//                       placeholder="Select Garment Type"
//                       isSearchable
//                       className="react-select-container"
//                       classNamePrefix="react-select"
//                     />
//                   </div>
//                 </div>

//                 {/* Measurements Grid */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                   {["Neck", "Chest", "Waist", "Length"].map((field) => (
//                     <div key={field} className="group">
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         {field} (inches) *
//                       </label>
//                       <input
//                         type="number"
//                         name={field}
//                         value={formData[field]}
//                         onChange={handleChange}
//                         onBlur={handleMeasurementBlur}
//                         min="0"
//                         step="0.1"
//                         className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 text-sm"
//                         placeholder="0"
//                         onKeyDown={(e) => {
//                           // STRICTLY prevent negative numbers and invalid characters
//                           if (['-', 'e', 'E', '+'].includes(e.key)) {
//                             e.preventDefault();
//                             setNotification({ 
//                               type: 'error', 
//                               message: `❌ ${field} cannot be negative! Only 0 or positive numbers allowed.` 
//                             });
//                           }
//                         }}
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 {/* Yards Required */}
//                 <div className="group">
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Yards Required 
//                   </label>
//                   <input
//                     type="number"
//                     name="YardsRequired"
//                     value={formData.YardsRequired}
//                     onChange={handleChange}
//                     onBlur={handleMeasurementBlur}
//                     min="0"
//                     step="0.1"
//                     className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 text-sm"
//                     placeholder="0"
//                     onKeyDown={(e) => {
//                       // STRICTLY prevent negative numbers and invalid characters
//                       if (['-', 'e', 'E', '+'].includes(e.key)) {
//                         e.preventDefault();
//                         setNotification({ 
//                           type: 'error', 
//                           message: `❌ Yards Required cannot be negative! Only 0 or positive numbers allowed.` 
//                         });
//                       }
//                     }}
//                   />
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     name="Description"
//                     value={formData.Description}
//                     onChange={handleChange}
//                     rows="3"
//                     className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 text-sm"
//                     placeholder="Additional notes or description..."
//                   />
//                 </div>

//                 {/* File Upload */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Upload Image
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 text-sm"
//                     />
//                   </div>
//                   <p className="text-xs text-slate-500 mt-1">Supported: JPEG, PNG, GIF • Max: 5MB</p>
//                 </div>

//                 <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="px-4 py-2 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm order-2 sm:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-sm order-1 sm:order-2"
//                   >
//                     {editingMeasurement ? "Update Measurement" : "Add Measurement"}
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

// export default Measurements;



import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiPlusSquare,
  FiX,
  FiEdit2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiUser,
  FiScissors,
  FiTool,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import Select from "react-select";
import {
  GetMeasurementsByCustomerId,
  AddMeasurement,
  UpdateMeasurement,
  GetAllMeasurements,
} from "../actions/measurementActions";
import { GetAllGarmentType } from "../actions/garmentTypeAction";
import { GetAllCustomers } from "../actions/customerActions";

const Measurements = () => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [file, setFile] = useState(null);
  const [itemsPerPage] = useState(10);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ NEW: Trigger for refresh

  const [formData, setFormData] = useState({
    CustomerId: "",
    GarmentTypeId: "",
    Neck: "",
    Chest: "",
    Waist: "",
    Length: "",
    Description: "",
    YardsRequired: "",
  });

  const { responseBody: allMeasurements = [] } =
    useSelector((state) => state.getAllMeasurements) || {};

  const { responseBody: garmentTypes = [] } =
    useSelector((state) => state.garmentTypeList || {});

  const { responseBody: customers = [] } =
    useSelector((state) => state.customerList || {});

  const { responseBody: measurementsByCustomer = [] } =
    useSelector((state) => state.getMeasurementsByCustomerId) || {};

  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);

  // Auto-hide notification
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // UPDATED: Sort measurements in descending order by MeasurementId
  const getSortedMeasurements = () => {
    let data = [];
    
    if (searchTerm) {
      data = Array.isArray(measurementsByCustomer) ? [...measurementsByCustomer] : [];
    } else {
      data = Array.isArray(allMeasurements) ? [...allMeasurements] : [];
    }
    
    // Sort by MeasurementId in descending order (newest first)
    return data.sort((a, b) => {
      const idA = parseInt(a.MeasurementId) || 0;
      const idB = parseInt(b.MeasurementId) || 0;
      return idB - idA; // Descending order
    });
  };

  const measurements = getSortedMeasurements();

  // ✅ UPDATED: Enhanced useEffect to refresh data when refreshTrigger changes
  useEffect(() => {
    dispatch(GetAllMeasurements());
    dispatch(GetAllGarmentType());
    dispatch(GetAllCustomers());
  }, [dispatch, refreshTrigger]); // ✅ Added refreshTrigger as dependency

  // ✅ NEW: Get customer suggestions for search
  const getCustomerSuggestions = () => {
    if (!searchTerm) return [];
    
    return customers
      .filter(customer => 
        customer.FullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions
  };

  const customerSuggestions = getCustomerSuggestions();

  // ✅ NEW: Handle real-time search
  useEffect(() => {
    if (searchTerm.trim()) {
      const foundCustomer = customers.find(customer => 
        customer.FullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (foundCustomer) {
        dispatch(GetMeasurementsByCustomerId(foundCustomer.CustomerId));
      } else {
        // If no customer found, show all measurements
        dispatch(GetAllMeasurements());
      }
    } else {
      // If search term is empty, show all measurements
      dispatch(GetAllMeasurements());
    }
  }, [searchTerm, customers, dispatch, refreshTrigger]); // ✅ Added refreshTrigger

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeasurements = measurements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(measurements.length / itemsPerPage);

  const goToPage = (num) => setCurrentPage(num);
  const goToPrevPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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

  // ✅ NEW: Handle customer selection from suggestions
  const handleCustomerSelect = (customer) => {
    setSearchTerm(customer.FullName);
    setShowSuggestions(false);
    dispatch(GetMeasurementsByCustomerId(customer.CustomerId));
  };

  // ✅ NEW: Handle input change with suggestions
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  // Modal handlers
  const openAddModal = () => {
    setFormData({
      CustomerId: "",
      GarmentTypeId: "",
      Neck: "",
      Chest: "",
      Waist: "",
      Length: "",
      Description: "",
      YardsRequired: "",
    });
    setFile(null);
    setEditingMeasurement(null);
    setErrorMessage("");
    setShowModal(true);
  };

  // ✅ FIXED: Properly populate all fields including YardsRequired when editing
  const openEditModal = (measurement) => {
    setFormData({
      MeasurementId: measurement.MeasurementId,
      CustomerId: measurement.CustomerId,
      GarmentTypeId: measurement.GarmentTypeId,
      Neck: measurement.Neck || "",
      Chest: measurement.Chest || "",
      Waist: measurement.Waist || "",
      Length: measurement.Length || "",
      Description: measurement.Description || "",
      YardsRequired: measurement.YardsRequired || "" // ✅ FIX: Now properly sets YardsRequired
    });
    setEditingMeasurement(measurement);
    setFile(null);
    setErrorMessage("");
    setShowModal(true);
  };

  // Input Handlers with STRICT positive number validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate measurement fields for positive numbers only (0 or positive)
    if (['Neck', 'Chest', 'Waist', 'Length','YardsRequired'].includes(name)) {
      // Allow empty, 0, or positive numbers with decimals
      if (value === '' || value === '0' || /^\d*\.?\d*$/.test(value)) {
        const numValue = parseFloat(value);
        
        // STRICT VALIDATION: Only allow 0 or positive numbers
        if (value !== '' && numValue < 0) {
          setNotification({ 
            type: 'error', 
            message: `❌ ${name} cannot be negative! ` 
          });
          return; // Don't update the state for negative values
        }
        
        // If valid, update the state
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      // If invalid characters, don't update the state
    } else {
      // For non-measurement fields, update normally
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Enhanced validation on blur for measurement fields
  const handleMeasurementBlur = (e) => {
    const { name, value } = e.target;
    
    if (['Neck', 'Chest', 'Waist', 'Length','YardsRequired'].includes(name) && value !== '') {
      const numValue = parseFloat(value);
      
      // Final validation check
      if (numValue < 0) {
        setNotification({ 
          type: 'error', 
          message: `❌ ${name} cannot be negative! Value has been reset to empty.` 
        });
        setFormData((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  // STRICT Validation function - Only allow 0 or positive numbers
  const validateForm = () => {
    // Required fields validation
    if (!formData.CustomerId) {
      setNotification({ type: 'error', message: "❌ Please select a customer." });
      return false;
    }

    if (!formData.GarmentTypeId) {
      setNotification({ type: 'error', message: "❌ Please select a garment type." });
      return false;
    }

    // STRICT POSITIVE NUMBER VALIDATION - Only 0 or positive numbers allowed
    const measurementFields = ['Neck', 'Chest', 'Waist', 'Length','YardsRequired'];
    for (const field of measurementFields) {
      const value = formData[field];
      if (value && value !== "") {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
          setNotification({ 
            type: 'error', 
            message: `❌ ${field}  Negative values are not allowed!` 
          });
          return false;
        }
      }
    }

    // File validation (optional)
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setNotification({ 
          type: 'error', 
          message: "❌ Please upload a valid image file (JPEG, PNG, GIF only)." 
        });
        return false;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setNotification({ 
          type: 'error', 
          message: "❌ Image size should be less than 5MB." 
        });
        return false;
      }
    }

    setErrorMessage("");
    return true;
  };

  // ✅ FIXED: Enhanced success detection function
  const isOperationSuccessful = (result) => {
    if (!result) return false;
    
    // Check for explicit success flags
    if (result.success === true || result.payload?.success === true) return true;
    
    // Check for HTTP status codes
    if (result.status === 200 || result.payload?.status === 200) return true;
    
    // Check for specific success messages
    if (result.Result === "Success!!" || result.payload?.Result === "Success!!") return true;
    
    // If we have data/ID, assume success
    if (result.MeasurementId || result.payload?.MeasurementId) return true;
    if (result.data?.MeasurementId || result.payload?.data?.MeasurementId) return true;
    
    // If no explicit error, assume success
    if (!result.error && !result.payload?.error) return true;
    
    return false;
  };

  // ✅ FIXED: Submit Add / Update with automatic refresh
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const data = new FormData();
      
      // ✅ FIX: Only append file if a new one is selected
      if (file) {
        data.append("file", file);
      }
      
      // ✅ FIX: Properly handle YardsRequired - don't set to 0 if empty
      data.append("GarmentTypeId", formData.GarmentTypeId);
      data.append("Neck", formData.Neck || "");
      data.append("Chest", formData.Chest || "");
      data.append("Waist", formData.Waist || "");
      data.append("Length", formData.Length || "");
      data.append("Description", formData.Description || "");
      data.append("CustomerId", formData.CustomerId);
      data.append("YardsRequired", formData.YardsRequired || ""); // ✅ FIX: Keep empty if not provided

      let result;
      if (editingMeasurement) {
        data.append("MeasurementId", formData.MeasurementId);
        result = await dispatch(UpdateMeasurement(data));
      } else {
        result = await dispatch(AddMeasurement(data));
      }

      // ✅ FIXED: Use the enhanced success detection
      if (isOperationSuccessful(result)) {
        setNotification({ 
          type: 'success', 
          message: `✅ ${editingMeasurement ? "Measurement updated successfully!" : "Measurement added successfully!"}` 
        });
        setShowModal(false);
        
        // ✅ FIX: Force complete data refresh by triggering refresh
        setRefreshTrigger(prev => prev + 1);
        
        // ✅ FIX: Additional refresh for search results if needed
        if (searchTerm) {
          const foundCustomer = customers.find(customer => 
            customer.FullName.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (foundCustomer) {
            dispatch(GetMeasurementsByCustomerId(foundCustomer.CustomerId));
          }
        }
        
      } else {
        // Extract error message from various possible locations
        const errorMsg = result?.error || 
                        result?.payload?.error || 
                        result?.message || 
                        result?.payload?.message || 
                        'Operation failed. Please try again.';
        setNotification({ type: 'error', message: `❌ ${errorMsg}` });
      }
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: `❌ Error: ${error.message || 'Failed to save measurement'}` 
      });
    }
  };

  const getCustomerName = (id) => {
    const c = customers.find((x) => x.CustomerId === id);
    return c ? c.FullName : `ID ${id}`;
  };
  
  const getGarmentTypeName = (id) => {
    const g = garmentTypes.find((x) => x.GarmentTypeId === id);
    return g ? g.GarmentTypeName : `ID ${id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-3 sm:p-4 md:p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
      {/* ✅ ENHANCED 3D Notification */}
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
      <div className="relative z-10 mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-3">
          <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
            <FiTool className="text-white text-lg sm:text-xl" />
          </div>
          <div className="transform ">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Measurements
            </h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Manage customer measurements and specifications
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 relative z-10">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Total Measurements</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {measurements.length}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
                <FiTool className="text-white text-sm sm:text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Customers</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {customers.length}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
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
                <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">Garment Types</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {garmentTypes.length}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg ml-2 sm:ml-3 flex-shrink-0">
                <FiScissors className="text-white text-sm sm:text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ UPDATED: Search + Add button with real-time search */}
      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          {/* Search Input */}
          <div className="relative flex-grow group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
            <input
              type="text"
              placeholder="Search by Customer Name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
            />
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={isMobile ? 18 : 20} />
          </div>

          <button
            onClick={openAddModal}
            className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95"
          >
            <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
            <FiPlusSquare className="mr-2 sm:mr-3 relative z-10" size={isMobile ? 18 : 20} />
            <span className="relative z-10 text-sm sm:text-base">Add Measurement</span>
          </button>
        </div>
      </div>

      {/* Enhanced 3D Table */}
      <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">ID</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Customer</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Garment Type</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Neck(inch)</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Chest(inch)</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Waist(inch)</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Length(inch)</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Yards Required</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Description</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Image</th>
                <th className="py-3 sm:py-4 px-2 text-left text-slate-700 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50">
              {currentMeasurements.length > 0 ? (
                currentMeasurements.map((m) => (
                  <tr 
                    key={m.MeasurementId} 
                    className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
                  >
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      {m.MeasurementId}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      {getCustomerName(m.CustomerId)}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      {getGarmentTypeName(m.GarmentTypeId)}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      {m.Neck || "-"}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      {m.Chest || "-"}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      {m.Waist || "-"}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      {m.Length || "-"}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      {m.YardsRequired || "-"}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm max-w-[120px] truncate" title={m.Description}>
                      {m.Description || "-"}
                    </td>
                    <td className="px-2 py-3 text-slate-600 text-sm">
                      {m.IMAGEURL ? (
                        <div className="relative group/image">
                          <div className="absolute inset-0 bg-blue-800 rounded-lg blur-md opacity-20 group-hover/image:opacity-30 transition duration-300"></div>
                          <img
                            src={m.IMAGEURL}
                            alt="Measurement"
                            className="relative w-8 h-8 rounded-lg border border-slate-200 object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                            onError={(e) => {
                              // ✅ FIXED: Use safe null-checking instead of optional chaining assignment
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                          {/* Fallback if image fails to load */}
                          <div className="hidden w-8 h-8 rounded-lg border border-slate-200 items-center justify-center bg-slate-100 shadow-lg">
                            <FiImage className="text-slate-400" size={12} />
                          </div>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center bg-slate-100 shadow-lg">
                          <FiImage className="text-slate-400" size={12} />
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() => openEditModal(m)}
                        className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
                        title="Edit Measurement"
                      >
                        <FiEdit2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-8 sm:py-12">
                    <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                      <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                        <FiTool className="text-slate-500 text-lg sm:text-xl" />
                      </div>
                      <p className="text-slate-500 font-medium text-sm sm:text-base">
                        {searchTerm ? `No measurements found for "${searchTerm}"` : "No measurements found"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        {measurements.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-3 sm:space-y-0">
            <div className="text-xs sm:text-sm text-slate-600 font-medium">
              Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, measurements.length)} of{' '}
              {measurements.length}
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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-700 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200"
              >
                <FiX className="text-lg" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl">
                  <FiTool className="text-white text-lg" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {editingMeasurement ? "Edit Measurement" : "Add Measurement"}
                </h2>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 text-red-700 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl border border-red-200 shadow-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Customer *
                    </label>
                    <Select
                      options={customers.map((c) => ({
                        value: c.CustomerId,
                        label: c.FullName,
                      }))}
                      value={
                        formData.CustomerId
                          ? {
                              value: formData.CustomerId,
                              label: customers.find(
                                (c) => c.CustomerId === formData.CustomerId
                              )?.FullName,
                            }
                          : null
                      }
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          CustomerId: selected.value,
                        }))
                      }
                      placeholder="Select Customer"
                      isSearchable
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>

                  {/* Garment Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Garment Type *
                    </label>
                    <Select
                      options={garmentTypes.map((g) => ({
                        value: g.GarmentTypeId,
                        label: g.GarmentTypeName,
                      }))}
                      value={
                        formData.GarmentTypeId
                          ? {
                              value: formData.GarmentTypeId,
                              label: garmentTypes.find(
                                (g) => g.GarmentTypeId === formData.GarmentTypeId
                              )?.GarmentTypeName,
                            }
                          : null
                      }
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          GarmentTypeId: selected.value,
                        }))
                      }
                      placeholder="Select Garment Type"
                      isSearchable
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>

                {/* Measurements Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Neck", "Chest", "Waist", "Length"].map((field) => (
                    <div key={field} className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {field} (inches) *
                      </label>
                      <input
                        type="number"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        onBlur={handleMeasurementBlur}
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 text-sm"
                        placeholder="0"
                        onKeyDown={(e) => {
                          // STRICTLY prevent negative numbers and invalid characters
                          if (['-', 'e', 'E', '+'].includes(e.key)) {
                            e.preventDefault();
                            setNotification({ 
                              type: 'error', 
                              message: `❌ ${field} cannot be negative! Only 0 or positive numbers allowed.` 
                            });
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Yards Required */}
                <div className="group">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Yards Required 
                  </label>
                  <input
                    type="number"
                    name="YardsRequired"
                    value={formData.YardsRequired}
                    onChange={handleChange}
                    onBlur={handleMeasurementBlur}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 text-sm"
                    placeholder="0"
                    onKeyDown={(e) => {
                      // STRICTLY prevent negative numbers and invalid characters
                      if (['-', 'e', 'E', '+'].includes(e.key)) {
                        e.preventDefault();
                        setNotification({ 
                          type: 'error', 
                          message: `❌ Yards Required cannot be negative! Only 0 or positive numbers allowed.` 
                        });
                      }
                    }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="Description"
                    value={formData.Description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 text-sm"
                    placeholder="Additional notes or description..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 text-sm"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Supported: JPEG, PNG, GIF • Max: 5MB</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-sm order-1 sm:order-2"
                  >
                    {editingMeasurement ? "Update Measurement" : "Add Measurement"}
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

export default Measurements;