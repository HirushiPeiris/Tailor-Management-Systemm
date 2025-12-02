// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   FiSearch,
//   FiPlusSquare,
//   FiX,
//   FiChevronDown,
//   FiChevronUp,
//   FiChevronLeft,
//   FiChevronRight,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiEdit,
//   FiSave,
//   FiUser,
//   FiClipboard,
//   FiCalendar,
//   FiActivity,
//   FiInfo,
//   FiShoppingBag,
//   FiFileText,
//   FiTool,
//   FiExternalLink,
//   FiEye
// } from "react-icons/fi";
// import { AssingTailor, GetAllAssignment, AssingmentStatusUpdate } from "../actions/assignmentAction";
// import { GetAllTailors } from "../actions/tailorAction";
// import { GetOrderItems } from "../actions/orderAction";

// const formatCurrency = (amount) => {
//   return parseFloat(amount || 0).toLocaleString('en-IN', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   });
// };

// const getUserRole = () => {
//   try {
//     // Check the 'user' key which exists in localStorage
//     const userData = localStorage.getItem('user');
//     console.log('🔍 DEBUG - user data from localStorage:', userData);
    
//     if (userData) {
//       try {
//         const parsedUser = JSON.parse(userData);
//         console.log('🔍 DEBUG - parsed user object:', parsedUser);
        
//         // Check various possible property names for role
//         const role = 
//           parsedUser.role ||
//           parsedUser.userRole || 
//           parsedUser.user_type ||
//           parsedUser.type ||
//           '';
        
//         console.log('🔍 DEBUG - extracted role:', role);
//         return role;
//       } catch (parseError) {
//         console.error('Error parsing user data:', parseError);
//         return '';
//       }
//     }
    
//     return '';
//   } catch (error) {
//     console.error('Error getting user role:', error);
//     return '';
//   }
// };

// const useAssignmentsData = () => {
//   return useSelector(
//     (state) => state.getAllAssignment || { responseBody: [], loading: false, msg: null, error: null }
//   );
// };

// const useAssignmentAddData = () => {
//   return useSelector(
//     (state) => state.assingTailor || { loading: false, error: null, msg: null }
//   );
// };

// const useAssignmentUpdateData = () => {
//   return useSelector(
//     (state) => state.assignmentStatusUpdate || { loading: false, error: null, msg: null }
//   );
// };

// const useTailorsData = () => {
//   const tailorData = useSelector((state) => state.tailorList);
//   return {
//     responseBody: tailorData?.responseBody || [],
//     loading: tailorData?.loading || false,
//     error: tailorData?.error || null
//   };
// };

// const useOrderItemsData = () => {
//   const orderItemsData = useSelector((state) => state.orderItemsGet);
//   return {
//     responseBody: orderItemsData?.responseBody || [],
//     loading: orderItemsData?.loading || false,
//     error: orderItemsData?.error || null
//   };
// };

// const useOrderItemDetails = (orderItemId) => {
//   const { responseBody: orderItems = [] } = useOrderItemsData();
  
//   const orderItemDetails = useMemo(() => {
//     if (!orderItemId || !orderItems || !orderItems.length) return null;
    
//     const foundItem = orderItems.find((item) => {
//       const itemId = item.OrderItemId || item.orderItemId || item.id || item.OrderItemID || item.orderItemID || item.OrderItem_Id;
//       return String(itemId) === String(orderItemId);
//     });
    
//     return foundItem || null;
//   }, [orderItems, orderItemId]);

//   return { orderItemDetails, loading: false, error: null };
// };

// function Assignments() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
// // Debug: Check what's actually in localStorage
//   useEffect(() => {
//     console.log('🔍 DEBUG - Checking localStorage:');
//     console.log('role:', localStorage.getItem('role'));
//     console.log('userRole:', localStorage.getItem('userRole'));
//     console.log('All localStorage keys:', Object.keys(localStorage));
//   }, []);
//   const userRole = getUserRole();
//   const isTailor = userRole.toLowerCase() === 'tailor';
//  console.log('🔍 DEBUG - User Role:', userRole, 'Is Tailor:', isTailor);
//   const { responseBody: assignments = [], loading, msg: assignmentsMsg, error: assignmentsError } = useAssignmentsData();
//   const { responseBody: tailors = [], loading: tailorsLoading } = useTailorsData();
//   const { loading: updating, error: updateError, msg: updateMsg } = useAssignmentUpdateData();
//   const { loading: adding, error: addError, msg: addMsg } = useAssignmentAddData();
//   const { responseBody: orderItems = [], loading: orderItemsLoading } = useOrderItemsData();

//   const [search, setSearch] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [notification, setNotification] = useState({ message: "", type: "" });

//   const [isTailorDropdownOpen, setIsTailorDropdownOpen] = useState(false);
//   const [isOrderItemDropdownOpen, setIsOrderItemDropdownOpen] = useState(false);
//   const [tailorSearch, setTailorSearch] = useState("");
//   const [orderItemSearch, setOrderItemSearch] = useState("");
//   const tailorDropdownRef = useRef(null);
//   const orderItemDropdownRef = useRef(null);

//   const [editingAssignment, setEditingAssignment] = useState(null);
//   const [selectedStatus, setSelectedStatus] = useState("");

//   const [formData, setFormData] = useState({
//     OrderItemId: "",
//     TailorId: "",
//     Status: "Assigned",
//     AssignDate: new Date().toISOString().split("T")[0],
//   });

//   const [selectedOrderItem, setSelectedOrderItem] = useState(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;

//   const { orderItemDetails } = useOrderItemDetails(
//     selectedAssignment ? selectedAssignment.OrderItemId : null
//   );

//   const getTailorName = useMemo(() => {
//     return (id) => {
//       if (!tailors || !Array.isArray(tailors)) return `ID ${id}`;
//       const tailor = tailors.find((t) => t.TailorId === id);
//       return tailor ? tailor.Name : `ID ${id}`;
//     };
//   }, [tailors]);

//   const getOrderId = useMemo(() => {
//     return (orderItem) => {
//       if (!orderItem) return null;
//       return orderItem.OrderId || orderItem.orderId || orderItem.OrderID || orderItem.orderID;
//     };
//   }, []);

//   const getMeasurements = useMemo(() => {
//     return (orderItem) => {
//       if (!orderItem) return {};
      
//       const measurements = 
//         orderItem.Measurements ||
//         orderItem.measurements ||
//         orderItem.Measurement ||
//         orderItem.measurement ||
//         orderItem.MeasurementDetails ||
//         orderItem.measurementDetails ||
//         orderItem.MeasurementData ||
//         orderItem.measurementData ||
//         orderItem.MeasurementJson ||
//         orderItem.measurementJson ||
//         {};
      
//       if (typeof measurements === 'string') {
//         try {
//           return JSON.parse(measurements);
//         } catch (e) {
//           const keyValuePairs = {};
//           try {
//             const pairs = measurements.split(',').map(pair => {
//               const [key, ...valueParts] = pair.split(':');
//               return [key?.trim(), valueParts.join(':').trim()];
//             });
            
//             pairs.forEach(([key, value]) => {
//               if (key && value && key !== 'undefined' && value !== 'undefined') {
//                 keyValuePairs[key] = isNaN(value) ? value : parseFloat(value);
//               }
//             });
//           } catch (parseError) {
//             console.log('Failed to parse measurements string:', measurements);
//           }
//           return keyValuePairs;
//         }
//       }
      
//       return measurements;
//     };
//   }, []);

//   const assignedOrderItemIds = useMemo(() => {
//     if (!assignments || !Array.isArray(assignments)) return new Set();
//     return new Set(assignments.map(assignment => String(assignment.OrderItemId)));
//   }, [assignments]);

//   const availableOrderItems = useMemo(() => {
//     if (!orderItems || !Array.isArray(orderItems)) {
//       return [];
//     }
    
//     const filteredItems = orderItems.filter((item) => {
//       if (!item) return false;
      
//       const itemId = String(
//         item.OrderItemId || 
//         item.orderItemId || 
//         item.id || 
//         item.OrderItemID ||
//         item.orderItemID ||
//         item.OrderItem_Id ||
//         ''
//       );
      
//       const isUnassigned = !assignedOrderItemIds.has(itemId);
      
//       if (!isUnassigned) {
//         return false;
//       }
      
//       const status = 
//         item.Status || 
//         item.status || 
//         item.OrderStatus || 
//         item.orderStatus || 
//         item.ItemStatus || 
//         item.itemStatus || 
//         item.OrderItemStatus ||
//         item.orderItemStatus ||
//         '';
      
//       const normalizedStatus = status.toString().trim().toLowerCase();
      
//       const isPending = 
//         normalizedStatus === 'pending' ||
//         normalizedStatus.includes('pending') ||
//         normalizedStatus === 'not started' ||
//         normalizedStatus === 'not_started' ||
//         normalizedStatus === 'new' ||
//         normalizedStatus === 'open' ||
//         normalizedStatus === '' ||
//         normalizedStatus === 'null' ||
//         normalizedStatus === 'undefined';
      
//       return isUnassigned && isPending;
//     });

//     return filteredItems;
//   }, [orderItems, assignedOrderItemIds]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     try {
//       const date = new Date(dateString);
//       return date.toISOString().split("T")[0];
//     } catch (error) {
//       return "-";
//     }
//   };

//   const handleOrderIdClick = (event, orderId) => {
//     event.stopPropagation();
//     event.preventDefault();
    
//     if (!orderId) return;
    
//     navigate(`/orders?search=${orderId}&exact=true`);
//     setShowDetailsModal(false);
//   };

//   const handleViewClick = (assignment, e) => {
//     e.stopPropagation();
//     setSelectedAssignment(assignment);
//     setShowDetailsModal(true);
//   };

//   const filteredAssignments = useMemo(() => {
//     if (!assignments || !Array.isArray(assignments)) return [];
    
//     const urlParams = new URLSearchParams(window.location.search);
//     const searchParam = urlParams.get('search');
//     const exactMatch = urlParams.get('exact') === 'true';
    
//     let filtered = assignments;
    
//     if (searchParam && exactMatch) {
//       filtered = assignments.filter(assignment => {
//         const assignmentOrderItem = orderItems.find(item => {
//           const itemId = item.OrderItemId || item.orderItemId || item.id;
//           return String(itemId) === String(assignment.OrderItemId);
//         });
        
//         const orderId = getOrderId(assignmentOrderItem);
//         const orderIdString = String(orderId);
//         const searchParamString = String(searchParam);
        
//         return orderIdString === searchParamString;
//       });
//     } 
//     else if (search) {
//       filtered = assignments.filter(
//         (assignment) =>
//           assignment.AssignmentId?.toString().includes(search.toLowerCase()) ||
//           assignment.OrderItemId?.toString().includes(search.toLowerCase()) ||
//           getTailorName(assignment.TailorId)
//             .toLowerCase()
//             .includes(search.toLowerCase()) ||
//           assignment.Status?.toLowerCase().includes(search.toLowerCase())
//       );
//     }
    
//     return filtered.sort((a, b) => {
//       const idA = a.AssignmentId || 0;
//       const idB = b.AssignmentId || 0;
//       return idB - idA;
//     });
//   }, [assignments, search, getTailorName, orderItems, getOrderId]);

//   const totalPages = Math.ceil(filteredAssignments.length / recordsPerPage);
//   const currentRecords = useMemo(() => {
//     const indexOfLastRecord = currentPage * recordsPerPage;
//     const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//     return filteredAssignments.slice(indexOfFirstRecord, indexOfLastRecord);
//   }, [filteredAssignments, currentPage, recordsPerPage]);

//   const getPageNumbers = useMemo(() => {
//     const start = Math.max(1, currentPage - 1);
//     const end = Math.min(totalPages, start + 2);
//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//   }, [currentPage, totalPages]);

//   const filteredTailors = useMemo(() => {
//     if (!tailors || !Array.isArray(tailors)) return [];
//     return tailors.filter((tailor) =>
//       tailor.Name?.toLowerCase().includes(tailorSearch.toLowerCase()) ||
//       tailor.Skills?.toLowerCase().includes(tailorSearch.toLowerCase())
//     );
//   }, [tailors, tailorSearch]);

//   const filteredOrderItems = useMemo(() => {
//     if (!availableOrderItems || !Array.isArray(availableOrderItems)) {
//       return [];
//     }
    
//     const filtered = availableOrderItems.filter((item) => {
//       if (!item) return false;
      
//       const searchText = orderItemSearch.toLowerCase();
      
//       const id = String(
//         item.OrderItemId || 
//         item.orderItemId || 
//         item.id || 
//         item.OrderItemID ||
//         item.orderItemID ||
//         item.OrderItem_Id ||
//         ''
//       ).toLowerCase();
      
//       const productName = String(
//         item.productName ||
//         item.ItemName ||
//         item.itemName ||
//         ''
//       ).toLowerCase();
      
//       const orderId = String(
//         item.OrderId ||
//         item.orderId ||
//         item.OrderID ||
//         item.orderID ||
//         ''
//       ).toLowerCase();
      
//       return id.includes(searchText) || productName.includes(searchText) || orderId.includes(searchText);
//     });

//     return filtered;
//   }, [availableOrderItems, orderItemSearch]);

//   useEffect(() => {
//     dispatch(GetAllAssignment());
//     dispatch(GetAllTailors());
//     dispatch(GetOrderItems());
//   }, [dispatch]);

//   useEffect(() => {
//     if (!adding && (addMsg || addError)) {
//       if (addError) {
//         setNotification({ 
//           type: 'error', 
//           message: addError || 'Failed to add assignment!' 
//         });
//       } else if (addMsg) {
//         setNotification({ 
//           type: 'success', 
//           message: addMsg || 'Assignment added successfully!' 
//         });
        
//         dispatch(GetAllAssignment());
        
//         setShowModal(false);
//         setFormData({
//           OrderItemId: "",
//           TailorId: "",
//           Status: "Assigned",
//           AssignDate: new Date().toISOString().split("T")[0],
//         });
//         setSelectedOrderItem(null);
//         setTailorSearch("");
//         setOrderItemSearch("");
//       }
//     }
//   }, [adding, addMsg, addError, dispatch]);

//   useEffect(() => {
//     if (!updating && (updateMsg || updateError)) {
//       if (updateError) {
//         setNotification({ 
//           type: 'error', 
//           message: updateError || 'Failed to update assignment status!' 
//         });
//       } else if (updateMsg) {
//         setNotification({ 
//           type: 'success', 
//           message: updateMsg || 'Assignment status updated successfully!' 
//         });
        
//         setEditingAssignment(null);
//         setSelectedStatus("");
        
//         dispatch(GetAllAssignment());
//       }
//     }
//   }, [updating, updateMsg, updateError, dispatch]);

//   useEffect(() => {
//     if (assignmentsMsg || assignmentsError) {
//       if (assignmentsError) {
//         setNotification({ type: 'error', message: assignmentsError || 'Failed to load assignments!' });
//       }
//     }
//   }, [assignmentsMsg, assignmentsError]);

//   useEffect(() => {
//     if (notification.message) {
//       const timer = setTimeout(() => {
//         setNotification({ message: "", type: "" });
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (tailorDropdownRef.current && !tailorDropdownRef.current.contains(event.target)) {
//         setIsTailorDropdownOpen(false);
//       }
//       if (orderItemDropdownRef.current && !orderItemDropdownRef.current.contains(event.target)) {
//         setIsOrderItemDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleChange = (e) => {
//     let value = e.target.value;
//     if (e.target.name === "Status") {
//       value = value === "Pending" ? "Pending" : value;
//     }
//     setFormData({ ...formData, [e.target.name]: value });
//   };

//   const handleTailorSelect = (tailorId, tailorName) => {
//     setFormData({ ...formData, TailorId: tailorId });
//     setTailorSearch(tailorName);
//     setIsTailorDropdownOpen(false);
//   };

//   const handleOrderItemSelect = (orderItem) => {
//     const orderItemId = orderItem.OrderItemId || orderItem.orderItemId || orderItem.id;
//     setFormData({ ...formData, OrderItemId: orderItemId });
//     setSelectedOrderItem(orderItem);
    
//     const orderId = getOrderId(orderItem);
//     setOrderItemSearch(`ID: ${orderItemId} - Order: ${orderId}`);
//     setIsOrderItemDropdownOpen(false);
//   };

//   const toggleTailorDropdown = () => {
//     setIsTailorDropdownOpen(!isTailorDropdownOpen);
//     if (!isTailorDropdownOpen) setTailorSearch("");
//   };

//   const toggleOrderItemDropdown = () => {
//     setIsOrderItemDropdownOpen(!isOrderItemDropdownOpen);
//     if (!isOrderItemDropdownOpen) setOrderItemSearch("");
//   };

//   const validateForm = () => {
//     if (!formData.OrderItemId) {
//       setNotification({ message: "Please select an Order Item.", type: "error" });
//       return false;
//     }
//     if (!formData.TailorId) {
//       setNotification({ message: "Please select a tailor.", type: "error" });
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     console.log('📦 Submitting assignment:', formData);
//     dispatch(AssingTailor(formData));
//   };

//   const handleStatusEditClick = (assignment) => {
//     setEditingAssignment(assignment.AssignmentId);
//     setSelectedStatus(assignment.Status);
//   };

//   const handleStatusUpdate = (assignment) => {
//     if (!selectedStatus) {
//       setNotification({ message: "Please select a status.", type: "error" });
//       return;
//     }

//     const updateData = {
//       TailorId: assignment.TailorId,
//       Status: selectedStatus,
//       OrderItemId: assignment.OrderItemId
//     };

//     console.log('🔄 Updating assignment status:', updateData);
//     dispatch(AssingmentStatusUpdate(updateData));
//   };

//   const handleCancelStatusEdit = () => {
//     setEditingAssignment(null);
//     setSelectedStatus("");
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'assigned':
//         return 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-200/50';
//       case 'in progress':
//         return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50';
//       case 'completed':
//         return 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200/50';
//       case 'pending':
//         return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200/50';
//       default:
//         return 'bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50';
//     }
//   };

//   const formatStatus = (status) => {
//     if (!status || status.toString().trim() === '') return 'Not Set';
    
//     const statusStr = status.toString().trim();
    
//     switch (statusStr.toLowerCase()) {
//       case 'pending':
//         return 'Pending';
//       case 'in progress':
//       case 'in_progress':
//         return 'In Progress';
//       case 'completed':
//         return 'Completed';
//       case 'assigned':
//         return 'Assigned';
//       default:
//         return statusStr.charAt(0).toUpperCase() + statusStr.slice(1).toLowerCase();
//     }
//   };

//   const measurements = useMemo(() => {
//     if (!orderItemDetails) return {};
//     return getMeasurements(orderItemDetails);
//   }, [orderItemDetails, getMeasurements]);

//   const formMeasurements = useMemo(() => {
//     if (!selectedOrderItem) return {};
//     return getMeasurements(selectedOrderItem);
//   }, [selectedOrderItem, getMeasurements]);

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

//       <div className="relative z-10 mb-6 md:mb-8">
//         <div className="flex items-center space-x-4 mb-3">
//           <div className="p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
//             <FiClipboard className="text-white text-lg md:text-xl" />
//           </div>
//           <div className="transform ">
//             <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//               Assignments
//             </h1>
//             <p className="text-slate-600 mt-1 text-sm md:text-base">Manage tailor assignments - Showing newest first</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Total Assignments</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {Array.isArray(assignments) ? assignments.length : 0}
//                 </p>
//                 {/* <p className="text-xs text-slate-500 mt-1">
//                   Latest: #{filteredAssignments[0]?.AssignmentId || 'N/A'}
//                 </p> */}
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiClipboard className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Available Tailors</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {Array.isArray(tailors) ? tailors.length : 0}
//                 </p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiUser className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-sm font-medium">Unassigned Pending Orders</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {Array.isArray(availableOrderItems) ? availableOrderItems.length : 0}
//                 </p>
//               </div>
//               <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
//                 <FiActivity className="text-white text-base md:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 md:mb-8">
//         <div className="flex flex-col md:flex-row flex-grow space-y-4 md:space-y-0 md:space-x-4 w-full">
//           <div className="relative flex-grow group">
//             <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//             <input
//               type="text"
//               placeholder="Search by Assignment ID, Order Item ID, Tailor Name, or Status..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="relative w-full pl-12 pr-6 py-3 md:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm md:text-base"
//             />
//             <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
//           </div>
          
//          {!isTailor && (
//   <button
//     onClick={() => setShowModal(true)}
//     className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 md:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 w-full md:w-auto"
//   >
//     <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//     <FiPlusSquare className="mr-3 relative z-10" size={18} />
//     <span className="relative z-10">Add Assignment</span>
//   </button>
// )}
//         </div>
//       </div>

//       <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-6 md:mb-8">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[800px]">
//             <thead>
//               <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                 <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Assignment ID</th>
//                 <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Order ID</th>
//                 <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Order Item ID</th>
//                 <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Tailor</th>
//                 <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Assigned Date</th>
//                 <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Status</th>
//                 <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-200/50">
//               {loading ? (
//                 <tr>
//                   <td colSpan="7" className="text-center py-8 md:py-12">
//                     <div className="flex flex-col items-center space-y-3">
//                       <div className="p-3 md:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                         <FiClipboard className="text-slate-500 text-lg md:text-xl" />
//                       </div>
//                       <p className="text-slate-500 font-medium">Loading assignments...</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : currentRecords.length > 0 ? (
//                 currentRecords.map((assignment) => {
//                   const assignmentOrderItem = orderItems.find(item => {
//                     const itemId = item.OrderItemId || item.orderItemId || item.id;
//                     return String(itemId) === String(assignment.OrderItemId);
//                   });
                  
//                   const orderId = getOrderId(assignmentOrderItem);
                  
//                   return (
//                     <tr 
//                       key={assignment.AssignmentId} 
//                       className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
//                     >
//                       <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                         {assignment.AssignmentId}
//                       </td>
//                       <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                         {orderId || '-'}
//                       </td>
//                       <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                         {assignment.OrderItemId}
//                       </td>
//                       <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                        {getTailorName(assignment.TailorId)}
//                       </td>
//                       <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                         {formatDate(assignment.AssignDate)}
//                       </td>
//                       <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                         {editingAssignment === assignment.AssignmentId ? (
//                           <select
//                             value={selectedStatus}
//                             onChange={(e) => setSelectedStatus(e.target.value)}
//                             className="w-full px-2 md:px-3 py-1 md:py-2 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 text-sm"
//                             disabled={updating}
//                           >
//                             <option value="">Select Status</option>
//                             <option value="Assigned">Assigned</option>
//                             <option value="In Progress">In Progress</option>
//                             <option value="Completed">Completed</option>
//                           </select>
//                         ) : (
//                           <span
//                             className={`inline-flex items-center px-2 md:px-3 py-1 md:py-2 rounded-full text-xs ${getStatusColor(assignment.Status)}`}
//                           >
//                             {formatStatus(assignment.Status)}
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-4 md:px-6 py-3 md:py-4 text-center">
//                         <div className="flex justify-center space-x-2 md:space-x-3">
//                           <button
//                             onClick={(e) => handleViewClick(assignment, e)}
//                             className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
//                             title="View Details"
//                           >
//                             <FiEye size={14} />
//                           </button>

//                           {(
//                             editingAssignment === assignment.AssignmentId ? (
//                               <div className="flex space-x-1 md:space-x-2">
//                                 <button
//                                   onClick={() => handleStatusUpdate(assignment)}
//                                   disabled={updating}
//                                   className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
//                                   title="Save Status"
//                                 >
//                                   <FiSave size={14} />
//                                 </button>
//                                 <button
//                                   onClick={handleCancelStatusEdit}
//                                   className="p-2 md:p-3 bg-gradient-to-br from-slate-500 to-slate-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//                                   title="Cancel"
//                                 >
//                                   <FiX size={14} />
//                                 </button>
//                               </div>
//                             ) : (
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleStatusEditClick(assignment);
//                                 }}
//                                 disabled={updating}
//                                 className="inline-flex items-center justify-center p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
//                                 title="Edit Status"
//                               >
//                                 <FiEdit size={14} />
//                               </button>
//                             )
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="text-center py-8 md:py-12">
//                     <div className="flex flex-col items-center space-y-3">
//                       <div className="p-3 md:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                         <FiClipboard className="text-slate-500 text-lg md:text-xl" />
//                       </div>
//                       <p className="text-slate-500 font-medium">No assignments found</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {filteredAssignments.length > recordsPerPage && (
//           <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-4 md:space-y-0">
//             <div className="text-sm text-slate-600">
//               Showing {currentPage * recordsPerPage - recordsPerPage + 1}–{Math.min(currentPage * recordsPerPage, filteredAssignments.length)} of{' '}
//               {filteredAssignments.length}
//             </div>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//               >
//                 <FiChevronLeft size={14} />
//               </button>

//               {getPageNumbers.map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`px-2 md:px-3.5 py-1 md:py-1.5 rounded-xl border transition-all duration-300 transform hover:scale-105 text-sm ${
//                     currentPage === page
//                       ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
//                       : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}

//               <button
//                 onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className="p-2 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//               >
//                 <FiChevronRight size={14} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {showDetailsModal && selectedAssignment && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-4xl max-h-[90vh] ">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6">
              
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                     <FiInfo className="text-white text-lg" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                       Assignment Details
//                     </h2>
//                     <p className="text-slate-600 text-sm">
//                       Assignment ID: {selectedAssignment.AssignmentId} | Order Item ID: {selectedAssignment.OrderItemId}
//                     </p>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => setShowDetailsModal(false)}
//                   className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               {orderItemsLoading ? (
//                 <div className="text-center py-8">
//                   <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div>
//                     <span className="text-slate-700">Loading order item details...</span>
//                   </div>
//                 </div>
//               ) : !orderItemDetails ? (
//                 <div className="text-center py-8">
//                   <div className="bg-gradient-to-r from-rose-50 to-red-50 p-6 rounded-2xl border border-rose-200 shadow-inner">
//                     <FiAlertCircle className="text-rose-500 text-2xl mx-auto mb-3" />
//                     <p className="text-rose-700">Order item details not found</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 rounded-2xl border border-slate-200 shadow-inner">
//                       <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                         <FiShoppingBag />
//                         Order Item Details
//                       </h3>
//                       {orderItemDetails ? (
//                         <div className="space-y-3">
//                           <div className="flex justify-between items-center">
//                             <span className="text-slate-700 font-bold text-base">ORDER ID:</span>
//                             <span className="font-mono font-bold text-slate-900 text-base">
//                               {orderItemDetails.OrderId || orderItemDetails.orderId ? (
//                                 <button
//                                   onClick={(e) => handleOrderIdClick(e, orderItemDetails.OrderId || orderItemDetails.orderId)}
//                                   className="text-blue-700 hover:text-blue-900 underline transition-colors duration-200 flex items-center gap-1 bg-transparent border-none cursor-pointer font-mono font-bold text-base"
//                                   title={`View Order ${orderItemDetails.OrderId || orderItemDetails.orderId}`}
//                                 >
//                                   {orderItemDetails.OrderId || orderItemDetails.orderId}
//                                   <FiExternalLink size={14} />
//                                 </button>
//                               ) : (
//                                 <span className="text-slate-400">N/A</span>
//                               )}
//                             </span>
//                           </div>

//                           <div className="flex justify-between items-center">
//                             <span className="text-slate-600 text-sm">Order Item ID:</span>
//                             <span className="font-mono text-slate-800 text-sm">
//                               {orderItemDetails.OrderItemId || orderItemDetails.orderItemId || orderItemDetails.id}
//                             </span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-slate-600 text-sm">Quantity:</span>
//                             <span className="text-slate-800 text-sm">
//                               {orderItemDetails.Quantity || orderItemDetails.quantity || 1}
//                             </span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-slate-600 text-sm">Price:</span>
//                             <span className="text-slate-800 text-sm">
//                               {orderItemDetails.Price || orderItemDetails.price ? 
//                                 formatCurrency(orderItemDetails.Price || orderItemDetails.price) : 'N/A'}
//                             </span>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="text-slate-500 text-center py-4 text-sm">
//                           No order item details found
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-2xl border border-blue-200 shadow-inner">
//                       <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
//                         <FiClipboard />
//                         Assignment Information
//                       </h3>
//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center">
//                           <span className="text-slate-600 text-sm">Assignment ID:</span>
//                           <span className="font-mono text-slate-800 text-sm">{selectedAssignment.AssignmentId}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-slate-600 text-sm">Order Item ID:</span>
//                           <span className="font-mono text-slate-800 text-sm">{selectedAssignment.OrderItemId}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-slate-600 text-sm">Tailor:</span>
//                           <span className="text-slate-800 text-sm">{getTailorName(selectedAssignment.TailorId)}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-slate-600 text-sm">Assigned Date:</span>
//                           <span className="text-slate-800 text-sm">
//                             {formatDate(selectedAssignment.AssignDate)}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-slate-600 text-sm">Status:</span>
//                           <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(selectedAssignment.Status)}`}>
//                             {formatStatus(selectedAssignment.Status)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="flex justify-end pt-6 mt-6 border-t border-slate-200/50">
//                 <button
//                   onClick={() => setShowDetailsModal(false)}
//                   className="px-6 py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
//                 >
//                   Close Details
//                 </button>
//               </div>
              
//             </div>
//           </div>
//         </div>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-2xl">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
//               <div className="flex items-center justify-between mb-4 md:mb-6">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                     <FiPlusSquare className="text-white text-base md:text-lg" />
//                   </div>
//                   <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                     Add Assignment
//                   </h2>
//                 </div>
//                 <button 
//                   onClick={() => { 
//                     setShowModal(false);
//                     setIsTailorDropdownOpen(false);
//                     setIsOrderItemDropdownOpen(false);
//                     setTailorSearch("");
//                     setOrderItemSearch("");
//                     setSelectedOrderItem(null);
//                   }}
//                   className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
//                 <div className="relative" ref={orderItemDropdownRef}>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Order Item *</label>
//                   <div className="text-xs text-slate-500 mb-2 bg-blue-50 p-2 rounded-lg">
//                     Showing only <span className="font-semibold text-purple-600">unassigned PENDING</span> order items
//                     <br />
//                     <span className="font-semibold">Available: {availableOrderItems.length} pending items</span>
//                   </div>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       placeholder="Search pending order items by ID, Order ID, or product name..."
//                       value={orderItemSearch}
//                       onChange={(e) => {
//                         setOrderItemSearch(e.target.value);
//                         setIsOrderItemDropdownOpen(true);
//                       }}
//                       onFocus={() => setIsOrderItemDropdownOpen(true)}
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                     <button
//                       type="button"
//                       onClick={toggleOrderItemDropdown}
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
//                     >
//                       {isOrderItemDropdownOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
//                     </button>
//                   </div>

//                   {isOrderItemDropdownOpen && (
//                     <div className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-auto">
//                       {orderItemsLoading ? (
//                         <div className="px-3 md:px-4 py-2 md:py-3 text-slate-500 text-center text-sm">Loading pending order items...</div>
//                       ) : filteredOrderItems.length > 0 ? (
//                         <>
//                           <div className="px-3 md:px-4 py-2 text-xs text-slate-500 bg-slate-50 border-b">
//                             Found {filteredOrderItems.length} pending items matching "{orderItemSearch}"
//                           </div>
//                           {filteredOrderItems.map((item) => {
//                             const itemId = item.OrderItemId || item.orderItemId || item.id || item.OrderItemID || item.orderItemID || item.OrderItem_Id || 'N/A';
//                             const orderId = getOrderId(item);
//                             const status = item.Status || item.OrderStatus || item.ItemStatus || item.status || item.orderStatus || item.itemStatus || '';
//                             const displayStatus = formatStatus(status);
                            
//                             return (
//                               <div
//                                 key={itemId}
//                                 onClick={() => handleOrderItemSelect(item)}
//                                 className="px-3 md:px-4 py-2 md:py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors duration-200"
//                               >
//                                 <div className="font-medium text-slate-900 text-sm">ID: {itemId}</div>
//                                 <div className="text-xs text-slate-600">Order: {orderId} </div>
//                                 <div className="text-xs text-purple-600 font-medium mt-1">
//                                   Status: {displayStatus}
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </>
//                       ) : (
//                         <div className="px-3 md:px-4 py-2 md:py-3 text-slate-500 text-center text-sm">
//                           {availableOrderItems.length === 0 ? 'No unassigned pending order items available' : `No pending items match "${orderItemSearch}"`}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {selectedOrderItem && Object.keys(formMeasurements).length > 0 && (
//                   <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-3 md:p-4 rounded-2xl border border-green-200 shadow-inner">
//                     <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2 text-sm">
//                       <FiTool />
//                       Available Measurements
//                     </h3>
//                     <div className="grid grid-cols-2 gap-2">
//                       {Object.entries(formMeasurements).map(([key, value]) => (
//                         <div key={key} className="bg-white/70 p-2 rounded-lg border border-green-100">
//                           <div className="text-xs text-slate-600 uppercase tracking-wide">
//                             {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                           </div>
//                           <div className="text-sm text-slate-800">
//                             {typeof value === 'number' ? `${value} cm` : String(value)}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="relative" ref={tailorDropdownRef}>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Tailor *</label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       placeholder="Search tailors by name or skills..."
//                       value={tailorSearch}
//                       onChange={(e) => {
//                         setTailorSearch(e.target.value);
//                         setIsTailorDropdownOpen(true);
//                       }}
//                       onFocus={() => setIsTailorDropdownOpen(true)}
//                       className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                     />
//                     <button
//                       type="button"
//                       onClick={toggleTailorDropdown}
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
//                     >
//                       {isTailorDropdownOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
//                     </button>
//                   </div>

//                   {isTailorDropdownOpen && (
//                     <div className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-auto">
//                       {filteredTailors.length > 0 ? (
//                         filteredTailors.map((tailor) => (
//                           <div
//                             key={tailor.TailorId}
//                             onClick={() => handleTailorSelect(tailor.TailorId, tailor.Name)}
//                             className="px-3 md:px-4 py-2 md:py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors duration-200"
//                           >
//                             <div className="font-medium text-slate-900 text-sm">{tailor.Name}</div>
//                             {tailor.Skills && (
//                               <div className="text-xs text-slate-600 mt-1">
//                                 Skills: {tailor.Skills}
//                               </div>
//                             )}
//                           </div>
//                         ))
//                       ) : (
//                         <div className="px-3 md:px-4 py-2 md:py-3 text-slate-500 text-center text-sm">No tailors found</div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Assign Date *</label>
//                   <input
//                     type="date"
//                     name="AssignDate"
//                     value={formData.AssignDate}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Status </label>
//                   <div className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl bg-slate-100/50 text-slate-600 text-sm md:text-base">
//                     Assigned
//                   </div>
//                   <input type="hidden" name="Status" value="Assigned" />
//                 </div>

//                 <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowModal(false);
//                       setIsTailorDropdownOpen(false);
//                       setIsOrderItemDropdownOpen(false);
//                       setTailorSearch("");
//                       setOrderItemSearch("");
//                       setSelectedOrderItem(null);
//                     }}
//                     className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base order-1 md:order-2"
//                   >
//                     Save Assignment
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

// export default Assignments;

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiPlusSquare,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit,
  FiSave,
  FiUser,
  FiClipboard,
  FiCalendar,
  FiActivity,
  FiInfo,
  FiShoppingBag,
  FiFileText,
  FiTool,
  FiExternalLink,
  FiEye
} from "react-icons/fi";
import { AssingTailor, GetAllAssignment, AssingmentStatusUpdate } from "../actions/assignmentAction";
import { GetAllTailors } from "../actions/tailorAction";
import { GetOrderItems } from "../actions/orderAction";

const formatCurrency = (amount) => {
  return parseFloat(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Function to decode JWT token
const decodeJWTToken = (token) => {
  try {
    if (!token) return null;
    
    // JWT token has 3 parts: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

// Enhanced function to get current user details from JWT token
const getCurrentUser = () => {
  try {
    // Get user data from localStorage
    const userDataString = localStorage.getItem('user');
    console.log('🔍 DEBUG - user data from localStorage:', userDataString);
    
    let userData = null;
    let token = null;
    
    if (userDataString) {
      try {
        const parsedUser = JSON.parse(userDataString);
        console.log('🔍 DEBUG - parsed user object:', parsedUser);
        
        // Extract token from user object
        token = parsedUser.token;
        console.log('🔍 DEBUG - extracted token:', token);
        
        if (token) {
          // Decode JWT token to get user information
          const decodedToken = decodeJWTToken(token);
          console.log('🔍 DEBUG - Decoded JWT token:', decodedToken);
          
          if (decodedToken) {
            userData = {
              id: decodedToken.TailorId || decodedToken.id || decodedToken.userId || decodedToken.UserId || decodedToken.ID || decodedToken.sub || '',
              name: decodedToken.name || decodedToken.Name || decodedToken.username || decodedToken.UserName || '',
              email: decodedToken.email || decodedToken.Email || '',
              role: decodedToken.role || parsedUser.role || ''
            };
          }
        }
        
        // If token decoding failed, use data from localStorage
        if (!userData || !userData.id) {
          userData = {
            id: parsedUser.id || parsedUser.userId || parsedUser.UserId || parsedUser.ID || '',
            name: parsedUser.name || parsedUser.Name || parsedUser.username || parsedUser.UserName || '',
            email: parsedUser.Email || parsedUser.email || '',
            role: parsedUser.role || parsedUser.userRole || parsedUser.user_type || parsedUser.type || ''
          };
        }
        
      } catch (parseError) {
        console.error('Error parsing stored user data:', parseError);
      }
    }
    
    // Final fallback
    if (!userData) {
      userData = { id: '', name: '', email: '', role: '' };
    }
    
    console.log('🔍 DEBUG - Final user data:', userData);
    return userData;
    
  } catch (error) {
    console.error('Error getting user data:', error);
    return { id: '', name: '', email: '', role: '' };
  }
};

const useAssignmentsData = () => {
  return useSelector(
    (state) => state.getAllAssignment || { responseBody: [], loading: false, msg: null, error: null }
  );
};

const useAssignmentAddData = () => {
  return useSelector(
    (state) => state.assingTailor || { loading: false, error: null, msg: null }
  );
};

const useAssignmentUpdateData = () => {
  return useSelector(
    (state) => state.assignmentStatusUpdate || { loading: false, error: null, msg: null }
  );
};

const useTailorsData = () => {
  const tailorData = useSelector((state) => state.tailorList);
  return {
    responseBody: tailorData?.responseBody || [],
    loading: tailorData?.loading || false,
    error: tailorData?.error || null
  };
};

const useOrderItemsData = () => {
  const orderItemsData = useSelector((state) => state.orderItemsGet);
  return {
    responseBody: orderItemsData?.responseBody || [],
    loading: orderItemsData?.loading || false,
    error: orderItemsData?.error || null
  };
};

const useOrderItemDetails = (orderItemId) => {
  const { responseBody: orderItems = [] } = useOrderItemsData();
  
  const orderItemDetails = useMemo(() => {
    if (!orderItemId || !orderItems || !orderItems.length) return null;
    
    const foundItem = orderItems.find((item) => {
      const itemId = item.OrderItemId || item.orderItemId || item.id || item.OrderItemID || item.orderItemID || item.OrderItem_Id;
      return String(itemId) === String(orderItemId);
    });
    
    return foundItem || null;
  }, [orderItems, orderItemId]);

  return { orderItemDetails, loading: false, error: null };
};

function Assignments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get current user information from JWT token
  const currentUser = getCurrentUser();
  const isTailor = currentUser.role.toLowerCase() === 'tailor';
  const currentTailorId = currentUser.id;
  
  console.log('🔍 DEBUG - Current User:', currentUser);
  console.log('🔍 DEBUG - Is Tailor:', isTailor);
  console.log('🔍 DEBUG - Current Tailor ID:', currentTailorId);

  const { responseBody: assignments = [], loading, msg: assignmentsMsg, error: assignmentsError } = useAssignmentsData();
  const { responseBody: tailors = [], loading: tailorsLoading } = useTailorsData();
  const { loading: updating, error: updateError, msg: updateMsg } = useAssignmentUpdateData();
  const { loading: adding, error: addError, msg: addMsg } = useAssignmentAddData();
  const { responseBody: orderItems = [], loading: orderItemsLoading } = useOrderItemsData();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const [isTailorDropdownOpen, setIsTailorDropdownOpen] = useState(false);
  const [isOrderItemDropdownOpen, setIsOrderItemDropdownOpen] = useState(false);
  const [tailorSearch, setTailorSearch] = useState("");
  const [orderItemSearch, setOrderItemSearch] = useState("");
  const tailorDropdownRef = useRef(null);
  const orderItemDropdownRef = useRef(null);

  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Set default assigned date to today
  const [formData, setFormData] = useState({
    OrderItemId: "",
    TailorId: "",
    Status: "Assigned",
    AssignDate: new Date().toISOString().split("T")[0],
  });

  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const { orderItemDetails } = useOrderItemDetails(
    selectedAssignment ? selectedAssignment.OrderItemId : null
  );

  const getTailorName = useMemo(() => {
    return (id) => {
      if (!tailors || !Array.isArray(tailors)) return `ID ${id}`;
      const tailor = tailors.find((t) => t.TailorId === id);
      return tailor ? tailor.Name : `ID ${id}`;
    };
  }, [tailors]);

  const getOrderId = useMemo(() => {
    return (orderItem) => {
      if (!orderItem) return null;
      return orderItem.OrderId || orderItem.orderId || orderItem.OrderID || orderItem.orderID;
    };
  }, []);

  const getMeasurements = useMemo(() => {
    return (orderItem) => {
      if (!orderItem) return {};
      
      const measurements = 
        orderItem.Measurements ||
        orderItem.measurements ||
        orderItem.Measurement ||
        orderItem.measurement ||
        orderItem.MeasurementDetails ||
        orderItem.measurementDetails ||
        orderItem.MeasurementData ||
        orderItem.measurementData ||
        orderItem.MeasurementJson ||
        orderItem.measurementJson ||
        {};
      
      if (typeof measurements === 'string') {
        try {
          return JSON.parse(measurements);
        } catch (e) {
          const keyValuePairs = {};
          try {
            const pairs = measurements.split(',').map(pair => {
              const [key, ...valueParts] = pair.split(':');
              return [key?.trim(), valueParts.join(':').trim()];
            });
            
            pairs.forEach(([key, value]) => {
              if (key && value && key !== 'undefined' && value !== 'undefined') {
                keyValuePairs[key] = isNaN(value) ? value : parseFloat(value);
              }
            });
          } catch (parseError) {
            console.log('Failed to parse measurements string:', measurements);
          }
          return keyValuePairs;
        }
      }
      
      return measurements;
    };
  }, []);

  const assignedOrderItemIds = useMemo(() => {
    if (!assignments || !Array.isArray(assignments)) return new Set();
    return new Set(assignments.map(assignment => String(assignment.OrderItemId)));
  }, [assignments]);

  const availableOrderItems = useMemo(() => {
    if (!orderItems || !Array.isArray(orderItems)) {
      return [];
    }
    
    const filteredItems = orderItems.filter((item) => {
      if (!item) return false;
      
      const itemId = String(
        item.OrderItemId || 
        item.orderItemId || 
        item.id || 
        item.OrderItemID ||
        item.orderItemID ||
        item.OrderItem_Id ||
        ''
      );
      
      const isUnassigned = !assignedOrderItemIds.has(itemId);
      
      if (!isUnassigned) {
        return false;
      }
      
      const status = 
        item.Status || 
        item.status || 
        item.OrderStatus || 
        item.orderStatus || 
        item.ItemStatus || 
        item.itemStatus || 
        item.OrderItemStatus ||
        item.orderItemStatus ||
        '';
      
      const normalizedStatus = status.toString().trim().toLowerCase();
      
      const isPending = 
        normalizedStatus === 'pending' ||
        normalizedStatus.includes('pending') ||
        normalizedStatus === 'not started' ||
        normalizedStatus === 'not_started' ||
        normalizedStatus === 'new' ||
        normalizedStatus === 'open' ||
        normalizedStatus === '' ||
        normalizedStatus === 'null' ||
        normalizedStatus === 'undefined';
      
      return isUnassigned && isPending;
    });

    return filteredItems;
  }, [orderItems, assignedOrderItemIds]);

  // Filter assignments based on user role - CORE FILTERING LOGIC
  const filteredAssignmentsByUser = useMemo(() => {
    if (!assignments || !Array.isArray(assignments)) return [];
    
    console.log('🔍 DEBUG - Filtering assignments:', {
      totalAssignments: assignments.length,
      isTailor,
      currentTailorId,
      assignmentsSample: assignments.slice(0, 3)
    });
    
    if (isTailor && currentTailorId) {
      // For tailors: show only assignments assigned to them
      const myAssignments = assignments.filter(assignment => {
        const assignmentTailorId = String(assignment.TailorId || '');
        const currentTailorIdStr = String(currentTailorId);
        const isMatch = assignmentTailorId === currentTailorIdStr;
        
        console.log('🔍 DEBUG - Assignment filter check:', {
          assignmentId: assignment.AssignmentId,
          assignmentTailorId,
          currentTailorIdStr,
          isMatch
        });
        
        return isMatch;
      });
      
      console.log('🔍 DEBUG - My Assignments Filter Result:', {
        totalAssignments: assignments.length,
        myAssignmentsCount: myAssignments.length,
        currentTailorId,
        myAssignments: myAssignments.map(a => ({ id: a.AssignmentId, tailorId: a.TailorId }))
      });
      
      return myAssignments;
    } else {
      // For admin/non-tailor users: show all assignments
      console.log('🔍 DEBUG - Showing all assignments for admin/non-tailor user');
      return assignments;
    }
  }, [assignments, isTailor, currentTailorId]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (error) {
      return "-";
    }
  };

  const handleOrderIdClick = (event, orderId) => {
    event.stopPropagation();
    event.preventDefault();
    
    if (!orderId) return;
    
    navigate(`/orders?search=${orderId}&exact=true`);
    setShowDetailsModal(false);
  };

  const handleViewClick = (assignment, e) => {
    e.stopPropagation();
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  const filteredAssignments = useMemo(() => {
    if (!filteredAssignmentsByUser || !Array.isArray(filteredAssignmentsByUser)) return [];
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const exactMatch = urlParams.get('exact') === 'true';
    
    let filtered = filteredAssignmentsByUser;
    
    if (searchParam && exactMatch) {
      filtered = filteredAssignmentsByUser.filter(assignment => {
        const assignmentOrderItem = orderItems.find(item => {
          const itemId = item.OrderItemId || item.orderItemId || item.id;
          return String(itemId) === String(assignment.OrderItemId);
        });
        
        const orderId = getOrderId(assignmentOrderItem);
        const orderIdString = String(orderId);
        const searchParamString = String(searchParam);
        
        return orderIdString === searchParamString;
      });
    } 
    else if (search) {
      filtered = filteredAssignmentsByUser.filter(
        (assignment) =>
          assignment.AssignmentId?.toString().includes(search.toLowerCase()) ||
          assignment.OrderItemId?.toString().includes(search.toLowerCase()) ||
          getTailorName(assignment.TailorId)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          assignment.Status?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      const idA = a.AssignmentId || 0;
      const idB = b.AssignmentId || 0;
      return idB - idA;
    });
  }, [filteredAssignmentsByUser, search, getTailorName, orderItems, getOrderId]);

  const totalPages = Math.ceil(filteredAssignments.length / recordsPerPage);
  const currentRecords = useMemo(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    return filteredAssignments.slice(indexOfFirstRecord, indexOfLastRecord);
  }, [filteredAssignments, currentPage, recordsPerPage]);

  const getPageNumbers = useMemo(() => {
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const filteredTailors = useMemo(() => {
    if (!tailors || !Array.isArray(tailors)) return [];
    return tailors.filter((tailor) =>
      tailor.Name?.toLowerCase().includes(tailorSearch.toLowerCase()) ||
      tailor.Skills?.toLowerCase().includes(tailorSearch.toLowerCase())
    );
  }, [tailors, tailorSearch]);

  const filteredOrderItems = useMemo(() => {
    if (!availableOrderItems || !Array.isArray(availableOrderItems)) {
      return [];
    }
    
    const filtered = availableOrderItems.filter((item) => {
      if (!item) return false;
      
      const searchText = orderItemSearch.toLowerCase();
      
      const id = String(
        item.OrderItemId || 
        item.orderItemId || 
        item.id || 
        item.OrderItemID ||
        item.orderItemID ||
        item.OrderItem_Id ||
        ''
      ).toLowerCase();
      
      const productName = String(
        item.productName ||
        item.ItemName ||
        item.itemName ||
        ''
      ).toLowerCase();
      
      const orderId = String(
        item.OrderId ||
        item.orderId ||
        item.OrderID ||
        item.orderID ||
        ''
      ).toLowerCase();
      
      return id.includes(searchText) || productName.includes(searchText) || orderId.includes(searchText);
    });

    return filtered;
  }, [availableOrderItems, orderItemSearch]);

  useEffect(() => {
    dispatch(GetAllAssignment());
    dispatch(GetAllTailors());
    dispatch(GetOrderItems());
  }, [dispatch]);

  useEffect(() => {
    if (!adding && addError) {
      setNotification({ 
        type: 'error', 
        message: addError || 'Failed to add assignment!' 
      });
    } else if (!adding && addMsg) {
      // Don't show success notification for assignment addition
      dispatch(GetAllAssignment());
      
      setShowModal(false);
      setFormData({
        OrderItemId: "",
        TailorId: "",
        Status: "Assigned",
        AssignDate: new Date().toISOString().split("T")[0],
      });
      setSelectedOrderItem(null);
      setTailorSearch("");
      setOrderItemSearch("");
    }
  }, [adding, addMsg, addError, dispatch]);

  useEffect(() => {
    if (!updating && updateError) {
      setNotification({ 
        type: 'error', 
        message: updateError || 'Failed to update assignment status!' 
      });
    } else if (!updating && updateMsg) {
      // Don't show success notification for status updates
      setEditingAssignment(null);
      setSelectedStatus("");
      
      dispatch(GetAllAssignment());
    }
  }, [updating, updateMsg, updateError, dispatch]);

  useEffect(() => {
    if (assignmentsError) {
      setNotification({ type: 'error', message: assignmentsError || 'Failed to load assignments!' });
    }
  }, [assignmentsError]);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tailorDropdownRef.current && !tailorDropdownRef.current.contains(event.target)) {
        setIsTailorDropdownOpen(false);
      }
      if (orderItemDropdownRef.current && !orderItemDropdownRef.current.contains(event.target)) {
        setIsOrderItemDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "Status") {
      value = value === "Pending" ? "Pending" : value;
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleTailorSelect = (tailorId, tailorName) => {
    setFormData({ ...formData, TailorId: tailorId });
    setTailorSearch(tailorName);
    setIsTailorDropdownOpen(false);
  };

  const handleOrderItemSelect = (orderItem) => {
    const orderItemId = orderItem.OrderItemId || orderItem.orderItemId || orderItem.id;
    setFormData({ ...formData, OrderItemId: orderItemId });
    setSelectedOrderItem(orderItem);
    
    const orderId = getOrderId(orderItem);
    setOrderItemSearch(`ID: ${orderItemId} - Order: ${orderId}`);
    setIsOrderItemDropdownOpen(false);
  };

  const toggleTailorDropdown = () => {
    setIsTailorDropdownOpen(!isTailorDropdownOpen);
    if (!isTailorDropdownOpen) setTailorSearch("");
  };

  const toggleOrderItemDropdown = () => {
    setIsOrderItemDropdownOpen(!isOrderItemDropdownOpen);
    if (!isOrderItemDropdownOpen) setOrderItemSearch("");
  };

  const validateForm = () => {
    if (!formData.OrderItemId) {
      setNotification({ message: "Please select an Order Item.", type: "error" });
      return false;
    }
    if (!formData.TailorId) {
      setNotification({ message: "Please select a tailor.", type: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log('📦 Submitting assignment:', formData);
    dispatch(AssingTailor(formData));
  };

  const handleStatusEditClick = (assignment) => {
    setEditingAssignment(assignment.AssignmentId);
    setSelectedStatus(assignment.Status);
  };

  const handleStatusUpdate = (assignment) => {
    if (!selectedStatus) {
      setNotification({ message: "Please select a status.", type: "error" });
      return;
    }

    const updateData = {
      TailorId: assignment.TailorId,
      Status: selectedStatus,
      OrderItemId: assignment.OrderItemId
    };

    console.log('🔄 Updating assignment status:', updateData);
    dispatch(AssingmentStatusUpdate(updateData));
  };

  const handleCancelStatusEdit = () => {
    setEditingAssignment(null);
    setSelectedStatus("");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'assigned':
        return 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-200/50';
      case 'in progress':
        return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50';
      case 'completed':
        return 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200/50';
      case 'pending':
        return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200/50';
      default:
        return 'bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50';
    }
  };

  const formatStatus = (status) => {
    if (!status || status.toString().trim() === '') return 'Not Set';
    
    const statusStr = status.toString().trim();
    
    switch (statusStr.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'in progress':
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'assigned':
        return 'Assigned';
      default:
        return statusStr.charAt(0).toUpperCase() + statusStr.slice(1).toLowerCase();
    }
  };

  const measurements = useMemo(() => {
    if (!orderItemDetails) return {};
    return getMeasurements(orderItemDetails);
  }, [orderItemDetails, getMeasurements]);

  const formMeasurements = useMemo(() => {
    if (!selectedOrderItem) return {};
    return getMeasurements(selectedOrderItem);
  }, [selectedOrderItem, getMeasurements]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 md:p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
      {notification.message && (
  <div
    className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[10000] p-4 rounded-2xl shadow-2xl flex items-center animate-slide-in max-w-md w-full ${
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

      <div className="relative z-10 mb-6 md:mb-8">
        <div className="flex items-center space-x-4 mb-3">
          <div className="p-3 md:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
            <FiClipboard className="text-white text-lg md:text-xl" />
          </div>
          <div className="transform ">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Assignments
            </h1>
            <p className="text-slate-600 mt-1 text-sm md:text-base">
              {isTailor ? `My Assignments - Showing ${filteredAssignmentsByUser.length} assignments` : 'Manage tailor assignments - Showing newest first'}
            </p>
            {isTailor && currentUser.name && (
              <p className="text-slate-500 text-xs mt-1">
                Welcome, {currentUser.name} | Tailor ID: {currentTailorId} | Email: {currentUser.email}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  {isTailor ? 'My Assignments' : 'Total Assignments'}
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {filteredAssignmentsByUser.length}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
                <FiClipboard className="text-white text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Available Tailors</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {Array.isArray(tailors) ? tailors.length : 0}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
                <FiUser className="text-white text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Unassigned Pending Orders</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {Array.isArray(availableOrderItems) ? availableOrderItems.length : 0}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl shadow-lg">
                <FiActivity className="text-white text-base md:text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row flex-grow space-y-4 md:space-y-0 md:space-x-4 w-full">
          <div className="relative flex-grow group">
  <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
  <input
    type="text"
    placeholder="Search by Assignment ID, Order Item ID, Tailor..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="relative w-full pl-10 pr-4 py-2.5 md:pl-12 md:pr-6 md:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-[11px] sm:text-xs md:text-sm lg:text-base"
  />
  <FiSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={14} />
</div>
          
          {!isTailor && (
            <button
              onClick={() => setShowModal(true)}
              className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 md:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 w-full md:w-auto"
            >
              <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
              <FiPlusSquare className="mr-3 relative z-10" size={18} />
              <span className="relative z-10">Add Assignment</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-6 md:mb-8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
                <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Assignment ID</th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Order ID</th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Order Item ID</th>
                {/* ALWAYS SHOW TAILOR COLUMN FOR BOTH ADMIN AND TAILOR USERS */}
                <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Tailor</th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Assigned Date</th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Status</th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 md:py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 md:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                        <FiClipboard className="text-slate-500 text-lg md:text-xl" />
                      </div>
                      <p className="text-slate-500 font-medium">Loading assignments...</p>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((assignment) => {
                  const assignmentOrderItem = orderItems.find(item => {
                    const itemId = item.OrderItemId || item.orderItemId || item.id;
                    return String(itemId) === String(assignment.OrderItemId);
                  });
                  
                  const orderId = getOrderId(assignmentOrderItem);
                  
                  return (
                    <tr 
                      key={assignment.AssignmentId} 
                      className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-white to-slate-50 group"
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                        {assignment.AssignmentId}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                        {orderId || '-'}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                        {assignment.OrderItemId}
                      </td>
                      {/* ALWAYS SHOW TAILOR COLUMN FOR BOTH ADMIN AND TAILOR USERS */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                        {getTailorName(assignment.TailorId)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                        {formatDate(assignment.AssignDate)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                        {editingAssignment === assignment.AssignmentId ? (
                          <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-2 md:px-3 py-1 md:py-2 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 text-sm"
                            disabled={updating}
                          >
                            <option value="">Select Status</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2 md:px-3 py-1 md:py-2 rounded-full text-xs ${getStatusColor(assignment.Status)}`}
                          >
                            {formatStatus(assignment.Status)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                        <div className="flex justify-center space-x-2 md:space-x-3">
                          <button
                            onClick={(e) => handleViewClick(assignment, e)}
                            className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                            title="View Details"
                          >
                            <FiEye size={14} />
                          </button>

                          {editingAssignment === assignment.AssignmentId ? (
                            <div className="flex space-x-1 md:space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(assignment)}
                                disabled={updating}
                                className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                                title="Save Status"
                              >
                                <FiSave size={14} />
                              </button>
                              <button
                                onClick={handleCancelStatusEdit}
                                className="p-2 md:p-3 bg-gradient-to-br from-slate-500 to-slate-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                                title="Cancel"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusEditClick(assignment);
                              }}
                              disabled={updating}
                              className="inline-flex items-center justify-center p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
                              title="Edit Status"
                            >
                              <FiEdit size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 md:py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 md:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                        <FiClipboard className="text-slate-500 text-lg md:text-xl" />
                      </div>
                      <p className="text-slate-500 font-medium">
                        {isTailor ? 'No assignments found for your account' : 'No assignments found'}
                      </p>
                      {isTailor && (
                        <p className="text-slate-400 text-sm">Contact administrator if you believe this is an error</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredAssignments.length > recordsPerPage && (
          <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 space-y-4 md:space-y-0">
            <div className="text-sm text-slate-600">
              Showing {currentPage * recordsPerPage - recordsPerPage + 1}–{Math.min(currentPage * recordsPerPage, filteredAssignments.length)} of{' '}
              {filteredAssignments.length}
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

      {/* Rest of your modal components remain exactly the same */}
      {showDetailsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] ">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6">
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                    <FiInfo className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      Assignment Details
                    </h2>
                    <p className="text-slate-600 text-sm">
                      Assignment ID: {selectedAssignment.AssignmentId} | Order Item ID: {selectedAssignment.OrderItemId}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
                >
                  <FiX size={20} />
                </button>
              </div>

              {orderItemsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div>
                    <span className="text-slate-700">Loading order item details...</span>
                  </div>
                </div>
              ) : !orderItemDetails ? (
                <div className="text-center py-8">
                  <div className="bg-gradient-to-r from-rose-50 to-red-50 p-6 rounded-2xl border border-rose-200 shadow-inner">
                    <FiAlertCircle className="text-rose-500 text-2xl mx-auto mb-3" />
                    <p className="text-rose-700">Order item details not found</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 rounded-2xl border border-slate-200 shadow-inner">
                      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <FiShoppingBag />
                        Order Item Details
                      </h3>
                      {orderItemDetails ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-700 font-bold text-base">ORDER ID:</span>
                            <span className="font-mono font-bold text-slate-900 text-base">
                              {orderItemDetails.OrderId || orderItemDetails.orderId ? (
                                <button
                                  onClick={(e) => handleOrderIdClick(e, orderItemDetails.OrderId || orderItemDetails.orderId)}
                                  className="text-blue-700 hover:text-blue-900 underline transition-colors duration-200 flex items-center gap-1 bg-transparent border-none cursor-pointer font-mono font-bold text-base"
                                  title={`View Order ${orderItemDetails.OrderId || orderItemDetails.orderId}`}
                                >
                                  {orderItemDetails.OrderId || orderItemDetails.orderId}
                                  <FiExternalLink size={14} />
                                </button>
                              ) : (
                                <span className="text-slate-400">N/A</span>
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm">Order Item ID:</span>
                            <span className="font-mono text-slate-800 text-sm">
                              {orderItemDetails.OrderItemId || orderItemDetails.orderItemId || orderItemDetails.id}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm">Quantity:</span>
                            <span className="text-slate-800 text-sm">
                              {orderItemDetails.Quantity || orderItemDetails.quantity || 1}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm">Price:</span>
                            <span className="text-slate-800 text-sm">
                              {orderItemDetails.Price || orderItemDetails.price ? 
                                formatCurrency(orderItemDetails.Price || orderItemDetails.price) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-500 text-center py-4 text-sm">
                          No order item details found
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-2xl border border-blue-200 shadow-inner">
                      <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <FiClipboard />
                        Assignment Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 text-sm">Assignment ID:</span>
                          <span className="font-mono text-slate-800 text-sm">{selectedAssignment.AssignmentId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 text-sm">Order Item ID:</span>
                          <span className="font-mono text-slate-800 text-sm">{selectedAssignment.OrderItemId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 text-sm">Tailor:</span>
                          <span className="text-slate-800 text-sm">{getTailorName(selectedAssignment.TailorId)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 text-sm">Assigned Date:</span>
                          <span className="text-slate-800 text-sm">
                            {formatDate(selectedAssignment.AssignDate)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 text-sm">Status:</span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(selectedAssignment.Status)}`}>
                            {formatStatus(selectedAssignment.Status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 mt-6 border-t border-slate-200/50">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                >
                  Close Details
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                    <FiPlusSquare className="text-white text-base md:text-lg" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Add Assignment
                  </h2>
                </div>
                <button 
                  onClick={() => { 
                    setShowModal(false);
                    setIsTailorDropdownOpen(false);
                    setIsOrderItemDropdownOpen(false);
                    setTailorSearch("");
                    setOrderItemSearch("");
                    setSelectedOrderItem(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="relative" ref={orderItemDropdownRef}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Order Item *</label>
                  <div className="text-xs text-slate-500 mb-2 bg-blue-50 p-2 rounded-lg">
                    Showing only <span className="font-semibold text-purple-600">unassigned PENDING</span> order items
                    <br />
                    <span className="font-semibold">Available: {availableOrderItems.length} pending items</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search pending order items by ID, Order ID, or product name..."
                      value={orderItemSearch}
                      onChange={(e) => {
                        setOrderItemSearch(e.target.value);
                        setIsOrderItemDropdownOpen(true);
                      }}
                      onFocus={() => setIsOrderItemDropdownOpen(true)}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    />
                    <button
                      type="button"
                      onClick={toggleOrderItemDropdown}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {isOrderItemDropdownOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                    </button>
                  </div>

                  {isOrderItemDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-auto">
                      {orderItemsLoading ? (
                        <div className="px-3 md:px-4 py-2 md:py-3 text-slate-500 text-center text-sm">Loading pending order items...</div>
                      ) : filteredOrderItems.length > 0 ? (
                        <>
                          <div className="px-3 md:px-4 py-2 text-xs text-slate-500 bg-slate-50 border-b">
                            Found {filteredOrderItems.length} pending items matching "{orderItemSearch}"
                          </div>
                          {filteredOrderItems.map((item) => {
                            const itemId = item.OrderItemId || item.orderItemId || item.id || item.OrderItemID || item.orderItemID || item.OrderItem_Id || 'N/A';
                            const orderId = getOrderId(item);
                            const status = item.Status || item.OrderStatus || item.ItemStatus || item.status || item.orderStatus || item.itemStatus || '';
                            const displayStatus = formatStatus(status);
                            
                            return (
                              <div
                                key={itemId}
                                onClick={() => handleOrderItemSelect(item)}
                                className="px-3 md:px-4 py-2 md:py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors duration-200"
                              >
                                <div className="font-medium text-slate-900 text-sm">ID: {itemId}</div>
                                <div className="text-xs text-slate-600">Order: {orderId} </div>
                                <div className="text-xs text-purple-600 font-medium mt-1">
                                  Status: {displayStatus}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div className="px-3 md:px-4 py-2 md:py-3 text-slate-500 text-center text-sm">
                          {availableOrderItems.length === 0 ? 'No unassigned pending order items available' : `No pending items match "${orderItemSearch}"`}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedOrderItem && Object.keys(formMeasurements).length > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-3 md:p-4 rounded-2xl border border-green-200 shadow-inner">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2 text-sm">
                      <FiTool />
                      Available Measurements
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(formMeasurements).map(([key, value]) => (
                        <div key={key} className="bg-white/70 p-2 rounded-lg border border-green-100">
                          <div className="text-xs text-slate-600 uppercase tracking-wide">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                          <div className="text-sm text-slate-800">
                            {typeof value === 'number' ? `${value} cm` : String(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative" ref={tailorDropdownRef}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tailor *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search tailors by name or skills..."
                      value={tailorSearch}
                      onChange={(e) => {
                        setTailorSearch(e.target.value);
                        setIsTailorDropdownOpen(true);
                      }}
                      onFocus={() => setIsTailorDropdownOpen(true)}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-inner text-sm md:text-base"
                    />
                    <button
                      type="button"
                      onClick={toggleTailorDropdown}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {isTailorDropdownOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                    </button>
                  </div>

                  {isTailorDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-auto">
                      {filteredTailors.length > 0 ? (
                        filteredTailors.map((tailor) => (
                          <div
                            key={tailor.TailorId}
                            onClick={() => handleTailorSelect(tailor.TailorId, tailor.Name)}
                            className="px-3 md:px-4 py-2 md:py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors duration-200"
                          >
                            <div className="font-medium text-slate-900 text-sm">{tailor.Name}</div>
                            {tailor.Skills && (
                              <div className="text-xs text-slate-600 mt-1">
                                Skills: {tailor.Skills}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 md:px-4 py-2 md:py-3 text-slate-500 text-center text-sm">No tailors found</div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Assign Date *</label>
                  <div className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl bg-slate-100/50 text-slate-800 font-medium text-sm md:text-base">
                    {formData.AssignDate}
                  </div>
                  <input type="hidden" name="AssignDate" value={formData.AssignDate} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status </label>
                  <div className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-slate-200 rounded-2xl bg-slate-100/50 text-slate-600 text-sm md:text-base">
                    Assigned
                  </div>
                  <input type="hidden" name="Status" value="Assigned" />
                </div>

                <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setIsTailorDropdownOpen(false);
                      setIsOrderItemDropdownOpen(false);
                      setTailorSearch("");
                      setOrderItemSearch("");
                      setSelectedOrderItem(null);
                    }}
                    className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base order-2 md:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base order-1 md:order-2"
                  >
                    Save Assignment
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

export default Assignments;