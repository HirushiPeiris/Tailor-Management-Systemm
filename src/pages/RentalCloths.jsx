// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { 
//   GetAllRental, 
//   AddRentalCloths, 
//   UpdateRentalCloths,
//   ReturnCloth,
//   RequestCloth,
//   PhotoPrivew
// } from "../actions/rentalAction";
// import { GetAllCustomers } from "../actions/customerActions";
// import { GetAllCategory } from "../actions/categoryAction";
// import { 
//   FiPlus, 
//   FiEdit2, 
//   FiEye, 
//   FiSearch, 
//   FiGrid, 
//   FiList,
//   FiPackage,
//   FiDollarSign,
//   FiTag,
//   FiBox,
//   FiFilter,
//   FiRefreshCw,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiX,
//   FiChevronLeft,
//   FiChevronRight,
//   FiSave,
//   FiShoppingBag,
//   FiInfo,
//   FiShoppingCart,
//   FiRotateCw,
//   FiLayers,
//   FiArchive,
//   FiUser,
//   FiChevronDown,
//   FiImage,
//   FiCalendar,
//   FiUpload,
//   FiPaperclip,
//   FiDownload,
// } from "react-icons/fi";

// const formatCurrency = (amount) => {
//   return parseFloat(amount || 0).toLocaleString('en-IN', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   });
// };

// // Enhanced Image Component with Photo Preview Support
// const RentalImage = ({ src, alt, className, clothId }) => {
//   const [imageError, setImageError] = useState(false);
//   const [imageLoading, setImageLoading] = useState(true);

//   // Generate proper image URL using the photo preview endpoint
//   const imageUrl = clothId 
//     ? `https://tailorbackend.dockyardsoftware.com/Rental/PhotoPrivew?CID=${clothId}`
//     : src;

//   if (!imageUrl || imageError) {
//     return (
//       <div className={`${className} bg-slate-200 rounded-lg flex items-center justify-center mr-3`}>
//         <FiImage className="text-slate-400" size={16} />
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       {imageLoading && (
//         <div className={`${className} bg-slate-200 rounded-lg flex items-center justify-center absolute mr-3`}>
//           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//         </div>
//       )}
//       <img 
//         src={imageUrl}
//         alt={alt}
//         className={`${className} rounded-lg object-cover mr-3 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
//         onLoad={() => setImageLoading(false)}
//         onError={() => {
//           setImageError(true);
//           setImageLoading(false);
//         }}
//       />
//     </div>
//   );
// };

// // Custom hooks for rental data
// const useRentalData = () => {
//   return useSelector((state) => state.getAllRental);
// };

// const useRentalAddData = () => {
//   return useSelector((state) => state.addRental);
// };

// const useRentalUpdateData = () => {
//   return useSelector((state) => state.updateRental);
// };

// const useReturnClothData = () => {
//   return useSelector((state) => state.returnCloth);
// };

// const useRequestClothData = () => {
//   return useSelector((state) => state.requestCloth);
// };

// const usePhotoPreviewData = () => {
//   return useSelector((state) => state.photoPreview);
// };

// // Enhanced Customer Dropdown Component
// const CustomerDropdown = ({ 
//   value, 
//   onChange, 
//   customers = [], 
//   loading = false,
//   placeholder = "Search customer by name..."
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const dropdownRef = useRef(null);
//   const inputRef = useRef(null);

//   const customerList = useMemo(() => {
//     if (!customers) return [];
    
//     let customerArray = [];
    
//     if (customers.ResultSet && Array.isArray(customers.ResultSet)) {
//       customerArray = customers.ResultSet;
//     }
//     else if (customers.responseBody && Array.isArray(customers.responseBody)) {
//       customerArray = customers.responseBody;
//     }
//     else if (Array.isArray(customers)) {
//       customerArray = customers;
//     }
//     else if (customers.data && Array.isArray(customers.data)) {
//       customerArray = customers.data;
//     }
    
//     return customerArray
//       .filter(customer => customer && (customer.FullName || customer.CustomerName || customer.name))
//       .map(customer => ({
//         ...customer,
//         CustomerName: customer.FullName || customer.CustomerName || customer.name || 'Unknown Customer',
//         CustomerId: customer.CustomerId || customer.id || customer._id || '',
//         PhoneNumber: customer.PhoneNumber || customer.phone || customer.contact || '',
//         Email: customer.Email || customer.email || ''
//       }));
//   }, [customers]);

//   const filteredCustomers = useMemo(() => {
//     if (!searchTerm) return customerList;
    
//     return customerList.filter(customer => 
//       customer.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.CustomerId?.toString().includes(searchTerm.toLowerCase()) ||
//       customer.PhoneNumber?.includes(searchTerm) ||
//       customer.Email?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [customerList, searchTerm]);

//   useEffect(() => {
//     if (value && customerList.length > 0) {
//       const customer = customerList.find(c => 
//         c.CustomerId === value || 
//         c.CustomerId?.toString() === value
//       );
//       setSelectedCustomer(customer || null);
//     } else {
//       setSelectedCustomer(null);
//     }
//   }, [value, customerList]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleSelectCustomer = (customer) => {
//     setSelectedCustomer(customer);
//     onChange(customer.CustomerId);
//     setIsOpen(false);
//     setSearchTerm("");
//   };

//   const handleInputChange = (e) => {
//     setSearchTerm(e.target.value);
//     if (!isOpen) setIsOpen(true);
//   };

//   const handleFocus = () => {
//     setIsOpen(true);
//   };

//   const clearSelection = () => {
//     setSelectedCustomer(null);
//     setSearchTerm("");
//     onChange("");
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   };

//   const displayValue = selectedCustomer ? selectedCustomer.CustomerName : searchTerm;

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <div className="relative">
//         <input
//           ref={inputRef}
//           type="text"
//           value={displayValue}
//           onChange={handleInputChange}
//           onFocus={handleFocus}
//           placeholder={placeholder}
//           className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm"
//         />
//         <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
//           {selectedCustomer && (
//             <button
//               type="button"
//               onClick={clearSelection}
//               className="text-slate-400 hover:text-slate-600 transition-colors"
//             >
//               <FiX size={16} />
//             </button>
//           )}
//           <FiChevronDown 
//             className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
//             size={16} 
//           />
//         </div>
//       </div>

//       {isOpen && (
//         <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
//           {loading ? (
//             <div className="p-4 text-center text-slate-500">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-2 text-sm">Loading customers...</p>
//             </div>
//           ) : filteredCustomers.length === 0 ? (
//             <div className="p-4 text-center text-slate-500">
//               {searchTerm ? "No customers found" : "No customers available"}
//             </div>
//           ) : (
//             filteredCustomers.map((customer) => (
//               <div
//                 key={customer.CustomerId}
//                 onMouseDown={(e) => e.preventDefault()}
//                 onClick={() => handleSelectCustomer(customer)}
//                 className={`p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-slate-100 last:border-b-0 ${
//                   selectedCustomer?.CustomerId === customer.CustomerId ? 'bg-blue-100 border-blue-200' : ''
//                 }`}
//               >
//                 <div className="font-medium text-slate-800">
//                   {customer.CustomerName}
//                 </div>
//                 <div className="text-xs text-slate-500 mt-1">
//                   ID: {customer.CustomerId} | 
//                   Phone: {customer.PhoneNumber || 'N/A'} | 
//                   Email: {customer.Email || 'N/A'}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // Categories Dropdown Component
// const CategoriesDropdown = ({ 
//   value, 
//   onChange, 
//   categories = [], 
//   loading = false,
//   placeholder = "Select category"
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const dropdownRef = useRef(null);
//   const inputRef = useRef(null);

//   const categoryList = useMemo(() => {
//     if (!categories) return [];
    
//     let categoryArray = [];
    
//     if (categories.ResultSet && Array.isArray(categories.ResultSet)) {
//       categoryArray = categories.ResultSet;
//     }
//     else if (categories.responseBody && Array.isArray(categories.responseBody)) {
//       categoryArray = categories.responseBody;
//     }
//     else if (Array.isArray(categories)) {
//       categoryArray = categories;
//     }
//     else if (categories.data && Array.isArray(categories.data)) {
//       categoryArray = categories.data;
//     }
    
//     return categoryArray
//       .filter(category => category && (category.CategoryName || category.Name || category.name))
//       .map(category => ({
//         ...category,
//         CategoryName: category.CategoryName || category.Name || category.name || 'Unknown Category',
//         CategoryId: category.CategoryId || category.id || category._id || ''
//       }));
//   }, [categories]);

//   const filteredCategories = useMemo(() => {
//     if (!searchTerm) return categoryList;
    
//     return categoryList.filter(category => 
//       category.CategoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       category.CategoryId?.toString().includes(searchTerm.toLowerCase())
//     );
//   }, [categoryList, searchTerm]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleSelectCategory = (category) => {
//     onChange(category.CategoryId);
//     setIsOpen(false);
//     setSearchTerm("");
//   };

//   const handleInputChange = (e) => {
//     setSearchTerm(e.target.value);
//     if (!isOpen) setIsOpen(true);
//   };

//   const handleFocus = () => {
//     setIsOpen(true);
//   };

//   const selectedCategory = categoryList.find(cat => 
//     cat.CategoryId === value
//   );

//   const displayValue = selectedCategory ? selectedCategory.CategoryName : searchTerm;

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <div className="relative">
//         <input
//           ref={inputRef}
//           type="text"
//           value={displayValue}
//           onChange={handleInputChange}
//           onFocus={handleFocus}
//           placeholder={placeholder}
//           className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm"
//         />
//         <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//           <FiChevronDown 
//             className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
//             size={16} 
//           />
//         </div>
//       </div>

//       {isOpen && (
//         <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
//           {loading ? (
//             <div className="p-4 text-center text-slate-500">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-2 text-sm">Loading categories...</p>
//             </div>
//           ) : filteredCategories.length === 0 ? (
//             <div className="p-4 text-center text-slate-500">
//               {searchTerm ? "No categories found" : "No categories available"}
//             </div>
//           ) : (
//             filteredCategories.map((category) => (
//               <div
//                 key={category.CategoryId}
//                 onMouseDown={(e) => e.preventDefault()}
//                 onClick={() => handleSelectCategory(category)}
//                 className={`p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-slate-100 last:border-b-0 ${
//                   selectedCategory?.CategoryId === category.CategoryId ? 'bg-blue-100 border-blue-200' : ''
//                 }`}
//               >
//                 <div className="font-medium text-slate-800">
//                   {category.CategoryName}
//                 </div>
//                 {category.CategoryId && (
//                   <div className="text-xs text-slate-500 mt-1">
//                     ID: {category.CategoryId}
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const RentalCloths = () => {
//   const dispatch = useDispatch();
//   const [viewMode, setViewMode] = useState("table");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showReturnModal, setShowReturnModal] = useState(false);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [selectedCloth, setSelectedCloth] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [notification, setNotification] = useState({ message: "", type: "" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;
  
//   // Form states
//   const [formData, setFormData] = useState({
//     Name: "",
//     Color: "",
//     Size: "",
//     Quantity: "",
//     RentPrice: "",
//     Status: "Available",
//     CategoryId: "",
//     file: null
//   });

//   const [returnFormData, setReturnFormData] = useState({
//     RentalId: "",
//     IsDamaged: 0,
//     DamagePrice: "0"
//   });

//   const [requestFormData, setRequestFormData] = useState({
//     ClothId: "",
//     CustomerId: "",
//     RentQuantity: "",
//     RequestedSize: "",
//     Color: "",
//     RentPrice: ""
//   });

//   // === ADD THIS FUNCTION HERE ===
//   const addRentalTransaction = (requestData, cloth) => {
//     const savedTransactions = localStorage.getItem('rentalTransactions');
//     const existingTransactions = savedTransactions ? JSON.parse(savedTransactions) : [];
    
//     const newRentalId = existingTransactions.length > 0 
//       ? Math.max(...existingTransactions.map(t => t.RentalId)) + 1 
//       : 1;
    
//     const newTransaction = {
//       RentalId: newRentalId,
//       ClothId: requestData.ClothId,
//       CustomerId: requestData.CustomerId,
//       Quantity: parseInt(requestData.RentQuantity),
//       RequestedColor: requestData.Color,
//       RequestedSize: requestData.RequestedSize,
//       RentPrice: parseFloat(cloth.RentPrice),
//       RentDate: new Date().toISOString(),
//       ReturnDate: null,
//       Status: "Rented",
//       DamageFee: 0,
//       FinalAmount: cloth.RentPrice
//     };
    
//     const updatedTransactions = [newTransaction, ...existingTransactions];
//     localStorage.setItem('rentalTransactions', JSON.stringify(updatedTransactions));
    
//     return newTransaction;
//   };

//   // Get rental data from Redux store
//   const rentalState = useRentalData() || {};
//   const rentalData = useMemo(() => {
//     if (rentalState.ResultSet && Array.isArray(rentalState.ResultSet)) {
//       return rentalState.ResultSet;
//     }
//     return rentalState.data || [];
//   }, [rentalState]);
//   const loading = rentalState.loading || false;
//   const error = rentalState.error || null;

//   const addRentalState = useRentalAddData() || {};
//   const addLoading = addRentalState.loading || false;
//   const addSuccess = addRentalState.success || false;
//   const addMessage = addRentalState.message || null;

//   const updateRentalState = useRentalUpdateData() || {};
//   const updateLoading = updateRentalState.loading || false;
//   const updateSuccess = updateRentalState.success || false;
//   const updateMessage = updateRentalState.message || null;

//   const returnClothState = useReturnClothData() || {};
//   const returnLoading = returnClothState.loading || false;
//   const returnSuccess = returnClothState.success || false;
//   const returnMessage = returnClothState.message || null;

//   const requestClothState = useRequestClothData() || {};
//   const requestLoading = requestClothState.loading || false;
//   const requestSuccess = requestClothState.success || false;
//   const requestMessage = requestClothState.message || null;

//   const photoPreviewState = usePhotoPreviewData() || {};
  
//   // Customer data extraction
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

//   const customerLoading = customerState.loading || false;

//   // Categories data extraction
//   const categoriesState = useSelector((state) => state.getAllCategory || {});
//   const categoriesData = useMemo(() => {
//     if (!categoriesState) return [];
    
//     if (categoriesState.ResultSet && Array.isArray(categoriesState.ResultSet)) {
//       return categoriesState.ResultSet;
//     }
//     else if (categoriesState.responseBody && Array.isArray(categoriesState.responseBody)) {
//       return categoriesState.responseBody;
//     }
//     else if (Array.isArray(categoriesState.data)) {
//       return categoriesState.data;
//     }
//     else if (Array.isArray(categoriesState)) {
//       return categoriesState;
//     }
//     else {
//       return [];
//     }
//   }, [categoriesState]);

//   const categoriesLoading = categoriesState.loading || false;

//   // Function to get category name by ID
//   const getCategoryNameById = useMemo(() => {
//     return (categoryId) => {
//       if (!categoryId || !categoriesData.length) return "N/A";
      
//       const category = categoriesData.find(cat => 
//         cat.CategoryId === categoryId || 
//         cat.CategoryId?.toString() === categoryId?.toString()
//       );
      
//       return category?.CategoryName || category?.Name || category?.name || "N/A";
//     };
//   }, [categoriesData]);

//   // Enhanced rental data with category names
//   const enhancedRentalData = useMemo(() => {
//     if (!rentalData || !Array.isArray(rentalData)) return [];
    
//     return rentalData.map(cloth => ({
//       ...cloth,
//       CategoryName: getCategoryNameById(cloth.CategoryId)
//     }));
//   }, [rentalData, getCategoryNameById]);

//   useEffect(() => {
//     dispatch(GetAllRental());
//     dispatch(GetAllCustomers());
//     dispatch(GetAllCategory());
//   }, [dispatch]);

//   useEffect(() => {
//     if (addSuccess && addMessage) {
//       setNotification({ type: 'success', message: addMessage });
//       setShowAddModal(false);
//       setFormData({ 
//         Name: "", 
//         Color: "", 
//         Size: "", 
//         Quantity: "", 
//         RentPrice: "",
//         Status: "Available",
//         CategoryId: "",
//         file: null
//       });
//       dispatch(GetAllRental());
//     }
//   }, [addSuccess, addMessage, dispatch]);

//   useEffect(() => {
//     if (updateSuccess && updateMessage) {
//       setNotification({ type: 'success', message: updateMessage });
//       setShowEditModal(false);
//       setSelectedCloth(null);
//       setFormData({ 
//         Name: "", 
//         Color: "", 
//         Size: "", 
//         Quantity: "", 
//         RentPrice: "",
//         Status: "Available",
//         CategoryId: "",
//         file: null
//       });
//       dispatch(GetAllRental());
//     }
//   }, [updateSuccess, updateMessage, dispatch]);

//   useEffect(() => {
//     if (returnSuccess && returnMessage) {
//       setNotification({ type: 'success', message: returnMessage });
//       setShowReturnModal(false);
//       setReturnFormData({ RentalId: "", IsDamaged: 0, DamagePrice: "0" });
//       dispatch(GetAllRental());
//     }
//   }, [returnSuccess, returnMessage, dispatch]);

//   useEffect(() => {
//     if (requestSuccess && requestMessage) {
//       setNotification({ type: 'success', message: requestMessage });
//       setShowRequestModal(false);
//       setRequestFormData({ ClothId: "", CustomerId: "", RentQuantity: "", RequestedSize: "", Color: "" });
//       dispatch(GetAllRental());
//     }
//   }, [requestSuccess, requestMessage, dispatch]);

//   useEffect(() => {
//     if (error) {
//       setNotification({ type: 'error', message: error });
//     }
//   }, [error]);

//   useEffect(() => {
//     if (notification.message) {
//       const timer = setTimeout(() => {
//         setNotification({ message: "", type: "" });
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData(prev => ({
//         ...prev,
//         file: file
//       }));
//     }
//   };

//   const handleCategorySelect = (categoryId) => {
//     setFormData(prev => ({
//       ...prev,
//       CategoryId: categoryId
//     }));
//   };

//   const handleReturnInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setReturnFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
//     }));
//   };

//   const handleRequestInputChange = (e) => {
//     const { name, value } = e.target;
//     setRequestFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleCustomerSelect = (customerId) => {
//     setRequestFormData(prev => ({
//       ...prev,
//       CustomerId: customerId
//     }));
//   };

//   const handleAddCloth = async (e) => {
//     e.preventDefault();
//     try {
//       // Prepare data for API call - using FormData as per your service
//       const submitData = {
//         Name: formData.Name,
//         Color: formData.Color,
//         Size: formData.Size,
//         Quantity: parseInt(formData.Quantity) || 0,
//         RentPrice: parseFloat(formData.RentPrice) || 0,
//         Status: formData.Status,
//         CategoryId: formData.CategoryId || "",
//         file: formData.file // Send file directly
//       };

//       console.log('Submitting cloth data:', submitData);
//       await dispatch(AddRentalCloths(submitData));
//     } catch (error) {
//       console.error("Error adding cloth:", error);
//       setNotification({ type: 'error', message: 'Failed to add rental cloth' });
//     }
//   };

//   const handleEditCloth = (cloth) => {
//     setSelectedCloth(cloth);
//     setFormData({
//       Name: cloth.Name || "",
//       Color: cloth.Color || "",
//       Size: cloth.Size || "",
//       Quantity: cloth.Quantity || "",
//       RentPrice: cloth.RentPrice || "",
//       Status: cloth.Status || "Available",
//       CategoryId: cloth.CategoryId || "",
//       file: null // Reset file on edit
//     });
//     setShowEditModal(true);
//   };

//   const handleViewCloth = (cloth) => {
//     setSelectedCloth(cloth);
//     setShowDetailsModal(true);
//   };

//   const handleReturnCloth = (cloth) => {
//     setSelectedCloth(cloth);
//     setReturnFormData({
//       RentalId: cloth.RentalId || "",
//       IsDamaged: 0,
//       DamagePrice: "0"
//     });
//     setShowReturnModal(true);
//   };

//   const handleRequestCloth = (cloth) => {
//     setSelectedCloth(cloth);
//     setRequestFormData({
//       ClothId: cloth.ClothId || "",
//       CustomerId: "",
//       RentQuantity: "1",
//       RequestedSize: cloth.Size || "",
//       Color: cloth.Color || ""
//     });
//     setShowRequestModal(true);
//   };

//   const handleUpdateCloth = async (e) => {
//     e.preventDefault();
//     if (!selectedCloth) return;
    
//     try {
//       // Prepare data for API call - using FormData as per your service
//       const submitData = {
//         ClothId: selectedCloth.ClothId,
//         Name: formData.Name,
//         Color: formData.Color,
//         Size: formData.Size,
//         Quantity: parseInt(formData.Quantity) || 0,
//         RentPrice: parseFloat(formData.RentPrice) || 0,
//         Status: formData.Status,
//         CategoryId: formData.CategoryId || "",
//         file: formData.file // Send file directly
//       };

//       await dispatch(UpdateRentalCloths(submitData));
//     } catch (error) {
//       console.error("Error updating cloth:", error);
//       setNotification({ type: 'error', message: 'Failed to update rental cloth' });
//     }
//   };

//  const handleReturnSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     await dispatch(ReturnCloth(returnFormData));
    
//     // Update the transaction in localStorage
//     const savedTransactions = localStorage.getItem('rentalTransactions');
//     if (savedTransactions) {
//       const transactions = JSON.parse(savedTransactions);
//       const updatedTransactions = transactions.map(transaction => {
//         if (transaction.RentalId.toString() === returnFormData.RentalId.toString()) {
//           return {
//             ...transaction,
//             Status: "Returned",
//             ReturnDate: new Date().toISOString(),
//             DamageFee: returnFormData.IsDamaged ? parseFloat(returnFormData.DamagePrice) : 0,
//             FinalAmount: (parseFloat(transaction.RentPrice) + (returnFormData.IsDamaged ? parseFloat(returnFormData.DamagePrice) : 0)).toFixed(2)
//           };
//         }
//         return transaction;
//       });
//       localStorage.setItem('rentalTransactions', JSON.stringify(updatedTransactions));
//     }
    
//     setShowReturnModal(false);
//     setReturnFormData({ RentalId: "", IsDamaged: 0, DamagePrice: "0" });
//     dispatch(GetAllRental());
//   } catch (error) {
//     console.error("Error returning cloth:", error);
//     setNotification({ type: 'error', message: 'Failed to return cloth' });
//   }
// };

//   const handleRequestSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     await dispatch(RequestCloth(requestFormData));
    
//     // Add to rental transactions
//     addRentalTransaction(requestFormData, selectedCloth);
    
//     setShowRequestModal(false);
//     setRequestFormData({ ClothId: "", CustomerId: "", RentQuantity: "", RequestedSize: "", Color: "", RentPrice: "" });
//     dispatch(GetAllRental());
//   } catch (error) {
//     console.error("Error requesting cloth:", error);
//     setNotification({ type: 'error', message: 'Failed to request cloth' });
//   }
// };

//   const handleRefresh = () => {
//     dispatch(GetAllRental());
//     dispatch(GetAllCustomers());
//     dispatch(GetAllCategory());
//   };

//   // Filter and search logic with descending order
//   const filteredCloths = useMemo(() => {
//     if (!enhancedRentalData || !Array.isArray(enhancedRentalData)) return [];
    
//     const filtered = enhancedRentalData.filter(cloth => {
//       const matchesSearch = 
//         cloth.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cloth.Color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cloth.Size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cloth.ClothId?.toString().includes(searchTerm.toLowerCase()) ||
//         cloth.CategoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cloth.CategoryId?.toString().includes(searchTerm.toLowerCase());
      
//       const matchesFilter = filterStatus === "all" || 
//         (filterStatus === "available" && cloth.Quantity > 0) ||
//         (filterStatus === "out-of-stock" && cloth.Quantity === 0);
      
//       return matchesSearch && matchesFilter;
//     });

//     // Sort in descending order by ClothId (assuming higher IDs are newer)
//     return filtered.sort((a, b) => {
//       const idA = parseInt(a.ClothId) || 0;
//       const idB = parseInt(b.ClothId) || 0;
//       return idB - idA; // Descending order
//     });
//   }, [enhancedRentalData, searchTerm, filterStatus]);

//   // Size options for dropdown
//   const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

//   // Status options
//   const statusOptions = ["Available", "Not Available", "Maintenance", "Discontinued"];

//   // Calculate statistics
//   const totalCloths = enhancedRentalData?.length || 0;
//   const availableCloths = enhancedRentalData?.filter(item => item.Quantity > 0)?.length || 0;
//   const totalTypes = new Set(enhancedRentalData?.map(item => item.Name))?.size || 0;
//   const averagePrice = enhancedRentalData?.length > 0 
//     ? enhancedRentalData.reduce((sum, item) => sum + (item.RentPrice || 0), 0) / enhancedRentalData.length 
//     : 0;

//   // Pagination
//   const totalPages = Math.ceil(filteredCloths.length / recordsPerPage);
//   const currentRecords = useMemo(() => {
//     const indexOfLastRecord = currentPage * recordsPerPage;
//     const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//     return filteredCloths.slice(indexOfFirstRecord, indexOfLastRecord);
//   }, [filteredCloths, currentPage, recordsPerPage]);

//   const getPageNumbers = useMemo(() => {
//     const start = Math.max(1, currentPage - 1);
//     const end = Math.min(totalPages, start + 2);
//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//   }, [currentPage, totalPages]);

//   const getQuantityDisplay = (quantity) => {
//     return quantity === 0 ? "Out of Stock" : quantity;
//   };

//   const getQuantityColor = (quantity) => {
//     if (quantity === 0) return "text-black-600 ";
//     if (quantity <= 10) return "text-black-600";
//     return "text-black-600";
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'available': return 'text-green-600 bg-green-100';
//       case 'not available': return 'text-red-600 bg-red-100';
//       case 'maintenance': return 'text-orange-600 bg-orange-100';
//       case 'discontinued': return 'text-gray-600 bg-gray-100';
//       default: return 'text-blue-600 bg-blue-100';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-slate-600 font-medium">Loading rental cloths...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 md:p-6 relative overflow-hidden">
//       <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
//       {notification.message && (
//         <div
//           className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center animate-slide-in ${
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
//       <div className="relative z-10 mb-6 md:mb-8">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//           <div className="flex items-center space-x-4">
//             <div className="p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform rotate-3">
//               <FiShoppingBag className="text-white text-lg md:text-xl" />
//             </div>
//             <div className="transform -rotate-1">
//               <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                 Rental Cloths
//               </h1>
//               <p className="text-slate-600 mt-1 text-sm md:text-base">Manage your rental cloth inventory with style</p>
//             </div>
//           </div>
          
//           {/* View Toggle */}
//           <div className="flex items-center space-x-3 self-end lg:self-auto">
//             <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-xl">
//               <button
//                 onClick={() => setViewMode("table")}
//                 className={`p-3 rounded-xl transition-all duration-300 ${
//                   viewMode === "table" 
//                     ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
//                     : "text-slate-600 hover:text-slate-800"
//                 }`}
//                 title="Table View"
//               >
//                 <FiList size={18} />
//               </button>
//               <button
//                 onClick={() => setViewMode("card")}
//                 className={`p-3 rounded-xl transition-all duration-300 ${
//                   viewMode === "card" 
//                     ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
//                     : "text-slate-600 hover:text-slate-800"
//                 }`}
//                 title="Card View"
//               >
//                 <FiGrid size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Total Cloths</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">{totalCloths}</p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiPackage className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Available Items</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">{availableCloths}</p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiBox className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Total Types</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">{totalTypes}</p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiTag className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Avg. Rent Price</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">Rs. {formatCurrency(averagePrice)}</p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiDollarSign className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Controls Section */}
// {/* Controls Section */}
// <div className="relative z-10 mb-6 md:mb-8">
//   <div className="flex flex-col lg:flex-row gap-4">
//     {/* Search Input - Full width on mobile, flex on larger screens */}
//     <div className="relative flex-grow group">
//       <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//       <input
//         type="text"
//         placeholder="Search cloths by ID, name, color, size, or category..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="relative w-full pl-12 pr-6 py-3 md:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm md:text-base"
//       />
//       <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
//     </div>
    
//     {/* Filter and Add Button Container - Always in same row */}
//     <div className="flex items-center gap-3 w-full lg:w-auto">
//       {/* Filter Dropdown */}
//       <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl px-4 py-2 flex-1 lg:flex-none">
//         <FiFilter className="text-slate-400" />
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-700 font-medium w-full lg:w-auto"
//         >
//           <option value="all">All Cloths</option>
//           <option value="available">Available</option>
//           <option value="out-of-stock">Out of Stock</option>
//         </select>
//       </div>

//       {/* Add Button */}
//       <button
//         onClick={() => setShowAddModal(true)}
//         className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 md:px-6 py-3 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 whitespace-nowrap flex-1 lg:flex-none min-w-[140px] md:min-w-[180px]"
//       >
//         <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//         <FiPlus className="mr-2 relative z-10" size={18} />
//         <span className="relative z-10 text-sm md:text-base">Add Rental Cloth</span>
//       </button>
//     </div>
//   </div>
// </div>

//       {/* Table View */}
//       {viewMode === "table" ? (
//         <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-6 md:mb-8">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1000px]">
//               <thead>
//                 <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">ID</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Cloth Details</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Category</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Size</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Color</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Quantity</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Status</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Rent Price(Rs.)</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200/50">
//                 {currentRecords.length > 0 ? (
//                   currentRecords.map((cloth, index) => (
//                     <tr 
//                       key={cloth.ClothId || index} 
//                       className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
//                     >
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <div className="flex items-center">
//                           <span className="text-sm font-mono font-normal text-slate-900">
//                             {cloth.ClothId}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <div className="flex items-center">
//                           <RentalImage 
//                             src={cloth.IMAGEURL} 
//                             alt={cloth.Name}
//                             className="w-10 h-10 rounded-lg object-cover shadow-sm"
//                             clothId={cloth.ClothId}
//                           />
//                           <div>
//                             <div className="text-sm font-normal text-slate-900">
//                               {cloth.Name}
//                             </div>
//                             {cloth.CreatedDate && (
//                               <div className="text-xs text-slate-500">
//                                 Added: {new Date(cloth.CreatedDate).toLocaleDateString()}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <span className="text-sm font-normal text-slate-900">
//                           {cloth.CategoryName || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <span className="text-sm font-normal text-slate-900">
//                           {cloth.Size}
//                         </span>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <div className="flex items-center">
//                           <div 
//                             className="w-4 h-4 rounded-full border border-gray-300 mr-2 shadow-sm"
//                             style={{ backgroundColor: cloth.Color?.toLowerCase() }}
//                           ></div>
//                           <span className="text-sm text-slate-900 capitalize">
//                             {cloth.Color}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <span className={`text-sm font-normal ${getQuantityColor(cloth.Quantity)}`}>
//                           {getQuantityDisplay(cloth.Quantity)}
//                         </span>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(cloth.Status)}`}>
//                           {cloth.Status || "Available"}
//                         </span>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4 text-sm font-normal text-slate-900">
//                          {formatCurrency(cloth.RentPrice)}
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4 text-center">
//                         <div className="flex justify-center space-x-2">
//                           <button
//                             onClick={() => handleViewCloth(cloth)}
//                             className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                             title="View Details"
//                           >
//                             <FiEye size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleEditCloth(cloth)}
//                             className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                             title="Edit Cloth"
//                           >
//                             <FiEdit2 size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleRequestCloth(cloth)}
//                             className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                             title="Request Cloth"
//                             disabled={cloth.Quantity === 0}
//                           >
//                             <FiShoppingCart size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleReturnCloth(cloth)}
//                             className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                             title="Return Cloth"
//                           >
//                             <FiRotateCw size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="text-center py-8 md:py-12">
//                       <div className="flex flex-col items-center space-y-3">
//                         <div className="p-3 md:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                           <FiPackage className="text-slate-500 text-lg md:text-xl" />
//                         </div>
//                         <p className="text-slate-500 font-medium">No rental cloths found</p>
//                         <p className="text-slate-400 text-sm">
//                           {searchTerm || filterStatus !== "all" 
//                             ? "Try adjusting your search or filter criteria" 
//                             : "Get started by adding your first rental cloth"}
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {filteredCloths.length > recordsPerPage && (
//             <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-4 md:space-y-0">
//               <div className="text-sm text-slate-600">
//                 Showing {currentPage * recordsPerPage - recordsPerPage + 1}–{Math.min(currentPage * recordsPerPage, filteredCloths.length)} of{' '}
//                 {filteredCloths.length}
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                 >
//                   <FiChevronLeft size={14} />
//                 </button>

//                 {getPageNumbers.map((page) => (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`px-2 md:px-3.5 py-1 md:py-1.5 rounded-xl border transition-all duration-300 transform hover:scale-105 text-sm ${
//                       currentPage === page
//                         ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
//                         : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}

//                 <button
//                   onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                 >
//                   <FiChevronRight size={14} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       ) : (
//         /* Card View */
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
//           {currentRecords.map((cloth, index) => (
//             <div 
//               key={cloth.ClothId || index} 
//               className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group overflow-hidden cursor-pointer"
//               onClick={() => handleViewCloth(cloth)}
//             >
//               <div className="h-40 overflow-hidden bg-slate-100">
//                 <RentalImage 
//                   src={cloth.IMAGEURL} 
//                   alt={cloth.Name}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                   clothId={cloth.ClothId}
//                 />
//               </div>
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
//                       <FiPackage className="text-blue-600 text-lg" />
//                     </div>
//                     <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
//                       ID: {cloth.ClothId}
//                     </span>
//                   </div>
//                   <span className={`text-xs font-semibold ${getQuantityColor(cloth.Quantity)}`}>
//                     {getQuantityDisplay(cloth.Quantity)}
//                   </span>
//                 </div>
                
//                 <h3 className="font-bold text-slate-900 text-lg mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
//                   {cloth.Name}
//                 </h3>
                
//                 {cloth.CategoryName && (
//                   <div className="mb-3">
//                     <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
//                       {cloth.CategoryName}
//                     </span>
//                   </div>
//                 )}
                
//                 <div className="space-y-3 mb-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Size:</span>
//                     <span className="text-sm font-semibold text-slate-900">
//                       {cloth.Size}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Color:</span>
//                     <div className="flex items-center space-x-2">
//                       <div 
//                         className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
//                         style={{ backgroundColor: cloth.Color?.toLowerCase() }}
//                       ></div>
//                       <span className="text-sm font-semibold text-slate-900 capitalize">
//                         {cloth.Color}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Status:</span>
//                     <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(cloth.Status)}`}>
//                       {cloth.Status || "Available"}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Rent Price:</span>
//                     <span className="text-sm font-bold text-slate-900">
//                       Rs. {formatCurrency(cloth.RentPrice)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Add Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform rotate-1"></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <div className="flex items-center justify-between mb-4 md:mb-6">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                     <FiPlus className="text-white text-base md:text-lg" />
//                   </div>
//                   <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                     Add Rental Cloth
//                   </h2>
//                 </div>
//                 <button 
//                   onClick={() => {
//                     setShowAddModal(false);
//                     setFormData(prev => ({ ...prev, file: null }));
//                   }}
//                   className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleAddCloth} className="space-y-4 md:space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Cloth Name *</label>
//                     <input
//                       type="text"
//                       name="Name"
//                       value={formData.Name}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                       placeholder="Enter cloth name"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Color *</label>
//                     <input
//                       type="text"
//                       name="Color"
//                       value={formData.Color}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                       placeholder="Enter color"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Size *</label>
//                     <select
//                       name="Size"
//                       value={formData.Size}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     >
//                       <option value="">Select size</option>
//                       {sizeOptions.map(size => (
//                         <option key={size} value={size}>{size}</option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Quantity *</label>
//                     <input
//                       type="number"
//                       name="Quantity"
//                       value={formData.Quantity}
//                       onChange={handleInputChange}
//                       required
//                       min="0"
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                       placeholder="Enter quantity"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Rent Price (Rs.) *</label>
//                     <input
//                       type="number"
//                       name="RentPrice"
//                       value={formData.RentPrice}
//                       onChange={handleInputChange}
//                       required
//                       min="1"
//                       step="0.01"
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                       placeholder="Enter rent price"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
//                     <select
//                       name="Status"
//                       value={formData.Status}
//                       onChange={handleInputChange}
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     >
//                       {statusOptions.map(status => (
//                         <option key={status} value={status}>{status}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
//                     <CategoriesDropdown
//                       value={formData.CategoryId}
//                       onChange={handleCategorySelect}
//                       categories={categoriesData}
//                       loading={categoriesLoading}
//                       placeholder="Select category"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Cloth Image
//                       <span className="text-slate-400 text-xs ml-1">(Optional)</span>
//                     </label>
                    
//                     <div className="space-y-4">
//                       <div className="relative group">
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageChange}
//                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
//                           id="image-upload-add"
//                         />
//                         <div className="w-full px-6 py-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50 group-hover:shadow-lg text-center cursor-pointer">
//                           <FiUpload className="mx-auto text-slate-400 mb-3 group-hover:text-blue-500 transition-colors" size={32} />
//                           <p className="text-sm font-medium text-slate-600 mb-1">
//                             {formData.file ? formData.file.name : "Click to upload image"}
//                           </p>
//                           <p className="text-xs text-slate-500">
//                             Supports: PNG, JPG, JPEG, WEBP • Max: 5MB
//                           </p>
//                         </div>
//                       </div>

//                       {formData.file && (
//                         <div className="flex flex-col items-center space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
//                           <div className="flex items-center justify-between w-full">
//                             <p className="text-sm font-medium text-slate-700">Image Preview:</p>
//                             <button
//                               type="button"
//                               onClick={() => setFormData(prev => ({ ...prev, file: null }))}
//                               className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors text-sm"
//                             >
//                               <FiX size={14} />
//                               <span>Remove</span>
//                             </button>
//                           </div>
//                           <div className="relative">
//                             <img 
//                               src={URL.createObjectURL(formData.file)} 
//                               alt="Preview"
//                               className="w-40 h-40 object-cover rounded-xl shadow-lg border border-slate-300"
//                             />
//                           </div>
//                           <div className="text-center">
//                             <p className="text-xs text-slate-600 font-medium">{formData.file.name}</p>
//                             <p className="text-xs text-slate-500">
//                               Size: {(formData.file.size / 1024 / 1024).toFixed(2)} MB • 
//                               Type: {formData.file.type.split('/')[1]?.toUpperCase()}
//                             </p>
//                           </div>
//                         </div>
//                       )}

//                       {!formData.file && (
//                         <div className="text-center">
//                           <div className="inline-flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-full">
//                             <FiInfo className="text-blue-500" size={14} />
//                             <span>No image selected. You can add one later.</span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowAddModal(false);
//                       setFormData(prev => ({ ...prev, file: null }));
//                     }}
//                     className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={addLoading}
//                     className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
//                   >
//                     {addLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         <span>Adding...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FiPlus size={16} />
//                         <span>Add Cloth</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && selectedCloth && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform rotate-1"></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <div className="flex items-center justify-between mb-4 md:mb-6">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                     <FiEdit2 className="text-white text-base md:text-lg" />
//                   </div>
//                   <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                     Edit Rental Cloth
//                   </h2>
//                 </div>
//                 <button 
//                   onClick={() => setShowEditModal(false)}
//                   className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleUpdateCloth} className="space-y-4 md:space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Cloth Name *</label>
//                     <input
//                       type="text"
//                       name="Name"
//                       value={formData.Name}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Color *</label>
//                     <input
//                       type="text"
//                       name="Color"
//                       value={formData.Color}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Size *</label>
//                     <select
//                       name="Size"
//                       value={formData.Size}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     >
//                       <option value="">Select size</option>
//                       {sizeOptions.map(size => (
//                         <option key={size} value={size}>{size}</option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Quantity *</label>
//                     <input
//                       type="number"
//                       name="Quantity"
//                       value={formData.Quantity}
//                       onChange={handleInputChange}
//                       required
//                       min="0"
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Rent Price (Rs.) *</label>
//                     <input
//                       type="number"
//                       name="RentPrice"
//                       value={formData.RentPrice}
//                       onChange={handleInputChange}
//                       required
//                       min="1"
//                       step="0.01"
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
//                     <select
//                       name="Status"
//                       value={formData.Status}
//                       onChange={handleInputChange}
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     >
//                       {statusOptions.map(status => (
//                         <option key={status} value={status}>{status}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
//                     <CategoriesDropdown
//                       value={formData.CategoryId}
//                       onChange={handleCategorySelect}
//                       categories={categoriesData}
//                       loading={categoriesLoading}
//                       placeholder="Select category"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Cloth Image</label>
//                     <div className="flex items-center space-x-4">
//                       <div className="flex-1">
//                         <div className="relative">
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                             id="image-upload-edit"
//                           />
//                           <div className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50 text-center cursor-pointer">
//                             <FiUpload className="mx-auto text-slate-400 mb-2" size={24} />
//                             <p className="text-sm text-slate-600">
//                               {formData.file ? formData.file.name : "Click to upload new image"}
//                             </p>
//                             <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
//                           </div>
//                         </div>
//                       </div>
//                       {formData.file ? (
//                         <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
//                           <img 
//                             src={URL.createObjectURL(formData.file)} 
//                             alt="Preview"
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       ) : (
//                         <RentalImage 
//                           src={selectedCloth.IMAGEURL} 
//                           alt="Current"
//                           className="w-20 h-20 rounded-lg object-cover border border-slate-200"
//                           clothId={selectedCloth.ClothId}
//                         />
//                       )}
//                     </div>
//                     {!formData.file && (
//                       <p className="text-xs text-slate-500 mt-2">Current image will be kept if no new image is selected</p>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowEditModal(false)}
//                     className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={updateLoading}
//                     className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
//                   >
//                     {updateLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         <span>Updating...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FiSave size={16} />
//                         <span>Update Cloth</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Return Modal */}
//       {showReturnModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-2xl">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform rotate-1"></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <div className="flex items-center justify-between mb-4 md:mb-6">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                     <FiRotateCw className="text-white text-base md:text-lg" />
//                   </div>
//                   <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                     Return Rental Cloth
//                   </h2>
//                 </div>
//                 <button 
//                   onClick={() => setShowReturnModal(false)}
//                   className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleReturnSubmit} className="space-y-4 md:space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Rental ID *</label>
//                   <input
//                     type="text"
//                     name="RentalId"
//                     value={returnFormData.RentalId}
//                     onChange={handleReturnInputChange}
//                     required
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     placeholder="Enter rental ID"
//                   />
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
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                       placeholder="Enter damage price"
//                     />
//                   </div>
//                 )}
                
//                 <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowReturnModal(false)}
//                     className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={returnLoading}
//                     className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
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

//       {/* Request Modal with Customer Dropdown */}
//       {showRequestModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-2xl">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform rotate-1"></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <div className="flex items-center justify-between mb-4 md:mb-6">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                     <FiShoppingCart className="text-white text-base md:text-lg" />
//                   </div>
//                   <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                     Request Rental Cloth
//                   </h2>
//                 </div>
//                 <button 
//                   onClick={() => setShowRequestModal(false)}
//                   className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleRequestSubmit} className="space-y-4 md:space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Cloth ID </label>
//                   <input
//                     type="text"
//                     name="ClothId"
//                     value={requestFormData.ClothId}
//                     onChange={handleRequestInputChange}
//                     required
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     placeholder="Enter cloth ID"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Customer </label>
//                   <CustomerDropdown
//                     value={requestFormData.CustomerId}
//                     onChange={handleCustomerSelect}
//                     customers={customerData}
//                     loading={customerLoading}
//                     placeholder="Search customer by name..."
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Rent Quantity </label>
//                   <input
//                     type="number"
//                     name="RentQuantity"
//                     value={requestFormData.RentQuantity}
//                     onChange={handleRequestInputChange}
//                     required
//                     min="1"
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     placeholder="Enter quantity to rent"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Requested Size</label>
//                   <select
//                     name="RequestedSize"
//                     value={requestFormData.RequestedSize}
//                     onChange={handleRequestInputChange}
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                   >
//                     <option value="">Select size</option>
//                     {sizeOptions.map(size => (
//                       <option key={size} value={size}>{size}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
//                   <input
//                     type="text"
//                     name="Color"
//                     value={requestFormData.Color}
//                     onChange={handleRequestInputChange}
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     placeholder="Enter color"
//                   />
//                 </div>
                
//                 <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowRequestModal(false)}
//                     className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={requestLoading || !requestFormData.CustomerId}
//                     className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
//                   >
//                     {requestLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         <span>Requesting...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FiShoppingCart size={16} />
//                         <span>Request Cloth</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Enhanced Details Modal */}
//             {/* Simplified View Modal for Card Click */}
//       {showDetailsModal && selectedCloth && (
//         <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-2 sm:p-4">
//           <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform rotate-1"></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-h-full overflow-y-auto">
//               <div className="p-4 sm:p-6">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-4 sm:mb-6">
//                   <div className="flex items-center space-x-2 sm:space-x-3">
//                     <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                       <FiShoppingBag className="text-white text-base sm:text-lg" />
//                     </div>
//                     <h2 className="text-xl sm:text-2xl font-normal bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                       Cloth Details
//                     </h2>
//                   </div>
//                   <button 
//                     onClick={() => setShowDetailsModal(false)}
//                     className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                   >
//                     <FiX className="text-xl sm:text-2xl" />
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
//                   {/* Image Section */}
//                   <div>
//     <h3 className="text-base sm:text-lg font-normal mb-3 sm:mb-4 text-slate-800">Cloth Image</h3>
//     <div className="border-2 border-slate-300 rounded-2xl overflow-hidden shadow-lg">
//       <RentalImage 
//         src={selectedCloth.IMAGEURL} 
//         alt={selectedCloth.Name}
//         className="w-full h-auto max-h-64 sm:max-h-96 object-contain"
//         clothId={selectedCloth.ClothId}
//       />
//     </div>
    
//     {/* Download Button - Fixed Version */}
//     {selectedCloth.ClothId && (
//       <div className="mt-3 sm:mt-4 flex justify-center">
//         <a 
//           href={selectedCloth.IMAGEURL || `https://tailorbackend.dockyardsoftware.com/Rental/PhotoPrivew?CID=${selectedCloth.ClothId}`}
//           download={`${(selectedCloth.Name || 'cloth').replace(/\s+/g, '_')}_${selectedCloth.ClothId}.jpg`}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="px-4 sm:px-6 py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center font-normal text-sm sm:text-base"
//         >
//           <FiDownload className="mr-1 sm:mr-2" />
//           Download Image
//         </a>
//       </div>
//     )}
//   </div>

//                   {/* Cloth Details Section */}
//                   <div>
//                     <h3 className="text-base sm:text-lg font-normal mb-3 sm:mb-4 text-slate-800">Cloth Information</h3>
//                     <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-6 border border-slate-200/50">
//                       <table className="w-full border-collapse text-sm sm:text-base">
//                         <tbody>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700 w-1/2">Cloth ID</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-900">
//                               {selectedCloth.ClothId}
//                             </td>
//                           </tr>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Name</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-900">
//                               {selectedCloth.Name}
//                             </td>
//                           </tr>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Category</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-900">
//                               {getCategoryNameById(selectedCloth.CategoryId) || "N/A"}
//                             </td>
//                           </tr>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Size</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-900">
//                               {selectedCloth.Size}
//                             </td>
//                           </tr>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Color</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-900">
//                               <div className="flex items-center">
//                                 <div 
//                                   className="w-4 h-4 rounded-full border border-slate-300 mr-2 shadow-sm"
//                                   style={{ backgroundColor: selectedCloth.Color?.toLowerCase() }}
//                                 ></div>
//                                 <span className="capitalize">
//                                   {selectedCloth.Color}
//                                 </span>
//                               </div>
//                             </td>
//                           </tr>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Quantity</td>
//                             <td className={`py-2 sm:py-3 px-2 sm:px-4 font-normal ${getQuantityColor(selectedCloth.Quantity)}`}>
//                               {getQuantityDisplay(selectedCloth.Quantity)}
//                             </td>
//                           </tr>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Status</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4">
//                               <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedCloth.Status)}`}>
//                                 {selectedCloth.Status || "Available"}
//                               </span>
//                             </td>
//                           </tr>
//                           <tr>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Rent Price</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-green-700">
//                               Rs. {formatCurrency(selectedCloth.RentPrice)}
//                             </td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Quick Actions */}
//                     {/* <div className="mt-4 sm:mt-6">
//                       <h3 className="text-base sm:text-lg font-normal mb-3 sm:mb-4 text-slate-800">Quick Actions</h3>
//                       <div className="flex flex-wrap gap-2">
//                         <button
//                           onClick={() => {
//                             setShowDetailsModal(false);
//                             handleEditCloth(selectedCloth);
//                           }}
//                           className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal text-sm"
//                         >
//                           <FiEdit2 size={16} />
//                           <span>Edit</span>
//                         </button>
//                         <button
//                           onClick={() => {
//                             setShowDetailsModal(false);
//                             handleRequestCloth(selectedCloth);
//                           }}
//                           disabled={selectedCloth.Quantity === 0}
//                           className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-green-800 to-green-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-normal text-sm"
//                         >
//                           <FiShoppingCart size={16} />
//                           <span>Request</span>
//                         </button>
//                         <button
//                           onClick={() => {
//                             setShowDetailsModal(false);
//                             handleReturnCloth(selectedCloth);
//                           }}
//                           className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-orange-800 to-orange-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal text-sm"
//                         >
//                           <FiRotateCw size={16} />
//                           <span>Return</span>
//                         </button>
//                       </div>
//                     </div> */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RentalCloths;

// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { 
//   GetAllRental, 
//   AddRentalCloths, 
//   UpdateRentalCloths,
//   ReturnCloth,
//   RequestCloth,
//   PhotoPrivew
// } from "../actions/rentalAction";
// import { GetAllCustomers } from "../actions/customerActions";
// import { GetAllCategory } from "../actions/categoryAction";
// import { 
//   FiPlus, 
//   FiEdit2, 
//   FiEye, 
//   FiSearch, 
//   FiGrid, 
//   FiList,
//   FiPackage,
//   FiDollarSign,
//   FiTag,
//   FiBox,
//   FiFilter,
//   FiRefreshCw,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiX,
//   FiChevronLeft,
//   FiChevronRight,
//   FiSave,
//   FiShoppingBag,
//   FiInfo,
//   FiShoppingCart,
//   FiRotateCw,
//   FiLayers,
//   FiArchive,
//   FiUser,
//   FiChevronDown,
//   FiImage,
//   FiCalendar,
//   FiUpload,
//   FiPaperclip,
//   FiDownload,
// } from "react-icons/fi";

// const formatCurrency = (amount) => {
//   return parseFloat(amount || 0).toLocaleString('en-IN', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   });
// };

// // Enhanced Image Component with Photo Preview Support
// const RentalImage = ({ src, alt, className, clothId }) => {
//   const [imageError, setImageError] = useState(false);
//   const [imageLoading, setImageLoading] = useState(true);

//   // Generate proper image URL using the photo preview endpoint
//   const imageUrl = clothId 
//     ? `https://tailorbackend.dockyardsoftware.com/Rental/PhotoPrivew?CID=${clothId}`
//     : src;

//   if (!imageUrl || imageError) {
//     return (
//       <div className={`${className} bg-slate-200 rounded-lg flex items-center justify-center mr-3`}>
//         <FiImage className="text-slate-400" size={16} />
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       {imageLoading && (
//         <div className={`${className} bg-slate-200 rounded-lg flex items-center justify-center absolute mr-3`}>
//           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//         </div>
//       )}
//       <img 
//         src={imageUrl}
//         alt={alt}
//         className={`${className} rounded-lg object-cover mr-3 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
//         onLoad={() => setImageLoading(false)}
//         onError={() => {
//           setImageError(true);
//           setImageLoading(false);
//         }}
//       />
//     </div>
//   );
// };

// // Custom hooks for rental data
// const useRentalData = () => {
//   return useSelector((state) => state.getAllRental);
// };

// const useRentalAddData = () => {
//   return useSelector((state) => state.addRental);
// };

// const useRentalUpdateData = () => {
//   return useSelector((state) => state.updateRental);
// };

// const useReturnClothData = () => {
//   return useSelector((state) => state.returnCloth);
// };

// const useRequestClothData = () => {
//   return useSelector((state) => state.requestCloth);
// };

// const usePhotoPreviewData = () => {
//   return useSelector((state) => state.photoPreview);
// };

// // Enhanced Customer Dropdown Component
// const CustomerDropdown = ({ 
//   value, 
//   onChange, 
//   customers = [], 
//   loading = false,
//   placeholder = "Search customer by name..."
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const dropdownRef = useRef(null);
//   const inputRef = useRef(null);

//   const customerList = useMemo(() => {
//     if (!customers) return [];
    
//     let customerArray = [];
    
//     if (customers.ResultSet && Array.isArray(customers.ResultSet)) {
//       customerArray = customers.ResultSet;
//     }
//     else if (customers.responseBody && Array.isArray(customers.responseBody)) {
//       customerArray = customers.responseBody;
//     }
//     else if (Array.isArray(customers)) {
//       customerArray = customers;
//     }
//     else if (customers.data && Array.isArray(customers.data)) {
//       customerArray = customers.data;
//     }
    
//     return customerArray
//       .filter(customer => customer && (customer.FullName || customer.CustomerName || customer.name))
//       .map(customer => ({
//         ...customer,
//         CustomerName: customer.FullName || customer.CustomerName || customer.name || 'Unknown Customer',
//         CustomerId: customer.CustomerId || customer.id || customer._id || '',
//         PhoneNumber: customer.PhoneNumber || customer.phone || customer.contact || '',
//         Email: customer.Email || customer.email || ''
//       }));
//   }, [customers]);

//   const filteredCustomers = useMemo(() => {
//     if (!searchTerm) return customerList;
    
//     return customerList.filter(customer => 
//       customer.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.CustomerId?.toString().includes(searchTerm.toLowerCase()) ||
//       customer.PhoneNumber?.includes(searchTerm) ||
//       customer.Email?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [customerList, searchTerm]);

//   useEffect(() => {
//     if (value && customerList.length > 0) {
//       const customer = customerList.find(c => 
//         c.CustomerId === value || 
//         c.CustomerId?.toString() === value
//       );
//       setSelectedCustomer(customer || null);
//     } else {
//       setSelectedCustomer(null);
//     }
//   }, [value, customerList]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleSelectCustomer = (customer) => {
//     setSelectedCustomer(customer);
//     onChange(customer.CustomerId);
//     setIsOpen(false);
//     setSearchTerm("");
//   };

//   const handleInputChange = (e) => {
//     setSearchTerm(e.target.value);
//     if (!isOpen) setIsOpen(true);
//   };

//   const handleFocus = () => {
//     setIsOpen(true);
//   };

//   const clearSelection = () => {
//     setSelectedCustomer(null);
//     setSearchTerm("");
//     onChange("");
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   };

//   const displayValue = selectedCustomer ? selectedCustomer.CustomerName : searchTerm;

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <div className="relative">
//         <input
//           ref={inputRef}
//           type="text"
//           value={displayValue}
//           onChange={handleInputChange}
//           onFocus={handleFocus}
//           placeholder={placeholder}
//           className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm"
//         />
//         <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
//           {selectedCustomer && (
//             <button
//               type="button"
//               onClick={clearSelection}
//               className="text-slate-400 hover:text-slate-600 transition-colors"
//             >
//               <FiX size={16} />
//             </button>
//           )}
//           <FiChevronDown 
//             className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
//             size={16} 
//           />
//         </div>
//       </div>

//       {isOpen && (
//         <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
//           {loading ? (
//             <div className="p-4 text-center text-slate-500">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-2 text-sm">Loading customers...</p>
//             </div>
//           ) : filteredCustomers.length === 0 ? (
//             <div className="p-4 text-center text-slate-500">
//               {searchTerm ? "No customers found" : "No customers available"}
//             </div>
//           ) : (
//             filteredCustomers.map((customer) => (
//               <div
//                 key={customer.CustomerId}
//                 onMouseDown={(e) => e.preventDefault()}
//                 onClick={() => handleSelectCustomer(customer)}
//                 className={`p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-slate-100 last:border-b-0 ${
//                   selectedCustomer?.CustomerId === customer.CustomerId ? 'bg-blue-100 border-blue-200' : ''
//                 }`}
//               >
//                 <div className="font-medium text-slate-800">
//                   {customer.CustomerName}
//                 </div>
//                 <div className="text-xs text-slate-500 mt-1">
//                   ID: {customer.CustomerId} | 
//                   Phone: {customer.PhoneNumber || 'N/A'} | 
//                   Email: {customer.Email || 'N/A'}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // Categories Dropdown Component
// const CategoriesDropdown = ({ 
//   value, 
//   onChange, 
//   categories = [], 
//   loading = false,
//   placeholder = "Select category"
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const dropdownRef = useRef(null);
//   const inputRef = useRef(null);

//   const categoryList = useMemo(() => {
//     if (!categories) return [];
    
//     let categoryArray = [];
    
//     if (categories.ResultSet && Array.isArray(categories.ResultSet)) {
//       categoryArray = categories.ResultSet;
//     }
//     else if (categories.responseBody && Array.isArray(categories.responseBody)) {
//       categoryArray = categories.responseBody;
//     }
//     else if (Array.isArray(categories)) {
//       categoryArray = categories;
//     }
//     else if (categories.data && Array.isArray(categories.data)) {
//       categoryArray = categories.data;
//     }
    
//     return categoryArray
//       .filter(category => category && (category.CategoryName || category.Name || category.name))
//       .map(category => ({
//         ...category,
//         CategoryName: category.CategoryName || category.Name || category.name || 'Unknown Category',
//         CategoryId: category.CategoryId || category.id || category._id || ''
//       }));
//   }, [categories]);

//   const filteredCategories = useMemo(() => {
//     if (!searchTerm) return categoryList;
    
//     return categoryList.filter(category => 
//       category.CategoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       category.CategoryId?.toString().includes(searchTerm.toLowerCase())
//     );
//   }, [categoryList, searchTerm]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleSelectCategory = (category) => {
//     onChange(category.CategoryId);
//     setIsOpen(false);
//     setSearchTerm("");
//   };

//   const handleInputChange = (e) => {
//     setSearchTerm(e.target.value);
//     if (!isOpen) setIsOpen(true);
//   };

//   const handleFocus = () => {
//     setIsOpen(true);
//   };

//   const selectedCategory = categoryList.find(cat => 
//     cat.CategoryId === value
//   );

//   const displayValue = selectedCategory ? selectedCategory.CategoryName : searchTerm;

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <div className="relative">
//         <input
//           ref={inputRef}
//           type="text"
//           value={displayValue}
//           onChange={handleInputChange}
//           onFocus={handleFocus}
//           placeholder={placeholder}
//           className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm"
//         />
//         <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//           <FiChevronDown 
//             className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
//             size={16} 
//           />
//         </div>
//       </div>

//       {isOpen && (
//         <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
//           {loading ? (
//             <div className="p-4 text-center text-slate-500">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-2 text-sm">Loading categories...</p>
//             </div>
//           ) : filteredCategories.length === 0 ? (
//             <div className="p-4 text-center text-slate-500">
//               {searchTerm ? "No categories found" : "No categories available"}
//             </div>
//           ) : (
//             filteredCategories.map((category) => (
//               <div
//                 key={category.CategoryId}
//                 onMouseDown={(e) => e.preventDefault()}
//                 onClick={() => handleSelectCategory(category)}
//                 className={`p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-slate-100 last:border-b-0 ${
//                   selectedCategory?.CategoryId === category.CategoryId ? 'bg-blue-100 border-blue-200' : ''
//                 }`}
//               >
//                 <div className="font-medium text-slate-800">
//                   {category.CategoryName}
//                 </div>
//                 {category.CategoryId && (
//                   <div className="text-xs text-slate-500 mt-1">
//                     ID: {category.CategoryId}
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const RentalCloths = () => {
//   const dispatch = useDispatch();
//   const [viewMode, setViewMode] = useState("table");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [selectedCloth, setSelectedCloth] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [notification, setNotification] = useState({ message: "", type: "" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;
  
//   // Form states
//   const [formData, setFormData] = useState({
//     Name: "",
//     Color: "",
//     Size: "",
//     Quantity: "",
//     RentPrice: "",
//     Status: "Available",
//     CategoryId: "",
//     file: null
//   });

//   const [requestFormData, setRequestFormData] = useState({
//     ClothId: "",
//     CustomerId: "",
//     RentQuantity: "",
//     RequestedSize: "",
//     Color: "",
//     RentPrice: ""
//   });

//   // Function to add rental transaction to localStorage
//   const addRentalTransaction = (requestData, cloth) => {
//     const savedTransactions = localStorage.getItem('rentalTransactions');
//     const existingTransactions = savedTransactions ? JSON.parse(savedTransactions) : [];
    
//     const newRentalId = existingTransactions.length > 0 
//       ? Math.max(...existingTransactions.map(t => t.RentalId)) + 1 
//       : 1;
    
//     const newTransaction = {
//       RentalId: newRentalId,
//       ClothId: requestData.ClothId,
//       CustomerId: requestData.CustomerId,
//       Quantity: parseInt(requestData.RentQuantity),
//       RequestedColor: requestData.Color,
//       RequestedSize: requestData.RequestedSize,
//       RentPrice: parseFloat(cloth.RentPrice),
//       RentDate: new Date().toISOString(),
//       ReturnDate: null,
//       Status: "Rented",
//       DamageFee: 0,
//       FinalAmount: cloth.RentPrice
//     };
    
//     const updatedTransactions = [newTransaction, ...existingTransactions];
//     localStorage.setItem('rentalTransactions', JSON.stringify(updatedTransactions));
    
//     return newTransaction;
//   };

//   // Get rental data from Redux store
//   const rentalState = useRentalData() || {};
//   const rentalData = useMemo(() => {
//     if (rentalState.ResultSet && Array.isArray(rentalState.ResultSet)) {
//       return rentalState.ResultSet;
//     }
//     return rentalState.data || [];
//   }, [rentalState]);
//   const loading = rentalState.loading || false;
//   const error = rentalState.error || null;

//   const addRentalState = useRentalAddData() || {};
//   const addLoading = addRentalState.loading || false;
//   const addSuccess = addRentalState.success || false;
//   const addMessage = addRentalState.message || null;

//   const updateRentalState = useRentalUpdateData() || {};
//   const updateLoading = updateRentalState.loading || false;
//   const updateSuccess = updateRentalState.success || false;
//   const updateMessage = updateRentalState.message || null;

//   const returnClothState = useReturnClothData() || {};
//   const returnLoading = returnClothState.loading || false;
//   const returnSuccess = returnClothState.success || false;
//   const returnMessage = returnClothState.message || null;

//   const requestClothState = useRequestClothData() || {};
//   const requestLoading = requestClothState.loading || false;
//   const requestSuccess = requestClothState.success || false;
//   const requestMessage = requestClothState.message || null;

//   const photoPreviewState = usePhotoPreviewData() || {};
  
//   // Customer data extraction
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

//   const customerLoading = customerState.loading || false;

//   // Categories data extraction
//   const categoriesState = useSelector((state) => state.getAllCategory || {});
//   const categoriesData = useMemo(() => {
//     if (!categoriesState) return [];
    
//     if (categoriesState.ResultSet && Array.isArray(categoriesState.ResultSet)) {
//       return categoriesState.ResultSet;
//     }
//     else if (categoriesState.responseBody && Array.isArray(categoriesState.responseBody)) {
//       return categoriesState.responseBody;
//     }
//     else if (Array.isArray(categoriesState.data)) {
//       return categoriesState.data;
//     }
//     else if (Array.isArray(categoriesState)) {
//       return categoriesState;
//     }
//     else {
//       return [];
//     }
//   }, [categoriesState]);

//   const categoriesLoading = categoriesState.loading || false;

//   // Function to get category name by ID
//   const getCategoryNameById = useMemo(() => {
//     return (categoryId) => {
//       if (!categoryId || !categoriesData.length) return "N/A";
      
//       const category = categoriesData.find(cat => 
//         cat.CategoryId === categoryId || 
//         cat.CategoryId?.toString() === categoryId?.toString()
//       );
      
//       return category?.CategoryName || category?.Name || category?.name || "N/A";
//     };
//   }, [categoriesData]);

//   // Enhanced rental data with category names
//   const enhancedRentalData = useMemo(() => {
//     if (!rentalData || !Array.isArray(rentalData)) return [];
    
//     return rentalData.map(cloth => ({
//       ...cloth,
//       CategoryName: getCategoryNameById(cloth.CategoryId)
//     }));
//   }, [rentalData, getCategoryNameById]);

//   useEffect(() => {
//     dispatch(GetAllRental());
//     dispatch(GetAllCustomers());
//     dispatch(GetAllCategory());
//   }, [dispatch]);

//   useEffect(() => {
//     if (addSuccess && addMessage) {
//       setNotification({ type: 'success', message: addMessage });
//       setShowAddModal(false);
//       setFormData({ 
//         Name: "", 
//         Color: "", 
//         Size: "", 
//         Quantity: "", 
//         RentPrice: "",
//         Status: "Available",
//         CategoryId: "",
//         file: null
//       });
//       dispatch(GetAllRental());
//     }
//   }, [addSuccess, addMessage, dispatch]);

//   useEffect(() => {
//     if (updateSuccess && updateMessage) {
//       setNotification({ type: 'success', message: updateMessage });
//       setShowEditModal(false);
//       setSelectedCloth(null);
//       setFormData({ 
//         Name: "", 
//         Color: "", 
//         Size: "", 
//         Quantity: "", 
//         RentPrice: "",
//         Status: "Available",
//         CategoryId: "",
//         file: null
//       });
//       dispatch(GetAllRental());
//     }
//   }, [updateSuccess, updateMessage, dispatch]);

//   // REMOVED: useEffect for requestSuccess notification
//   // This prevents the "cloth requested successfully" popup
//   useEffect(() => {
//     if (requestSuccess) {
//       setShowRequestModal(false);
//       setRequestFormData({ ClothId: "", CustomerId: "", RentQuantity: "", RequestedSize: "", Color: "", RentPrice: "" });
//       dispatch(GetAllRental());
//     }
//   }, [requestSuccess, dispatch]);

//   useEffect(() => {
//     if (error) {
//       setNotification({ type: 'error', message: error });
//     }
//   }, [error]);

//   useEffect(() => {
//     if (notification.message) {
//       const timer = setTimeout(() => {
//         setNotification({ message: "", type: "" });
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData(prev => ({
//         ...prev,
//         file: file
//       }));
//     }
//   };

//   const handleCategorySelect = (categoryId) => {
//     setFormData(prev => ({
//       ...prev,
//       CategoryId: categoryId
//     }));
//   };

//   const handleRequestInputChange = (e) => {
//     const { name, value } = e.target;
//     setRequestFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleCustomerSelect = (customerId) => {
//     setRequestFormData(prev => ({
//       ...prev,
//       CustomerId: customerId
//     }));
//   };

//   const handleAddCloth = async (e) => {
//     e.preventDefault();
//     try {
//       // Prepare data for API call - using FormData as per your service
//       const submitData = {
//         Name: formData.Name,
//         Color: formData.Color,
//         Size: formData.Size,
//         Quantity: parseInt(formData.Quantity) || 0,
//         RentPrice: parseFloat(formData.RentPrice) || 0,
//         Status: formData.Status,
//         CategoryId: formData.CategoryId || "",
//         file: formData.file // Send file directly
//       };

//       console.log('Submitting cloth data:', submitData);
//       await dispatch(AddRentalCloths(submitData));
//     } catch (error) {
//       console.error("Error adding cloth:", error);
//       setNotification({ type: 'error', message: 'Failed to add rental cloth' });
//     }
//   };

//   const handleEditCloth = (cloth) => {
//     setSelectedCloth(cloth);
//     setFormData({
//       Name: cloth.Name || "",
//       Color: cloth.Color || "",
//       Size: cloth.Size || "",
//       Quantity: cloth.Quantity || "",
//       RentPrice: cloth.RentPrice || "",
//       Status: cloth.Status || "Available",
//       CategoryId: cloth.CategoryId || "",
//       file: null // Reset file on edit
//     });
//     setShowEditModal(true);
//   };

//   const handleViewCloth = (cloth) => {
//     setSelectedCloth(cloth);
//     setShowDetailsModal(true);
//   };

//   const handleRequestCloth = (cloth) => {
//     setSelectedCloth(cloth);
//     setRequestFormData({
//       ClothId: cloth.ClothId || "",
//       CustomerId: "",
//       RentQuantity: "1",
//       RequestedSize: cloth.Size || "",
//       Color: cloth.Color || ""
//     });
//     setShowRequestModal(true);
//   };

//   const handleUpdateCloth = async (e) => {
//     e.preventDefault();
//     if (!selectedCloth) return;
    
//     try {
//       // Prepare data for API call - using FormData as per your service
//       const submitData = {
//         ClothId: selectedCloth.ClothId,
//         Name: formData.Name,
//         Color: formData.Color,
//         Size: formData.Size,
//         Quantity: parseInt(formData.Quantity) || 0,
//         RentPrice: parseFloat(formData.RentPrice) || 0,
//         Status: formData.Status,
//         CategoryId: formData.CategoryId || "",
//         file: formData.file // Send file directly
//       };

//       await dispatch(UpdateRentalCloths(submitData));
//     } catch (error) {
//       console.error("Error updating cloth:", error);
//       setNotification({ type: 'error', message: 'Failed to update rental cloth' });
//     }
//   };

//   const handleRequestSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await dispatch(RequestCloth(requestFormData));
      
//       // Add to rental transactions
//       addRentalTransaction(requestFormData, selectedCloth);
      
//       setShowRequestModal(false);
//       setRequestFormData({ ClothId: "", CustomerId: "", RentQuantity: "", RequestedSize: "", Color: "", RentPrice: "" });
//       dispatch(GetAllRental());
//     } catch (error) {
//       console.error("Error requesting cloth:", error);
//       setNotification({ type: 'error', message: 'Failed to request cloth' });
//     }
//   };

//   const handleRefresh = () => {
//     dispatch(GetAllRental());
//     dispatch(GetAllCustomers());
//     dispatch(GetAllCategory());
//   };

//   // Filter and search logic with descending order
//   const filteredCloths = useMemo(() => {
//     if (!enhancedRentalData || !Array.isArray(enhancedRentalData)) return [];
    
//     const filtered = enhancedRentalData.filter(cloth => {
//       const matchesSearch = 
//         cloth.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cloth.Color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cloth.Size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cloth.ClothId?.toString().includes(searchTerm.toLowerCase()) ||
//         cloth.CategoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cloth.CategoryId?.toString().includes(searchTerm.toLowerCase());
      
//       const matchesFilter = filterStatus === "all" || 
//         (filterStatus === "available" && cloth.Quantity > 0) ||
//         (filterStatus === "out-of-stock" && cloth.Quantity === 0);
      
//       return matchesSearch && matchesFilter;
//     });

//     // Sort in descending order by ClothId (assuming higher IDs are newer)
//     return filtered.sort((a, b) => {
//       const idA = parseInt(a.ClothId) || 0;
//       const idB = parseInt(b.ClothId) || 0;
//       return idB - idA; // Descending order
//     });
//   }, [enhancedRentalData, searchTerm, filterStatus]);

//   // Size options for dropdown
//   const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

//   // Status options
//   const statusOptions = ["Available", "Not Available"];

//   // Calculate statistics - REMOVED averagePrice calculation
//   const totalCloths = enhancedRentalData?.length || 0;
//   const availableCloths = enhancedRentalData?.filter(item => item.Quantity > 0)?.length || 0;
//   const totalTypes = new Set(enhancedRentalData?.map(item => item.Name))?.size || 0;

//   // Pagination
//   const totalPages = Math.ceil(filteredCloths.length / recordsPerPage);
//   const currentRecords = useMemo(() => {
//     const indexOfLastRecord = currentPage * recordsPerPage;
//     const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//     return filteredCloths.slice(indexOfFirstRecord, indexOfLastRecord);
//   }, [filteredCloths, currentPage, recordsPerPage]);

//   const getPageNumbers = useMemo(() => {
//     const start = Math.max(1, currentPage - 1);
//     const end = Math.min(totalPages, start + 2);
//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//   }, [currentPage, totalPages]);

//   const getQuantityDisplay = (quantity) => {
//     return quantity === 0 ? "Out of Stock" : quantity;
//   };

//   const getQuantityColor = (quantity) => {
//     if (quantity === 0) return "text-black-600 ";
//     if (quantity <= 10) return "text-black-600";
//     return "text-black-600";
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'available': return 'text-green-600 bg-green-100';
//       case 'not available': return 'text-red-600 bg-red-100';
//       case 'maintenance': return 'text-orange-600 bg-orange-100';
//       case 'discontinued': return 'text-gray-600 bg-gray-100';
//       default: return 'text-blue-600 bg-blue-100';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-slate-600 font-medium">Loading rental cloths...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 md:p-6 relative overflow-hidden">
//       <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
//       {notification.message && (
//         <div
//           className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center animate-slide-in ${
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
//       <div className="relative z-10 mb-6 sm:mb-8">
//   <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//     <div className="flex items-center space-x-4">
//       <div className="p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
//         <FiShoppingBag className="text-white text-lg md:text-xl" />
//       </div>
//       <div className="transform ">
//         <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//           Rental Cloths
//         </h1>
//         <p className="text-slate-600 mt-1 text-sm md:text-base">Manage your rental cloth inventory with style</p>
//       </div>
//     </div>

//     {/* View Toggle */}
//     <div className="flex items-center space-x-3 self-end lg:self-auto">
//       <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-xl">
//         <button
//           onClick={() => setViewMode("table")}
//           className={`p-3 rounded-xl transition-all duration-300 ${
//             viewMode === "table" 
//               ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
//               : "text-slate-600 hover:text-slate-800"
//           }`}
//           title="Table View"
//         >
//           <FiList size={18} />
//         </button>
//         <button
//           onClick={() => setViewMode("card")}
//           className={`p-3 rounded-xl transition-all duration-300 ${
//             viewMode === "card" 
//               ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
//               : "text-slate-600 hover:text-slate-800"
//           }`}
//           title="Card View"
//         >
//           <FiGrid size={18} />
//         </button>
//       </div>
//     </div>
//   </div>
// </div>

//       {/* Statistics Cards - REMOVED Avg. Rent Price card */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Total Cloths</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">{totalCloths}</p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiPackage className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Available Items</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">{availableCloths}</p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiBox className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Total Types</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">{totalTypes}</p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiTag className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Controls Section */}
//       <div className="relative z-10 mb-6 md:mb-8">
//         <div className="flex flex-col lg:flex-row gap-4">
//           {/* Search Input - Full width on mobile, flex on larger screens */}
//           <div className="relative flex-grow group">
//             <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//             <input
//               type="text"
//               placeholder="Search cloths by ID, name, color, size, or category..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="relative w-full pl-12 pr-6 py-3 md:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm md:text-base"
//             />
//             <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
//           </div>
          
//           {/* Filter and Add Button Container - Always in same row */}
//           <div className="flex items-center gap-3 w-full lg:w-auto">
//             {/* Filter Dropdown */}
//             <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl px-4 py-2 flex-1 lg:flex-none">
//               <FiFilter className="text-slate-400" />
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-700 font-medium w-full lg:w-auto"
//               >
//                 <option value="all">All Cloths</option>
//                 <option value="available">Available</option>
//                 <option value="out-of-stock">Out of Stock</option>
//               </select>
//             </div>

//             {/* Add Button */}
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 md:px-6 py-3 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 whitespace-nowrap flex-1 lg:flex-none min-w-[140px] md:min-w-[180px]"
//             >
//               <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//               <FiPlus className="mr-2 relative z-10" size={18} />
//               <span className="relative z-10 text-sm md:text-base">Add Rental Cloth</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Rest of the component remains the same */}
//       {/* Table View */}
//       {viewMode === "table" ? (
//         <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-6 md:mb-8">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1000px]">
//               <thead>
//                 <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">ID</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Cloth Details</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Category</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Size</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Color</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Quantity</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Status</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Rent Price(Rs.)</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200/50">
//                 {currentRecords.length > 0 ? (
//                   currentRecords.map((cloth, index) => (
//                     <tr 
//                       key={cloth.ClothId || index} 
//                       className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
//                     >
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <div className="flex items-center">
//                           <span className="text-sm font-mono font-normal text-slate-900">
//                             {cloth.ClothId}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <div className="flex items-center">
//                           <RentalImage 
//                             src={cloth.IMAGEURL} 
//                             alt={cloth.Name}
//                             className="w-10 h-10 rounded-lg object-cover shadow-sm"
//                             clothId={cloth.ClothId}
//                           />
//                           <div>
//                             <div className="text-sm font-normal text-slate-900">
//                               {cloth.Name}
//                             </div>
//                             {cloth.CreatedDate && (
//                               <div className="text-xs text-slate-500">
//                                 Added: {new Date(cloth.CreatedDate).toLocaleDateString()}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <span className="text-sm font-normal text-slate-900">
//                           {cloth.CategoryName || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <span className="text-sm font-normal text-slate-900">
//                           {cloth.Size}
//                         </span>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <div className="flex items-center">
//                           <div 
//                             className="w-4 h-4 rounded-full border border-gray-300 mr-2 shadow-sm"
//                             style={{ backgroundColor: cloth.Color?.toLowerCase() }}
//                           ></div>
//                           <span className="text-sm text-slate-900 capitalize">
//                             {cloth.Color}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <span className={`text-sm font-normal ${getQuantityColor(cloth.Quantity)}`}>
//                           {getQuantityDisplay(cloth.Quantity)}
//                         </span>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(cloth.Status)}`}>
//                           {cloth.Status || "Available"}
//                         </span>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4 text-sm font-normal text-slate-900">
//                          {formatCurrency(cloth.RentPrice)}
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4 text-center">
//                         <div className="flex justify-center space-x-2">
//                           <button
//                             onClick={() => handleViewCloth(cloth)}
//                             className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                             title="View Details"
//                           >
//                             <FiEye size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleEditCloth(cloth)}
//                             className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                             title="Edit Cloth"
//                           >
//                             <FiEdit2 size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleRequestCloth(cloth)}
//                             className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                             title="Request Cloth"
//                             disabled={cloth.Quantity === 0}
//                           >
//                             <FiShoppingCart size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="text-center py-8 md:py-12">
//                       <div className="flex flex-col items-center space-y-3">
//                         <div className="p-3 md:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                           <FiPackage className="text-slate-500 text-lg md:text-xl" />
//                         </div>
//                         <p className="text-slate-500 font-medium">No rental cloths found</p>
//                         <p className="text-slate-400 text-sm">
//                           {searchTerm || filterStatus !== "all" 
//                             ? "Try adjusting your search or filter criteria" 
//                             : "Get started by adding your first rental cloth"}
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {filteredCloths.length > recordsPerPage && (
//             <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-4 md:space-y-0">
//               <div className="text-sm text-slate-600">
//                 Showing {currentPage * recordsPerPage - recordsPerPage + 1}–{Math.min(currentPage * recordsPerPage, filteredCloths.length)} of{' '}
//                 {filteredCloths.length}
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                 >
//                   <FiChevronLeft size={14} />
//                 </button>

//                 {getPageNumbers.map((page) => (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`px-2 md:px-3.5 py-1 md:py-1.5 rounded-xl border transition-all duration-300 transform hover:scale-105 text-sm ${
//                       currentPage === page
//                         ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
//                         : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}

//                 <button
//                   onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                 >
//                   <FiChevronRight size={14} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       ) : (
//         /* Card View */
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
//           {currentRecords.map((cloth, index) => (
//             <div 
//               key={cloth.ClothId || index} 
//               className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group overflow-hidden cursor-pointer"
//               onClick={() => handleViewCloth(cloth)}
//             >
//               <div className="h-40 overflow-hidden bg-slate-100">
//                 <RentalImage 
//                   src={cloth.IMAGEURL} 
//                   alt={cloth.Name}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                   clothId={cloth.ClothId}
//                 />
//               </div>
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
//                       <FiPackage className="text-blue-600 text-lg" />
//                     </div>
//                     <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
//                       ID: {cloth.ClothId}
//                     </span>
//                   </div>
//                   <span className={`text-xs font-semibold ${getQuantityColor(cloth.Quantity)}`}>
//                     {getQuantityDisplay(cloth.Quantity)}
//                   </span>
//                 </div>
                
//                 <h3 className="font-bold text-slate-900 text-lg mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
//                   {cloth.Name}
//                 </h3>
                
//                 {cloth.CategoryName && (
//                   <div className="mb-3">
//                     <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
//                       {cloth.CategoryName}
//                     </span>
//                   </div>
//                 )}
                
//                 <div className="space-y-3 mb-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Size:</span>
//                     <span className="text-sm font-semibold text-slate-900">
//                       {cloth.Size}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Color:</span>
//                     <div className="flex items-center space-x-2">
//                       <div 
//                         className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
//                         style={{ backgroundColor: cloth.Color?.toLowerCase() }}
//                       ></div>
//                       <span className="text-sm font-semibold text-slate-900 capitalize">
//                         {cloth.Color}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Status:</span>
//                     <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(cloth.Status)}`}>
//                       {cloth.Status || "Available"}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Rent Price:</span>
//                     <span className="text-sm font-bold text-slate-900">
//                       Rs. {formatCurrency(cloth.RentPrice)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Add Modal */}
// {showAddModal && (
//   <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//     <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//       <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//         <div className="flex items-center justify-between mb-4 md:mb-6">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//               <FiPlus className="text-white text-base md:text-lg" />
//             </div>
//             <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//               Add Rental Cloth
//             </h2>
//           </div>
//           <button 
//             onClick={() => {
//               setShowAddModal(false);
//               setFormData(prev => ({ ...prev, file: null }));
//             }}
//             className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//           >
//             <FiX size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleAddCloth} className="space-y-4 md:space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Cloth Name </label>
//               <input
//                 type="text"
//                 name="Name"
//                 value={formData.Name}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                 placeholder="Enter cloth name"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Color </label>
//               <input
//                 type="text"
//                 name="Color"
//                 value={formData.Color}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                 placeholder="Enter color"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Size </label>
//               <select
//                 name="Size"
//                 value={formData.Size}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//               >
//                 <option value="">Select size</option>
//                 {sizeOptions.map(size => (
//                   <option key={size} value={size}>{size}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Quantity </label>
//               <input
//                 type="number"
//                 name="Quantity"
//                 value={formData.Quantity}
//                 onChange={handleInputChange}
//                 required
//                 min="0"
//                 className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                 placeholder="Enter quantity"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Rent Price (Rs.) </label>
//               <input
//                 type="number"
//                 name="RentPrice"
//                 value={formData.RentPrice}
//                 onChange={handleInputChange}
//                 required
//                 min="1"
//                 step="0.01"
//                 className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                 placeholder="Enter rent price"
//               />
//             </div>

//             {/* Status field removed - automatically set to "Available" */}

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
//               <CategoriesDropdown
//                 value={formData.CategoryId}
//                 onChange={handleCategorySelect}
//                 categories={categoriesData}
//                 loading={categoriesLoading}
//                 placeholder="Select category"
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Cloth Image
//                 <span className="text-slate-400 text-xs ml-1">(Optional)</span>
//               </label>
              
//               <div className="space-y-4">
//                 <div className="relative group">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
//                     id="image-upload-add"
//                   />
//                   <div className="w-full px-6 py-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50 group-hover:shadow-lg text-center cursor-pointer">
//                     <FiUpload className="mx-auto text-slate-400 mb-3 group-hover:text-blue-500 transition-colors" size={32} />
//                     <p className="text-sm font-medium text-slate-600 mb-1">
//                       {formData.file ? formData.file.name : "Click to upload image"}
//                     </p>
//                     <p className="text-xs text-slate-500">
//                       Supports: PNG, JPG, JPEG, WEBP • Max: 5MB
//                     </p>
//                   </div>
//                 </div>

//                 {formData.file && (
//                   <div className="flex flex-col items-center space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
//                     <div className="flex items-center justify-between w-full">
//                       <p className="text-sm font-medium text-slate-700">Image Preview:</p>
//                       <button
//                         type="button"
//                         onClick={() => setFormData(prev => ({ ...prev, file: null }))}
//                         className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors text-sm"
//                       >
//                         <FiX size={14} />
//                         <span>Remove</span>
//                       </button>
//                     </div>
//                     <div className="relative">
//                       <img 
//                         src={URL.createObjectURL(formData.file)} 
//                         alt="Preview"
//                         className="w-40 h-40 object-cover rounded-xl shadow-lg border border-slate-300"
//                       />
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xs text-slate-600 font-medium">{formData.file.name}</p>
//                       <p className="text-xs text-slate-500">
//                         Size: {(formData.file.size / 1024 / 1024).toFixed(2)} MB • 
//                         Type: {formData.file.type.split('/')[1]?.toUpperCase()}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {!formData.file && (
//                   <div className="text-center">
//                     <div className="inline-flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-full">
//                       <FiInfo className="text-blue-500" size={14} />
//                       <span>No image selected. You can add one later.</span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
//             <button
//               type="button"
//               onClick={() => {
//                 setShowAddModal(false);
//                 setFormData(prev => ({ ...prev, file: null }));
//               }}
//               className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={addLoading}
//               className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
//             >
//               {addLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   <span>Adding...</span>
//                 </>
//               ) : (
//                 <>
//                   <FiPlus size={16} />
//                   <span>Add Cloth</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>
// )}
//       {/* Edit Modal */}
//       {showEditModal && selectedCloth && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <div className="flex items-center justify-between mb-4 md:mb-6">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                     <FiEdit2 className="text-white text-base md:text-lg" />
//                   </div>
//                   <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                     Edit Rental Cloth
//                   </h2>
//                 </div>
//                 <button 
//                   onClick={() => setShowEditModal(false)}
//                   className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleUpdateCloth} className="space-y-4 md:space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Cloth Name </label>
//                     <input
//                       type="text"
//                       name="Name"
//                       value={formData.Name}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Color </label>
//                     <input
//                       type="text"
//                       name="Color"
//                       value={formData.Color}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Size </label>
//                     <select
//                       name="Size"
//                       value={formData.Size}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     >
//                       <option value="">Select size</option>
//                       {sizeOptions.map(size => (
//                         <option key={size} value={size}>{size}</option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Quantity </label>
//                     <input
//                       type="number"
//                       name="Quantity"
//                       value={formData.Quantity}
//                       onChange={handleInputChange}
//                       required
//                       min="0"
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Rent Price (Rs.) </label>
//                     <input
//                       type="number"
//                       name="RentPrice"
//                       value={formData.RentPrice}
//                       onChange={handleInputChange}
//                       required
//                       min="1"
//                       step="0.01"
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
//                     <select
//                       name="Status"
//                       value={formData.Status}
//                       onChange={handleInputChange}
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     >
//                       {statusOptions.map(status => (
//                         <option key={status} value={status}>{status}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
//                     <CategoriesDropdown
//                       value={formData.CategoryId}
//                       onChange={handleCategorySelect}
//                       categories={categoriesData}
//                       loading={categoriesLoading}
//                       placeholder="Select category"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Cloth Image</label>
//                     <div className="flex items-center space-x-4">
//                       <div className="flex-1">
//                         <div className="relative">
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                             id="image-upload-edit"
//                           />
//                           <div className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50 text-center cursor-pointer">
//                             <FiUpload className="mx-auto text-slate-400 mb-2" size={24} />
//                             <p className="text-sm text-slate-600">
//                               {formData.file ? formData.file.name : "Click to upload new image"}
//                             </p>
//                             <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
//                           </div>
//                         </div>
//                       </div>
//                       {formData.file ? (
//                         <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
//                           <img 
//                             src={URL.createObjectURL(formData.file)} 
//                             alt="Preview"
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       ) : (
//                         <RentalImage 
//                           src={selectedCloth.IMAGEURL} 
//                           alt="Current"
//                           className="w-20 h-20 rounded-lg object-cover border border-slate-200"
//                           clothId={selectedCloth.ClothId}
//                         />
//                       )}
//                     </div>
//                     {!formData.file && (
//                       <p className="text-xs text-slate-500 mt-2">Current image will be kept if no new image is selected</p>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowEditModal(false)}
//                     className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={updateLoading}
//                     className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
//                   >
//                     {updateLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         <span>Updating...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FiSave size={16} />
//                         <span>Update Cloth</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Return Modal */}
//       {/* {showReturnModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-2xl">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform rotate-1"></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <div className="flex items-center justify-between mb-4 md:mb-6">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                     <FiRotateCw className="text-white text-base md:text-lg" />
//                   </div>
//                   <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                     Return Rental Cloth
//                   </h2>
//                 </div>
//                 <button 
//                   onClick={() => setShowReturnModal(false)}
//                   className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleReturnSubmit} className="space-y-4 md:space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Rental ID *</label>
//                   <input
//                     type="text"
//                     name="RentalId"
//                     value={returnFormData.RentalId}
//                     onChange={handleReturnInputChange}
//                     required
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     placeholder="Enter rental ID"
//                   />
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
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                       placeholder="Enter damage price"
//                     />
//                   </div>
//                 )}
                
//                 <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowReturnModal(false)}
//                     className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={returnLoading}
//                     className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
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
//       )} */}

//       {/* Request Modal with Customer Dropdown */}
//       {showRequestModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-2xl">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform rotate-1"></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <div className="flex items-center justify-between mb-4 md:mb-6">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                     <FiShoppingCart className="text-white text-base md:text-lg" />
//                   </div>
//                   <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                     Request Rental Cloth
//                   </h2>
//                 </div>
//                 <button 
//                   onClick={() => setShowRequestModal(false)}
//                   className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleRequestSubmit} className="space-y-4 md:space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Cloth ID </label>
//                   <input
//                     type="text"
//                     name="ClothId"
//                     value={requestFormData.ClothId}
//                     onChange={handleRequestInputChange}
//                     required
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     placeholder="Enter cloth ID"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Customer </label>
//                   <CustomerDropdown
//                     value={requestFormData.CustomerId}
//                     onChange={handleCustomerSelect}
//                     customers={customerData}
//                     loading={customerLoading}
//                     placeholder="Search customer by name..."
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Rent Quantity </label>
//                   <input
//                     type="number"
//                     name="RentQuantity"
//                     value={requestFormData.RentQuantity}
//                     onChange={handleRequestInputChange}
//                     required
//                     min="1"
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     placeholder="Enter quantity to rent"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Requested Size</label>
//                   <select
//                     name="RequestedSize"
//                     value={requestFormData.RequestedSize}
//                     onChange={handleRequestInputChange}
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                   >
//                     <option value="">Select size</option>
//                     {sizeOptions.map(size => (
//                       <option key={size} value={size}>{size}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
//                   <input
//                     type="text"
//                     name="Color"
//                     value={requestFormData.Color}
//                     onChange={handleRequestInputChange}
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     placeholder="Enter color"
//                   />
//                 </div>
                
//                 <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowRequestModal(false)}
//                     className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={requestLoading || !requestFormData.CustomerId}
//                     className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
//                   >
//                     {requestLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         <span>Requesting...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FiShoppingCart size={16} />
//                         <span>Request Cloth</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Enhanced Details Modal */}
//             {/* Simplified View Modal for Card Click */}
//       {showDetailsModal && selectedCloth && (
//         <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-2 sm:p-4">
//           <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform rotate-1"></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-h-full overflow-y-auto">
//               <div className="p-4 sm:p-6">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-4 sm:mb-6">
//                   <div className="flex items-center space-x-2 sm:space-x-3">
//                     <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                       <FiShoppingBag className="text-white text-base sm:text-lg" />
//                     </div>
//                     <h2 className="text-xl sm:text-2xl font-normal bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                       Cloth Details
//                     </h2>
//                   </div>
//                   <button 
//                     onClick={() => setShowDetailsModal(false)}
//                     className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                   >
//                     <FiX className="text-xl sm:text-2xl" />
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
//                   {/* Image Section */}
//                   <div>
//     <h3 className="text-base sm:text-lg font-normal mb-3 sm:mb-4 text-slate-800">Cloth Image</h3>
//     <div className="border-2 border-slate-300 rounded-2xl overflow-hidden shadow-lg">
//       <RentalImage 
//         src={selectedCloth.IMAGEURL} 
//         alt={selectedCloth.Name}
//         className="w-full h-auto max-h-64 sm:max-h-96 object-contain"
//         clothId={selectedCloth.ClothId}
//       />
//     </div>
    
//     {/* Download Button - Fixed Version */}
//     {selectedCloth.ClothId && (
//       <div className="mt-3 sm:mt-4 flex justify-center">
//         <a 
//           href={selectedCloth.IMAGEURL || `https://tailorbackend.dockyardsoftware.com/Rental/PhotoPrivew?CID=${selectedCloth.ClothId}`}
//           download={`${(selectedCloth.Name || 'cloth').replace(/\s+/g, '_')}_${selectedCloth.ClothId}.jpg`}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="px-4 sm:px-6 py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center font-normal text-sm sm:text-base"
//         >
//           <FiDownload className="mr-1 sm:mr-2" />
//           Download Image
//         </a>
//       </div>
//     )}
//   </div>

//                   {/* Cloth Details Section */}
//                   <div>
//                     <h3 className="text-base sm:text-lg font-normal mb-3 sm:mb-4 text-slate-800">Cloth Information</h3>
//                     <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-6 border border-slate-200/50">
//                       <table className="w-full border-collapse text-sm sm:text-base">
//                         <tbody>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700 w-1/2">Cloth ID</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-900">
//                               {selectedCloth.ClothId}
//                             </td>
//                           </tr>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Name</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-900">
//                               {selectedCloth.Name}
//                             </td>
//                           </tr>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Category</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-900">
//                               {getCategoryNameById(selectedCloth.CategoryId) || "N/A"}
//                             </td>
//                           </tr>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Size</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-900">
//                               {selectedCloth.Size}
//                             </td>
//                           </tr>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Color</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-900">
//                               <div className="flex items-center">
//                                 <div 
//                                   className="w-4 h-4 rounded-full border border-slate-300 mr-2 shadow-sm"
//                                   style={{ backgroundColor: selectedCloth.Color?.toLowerCase() }}
//                                 ></div>
//                                 <span className="capitalize">
//                                   {selectedCloth.Color}
//                                 </span>
//                               </div>
//                             </td>
//                           </tr>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Quantity</td>
//                             <td className={`py-2 sm:py-3 px-2 sm:px-4 font-normal ${getQuantityColor(selectedCloth.Quantity)}`}>
//                               {getQuantityDisplay(selectedCloth.Quantity)}
//                             </td>
//                           </tr>
//                           <tr className="border-b border-slate-200">
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Status</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4">
//                               <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedCloth.Status)}`}>
//                                 {selectedCloth.Status || "Available"}
//                               </span>
//                             </td>
//                           </tr>
//                           <tr>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Rent Price</td>
//                             <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-green-700">
//                               Rs. {formatCurrency(selectedCloth.RentPrice)}
//                             </td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RentalCloths;




// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { 
//   GetAllRental, 
//   AddRentalCloths, 
//   UpdateRentalCloths,
//   ReturnCloth,
//   RequestCloth,
//   PhotoPrivew
// } from "../actions/rentalAction";
// import { GetAllCustomers } from "../actions/customerActions";
// import { GetAllCategory } from "../actions/categoryAction";
// import { 
//   FiPlus, 
//   FiEdit2, 
//   FiEye, 
//   FiSearch, 
//   FiGrid, 
//   FiList,
//   FiPackage,
//   FiDollarSign,
//   FiTag,
//   FiBox,
//   FiFilter,
//   FiRefreshCw,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiX,
//   FiChevronLeft,
//   FiChevronRight,
//   FiSave,
//   FiShoppingBag,
//   FiInfo,
//   FiShoppingCart,
//   FiRotateCw,
//   FiLayers,
//   FiArchive,
//   FiUser,
//   FiChevronDown,
//   FiImage,
//   FiCalendar,
//   FiUpload,
//   FiPaperclip,
//   FiDownload,
// } from "react-icons/fi";

// const formatCurrency = (amount) => {
//   return parseFloat(amount || 0).toLocaleString('en-IN', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   });
// };

// // Enhanced Image Component with Photo Preview Support
// const RentalImage = ({ src, alt, className, clothId }) => {
//   const [imageError, setImageError] = useState(false);
//   const [imageLoading, setImageLoading] = useState(true);

//   // Generate proper image URL using the photo preview endpoint
//   const imageUrl = clothId 
//     ? `https://tailorbackend.dockyardsoftware.com/Rental/PhotoPrivew?CID=${clothId}`
//     : src;

//   if (!imageUrl || imageError) {
//     return (
//       <div className={`${className} bg-slate-200 rounded-lg flex items-center justify-center mr-3`}>
//         <FiImage className="text-slate-400" size={16} />
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       {imageLoading && (
//         <div className={`${className} bg-slate-200 rounded-lg flex items-center justify-center absolute mr-3`}>
//           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//         </div>
//       )}
//       <img 
//         src={imageUrl}
//         alt={alt}
//         className={`${className} rounded-lg object-cover mr-3 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
//         onLoad={() => setImageLoading(false)}
//         onError={() => {
//           setImageError(true);
//           setImageLoading(false);
//         }}
//       />
//     </div>
//   );
// };

// // Custom hooks for rental data
// const useRentalData = () => {
//   return useSelector((state) => state.getAllRental);
// };

// const useRentalAddData = () => {
//   return useSelector((state) => state.addRental);
// };

// const useRentalUpdateData = () => {
//   return useSelector((state) => state.updateRental);
// };

// const useReturnClothData = () => {
//   return useSelector((state) => state.returnCloth);
// };

// const useRequestClothData = () => {
//   return useSelector((state) => state.requestCloth);
// };

// const usePhotoPreviewData = () => {
//   return useSelector((state) => state.photoPreview);
// };

// // Enhanced Customer Dropdown Component
// const CustomerDropdown = ({ 
//   value, 
//   onChange, 
//   customers = [], 
//   loading = false,
//   placeholder = "Search customer by name..."
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const dropdownRef = useRef(null);
//   const inputRef = useRef(null);

//   const customerList = useMemo(() => {
//     if (!customers) return [];
    
//     let customerArray = [];
    
//     if (customers.ResultSet && Array.isArray(customers.ResultSet)) {
//       customerArray = customers.ResultSet;
//     }
//     else if (customers.responseBody && Array.isArray(customers.responseBody)) {
//       customerArray = customers.responseBody;
//     }
//     else if (Array.isArray(customers)) {
//       customerArray = customers;
//     }
//     else if (customers.data && Array.isArray(customers.data)) {
//       customerArray = customers.data;
//     }
    
//     return customerArray
//       .filter(customer => customer && (customer.FullName || customer.CustomerName || customer.name))
//       .map(customer => ({
//         ...customer,
//         CustomerName: customer.FullName || customer.CustomerName || customer.name || 'Unknown Customer',
//         CustomerId: customer.CustomerId || customer.id || customer._id || '',
//         PhoneNumber: customer.PhoneNumber || customer.phone || customer.contact || '',
//         Email: customer.Email || customer.email || ''
//       }));
//   }, [customers]);

//   const filteredCustomers = useMemo(() => {
//     if (!searchTerm) return customerList;
    
//     return customerList.filter(customer => 
//       customer.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.CustomerId?.toString().includes(searchTerm.toLowerCase()) ||
//       customer.PhoneNumber?.includes(searchTerm) ||
//       customer.Email?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [customerList, searchTerm]);

//   useEffect(() => {
//     if (value && customerList.length > 0) {
//       const customer = customerList.find(c => 
//         c.CustomerId === value || 
//         c.CustomerId?.toString() === value
//       );
//       setSelectedCustomer(customer || null);
//     } else {
//       setSelectedCustomer(null);
//     }
//   }, [value, customerList]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleSelectCustomer = (customer) => {
//     setSelectedCustomer(customer);
//     onChange(customer.CustomerId);
//     setIsOpen(false);
//     setSearchTerm("");
//   };

//   const handleInputChange = (e) => {
//     setSearchTerm(e.target.value);
//     if (!isOpen) setIsOpen(true);
//   };

//   const handleFocus = () => {
//     setIsOpen(true);
//   };

//   const clearSelection = () => {
//     setSelectedCustomer(null);
//     setSearchTerm("");
//     onChange("");
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   };

//   const displayValue = selectedCustomer ? selectedCustomer.CustomerName : searchTerm;

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <div className="relative">
//         <input
//           ref={inputRef}
//           type="text"
//           value={displayValue}
//           onChange={handleInputChange}
//           onFocus={handleFocus}
//           placeholder={placeholder}
//           className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm"
//         />
//         <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
//           {selectedCustomer && (
//             <button
//               type="button"
//               onClick={clearSelection}
//               className="text-slate-400 hover:text-slate-600 transition-colors"
//             >
//               <FiX size={16} />
//             </button>
//           )}
//           <FiChevronDown 
//             className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
//             size={16} 
//           />
//         </div>
//       </div>

//       {isOpen && (
//         <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
//           {loading ? (
//             <div className="p-4 text-center text-slate-500">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-2 text-sm">Loading customers...</p>
//             </div>
//           ) : filteredCustomers.length === 0 ? (
//             <div className="p-4 text-center text-slate-500">
//               {searchTerm ? "No customers found" : "No customers available"}
//             </div>
//           ) : (
//             filteredCustomers.map((customer) => (
//               <div
//                 key={customer.CustomerId}
//                 onMouseDown={(e) => e.preventDefault()}
//                 onClick={() => handleSelectCustomer(customer)}
//                 className={`p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-slate-100 last:border-b-0 ${
//                   selectedCustomer?.CustomerId === customer.CustomerId ? 'bg-blue-100 border-blue-200' : ''
//                 }`}
//               >
//                 <div className="font-medium text-slate-800">
//                   {customer.CustomerName}
//                 </div>
//                 <div className="text-xs text-slate-500 mt-1">
//                   ID: {customer.CustomerId} | 
//                   Phone: {customer.PhoneNumber || 'N/A'} | 
//                   Email: {customer.Email || 'N/A'}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // Categories Dropdown Component
// const CategoriesDropdown = ({ 
//   value, 
//   onChange, 
//   categories = [], 
//   loading = false,
//   placeholder = "Select category"
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const dropdownRef = useRef(null);
//   const inputRef = useRef(null);

//   const categoryList = useMemo(() => {
//     if (!categories) return [];
    
//     let categoryArray = [];
    
//     if (categories.ResultSet && Array.isArray(categories.ResultSet)) {
//       categoryArray = categories.ResultSet;
//     }
//     else if (categories.responseBody && Array.isArray(categories.responseBody)) {
//       categoryArray = categories.responseBody;
//     }
//     else if (Array.isArray(categories)) {
//       categoryArray = categories;
//     }
//     else if (categories.data && Array.isArray(categories.data)) {
//       categoryArray = categories.data;
//     }
    
//     return categoryArray
//       .filter(category => category && (category.CategoryName || category.Name || category.name))
//       .map(category => ({
//         ...category,
//         CategoryName: category.CategoryName || category.Name || category.name || 'Unknown Category',
//         CategoryId: category.CategoryId || category.id || category._id || ''
//       }));
//   }, [categories]);

//   const filteredCategories = useMemo(() => {
//     if (!searchTerm) return categoryList;
    
//     return categoryList.filter(category => 
//       category.CategoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       category.CategoryId?.toString().includes(searchTerm.toLowerCase())
//     );
//   }, [categoryList, searchTerm]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleSelectCategory = (category) => {
//     onChange(category.CategoryId);
//     setIsOpen(false);
//     setSearchTerm("");
//   };

//   const handleInputChange = (e) => {
//     setSearchTerm(e.target.value);
//     if (!isOpen) setIsOpen(true);
//   };

//   const handleFocus = () => {
//     setIsOpen(true);
//   };

//   const selectedCategory = categoryList.find(cat => 
//     cat.CategoryId === value
//   );

//   const displayValue = selectedCategory ? selectedCategory.CategoryName : searchTerm;

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <div className="relative">
//         <input
//           ref={inputRef}
//           type="text"
//           value={displayValue}
//           onChange={handleInputChange}
//           onFocus={handleFocus}
//           placeholder={placeholder}
//           className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm"
//         />
//         <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//           <FiChevronDown 
//             className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
//             size={16} 
//           />
//         </div>
//       </div>

//       {isOpen && (
//         <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
//           {loading ? (
//             <div className="p-4 text-center text-slate-500">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-2 text-sm">Loading categories...</p>
//             </div>
//           ) : filteredCategories.length === 0 ? (
//             <div className="p-4 text-center text-slate-500">
//               {searchTerm ? "No categories found" : "No categories available"}
//             </div>
//           ) : (
//             filteredCategories.map((category) => (
//               <div
//                 key={category.CategoryId}
//                 onMouseDown={(e) => e.preventDefault()}
//                 onClick={() => handleSelectCategory(category)}
//                 className={`p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-slate-100 last:border-b-0 ${
//                   selectedCategory?.CategoryId === category.CategoryId ? 'bg-blue-100 border-blue-200' : ''
//                 }`}
//               >
//                 <div className="font-medium text-slate-800">
//                   {category.CategoryName}
//                 </div>
//                 {category.CategoryId && (
//                   <div className="text-xs text-slate-500 mt-1">
//                     ID: {category.CategoryId}
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const RentalCloths = () => {
//   const dispatch = useDispatch();
//   const [viewMode, setViewMode] = useState("table");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [selectedCloth, setSelectedCloth] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [notification, setNotification] = useState({ message: "", type: "" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;
  
//   // Track if we've shown notifications to prevent duplicates
//   const [hasShownAddSuccess, setHasShownAddSuccess] = useState(false);
//   const [hasShownUpdateSuccess, setHasShownUpdateSuccess] = useState(false);
//   const [hasShownRequestSuccess, setHasShownRequestSuccess] = useState(false);
  
//   // Form states
//   const [formData, setFormData] = useState({
//     Name: "",
//     Color: "",
//     Size: "",
//     Quantity: "",
//     RentPrice: "",
//     Status: "Available",
//     CategoryId: "",
//     file: null
//   });

//   const [requestFormData, setRequestFormData] = useState({
//     ClothId: "",
//     CustomerId: "",
//     RentQuantity: "",
//     RequestedSize: "",
//     Color: "",
//     RentPrice: ""
//   });

//   // Function to add rental transaction to localStorage
//   const addRentalTransaction = (requestData, cloth) => {
//     const savedTransactions = localStorage.getItem('rentalTransactions');
//     const existingTransactions = savedTransactions ? JSON.parse(savedTransactions) : [];
    
//     const newRentalId = existingTransactions.length > 0 
//       ? Math.max(...existingTransactions.map(t => t.RentalId)) + 1 
//       : 1;
    
//     const newTransaction = {
//       RentalId: newRentalId,
//       ClothId: requestData.ClothId,
//       CustomerId: requestData.CustomerId,
//       Quantity: parseInt(requestData.RentQuantity),
//       RequestedColor: requestData.Color,
//       RequestedSize: requestData.RequestedSize,
//       RentPrice: parseFloat(cloth.RentPrice),
//       RentDate: new Date().toISOString(),
//       ReturnDate: null,
//       Status: "Rented",
//       DamageFee: 0,
//       FinalAmount: cloth.RentPrice
//     };
    
//     const updatedTransactions = [newTransaction, ...existingTransactions];
//     localStorage.setItem('rentalTransactions', JSON.stringify(updatedTransactions));
    
//     return newTransaction;
//   };

//   // Get rental data from Redux store
//   const rentalState = useRentalData() || {};
//   const rentalData = useMemo(() => {
//     if (rentalState.ResultSet && Array.isArray(rentalState.ResultSet)) {
//       return rentalState.ResultSet;
//     }
//     return rentalState.data || [];
//   }, [rentalState]);
//   const loading = rentalState.loading || false;
//   const error = rentalState.error || null;

//   const addRentalState = useRentalAddData() || {};
//   const addLoading = addRentalState.loading || false;
//   const addSuccess = addRentalState.success || false;
//   const addMessage = addRentalState.message || null;

//   const updateRentalState = useRentalUpdateData() || {};
//   const updateLoading = updateRentalState.loading || false;
//   const updateSuccess = updateRentalState.success || false;
//   const updateMessage = updateRentalState.message || null;

//   const returnClothState = useReturnClothData() || {};
//   const returnLoading = returnClothState.loading || false;
//   const returnSuccess = returnClothState.success || false;
//   const returnMessage = returnClothState.message || null;

//   const requestClothState = useRequestClothData() || {};
//   const requestLoading = requestClothState.loading || false;
//   const requestSuccess = requestClothState.success || false;
//   const requestMessage = requestClothState.message || null;

//   const photoPreviewState = usePhotoPreviewData() || {};
  
//   // Customer data extraction
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

//   const customerLoading = customerState.loading || false;

//   // Categories data extraction
//   const categoriesState = useSelector((state) => state.getAllCategory || {});
//   const categoriesData = useMemo(() => {
//     if (!categoriesState) return [];
    
//     if (categoriesState.ResultSet && Array.isArray(categoriesState.ResultSet)) {
//       return categoriesState.ResultSet;
//     }
//     else if (categoriesState.responseBody && Array.isArray(categoriesState.responseBody)) {
//       return categoriesState.responseBody;
//     }
//     else if (Array.isArray(categoriesState.data)) {
//       return categoriesState.data;
//     }
//     else if (Array.isArray(categoriesState)) {
//       return categoriesState;
//     }
//     else {
//       return [];
//     }
//   }, [categoriesState]);

//   const categoriesLoading = categoriesState.loading || false;

//   // Function to get category name by ID
//   const getCategoryNameById = useMemo(() => {
//     return (categoryId) => {
//       if (!categoryId || !categoriesData.length) return "N/A";
      
//       const category = categoriesData.find(cat => 
//         cat.CategoryId === categoryId || 
//         cat.CategoryId?.toString() === categoryId?.toString()
//       );
      
//       return category?.CategoryName || category?.Name || category?.name || "N/A";
//     };
//   }, [categoriesData]);

//   // Enhanced rental data with category names
//   const enhancedRentalData = useMemo(() => {
//     if (!rentalData || !Array.isArray(rentalData)) return [];
    
//     return rentalData.map(cloth => ({
//       ...cloth,
//       CategoryName: getCategoryNameById(cloth.CategoryId)
//     }));
//   }, [rentalData, getCategoryNameById]);

//   useEffect(() => {
//     dispatch(GetAllRental());
//     dispatch(GetAllCustomers());
//     dispatch(GetAllCategory());
//   }, [dispatch]);

//   // ✅ FIXED: Reset all notification states when component mounts
//   useEffect(() => {
//     setNotification({ message: "", type: "" });
//     setHasShownAddSuccess(false);
//     setHasShownUpdateSuccess(false);
//     setHasShownRequestSuccess(false);
//   }, []);

//   // // ✅ FIXED: Handle add success with proper cleanup
//   // useEffect(() => {
//   //   let timer;
    
//   //   if (addSuccess && addMessage && !hasShownAddSuccess) {
//   //     setNotification({ type: 'success', message: addMessage });
//   //     setHasShownAddSuccess(true);
//   //     setShowAddModal(false);
//   //     setFormData({ 
//   //       Name: "", 
//   //       Color: "", 
//   //       Size: "", 
//   //       Quantity: "", 
//   //       RentPrice: "",
//   //       Status: "Available",
//   //       CategoryId: "",
//   //       file: null
//   //     });
//   //     dispatch(GetAllRental());
      
//   //     // Auto-hide notification
//   //     timer = setTimeout(() => {
//   //       setNotification({ message: "", type: "" });
//   //     }, 3000);
//   //   }
    
//   //   return () => {
//   //     if (timer) clearTimeout(timer);
//   //   };
//   // }, [addSuccess, addMessage, hasShownAddSuccess, dispatch]);

//   // ✅ FIXED: Handle add success with proper cleanup
// useEffect(() => {
//   let timer;
  
//   if (addSuccess && addMessage && !hasShownAddSuccess) {
//     setNotification({ type: 'success', message: addMessage });
//     setHasShownAddSuccess(true);
//     setShowAddModal(false);
//     setFormData({ 
//       Name: "", 
//       Color: "", 
//       Size: "", 
//       Quantity: "", 
//       RentPrice: "",
//       Status: "Available",
//       CategoryId: "",
//       file: null
//     });
//     dispatch(GetAllRental());
    
//     // Auto-hide notification after 2 seconds
//     timer = setTimeout(() => {
//       setNotification({ message: "", type: "" });
//     }, 2000);
//   }
  
//   return () => {
//     if (timer) clearTimeout(timer);
//   };
// }, [addSuccess, addMessage, hasShownAddSuccess, dispatch]);


//   // // ✅ FIXED: Handle update success with proper cleanup
//   // useEffect(() => {
//   //   let timer;
    
//   //   if (updateSuccess && updateMessage && !hasShownUpdateSuccess) {
//   //     setNotification({ type: 'success', message: updateMessage });
//   //     setHasShownUpdateSuccess(true);
//   //     setShowEditModal(false);
//   //     setSelectedCloth(null);
//   //     setFormData({ 
//   //       Name: "", 
//   //       Color: "", 
//   //       Size: "", 
//   //       Quantity: "", 
//   //       RentPrice: "",
//   //       Status: "Available",
//   //       CategoryId: "",
//   //       file: null
//   //     });
//   //     dispatch(GetAllRental());
      
//   //     // Auto-hide notification
//   //     timer = setTimeout(() => {
//   //       setNotification({ message: "", type: "" });
//   //     }, 3000);
//   //   }
    
//   //   return () => {
//   //     if (timer) clearTimeout(timer);
//   //   };
//   // }, [updateSuccess, updateMessage, hasShownUpdateSuccess, dispatch]);

//   // ✅ FIXED: Handle update success with proper cleanup
// useEffect(() => {
//   let timer;
  
//   if (updateSuccess && updateMessage && !hasShownUpdateSuccess) {
//     setNotification({ type: 'success', message: updateMessage });
//     setHasShownUpdateSuccess(true);
//     setShowEditModal(false);
//     setSelectedCloth(null);
//     setFormData({ 
//       Name: "", 
//       Color: "", 
//       Size: "", 
//       Quantity: "", 
//       RentPrice: "",
//       Status: "Available",
//       CategoryId: "",
//       file: null
//     });
//     dispatch(GetAllRental());
    
//     // Auto-hide notification after 2 seconds
//     timer = setTimeout(() => {
//       setNotification({ message: "", type: "" });
//     }, 2000);
//   }
  
//   return () => {
//     if (timer) clearTimeout(timer);
//   };
// }, [updateSuccess, updateMessage, hasShownUpdateSuccess, dispatch]);

//   // ✅ FIXED: Handle request success without showing notification
//   useEffect(() => {
//     if (requestSuccess && !hasShownRequestSuccess) {
//       setHasShownRequestSuccess(true);
//       setShowRequestModal(false);
//       setRequestFormData({ ClothId: "", CustomerId: "", RentQuantity: "", RequestedSize: "", Color: "", RentPrice: "" });
//       dispatch(GetAllRental());
//     }
//   }, [requestSuccess, hasShownRequestSuccess, dispatch]);

//   // ✅ FIXED: Handle errors with proper cleanup
//   // useEffect(() => {
//   //   let timer;
    
//   //   if (error) {
//   //     setNotification({ type: 'error', message: error });
      
//   //     // Auto-hide error notification
//   //     timer = setTimeout(() => {
//   //       setNotification({ message: "", type: "" });
//   //     }, 3000);
//   //   }
    
//   //   return () => {
//   //     if (timer) clearTimeout(timer);
//   //   };
//   // }, [error]);

// //   useEffect(() => {
// //   let timer;
  
// //   if (error) {
// //     setNotification({ type: 'error', message: error });
    
// //     // Auto-hide error notification after 2 seconds
// //     timer = setTimeout(() => {
// //       setNotification({ message: "", type: "" });
// //     }, 2000);
// //   }
  
// //   return () => {
// //     if (timer) clearTimeout(timer);
// //   };
// // }, [error]);

// useEffect(() => {
//   let timer;
  
//   if (notification.message) {
//     // Auto-hide any notification after 2 seconds
//     timer = setTimeout(() => {
//       setNotification({ message: "", type: "" });
//     }, 2000);
//   }
  
//   return () => {
//     if (timer) clearTimeout(timer);
//   };
// }, [notification.message]);

//   // ✅ FIXED: Reset success trackers when modals open
//   useEffect(() => {
//     if (showAddModal) {
//       setHasShownAddSuccess(false);
//     }
//   }, [showAddModal]);

//   useEffect(() => {
//     if (showEditModal) {
//       setHasShownUpdateSuccess(false);
//     }
//   }, [showEditModal]);

//   useEffect(() => {
//     if (showRequestModal) {
//       setHasShownRequestSuccess(false);
//     }
//   }, [showRequestModal]);

//   // ✅ FIXED: Clear notification when search term changes or pagination changes
//   useEffect(() => {
//     setNotification({ message: "", type: "" });
//   }, [searchTerm, currentPage, filterStatus]);

//   // ✅ FIXED: Clear all notifications when component unmounts
//   useEffect(() => {
//     return () => {
//       setNotification({ message: "", type: "" });
//     };
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData(prev => ({
//         ...prev,
//         file: file
//       }));
//     }
//   };

//   const handleCategorySelect = (categoryId) => {
//     setFormData(prev => ({
//       ...prev,
//       CategoryId: categoryId
//     }));
//   };

//   const handleRequestInputChange = (e) => {
//     const { name, value } = e.target;
//     setRequestFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleCustomerSelect = (customerId) => {
//     setRequestFormData(prev => ({
//       ...prev,
//       CustomerId: customerId
//     }));
//   };

//   const handleAddCloth = async (e) => {
//     e.preventDefault();
//     try {
//       // Reset success tracker
//       setHasShownAddSuccess(false);
      
//       // Prepare data for API call - using FormData as per your service
//       const submitData = {
//         Name: formData.Name,
//         Color: formData.Color,
//         Size: formData.Size,
//         Quantity: parseInt(formData.Quantity) || 0,
//         RentPrice: parseFloat(formData.RentPrice) || 0,
//         Status: formData.Status,
//         CategoryId: formData.CategoryId || "",
//         file: formData.file // Send file directly
//       };

//       console.log('Submitting cloth data:', submitData);
//       await dispatch(AddRentalCloths(submitData));
//     } catch (error) {
//       console.error("Error adding cloth:", error);
//       setNotification({ type: 'error', message: 'Failed to add rental cloth' });
//     }
//   };

//   const handleEditCloth = (cloth) => {
//     setSelectedCloth(cloth);
//     setFormData({
//       Name: cloth.Name || "",
//       Color: cloth.Color || "",
//       Size: cloth.Size || "",
//       Quantity: cloth.Quantity || "",
//       RentPrice: cloth.RentPrice || "",
//       Status: cloth.Status || "Available",
//       CategoryId: cloth.CategoryId || "",
//       file: null // Reset file on edit
//     });
//     setShowEditModal(true);
//   };

//   const handleViewCloth = (cloth) => {
//     setSelectedCloth(cloth);
//     setShowDetailsModal(true);
//   };

//   const handleRequestCloth = (cloth) => {
//     setSelectedCloth(cloth);
//     setRequestFormData({
//       ClothId: cloth.ClothId || "",
//       CustomerId: "",
//       RentQuantity: "1",
//       RequestedSize: cloth.Size || "",
//       Color: cloth.Color || ""
//     });
//     setShowRequestModal(true);
//   };

//   const handleUpdateCloth = async (e) => {
//     e.preventDefault();
//     if (!selectedCloth) return;
    
//     try {
//       // Reset success tracker
//       setHasShownUpdateSuccess(false);
      
//       // Prepare data for API call - using FormData as per your service
//       const submitData = {
//         ClothId: selectedCloth.ClothId,
//         Name: formData.Name,
//         Color: formData.Color,
//         Size: formData.Size,
//         Quantity: parseInt(formData.Quantity) || 0,
//         RentPrice: parseFloat(formData.RentPrice) || 0,
//         Status: formData.Status,
//         CategoryId: formData.CategoryId || "",
//         file: formData.file // Send file directly
//       };

//       await dispatch(UpdateRentalCloths(submitData));
//     } catch (error) {
//       console.error("Error updating cloth:", error);
//       setNotification({ type: 'error', message: 'Failed to update rental cloth' });
//     }
//   };

//   const handleRequestSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Reset success tracker
//       setHasShownRequestSuccess(false);
      
//       await dispatch(RequestCloth(requestFormData));
      
//       // Add to rental transactions
//       addRentalTransaction(requestFormData, selectedCloth);
      
//       setShowRequestModal(false);
//       setRequestFormData({ ClothId: "", CustomerId: "", RentQuantity: "", RequestedSize: "", Color: "", RentPrice: "" });
//       dispatch(GetAllRental());
//     } catch (error) {
//       console.error("Error requesting cloth:", error);
//       setNotification({ type: 'error', message: 'Failed to request cloth' });
//     }
//   };

//   const handleRefresh = () => {
//     dispatch(GetAllRental());
//     dispatch(GetAllCustomers());
//     dispatch(GetAllCategory());
//   };

//   // FIXED: Filter and search logic with proper out-of-stock filtering
//   const filteredCloths = useMemo(() => {
//     if (!enhancedRentalData || !Array.isArray(enhancedRentalData)) return [];
    
//     const filtered = enhancedRentalData.filter(cloth => {
//       const matchesSearch = 
//         cloth.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cloth.Color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cloth.Size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cloth.ClothId?.toString().includes(searchTerm.toLowerCase()) ||
//         cloth.CategoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cloth.CategoryId?.toString().includes(searchTerm.toLowerCase());
      
//       // FIXED: Proper out-of-stock filtering logic
//       const matchesFilter = 
//         filterStatus === "all" || 
//         (filterStatus === "available" && cloth.Quantity > 0) ||
//         (filterStatus === "out-of-stock" && (cloth.Quantity === 0 || cloth.Quantity === "0"));
      
//       return matchesSearch && matchesFilter;
//     });

//     // Sort in descending order by ClothId (assuming higher IDs are newer)
//     return filtered.sort((a, b) => {
//       const idA = parseInt(a.ClothId) || 0;
//       const idB = parseInt(b.ClothId) || 0;
//       return idB - idA; // Descending order
//     });
//   }, [enhancedRentalData, searchTerm, filterStatus]);

//   // Size options for dropdown
//   const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

//   // Status options
//   const statusOptions = ["Available", "Not Available"];

//   // Calculate statistics - REMOVED averagePrice calculation
//   const totalCloths = enhancedRentalData?.length || 0;
//   const availableCloths = enhancedRentalData?.filter(item => item.Quantity > 0)?.length || 0;
//   const totalTypes = new Set(enhancedRentalData?.map(item => item.Name))?.size || 0;

//   // Pagination
//   const totalPages = Math.ceil(filteredCloths.length / recordsPerPage);
//   const currentRecords = useMemo(() => {
//     const indexOfLastRecord = currentPage * recordsPerPage;
//     const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//     return filteredCloths.slice(indexOfFirstRecord, indexOfLastRecord);
//   }, [filteredCloths, currentPage, recordsPerPage]);

//   const getPageNumbers = useMemo(() => {
//     const start = Math.max(1, currentPage - 1);
//     const end = Math.min(totalPages, start + 2);
//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//   }, [currentPage, totalPages]);

//   const getQuantityDisplay = (quantity) => {
//     return quantity === 0 ? "Out of Stock" : quantity;
//   };

//   const getQuantityColor = (quantity) => {
//     if (quantity === 0) return "text-red-600 font-semibold";
//     if (quantity <= 10) return "text-yellow-600 font-semibold";
//     return "text-green-600 font-semibold";
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'available': return 'text-green-600 bg-green-100';
//       case 'not available': return 'text-red-600 bg-red-100';
//       case 'maintenance': return 'text-orange-600 bg-orange-100';
//       case 'discontinued': return 'text-gray-600 bg-gray-100';
//       default: return 'text-blue-600 bg-blue-100';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-slate-600 font-medium">Loading rental cloths...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 md:p-6 relative overflow-hidden">
//       <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
//       {/* ✅ FIXED: Notification with proper cleanup */}
//       {notification.message && (
//         <div
//           className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center animate-slide-in ${
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
//       <div className="relative z-10 mb-6 sm:mb-8">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div className="flex items-center space-x-4">
//             <div className="p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
//               <FiShoppingBag className="text-white text-lg md:text-xl" />
//             </div>
//             <div className="transform ">
//               <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                 Rental Cloths
//               </h1>
//               <p className="text-slate-600 mt-1 text-sm md:text-base">Manage rental cloth inventory </p>
//             </div>
//           </div>

//           {/* View Toggle */}
//           <div className="flex items-center space-x-3 self-end lg:self-auto">
//             <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-xl">
//               <button
//                 onClick={() => setViewMode("table")}
//                 className={`p-3 rounded-xl transition-all duration-300 ${
//                   viewMode === "table" 
//                     ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
//                     : "text-slate-600 hover:text-slate-800"
//                 }`}
//                 title="Table View"
//               >
//                 <FiList size={18} />
//               </button>
//               <button
//                 onClick={() => setViewMode("card")}
//                 className={`p-3 rounded-xl transition-all duration-300 ${
//                   viewMode === "card" 
//                     ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
//                     : "text-slate-600 hover:text-slate-800"
//                 }`}
//                 title="Card View"
//               >
//                 <FiGrid size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Statistics Cards - REMOVED Avg. Rent Price card */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Total Cloths</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">{totalCloths}</p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiPackage className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Available Items</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">{availableCloths}</p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiBox className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Total Types</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">{totalTypes}</p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiTag className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Controls Section */}
//       <div className="relative z-10 mb-6 md:mb-8">
//         <div className="flex flex-col lg:flex-row gap-4">
//           {/* Search Input - Full width on mobile, flex on larger screens */}
//           <div className="relative flex-grow group">
//             <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//             <input
//               type="text"
//               placeholder="Search cloths by ID, name, color, size, or category..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="relative w-full pl-12 pr-6 py-3 md:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm md:text-base"
//             />
//             <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
//           </div>
          
//           {/* Filter and Add Button Container - Always in same row */}
//           <div className="flex items-center gap-3 w-full lg:w-auto">
//             {/* Filter Dropdown */}
//             <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl px-4 py-2 flex-1 lg:flex-none">
//               <FiFilter className="text-slate-400" />
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-700 font-medium w-full lg:w-auto"
//               >
//                 <option value="all">All Cloths</option>
//                 <option value="available">Available</option>
//                 <option value="out-of-stock">Out of Stock</option>
//               </select>
//             </div>

//             {/* Add Button */}
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 md:px-6 py-3 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 whitespace-nowrap flex-1 lg:flex-none min-w-[140px] md:min-w-[180px]"
//             >
//               <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//               <FiPlus className="mr-2 relative z-10" size={18} />
//               <span className="relative z-10 text-sm md:text-base">Add Rental Cloth</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table View */}
//       {viewMode === "table" ? (
//         <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-6 md:mb-8">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1000px]">
//               <thead>
//                 <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">ID</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Cloth Details</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Category</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Size</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Color</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Quantity</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Status</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Rent Price(Rs.)</th>
//                   <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200/50">
//                 {currentRecords.length > 0 ? (
//                   currentRecords.map((cloth, index) => (
//                     <tr 
//                       key={cloth.ClothId || index} 
//                       className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
//                     >
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <div className="flex items-center">
//                           <span className="text-sm font-mono font-normal text-slate-900">
//                             {cloth.ClothId}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <div className="flex items-center">
//                           <RentalImage 
//                             src={cloth.IMAGEURL} 
//                             alt={cloth.Name}
//                             className="w-10 h-10 rounded-lg object-cover shadow-sm"
//                             clothId={cloth.ClothId}
//                           />
//                           <div>
//                             <div className="text-sm font-normal text-slate-900">
//                               {cloth.Name}
//                             </div>
//                             {cloth.CreatedDate && (
//                               <div className="text-xs text-slate-500">
//                                 Added: {new Date(cloth.CreatedDate).toLocaleDateString()}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <span className="text-sm font-normal text-slate-900">
//                           {cloth.CategoryName || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <span className="text-sm font-normal text-slate-900">
//                           {cloth.Size}
//                         </span>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <div className="flex items-center">
//                           <div 
//                             className="w-4 h-4 rounded-full border border-gray-300 mr-2 shadow-sm"
//                             style={{ backgroundColor: cloth.Color?.toLowerCase() }}
//                           ></div>
//                           <span className="text-sm text-slate-900 capitalize">
//                             {cloth.Color}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <span className={`text-sm font-normal ${getQuantityColor(cloth.Quantity)}`}>
//                           {getQuantityDisplay(cloth.Quantity)}
//                         </span>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4">
//                         <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(cloth.Status)}`}>
//                           {cloth.Status || "Available"}
//                         </span>
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4 text-sm font-normal text-slate-900">
//                          {formatCurrency(cloth.RentPrice)}
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4 text-center">
//                         <div className="flex justify-center space-x-2">
//                           <button
//                             onClick={() => handleViewCloth(cloth)}
//                             className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                             title="View Details"
//                           >
//                             <FiEye size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleEditCloth(cloth)}
//                             className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                             title="Edit Cloth"
//                           >
//                             <FiEdit2 size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleRequestCloth(cloth)}
//                             className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                             title="Request Cloth"
//                             disabled={cloth.Quantity === 0}
//                           >
//                             <FiShoppingCart size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="text-center py-8 md:py-12">
//                       <div className="flex flex-col items-center space-y-3">
//                         <div className="p-3 md:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                           <FiPackage className="text-slate-500 text-lg md:text-xl" />
//                         </div>
//                         <p className="text-slate-500 font-medium">No rental cloths found</p>
//                         <p className="text-slate-400 text-sm">
//                           {searchTerm || filterStatus !== "all" 
//                             ? "Try adjusting your search or filter criteria" 
//                             : "Get started by adding your first rental cloth"}
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {filteredCloths.length > recordsPerPage && (
//             <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-4 md:space-y-0">
//               <div className="text-sm text-slate-600">
//                 Showing {currentPage * recordsPerPage - recordsPerPage + 1}–{Math.min(currentPage * recordsPerPage, filteredCloths.length)} of{' '}
//                 {filteredCloths.length}
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                 >
//                   <FiChevronLeft size={14} />
//                 </button>

//                 {getPageNumbers.map((page) => (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`px-2 md:px-3.5 py-1 md:py-1.5 rounded-xl border transition-all duration-300 transform hover:scale-105 text-sm ${
//                       currentPage === page
//                         ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
//                         : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}

//                 <button
//                   onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//                 >
//                   <FiChevronRight size={14} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       ) : (
//         /* Card View */
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
//           {currentRecords.map((cloth, index) => (
//             <div 
//               key={cloth.ClothId || index} 
//               className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group overflow-hidden cursor-pointer"
//               onClick={() => handleViewCloth(cloth)}
//             >
//               <div className="h-40 overflow-hidden bg-slate-100">
//                 <RentalImage 
//                   src={cloth.IMAGEURL} 
//                   alt={cloth.Name}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                   clothId={cloth.ClothId}
//                 />
//               </div>
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
//                       <FiPackage className="text-blue-600 text-lg" />
//                     </div>
//                     <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
//                       ID: {cloth.ClothId}
//                     </span>
//                   </div>
//                   <span className={`text-xs font-semibold ${getQuantityColor(cloth.Quantity)}`}>
//                     {getQuantityDisplay(cloth.Quantity)}
//                   </span>
//                 </div>
                
//                 <h3 className="font-bold text-slate-900 text-lg mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
//                   {cloth.Name}
//                 </h3>
                
//                 {cloth.CategoryName && (
//                   <div className="mb-3">
//                     <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
//                       {cloth.CategoryName}
//                     </span>
//                   </div>
//                 )}
                
//                 <div className="space-y-3 mb-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Size:</span>
//                     <span className="text-sm font-semibold text-slate-900">
//                       {cloth.Size}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Color:</span>
//                     <div className="flex items-center space-x-2">
//                       <div 
//                         className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
//                         style={{ backgroundColor: cloth.Color?.toLowerCase() }}
//                       ></div>
//                       <span className="text-sm font-semibold text-slate-900 capitalize">
//                         {cloth.Color}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Status:</span>
//                     <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(cloth.Status)}`}>
//                       {cloth.Status || "Available"}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Rent Price:</span>
//                     <span className="text-sm font-bold text-slate-900">
//                       Rs. {formatCurrency(cloth.RentPrice)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Add Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <div className="flex items-center justify-between mb-4 md:mb-6">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                     <FiPlus className="text-white text-base md:text-lg" />
//                   </div>
//                   <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                     Add Rental Cloth
//                   </h2>
//                 </div>
//                 <button 
//                   onClick={() => {
//                     setShowAddModal(false);
//                     setFormData(prev => ({ ...prev, file: null }));
//                   }}
//                   className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleAddCloth} className="space-y-4 md:space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Cloth Name </label>
//                     <input
//                       type="text"
//                       name="Name"
//                       value={formData.Name}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                       placeholder="Enter cloth name"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Color </label>
//                     <input
//                       type="text"
//                       name="Color"
//                       value={formData.Color}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                       placeholder="Enter color"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Size </label>
//                     <select
//                       name="Size"
//                       value={formData.Size}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     >
//                       <option value="">Select size</option>
//                       {sizeOptions.map(size => (
//                         <option key={size} value={size}>{size}</option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Quantity </label>
//                     <input
//                       type="number"
//                       name="Quantity"
//                       value={formData.Quantity}
//                       onChange={handleInputChange}
//                       required
//                       min="0"
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                       placeholder="Enter quantity"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Rent Price (Rs.) </label>
//                     <input
//                       type="number"
//                       name="RentPrice"
//                       value={formData.RentPrice}
//                       onChange={handleInputChange}
//                       required
//                       min="1"
//                       step="0.01"
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                       placeholder="Enter rent price"
//                     />
//                   </div>

//                   {/* Status field removed - automatically set to "Available" */}

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
//                     <CategoriesDropdown
//                       value={formData.CategoryId}
//                       onChange={handleCategorySelect}
//                       categories={categoriesData}
//                       loading={categoriesLoading}
//                       placeholder="Select category"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Cloth Image
//                       <span className="text-slate-400 text-xs ml-1">(Optional)</span>
//                     </label>
                    
//                     <div className="space-y-4">
//                       <div className="relative group">
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageChange}
//                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
//                           id="image-upload-add"
//                         />
//                         <div className="w-full px-6 py-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50 group-hover:shadow-lg text-center cursor-pointer">
//                           <FiUpload className="mx-auto text-slate-400 mb-3 group-hover:text-blue-500 transition-colors" size={32} />
//                           <p className="text-sm font-medium text-slate-600 mb-1">
//                             {formData.file ? formData.file.name : "Click to upload image"}
//                           </p>
//                           <p className="text-xs text-slate-500">
//                             Supports: PNG, JPG, JPEG, WEBP • Max: 5MB
//                           </p>
//                         </div>
//                       </div>

//                       {formData.file && (
//                         <div className="flex flex-col items-center space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
//                           <div className="flex items-center justify-between w-full">
//                             <p className="text-sm font-medium text-slate-700">Image Preview:</p>
//                             <button
//                               type="button"
//                               onClick={() => setFormData(prev => ({ ...prev, file: null }))}
//                               className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors text-sm"
//                             >
//                               <FiX size={14} />
//                               <span>Remove</span>
//                             </button>
//                           </div>
//                           <div className="relative">
//                             <img 
//                               src={URL.createObjectURL(formData.file)} 
//                               alt="Preview"
//                               className="w-40 h-40 object-cover rounded-xl shadow-lg border border-slate-300"
//                             />
//                           </div>
//                           <div className="text-center">
//                             <p className="text-xs text-slate-600 font-medium">{formData.file.name}</p>
//                             <p className="text-xs text-slate-500">
//                               Size: {(formData.file.size / 1024 / 1024).toFixed(2)} MB • 
//                               Type: {formData.file.type.split('/')[1]?.toUpperCase()}
//                             </p>
//                           </div>
//                         </div>
//                       )}

//                       {!formData.file && (
//                         <div className="text-center">
//                           <div className="inline-flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-full">
//                             <FiInfo className="text-blue-500" size={14} />
//                             <span>No image selected. You can add one later.</span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowAddModal(false);
//                       setFormData(prev => ({ ...prev, file: null }));
//                     }}
//                     className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={addLoading}
//                     className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
//                   >
//                     {addLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         <span>Adding...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FiPlus size={16} />
//                         <span>Add Cloth</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && selectedCloth && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <div className="flex items-center justify-between mb-4 md:mb-6">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                     <FiEdit2 className="text-white text-base md:text-lg" />
//                   </div>
//                   <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                     Edit Rental Cloth
//                   </h2>
//                 </div>
//                 <button 
//                   onClick={() => setShowEditModal(false)}
//                   className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleUpdateCloth} className="space-y-4 md:space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Cloth Name </label>
//                     <input
//                       type="text"
//                       name="Name"
//                       value={formData.Name}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Color </label>
//                     <input
//                       type="text"
//                       name="Color"
//                       value={formData.Color}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Size </label>
//                     <select
//                       name="Size"
//                       value={formData.Size}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     >
//                       <option value="">Select size</option>
//                       {sizeOptions.map(size => (
//                         <option key={size} value={size}>{size}</option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Quantity </label>
//                     <input
//                       type="number"
//                       name="Quantity"
//                       value={formData.Quantity}
//                       onChange={handleInputChange}
//                       required
//                       min="0"
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Rent Price (Rs.) </label>
//                     <input
//                       type="number"
//                       name="RentPrice"
//                       value={formData.RentPrice}
//                       onChange={handleInputChange}
//                       required
//                       min="1"
//                       step="0.01"
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
//                     <select
//                       name="Status"
//                       value={formData.Status}
//                       onChange={handleInputChange}
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     >
//                       {statusOptions.map(status => (
//                         <option key={status} value={status}>{status}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
//                     <CategoriesDropdown
//                       value={formData.CategoryId}
//                       onChange={handleCategorySelect}
//                       categories={categoriesData}
//                       loading={categoriesLoading}
//                       placeholder="Select category"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-slate-700 mb-2">Cloth Image</label>
//                     <div className="flex items-center space-x-4">
//                       <div className="flex-1">
//                         <div className="relative">
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                             id="image-upload-edit"
//                           />
//                           <div className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50 text-center cursor-pointer">
//                             <FiUpload className="mx-auto text-slate-400 mb-2" size={24} />
//                             <p className="text-sm text-slate-600">
//                               {formData.file ? formData.file.name : "Click to upload new image"}
//                             </p>
//                             <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
//                           </div>
//                         </div>
//                       </div>
//                       {formData.file ? (
//                         <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
//                           <img 
//                             src={URL.createObjectURL(formData.file)} 
//                             alt="Preview"
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       ) : (
//                         <RentalImage 
//                           src={selectedCloth.IMAGEURL} 
//                           alt="Current"
//                           className="w-20 h-20 rounded-lg object-cover border border-slate-200"
//                           clothId={selectedCloth.ClothId}
//                         />
//                       )}
//                     </div>
//                     {!formData.file && (
//                       <p className="text-xs text-slate-500 mt-2">Current image will be kept if no new image is selected</p>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowEditModal(false)}
//                     className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={updateLoading}
//                     className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
//                   >
//                     {updateLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         <span>Updating...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FiSave size={16} />
//                         <span>Update Cloth</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Request Modal with Customer Dropdown */}
//       {showRequestModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-2xl">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform rotate-1"></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <div className="flex items-center justify-between mb-4 md:mb-6">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                     <FiShoppingCart className="text-white text-base md:text-lg" />
//                   </div>
//                   <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                     Request Rental Cloth
//                   </h2>
//                 </div>
//                 <button 
//                   onClick={() => setShowRequestModal(false)}
//                   className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleRequestSubmit} className="space-y-4 md:space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Cloth ID </label>
//                   <input
//                     type="text"
//                     name="ClothId"
//                     value={requestFormData.ClothId}
//                     onChange={handleRequestInputChange}
//                     required
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     placeholder="Enter cloth ID"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Customer </label>
//                   <CustomerDropdown
//                     value={requestFormData.CustomerId}
//                     onChange={handleCustomerSelect}
//                     customers={customerData}
//                     loading={customerLoading}
//                     placeholder="Search customer by name..."
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Rent Quantity </label>
//                   <input
//                     type="number"
//                     name="RentQuantity"
//                     value={requestFormData.RentQuantity}
//                     onChange={handleRequestInputChange}
//                     required
//                     min="1"
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     placeholder="Enter quantity to rent"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Requested Size</label>
//                   <select
//                     name="RequestedSize"
//                     value={requestFormData.RequestedSize}
//                     onChange={handleRequestInputChange}
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                   >
//                     <option value="">Select size</option>
//                     {sizeOptions.map(size => (
//                       <option key={size} value={size}>{size}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
//                   <input
//                     type="text"
//                     name="Color"
//                     value={requestFormData.Color}
//                     onChange={handleRequestInputChange}
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     placeholder="Enter color"
//                   />
//                 </div>
                
//                 <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowRequestModal(false)}
//                     className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={requestLoading || !requestFormData.CustomerId}
//                     className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
//                   >
//                     {requestLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         <span>Requesting...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FiShoppingCart size={16} />
//                         <span>Request Cloth</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Enhanced Details Modal */}
// {showDetailsModal && selectedCloth && (
//   <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-2 sm:p-4">
//     {/* Mobile: Mini version, Desktop: Current version */}
//     <div className="relative w-full max-w-2xl sm:max-w-4xl max-h-[80vh] sm:max-h-[90vh] overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl sm:rounded-3xl blur opacity-20 transform "></div>
//       <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 max-h-full overflow-y-auto">
//         <div className="p-4 sm:p-6">
//           {/* Header - Mobile Mini, Desktop Normal */}
//           <div className="flex justify-between items-center mb-3 sm:mb-4 sm:mb-6">
//             <div className="flex items-center space-x-2 sm:space-x-3">
//               <div className="p-2 sm:p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiShoppingBag className="text-white text-sm sm:text-base sm:text-lg" />
//               </div>
//               <h2 className="text-lg sm:text-xl sm:text-2xl font-normal bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                 Cloth Details
//               </h2>
//             </div>
//             <button 
//               onClick={() => setShowDetailsModal(false)}
//               className="p-1 sm:p-2 text-slate-400 hover:text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//             >
//               <FiX className="text-lg sm:text-xl sm:text-2xl" />
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-4 sm:gap-8">
//             {/* Image Section - Mobile Mini, Desktop Normal */}
//             <div>
//               <h3 className="text-sm sm:text-base sm:text-lg font-normal mb-2 sm:mb-3 sm:mb-4 text-slate-800">Cloth Image</h3>
//               <div className="border sm:border-2 border-slate-300 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
//                 <RentalImage 
//                   src={selectedCloth.IMAGEURL} 
//                   alt={selectedCloth.Name}
//                   className="w-full h-auto max-h-48 sm:max-h-64 sm:max-h-96 object-contain"
//                   clothId={selectedCloth.ClothId}
//                 />
//               </div>
              
//               {/* Download Button - Fixed Version */}
//               {selectedCloth.ClothId && (
//                 <div className="mt-2 sm:mt-3 sm:mt-4 flex justify-center">
//                   <a 
//                     href={selectedCloth.IMAGEURL || `https://tailorbackend.dockyardsoftware.com/Rental/PhotoPrivew?CID=${selectedCloth.ClothId}`}
//                     download={`${(selectedCloth.Name || 'cloth').replace(/\s+/g, '_')}_${selectedCloth.ClothId}.jpg`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="px-3 sm:px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-lg sm:rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center font-normal text-xs sm:text-sm sm:text-base"
//                   >
//                     <FiDownload className="mr-1 sm:mr-1 sm:mr-2" />
//                     Download Image
//                   </a>
//                 </div>
//               )}
//             </div>

//             {/* Cloth Details Section - Mobile Mini, Desktop Normal */}
//             <div>
//               <h3 className="text-sm sm:text-base sm:text-lg font-normal mb-2 sm:mb-3 sm:mb-4 text-slate-800">Cloth Information</h3>
//               <div className="bg-slate-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 sm:p-6 border border-slate-200/50">
//                 <table className="w-full border-collapse text-xs sm:text-sm sm:text-base">
//                   <tbody>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700 w-1/2">Cloth ID</td>
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-900">
//                         {selectedCloth.ClothId}
//                       </td>
//                     </tr>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Name</td>
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-900">
//                         {selectedCloth.Name}
//                       </td>
//                     </tr>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Category</td>
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-900">
//                         {getCategoryNameById(selectedCloth.CategoryId) || "N/A"}
//                       </td>
//                     </tr>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Size</td>
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-900">
//                         {selectedCloth.Size}
//                       </td>
//                     </tr>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Color</td>
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-900">
//                         <div className="flex items-center">
//                           <div 
//                             className="w-4 h-4 rounded-full border border-slate-300 mr-2 shadow-sm"
//                             style={{ backgroundColor: selectedCloth.Color?.toLowerCase() }}
//                           ></div>
//                           <span className="capitalize">
//                             {selectedCloth.Color}
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Quantity</td>
//                       <td className={`py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal ${getQuantityColor(selectedCloth.Quantity)}`}>
//                         {getQuantityDisplay(selectedCloth.Quantity)}
//                       </td>
//                     </tr>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Status</td>
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4">
//                         <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedCloth.Status)}`}>
//                           {selectedCloth.Status || "Available"}
//                         </span>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Rent Price</td>
//                       <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-green-700">
//                         Rs. {formatCurrency(selectedCloth.RentPrice)}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default RentalCloths;




import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  GetAllRental, 
  AddRentalCloths, 
  UpdateRentalCloths,
  ReturnCloth,
  RequestCloth,
  PhotoPrivew
} from "../actions/rentalAction";
import { GetAllCustomers } from "../actions/customerActions";
import { GetAllCategory } from "../actions/categoryAction";
import { 
  FiPlus, 
  FiEdit2, 
  FiEye, 
  FiSearch, 
  FiGrid, 
  FiList,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiBox,
  FiFilter,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiSave,
  FiShoppingBag,
  FiInfo,
  FiShoppingCart,
  FiRotateCw,
  FiLayers,
  FiArchive,
  FiUser,
  FiChevronDown,
  FiImage,
  FiCalendar,
  FiUpload,
  FiPaperclip,
  FiDownload,
} from "react-icons/fi";

const formatCurrency = (amount) => {
  return parseFloat(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Enhanced Image Component with Photo Preview Support
const RentalImage = ({ src, alt, className, clothId }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Generate proper image URL using the photo preview endpoint
  const imageUrl = clothId 
    ? `https://tailorbackend.dockyardsoftware.com/Rental/PhotoPrivew?CID=${clothId}`
    : src;

  if (!imageUrl || imageError) {
    return (
      <div className={`${className} bg-slate-200 rounded-lg flex items-center justify-center mr-3`}>
        <FiImage className="text-slate-400" size={16} />
      </div>
    );
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div className={`${className} bg-slate-200 rounded-lg flex items-center justify-center absolute mr-3`}>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
      <img 
        src={imageUrl}
        alt={alt}
        className={`${className} rounded-lg object-cover mr-3 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
      />
    </div>
  );
};

// Custom hooks for rental data
const useRentalData = () => {
  return useSelector((state) => state.getAllRental);
};

const useRentalAddData = () => {
  return useSelector((state) => state.addRental);
};

const useRentalUpdateData = () => {
  return useSelector((state) => state.updateRental);
};

const useReturnClothData = () => {
  return useSelector((state) => state.returnCloth);
};

const useRequestClothData = () => {
  return useSelector((state) => state.requestCloth);
};

const usePhotoPreviewData = () => {
  return useSelector((state) => state.photoPreview);
};

// Enhanced Customer Dropdown Component
const CustomerDropdown = ({ 
  value, 
  onChange, 
  customers = [], 
  loading = false,
  placeholder = "Search customer by name..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const customerList = useMemo(() => {
    if (!customers) return [];
    
    let customerArray = [];
    
    if (customers.ResultSet && Array.isArray(customers.ResultSet)) {
      customerArray = customers.ResultSet;
    }
    else if (customers.responseBody && Array.isArray(customers.responseBody)) {
      customerArray = customers.responseBody;
    }
    else if (Array.isArray(customers)) {
      customerArray = customers;
    }
    else if (customers.data && Array.isArray(customers.data)) {
      customerArray = customers.data;
    }
    
    return customerArray
      .filter(customer => customer && (customer.FullName || customer.CustomerName || customer.name))
      .map(customer => ({
        ...customer,
        CustomerName: customer.FullName || customer.CustomerName || customer.name || 'Unknown Customer',
        CustomerId: customer.CustomerId || customer.id || customer._id || '',
        PhoneNumber: customer.PhoneNumber || customer.phone || customer.contact || '',
        Email: customer.Email || customer.email || ''
      }));
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customerList;
    
    return customerList.filter(customer => 
      customer.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.CustomerId?.toString().includes(searchTerm.toLowerCase()) ||
      customer.PhoneNumber?.includes(searchTerm) ||
      customer.Email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customerList, searchTerm]);

  useEffect(() => {
    if (value && customerList.length > 0) {
      const customer = customerList.find(c => 
        c.CustomerId === value || 
        c.CustomerId?.toString() === value
      );
      setSelectedCustomer(customer || null);
    } else {
      setSelectedCustomer(null);
    }
  }, [value, customerList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    onChange(customer.CustomerId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const clearSelection = () => {
    setSelectedCustomer(null);
    setSearchTerm("");
    onChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const displayValue = selectedCustomer ? selectedCustomer.CustomerName : searchTerm;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {selectedCustomer && (
            <button
              type="button"
              onClick={clearSelection}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiX size={16} />
            </button>
          )}
          <FiChevronDown 
            className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            size={16} 
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-slate-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm">Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              {searchTerm ? "No customers found" : "No customers available"}
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div
                key={customer.CustomerId}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectCustomer(customer)}
                className={`p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-slate-100 last:border-b-0 ${
                  selectedCustomer?.CustomerId === customer.CustomerId ? 'bg-blue-100 border-blue-200' : ''
                }`}
              >
                <div className="font-medium text-slate-800">
                  {customer.CustomerName}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  ID: {customer.CustomerId} | 
                  Phone: {customer.PhoneNumber || 'N/A'} | 
                  Email: {customer.Email || 'N/A'}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Categories Dropdown Component
const CategoriesDropdown = ({ 
  value, 
  onChange, 
  categories = [], 
  loading = false,
  placeholder = "Select category"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const categoryList = useMemo(() => {
    if (!categories) return [];
    
    let categoryArray = [];
    
    if (categories.ResultSet && Array.isArray(categories.ResultSet)) {
      categoryArray = categories.ResultSet;
    }
    else if (categories.responseBody && Array.isArray(categories.responseBody)) {
      categoryArray = categories.responseBody;
    }
    else if (Array.isArray(categories)) {
      categoryArray = categories;
    }
    else if (categories.data && Array.isArray(categories.data)) {
      categoryArray = categories.data;
    }
    
    return categoryArray
      .filter(category => category && (category.CategoryName || category.Name || category.name))
      .map(category => ({
        ...category,
        CategoryName: category.CategoryName || category.Name || category.name || 'Unknown Category',
        CategoryId: category.CategoryId || category.id || category._id || ''
      }));
  }, [categories]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categoryList;
    
    return categoryList.filter(category => 
      category.CategoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.CategoryId?.toString().includes(searchTerm.toLowerCase())
    );
  }, [categoryList, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectCategory = (category) => {
    onChange(category.CategoryId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const selectedCategory = categoryList.find(cat => 
    cat.CategoryId === value
  );

  const displayValue = selectedCategory ? selectedCategory.CategoryName : searchTerm;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <FiChevronDown 
            className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            size={16} 
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-slate-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              {searchTerm ? "No categories found" : "No categories available"}
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category.CategoryId}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectCategory(category)}
                className={`p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-slate-100 last:border-b-0 ${
                  selectedCategory?.CategoryId === category.CategoryId ? 'bg-blue-100 border-blue-200' : ''
                }`}
              >
                <div className="font-medium text-slate-800">
                  {category.CategoryName}
                </div>
                {category.CategoryId && (
                  <div className="text-xs text-slate-500 mt-1">
                    ID: {category.CategoryId}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const RentalCloths = () => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedCloth, setSelectedCloth] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
  // Track if we've shown notifications to prevent duplicates
  const [hasShownAddSuccess, setHasShownAddSuccess] = useState(false);
  const [hasShownUpdateSuccess, setHasShownUpdateSuccess] = useState(false);
  const [hasShownRequestSuccess, setHasShownRequestSuccess] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    Name: "",
    Color: "",
    Size: "",
    Quantity: "",
    RentPrice: "",
    Status: "Available",
    CategoryId: "",
    file: null
  });

  const [requestFormData, setRequestFormData] = useState({
    ClothId: "",
    CustomerId: "",
    RentQuantity: "",
    RequestedSize: "",
    Color: "",
    RentPrice: ""
  });

  // Function to add rental transaction to localStorage
  const addRentalTransaction = (requestData, cloth) => {
    const savedTransactions = localStorage.getItem('rentalTransactions');
    const existingTransactions = savedTransactions ? JSON.parse(savedTransactions) : [];
    
    const newRentalId = existingTransactions.length > 0 
      ? Math.max(...existingTransactions.map(t => t.RentalId)) + 1 
      : 1;
    
    const newTransaction = {
      RentalId: newRentalId,
      ClothId: requestData.ClothId,
      CustomerId: requestData.CustomerId,
      Quantity: parseInt(requestData.RentQuantity),
      RequestedColor: requestData.Color,
      RequestedSize: requestData.RequestedSize,
      RentPrice: parseFloat(cloth.RentPrice),
      RentDate: new Date().toISOString(),
      ReturnDate: null,
      Status: "Rented",
      DamageFee: 0,
      FinalAmount: cloth.RentPrice
    };
    
    const updatedTransactions = [newTransaction, ...existingTransactions];
    localStorage.setItem('rentalTransactions', JSON.stringify(updatedTransactions));
    
    return newTransaction;
  };

  // Get rental data from Redux store
  const rentalState = useRentalData() || {};
  const rentalData = useMemo(() => {
    if (rentalState.ResultSet && Array.isArray(rentalState.ResultSet)) {
      return rentalState.ResultSet;
    }
    return rentalState.data || [];
  }, [rentalState]);
  const loading = rentalState.loading || false;
  const error = rentalState.error || null;

  const addRentalState = useRentalAddData() || {};
  const addLoading = addRentalState.loading || false;
  const addSuccess = addRentalState.success || false;
  const addMessage = addRentalState.message || null;

  const updateRentalState = useRentalUpdateData() || {};
  const updateLoading = updateRentalState.loading || false;
  const updateSuccess = updateRentalState.success || false;
  const updateMessage = updateRentalState.message || null;

  const returnClothState = useReturnClothData() || {};
  const returnLoading = returnClothState.loading || false;
  const returnSuccess = returnClothState.success || false;
  const returnMessage = returnClothState.message || null;

  const requestClothState = useRequestClothData() || {};
  const requestLoading = requestClothState.loading || false;
  const requestSuccess = requestClothState.success || false;
  const requestMessage = requestClothState.message || null;

  const photoPreviewState = usePhotoPreviewData() || {};
  
  // Customer data extraction
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

  const customerLoading = customerState.loading || false;

  // Categories data extraction
  const categoriesState = useSelector((state) => state.getAllCategory || {});
  const categoriesData = useMemo(() => {
    if (!categoriesState) return [];
    
    if (categoriesState.ResultSet && Array.isArray(categoriesState.ResultSet)) {
      return categoriesState.ResultSet;
    }
    else if (categoriesState.responseBody && Array.isArray(categoriesState.responseBody)) {
      return categoriesState.responseBody;
    }
    else if (Array.isArray(categoriesState.data)) {
      return categoriesState.data;
    }
    else if (Array.isArray(categoriesState)) {
      return categoriesState;
    }
    else {
      return [];
    }
  }, [categoriesState]);

  const categoriesLoading = categoriesState.loading || false;

  // Function to get category name by ID
  const getCategoryNameById = useMemo(() => {
    return (categoryId) => {
      if (!categoryId || !categoriesData.length) return "N/A";
      
      const category = categoriesData.find(cat => 
        cat.CategoryId === categoryId || 
        cat.CategoryId?.toString() === categoryId?.toString()
      );
      
      return category?.CategoryName || category?.Name || category?.name || "N/A";
    };
  }, [categoriesData]);

  // Enhanced rental data with category names
  const enhancedRentalData = useMemo(() => {
    if (!rentalData || !Array.isArray(rentalData)) return [];
    
    return rentalData.map(cloth => ({
      ...cloth,
      CategoryName: getCategoryNameById(cloth.CategoryId)
    }));
  }, [rentalData, getCategoryNameById]);

  useEffect(() => {
    dispatch(GetAllRental());
    dispatch(GetAllCustomers());
    dispatch(GetAllCategory());
  }, [dispatch]);

  // ✅ FIXED: Reset all notification states when component mounts
  useEffect(() => {
    setNotification({ message: "", type: "" });
    setHasShownAddSuccess(false);
    setHasShownUpdateSuccess(false);
    setHasShownRequestSuccess(false);
  }, []);

  // ✅ FIXED: Handle add success with proper cleanup
  useEffect(() => {
    let timer;
    
    if (addSuccess && addMessage && !hasShownAddSuccess) {
      setNotification({ type: 'success', message: addMessage });
      setHasShownAddSuccess(true);
      setShowAddModal(false);
      setFormData({ 
        Name: "", 
        Color: "", 
        Size: "", 
        Quantity: "", 
        RentPrice: "",
        Status: "Available",
        CategoryId: "",
        file: null
      });
      dispatch(GetAllRental());
      
      // Auto-hide notification after 2 seconds
      timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [addSuccess, addMessage, hasShownAddSuccess, dispatch]);

  // ✅ FIXED: Handle update success with proper cleanup
  useEffect(() => {
    let timer;
    
    if (updateSuccess && updateMessage && !hasShownUpdateSuccess) {
      setNotification({ type: 'success', message: updateMessage });
      setHasShownUpdateSuccess(true);
      setShowEditModal(false);
      setSelectedCloth(null);
      setFormData({ 
        Name: "", 
        Color: "", 
        Size: "", 
        Quantity: "", 
        RentPrice: "",
        Status: "Available",
        CategoryId: "",
        file: null
      });
      dispatch(GetAllRental());
      
      // Auto-hide notification after 2 seconds
      timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [updateSuccess, updateMessage, hasShownUpdateSuccess, dispatch]);

  // ✅ FIXED: Handle request success without showing notification
  useEffect(() => {
    if (requestSuccess && !hasShownRequestSuccess) {
      setHasShownRequestSuccess(true);
      setShowRequestModal(false);
      setRequestFormData({ ClothId: "", CustomerId: "", RentQuantity: "", RequestedSize: "", Color: "", RentPrice: "" });
      dispatch(GetAllRental());
    }
  }, [requestSuccess, hasShownRequestSuccess, dispatch]);

  useEffect(() => {
    let timer;
    
    if (notification.message) {
      // Auto-hide any notification after 2 seconds
      timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [notification.message]);

  // ✅ FIXED: Reset success trackers when modals open
  useEffect(() => {
    if (showAddModal) {
      setHasShownAddSuccess(false);
    }
  }, [showAddModal]);

  useEffect(() => {
    if (showEditModal) {
      setHasShownUpdateSuccess(false);
    }
  }, [showEditModal]);

  useEffect(() => {
    if (showRequestModal) {
      setHasShownRequestSuccess(false);
    }
  }, [showRequestModal]);

  // ✅ FIXED: Clear notification when search term changes or pagination changes
  useEffect(() => {
    setNotification({ message: "", type: "" });
  }, [searchTerm, currentPage, filterStatus]);

  // ✅ FIXED: Clear all notifications when component unmounts
  useEffect(() => {
    return () => {
      setNotification({ message: "", type: "" });
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      CategoryId: categoryId
    }));
  };

  const handleRequestInputChange = (e) => {
    const { name, value } = e.target;
    setRequestFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomerSelect = (customerId) => {
    setRequestFormData(prev => ({
      ...prev,
      CustomerId: customerId
    }));
  };

  const handleAddCloth = async (e) => {
    e.preventDefault();
    try {
      // Reset success tracker
      setHasShownAddSuccess(false);
      
      // Prepare data for API call - using FormData as per your service
      const submitData = {
        Name: formData.Name,
        Color: formData.Color,
        Size: formData.Size,
        Quantity: parseInt(formData.Quantity) || 0,
        RentPrice: parseFloat(formData.RentPrice) || 0,
        Status: formData.Status,
        CategoryId: formData.CategoryId || "",
        file: formData.file // Send file directly
      };

      console.log('Submitting cloth data:', submitData);
      await dispatch(AddRentalCloths(submitData));
    } catch (error) {
      console.error("Error adding cloth:", error);
      setNotification({ type: 'error', message: 'Failed to add rental cloth' });
    }
  };

  const handleEditCloth = (cloth) => {
    setSelectedCloth(cloth);
    setFormData({
      Name: cloth.Name || "",
      Color: cloth.Color || "",
      Size: cloth.Size || "",
      Quantity: cloth.Quantity || "",
      RentPrice: cloth.RentPrice || "",
      Status: cloth.Status || "Available",
      CategoryId: cloth.CategoryId || "",
      file: null // Reset file on edit
    });
    setShowEditModal(true);
  };

  const handleViewCloth = (cloth) => {
    setSelectedCloth(cloth);
    setShowDetailsModal(true);
  };

  const handleRequestCloth = (cloth) => {
    setSelectedCloth(cloth);
    setRequestFormData({
      ClothId: cloth.ClothId || "",
      CustomerId: "",
      RentQuantity: "1",
      RequestedSize: cloth.Size || "",
      Color: cloth.Color || ""
    });
    setShowRequestModal(true);
  };

  const handleUpdateCloth = async (e) => {
    e.preventDefault();
    if (!selectedCloth) return;
    
    try {
      // Reset success tracker
      setHasShownUpdateSuccess(false);
      
      // Prepare data for API call - using FormData as per your service
      const submitData = {
        ClothId: selectedCloth.ClothId,
        Name: formData.Name,
        Color: formData.Color,
        Size: formData.Size,
        Quantity: parseInt(formData.Quantity) || 0,
        RentPrice: parseFloat(formData.RentPrice) || 0,
        Status: formData.Status,
        CategoryId: formData.CategoryId || "",
        file: formData.file // Send file directly
      };

      await dispatch(UpdateRentalCloths(submitData));
    } catch (error) {
      console.error("Error updating cloth:", error);
      setNotification({ type: 'error', message: 'Failed to update rental cloth' });
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      // Reset success tracker
      setHasShownRequestSuccess(false);
      
      await dispatch(RequestCloth(requestFormData));
      
      // Add to rental transactions
      addRentalTransaction(requestFormData, selectedCloth);
      
      setShowRequestModal(false);
      setRequestFormData({ ClothId: "", CustomerId: "", RentQuantity: "", RequestedSize: "", Color: "", RentPrice: "" });
      dispatch(GetAllRental());
    } catch (error) {
      console.error("Error requesting cloth:", error);
      setNotification({ type: 'error', message: 'Failed to request cloth' });
    }
  };

  const handleRefresh = () => {
    dispatch(GetAllRental());
    dispatch(GetAllCustomers());
    dispatch(GetAllCategory());
  };

  // FIXED: Filter and search logic with proper out-of-stock filtering
  const filteredCloths = useMemo(() => {
    if (!enhancedRentalData || !Array.isArray(enhancedRentalData)) return [];
    
    const filtered = enhancedRentalData.filter(cloth => {
      const matchesSearch = 
        cloth.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cloth.Color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cloth.Size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cloth.ClothId?.toString().includes(searchTerm.toLowerCase()) ||
        cloth.CategoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cloth.CategoryId?.toString().includes(searchTerm.toLowerCase());
      
      // FIXED: Proper out-of-stock filtering logic
      const matchesFilter = 
        filterStatus === "all" || 
        (filterStatus === "available" && cloth.Quantity > 0) ||
        (filterStatus === "out-of-stock" && (cloth.Quantity === 0 || cloth.Quantity === "0"));
      
      return matchesSearch && matchesFilter;
    });

    // Sort in descending order by ClothId (assuming higher IDs are newer)
    return filtered.sort((a, b) => {
      const idA = parseInt(a.ClothId) || 0;
      const idB = parseInt(b.ClothId) || 0;
      return idB - idA; // Descending order
    });
  }, [enhancedRentalData, searchTerm, filterStatus]);

  // Size options for dropdown
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  // Status options
  const statusOptions = ["Available", "Not Available"];

  // Calculate statistics - REMOVED averagePrice calculation
  const totalCloths = enhancedRentalData?.length || 0;
  const availableCloths = enhancedRentalData?.filter(item => item.Quantity > 0)?.length || 0;
  const totalTypes = new Set(enhancedRentalData?.map(item => item.Name))?.size || 0;

  // Pagination
  const totalPages = Math.ceil(filteredCloths.length / recordsPerPage);
  const currentRecords = useMemo(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    return filteredCloths.slice(indexOfFirstRecord, indexOfLastRecord);
  }, [filteredCloths, currentPage, recordsPerPage]);

  const getPageNumbers = useMemo(() => {
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const getQuantityDisplay = (quantity) => {
    return quantity === 0 ? "Out of Stock" : quantity;
  };

  const getQuantityColor = (quantity) => {
    if (quantity === 0) return "text-red-600 font-semibold";
    if (quantity <= 10) return "text-yellow-600 font-semibold";
    return "text-green-600 font-semibold";
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'not available': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-orange-600 bg-orange-100';
      case 'discontinued': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading rental cloths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 md:p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
      {/* ✅ FIXED: Notification with proper cleanup */}
      {notification.message && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center animate-slide-in ${
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

      {/* ✅ FIXED: Header Section with view toggle in top right corner */}
      <div className="relative z-10 mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div className="flex items-center space-x-4">
            <div className="p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl">
              <FiShoppingBag className="text-white text-lg md:text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Rental Cloths
              </h1>
              <p className="text-slate-600 mt-1 text-sm md:text-base">
                Manage rental cloth inventory
              </p>
            </div>
          </div>

          {/* ✅ FIXED: View Toggle - Positioned in top right corner */}
          <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                viewMode === "table" 
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
              title="Table View"
            >
              <FiList size={18} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                viewMode === "card" 
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
              title="Card View"
            >
              <FiGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards - REMOVED Avg. Rent Price card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Cloths</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">{totalCloths}</p>
              </div>
              <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
                <FiPackage className="text-white text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Available Items</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">{availableCloths}</p>
              </div>
              <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
                <FiBox className="text-white text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Types</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">{totalTypes}</p>
              </div>
              <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
                <FiTag className="text-white text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="relative z-10 mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input - Full width on mobile, flex on larger screens */}
          <div className="relative flex-grow group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
            <input
              type="text"
              placeholder="Search cloths by ID, name, color, size, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="relative w-full pl-12 pr-6 py-3 md:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm md:text-base"
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
          </div>
          
          {/* Filter and Add Button Container - Always in same row */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Filter Dropdown */}
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl px-4 py-2 flex-1 lg:flex-none">
              <FiFilter className="text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-700 font-medium w-full lg:w-auto"
              >
                <option value="all">All Cloths</option>
                <option value="available">Available</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 md:px-6 py-3 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 whitespace-nowrap flex-1 lg:flex-none min-w-[140px] md:min-w-[180px]"
            >
              <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
              <FiPlus className="mr-2 relative z-10" size={18} />
              <span className="relative z-10 text-sm md:text-base">Add Rental Cloth</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" ? (
        <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-6 md:mb-8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
                  <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">ID</th>
                  <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Cloth Details</th>
                  <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Category</th>
                  <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Size</th>
                  <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Color</th>
                  <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Quantity</th>
                  <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Status</th>
                  <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Rent Price(Rs.)</th>
                  <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {currentRecords.length > 0 ? (
                  currentRecords.map((cloth, index) => (
                    <tr 
                      key={cloth.ClothId || index} 
                      className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
                    >
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center">
                          <span className="text-sm font-mono font-normal text-slate-900">
                            {cloth.ClothId}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center">
                          <RentalImage 
                            src={cloth.IMAGEURL} 
                            alt={cloth.Name}
                            className="w-10 h-10 rounded-lg object-cover shadow-sm"
                            clothId={cloth.ClothId}
                          />
                          <div>
                            <div className="text-sm font-normal text-slate-900">
                              {cloth.Name}
                            </div>
                            {cloth.CreatedDate && (
                              <div className="text-xs text-slate-500">
                                Added: {new Date(cloth.CreatedDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className="text-sm font-normal text-slate-900">
                          {cloth.CategoryName || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className="text-sm font-normal text-slate-900">
                          {cloth.Size}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300 mr-2 shadow-sm"
                            style={{ backgroundColor: cloth.Color?.toLowerCase() }}
                          ></div>
                          <span className="text-sm text-slate-900 capitalize">
                            {cloth.Color}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={`text-sm font-normal ${getQuantityColor(cloth.Quantity)}`}>
                          {getQuantityDisplay(cloth.Quantity)}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(cloth.Status)}`}>
                          {cloth.Status || "Available"}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-sm font-normal text-slate-900">
                         {formatCurrency(cloth.RentPrice)}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewCloth(cloth)}
                            className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                            title="View Details"
                          >
                            <FiEye size={14} />
                          </button>
                          <button
                            onClick={() => handleEditCloth(cloth)}
                            className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                            title="Edit Cloth"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleRequestCloth(cloth)}
                            className="p-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                            title="Request Cloth"
                            disabled={cloth.Quantity === 0}
                          >
                            <FiShoppingCart size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-8 md:py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="p-3 md:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                          <FiPackage className="text-slate-500 text-lg md:text-xl" />
                        </div>
                        <p className="text-slate-500 font-medium">No rental cloths found</p>
                        <p className="text-slate-400 text-sm">
                          {searchTerm || filterStatus !== "all" 
                            ? "Try adjusting your search or filter criteria" 
                            : "Get started by adding your first rental cloth"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredCloths.length > recordsPerPage && (
            <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-4 md:space-y-0">
              <div className="text-sm text-slate-600">
                Showing {currentPage * recordsPerPage - recordsPerPage + 1}–{Math.min(currentPage * recordsPerPage, filteredCloths.length)} of{' '}
                {filteredCloths.length}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                >
                  <FiChevronLeft size={14} />
                </button>

                {getPageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 md:px-3.5 py-1 md:py-1.5 rounded-xl border transition-all duration-300 transform hover:scale-105 text-sm ${
                      currentPage === page
                        ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                >
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Card View */
        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
        //   {currentRecords.map((cloth, index) => (
        //     <div 
        //       key={cloth.ClothId || index} 
        //       className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group overflow-hidden cursor-pointer"
        //       onClick={() => handleViewCloth(cloth)}
        //     >
        //       <div className="h-40 overflow-hidden bg-slate-100">
        //         <RentalImage 
        //           src={cloth.IMAGEURL} 
        //           alt={cloth.Name}
        //           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        //           clothId={cloth.ClothId}
        //         />
        //       </div>
        //       <div className="p-6">
        //         <div className="flex items-center justify-between mb-4">
        //           <div className="flex items-center space-x-3">
        //             <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
        //               <FiPackage className="text-blue-600 text-lg" />
        //             </div>
        //             <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
        //               ID: {cloth.ClothId}
        //             </span>
        //           </div>
        //           <span className={`text-xs font-semibold ${getQuantityColor(cloth.Quantity)}`}>
        //             {getQuantityDisplay(cloth.Quantity)}
        //           </span>
        //         </div>
                
        //         <h3 className="font-bold text-slate-900 text-lg mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
        //           {cloth.Name}
        //         </h3>
                
        //         {cloth.CategoryName && (
        //           <div className="mb-3">
        //             <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
        //               {cloth.CategoryName}
        //             </span>
        //           </div>
        //         )}
                
        //         <div className="space-y-3 mb-4">
        //           <div className="flex items-center justify-between">
        //             <span className="text-sm text-slate-600">Size:</span>
        //             <span className="text-sm font-semibold text-slate-900">
        //               {cloth.Size}
        //             </span>
        //           </div>
        //           <div className="flex items-center justify-between">
        //             <span className="text-sm text-slate-600">Color:</span>
        //             <div className="flex items-center space-x-2">
        //               <div 
        //                 className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
        //                 style={{ backgroundColor: cloth.Color?.toLowerCase() }}
        //               ></div>
        //               <span className="text-sm font-semibold text-slate-900 capitalize">
        //                 {cloth.Color}
        //               </span>
        //             </div>
        //           </div>
        //           <div className="flex items-center justify-between">
        //             <span className="text-sm text-slate-600">Status:</span>
        //             <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(cloth.Status)}`}>
        //               {cloth.Status || "Available"}
        //             </span>
        //           </div>
        //           <div className="flex items-center justify-between">
        //             <span className="text-sm text-slate-600">Rent Price:</span>
        //             <span className="text-sm font-bold text-slate-900">
        //               Rs. {formatCurrency(cloth.RentPrice)}
        //             </span>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   ))}
        // </div>



        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 relative z-10">
  {currentRecords.map((cloth, index) => (
    <div 
      key={cloth.ClothId || index} 
      className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl border border-white/20 hover:shadow-xl sm:hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 group overflow-hidden cursor-pointer"
      onClick={() => handleViewCloth(cloth)}
    >
      <div className="h-32 sm:h-40 overflow-hidden bg-slate-100">
        <RentalImage 
          src={cloth.IMAGEURL} 
          alt={cloth.Name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          clothId={cloth.ClothId}
        />
      </div>
      <div className="p-3 sm:p-6">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl sm:rounded-2xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
              <FiPackage className="text-blue-600 text-sm sm:text-lg" />
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
              ID: {cloth.ClothId}
            </span>
          </div>
          <span className={`text-xs font-semibold ${getQuantityColor(cloth.Quantity)}`}>
            {getQuantityDisplay(cloth.Quantity)}
          </span>
        </div>
        
        <h3 className="font-bold text-slate-900 text-sm sm:text-lg mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {cloth.Name}
        </h3>
        
        {cloth.CategoryName && (
          <div className="mb-2 sm:mb-3">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
              {cloth.CategoryName}
            </span>
          </div>
        )}
        
        <div className="space-y-1.5 sm:space-y-3 mb-3 sm:mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-slate-600">Size:</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-900">
              {cloth.Size}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-slate-600">Color:</span>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div 
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-slate-300 shadow-sm"
                style={{ backgroundColor: cloth.Color?.toLowerCase() }}
              ></div>
              <span className="text-xs sm:text-sm font-semibold text-slate-900 capitalize">
                {cloth.Color}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-slate-600">Status:</span>
            <span className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full ${getStatusColor(cloth.Status)}`}>
              {cloth.Status || "Available"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-slate-600">Rent:</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              Rs. {formatCurrency(cloth.RentPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                    <FiPlus className="text-white text-base md:text-lg" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Add Rental Cloth
                  </h2>
                </div>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData(prev => ({ ...prev, file: null }));
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleAddCloth} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cloth Name </label>
                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                      placeholder="Enter cloth name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Color </label>
                    <input
                      type="text"
                      name="Color"
                      value={formData.Color}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                      placeholder="Enter color"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Size </label>
                    <select
                      name="Size"
                      value={formData.Size}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    >
                      <option value="">Select size</option>
                      {sizeOptions.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantity </label>
                    <input
                      type="number"
                      name="Quantity"
                      value={formData.Quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                      placeholder="Enter quantity"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Rent Price (Rs.) </label>
                    <input
                      type="number"
                      name="RentPrice"
                      value={formData.RentPrice}
                      onChange={handleInputChange}
                      required
                      min="1"
                      step="0.01"
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                      placeholder="Enter rent price"
                    />
                  </div>

                  {/* Status field removed - automatically set to "Available" */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <CategoriesDropdown
                      value={formData.CategoryId}
                      onChange={handleCategorySelect}
                      categories={categoriesData}
                      loading={categoriesLoading}
                      placeholder="Select category"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cloth Image
                      <span className="text-slate-400 text-xs ml-1">(Optional)</span>
                    </label>
                    
                    <div className="space-y-4">
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                          id="image-upload-add"
                        />
                        <div className="w-full px-6 py-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50 group-hover:shadow-lg text-center cursor-pointer">
                          <FiUpload className="mx-auto text-slate-400 mb-3 group-hover:text-blue-500 transition-colors" size={32} />
                          <p className="text-sm font-medium text-slate-600 mb-1">
                            {formData.file ? formData.file.name : "Click to upload image"}
                          </p>
                          <p className="text-xs text-slate-500">
                            Supports: PNG, JPG, JPEG, WEBP • Max: 5MB
                          </p>
                        </div>
                      </div>

                      {formData.file && (
                        <div className="flex flex-col items-center space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <div className="flex items-center justify-between w-full">
                            <p className="text-sm font-medium text-slate-700">Image Preview:</p>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                              className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors text-sm"
                            >
                              <FiX size={14} />
                              <span>Remove</span>
                            </button>
                          </div>
                          <div className="relative">
                            <img 
                              src={URL.createObjectURL(formData.file)} 
                              alt="Preview"
                              className="w-40 h-40 object-cover rounded-xl shadow-lg border border-slate-300"
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-600 font-medium">{formData.file.name}</p>
                            <p className="text-xs text-slate-500">
                              Size: {(formData.file.size / 1024 / 1024).toFixed(2)} MB • 
                              Type: {formData.file.type.split('/')[1]?.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      )}

                      {!formData.file && (
                        <div className="text-center">
                          <div className="inline-flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-full">
                            <FiInfo className="text-blue-500" size={14} />
                            <span>No image selected. You can add one later.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData(prev => ({ ...prev, file: null }));
                    }}
                    className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
                  >
                    {addLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <FiPlus size={16} />
                        <span>Add Cloth</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCloth && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                    <FiEdit2 className="text-white text-base md:text-lg" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Edit Rental Cloth
                  </h2>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateCloth} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cloth Name </label>
                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Color </label>
                    <input
                      type="text"
                      name="Color"
                      value={formData.Color}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Size </label>
                    <select
                      name="Size"
                      value={formData.Size}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    >
                      <option value="">Select size</option>
                      {sizeOptions.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantity </label>
                    <input
                      type="number"
                      name="Quantity"
                      value={formData.Quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Rent Price (Rs.) </label>
                    <input
                      type="number"
                      name="RentPrice"
                      value={formData.RentPrice}
                      onChange={handleInputChange}
                      required
                      min="1"
                      step="0.01"
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                    <select
                      name="Status"
                      value={formData.Status}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <CategoriesDropdown
                      value={formData.CategoryId}
                      onChange={handleCategorySelect}
                      categories={categoriesData}
                      loading={categoriesLoading}
                      placeholder="Select category"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cloth Image</label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            id="image-upload-edit"
                          />
                          <div className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50 text-center cursor-pointer">
                            <FiUpload className="mx-auto text-slate-400 mb-2" size={24} />
                            <p className="text-sm text-slate-600">
                              {formData.file ? formData.file.name : "Click to upload new image"}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                          </div>
                        </div>
                      </div>
                      {formData.file ? (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                          <img 
                            src={URL.createObjectURL(formData.file)} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <RentalImage 
                          src={selectedCloth.IMAGEURL} 
                          alt="Current"
                          className="w-20 h-20 rounded-lg object-cover border border-slate-200"
                          clothId={selectedCloth.ClothId}
                        />
                      )}
                    </div>
                    {!formData.file && (
                      <p className="text-xs text-slate-500 mt-2">Current image will be kept if no new image is selected</p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
                  >
                    {updateLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <FiSave size={16} />
                        <span>Update Cloth</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Request Modal with Customer Dropdown */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform rotate-1"></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                    <FiShoppingCart className="text-white text-base md:text-lg" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Request Rental Cloth
                  </h2>
                </div>
                <button 
                  onClick={() => setShowRequestModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleRequestSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Cloth ID </label>
                  <input
                    type="text"
                    name="ClothId"
                    value={requestFormData.ClothId}
                    onChange={handleRequestInputChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    placeholder="Enter cloth ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Customer </label>
                  <CustomerDropdown
                    value={requestFormData.CustomerId}
                    onChange={handleCustomerSelect}
                    customers={customerData}
                    loading={customerLoading}
                    placeholder="Search customer by name..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Rent Quantity </label>
                  <input
                    type="number"
                    name="RentQuantity"
                    value={requestFormData.RentQuantity}
                    onChange={handleRequestInputChange}
                    required
                    min="1"
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    placeholder="Enter quantity to rent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Requested Size</label>
                  <select
                    name="RequestedSize"
                    value={requestFormData.RequestedSize}
                    onChange={handleRequestInputChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                  >
                    <option value="">Select size</option>
                    {sizeOptions.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                  <input
                    type="text"
                    name="Color"
                    value={requestFormData.Color}
                    onChange={handleRequestInputChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    placeholder="Enter color"
                  />
                </div>
                
                <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={requestLoading || !requestFormData.CustomerId}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base order-1 md:order-2"
                  >
                    {requestLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Requesting...</span>
                      </>
                    ) : (
                      <>
                        <FiShoppingCart size={16} />
                        <span>Request Cloth</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Details Modal */}
      {showDetailsModal && selectedCloth && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-2 sm:p-4">
          {/* Mobile: Mini version, Desktop: Current version */}
          <div className="relative w-full max-w-2xl sm:max-w-4xl max-h-[80vh] sm:max-h-[90vh] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl sm:rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 max-h-full overflow-y-auto">
              <div className="p-4 sm:p-6">
                {/* Header - Mobile Mini, Desktop Normal */}
                <div className="flex justify-between items-center mb-3 sm:mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-2 sm:p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-xl sm:rounded-2xl shadow-lg">
                      <FiShoppingBag className="text-white text-sm sm:text-base sm:text-lg" />
                    </div>
                    <h2 className="text-lg sm:text-xl sm:text-2xl font-normal bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      Cloth Details
                    </h2>
                  </div>
                  <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="p-1 sm:p-2 text-slate-400 hover:text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
                  >
                    <FiX className="text-lg sm:text-xl sm:text-2xl" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-4 sm:gap-8">
                  {/* Image Section - Mobile Mini, Desktop Normal */}
                  <div>
                    <h3 className="text-sm sm:text-base sm:text-lg font-normal mb-2 sm:mb-3 sm:mb-4 text-slate-800">Cloth Image</h3>
                    <div className="border sm:border-2 border-slate-300 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                      <RentalImage 
                        src={selectedCloth.IMAGEURL} 
                        alt={selectedCloth.Name}
                        className="w-full h-auto max-h-48 sm:max-h-64 sm:max-h-96 object-contain"
                        clothId={selectedCloth.ClothId}
                      />
                    </div>
                    
                    {/* Download Button - Fixed Version */}
                    {selectedCloth.ClothId && (
                      <div className="mt-2 sm:mt-3 sm:mt-4 flex justify-center">
                        <a 
                          href={selectedCloth.IMAGEURL || `https://tailorbackend.dockyardsoftware.com/Rental/PhotoPrivew?CID=${selectedCloth.ClothId}`}
                          download={`${(selectedCloth.Name || 'cloth').replace(/\s+/g, '_')}_${selectedCloth.ClothId}.jpg`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 sm:px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-lg sm:rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center font-normal text-xs sm:text-sm sm:text-base"
                        >
                          <FiDownload className="mr-1 sm:mr-1 sm:mr-2" />
                          Download Image
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Cloth Details Section - Mobile Mini, Desktop Normal */}
                  <div>
                    <h3 className="text-sm sm:text-base sm:text-lg font-normal mb-2 sm:mb-3 sm:mb-4 text-slate-800">Cloth Information</h3>
                    <div className="bg-slate-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 sm:p-6 border border-slate-200/50">
                      <table className="w-full border-collapse text-xs sm:text-sm sm:text-base">
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700 w-1/2">Cloth ID</td>
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-900">
                              {selectedCloth.ClothId}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Name</td>
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-900">
                              {selectedCloth.Name}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Category</td>
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-900">
                              {getCategoryNameById(selectedCloth.CategoryId) || "N/A"}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Size</td>
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-900">
                              {selectedCloth.Size}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Color</td>
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-900">
                              <div className="flex items-center">
                                <div 
                                  className="w-4 h-4 rounded-full border border-slate-300 mr-2 shadow-sm"
                                  style={{ backgroundColor: selectedCloth.Color?.toLowerCase() }}
                                ></div>
                                <span className="capitalize">
                                  {selectedCloth.Color}
                                </span>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Quantity</td>
                            <td className={`py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal ${getQuantityColor(selectedCloth.Quantity)}`}>
                              {getQuantityDisplay(selectedCloth.Quantity)}
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Status</td>
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedCloth.Status)}`}>
                                {selectedCloth.Status || "Available"}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Rent Price</td>
                            <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-green-700">
                              Rs. {formatCurrency(selectedCloth.RentPrice)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalCloths;