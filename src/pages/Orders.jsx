import React, { useState, useEffect } from "react";
import { 
  FiSearch, 
  FiPlusSquare, 
  FiEdit, 
  FiX, 
  FiEye, 
  FiTrash2, 
  FiRefreshCw, 
  FiChevronLeft, 
  FiChevronRight, 
  FiArrowRight, 
  FiArrowLeft, 
  FiPaperclip, 
  FiImage,
  FiPackage,
  FiChevronUp,
  FiChevronDown,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiUserPlus,
  FiSave
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { GetOrders,
  AddOrder,
  AddOrderItem,
  GetOrderItems,
  UpdateStatusOrder,
  UpdateStatusOrderItem,
   PayAdvance  } from "../actions/orderAction";
import { GetAllCustomers, AddCustomer } from "../actions/customerActions";
import { GetAllGarmentType } from "../actions/garmentTypeAction";
import { GetAllFabricType } from "../actions/fabricTypeAction";
import AdvanceAmountForm from "./AdvanceAmountForm";
import { GetMeasurementsByCustomerId, AddMeasurement, UpdateMeasurement, GetMeasurementByOrderId } from "../actions/measurementActions";
import { FiPrinter } from "react-icons/fi"; // Add this to your existing Fi imports
import PaymentReceipt from './PaymentReceipt';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const Orders = () => {
  const dispatch = useDispatch();

  const { responseBody: orders, loading } = useSelector((state) => state.orderList || {});
  const { responseBody: customers = [] } = useSelector((state) => state.customerList || {});
  const { responseBody: garmentTypes = [] } = useSelector((state) => state.garmentTypeList || {});
  const { responseBody: fabricTypes = [] } = useSelector((state) => state.fabricTypeList || {});
  
  // Access order items and measurements from proper Redux state
  const orderItemsState = useSelector((state) => state.orderItemsGet || {});
  const measurementsByOrderState = useSelector((state) => state.getMeasurementByOrderId || {});
  const addOrderState = useSelector((state) => state.addOrder || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [selectedOrderForItems, setSelectedOrderForItems] = useState(null);
  const [orderItemsData, setOrderItemsData] = useState([]);
  const [orderMeasurements, setOrderMeasurements] = useState([]);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [orderItemResults, setOrderItemResults] = useState([]);
  const [failedOrderItems, setFailedOrderItems] = useState([]);
  const [recentlyAddedOrders, setRecentlyAddedOrders] = useState([]);

  // Status update state
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateOrderId, setStatusUpdateOrderId] = useState(null);
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);

  // Order Item Status update state
  const [updatingItemStatus, setUpdatingItemStatus] = useState(false);
  const [statusUpdateOrderItemId, setStatusUpdateOrderItemId] = useState(null);
  const [showItemStatusConfirmation, setShowItemStatusConfirmation] = useState(false);
  const [pendingItemStatusUpdate, setPendingItemStatusUpdate] = useState(null);

  // Status dropdown visibility state
  const [showStatusDropdown, setShowStatusDropdown] = useState({});
  const [showItemStatusDropdown, setShowItemStatusDropdown] = useState({});

  // Image popup state
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [savedOrderId, setSavedOrderId] = useState(null);
  const [savedMeasurementIds, setSavedMeasurementIds] = useState([]);
  const [tempMeasurementMap, setTempMeasurementMap] = useState(new Map());

  // Store actual measurement data with their IDs
  const [createdMeasurements, setCreatedMeasurements] = useState([]);

  // Store garment type to measurement ID mapping
  const [garmentTypeToMeasurementMap, setGarmentTypeToMeasurementMap] = useState(new Map());

  // Store garment types from measurements for auto-population
  const [garmentTypesFromMeasurements, setGarmentTypesFromMeasurements] = useState([]);

  // Searchable customer dropdown state
  const [customerSearch, setCustomerSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const [customerErrors, setCustomerErrors] = useState({});

  // Add these to your existing state declarations
const [showAdvanceForm, setShowAdvanceForm] = useState(false);
const [selectedOrderForAdvance, setSelectedOrderForAdvance] = useState(null);
const [orderAdvanceData, setOrderAdvanceData] = useState({});

// Add these to your existing state declarations
const [showBill, setShowBill] = useState(false);
const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);
const [billData, setBillData] = useState(null);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Add Customer Modal State
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    FullName: "",
    PhoneNumber: "",
    Email: "",
    Address: ""
  });
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(true);
  

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editingMeasurements, setEditingMeasurements] = useState([]);
  const [editingOrderItems, setEditingOrderItems] = useState([]);

  // Hideable dropdown state for measurements
  const [expandedMeasurements, setExpandedMeasurements] = useState({});

  // Edit measurement state
  const [editingMeasurementId, setEditingMeasurementId] = useState(null);
  const [editingMeasurementData, setEditingMeasurementData] = useState({});

  // Edit order items state
  const [editingOrderItemId, setEditingOrderItemId] = useState(null);
  const [editingOrderItemData, setEditingOrderItemData] = useState({});

  // Bulk status updates state
  const [bulkStatusUpdates, setBulkStatusUpdates] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

 // Order Details - Always use current date, not editable
const [orderData, setOrderData] = useState({
  CustomerId: "",
  OrderDate: new Date().toISOString().slice(0, 10), // Always current date
  DeliveryDate: "",
  Status: "In Progress",
});

  // For new order items (when creating order) - REMOVED quantity
  const [newItems, setNewItems] = useState([{ 
    garmentTypeId: "", 
    fabricTypeId: "", 
    price: "", 
    measurementId: "" // This will be auto-populated
  }]);

  // For adding items to existing order - REMOVED quantity
  const [orderItemsToAdd, setOrderItemsToAdd] = useState([{ 
    garmentTypeId: "", 
    fabricTypeId: "", 
    price: "", 
    measurementId: ""
  }]);

  // For new measurements (when creating order)
  const [newMeasurements, setNewMeasurements] = useState([{
    GarmentTypeId: "",
    Neck: "",
    Chest: "",
    Waist: "",
    Length: "",
    YardsRequired: "",
    Description: "",
    file: "",
    OrderId: "",
    CustomerId: "",
  }]);

  // NEW: Track changes for save button
  const [orderChanges, setOrderChanges] = useState({});
  const [measurementChanges, setMeasurementChanges] = useState({});
  const [orderItemChanges, setOrderItemChanges] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Delivery Date Validation Function
  const validateDeliveryDate = (date) => {
    if (!date) return true; // Allow empty for optional validation
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    
    if (selectedDate < today) {
      setNotification({ type: 'error', message: "Delivery date cannot be in the past. Please select a future date." });
      
      // Clear the invalid date
      if (editMode) {
        setOrderData(prev => ({ ...prev, DeliveryDate: "" }));
      } else {
        setOrderData(prev => ({ ...prev, DeliveryDate: "" }));
      }
      return false;
    }
    return true;
  };

  // UPDATED: Validation function for amounts and measurements - only prevent negative numbers
  const validatePositiveNumber = (value, fieldName) => {
    if (value === "" || value === null || value === undefined) return true; // Allow empty for optional fields
    
    // Convert to number
    const numValue = parseFloat(value);
    
    // Allow 0 and positive numbers, only prevent negative numbers
    if (isNaN(numValue) || numValue < 0) {
      setNotification({ type: 'error', message: `${fieldName} cannot be negative` });
      return false;
    }
    return true;
  };

// Enhanced handleNewItemChange with integer-only validation
const handleNewItemChange = (index, e) => {
  const { name, value } = e.target;
  
  // Validate price field - only allow integers
  if (name === 'price' && value !== "") {
    // Only allow numbers, no decimals
    if (!/^\d*$/.test(value)) {
      setNotification({ type: 'error', message: 'Price must be a whole number (no decimals)' });
      return;
    }
    
    // Validate positive number
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      setNotification({ type: 'error', message: 'Price cannot be negative' });
      return;
    }
  }
  
  const updatedItems = [...newItems];
  updatedItems[index][name] = value;
  
  // If garment type changes, try to auto-populate measurement ID
  if (name === 'garmentTypeId' && value) {
    const measurementId = garmentTypeToMeasurementMap.get(parseInt(value));
    if (measurementId) {
      updatedItems[index].measurementId = measurementId.toString();
      console.log(`🔄 Auto-populated measurement ID ${measurementId} for garment type ${value}`);
    }
  }
  
  setNewItems(updatedItems);
};

// Enhanced handleNewMeasurementChange with YardsRequired validation
const handleNewMeasurementChange = (index, e) => {
  const { name, value } = e.target;
  
  // Validate measurement fields (Neck, Chest, Waist, Length, YardsRequired) - only prevent negative
  if (['Neck', 'Chest', 'Waist', 'Length', 'YardsRequired'].includes(name) && value !== "") {
    if (!validatePositiveNumber(value, name)) return;
  }
  
  const updatedMeasurements = [...newMeasurements];
  updatedMeasurements[index][name] = value;
  setNewMeasurements(updatedMeasurements);
};

// Enhanced handleEditOrderItemChange with integer-only validation
const handleEditOrderItemChange = (e) => {
  const { name, value } = e.target;
  
  // Validate price field - only allow integers
  if (name === 'price' && value !== "") {
    // Only allow numbers, no decimals
    if (!/^\d*$/.test(value)) {
      setNotification({ type: 'error', message: 'Price must be a whole number (no decimals)' });
      return;
    }
    
    // Validate positive number
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      setNotification({ type: 'error', message: 'Price cannot be negative' });
      return;
    }
  }
  
  setEditingOrderItemData(prev => ({
    ...prev,
    [name]: value
  }));
  
  // Track changes
  setOrderItemChanges(prev => ({
    ...prev,
    [editingOrderItemId]: true
  }));
  setHasChanges(true);
};

  // Enhanced handleEditMeasurementChange with validation
const handleEditMeasurementChange = (e) => {
  const { name, value } = e.target;
  
  // Validate measurement fields - only prevent negative
  if (['Neck', 'Chest', 'Waist', 'Length', 'YardsRequired'].includes(name) && value !== "") {
    if (!validatePositiveNumber(value, name)) return;
  }
  
  setEditingMeasurementData(prev => ({
    ...prev,
    [name]: value
  }));
  
  // Track changes
  setMeasurementChanges(prev => ({
    ...prev,
    [editingMeasurementId]: true
  }));
  setHasChanges(true);
};

// In your handleStatusChangeInEdit function, add this case:
const handleStatusChangeInEdit = async (newStatus) => {
  if (!viewingOrder) return;
  
  try {
    setUpdatingStatus(true);
    
    const orderPayload = {
      OrderId: extractOrderId(viewingOrder),
      CustomerId: parseInt(orderData.CustomerId),
      OrderDate: orderData.OrderDate,
      DeliveryDate: orderData.DeliveryDate,
      Status: newStatus,
      TotalAmount: calculateEditingTotalAmount(),
    };

    console.log("🔄 Updating order status:", orderPayload);
    
    // Make the API call
    await dispatch(UpdateStatusOrder(orderPayload));
    
    // Show success notification
    setNotification({ 
      type: 'success', 
      message: `Order status updated to ${newStatus} successfully!` 
    });
    
    // Refresh orders list immediately
    dispatch(GetOrders());
    
    // If status changed to Completed, close the form
    if (newStatus === 'Completed') {
      setShowOrderModal(false);
      setEditMode(false);
      setViewingOrder(null);
      resetForm();
    }
    
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    setNotification({ 
      type: 'error', 
      message: `Error updating status: ${error.message}` 
    });
  } finally {
    setUpdatingStatus(false);
  }
};

// CORRECT: Handle advance amount saving with API call
const handleSaveAdvanceAmount = async (advanceData) => {
  try {
    setSaving(true);
    
    console.log("💰 Processing advance payment:", advanceData);
    
    // Make API call to save advance amount
    const result = await dispatch(PayAdvance(
      advanceData.orderId, 
      advanceData.advanceAmount
    ));
    
    console.log("📦 PayAdvance API response:", result);
    
    if (result && result.success) {
      // Update the order with advance amount data
      setOrderAdvanceData(prev => ({
        ...prev,
        [advanceData.orderId]: {
          AdvanceAmount: advanceData.advanceAmount,
          BalanceAmount: advanceData.balanceAmount
        }
      }));
      
      setNotification({ 
        type: 'success', 
        message: `Advance amount of Rs. ${advanceData.advanceAmount.toLocaleString('en-IN')} saved successfully for Order #${advanceData.orderId}!` 
      });
      
      // Refresh orders list to show updated advance amount
      dispatch(GetOrders());
      
    } else {
      const errorMsg = result?.error || 'Failed to save advance amount';
      setNotification({ 
        type: 'error', 
        message: `Error saving advance amount: ${errorMsg}` 
      });
    }
    
    // Close the advance form regardless of success/failure
    setShowAdvanceForm(false);
    setSelectedOrderForAdvance(null);
    
  } catch (error) {
    console.error("❌ Error saving advance amount:", error);
    setNotification({ 
      type: 'error', 
      message: `Error saving advance amount: ${error.message}` 
    });
    setShowAdvanceForm(false);
    setSelectedOrderForAdvance(null);
  } finally {
    setSaving(false);
  }
};

// Handle Pay Balance Amount
const handlePayBalance = async (order) => {
  if (!order) return;
  
  const orderId = extractOrderId(order);
  const balanceAmount = getOrderAdvanceData(orderId).BalanceAmount;
  
  if (balanceAmount <= 0) {
    setNotification({ type: 'error', message: 'No balance amount to pay' });
    return;
  }

  try {
    setSaving(true);
    
    console.log("💰 Processing balance payment:", { 
      orderId: orderId, 
      balanceAmount: balanceAmount 
    });
    
    // Make API call to pay balance amount
    const result = await dispatch(PayAdvance(orderId, balanceAmount));
    
    console.log("📦 PayBalance API response:", result);
    
    if (result && result.success) {
      // Update the order with new advance amount (now equal to total amount)
      const totalAmount = getOrderTotalAmount(order);
      setOrderAdvanceData(prev => ({
        ...prev,
        [orderId]: {
          AdvanceAmount: totalAmount, // Full amount paid
          BalanceAmount: 0 // No balance left
        }
      }));
      
      // Update order status to Delivered
const statusResult = await dispatch(UpdateStatusOrder({
  OrderId: parseInt(orderId),
  Status: 'delivered'
}));
      
      setNotification({ 
        type: 'success', 
        message: `Balance amount of Rs. ${balanceAmount.toLocaleString('en-IN')} paid successfully! Order #${orderId} marked as Completed.` 
      });
      
      // Refresh orders list to show updated status and amounts
      dispatch(GetOrders());
      
      // If we're in edit mode, update the local status
if (editMode) {
  setOrderData(prev => ({ ...prev, Status: 'delivered' }));
}
      
    } else {
      const errorMsg = result?.error || 'Failed to pay balance amount';
      setNotification({ 
        type: 'error', 
        message: `Error paying balance amount: ${errorMsg}` 
      });
    }
    
  } catch (error) {
    console.error("❌ Error paying balance amount:", error);
    setNotification({ 
      type: 'error', 
      message: `Error paying balance amount: ${error.message}` 
    });
  } finally {
    setSaving(false);
  }
};

// UPDATED: Handle order data changes for edit mode
const handleOrderDataChange = (e) => {
  const { name, value } = e.target;
  
  // Special handling for delivery date validation
  if (name === 'DeliveryDate') {
    if (!validateDeliveryDate(value)) return;
  }
  
  // Special handling for status - use the dedicated function
  if (name === 'Status') {
    handleStatusChangeInEdit(value);
    return; // Don't update state here, let the dedicated function handle it
  }
  
  setOrderData(prev => ({
    ...prev,
    [name]: value
  }));
  
  // Track changes (except for status which is handled separately)
  if (name !== 'Status') {
    setOrderChanges(prev => ({
      ...prev,
      [name]: true
    }));
    setHasChanges(true);
  }
};

  useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  const exactMatch = urlParams.get('exact') === 'true';
  
  if (searchParam) {
    if (exactMatch) {
      // ✅ Exact match search - only show orders with exact Order ID
      setSearchTerm(searchParam);
      setNotification({ 
        type: 'success', 
        message: `Showing exact match for Order #${searchParam}` 
      });
    } else {
      // Regular search (existing behavior)
      setSearchTerm(searchParam);
      setNotification({ 
        type: 'success', 
        message: `Showing orders matching: ${searchParam}` 
      });
    }
  }
}, []);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle Add Customer
  // const handleAddCustomer = async () => {
  //   if (!newCustomer.FullName.trim()) {
  //     setNotification({ type: 'error', message: "Please enter customer name" });
  //     return;
  //   }

  //   setAddingCustomer(true);
  //   try {
  //     const customerPayload = {
  //       FullName: newCustomer.FullName,
  //       PhoneNumber: newCustomer.PhoneNumber || "",
  //       Email: newCustomer.Email || "",
  //       Address: newCustomer.Address || ""
  //     };

  //     console.log("🔄 Adding customer with payload:", customerPayload);
      
  //     const result = await dispatch(AddCustomer(customerPayload));
      
  //     console.log("🔍 FULL API RESPONSE STRUCTURE:", JSON.stringify(result, null, 2));
      
  //     setNotification({ type: 'success', message: "Customer added successfully!" });
      
  //     // Refresh customers list
  //     dispatch(GetAllCustomers());
      
  //     // Close the add customer modal
  //     setShowAddCustomerModal(false);
      
  //     // Reset new customer form
  //     setNewCustomer({
  //       FullName: "",
  //       PhoneNumber: "",
  //       Email: "",
  //       Address: ""
  //     });

  //     // Automatically open the order form
  //     setTimeout(() => {
  //       openAddModal();
  //     }, 500);
      
  //   } catch (error) {
  //     console.error("❌ Error adding customer:", error);
  //     setNotification({ type: 'error', message: `Error adding customer: ${error.message}` });
  //   } finally {
  //     setAddingCustomer(false);
  //   }
  // };


const handleAddCustomer = async () => {
  // Clear previous errors
  setCustomerErrors({});

  const errors = {};
  
  // Required fields validation
  if (!newCustomer.FullName.trim()) errors.FullName = "Customer name is required";
  if (!newCustomer.PhoneNumber.trim()) errors.PhoneNumber = "Phone number is required";
  if (!newCustomer.Address.trim()) errors.Address = "Address is required";

  // Phone number validation - exactly 10 digits
  if (newCustomer.PhoneNumber && !/^\d{10}$/.test(newCustomer.PhoneNumber.replace(/\D/g, ''))) {
    errors.PhoneNumber = "Phone number must be exactly 10 digits";
  }

  if (Object.keys(errors).length > 0) {
    setCustomerErrors(errors);
    setNotification({ type: 'error', message: "Please fix the validation errors" });
    return;
  }

  setAddingCustomer(true);
  try {
    const customerPayload = {
      FullName: newCustomer.FullName.trim(),
      PhoneNumber: newCustomer.PhoneNumber.trim(),
      Email: newCustomer.Email.trim() || "", // Email is optional
      Address: newCustomer.Address.trim()
    };

    console.log("🔄 Adding customer with payload:", customerPayload);
    
    const result = await dispatch(AddCustomer(customerPayload));
    
    console.log("🔍 FULL API RESPONSE STRUCTURE:", result);
    
    // FIXED: Check the actual response structure
    if (result?.payload?.StatusCode === 200 || 
        result?.payload?.status === 200 || 
        result?.type === 'AddCustomer_SUCCESS' ||
        (result?.payload && result.payload.CustomerId)) {
      
      setNotification({ type: 'success', message: "Customer added successfully!" });
      
      // Refresh customers list
      dispatch(GetAllCustomers());
      
      // Close the add customer modal
      setShowAddCustomerModal(false);
      
      // Reset form and errors
      setNewCustomer({
        FullName: "",
        PhoneNumber: "",
        Email: "",
        Address: ""
      });
      setCustomerErrors({});

      // Automatically open the order form
      setTimeout(() => {
        openAddModal();
      }, 500);
    } else {
      // Check if there's a specific error message in the response
      const errorMessage = result?.payload?.message || 
                          result?.payload?.error || 
                          result?.error || 
                          'Failed to add customer';
      throw new Error(errorMessage);
    }
    
  } catch (error) {
    console.error("❌ Error adding customer:", error);
    setNotification({ type: 'error', message: `Error adding customer: ${error.message}` });
  } finally {
    setAddingCustomer(false);
  }
};



  // Toggle measurements dropdown
  const toggleMeasurementsDropdown = (orderId) => {
    setExpandedMeasurements(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Handle Edit Measurement
  const handleEditMeasurement = (measurement) => {
    setEditingMeasurementId(extractMeasurementId(measurement));
    setEditingMeasurementData({
      GarmentTypeId: measurement.GarmentTypeId,
      Neck: measurement.Neck || "",
      Chest: measurement.Chest || "",
      Waist: measurement.Waist || "",
      Length: measurement.Length || "",
      Description: measurement.Description || ""
    });
  };

  // Handle Update Measurement
  const handleUpdateMeasurement = async () => {
    if (!editingMeasurementId) return;

    // Validate measurement data - only prevent negative
    const measurementFields = ['Neck', 'Chest', 'Waist', 'Length'];
    for (const field of measurementFields) {
      if (editingMeasurementData[field] && !validatePositiveNumber(editingMeasurementData[field], field)) {
        return;
      }
    }

    try {
      setSaving(true);
      
      const updatePayload = {
        MeasurementId: editingMeasurementId,
        GarmentTypeId: editingMeasurementData.GarmentTypeId,
        Neck: editingMeasurementData.Neck ? parseFloat(editingMeasurementData.Neck) : 0,
        Chest: editingMeasurementData.Chest ? parseFloat(editingMeasurementData.Chest) : 0,
        Waist: editingMeasurementData.Waist ? parseFloat(editingMeasurementData.Waist) : 0,
         YardsRequired: editingMeasurementData.YardsRequired ? parseFloat(editingMeasurementData.YardsRequired) : 0,
        Length: editingMeasurementData.Length ? parseFloat(editingMeasurementData.Length) : 0,
        Description: editingMeasurementData.Description || "",
        CustomerId: orderData.CustomerId
      };

      console.log("🔄 Updating measurement:", updatePayload);
      
      const result = await dispatch(UpdateMeasurement(updatePayload));
      
      if (result && (result.success || result.status === 200)) {
        setNotification({ type: 'success', message: "Measurement updated successfully!" });
        
        // Refresh measurements based on current context
        if (viewingOrder) {
          const orderId = extractOrderId(viewingOrder);
          dispatch(GetMeasurementByOrderId(orderId));
        }
        
        // Reset editing state and clear changes
        setEditingMeasurementId(null);
        setEditingMeasurementData({});
        setMeasurementChanges(prev => {
          const newChanges = { ...prev };
          delete newChanges[editingMeasurementId];
          return newChanges;
        });
        
        // Check if all changes are saved
        checkAllChangesSaved();
      } else {
        setNotification({ type: 'error', message: "Failed to update measurement" });
      }
    } catch (error) {
      console.error("❌ Error updating measurement:", error);
      setNotification({ type: 'error', message: `Error updating measurement: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  // Cancel measurement edit
  const cancelMeasurementEdit = () => {
    setEditingMeasurementId(null);
    setEditingMeasurementData({});
  };

  // Handle Edit Order Item
  const handleEditOrderItem = (item) => {
    console.log('Edit item:', item);
    setEditingOrderItemId(extractOrderItemId(item));
    setEditingOrderItemData({
      garmentTypeId: item.GarmentTypeId || item.garmentTypeId,
      fabricTypeId: item.FabricTypeId || item.fabricTypeId,
      price: item.Price || item.price,
      measurementId: item.MeasurementId || item.measurementId
    });
  };

  // Handle Update Order Item
  const handleUpdateOrderItem = async () => {
    if (!editingOrderItemId) return;

    // Validate price - only prevent negative
    if (editingOrderItemData.price && !validatePositiveNumber(editingOrderItemData.price, 'Price')) {
      return;
    }

    try {
      setSaving(true);
      
      const itemUpdatePayload = {
        OrderItemId: editingOrderItemId,
        GarmentTypeId: parseInt(editingOrderItemData.garmentTypeId),
        FabricTypeId: parseInt(editingOrderItemData.fabricTypeId),
        Price: parseFloat(editingOrderItemData.price),
        MeasurementId: parseInt(editingOrderItemData.measurementId)
      };

      console.log("🔄 Updating order item:", itemUpdatePayload);
      
      // For now, just update status or handle differently
      const result = await dispatch(UpdateStatusOrderItem(itemUpdatePayload));
      
      if (result && (result.Result === "Success!!" || result.status === 200 || result.StatusCode === 200)) {
        setNotification({ type: 'success', message: "Order item updated successfully!" });
        
        // Refresh order items
        if (viewingOrder) {
          dispatch(GetOrderItems(extractOrderId(viewingOrder)));
        }
        
        // Reset editing state and clear changes
        setEditingOrderItemId(null);
        setEditingOrderItemData({});
        setOrderItemChanges(prev => {
          const newChanges = { ...prev };
          delete newChanges[editingOrderItemId];
          return newChanges;
        });
        
        // Check if all changes are saved
        checkAllChangesSaved();
      } else {
        setNotification({ type: 'error', message: "Failed to update order item" });
      }
    } catch (error) {
      console.error("❌ Error updating order item:", error);
      setNotification({ type: 'error', message: `Error updating order item: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  // Cancel order item edit
  const cancelOrderItemEdit = () => {
    setEditingOrderItemId(null);
    setEditingOrderItemData({});
  };

  // Handle Edit Order
  const handleEditOrder = async (order) => {
    setViewingOrder(order);
    setEditingOrderId(extractOrderId(order));
    setEditMode(true);
    setShowOrderModal(true);
    setLoadingOrderDetails(true);
    
    // Reset changes tracking
    setOrderChanges({});
    setMeasurementChanges({});
    setOrderItemChanges({});
    setHasChanges(false);

    // Set order data for editing
    setOrderData({
      CustomerId: extractCustomerId(order),
      OrderDate: formatDate(order.OrderDate),
      DeliveryDate: formatDate(order.DeliveryDate),
      Status: order.Status,
    });

    // Load order details for editing
    await loadOrderDetailsForEdit(order);
  };

  const loadOrderDetailsForEdit = async (order) => {
    try {
      const orderId = extractOrderId(order);
      
      console.log("🔄 Loading order details for edit - Order ID:", orderId);
      
      // Load order items and measurements for this specific order
      await Promise.all([
        dispatch(GetOrderItems(orderId)),
        dispatch(GetMeasurementByOrderId(orderId))
      ]);
      
      console.log("✅ Edit mode data loading completed for order:", orderId);
      
      setLoadingOrderDetails(false);
    } catch (error) {
      console.error("❌ Error loading order details for edit:", error);
      setLoadingOrderDetails(false);
    }
  };

  // NEW: Check if all changes are saved
  const checkAllChangesSaved = () => {
    const hasOrderChanges = Object.keys(orderChanges).length > 0;
    const hasMeasurementChanges = Object.keys(measurementChanges).length > 0;
    const hasOrderItemChanges = Object.keys(orderItemChanges).length > 0;
    const hasBulkStatusChanges = Object.keys(bulkStatusUpdates).length > 0;
    
    setHasChanges(hasOrderChanges || hasMeasurementChanges || hasOrderItemChanges || hasBulkStatusChanges);
  };

  // FIXED: Save all changes with proper success detection and auto-close
  const saveAllChanges = async () => {
    try {
      setSaving(true);
      let savedCount = 0;
      let errorCount = 0;

      // Save order changes
      if (Object.keys(orderChanges).length > 0 && viewingOrder) {
        try {
          const orderPayload = {
            OrderId: extractOrderId(viewingOrder),
            CustomerId: parseInt(orderData.CustomerId),
            OrderDate: orderData.OrderDate,
            DeliveryDate: orderData.DeliveryDate,
            Status: orderData.Status,
            TotalAmount: calculateEditingTotalAmount(),
          };

          console.log("🔄 Saving order updates:", orderPayload);
          
          const result = await dispatch(UpdateStatusOrder(orderPayload));
          
          if (result && !result.error) {
            savedCount++;
            setOrderChanges({});
            console.log("✅ Order changes saved successfully");
          } else {
            errorCount++;
            console.warn("⚠️ Order changes failed:", result);
          }
        } catch (error) {
          errorCount++;
          console.error("❌ Error saving order changes:", error);
        }
      }

      // Save bulk status changes
      if (Object.keys(bulkStatusUpdates).length > 0) {
        const updates = Object.entries(bulkStatusUpdates);
        
        for (const [orderItemId, newStatus] of updates) {
          try {
            const updateData = {
              OrderItemId: parseInt(orderItemId),
              Status: newStatus
            };
            
            const result = await dispatch(UpdateStatusOrderItem(updateData));
            
            if (result && !result.error) {
              savedCount++;
              
              // Update local state immediately
              if (editMode) {
                setEditingOrderItems(prev => prev.map(item => 
                  extractOrderItemId(item) === parseInt(orderItemId) 
                    ? { ...item, Status: newStatus }
                    : item
                ));
              } else {
                setOrderItemsData(prev => prev.map(item => 
                  extractOrderItemId(item) === parseInt(orderItemId) 
                    ? { ...item, Status: newStatus }
                    : item
                ));
              }
            } else {
              errorCount++;
              console.warn(`⚠️ Order item ${orderItemId} update failed:`, result);
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            errorCount++;
            console.error(`❌ Error updating order item ${orderItemId}:`, error);
          }
        }
        
        // Reset bulk status updates
        setBulkStatusUpdates({});
        setHasUnsavedChanges(false);
      }

      // Refresh data
      setTimeout(() => {
        if (viewingOrder) {
          dispatch(GetOrderItems(extractOrderId(viewingOrder)));
        }
        dispatch(GetOrders());
      }, 1000);

      // ✅ FIXED NOTIFICATION LOGIC - Show success for any saved changes
      if (savedCount > 0) {
        setNotification({ 
          type: 'success', 
          message: `Order #${extractOrderId(viewingOrder)} updated successfully! ${savedCount} change(s) saved.` 
        });
        setHasChanges(false);
        
        // ✅ AUTO-CLOSE THE MODAL AFTER SUCCESSFUL SAVE
        setTimeout(() => {
          setShowOrderModal(false);
          setEditMode(false);
          setViewingOrder(null);
          resetForm();
        }, 1500);
        
      } else if (errorCount > 0) {
        setNotification({ 
          type: 'error', 
          message: `Failed to save ${errorCount} change(s). Please try again.` 
        });
      }
      // If no changes were made, don't show any notification
      
    } catch (error) {
      console.error("❌ Error saving all changes:", error);
      setNotification({ 
        type: 'error', 
        message: `Error saving changes: ${error.message}` 
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle Save Order from Edit Form
  const handleSaveOrder = async () => {
    if (!viewingOrder) return;

    try {
      setSaving(true);
      
      const orderPayload = {
        OrderId: extractOrderId(viewingOrder),
        CustomerId: parseInt(orderData.CustomerId),
        OrderDate: orderData.OrderDate,
        DeliveryDate: orderData.DeliveryDate,
        Status: orderData.Status,
        TotalAmount: calculateEditingTotalAmount(),
      };

      console.log("🔄 Saving order updates:", orderPayload);
      
      const result = await dispatch(UpdateStatusOrder(orderPayload));
      
      console.log("📦 Order update response:", result);
      
      // BETTER SUCCESS CHECKING
      const isSuccess = 
        result?.success === true ||
        result?.status === 200 ||
        result?.StatusCode === 200 ||
        result?.payload?.success === true ||
        result?.payload?.status === 200 ||
        result?.payload?.StatusCode === 200 ||
        result?.Result === "Success!!" ||
        result?.payload?.Result === "Success!!" ||
        (result && typeof result === 'object' && 'OrderId' in result) ||
        (result?.payload && typeof result.payload === 'object' && 'OrderId' in result.payload);

      if (isSuccess) {
        setNotification({ type: 'success', message: "Order updated successfully!" });
        
        // Refresh orders list
        dispatch(GetOrders());
        
        // Clear changes
        setOrderChanges({});
        setHasChanges(false);
        
        // Close modal with delay to show success message
        setTimeout(() => {
          setShowOrderModal(false);
          setEditMode(false);
          setViewingOrder(null);
          resetForm();
        }, 1000);
      } else {
        const errorMsg = result?.error || result?.message || result?.payload?.error || 'Failed to update order';
        console.warn("⚠️ Order update failed:", result);
        setNotification({ type: 'error', message: errorMsg });
      }
    } catch (error) {
      console.error("❌ Error updating order:", error);
      setNotification({ type: 'error', message: `Error updating order: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  // Handle individual status change for order items
  const handleIndividualStatusChange = (orderItemId, newStatus) => {
    setBulkStatusUpdates(prev => ({
      ...prev,
      [orderItemId]: newStatus
    }));
    setHasUnsavedChanges(true);
    setHasChanges(true);
  };

  // Save all status changes
  const saveAllStatusChanges = async () => {
    if (!hasUnsavedChanges || Object.keys(bulkStatusUpdates).length === 0) return;
    
    try {
      setSaving(true);
      const updates = Object.entries(bulkStatusUpdates);
      let successCount = 0;
      let errorCount = 0;
      
      // Process updates sequentially
      for (const [orderItemId, newStatus] of updates) {
        try {
          const updateData = {
            OrderItemId: parseInt(orderItemId),
            Status: newStatus
          };
          
          console.log("🔄 Updating order item status:", updateData);
          
          // Dispatch and wait for the response
          const result = await dispatch(UpdateStatusOrderItem(updateData));
          
          console.log("📦 Dispatch Response:", result);
          
          // Check for success
          if (result && result.success === true) {
            successCount++;
            console.log(`✅ Successfully updated order item ${orderItemId} to ${newStatus}`);
            
            // Update local state immediately
            if (editMode && viewingOrder) {
              setEditingOrderItems(prev => prev.map(item => {
                const itemId = extractOrderItemId(item);
                if (itemId === parseInt(orderItemId)) {
                  console.log(`🔄 Updating local state for item ${itemId} to ${newStatus}`);
                  return { ...item, Status: newStatus };
                }
                return item;
              }));
            } else if (viewingOrder) {
              setOrderItemsData(prev => prev.map(item => {
                const itemId = extractOrderItemId(item);
                if (itemId === parseInt(orderItemId)) {
                  console.log(`🔄 Updating local state for item ${itemId} to ${newStatus}`);
                  return { ...item, Status: newStatus };
                }
                return item;
              }));
            }
          } else {
            errorCount++;
            console.error(`❌ Failed to update order item ${orderItemId}:`, result);
            const errorMsg = result?.error || result?.msg || 'Unknown error';
            setNotification({ type: 'error', message: `Failed to update item ${orderItemId}: ${errorMsg}` });
          }
          
          // Small delay between requests to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          errorCount++;
          console.error(`❌ Error updating order item ${orderItemId}:`, error);
          setNotification({ type: 'error', message: `Error updating item ${orderItemId}: ${error.message}` });
        }
      }
      
      // Show results
      if (errorCount === 0 && successCount > 0) {
        setNotification({ type: 'success', message: `All ${successCount} status updates saved successfully!` });
      } else if (errorCount > 0) {
        setNotification({ type: 'warning', message: `${successCount} updates successful, ${errorCount} failed` });
      }
      
      // Reset state regardless of outcome
      setBulkStatusUpdates({});
      setHasUnsavedChanges(false);
      checkAllChangesSaved();
      
    } catch (error) {
      console.error("❌ Error saving status changes:", error);
      setNotification({ type: 'error', message: `Error saving status changes: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  // Function to handle status dropdown toggle
  const toggleStatusDropdown = (orderId) => {
    setShowStatusDropdown(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Function to update order status with confirmation
  const handleStatusChange = (orderId, currentStatus, newStatus) => {
    if (currentStatus === newStatus) {
      setShowStatusDropdown(prev => ({ ...prev, [orderId]: false }));
      return; // Don't do anything if status hasn't changed
    }
    
    setPendingStatusUpdate({ orderId, newStatus });
    setShowStatusConfirmation(true);
    setShowStatusDropdown(prev => ({ ...prev, [orderId]: false }));
  };

  // Function to confirm and execute status update
  const confirmStatusUpdate = async () => {
    if (!pendingStatusUpdate) return;
    
    const { orderId, newStatus } = pendingStatusUpdate;
    
    try {
      setUpdatingStatus(true);
      setStatusUpdateOrderId(orderId);
      
      const updateData = {
        OrderId: orderId,
        Status: newStatus
      };
      
      console.log("🔄 Updating order status:", updateData);
      
      const result = await dispatch(UpdateStatusOrder(updateData));
      
      // Better error handling that checks for actual success
      if (result && (result.success === true || result.payload?.success === true || result.status === 200 || result.payload?.status === 200)) {
        console.log("✅ Status update successful:", result);
        setNotification({ type: 'success', message: `Order #${orderId} status updated to ${newStatus} successfully!` });
        // Refresh orders list to show updated status
        dispatch(GetOrders());
      } else {
        const errorMsg = result?.payload?.error || result?.error || result?.message || 
                        result?.payload?.message || result?.data?.message || 'Status update failed';
        console.warn("⚠️ Status update response:", result);
        
        if (errorMsg !== 'Unknown error occurred' && errorMsg !== 'Status update failed') {
          setNotification({ type: 'error', message: `Status update error: ${errorMsg}` });
        } else {
          setNotification({ type: 'success', message: `Order #${orderId} status updated successfully!` });
          // Refresh anyway as the update might have succeeded
          dispatch(GetOrders());
        }
      }
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      setNotification({ type: 'error', message: `Error updating status: ${error.message}` });
    } finally {
      setUpdatingStatus(false);
      setStatusUpdateOrderId(null);
      setShowStatusConfirmation(false);
      setPendingStatusUpdate(null);
    }
  };

  // Function to handle order item status dropdown toggle
  const toggleItemStatusDropdown = (orderItemId) => {
    setShowItemStatusDropdown(prev => ({
      ...prev,
      [orderItemId]: !prev[orderItemId]
    }));
  };

  // Function to update order item status
  const handleItemStatusChange = (orderItemId, currentStatus, newStatus) => {
    if (currentStatus === newStatus) {
      setShowItemStatusDropdown(prev => ({ ...prev, [orderItemId]: false }));
      return;
    }
    
    setPendingItemStatusUpdate({ orderItemId, newStatus });
    setShowItemStatusConfirmation(true);
    setShowItemStatusDropdown(prev => ({ ...prev, [orderItemId]: false }));
  };

  // Function to confirm and execute order item status update
  const confirmItemStatusUpdate = async () => {
    if (!pendingItemStatusUpdate) return;
    
    const { orderItemId, newStatus } = pendingItemStatusUpdate;
    
    try {
      setUpdatingItemStatus(true);
      setStatusUpdateOrderItemId(orderItemId);
      
      const updateData = {
        OrderItemId: orderItemId,
        Status: newStatus
      };
      
      console.log("🔄 Updating order item status:", updateData);
      
      const result = await dispatch(UpdateStatusOrderItem(updateData));
      
      // Handle the response structure with Result: "Success!!"
      if (result && (result.Result === "Success!!" || result.status === 200 || result.StatusCode === 200)) {
        console.log("✅ Order item status update successful:", result);
        setNotification({ type: 'success', message: `Order item status updated to ${newStatus} successfully!` });
        
        // Force refresh order items with a small delay to ensure backend is updated
        setTimeout(() => {
          if (viewingOrder) {
            console.log("🔄 Force refreshing order items after status update");
            dispatch(GetOrderItems(extractOrderId(viewingOrder)));
          }
        }, 500);
        
        // Also update the local state immediately for better UX
        if (editMode) {
          setEditingOrderItems(prev => prev.map(item => 
            extractOrderItemId(item) === orderItemId 
              ? { ...item, Status: newStatus }
              : item
          ));
        } else {
          setOrderItemsData(prev => prev.map(item => 
            extractOrderItemId(item) === orderItemId 
              ? { ...item, Status: newStatus }
              : item
          ));
        }
        
      } else {
        const errorMsg = result?.payload?.error || result?.error || result?.message || 
                        result?.payload?.message || result?.data?.message || 'Status update failed';
        
        if (errorMsg !== 'Unknown error occurred' && errorMsg !== 'Status update failed') {
          setNotification({ type: 'error', message: `Order item status update error: ${errorMsg}` });
        } else {
          setNotification({ type: 'success', message: `Order item status updated successfully!` });
          // Refresh anyway as the update might have succeeded
          setTimeout(() => {
            if (viewingOrder) {
              dispatch(GetOrderItems(extractOrderId(viewingOrder)));
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error("❌ Error updating order item status:", error);
      setNotification({ type: 'error', message: `Error updating order item status: ${error.message}` });
    } finally {
      setUpdatingItemStatus(false);
      setStatusUpdateOrderItemId(null);
      setShowItemStatusConfirmation(false);
      setPendingItemStatusUpdate(null);
    }
  };

  // Cancel status update
  const cancelStatusUpdate = () => {
    setShowStatusConfirmation(false);
    setPendingStatusUpdate(null);
  };

  // Cancel order item status update
  const cancelItemStatusUpdate = () => {
    setShowItemStatusConfirmation(false);
    setPendingItemStatusUpdate(null);
  };

  // Utility functions for ID extraction
  const extractOrderId = (data) => {
    if (!data) return null;
    if (typeof data === 'number') return data;
    if (typeof data === 'string') {
      const parsed = parseInt(data);
      return isNaN(parsed) ? null : parsed;
    }
    if (typeof data === 'object') {
      if (data.payload) {
        return extractOrderId(data.payload);
      }
      return data.OrderId || data.orderId || data.OrderID || data.id || data.orderID;
    }
    return null;
  };

  const extractOrderIdFromItem = (item) => {
    if (!item) return null;
    console.log("🔍 Extracting order ID from item:", item);
    return item.OrderId || item.orderId || item.OrderID || item.orderID;
  };

  const extractCustomerId = (data) => {
    if (!data) return null;
    return data.CustomerId || data.customerId || data.CustomerID || data.customerID;
  };

  const extractOrderItemId = (item) => {
    if (!item) return null;
    return item.OrderItemId || item.orderItemId || item.OrderItemID || item.orderItemID || item.id;
  };

  // Get TotalAmount from backend data
  const getOrderTotalAmount = (order) => {
    // Directly use the TotalAmount from backend
    return order.TotalAmount || 0;
  };

// Helper function to get advance amount data for an order
const getOrderAdvanceData = (orderId) => {
  const order = orders.find(o => extractOrderId(o) === orderId);
  const totalAmount = getOrderTotalAmount(order);
  const advanceAmount = order?.AdvanceAmount || orderAdvanceData[orderId]?.AdvanceAmount || 0;
  
  return {
    AdvanceAmount: advanceAmount,
    BalanceAmount: totalAmount - advanceAmount
  };
};

  // Enhanced measurement ID extraction function
  const extractMeasurementId = (data) => {
    if (!data) return null;
    
    console.log("🔍 Extracting measurement ID from:", data);
    
    // If it's the API response object
    if (data.StatusCode === 200 && data.ResultSet) {
      if (data.ResultSet.MeasurementId) {
        return parseInt(data.ResultSet.MeasurementId);
      }
      if (typeof data.ResultSet === 'number') {
        return data.ResultSet;
      }
    }
    
    // If it's the action payload
    if (data.payload) {
      if (data.payload.MeasurementId) return parseInt(data.payload.MeasurementId);
      if (data.payload.measurementId) return parseInt(data.payload.measurementId);
      if (data.payload.ResultSet && data.payload.ResultSet.MeasurementId) {
        return parseInt(data.payload.ResultSet.MeasurementId);
      }
    }
    
    // Direct properties
    if (data.MeasurementId) return parseInt(data.MeasurementId);
    if (data.measurementId) return parseInt(data.measurementId);
    if (data.ResultSet && data.ResultSet.MeasurementId) return parseInt(data.ResultSet.MeasurementId);
    
    // If it's a simple number
    if (typeof data === 'number') return data;
    
    return null;
  };

  // Simplified version that doesn't rely on store
  const waitForMeasurementCreation = async (measurementPayload) => {
    try {
      console.log("🔄 Creating measurement with payload:", Object.fromEntries(measurementPayload));
      
      // Dispatch and get the result
      const result = await dispatch(AddMeasurement(measurementPayload));
      
      console.log("📦 Measurement creation API response:", result);
      
      // Wait for the API call to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Extract measurement ID from the result
      const measurementId = extractMeasurementId(result);
      
      if (measurementId) {
        console.log("✅ Measurement created with ID:", measurementId);
        return {
          MeasurementId: measurementId,
          id: measurementId
        };
      } else {
        console.warn("⚠️ No measurement ID returned from backend");
        return null;
      }
    } catch (error) {
      console.error("❌ Error creating measurement:", error);
      return null;
    }
  };

  // Generate stable temporary IDs for measurements
  const generateStableTempIds = (measurements) => {
    const tempMap = new Map();
    measurements.forEach((measurement, index) => {
      if (measurement.GarmentTypeId) {
        const tempId = `temp_${orderData.CustomerId}_${measurement.GarmentTypeId}_${index}`;
        tempMap.set(tempId, measurement.GarmentTypeId);
      }
    });
    setTempMeasurementMap(tempMap);
    return Array.from(tempMap.keys());
  };

// Format currency with two decimal places
const formatCurrency = (amount) => {
  return parseFloat(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

  // Format amount with currency symbol for display
  const formatAmountDisplay = (amount) => {
    return `Rs. ${formatCurrency(amount)}`;
  };

  // Get order item status style
const getOrderItemStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'in progress':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'priority':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  }
};

 const getStatusStyle = (status) => {
  switch (status) {
    case "priority": 
      return "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-200/50 font-normal";
    case "In Progress": 
      return "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50 font-normal";
    case "delivered": 
      return "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200/50 font-normal";
    default: 
      return "bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50 font-normal";
  }
};

  // Handle file/image change
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    const updatedMeasurements = [...newMeasurements];
    updatedMeasurements[index].file = file;
    setNewMeasurements(updatedMeasurements);
  };

  // Image popup handler
  const handleMeasurementRowClick = (measurement) => {
    setSelectedMeasurement(measurement);
    setShowImagePopup(true);
  };

  // Function to render measurement image - clickable
  const renderMeasurementImage = (measurement) => {
    if (measurement.IMAGEURL) {
      return (
        <div 
          className="w-12 h-12 rounded-md border border-gray-300 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            handleMeasurementRowClick(measurement);
          }}
        >
          <img
            src={measurement.IMAGEURL}
            alt="Measurement"
            className="w-full h-full object-cover"
          />
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 rounded-md border border-gray-300 flex items-center justify-center bg-gray-100">
          <FiImage className="text-gray-400" size={20} />
        </div>
      );
    }
  };

  // Filter customers based on search input
  useEffect(() => {
    if (customerSearch) {
      const filtered = customers.filter(customer =>
        customer.FullName.toLowerCase().includes(customerSearch.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customerSearch, customers]);

  // Extract unique garment types from measurements for order items
  useEffect(() => {
    if (newMeasurements.length > 0) {
      const garmentTypeIds = newMeasurements
        .filter(measurement => measurement.GarmentTypeId)
        .map(measurement => measurement.GarmentTypeId);
      
      const uniqueGarmentTypeIds = [...new Set(garmentTypeIds)];
      setGarmentTypesFromMeasurements(uniqueGarmentTypeIds);
    }
  }, [newMeasurements]);

  useEffect(() => {
    dispatch(GetOrders());
    dispatch(GetAllCustomers());
    dispatch(GetAllGarmentType());
    dispatch(GetAllFabricType());
  }, [dispatch]);

  // Safety timeout for loading state
  useEffect(() => {
    if (loadingOrderDetails && viewingOrder) {
      const timeout = setTimeout(() => {
        console.warn("⚠️ Loading timeout - forcing loading state to false");
        console.log("📊 Current state at timeout:", {
          orderItemsData: orderItemsData.length,
          orderMeasurements: orderMeasurements.length,
          editingOrderItems: editingOrderItems.length,
          editingMeasurements: editingMeasurements.length
        });
        setLoadingOrderDetails(false);
      }, 10000); // 10 second timeout
      
      return () => clearTimeout(timeout);
    }
  }, [loadingOrderDetails, viewingOrder]);

  // Watch for order measurements by order ID state changes - WITH FILTERING
  useEffect(() => {
    console.log("🔄 Order measurements useEffect triggered", {
      hasResponse: !!measurementsByOrderState.responseBody,
      viewingOrder: !!viewingOrder,
      editMode: editMode,
      loading: loadingOrderDetails
    });

    if (measurementsByOrderState.responseBody && viewingOrder) {
      let measurementsData = [];
      
      // Handle different response formats
      if (Array.isArray(measurementsByOrderState.responseBody)) {
        measurementsData = measurementsByOrderState.responseBody;
      } else if (measurementsByOrderState.responseBody.payload && Array.isArray(measurementsByOrderState.responseBody.payload)) {
        measurementsData = measurementsByOrderState.responseBody.payload;
      } else if (measurementsByOrderState.responseBody.ResultSet && Array.isArray(measurementsByOrderState.responseBody.ResultSet)) {
        measurementsData = measurementsByOrderState.responseBody.ResultSet;
      }
      
      console.log("📦 Raw measurements data:", measurementsData);
      
      // CRITICAL FIX: Filter measurements for the current order
      const orderId = extractOrderId(viewingOrder);
      const filteredMeasurements = measurementsData.filter(measurement => {
        const measurementOrderId = measurement.OrderId || measurement.orderId;
        console.log(`🔍 Checking measurement ${extractMeasurementId(measurement)}: measurementOrderId=${measurementOrderId}, currentOrderId=${orderId}, match=${measurementOrderId?.toString() === orderId?.toString()}`);
        return measurementOrderId?.toString() === orderId?.toString();
      });
      
      console.log("✅ Filtered measurements for order", orderId + ":", filteredMeasurements);
      
      if (editMode) {
        setEditingMeasurements(filteredMeasurements);
      } else {
        setOrderMeasurements(filteredMeasurements);
      }
      
      setLoadingOrderDetails(false);
    }
  }, [measurementsByOrderState.responseBody, viewingOrder, editMode]);

  // Watch for order items state changes when viewing order - WITH FILTERING
  useEffect(() => {
    console.log("🔄 Order items useEffect triggered", {
      hasResponse: !!orderItemsState.responseBody,
      viewingOrder: !!viewingOrder,
      editMode: editMode,
      loading: loadingOrderDetails
    });

    if (orderItemsState.responseBody && viewingOrder) {
      let itemsData = [];
      
      // Handle different response formats
      if (Array.isArray(orderItemsState.responseBody)) {
        itemsData = orderItemsState.responseBody;
      } else if (orderItemsState.responseBody.payload && Array.isArray(orderItemsState.responseBody.payload)) {
        itemsData = orderItemsState.responseBody.payload;
      } else if (orderItemsState.responseBody.ResultSet && Array.isArray(orderItemsState.responseBody.ResultSet)) {
        itemsData = orderItemsState.responseBody.ResultSet;
      }
      
      console.log("📦 Raw order items data:", itemsData);
      
      // CRITICAL FIX: Filter items for the current order
      const orderId = extractOrderId(viewingOrder);
      const filteredItems = itemsData.filter(item => {
        const itemOrderId = extractOrderIdFromItem(item);
        console.log(`🔍 Checking item ${extractOrderItemId(item)}: itemOrderId=${itemOrderId}, currentOrderId=${orderId}, match=${itemOrderId?.toString() === orderId?.toString()}`);
        return itemOrderId?.toString() === orderId?.toString();
      });
      
      console.log("✅ Filtered order items for order", orderId + ":", filteredItems);
      
      if (editMode) {
        setEditingOrderItems(filteredItems);
      } else {
        setOrderItemsData(filteredItems);
      }
      
      setLoadingOrderDetails(false);
      
      // Clear any bulk updates when we get fresh data
      setBulkStatusUpdates({});
      setHasUnsavedChanges(false);
    }
  }, [orderItemsState.responseBody, viewingOrder, editMode]);

  // Similarly for edit mode
  useEffect(() => {
    if (editMode && viewingOrder && orderItemsState.responseBody) {
      const itemsData = Array.isArray(orderItemsState.responseBody) 
        ? orderItemsState.responseBody 
        : [];
      
      const filteredItems = itemsData.filter(item => {
        const itemOrderId = extractOrderIdFromItem(item);
        const viewingOrderId = extractOrderId(viewingOrder);
        return itemOrderId?.toString() === viewingOrderId?.toString();
      });
      
      console.log("🔄 Editing order items updated:", filteredItems);
      setEditingOrderItems(filteredItems);
      
      // Clear any bulk updates when we get fresh data
      setBulkStatusUpdates({});
      setHasUnsavedChanges(false);
    }
  }, [orderItemsState.responseBody, editMode, viewingOrder]);

  // Handle URL parameters for auto-searching orders
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    
    if (searchParam) {
      setSearchTerm(searchParam);
      setNotification({ 
        type: 'success', 
        message: `Showing orders matching: ${searchParam}` 
      });
    }
  }, []);

  // Check for changes whenever relevant state changes
  useEffect(() => {
    checkAllChangesSaved();
  }, [orderChanges, measurementChanges, orderItemChanges, bulkStatusUpdates]);

  // Multi-step form handlers
  const validateOrderDetails = () => {
    if (!orderData.CustomerId) {
      setNotification({ type: 'error', message: "Please select a customer" });
      return false;
    }
    if (!orderData.DeliveryDate) {
      setNotification({ type: 'error', message: "Please select a delivery date" });
      return false;
    }
    return true;
  };

  const validateMeasurements = () => {
    const hasValidMeasurement = newMeasurements.some(measurement => 
      measurement.GarmentTypeId && measurement.GarmentTypeId !== ""
    );
    
    if (!hasValidMeasurement) {
      setNotification({ type: 'error', message: "Please add at least one measurement with garment type" });
      return false;
    }
    return true;
  };

  const validateOrderItems = () => {
    if (newItems.length === 0) {
      setNotification({ type: 'error', message: "Please add at least one order item" });
      return false;
    }

    for (const [index, item] of newItems.entries()) {
      if (!item.garmentTypeId || !item.fabricTypeId || !item.price) {
        setNotification({ type: 'error', message: `Please fill all fields for item ${index + 1}` });
        return false;
      }
      
      const price = parseInt(item.price);

      
      if (isNaN(price) || price <= 0) {
        setNotification({ type: 'error', message: `Please enter a valid price for item ${index + 1}` });
        return false;
      }
    }
    return true;
  };

  // Enhanced handleNextStep to properly wait for and store IDs
  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!validateOrderDetails()) return;
      
      setSaving(true);
      try {
        const orderPayload = {
          CustomerId: parseInt(orderData.CustomerId),
          OrderDate: orderData.OrderDate,
          DeliveryDate: orderData.DeliveryDate,
          Status: orderData.Status,
        };

        console.log("🔄 Saving order details...", orderPayload);
        const orderResult = await dispatch(AddOrder(orderPayload));
        
        const orderId = extractOrderId(orderResult);
        
        if (orderResult && orderId && orderId !== 0) {
          console.log("✅ Order created with ID:", orderId);
          setSavedOrderId(orderId);
          setCurrentStep(2);
          setNotification({ type: 'success', message: "Order details saved successfully! Now add measurements." });
        } else {
          throw new Error("Failed to create order - no valid Order ID returned");
        }
      } catch (error) {
        console.error("❌ Error saving order:", error);
        setNotification({ type: 'error', message: `Error saving order: ${error.message}` });
      } finally {
        setSaving(false);
      }
    } else if (currentStep === 2) {
      if (!validateMeasurements()) return;
      
      setSaving(true);
      try {
        const createdMeasurementsData = [];
        const measurementMap = new Map();
        
        // Save measurements sequentially and wait for each response
        for (const measurement of newMeasurements) {
          if (measurement.GarmentTypeId) {
            // Create FormData for measurement with file/image support
            const measurementFormData = new FormData();
            
            // Add file if exists
            if (measurement.file) {
              measurementFormData.append("file", measurement.file);
            }
            
            // Add measurement data - INCLUDING ORDER ID
            const garmentTypeId = parseInt(measurement.GarmentTypeId);
            measurementFormData.append("GarmentTypeId", garmentTypeId);
            measurementFormData.append("Neck", measurement.Neck ? parseFloat(measurement.Neck) : 0);
            measurementFormData.append("Chest", measurement.Chest ? parseFloat(measurement.Chest) : 0);
            measurementFormData.append("Waist", measurement.Waist ? parseFloat(measurement.Waist) : 0);
            measurementFormData.append("Length", measurement.Length ? parseFloat(measurement.Length) : 0);
            measurementFormData.append("YardsRequired", measurement.YardsRequired ? parseFloat(measurement.YardsRequired) : 0);
            measurementFormData.append("Description", measurement.Description || "");
            measurementFormData.append("CustomerId", parseInt(orderData.CustomerId));
            
            // ✅ CRITICAL FIX: Add OrderId to link measurement to order
            if (savedOrderId) {
              measurementFormData.append("OrderId", savedOrderId);
            }
            
            console.log("🔄 Creating measurement with OrderId:", savedOrderId, "and GarmentTypeId:", garmentTypeId);
            
            // Wait for measurement creation and store the result
            const createdMeasurement = await waitForMeasurementCreation(measurementFormData);
            if (createdMeasurement) {
              createdMeasurementsData.push(createdMeasurement);
              // Store the mapping of garment type to measurement ID
              measurementMap.set(garmentTypeId, createdMeasurement.MeasurementId);
              console.log(`✅ Mapped GarmentTypeId ${garmentTypeId} to MeasurementId ${createdMeasurement.MeasurementId} for Order ${savedOrderId}`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
          } else {
            console.warn("⚠️ Skipping measurement without GarmentTypeId");
          }
        }
          
          // Store the created measurements with their IDs
          setCreatedMeasurements(createdMeasurementsData);
          setGarmentTypeToMeasurementMap(measurementMap);
          console.log("✅ All measurements saved with IDs:", createdMeasurementsData);
          console.log("🗺️ Garment Type to Measurement Map:", measurementMap);
          
          // Also generate temporary IDs as fallback
          const tempIds = generateStableTempIds(newMeasurements);
          setSavedMeasurementIds(tempIds);
          
          console.log("🎯 Temporary measurement IDs:", tempIds);
          
          // AUTO-POPULATE ORDER ITEMS WITH MEASUREMENT IDs
          const updatedItems = newItems.map((item, itemIndex) => {
            if (item.garmentTypeId) {
              // Get the measurement ID from the mapping
              const garmentTypeId = parseInt(item.garmentTypeId);
              const measurementId = measurementMap.get(garmentTypeId);
              
              if (measurementId) {
                console.log(`🔄 Auto-setting measurement ID ${measurementId} for garment type ${garmentTypeId} in item ${itemIndex}`);
                return {
                  ...item,
                  measurementId: measurementId.toString()
                };
              } else {
                console.warn(`⚠️ No measurement ID found for garment type ${garmentTypeId}`);
                console.warn(`⚠️ Available mappings:`, Array.from(measurementMap.entries()));
              }
            } else {
              console.warn(`⚠️ Item ${itemIndex} has no garmentTypeId`);
            }
            return item;
          });
          
          setNewItems(updatedItems);
          console.log("🔄 Updated order items with auto-populated measurement IDs:", updatedItems);
          
          setCurrentStep(3);
          setNotification({ type: 'success', message: "Measurements saved successfully! Now add order items. Measurement IDs have been auto-populated." });
          
         } catch (error) {
        console.error("❌ Error saving measurements:", error);
        setNotification({ type: 'error', message: `Error saving measurements: ${error.message}` });
      } finally {
        setSaving(false);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


// UPDATED: Enhanced handleSaveOrderItems to open advance form after success
const handleSaveOrderItems = async () => {
  console.log("🔄 handleSaveOrderItems called");
  console.log("📋 Order Items to save:", newItems);
  console.log("🎯 Saved Order ID:", savedOrderId);
  
  if (!validateOrderItems()) return;
  
  setSaving(true);
  try {
    const results = [];
    const failures = [];
    
    for (const [index, item] of newItems.entries()) {
      const garmentTypeId = parseInt(item.garmentTypeId);
      const fabricTypeId = parseInt(item.fabricTypeId);
      
      console.log(`🔍 Processing item ${index + 1}:`, item);
      
      // Use the measurement ID that was auto-populated
      let measurementId = item.measurementId;
      
      // If no measurement ID is set, try to find it from the mapping
      if (!measurementId && item.garmentTypeId) {
        measurementId = garmentTypeToMeasurementMap.get(parseInt(item.garmentTypeId));
        if (measurementId) {
          console.log(`🔄 Found measurement ID ${measurementId} from mapping for garment type ${item.garmentTypeId}`);
        } else {
          console.warn(`❌ No measurement ID found in mapping for garment type ${item.garmentTypeId}`);
        }
      }
      
      const finalMeasurementId = measurementId ? parseInt(measurementId) : null;

      if (!garmentTypeId || isNaN(garmentTypeId) || !fabricTypeId || isNaN(fabricTypeId)) {
        console.error(`❌ Invalid garment or fabric type for item ${index + 1}`);
        failures.push({
          index,
          item,
          error: "Invalid garment or fabric type selected",
          success: false
        });
        continue;
      }

      if (!finalMeasurementId || isNaN(finalMeasurementId)) {
        console.error(`❌ No valid measurement ID for item ${index + 1}`);
        failures.push({
          index,
          item,
          error: "No valid measurement ID found for this garment type",
          success: false
        });
        continue;
      }

      const price = parseInt(item.price);


      if (isNaN(price) || price <= 0) {
        console.error(`❌ Invalid price for item ${index + 1}`);
        failures.push({
          index,
          item,
          error: "Invalid price",
          success: false
        });
        continue;
      }

      const itemPayload = {
        OrderId: savedOrderId,
        GarmentTypeId: garmentTypeId,
        FabricTypeId: fabricTypeId,
        Price: price,
        MeasurementId: finalMeasurementId
      };
      
      console.log(`💾 Saving order item ${index + 1}/${newItems.length}:`, itemPayload);
      
      try {
        const result = await dispatch(AddOrderItem(itemPayload));
        
        if (result && (result.success || result.status === 200)) {
          console.log(`✅ Successfully saved order item ${index + 1}`);
          results.push({
            index,
            item: itemPayload,
            result: result,
            success: true
          });
          
          setOrderItemsData(prev => [...prev, {
            ...itemPayload,
            OrderItemId: result.data || `temp_${index}`,
            GarmentTypeId: garmentTypeId,
            FabricTypeId: fabricTypeId,
            Price: price,
            MeasurementId: finalMeasurementId
          }]);
        } else {
          const errorMsg = result?.error || result?.message || 'Unknown error';
          console.error(`❌ Failed to save order item ${index + 1}:`, errorMsg);
          failures.push({
            index,
            item: itemPayload,
            error: errorMsg,
            success: false
          });
        }
      } catch (error) {
        console.error(`❌ Error saving order item ${index + 1}:`, error);
        failures.push({
          index,
          item: itemPayload,
          error: error.message,
          success: false
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setOrderItemResults(results);
    setFailedOrderItems(failures);

    if (failures.length > 0) {
      setNotification({ type: 'warning', message: `Order completed with ${failures.length} item(s) failed. Order #${savedOrderId} was created successfully.` });
      
    

      // If there are failures, close the order form but don't open advance form
      setShowOrderModal(false);
      resetForm();
    } else {
      setNotification({ type: 'success', message: `Order #${savedOrderId} created successfully with all items!` });
      
      // ✅ CRITICAL: CLOSE THE ORDER FORM FIRST
      setShowOrderModal(false);
      
      // ✅ THEN OPEN ADVANCE AMOUNT FORM
      setTimeout(() => {
        setSelectedOrderForAdvance({
          orderId: savedOrderId,
          totalAmount: calculateTotalAmount()
        });
        setShowAdvanceForm(true);
      }, 100); // Small delay to ensure order form closes first
    }

    // Add to recently added orders for highlighting
    if (savedOrderId) {
      setRecentlyAddedOrders(prev => [...prev, savedOrderId]);
      
      setTimeout(() => {
        setRecentlyAddedOrders(prev => prev.filter(id => id !== savedOrderId));
      }, 3000);
    }

    // Refresh the orders list to show the new order
    dispatch(GetOrders());
    
  } catch (error) {
    console.error("❌ Error saving order items:", error);
    setNotification({ type: 'error', message: `Error saving order items: ${error.message}` });
    setShowOrderModal(false);
    resetForm();
  } finally {
    setSaving(false);
  }
};


// ✅ UPDATED: handlePrintBill function to fetch real order items
const handlePrintBill = async (order) => {
  try {
    const orderId = extractOrderId(order);
    const customerId = extractCustomerId(order);
    
    console.log("🖨️ Generating bill for order:", orderId);
    
    // Get order items for this order
    const orderItemsResult = await dispatch(GetOrderItems(orderId));
    let orderItemsData = [];
    
    // Handle different response formats
    if (orderItemsResult?.payload?.responseBody) {
      orderItemsData = Array.isArray(orderItemsResult.payload.responseBody) 
        ? orderItemsResult.payload.responseBody 
        : [];
    } else if (orderItemsResult?.data?.ResultSet) {
      orderItemsData = Array.isArray(orderItemsResult.data.ResultSet) 
        ? orderItemsResult.data.ResultSet 
        : [];
    } else if (Array.isArray(orderItemsResult)) {
      orderItemsData = orderItemsResult;
    }
    
    console.log("📦 Order items fetched:", orderItemsData);
    
    // Filter items for this specific order
    const filteredItems = orderItemsData.filter(item => {
      const itemOrderId = extractOrderIdFromItem(item);
      return itemOrderId?.toString() === orderId?.toString();
    });
    
    console.log("✅ Filtered order items:", filteredItems);
    
    // Prepare bill data with real order items
    const billData = {
      orderId: orderId,
      customerName: getCustomerName(customerId),
      orderItems: filteredItems.map(item => {
        const garmentTypeId = item.GarmentTypeId || item.garmentTypeId;
        const fabricTypeId = item.FabricTypeId || item.fabricTypeId;
        const price = parseInt(item.Price || item.price || 0);
        
       return {
  name: `${getGarmentTypeName(garmentTypeId)} - ${getFabricTypeName(fabricTypeId)}`,
  garmentType: getGarmentTypeName(garmentTypeId),
  fabricType: getFabricTypeName(fabricTypeId),
  price: parseFloat(price || 0),
  garmentTypeId: garmentTypeId,
  fabricTypeId: fabricTypeId
};
      }),
      totalAmount: getOrderTotalAmount(order),
      advanceAmount: getOrderAdvanceData(orderId).AdvanceAmount,
      balanceAmount: getOrderAdvanceData(orderId).BalanceAmount,
      deliveryDate: formatDate(order.DeliveryDate),
      orderDate: formatDate(order.OrderDate)
    };
    
    console.log("💰 Bill data prepared:", billData);
    
    // Save to localStorage
    localStorage.setItem(`bill_${orderId}`, JSON.stringify(billData));
    
    // Set bill data and show receipt
    setBillData(billData);
    setSelectedOrderForBill(order);
    setShowBill(true);
    
  } catch (error) {
    console.error("❌ Error generating bill:", error);
    setNotification({ 
      type: 'error', 
      message: `Error generating bill: ${error.message}` 
    });
  }
};

// Add this PDF download function to your Orders component
const downloadBillAsPDF = async (billElement) => {
  if (!billElement) return;

  try {
    setNotification({ type: 'info', message: 'Generating PDF...' });
    
    const canvas = await html2canvas(billElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    const pdfImgHeight = pdfWidth / ratio;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfImgHeight);
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Invoice_${billData.orderId}_${timestamp}.pdf`;
    
    pdf.save(filename);
    
    setNotification({ type: 'success', message: 'PDF downloaded successfully!' });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    setNotification({ type: 'error', message: 'Failed to generate PDF' });
  }
};


// Add this function to handle actual printing
const handlePrintBillFinal = () => {
  if (!billData) return;
  
  const printWindow = window.open('', '_blank');
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bill - Order #${billData.orderId}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 40px; 
          color: #333;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .shop-name { 
          font-size: 28px; 
          font-weight: bold; 
          color: #1e40af;
        }
        .invoice-title { 
          font-size: 18px; 
          color: #666; 
          margin-top: 10px;
        }
        .details-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 20px; 
          margin-bottom: 30px;
        }
        .detail-box { 
          background: #f8fafc; 
          padding: 15px; 
          border-radius: 8px; 
          border: 1px solid #e2e8f0;
        }
        .detail-label { 
          font-weight: bold; 
          color: #475569; 
          margin-bottom: 5px;
        }
        .detail-value { 
          font-size: 18px; 
          font-weight: bold; 
          color: #1e40af;
        }
        .customer-info { 
          background: #dbeafe; 
          padding: 20px; 
          border-radius: 8px; 
          margin-bottom: 30px;
          border: 1px solid #bfdbfe;
        }
        .section-title { 
          font-size: 20px; 
          font-weight: bold; 
          margin-bottom: 15px; 
          color: #1e293b;
        }
        .items-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-bottom: 30px;
        }
        .items-table th, .items-table td { 
          padding: 12px; 
          text-align: left; 
          border-bottom: 1px solid #e2e8f0;
        }
        .items-table th { 
          background: #f1f5f9; 
          font-weight: bold; 
          color: #475569;
        }
        .amount-summary { 
          background: #dcfce7; 
          padding: 20px; 
          border-radius: 8px; 
          margin-bottom: 30px;
          border: 1px solid #bbf7d0;
        }
        .amount-row { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 10px;
        }
        .total-row { 
          border-top: 2px solid #86efac; 
          padding-top: 10px; 
          font-weight: bold; 
          font-size: 18px;
        }
        .delivery-info { 
          background: #ffedd5; 
          padding: 20px; 
          border-radius: 8px; 
          text-align: center;
          border: 1px solid #fdba74;
        }
        @media print {
          body { margin: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="shop-name">TAILOR SHOP</div>
        <div class="invoice-title">ORDER INVOICE</div>
      </div>
      
      <div class="details-grid">
        <div class="detail-box">
          <div class="detail-label">Order ID</div>
          <div class="detail-value">#${billData.orderId}</div>
        </div>
        <div class="detail-box">
          <div class="detail-label">Order Date</div>
          <div class="detail-value">${billData.orderDate}</div>
        </div>
      </div>
      
      <div class="customer-info">
        <div class="section-title">Customer Information</div>
        <div style="font-size: 20px; font-weight: bold;">${billData.customerName}</div>
      </div>
      
      <div class="section-title">Order Items</div>
      <table class="items-table">
        <thead>
          <tr>
            <th>Item Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${billData.orderItems.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>Rs. ${parseFloat(item.price).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="amount-summary">
        <div class="section-title">Amount Summary</div>
       <div class="amount-row">
  <span>Total Amount:</span>
  <span style="font-weight: bold; color: #166534;">
    Rs. ${parseFloat(billData.totalAmount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
  </span>
</div>
        <div class="amount-row">
  <span>Advance Paid:</span>
  <span style="font-weight: bold; color: #1e40af;">
    Rs. ${parseFloat(billData.advanceAmount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
  </span>
</div>
        <div class="amount-row total-row">
  <span>Balance Amount:</span>
  <span style="font-weight: bold; color: #ea580c;">
    Rs. ${parseFloat(billData.balanceAmount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
  </span>
</div>
      </div>
      
      <div class="delivery-info">
        <div style="font-size: 18px; font-weight: bold; color: #ea580c;">
          Delivery Date: ${billData.deliveryDate}
        </div>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 30px; color: #666;">
        <p>Thank you for your business!</p>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() {
            window.close();
          }, 1000);
        }
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
};



  const resetForm = () => {
    setCurrentStep(1);
    setSavedOrderId(null);
    setSavedMeasurementIds([]);
    setTempMeasurementMap(new Map());
    setCreatedMeasurements([]);
    setGarmentTypeToMeasurementMap(new Map());
    setGarmentTypesFromMeasurements([]);
    setOrderData({ 
      CustomerId: "", 
      OrderDate: new Date().toISOString().slice(0, 10), 
      DeliveryDate: "", 
      Status: "In Progress"
    });
    setNewItems([{ 
      garmentTypeId: "", 
      fabricTypeId: "", 
      price: "", 
      measurementId: "" // Reset measurement ID
    }]);
    setNewMeasurements([{
      GarmentTypeId: "",
      Neck: "",
      Chest: "",
      Waist: "",
      Length: "",
      Description: "",
      file: null
    }]);
    setCustomerSearch("");
    setFilteredCustomers(customers);
    setShowCustomerDropdown(false);
    setEditMode(false);
    setEditingOrderId(null);
    setEditingMeasurements([]);
    setEditingOrderItems([]);
    setEditingMeasurementId(null);
    setEditingMeasurementData({});
    setEditingOrderItemId(null);
    setEditingOrderItemData({});
    setBulkStatusUpdates({});
    setHasUnsavedChanges(false);
    setOrderChanges({});
    setMeasurementChanges({});
    setOrderItemChanges({});
    setHasChanges(false);
    setShowAdvanceForm(false);
    setSelectedOrderForAdvance(null);
  };

  // Enhanced measurement display name
  const getMeasurementDisplayName = (measurement) => {
    if (measurement.isTemp) {
      return `Temporary - ${getGarmentTypeName(measurement.garmentType)}`;
    }
    if (measurement.isNew) {
      return `NEW - ${getGarmentTypeName(measurement.GarmentTypeId)} (ID: ${measurement.MeasurementId})`;
    }
    return `${getGarmentTypeName(measurement.GarmentTypeId)} - Neck: ${measurement.Neck || 'N/A'}, Chest: ${measurement.Chest || 'N/A'}, Waist: ${measurement.Waist || 'N/A'} (ID: ${extractMeasurementId(measurement)})`;
  };

  // Enhanced measurement value getter
  const getMeasurementValue = (measurement) => {
    if (measurement.isTemp) {
      return measurement.tempId;
    }
    if (measurement.isNew && measurement.MeasurementId) {
      return measurement.MeasurementId;
    }
    return extractMeasurementId(measurement);
  };

  // Add this function to test your APIs
  const testAPIs = async (orderId) => {
    console.log("🧪 TESTING APIs for order:", orderId);
    
    try {
      const itemsResult = await dispatch(GetOrderItems(orderId));
      console.log("📦 GetOrderItems result:", itemsResult);
      
      const measurementsResult = await dispatch(GetMeasurementByOrderId(orderId));
      console.log("📏 GetMeasurementByOrderId result:", measurementsResult);
    } catch (error) {
      console.error("❌ API test error:", error);
    }
  };

  // UPDATED: Handle View Order - Make status non-editable in view mode
  const handleViewOrder = async (order) => {
    console.log("🔄 handleViewOrder called for order:", order);
    
    setViewingOrder(order);
    setEditingOrderId(null);
    setEditMode(false);
    setShowOrderModal(true);
    setLoadingOrderDetails(true);

    // Clear previous data
    setOrderItemsData([]);
    setOrderMeasurements([]);

    setOrderData({
      CustomerId: extractCustomerId(order),
      OrderDate: formatDate(order.OrderDate),
      DeliveryDate: formatDate(order.DeliveryDate),
      Status: order.Status,
    });

    try {
      const orderId = extractOrderId(order);
      console.log("🔄 Fetching details for order ID:", orderId);
      
      // Fetch both order items and measurements for THIS SPECIFIC ORDER
      await Promise.all([
        dispatch(GetOrderItems(orderId)),
        dispatch(GetMeasurementByOrderId(orderId))
      ]);
      
      console.log("✅ API calls dispatched for order:", orderId);
      
    } catch (error) {
      console.error("❌ Error in handleViewOrder:", error);
      setLoadingOrderDetails(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setViewingOrder(null);
    setShowOrderModal(true);
  };

  // Handle customer selection from searchable dropdown
  const handleCustomerSelect = (customer) => {
    setOrderData(prev => ({ ...prev, CustomerId: extractCustomerId(customer) }));
    setCustomerSearch(customer.FullName);
    setShowCustomerDropdown(false);
  };

  // Form Handlers
  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for delivery date validation
    if (name === 'DeliveryDate') {
      if (!validateDeliveryDate(value)) return;
    }
    
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const addNewItem = () => setNewItems([...newItems, { 
    garmentTypeId: "", 
    fabricTypeId: "", 
    price: "", 
    measurementId: ""
  }]);

  const removeNewItem = (index) => {
    if (newItems.length > 1) {
      setNewItems(newItems.filter((_, i) => i !== index));
    }
  };

  const addNewMeasurement = () => setNewMeasurements([...newMeasurements, {
    GarmentTypeId: "",
    Neck: "",
    Chest: "",
    Waist: "",
    Length: "",
    Description: "",
    file: null
  }]);

  const removeNewMeasurement = (index) => {
    if (newMeasurements.length > 1) {
      setNewMeasurements(newMeasurements.filter((_, i) => i !== index));
    }
  };

  const calculateTotalAmount = () => {
    return newItems.reduce((total, item) => {
      const price = parseInt(item.price) || 0;
      return total + price;
    }, 0);
  };

  // Calculate total for editing order items
  const calculateEditingTotalAmount = () => {
    return editingOrderItems.reduce((total, item) => {
      const price = parseInt(item.Price || item.price || 0);
      return total + price;
    }, 0);
  };

  const formatDate = (value) => {
    if (!value) return "";
    let d;
    if (typeof value === "string" && value.startsWith("/Date")) {
      const timestamp = parseInt(value.replace(/\/Date\((\d+)\)\//, "$1"), 10);
      d = new Date(timestamp);
    } else {
      d = new Date(value);
    }
    return d ? d.toISOString().slice(0, 10) : "";
  };

  const getCustomerName = (id) => {
    const customer = customers.find((c) => 
      extractCustomerId(c)?.toString() === id?.toString()
    );
    return customer ? customer.FullName : `ID ${id}`;
  };

  const getGarmentTypeName = (id) => {
    const garment = garmentTypes.find((g) => 
      (g.GarmentTypeId || g.garmentTypeId || g.id)?.toString() === id?.toString()
    );
    return garment ? garment.GarmentTypeName : `ID ${id}`;
  };

  const getFabricTypeName = (id) => {
    const fabric = fabricTypes.find((f) => 
      (f.FabricTypeId || f.fabricTypeId || f.id)?.toString() === id?.toString()
    );
    return fabric ? fabric.FabricTypeName : `ID ${id}`;
  };

 // UPDATED: Filter and sort orders with priority handling
const filteredOrders = (Array.isArray(orders) ? orders : [])
  .filter((order) => {
    const searchMatch =
      extractOrderId(order)?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(extractCustomerId(order)).toLowerCase().includes(searchTerm.toLowerCase());
    
    let statusMatch = true;
    if (statusFilter === 'priority') {
      statusMatch = order.Status === 'priority';
    } else if (statusFilter) {
      statusMatch = order.Status === statusFilter;
    }
    
    return searchMatch && statusMatch;
  })
  // If priority filter is selected, sort by delivery date (nearest first)
  .sort((a, b) => {
    if (statusFilter === 'priority') {
      const dateA = new Date(a.DeliveryDate);
      const dateB = new Date(b.DeliveryDate);
      return dateA - dateB; // Nearest delivery first
    }
    // Default sort by OrderId descending for other cases
    const orderIdA = extractOrderId(a);
    const orderIdB = extractOrderId(b);
    return orderIdB - orderIdA;
  });

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  // Generate exactly 3 page numbers for pagination
  const getPageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    
    if (currentPage === 1) {
      endPage = 3;
    }
    if (currentPage === totalPages) {
      startPage = totalPages - 2;
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-6 flex items-center justify-center">
      <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div>
        <span className="text-slate-700 font-medium">Loading orders...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 sm:p-6 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
      {/* 3D Notification */}
      {notification && (
        <div
          className={`fixed top-4 sm:top-6 right-4 sm:right-6 z-[9999] p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center animate-slide-in ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200/50 border-l-4 border-l-green-400' 
              : notification.type === 'error'
              ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200/50 border-l-4 border-l-rose-400'
              : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-200/50 border-l-4 border-l-yellow-400'
          }`}
          role="alert"
        >
          <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
            {notification.type === 'success' ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
          </div>
          <span className="font-normal text-sm">{notification.message}</span>
        </div>
      )}

      {/* Header Section with 3D Effect */}
      <div className="relative z-10 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
              <FiPackage className="text-white text-lg sm:text-xl" />
            </div>
            <div className="transform ">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Order Management
              </h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage your customer orders and tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 relative z-10">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-normal">Total Orders</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {filteredOrders.length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg">
                <FiPackage className="text-white text-base sm:text-lg" />
              </div>
            </div>
          </div>
        </div>


{/* Replace the Pending stats card with Priority */}
<div className="group relative">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
  <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-600 text-xs sm:text-sm font-normal">Priority</p>
        <p className="text-xl md:text-2xl font-bold text-slate-800">
          {filteredOrders.filter(o => o.Status === 'priority').length}
        </p>
      </div>
      <div className="p-2 sm:p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl shadow-lg">
        <FiAlertCircle className="text-white text-base sm:text-lg" />
      </div>
    </div>
  </div>
</div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-normal">In Progress</p>
                <p className="text-xl md:text-2xl font-bold text-slate-800">
                  {filteredOrders.filter(o => o.Status === 'In Progress').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
                <FiRefreshCw className="text-white text-base sm:text-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="group relative">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
  <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-600 text-xs sm:text-sm font-normal">Delivered</p>
        <p className="text-xl md:text-2xl font-bold text-slate-800">
          {filteredOrders.filter(o => o.Status === 'delivered').length}
        </p>
      </div>
      <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl shadow-lg">
        <FiCheckCircle className="text-white text-base sm:text-lg" />
      </div>
    </div>
  </div>
</div>
      </div>

      {/* Search + Add button - 3D Design */}
      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row flex-grow gap-3 sm:gap-4 w-full">
          <div className="relative flex-grow group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
            />
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
          </div>
          
          <div className="relative group flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
            <select 
  value={statusFilter} 
  onChange={(e) => setStatusFilter(e.target.value)} 
  className="relative w-full border-0 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-3 sm:py-3.5 rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-normal text-sm sm:text-base"
>
  <option value="">All Statuses</option>
  <option value="priority">Priority</option>
  <option value="In Progress">In Progress</option>
  <option value="delivered">Delivered</option>
</select>
          </div>

          <button
            onClick={openAddModal}
            className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-normal px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 text-sm sm:text-base whitespace-nowrap"
          >
            <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
            <FiPlusSquare className="mr-2 sm:mr-3 relative z-10" size={18} />
            <span className="relative z-10">New Order</span>
          </button>
        </div>
      </div>

      {/* 3D Table */}
      <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
                <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold  text-xs sm:text-sm uppercase tracking-wider">Order ID</th>
                <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold  text-xs sm:text-sm uppercase tracking-wider">Customer</th>
                <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold  text-xs sm:text-sm uppercase tracking-wider">Order Date</th>
                <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold  text-xs sm:text-sm uppercase tracking-wider">Delivery Date</th>
                <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold  text-xs sm:text-sm uppercase tracking-wider">Total Amount</th>
                <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold  text-xs sm:text-sm uppercase tracking-wider">Advance</th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Status</th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/50">
              {currentOrders.length > 0 ? currentOrders.map((order) => {
                const orderId = extractOrderId(order);
                const customerId = extractCustomerId(order);
                const totalAmount = getOrderTotalAmount(order);
                const isRecentlyAdded = recentlyAddedOrders.includes(orderId);
                
                return (
                  <React.Fragment key={orderId}>
                    <tr className={`
                      hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 
                      bg-gradient-to-r from-white to-slate-50 group
                      ${isRecentlyAdded ? 'animate-pulse bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-l-blue-500 shadow-lg' : ''}
                    `}>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                        {orderId}
                        {isRecentlyAdded && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-normal">
                            New
                          </span>
                        )}
                      </td>

                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                        {getCustomerName(customerId)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">{formatDate(order.OrderDate)}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">{formatDate(order.DeliveryDate)}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
  Rs. {formatCurrency(totalAmount)}
</td>
                     <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate text-center">
  Rs. {formatCurrency(getOrderAdvanceData(orderId).AdvanceAmount)}
</td>
                      {/* <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
                        <div className="relative">
                          <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs ${getStatusStyle(order.Status)}`}>
                            {order.Status}
                            {updatingStatus && statusUpdateOrderId === orderId && (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-1 border-white ml-1"></div>
                            )}
                          </div>
                          
                          {showStatusDropdown[orderId] && (
                            <div className="absolute left-0 mt-1 w-32 sm:w-40 bg-white border border-slate-200 rounded-2xl shadow-2xl z-10">
                              <div className="py-1">
                                {["priority", "In Progress", "delivered"].map((status) => (
  <button
    key={status}
    onClick={() => handleStatusChange(orderId, order.Status, status)}
    className={`block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-slate-50 transition-colors ${
      order.Status === status ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
    }`}
    disabled={updatingStatus}
  >
    {status}
  </button>
))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td> */}

                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
  <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs ${getStatusStyle(order.Status)}`}>
    {order.Status}
  </div>
</td>


                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
                            title="View Order"
                          >
                            <FiEye size={14} />
                          </button>
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="inline-flex items-center justify-center p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
                          >
                            <FiEdit size={14} />
                          </button>
                          <button
      onClick={() => handlePrintBill(order)}
      className="inline-flex items-center justify-center p-2 md:p-3 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
      title="Print Bill"
    >
      <FiPrinter size={14} />
    </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Hideable Measurements Dropdown */}
                    {expandedMeasurements[orderId] && (
                      <tr>
                        <td colSpan="7" className="px-3 sm:px-6 py-4 bg-slate-50/50">
                          <div className="bg-white rounded-2xl p-4 shadow-inner border border-slate-200/50">
                            <div className="text-center">
                              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3">
                                <h4 className="text-sm font-bold text-blue-700 mb-2">Order #{orderId} Details</h4>
                                <p className="text-blue-600 text-sm">
                                  Click the <strong>"View"</strong> button to see all measurements, order items, and complete order details.
                                </p>
                              </div>
                              <button
                                onClick={() => handleViewOrder(order)}
                                className="px-4 py-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 text-sm"
                              >
                                View Full Order Details
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              }) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 sm:py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
                        <FiPackage className="text-slate-500 text-lg sm:text-xl" />
                      </div>
                      <p className="text-slate-500 font-normal text-sm sm:text-base">
                        {searchTerm ? 'No matching orders found' : 'No orders available'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 3D Pagination */}
        {filteredOrders.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 gap-3 sm:gap-0">
            <div className="text-xs sm:text-sm text-slate-600 font-normal">
              Showing {indexOfFirstOrder + 1}–{Math.min(indexOfLastOrder, filteredOrders.length)} of{' '}
              {filteredOrders.length}
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <FiChevronLeft size={14} />
              </button>

              {getPageNumbers().map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl border font-normal transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
                    pageNumber === currentPage
                      ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Confirmation Modal */}
      {showStatusConfirmation && pendingStatusUpdate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-normal text-slate-800 mb-2">Confirm Status Update</h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Are you sure you want to update Order #{pendingStatusUpdate.orderId} status from <span className="font-normal">{currentOrders.find(o => extractOrderId(o) === pendingStatusUpdate.orderId)?.Status}</span> to <span className="font-normal">{pendingStatusUpdate.newStatus}</span>?
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 sm:space-x-3">
                <button 
                  onClick={cancelStatusUpdate}
                  className="px-3 sm:px-4 py-2 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-colors duration-300 text-sm sm:text-base"
                  disabled={updatingStatus}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmStatusUpdate}
                  disabled={updatingStatus}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
                >
                  {updatingStatus ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </span>
                  ) : (
                    'Confirm Update'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Item Status Update Confirmation Modal */}
      {showItemStatusConfirmation && pendingItemStatusUpdate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-normal text-slate-800 mb-2">Confirm Order Item Status Update</h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Are you sure you want to update Order Item #{pendingItemStatusUpdate.orderItemId} status to <span className="font-normal">{pendingItemStatusUpdate.newStatus}</span>?
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 sm:space-x-3">
                <button 
                  onClick={cancelItemStatusUpdate}
                  className="px-3 sm:px-4 py-2 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-colors duration-300 text-sm sm:text-base"
                  disabled={updatingItemStatus}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmItemStatusUpdate}
                  disabled={updatingItemStatus}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
                >
                  {updatingItemStatus ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </span>
                  ) : (
                    'Confirm Update'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {/* {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-2 sm:p-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                      <FiUserPlus className="text-white text-base sm:text-lg" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      Add New Customer
                    </h2>
                  </div>
                  <button 
                    onClick={() => setShowAddCustomerModal(false)} 
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
                  >
                    <FiX className="text-xl sm:text-2xl" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name </label>
                    <input 
                      type="text" 
                      value={newCustomer.FullName} 
                      onChange={(e) => setNewCustomer({...newCustomer, FullName: e.target.value})}
                      placeholder="Enter customer full name"
                      className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={newCustomer.PhoneNumber} 
                      onChange={(e) => setNewCustomer({...newCustomer, PhoneNumber: e.target.value})}
                      placeholder="Enter phone number"
                      className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={newCustomer.Email} 
                      onChange={(e) => setNewCustomer({...newCustomer, Email: e.target.value})}
                      placeholder="Enter email address"
                      className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
                    <textarea 
                      value={newCustomer.Address} 
                      onChange={(e) => setNewCustomer({...newCustomer, Address: e.target.value})}
                      placeholder="Enter customer address"
                      rows="3"
                      className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button 
                    onClick={() => setShowAddCustomerModal(false)}
                    className="px-4 sm:px-6 py-2.5 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 font-normal text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddCustomer}
                    disabled={addingCustomer}
                    className="px-4 sm:px-6 py-2.5 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
                  >
                    {addingCustomer ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </span>
                    ) : (
                      'Add Customer'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}


{/* Add Customer Modal */}
{showAddCustomerModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-2 sm:p-4">
    <div className="relative w-full max-w-md">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                <FiUserPlus className="text-white text-base sm:text-lg" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Add New Customer
              </h2>
            </div>
            <button 
              onClick={() => setShowAddCustomerModal(false)} 
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
            >
              <FiX className="text-xl sm:text-2xl" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name *</label>
              <input 
                type="text" 
                value={newCustomer.FullName} 
                onChange={(e) => {
                  setNewCustomer({...newCustomer, FullName: e.target.value});
                  if (customerErrors.FullName) setCustomerErrors({...customerErrors, FullName: ""});
                }}
                placeholder="Enter customer full name"
                className={`w-full border px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base ${
                  customerErrors.FullName ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {customerErrors.FullName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <FiAlertCircle className="mr-1" size={12} />
                  {customerErrors.FullName}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number *</label>
              <input 
                type="tel" 
                value={newCustomer.PhoneNumber} 
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, '');
                  setNewCustomer({...newCustomer, PhoneNumber: value});
                  if (customerErrors.PhoneNumber) setCustomerErrors({...customerErrors, PhoneNumber: ""});
                }}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                className={`w-full border px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base ${
                  customerErrors.PhoneNumber ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {customerErrors.PhoneNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <FiAlertCircle className="mr-1" size={12} />
                  {customerErrors.PhoneNumber}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                value={newCustomer.Email} 
                onChange={(e) => {
                  setNewCustomer({...newCustomer, Email: e.target.value});
                  if (customerErrors.Email) setCustomerErrors({...customerErrors, Email: ""});
                }}
                placeholder="Enter email address (optional)"
                className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Address *</label>
              <textarea 
                value={newCustomer.Address} 
                onChange={(e) => {
                  setNewCustomer({...newCustomer, Address: e.target.value});
                  if (customerErrors.Address) setCustomerErrors({...customerErrors, Address: ""});
                }}
                placeholder="Enter customer address"
                rows="3"
                className={`w-full border px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base ${
                  customerErrors.Address ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {customerErrors.Address && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <FiAlertCircle className="mr-1" size={12} />
                  {customerErrors.Address}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button 
              onClick={() => setShowAddCustomerModal(false)}
              className="px-4 sm:px-6 py-2.5 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 font-normal text-sm sm:text-base"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddCustomer}
              disabled={addingCustomer}
              className="px-4 sm:px-6 py-2.5 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
            >
              {addingCustomer ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </span>
              ) : (
                'Add Customer'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Add/View Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-h-full overflow-y-auto">
              {/* Close icon for BOTH view form AND add form */}
              <button 
                onClick={() => {
                  setShowOrderModal(false);
                  if (!viewingOrder) {
                    resetForm();
                  } else {
                    setEditMode(false);
                    setEditingOrderId(null);
                  }
                }} 
                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-slate-400 hover:text-slate-600 z-10 p-2 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
              >
                <FiX className="text-xl sm:text-2xl" />
              </button>

              <div className="p-4 sm:p-6">
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                        <FiPackage className="text-white text-base sm:text-lg" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        {editMode ? `Edit Order #${extractOrderId(viewingOrder)}` : 
                        viewingOrder ? `View Order #${extractOrderId(viewingOrder)} - ${getCustomerName(extractCustomerId(viewingOrder))}` : 'Create New Order'}
                      </h2>
                    </div>
                    
                    {/* NEW: Save All Changes Button - Only show in edit mode when there are changes */}
                    {editMode && hasChanges && (
                      <button
                        onClick={saveAllChanges}
                        disabled={saving}
                        className="relative group bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-normal px-4 py-2 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 text-sm w-full sm:w-auto"
                      >
                        <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
                        <FiSave className="mr-2 relative z-10" size={16} />
                        <span className="relative z-10">Save All Changes</span>
                      </button>
                    )}
                    
                    {/* Add Customer Button - Mobile Responsive */}
                    {!viewingOrder && !editMode && (
                      <div className="absolute top-3 sm:top-4 right-12 sm:right-16 md:right-20">
                        {/* <button
                          onClick={() => setShowAddCustomerModal(true)}
                          className="relative group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-normal px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
                        >
                          <FiUserPlus className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline">Add Customer</span>
                          <span className="xs:hidden">Add Customer</span>
                        </button> */}
                      </div>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base">
                    {editMode ? `Editing order details, items, and measurements for ${getCustomerName(extractCustomerId(viewingOrder))}` :
                    viewingOrder ? `Viewing order details, items, and measurements for ${getCustomerName(extractCustomerId(viewingOrder))}` : 'Fill all details to create a new order'}
                  </p>
  
                  {/* Step Progress Indicator */}
                  {!viewingOrder && (
                    <div className="flex items-center justify-center mt-4 sm:mt-6 mb-3 sm:mb-4">
                      <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
                        <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${currentStep >= 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200'}`}>
                          1
                        </div>
                        <span className="ml-1 sm:ml-2 font-normal text-xs sm:text-sm">Order Details</span>
                      </div>
                      <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                      <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
                        <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${currentStep >= 2 ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200'}`}>
                          2
                        </div>
                        <span className="ml-1 sm:ml-2 font-normal text-xs sm:text-sm">Measurements</span>
                      </div>
                      <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                      <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
                        <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${currentStep >= 3 ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200'}`}>
                          3
                        </div>
                        <span className="ml-1 sm:ml-2 font-normal text-xs sm:text-sm">Order Items</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 sm:space-y-8 max-h-[70vh] overflow-y-auto">
                  {/* STEP 1: Order Details Section */}
{(currentStep === 1 || viewingOrder || editMode) && (
  <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-200/50 shadow-lg">
    {/* Header with Order Details and Add Customer button */}
<div className="flex justify-between items-center mb-3 sm:mb-4">
  <h3 className="text-base sm:text-lg font-bold text-slate-800">Order Details</h3>
  {/* Only show Add Customer button when NOT in view mode AND NOT in edit mode */}
  {!viewingOrder && !editMode && (
    <button
      onClick={() => setShowAddCustomerModal(true)}
      className="relative group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-normal px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
    >
      <FiUserPlus className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
      <span className="hidden xs:inline">Add Customer</span>
      <span className="xs:hidden">Add Customer</span>
    </button>
  )}
</div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Customer{!viewingOrder && "*"}</label>
        {viewingOrder || editMode ? (
          <input 
            type="text" 
            value={getCustomerName(orderData.CustomerId)} 
            readOnly
            className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm sm:text-base" 
          />
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <input 
                type="text" 
                value={customerSearch} 
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setShowCustomerDropdown(true);
                }}
                onFocus={() => setShowCustomerDropdown(true)}
                placeholder="Search customer by name..."
                className="w-full border border-slate-300 pl-3 pr-10 py-2 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base" 
                disabled={saving}
              />
              {/* Clickable dropdown icon */}
              <button 
                type="button"
                onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                <FiChevronDown className={`transform transition-transform duration-200 ${showCustomerDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showCustomerDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-xl shadow-2xl max-h-40 sm:max-h-60 overflow-y-auto">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <div
                        key={extractCustomerId(customer)}
                        className="px-3 py-2 hover:bg-slate-100 cursor-pointer transition-colors duration-200 text-sm sm:text-base"
                        onClick={() => {
                          handleCustomerSelect(customer);
                          setShowCustomerDropdown(false);
                        }}
                      >
                        {customer.FullName}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-slate-500 text-sm sm:text-base">No customers found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Order Date </label>
        <input 
          type="date" 
          name="OrderDate" 
          value={orderData.OrderDate} 
          onChange={editMode ? handleOrderDataChange : handleOrderChange} 
          required 
          className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base" 
          disabled={!!viewingOrder || saving}
        />
      </div> */}

      <div>
  <label className="block text-sm font-bold text-slate-700 mb-1">Order Date </label>
  <input 
    type="date" 
    name="OrderDate" 
    value={orderData.OrderDate} 
    onChange={editMode ? handleOrderDataChange : handleOrderChange} 
    required 
    className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base bg-slate-100 cursor-not-allowed" 
    disabled={true} // Always disabled to prevent editing
    title="Order date is set to current date and cannot be changed"
  />
  {/* <p className="text-xs text-slate-500 mt-1">Automatically set to today's date</p> */}
</div>


      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Delivery Date {!viewingOrder && "*"}</label>
        <input 
          type="date" 
          name="DeliveryDate" 
          value={orderData.DeliveryDate} 
          onChange={editMode ? handleOrderDataChange : handleOrderChange} 
          onBlur={(e) => validateDeliveryDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required 
          className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base" 
          disabled={!!viewingOrder || saving}
        />
      </div>
      {/* <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
<select 
  name="Status" 
  value={orderData.Status} 
  onChange={editMode ? handleOrderDataChange : handleOrderChange} 
  className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base" 
  disabled={(!!viewingOrder && !editMode) || saving}
>
  <option value="priority">Priority</option>
  <option value="In Progress">In Progress</option>
  <option value="delivered">Delivered</option>
</select>
      </div> */}

      <div>
  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
  <div className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm sm:text-base">
    {orderData.Status}
  </div>
  <p className="text-xs text-slate-500 mt-1">Automatically Update when the Balance Amount Pay</p>
</div>
    </div>

    {/* Next Button for Step 1 */}
    {!viewingOrder && !editMode && (
      <div className="flex justify-end mt-4 sm:mt-6">
        <button 
          onClick={handleNextStep}
          disabled={saving}
          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 flex items-center text-sm sm:text-base"
        >
          Next
          <FiArrowRight className="ml-2" />
        </button>
      </div>
    )}
  </div>
)}

                  {/* STEP 2: Measurements Section */}
                  {(currentStep === 2 || viewingOrder || editMode) && (
                    <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-200/50 shadow-lg min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-3">
                        <h3 className="text-base sm:text-lg font-bold text-slate-800">
                          Measurements {viewingOrder && `(${editMode ? editingMeasurements.length : orderMeasurements.length})`}
                        </h3>
                      </div>

                      {viewingOrder || editMode ? (
                        <div>
                          {loadingOrderDetails ? (
                            <div className="text-center py-6 sm:py-8">
                              <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl border border-white/20">
                                <div className="animate-spin rounded-full h-5 sm:h-6 w-5 sm:w-6 border-b-2 border-blue-800"></div>
                                <span className="text-slate-700 font-normal text-sm sm:text-base">Loading measurements...</span>
                              </div>
                            </div>
                          ) : (
                            <div className="overflow-x-auto rounded-2xl border border-slate-200/50">
                              <table className="min-w-full divide-y divide-slate-200/50 text-sm">
                                <thead className="bg-slate-50/80">
                                  <tr>
                                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">ID</th>
                                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Garment</th>
                                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Neck(Inch)</th>
                                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Chest(Inch)</th>
                                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Waist(Inch)</th>
                                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Length(Inch)</th>
                                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Yards Required</th>
                                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Description</th>
                                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Image</th>
                                    {/* REMOVED Actions column for View mode */}
                                    {editMode && (
                                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Actions</th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200/50">
                                  {(editMode ? editingMeasurements : orderMeasurements).length > 0 ? 
                                    (editMode ? editingMeasurements : orderMeasurements).map((measurement, index) => (
                                      <tr 
                                        key={extractMeasurementId(measurement) || index} 
                                        className="hover:bg-slate-50 cursor-pointer transition-colors duration-200"
                                        onClick={() => !editMode && handleMeasurementRowClick(measurement)}
                                      >
                                        <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm font-normal text-slate-700">{extractMeasurementId(measurement)}</td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{getGarmentTypeName(measurement.GarmentTypeId)}</td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{measurement.Neck || '-'}</td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{measurement.Chest || '-'}</td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{measurement.Waist || '-'}</td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{measurement.Length || '-'}</td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{measurement.YardsRequired || '-'}</td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{measurement.Description || '-'}</td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm">
                                          {renderMeasurementImage(measurement)}
                                        </td>
                                        {/* Only show actions in Edit mode */}
                                        {editMode && (
                                          <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm">
                                            <div className="flex space-x-1">
                                              <button 
                                                onClick={() => handleEditMeasurement(measurement)}
                                                className="text-blue-600 hover:text-blue-800 p-1 transition-colors duration-200"
                                                title="Edit Measurement"
                                              >
                                                <FiEdit size={14} />
                                              </button>
                                            </div>
                                          </td>
                                        )}
                                      </tr>
                                    )) : (
                                      <tr>
                                        <td colSpan={editMode ? "9" : "8"} className="text-center py-6 sm:py-8 text-slate-500 text-sm">
                                          {loadingOrderDetails ? "Loading measurements..." : `No measurements found for this order. (Debug: ${editMode ? editingMeasurements.length : orderMeasurements.length} items)`}
                                          No measurements found for this order.
                                        </td>
                                      </tr>
                                    )}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ) : (
                        // ADD MEASUREMENT FORM - Table layout with Description as separate row
                        <div className="rounded-2xl border border-slate-200/50">
                          <table className="w-full divide-y divide-slate-200/50 text-sm"> 
                            <thead className="bg-slate-50/80">
                              <tr>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Garment Type</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Neck</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Chest</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Waist</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Length</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Yards Required</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Image</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200/50">
                              {newMeasurements.map((measurement, index) => (
                                <React.Fragment key={index}>
                                  <tr className="hover:bg-slate-50 transition-colors duration-200">
                                    <td className="px-2 sm:px-4 py-2 sm:py-4">
                                      <select 
                                        name="GarmentTypeId" 
                                        value={measurement.GarmentTypeId} 
                                        onChange={(e) => handleNewMeasurementChange(index, e)} 
                                        required 
                                        className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
                                        disabled={saving}
                                      >
                                        <option value="">Select</option>
                                        {garmentTypes.map((g) => (
                                          <option key={g.GarmentTypeId} value={g.GarmentTypeId}>
                                            {g.GarmentTypeName}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="px-2 sm:px-4 py-2 sm:py-4">
                                      <input 
                                        type="number" 
                                        name="Neck" 
                                        value={measurement.Neck} 
                                        onChange={(e) => handleNewMeasurementChange(index, e)} 
                                        placeholder="Neck" 
                                        step="0.1"
                                        min="0"
                                        className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
                                        disabled={saving}
                                        onKeyDown={(e) => {
                                          // Only prevent negative input, allow 0
                                          if (e.key === '-') {
                                            e.preventDefault();
                                          }
                                        }}
                                      />
                                    </td>
                                    <td className="px-2 sm:px-4 py-2 sm:py-4">
                                      <input 
                                        type="number" 
                                        name="Chest" 
                                        value={measurement.Chest} 
                                        onChange={(e) => handleNewMeasurementChange(index, e)} 
                                        placeholder="Chest" 
                                        step="0.1"
                                        min="0"
                                        className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
                                        disabled={saving}
                                        onKeyDown={(e) => {
                                          if (e.key === '-') {
                                            e.preventDefault();
                                          }
                                        }}
                                      />
                                    </td>
                                    <td className="px-2 sm:px-4 py-2 sm:py-4">
                                      <input 
                                        type="number" 
                                        name="Waist" 
                                        value={measurement.Waist} 
                                        onChange={(e) => handleNewMeasurementChange(index, e)} 
                                        placeholder="Waist" 
                                        step="0.1"
                                        min="0"
                                        className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
                                        disabled={saving}
                                        onKeyDown={(e) => {
                                          if (e.key === '-') {
                                            e.preventDefault();
                                          }
                                        }}
                                      />
                                    </td>
                                    <td className="px-2 sm:px-4 py-2 sm:py-4">
                                      <input 
                                        type="number" 
                                        name="Length" 
                                        value={measurement.Length} 
                                        onChange={(e) => handleNewMeasurementChange(index, e)} 
                                        placeholder="Length" 
                                        step="0.1"
                                        min="0"
                                        className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
                                        disabled={saving}
                                        onKeyDown={(e) => {
                                          if (e.key === '-') {
                                            e.preventDefault();
                                          }
                                        }}
                                      />
                                    </td>
                                    <td className="px-2 sm:px-4 py-2 sm:py-4">
                    <input 
                      type="number" 
                      name="YardsRequired" 
                      value={measurement.YardsRequired} 
                      onChange={(e) => handleNewMeasurementChange(index, e)} 
                      placeholder="Yards" 
                      step="0.1"
                      min="0"
                      className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
                      disabled={saving}
                      onKeyDown={(e) => {
                        if (e.key === '-') e.preventDefault();
                      }}
                    />
                  </td>
                                    <td className="px-2 sm:px-4 py-2 sm:py-4">
                                      <div className="relative">
                                        <input 
                                          type="file" 
                                          accept="image/*"
                                          onChange={(e) => handleFileChange(index, e)} 
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                          disabled={saving}
                                        />
                                        <div className="flex items-center justify-center px-2 sm:px-3 py-1 sm:py-2 border border-slate-300 rounded-xl bg-white text-slate-700 transition-all duration-300 hover:bg-slate-50 text-xs sm:text-sm">
                                          <FiPaperclip className="mr-1" />
                                          {measurement.file ? (
                                            <span className="truncate max-w-[80px] sm:max-w-[120px]">
                                              {measurement.file.name}
                                            </span>
                                          ) : (
                                            'Upload'
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-2 sm:px-4 py-2 sm:py-4">
                                      {newMeasurements.length > 1 && (
                                        <button 
                                          type="button" 
                                          onClick={() => removeNewMeasurement(index)} 
                                          className="text-red-500 hover:text-red-700 p-1 transition-colors duration-200"
                                          title="Remove Measurement"
                                          disabled={saving}
                                        >
                                          <FiTrash2 size={14} />
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                  {/* DESCRIPTION AS SEPARATE ROW - Only in Add Form */}
                                  <tr>
                                   <td colSpan="8" className="px-2 sm:px-4 py-3 sm:py-4 bg-slate-50/50">
                                      <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm">
                                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">Description</label>
                                        <textarea 
                                          name="Description" 
                                          value={measurement.Description} 
                                          onChange={(e) => handleNewMeasurementChange(index, e)} 
                                          placeholder="Enter measurement description or notes..."
                                          rows="3"
                                          className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm resize-vertical" 
                                          disabled={saving}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                          {(!viewingOrder || editMode) && (
                            <button 
                              type="button" 
                              onClick={addNewMeasurement} 
                              className="ml-auto px-3 sm:px-4 py-2 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-xs sm:text-sm font-normal w-full sm:w-auto"
                              disabled={saving}
                            >
                              <FiPlusSquare className="mr-1 sm:mr-2" /> Add Measurements
                            </button>
                          )}

                          {/* Navigation Buttons for Step 2 */}
                          {!viewingOrder && !editMode && (
                            <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 gap-3">
                              <button 
                                onClick={handlePreviousStep}
                                disabled={saving}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center text-sm sm:text-base order-2 sm:order-1"
                              >
                                <FiArrowLeft className="mr-1 sm:mr-2" />
                                Previous
                              </button>
                              <button 
                                onClick={handleNextStep}
                                disabled={saving}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center text-sm sm:text-base order-1 sm:order-2"
                              >
                                Next
                                <FiArrowRight className="ml-1 sm:ml-2" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 3: Order Items Section */}
                  {(currentStep === 3 || viewingOrder || editMode) && (
                    <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-200/50 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-3">
                        <h3 className="text-base sm:text-lg font-bold text-slate-800">
                          Order Items {viewingOrder && `(${editMode ? editingOrderItems.length : orderItemsData.length})`}
                        </h3>
                        
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                          {/* Save Changes Button - Only show when there are unsaved changes */}
                          {hasUnsavedChanges && (
                            <button 
                              onClick={saveAllStatusChanges}
                              disabled={saving}
                              className="px-4 sm:px-6 py-2 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center text-sm w-full sm:w-auto"
                            >
                              {saving ? (
                                <span className="flex items-center">
                                  <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white mr-2"></div>
                                  Saving...
                                </span>
                              ) : (
                                <>
                                  <FiCheckCircle className="mr-2" />
                                  Save Status Changes
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {viewingOrder || editMode ? (
                        <div>
                          {loadingOrderDetails ? (
                            <div className="text-center py-6 sm:py-8">
                              <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl border border-white/20">
                                <div className="animate-spin rounded-full h-5 sm:h-6 w-5 sm:w-6 border-b-2 border-blue-800"></div>
                                <span className="text-slate-700 font-normal text-sm sm:text-base">Loading order items...</span>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="overflow-x-auto rounded-2xl border border-slate-200/50">
                                <table className="min-w-full divide-y divide-slate-200/50 text-sm">
                                  <thead className="bg-slate-50/80">
                                    <tr>
                                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Item ID</th>
                                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Garment</th>
                                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Fabric</th>
                                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs font-bold text-slate-700 uppercase">Price</th>
                                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Status</th>
                                      {/* REMOVED Actions column for View mode */}
                                      {/* {editMode && (
                                        <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Actions</th>
                                      )} */}
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-slate-200/50">
                                    {(editMode ? editingOrderItems : orderItemsData).length > 0 ? 
                                      (editMode ? editingOrderItems : orderItemsData).map((item, index) => {
                                      const orderItemId = extractOrderItemId(item);
                                      const garmentTypeId = item.GarmentTypeId || item.garmentTypeId;
                                      const fabricTypeId = item.FabricTypeId || item.fabricTypeId;
                                      const price = parseInt(item.Price || item.price || 0);
                                      
                                      // FIX: Properly extract status from all possible properties
                                      const currentStatus = item.Status || item.status || 'pending';
                                      
                                      // Use updated status if available, otherwise use current status
                                      const displayStatus = bulkStatusUpdates[orderItemId] || currentStatus;
                                      
                                      return (
                                        <tr key={index} className="hover:bg-slate-50 transition-colors duration-200">
                                          <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm font-normal text-slate-700">{orderItemId || `Temp-${index}`}</td>
                                          <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{getGarmentTypeName(garmentTypeId)}</td>
                                          <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{getFabricTypeName(fabricTypeId)}</td>
                                          <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600 text-center">
                                            {formatCurrency(price)}
                                          </td>
                                          {/* <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm"> */}
                                            {/* UPDATED: Make status non-editable in View mode, editable in Edit mode */}
                                            {/* {editMode ? (
                                              <div className="relative">
                                              <select
  value={displayStatus}
  onChange={(e) => {
    console.log(`🔄 Changing item ${orderItemId} from ${displayStatus} to ${e.target.value}`);
    handleIndividualStatusChange(orderItemId, e.target.value);
  }}
  className={`w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs border-0 focus:ring-2 focus:ring-blue-200 transition-all duration-300 ${getOrderItemStatusStyle(displayStatus)}`}
  disabled={updatingItemStatus && statusUpdateOrderItemId === orderItemId}
>
  <option value="priority">Priority</option>
  <option value="In Progress">In Progress</option>
  <option value="delivered">Delivered</option>
</select>
                                                
                                                {updatingItemStatus && statusUpdateOrderItemId === orderItemId && (
                                                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-800"></div>
                                                  </div>
                                                )}
                                              </div>
                                            ) : ( */}
                                              {/* // View mode - display only, no editing
                                            //   <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs ${getOrderItemStatusStyle(displayStatus)}`}>
                                            //     {displayStatus}
                                            //   </div>
                                            // )} */}
                                            
                                            {/* Show indicator if status has been changed but not saved */}
                                            {/* {bulkStatusUpdates[orderItemId] && bulkStatusUpdates[orderItemId] !== currentStatus && (
                                              <div className="text-xs text-yellow-600 mt-1 flex items-center">
                                                <FiAlertCircle className="mr-1" size={10} />
                                                Unsaved
                                              </div>
                                            )}
                                          </td> */}

                                          <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm">
  {/* ALWAYS READ-ONLY - No editing */}
  <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs ${getOrderItemStatusStyle(displayStatus)}`}>
    {displayStatus}
  </div>
</td>

                                        </tr>
                                      );
                                    }) : (
                                      <tr>
                                        <td colSpan={editMode ? "6" : "5"} className="text-center py-6 sm:py-8 text-slate-500 text-sm">
                                          {loadingOrderDetails ? "Loading order items..." : `No items found for this order. (Debug: ${editMode ? editingOrderItems.length : orderItemsData.length} items)`}
                                          No items found for this order.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              
                            {/* Total Amount Display for View/Edit Mode */}
{(editMode ? editingOrderItems : orderItemsData).length > 0 && (
  <div className="bg-blue-50/80 p-3 sm:p-4 rounded-xl border border-blue-200/50 mt-3 sm:mt-4">
    <div className="space-y-3">
      {/* Total Order Amount */}
      <div className="flex justify-between items-center">
        <span className="font-normal text-blue-800 text-sm sm:text-base">Total Order Amount:</span>
        <span className="font-normal text-lg text-blue-800">
          {formatCurrency(editMode ? calculateEditingTotalAmount() : getOrderTotalAmount(viewingOrder))}
        </span>
      </div>
      
      {/* NEW: Advance Amount Display */}
      {viewingOrder && (
        <>
          {/* Advance Amount */}
          <div className="flex justify-between items-center">
            <span className="font-normal text-green-700 text-sm sm:text-base">Advance Amount:</span>
            <span className="font-normal text-lg text-green-700">
              {formatCurrency(getOrderAdvanceData(extractOrderId(viewingOrder)).AdvanceAmount)}
            </span>
          </div>
          
          {/* Balance Amount */}
          <div className="flex justify-between items-center">
            <span className="font-normal text-orange-700 text-sm sm:text-base">Balance Amount:</span>
            <span className="font-normal text-lg text-orange-700">
              {formatCurrency(getOrderAdvanceData(extractOrderId(viewingOrder)).BalanceAmount)}
            </span>
          </div>
          
          {/* Pay Balance Button aligned under the values */}
          {getOrderAdvanceData(extractOrderId(viewingOrder)).BalanceAmount > 0 && (
            <div className="flex justify-end">
              <button
                onClick={() => handlePayBalance(viewingOrder)}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm"
              >
                {saving ? 'Processing...' : 'Pay Balance'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  </div>
)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {/* Display Order ID information */}
                          <div className="bg-blue-50/80 p-3 sm:p-4 rounded-xl border border-blue-200/50 mb-3 sm:mb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                              <div>
                                <span className="font-normal text-blue-800 text-sm">Order ID:</span>
                                <span className="ml-2 font-normal text-lg text-blue-800">{savedOrderId}</span>
                              </div>
                              <div className="text-xs sm:text-sm text-blue-600">
                                Auto-created items: {garmentTypesFromMeasurements.map(id => getGarmentTypeName(id)).join(', ')}
                              </div>
                            </div>
                          </div>

                          {/* Auto-create order items based on measurements */}
                          {(() => {
                            // Auto-populate newItems with garment types from measurements when first entering step 3
                            if (newItems.length === 1 && !newItems[0].garmentTypeId && garmentTypesFromMeasurements.length > 0) {
                              const autoItems = garmentTypesFromMeasurements.map(garmentTypeId => {
                                const measurementId = garmentTypeToMeasurementMap.get(parseInt(garmentTypeId));
                                return {
                                  garmentTypeId: garmentTypeId,
                                  fabricTypeId: "",
                                  price: "",
                                  measurementId: measurementId ? measurementId.toString() : ""
                                };
                              });
                              setNewItems(autoItems);
                            }

                            return newItems.map((item, index) => {
                              const garmentTypeName = getGarmentTypeName(item.garmentTypeId);
                              const measurementId = garmentTypeToMeasurementMap.get(parseInt(item.garmentTypeId));
                              
                              // Auto-fill measurement ID if not already set
                              if (item.garmentTypeId && !item.measurementId && measurementId) {
                                const updatedItems = [...newItems];
                                updatedItems[index].measurementId = measurementId.toString();
                                setNewItems(updatedItems);
                              }

                              return (
                                <div key={index} className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/50 relative mb-4 sm:mb-5">
                                  {/* Item Header with Garment Type */}
                                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <div className="flex items-center space-x-2">
                                      <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                                        <FiPackage className="text-white text-sm" />
                                      </div>
                                      <h4 className="text-sm sm:text-base font-bold text-slate-800">
                                        {garmentTypeName || `Item ${index + 1}`}
                                      </h4>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                    <div>
                                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Garment Type</label>
                                      <div className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs sm:text-sm flex items-center">
                                        <span className="flex-1">{garmentTypeName || "Not selected"}</span>
                                        {item.garmentTypeId && (
                                          <FiCheckCircle className="text-green-600 ml-2" size={14} />
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-500 mt-1">
                                        From your measurements
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Fabric Type </label>
                                      <select 
                                        name="fabricTypeId" 
                                        value={item.fabricTypeId} 
                                        onChange={(e) => handleNewItemChange(index, e)} 
                                        className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
                                        disabled={saving}
                                        required
                                      >
                                        <option value="">-- Select Fabric Type --</option>
                                        {fabricTypes.map((f) => (
                                          <option key={f.FabricTypeId} value={f.FabricTypeId}>
                                            {f.FabricTypeName}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    
                                    <div>
                                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Price </label>
                                     
<input 
  type="number" 
  name="price" 
  value={item.price} 
  onChange={(e) => {
    const value = e.target.value;
    // Only allow integers (no decimals)
    if (value === '' || /^\d+$/.test(value)) {
      handleNewItemChange(index, e);
    }
  }}
  onBlur={(e) => {
    // Validate on blur - ensure value is not negative
    const value = e.target.value;
    if (value !== '' && parseInt(value) < 0) {
      setNotification({ type: 'error', message: 'Price cannot be negative' });
      const updatedItems = [...newItems];
      updatedItems[index].price = '';
      setNewItems(updatedItems);
    }
  }}
  placeholder="0" 
  min="0"
  className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
  disabled={saving}
  required
/>
                                      {/* <p className="text-xs text-slate-500 mt-1">
                                        Must be greater than or equal to 0
                                      </p> */}
                                    </div>

                                    <div>
                                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Measure ID</label>
                                      <input 
                                        type="text" 
                                        name="measurementId" 
                                        value={item.measurementId || ''} 
                                        readOnly
                                        placeholder="Auto-filled"
                                        className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs sm:text-sm"
                                      />
                                      <p className="text-xs text-slate-500 mt-1">
                                        Auto-filled from measurements
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Price validation error */}
                                  {item.price && parseFloat(item.price) < 0 && (
                                    <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                                      <p className="text-xs text-red-700 flex items-center">
                                        <FiAlertCircle className="mr-2" size={12} />
                                        Price cannot be negative
                                      </p>
                                    </div>
                                  )}
                                  
                                  <div className="mt-3 text-xs sm:text-sm text-slate-600 flex justify-between items-center">
                                    <span>Item Price: {formatCurrency(parseFloat(item.price) || 0)}</span>
                                    {item.price && parseFloat(item.price) > 0 && (
                                      <span className="font-bold text-blue-700">
                                        Total: {formatCurrency(parseFloat(item.price) || 0)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            });
                          })()}

                          {newItems.length > 0 && (
                            <div className="bg-blue-50/80 p-4 sm:p-5 rounded-2xl border border-blue-200/50 mt-4 sm:mt-5">
                              <div className="flex justify-between items-center">
                                <span className="font-normal text-blue-800 text-base sm:text-lg">Total Order Amount:</span>
                                <span className="font-bold text-xl text-blue-800">
                                  {formatCurrency(calculateTotalAmount())}
                                </span>
                              </div>
                              <div className="mt-2 text-xs sm:text-sm text-blue-600">
                                {newItems.length} item(s) • {garmentTypesFromMeasurements.length} garment type(s) from measurements
                              </div>
                            </div>
                          )}

                          {/* Navigation and Save Buttons for Step 3 */}
                          {!viewingOrder && !editMode && (
                            <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3">
                              <button 
                                onClick={handlePreviousStep}
                                disabled={saving}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center text-sm sm:text-base order-2 sm:order-1"
                              >
                                <FiArrowLeft className="mr-1 sm:mr-2" />
                                Previous
                              </button>
                              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 order-1 sm:order-2">
                                <button 
                                  onClick={() => {
                                    setShowOrderModal(false);
                                    resetForm();
                                  }} 
                                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 font-normal text-sm sm:text-base"
                                  disabled={saving}
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={handleSaveOrderItems} 
                                  disabled={saving || newItems.some(item => !item.price || parseFloat(item.price) < 0 || !item.fabricTypeId)}
                                  className="px-4 sm:px-8 py-2 sm:py-2.5 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
                                >
                                  {saving ? (
                                    <span className="flex items-center">
                                      <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
                                      Saving...
                                    </span>
                                  ) : (
                                    'Save Order'
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                          {/* Save Button for Edit Mode */}
                          {editMode && (
                            <div className="flex justify-end mt-4 sm:mt-6">
                              <button 
                                onClick={handleSaveOrder} 
                                disabled={saving}
                                className="px-4 sm:px-8 py-2 sm:py-2.5 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base w-full sm:w-auto"
                              >
                                {saving ? (
                                  <span className="flex items-center">
                                    <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
                                    Saving...
                                  </span>
                                ) : (
                                  'Save Order Changes'
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Measurement Modal */}
      {editingMeasurementId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
                      <FiEdit className="text-white text-base sm:text-lg" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      Edit Measurement
                    </h2>
                  </div>
                  <button 
                    onClick={cancelMeasurementEdit} 
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
                  >
                    <FiX className="text-xl sm:text-2xl" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Garment Type</label>
                    <select 
                      name="GarmentTypeId" 
                      value={editingMeasurementData.GarmentTypeId} 
                      onChange={handleEditMeasurementChange} 
                      className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                    >
                      <option value="">-Select-</option>
                      {garmentTypes.map((g) => (
                        <option key={g.GarmentTypeId} value={g.GarmentTypeId}>
                          {g.GarmentTypeName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Neck</label>
                      <input 
                        type="number" 
                        name="Neck" 
                        value={editingMeasurementData.Neck} 
                        onChange={handleEditMeasurementChange} 
                        placeholder="Neck" 
                        step="0.1"
                        min="0"
                        className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Chest</label>
                      <input 
                        type="number" 
                        name="Chest" 
                        value={editingMeasurementData.Chest} 
                        onChange={handleEditMeasurementChange} 
                        placeholder="Chest" 
                        step="0.1"
                        min="0"
                        className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Waist</label>
                      <input 
                        type="number" 
                        name="Waist" 
                        value={editingMeasurementData.Waist} 
                        onChange={handleEditMeasurementChange} 
                        placeholder="Waist" 
                        step="0.1"
                        min="0"
                        className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Length</label>
                      <input 
                        type="number" 
                        name="Length" 
                        value={editingMeasurementData.Length} 
                        onChange={handleEditMeasurementChange} 
                        placeholder="Length" 
                        step="0.1"
                        min="0"
                        className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                   {/* ADD YARDS REQUIRED FIELD */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Yards Required</label>
          <input 
            type="number" 
            name="YardsRequired" 
            value={editingMeasurementData.YardsRequired} 
            onChange={handleEditMeasurementChange} 
            placeholder="Yards Required" 
            step="0.1"
            min="0"
            className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
          />
        </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                    <textarea 
                      name="Description" 
                      value={editingMeasurementData.Description} 
                      onChange={handleEditMeasurementChange} 
                      placeholder="Description" 
                      rows="3"
                      className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button 
                    onClick={cancelMeasurementEdit}
                    className="px-4 sm:px-6 py-2.5 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 font-normal text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdateMeasurement}
                    disabled={saving}
                    className="px-4 sm:px-6 py-2.5 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
                  >
                    {saving ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </span>
                    ) : (
                      'Update Measurement'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Image Popup Modal */}
{showImagePopup && selectedMeasurement && (
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
                <FiImage className="text-white text-sm sm:text-base sm:text-lg" />
              </div>
              <h2 className="text-lg sm:text-xl sm:text-2xl font-normal bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Measurement Details
              </h2>
            </div>
            <button 
              onClick={() => {
                setShowImagePopup(false);
                setSelectedMeasurement(null);
              }} 
              className="p-1 sm:p-2 text-slate-400 hover:text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
            >
              <FiX className="text-lg sm:text-xl sm:text-2xl" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-4 sm:gap-8">
            {/* Image Section - Mobile Mini, Desktop Normal */}
            <div>
              <h3 className="text-sm sm:text-base sm:text-lg font-normal mb-2 sm:mb-3 sm:mb-4 text-slate-800">Measurement Image</h3>
              {selectedMeasurement.IMAGEURL ? (
                <div className="border sm:border-2 border-slate-300 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={selectedMeasurement.IMAGEURL}
                    alt="Measurement"
                    className="w-full h-auto max-h-48 sm:max-h-64 sm:max-h-96 object-contain"
                  />
                </div>
              ) : (
                <div className="border sm:border-2 border-dashed border-slate-300 rounded-xl sm:rounded-2xl h-32 sm:h-48 sm:h-64 flex items-center justify-center bg-slate-100">
                  <div className="text-center">
                    <FiImage className="text-slate-400 text-xl sm:text-3xl sm:text-4xl mx-auto mb-1 sm:mb-2" />
                    <p className="text-slate-500 text-xs sm:text-sm sm:text-base">No image available</p>
                  </div>
                </div>
              )}
              
              {selectedMeasurement.IMAGEURL && (
                <div className="mt-2 sm:mt-3 sm:mt-4 flex justify-center">
                  <a 
                    href={selectedMeasurement.IMAGEURL} 
                    download="measurement-image"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 sm:px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-lg sm:rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center font-normal text-xs sm:text-sm sm:text-base"
                  >
                    <FiPaperclip className="mr-1 sm:mr-1 sm:mr-2" />
                    Download
                  </a>
                </div>
              )}
            </div>

            {/* Measurement Details Section - Mobile Mini, Desktop Normal */}
            <div>
              <h3 className="text-sm sm:text-base sm:text-lg font-normal mb-2 sm:mb-3 sm:mb-4 text-slate-800">Measurement Details</h3>
              <div className="bg-slate-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 sm:p-6 border border-slate-200/50">
                <table className="w-full border-collapse text-xs sm:text-sm sm:text-base">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700 w-1/2">Measurement ID</td>
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-900">
                        {extractMeasurementId(selectedMeasurement)}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Garment Type</td>
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-900">
                        {getGarmentTypeName(selectedMeasurement.GarmentTypeId)}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Neck</td>
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 text-slate-900">
                        {selectedMeasurement.Neck ? `${selectedMeasurement.Neck}${window.innerWidth < 768 ? '"' : ' inches'}` : 'N/A'}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Chest</td>
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 text-slate-900">
                        {selectedMeasurement.Chest ? `${selectedMeasurement.Chest}${window.innerWidth < 768 ? '"' : ' inches'}` : 'N/A'}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Waist</td>
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 text-slate-900">
                        {selectedMeasurement.Waist ? `${selectedMeasurement.Waist}${window.innerWidth < 768 ? '"' : ' inches'}` : 'N/A'}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Length</td>
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 text-slate-900">
                        {selectedMeasurement.Length ? `${selectedMeasurement.Length}${window.innerWidth < 768 ? '"' : ' inches'}` : 'N/A'}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Yards Required</td>
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 text-slate-900">
                        {selectedMeasurement.YardsRequired ? `${selectedMeasurement.YardsRequired}${window.innerWidth < 768 ? ' yd' : ' yards'}` : 'N/A'}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Description</td>
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 text-slate-900">
                        {selectedMeasurement.Description || 'No description provided'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 font-normal text-slate-700">Customer</td>
                      <td className="py-1 sm:py-2 sm:py-3 px-2 sm:px-2 sm:px-4 text-slate-900">
                        {getCustomerName(extractCustomerId(selectedMeasurement))}
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
{/* Advance Amount Form Modal */}
      {showAdvanceForm && selectedOrderForAdvance && (
        <AdvanceAmountForm
          orderId={selectedOrderForAdvance.orderId}
          totalAmount={selectedOrderForAdvance.totalAmount}
          onSave={handleSaveAdvanceAmount}
          onClose={() => {
            setShowAdvanceForm(false);
            setSelectedOrderForAdvance(null);
            // setShowOrderModal(false);
            resetForm();
          }}
        />
      )}
{/* Bill Template Modal */}
{showBill && billData && (
  <PaymentReceipt
    orderData={billData}
    onClose={() => {
      setShowBill(false);
      setBillData(null);
      setSelectedOrderForBill(null);
    }}
    onDownloadPDF={downloadBillAsPDF}  
  />
)}

    </div>
  );
};

export default Orders;





// import React, { useState, useEffect } from "react";
// import { 
//   FiSearch, 
//   FiPlusSquare, 
//   FiEdit, 
//   FiX, 
//   FiEye, 
//   FiTrash2, 
//   FiRefreshCw, 
//   FiChevronLeft, 
//   FiChevronRight, 
//   FiArrowRight, 
//   FiArrowLeft, 
//   FiPaperclip, 
//   FiImage,
//   FiPackage,
//   FiChevronUp,
//   FiChevronDown,
//   FiCalendar,
//   FiDollarSign,
//   FiUser,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiClock,
//   FiUserPlus,
//   FiSave
// } from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
// import { GetOrders,
//   AddOrder,
//   AddOrderItem,
//   GetOrderItems,
//   UpdateStatusOrder,
//   UpdateStatusOrderItem,
//    PayAdvance  } from "../actions/orderAction";
// import { GetAllCustomers, AddCustomer } from "../actions/customerActions";
// import { GetAllGarmentType } from "../actions/garmentTypeAction";
// import { GetAllFabricType } from "../actions/fabricTypeAction";
// import AdvanceAmountForm from "./AdvanceAmountForm";
// import { GetMeasurementsByCustomerId, AddMeasurement, UpdateMeasurement, GetMeasurementByOrderId } from "../actions/measurementActions";
// import { FiPrinter } from "react-icons/fi"; // Add this to your existing Fi imports
// import PaymentReceipt from './PaymentReceipt';
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";


// const Orders = () => {
//   const dispatch = useDispatch();

//   const { responseBody: orders, loading } = useSelector((state) => state.orderList || {});
//   const { responseBody: customers = [] } = useSelector((state) => state.customerList || {});
//   const { responseBody: garmentTypes = [] } = useSelector((state) => state.garmentTypeList || {});
//   const { responseBody: fabricTypes = [] } = useSelector((state) => state.fabricTypeList || {});
  
//   // Access order items and measurements from proper Redux state
//   const orderItemsState = useSelector((state) => state.orderItemsGet || {});
//   const measurementsByOrderState = useSelector((state) => state.getMeasurementByOrderId || {});
//   const addOrderState = useSelector((state) => state.addOrder || {});

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [showAddItemModal, setShowAddItemModal] = useState(false);
//   const [editingOrderId, setEditingOrderId] = useState(null);
//   const [viewingOrder, setViewingOrder] = useState(null);
//   const [selectedOrderForItems, setSelectedOrderForItems] = useState(null);
//   const [orderItemsData, setOrderItemsData] = useState([]);
//   const [orderMeasurements, setOrderMeasurements] = useState([]);
//   const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [createdOrderId, setCreatedOrderId] = useState(null);
//   const [orderItemResults, setOrderItemResults] = useState([]);
//   const [failedOrderItems, setFailedOrderItems] = useState([]);
//   const [recentlyAddedOrders, setRecentlyAddedOrders] = useState([]);

//   // Status update state
//   const [updatingStatus, setUpdatingStatus] = useState(false);
//   const [statusUpdateOrderId, setStatusUpdateOrderId] = useState(null);
//   const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
//   const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);

//   // Order Item Status update state
//   const [updatingItemStatus, setUpdatingItemStatus] = useState(false);
//   const [statusUpdateOrderItemId, setStatusUpdateOrderItemId] = useState(null);
//   const [showItemStatusConfirmation, setShowItemStatusConfirmation] = useState(false);
//   const [pendingItemStatusUpdate, setPendingItemStatusUpdate] = useState(null);

//   // Status dropdown visibility state
//   const [showStatusDropdown, setShowStatusDropdown] = useState({});
//   const [showItemStatusDropdown, setShowItemStatusDropdown] = useState({});

//   // Image popup state
//   const [showImagePopup, setShowImagePopup] = useState(false);
//   const [selectedMeasurement, setSelectedMeasurement] = useState(null);

//   // Multi-step form state
//   const [currentStep, setCurrentStep] = useState(1);
//   const [savedOrderId, setSavedOrderId] = useState(null);
//   const [savedMeasurementIds, setSavedMeasurementIds] = useState([]);
//   const [tempMeasurementMap, setTempMeasurementMap] = useState(new Map());

//   // Store actual measurement data with their IDs
//   const [createdMeasurements, setCreatedMeasurements] = useState([]);

//   // Store garment type to measurement ID mapping
//   const [garmentTypeToMeasurementMap, setGarmentTypeToMeasurementMap] = useState(new Map());

//   // Store garment types from measurements for auto-population
//   const [garmentTypesFromMeasurements, setGarmentTypesFromMeasurements] = useState([]);

//   // Searchable customer dropdown state
//   const [customerSearch, setCustomerSearch] = useState("");
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

//   // Add these to your existing state declarations
// const [showAdvanceForm, setShowAdvanceForm] = useState(false);
// const [selectedOrderForAdvance, setSelectedOrderForAdvance] = useState(null);
// const [orderAdvanceData, setOrderAdvanceData] = useState({});

// // Add these to your existing state declarations
// const [showBill, setShowBill] = useState(false);
// const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);
// const [billData, setBillData] = useState(null);

//   // Notification state
//   const [notification, setNotification] = useState(null);

//   // Add Customer Modal State
//   const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
//   const [newCustomer, setNewCustomer] = useState({
//     FullName: "",
//     PhoneNumber: "",
//     Email: "",
//     Address: ""
//   });
//   const [addingCustomer, setAddingCustomer] = useState(false);
//   const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(true);

//   // Edit mode state
//   const [editMode, setEditMode] = useState(false);
//   const [editingMeasurements, setEditingMeasurements] = useState([]);
//   const [editingOrderItems, setEditingOrderItems] = useState([]);

//   // Hideable dropdown state for measurements
//   const [expandedMeasurements, setExpandedMeasurements] = useState({});

//   // Edit measurement state
//   const [editingMeasurementId, setEditingMeasurementId] = useState(null);
//   const [editingMeasurementData, setEditingMeasurementData] = useState({});

//   // Edit order items state
//   const [editingOrderItemId, setEditingOrderItemId] = useState(null);
//   const [editingOrderItemData, setEditingOrderItemData] = useState({});

//   // Bulk status updates state
//   const [bulkStatusUpdates, setBulkStatusUpdates] = useState({});
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // Order Details
//   const [orderData, setOrderData] = useState({
//   CustomerId: "",
//   OrderDate: new Date().toISOString().slice(0, 10),
//   DeliveryDate: "",
//   Status: "In Progress", // Changed from "pending"
// });

//   // For new order items (when creating order) - REMOVED quantity
//   const [newItems, setNewItems] = useState([{ 
//     garmentTypeId: "", 
//     fabricTypeId: "", 
//     price: "", 
//     measurementId: "" // This will be auto-populated
//   }]);

//   // For adding items to existing order - REMOVED quantity
//   const [orderItemsToAdd, setOrderItemsToAdd] = useState([{ 
//     garmentTypeId: "", 
//     fabricTypeId: "", 
//     price: "", 
//     measurementId: ""
//   }]);

//   // For new measurements (when creating order)
//   const [newMeasurements, setNewMeasurements] = useState([{
//     GarmentTypeId: "",
//     Neck: "",
//     Chest: "",
//     Waist: "",
//     Length: "",
//     YardsRequired: "",
//     Description: "",
//     file: "",
//     OrderId: "",
//     CustomerId: "",
//   }]);

//   // NEW: Track changes for save button
//   const [orderChanges, setOrderChanges] = useState({});
//   const [measurementChanges, setMeasurementChanges] = useState({});
//   const [orderItemChanges, setOrderItemChanges] = useState({});
//   const [hasChanges, setHasChanges] = useState(false);

//   // Delivery Date Validation Function
//   const validateDeliveryDate = (date) => {
//     if (!date) return true; // Allow empty for optional validation
    
//     const selectedDate = new Date(date);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    
//     if (selectedDate < today) {
//       setNotification({ type: 'error', message: "Delivery date cannot be in the past. Please select a future date." });
      
//       // Clear the invalid date
//       if (editMode) {
//         setOrderData(prev => ({ ...prev, DeliveryDate: "" }));
//       } else {
//         setOrderData(prev => ({ ...prev, DeliveryDate: "" }));
//       }
//       return false;
//     }
//     return true;
//   };

//   // UPDATED: Validation function for amounts and measurements - only prevent negative numbers
//   const validatePositiveNumber = (value, fieldName) => {
//     if (value === "" || value === null || value === undefined) return true; // Allow empty for optional fields
    
//     // Convert to number
//     const numValue = parseFloat(value);
    
//     // Allow 0 and positive numbers, only prevent negative numbers
//     if (isNaN(numValue) || numValue < 0) {
//       setNotification({ type: 'error', message: `${fieldName} cannot be negative` });
//       return false;
//     }
//     return true;
//   };

//   // Phone number validation function
//   const validatePhoneNumber = (phone) => {
//     if (!phone) return true; // Allow empty for optional field
    
//     // Check if it's numeric and max 10 digits
//     if (!/^\d+$/.test(phone)) {
//       setNotification({ type: 'error', message: "Phone number must contain numbers only" });
//       return false;
//     }
    
//     if (phone.length > 10) {
//       setNotification({ type: 'error', message: "Phone number cannot exceed 10 digits" });
//       return false;
//     }
    
//     return true;
//   };

// // Enhanced handleNewItemChange with integer-only validation
// const handleNewItemChange = (index, e) => {
//   const { name, value } = e.target;
  
//   // Validate price field - only allow integers
//   if (name === 'price' && value !== "") {
//     // Only allow numbers, no decimals
//     if (!/^\d*$/.test(value)) {
//       setNotification({ type: 'error', message: 'Price must be a whole number (no decimals)' });
//       return;
//     }
    
//     // Validate positive number
//     const numValue = parseInt(value);
//     if (isNaN(numValue) || numValue < 0) {
//       setNotification({ type: 'error', message: 'Price cannot be negative' });
//       return;
//     }
//   }
  
//   const updatedItems = [...newItems];
//   updatedItems[index][name] = value;
  
//   // If garment type changes, try to auto-populate measurement ID
//   if (name === 'garmentTypeId' && value) {
//     const measurementId = garmentTypeToMeasurementMap.get(parseInt(value));
//     if (measurementId) {
//       updatedItems[index].measurementId = measurementId.toString();
//       console.log(`🔄 Auto-populated measurement ID ${measurementId} for garment type ${value}`);
//     }
//   }
  
//   setNewItems(updatedItems);
// };

// // Enhanced handleNewMeasurementChange with YardsRequired validation
// const handleNewMeasurementChange = (index, e) => {
//   const { name, value } = e.target;
  
//   // Validate measurement fields (Neck, Chest, Waist, Length, YardsRequired) - only prevent negative
//   if (['Neck', 'Chest', 'Waist', 'Length', 'YardsRequired'].includes(name) && value !== "") {
//     if (!validatePositiveNumber(value, name)) return;
//   }
  
//   const updatedMeasurements = [...newMeasurements];
//   updatedMeasurements[index][name] = value;
//   setNewMeasurements(updatedMeasurements);
// };

// // Enhanced handleEditOrderItemChange with integer-only validation
// const handleEditOrderItemChange = (e) => {
//   const { name, value } = e.target;
  
//   // Validate price field - only allow integers
//   if (name === 'price' && value !== "") {
//     // Only allow numbers, no decimals
//     if (!/^\d*$/.test(value)) {
//       setNotification({ type: 'error', message: 'Price must be a whole number (no decimals)' });
//       return;
//     }
    
//     // Validate positive number
//     const numValue = parseInt(value);
//     if (isNaN(numValue) || numValue < 0) {
//       setNotification({ type: 'error', message: 'Price cannot be negative' });
//       return;
//     }
//   }
  
//   setEditingOrderItemData(prev => ({
//     ...prev,
//     [name]: value
//   }));
  
//   // Track changes
//   setOrderItemChanges(prev => ({
//     ...prev,
//     [editingOrderItemId]: true
//   }));
//   setHasChanges(true);
// };

//   // Enhanced handleEditMeasurementChange with validation
// const handleEditMeasurementChange = (e) => {
//   const { name, value } = e.target;
  
//   // Validate measurement fields - only prevent negative
//   if (['Neck', 'Chest', 'Waist', 'Length', 'YardsRequired'].includes(name) && value !== "") {
//     if (!validatePositiveNumber(value, name)) return;
//   }
  
//   setEditingMeasurementData(prev => ({
//     ...prev,
//     [name]: value
//   }));
  
//   // Track changes
//   setMeasurementChanges(prev => ({
//     ...prev,
//     [editingMeasurementId]: true
//   }));
//   setHasChanges(true);
// };

// // In your handleStatusChangeInEdit function, add this case:
// const handleStatusChangeInEdit = async (newStatus) => {
//   if (!viewingOrder) return;
  
//   try {
//     setUpdatingStatus(true);
    
//     const orderPayload = {
//       OrderId: extractOrderId(viewingOrder),
//       CustomerId: parseInt(orderData.CustomerId),
//       OrderDate: orderData.OrderDate,
//       DeliveryDate: orderData.DeliveryDate,
//       Status: newStatus,
//       TotalAmount: calculateEditingTotalAmount(),
//     };

//     console.log("🔄 Updating order status:", orderPayload);
    
//     // Make the API call
//     await dispatch(UpdateStatusOrder(orderPayload));
    
//     // Show success notification
//     setNotification({ 
//       type: 'success', 
//       message: `Order status updated to ${newStatus} successfully!` 
//     });
    
//     // Refresh orders list immediately
//     dispatch(GetOrders());
    
//     // Update local state to reflect the change immediately
//     setOrderData(prev => ({ ...prev, Status: newStatus }));
    
//     // If status changed to Completed, close the form
//     if (newStatus === 'Completed') {
//       setShowOrderModal(false);
//       setEditMode(false);
//       setViewingOrder(null);
//       resetForm();
//     }
    
//   } catch (error) {
//     console.error("❌ Error updating order status:", error);
//     setNotification({ 
//       type: 'error', 
//       message: `Error updating status: ${error.message}` 
//     });
//   } finally {
//     setUpdatingStatus(false);
//   }
// };

// // CORRECT: Handle advance amount saving with API call
// const handleSaveAdvanceAmount = async (advanceData) => {
//   try {
//     setSaving(true);
    
//     console.log("💰 Processing advance payment:", advanceData);
    
//     // Make API call to save advance amount
//     const result = await dispatch(PayAdvance(
//       advanceData.orderId, 
//       advanceData.advanceAmount
//     ));
    
//     console.log("📦 PayAdvance API response:", result);
    
//     if (result && result.success) {
//       // Update the order with advance amount data
//       setOrderAdvanceData(prev => ({
//         ...prev,
//         [advanceData.orderId]: {
//           AdvanceAmount: advanceData.advanceAmount,
//           BalanceAmount: advanceData.balanceAmount
//         }
//       }));
      
//       setNotification({ 
//         type: 'success', 
//         message: `Advance amount of Rs. ${advanceData.advanceAmount.toLocaleString('en-IN')} saved successfully for Order #${advanceData.orderId}!` 
//       });
      
//       // Refresh orders list to show updated advance amount
//       dispatch(GetOrders());
      
//     } else {
//       const errorMsg = result?.error || 'Failed to save advance amount';
//       setNotification({ 
//         type: 'error', 
//         message: `Error saving advance amount: ${errorMsg}` 
//       });
//     }
    
//     // Close the advance form regardless of success/failure
//     setShowAdvanceForm(false);
//     setSelectedOrderForAdvance(null);
    
//   } catch (error) {
//     console.error("❌ Error saving advance amount:", error);
//     setNotification({ 
//       type: 'error', 
//       message: `Error saving advance amount: ${error.message}` 
//     });
//     setShowAdvanceForm(false);
//     setSelectedOrderForAdvance(null);
//   } finally {
//     setSaving(false);
//   }
// };

// // Handle Pay Balance Amount
// const handlePayBalance = async (order) => {
//   if (!order) return;
  
//   const orderId = extractOrderId(order);
//   const balanceAmount = getOrderAdvanceData(orderId).BalanceAmount;
  
//   if (balanceAmount <= 0) {
//     setNotification({ type: 'error', message: 'No balance amount to pay' });
//     return;
//   }

//   try {
//     setSaving(true);
    
//     console.log("💰 Processing balance payment:", { 
//       orderId: orderId, 
//       balanceAmount: balanceAmount 
//     });
    
//     // Make API call to pay balance amount
//     const result = await dispatch(PayAdvance(orderId, balanceAmount));
    
//     console.log("📦 PayBalance API response:", result);
    
//     if (result && result.success) {
//       // Update the order with new advance amount (now equal to total amount)
//       const totalAmount = getOrderTotalAmount(order);
//       setOrderAdvanceData(prev => ({
//         ...prev,
//         [orderId]: {
//           AdvanceAmount: totalAmount, // Full amount paid
//           BalanceAmount: 0 // No balance left
//         }
//       }));
      
//       // Update order status to Delivered
// const statusResult = await dispatch(UpdateStatusOrder({
//   OrderId: parseInt(orderId),
//   Status: 'delivered'
// }));
      
//       setNotification({ 
//         type: 'success', 
//         message: `Balance amount of Rs. ${balanceAmount.toLocaleString('en-IN')} paid successfully! Order #${orderId} marked as Completed.` 
//       });
      
//       // Refresh orders list to show updated status and amounts
//       dispatch(GetOrders());
      
//       // If we're in edit mode, update the local status
// if (editMode) {
//   setOrderData(prev => ({ ...prev, Status: 'delivered' }));
// }
      
//     } else {
//       const errorMsg = result?.error || 'Failed to pay balance amount';
//       setNotification({ 
//         type: 'error', 
//         message: `Error paying balance amount: ${errorMsg}` 
//       });
//     }
    
//   } catch (error) {
//     console.error("❌ Error paying balance amount:", error);
//     setNotification({ 
//       type: 'error', 
//       message: `Error paying balance amount: ${error.message}` 
//     });
//   } finally {
//     setSaving(false);
//   }
// };

// // UPDATED: Handle order data changes for edit mode
// const handleOrderDataChange = (e) => {
//   const { name, value } = e.target;
  
//   // Special handling for delivery date validation
//   if (name === 'DeliveryDate') {
//     if (!validateDeliveryDate(value)) return;
//   }
  
//   // Special handling for status - use the dedicated function
//   if (name === 'Status') {
//     handleStatusChangeInEdit(value);
//     return; // Don't update state here, let the dedicated function handle it
//   }
  
//   setOrderData(prev => ({
//     ...prev,
//     [name]: value
//   }));
  
//   // Track changes (except for status which is handled separately)
//   if (name !== 'Status') {
//     setOrderChanges(prev => ({
//       ...prev,
//       [name]: true
//     }));
//     setHasChanges(true);
//   }
// };

//   useEffect(() => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const searchParam = urlParams.get('search');
//   const exactMatch = urlParams.get('exact') === 'true';
  
//   if (searchParam) {
//     if (exactMatch) {
//       // ✅ Exact match search - only show orders with exact Order ID
//       setSearchTerm(searchParam);
//       setNotification({ 
//         type: 'success', 
//         message: `Showing exact match for Order #${searchParam}` 
//       });
//     } else {
//       // Regular search (existing behavior)
//       setSearchTerm(searchParam);
//       setNotification({ 
//         type: 'success', 
//         message: `Showing orders matching: ${searchParam}` 
//       });
//     }
//   }
// }, []);

//   // Auto-hide notification
//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => setNotification(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   // UPDATED: Handle Add Customer with proper validation
//   const handleAddCustomer = async () => {
//     if (!newCustomer.FullName.trim()) {
//       setNotification({ type: 'error', message: "Please enter customer name" });
//       return;
//     }

//     // Validate phone number
//     if (newCustomer.PhoneNumber && !validatePhoneNumber(newCustomer.PhoneNumber)) {
//       return;
//     }

//     setAddingCustomer(true);
//     try {
//       const customerPayload = {
//         FullName: newCustomer.FullName,
//         PhoneNumber: newCustomer.PhoneNumber || "",
//         Email: newCustomer.Email || "",
//         Address: newCustomer.Address || ""
//       };

//       console.log("🔄 Adding customer with payload:", customerPayload);
      
//       const result = await dispatch(AddCustomer(customerPayload));
      
//       console.log("🔍 FULL API RESPONSE STRUCTURE:", JSON.stringify(result, null, 2));
      
//       setNotification({ type: 'success', message: "Customer added successfully!" });
      
//       // Refresh customers list
//       dispatch(GetAllCustomers());
      
//       // Close the add customer modal
//       setShowAddCustomerModal(false);
      
//       // Reset new customer form
//       setNewCustomer({
//         FullName: "",
//         PhoneNumber: "",
//         Email: "",
//         Address: ""
//       });

//       // Automatically open the order form
//       setTimeout(() => {
//         openAddModal();
//       }, 500);
      
//     } catch (error) {
//       console.error("❌ Error adding customer:", error);
//       setNotification({ type: 'error', message: `Error adding customer: ${error.message}` });
//     } finally {
//       setAddingCustomer(false);
//     }
//   };

//   // Toggle measurements dropdown
//   const toggleMeasurementsDropdown = (orderId) => {
//     setExpandedMeasurements(prev => ({
//       ...prev,
//       [orderId]: !prev[orderId]
//     }));
//   };

//   // Handle Edit Measurement
//   const handleEditMeasurement = (measurement) => {
//     setEditingMeasurementId(extractMeasurementId(measurement));
//     setEditingMeasurementData({
//       GarmentTypeId: measurement.GarmentTypeId,
//       Neck: measurement.Neck || "",
//       Chest: measurement.Chest || "",
//       Waist: measurement.Waist || "",
//       Length: measurement.Length || "",
//       YardsRequired: measurement.YardsRequired || "",
//       Description: measurement.Description || ""
//     });
//   };

//   // Handle Update Measurement
//   const handleUpdateMeasurement = async () => {
//     if (!editingMeasurementId) return;

//     // Validate measurement data - only prevent negative
//     const measurementFields = ['Neck', 'Chest', 'Waist', 'Length', 'YardsRequired'];
//     for (const field of measurementFields) {
//       if (editingMeasurementData[field] && !validatePositiveNumber(editingMeasurementData[field], field)) {
//         return;
//       }
//     }

//     try {
//       setSaving(true);
      
//       const updatePayload = {
//         MeasurementId: editingMeasurementId,
//         GarmentTypeId: editingMeasurementData.GarmentTypeId,
//         Neck: editingMeasurementData.Neck ? parseFloat(editingMeasurementData.Neck) : 0,
//         Chest: editingMeasurementData.Chest ? parseFloat(editingMeasurementData.Chest) : 0,
//         Waist: editingMeasurementData.Waist ? parseFloat(editingMeasurementData.Waist) : 0,
//         YardsRequired: editingMeasurementData.YardsRequired ? parseFloat(editingMeasurementData.YardsRequired) : 0,
//         Length: editingMeasurementData.Length ? parseFloat(editingMeasurementData.Length) : 0,
//         Description: editingMeasurementData.Description || "",
//         CustomerId: orderData.CustomerId
//       };

//       console.log("🔄 Updating measurement:", updatePayload);
      
//       const result = await dispatch(UpdateMeasurement(updatePayload));
      
//       if (result && (result.success || result.status === 200)) {
//         setNotification({ type: 'success', message: "Measurement updated successfully!" });
        
//         // Refresh measurements based on current context
//         if (viewingOrder) {
//           const orderId = extractOrderId(viewingOrder);
//           dispatch(GetMeasurementByOrderId(orderId));
//         }
        
//         // Reset editing state and clear changes
//         setEditingMeasurementId(null);
//         setEditingMeasurementData({});
//         setMeasurementChanges(prev => {
//           const newChanges = { ...prev };
//           delete newChanges[editingMeasurementId];
//           return newChanges;
//         });
        
//         // Check if all changes are saved
//         checkAllChangesSaved();
//       } else {
//         setNotification({ type: 'error', message: "Failed to update measurement" });
//       }
//     } catch (error) {
//       console.error("❌ Error updating measurement:", error);
//       setNotification({ type: 'error', message: `Error updating measurement: ${error.message}` });
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Cancel measurement edit
//   const cancelMeasurementEdit = () => {
//     setEditingMeasurementId(null);
//     setEditingMeasurementData({});
//   };

//   // Handle Edit Order Item
//   const handleEditOrderItem = (item) => {
//     console.log('Edit item:', item);
//     setEditingOrderItemId(extractOrderItemId(item));
//     setEditingOrderItemData({
//       garmentTypeId: item.GarmentTypeId || item.garmentTypeId,
//       fabricTypeId: item.FabricTypeId || item.fabricTypeId,
//       price: item.Price || item.price,
//       measurementId: item.MeasurementId || item.measurementId
//     });
//   };

//   // Handle Update Order Item
//   const handleUpdateOrderItem = async () => {
//     if (!editingOrderItemId) return;

//     // Validate price - only prevent negative
//     if (editingOrderItemData.price && !validatePositiveNumber(editingOrderItemData.price, 'Price')) {
//       return;
//     }

//     try {
//       setSaving(true);
      
//       const itemUpdatePayload = {
//         OrderItemId: editingOrderItemId,
//         GarmentTypeId: parseInt(editingOrderItemData.garmentTypeId),
//         FabricTypeId: parseInt(editingOrderItemData.fabricTypeId),
//         Price: parseFloat(editingOrderItemData.price),
//         MeasurementId: parseInt(editingOrderItemData.measurementId)
//       };

//       console.log("🔄 Updating order item:", itemUpdatePayload);
      
//       // For now, just update status or handle differently
//       const result = await dispatch(UpdateStatusOrderItem(itemUpdatePayload));
      
//       if (result && (result.Result === "Success!!" || result.status === 200 || result.StatusCode === 200)) {
//         setNotification({ type: 'success', message: "Order item updated successfully!" });
        
//         // Refresh order items
//         if (viewingOrder) {
//           dispatch(GetOrderItems(extractOrderId(viewingOrder)));
//         }
        
//         // Reset editing state and clear changes
//         setEditingOrderItemId(null);
//         setEditingOrderItemData({});
//         setOrderItemChanges(prev => {
//           const newChanges = { ...prev };
//           delete newChanges[editingOrderItemId];
//           return newChanges;
//         });
        
//         // Check if all changes are saved
//         checkAllChangesSaved();
//       } else {
//         setNotification({ type: 'error', message: "Failed to update order item" });
//       }
//     } catch (error) {
//       console.error("❌ Error updating order item:", error);
//       setNotification({ type: 'error', message: `Error updating order item: ${error.message}` });
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Cancel order item edit
//   const cancelOrderItemEdit = () => {
//     setEditingOrderItemId(null);
//     setEditingOrderItemData({});
//   };

//   // Handle Edit Order
//   const handleEditOrder = async (order) => {
//     setViewingOrder(order);
//     setEditingOrderId(extractOrderId(order));
//     setEditMode(true);
//     setShowOrderModal(true);
//     setLoadingOrderDetails(true);
    
//     // Reset changes tracking
//     setOrderChanges({});
//     setMeasurementChanges({});
//     setOrderItemChanges({});
//     setHasChanges(false);

//     // Set order data for editing
//     setOrderData({
//       CustomerId: extractCustomerId(order),
//       OrderDate: formatDate(order.OrderDate),
//       DeliveryDate: formatDate(order.DeliveryDate),
//       Status: order.Status,
//     });

//     // Load order details for editing
//     await loadOrderDetailsForEdit(order);
//   };

//   const loadOrderDetailsForEdit = async (order) => {
//     try {
//       const orderId = extractOrderId(order);
      
//       console.log("🔄 Loading order details for edit - Order ID:", orderId);
      
//       // Load order items and measurements for this specific order
//       await Promise.all([
//         dispatch(GetOrderItems(orderId)),
//         dispatch(GetMeasurementByOrderId(orderId))
//       ]);
      
//       console.log("✅ Edit mode data loading completed for order:", orderId);
      
//       setLoadingOrderDetails(false);
//     } catch (error) {
//       console.error("❌ Error loading order details for edit:", error);
//       setLoadingOrderDetails(false);
//     }
//   };

//   // NEW: Check if all changes are saved
//   const checkAllChangesSaved = () => {
//     const hasOrderChanges = Object.keys(orderChanges).length > 0;
//     const hasMeasurementChanges = Object.keys(measurementChanges).length > 0;
//     const hasOrderItemChanges = Object.keys(orderItemChanges).length > 0;
//     const hasBulkStatusChanges = Object.keys(bulkStatusUpdates).length > 0;
    
//     setHasChanges(hasOrderChanges || hasMeasurementChanges || hasOrderItemChanges || hasBulkStatusChanges);
//   };

//   // FIXED: Save all changes with proper success detection and auto-close
//   const saveAllChanges = async () => {
//     try {
//       setSaving(true);
//       let savedCount = 0;
//       let errorCount = 0;

//       // Save order changes
//       if (Object.keys(orderChanges).length > 0 && viewingOrder) {
//         try {
//           const orderPayload = {
//             OrderId: extractOrderId(viewingOrder),
//             CustomerId: parseInt(orderData.CustomerId),
//             OrderDate: orderData.OrderDate,
//             DeliveryDate: orderData.DeliveryDate,
//             Status: orderData.Status,
//             TotalAmount: calculateEditingTotalAmount(),
//           };

//           console.log("🔄 Saving order updates:", orderPayload);
          
//           const result = await dispatch(UpdateStatusOrder(orderPayload));
          
//           if (result && !result.error) {
//             savedCount++;
//             setOrderChanges({});
//             console.log("✅ Order changes saved successfully");
//           } else {
//             errorCount++;
//             console.warn("⚠️ Order changes failed:", result);
//           }
//         } catch (error) {
//           errorCount++;
//           console.error("❌ Error saving order changes:", error);
//         }
//       }

//       // Save bulk status changes
//       if (Object.keys(bulkStatusUpdates).length > 0) {
//         const updates = Object.entries(bulkStatusUpdates);
        
//         for (const [orderItemId, newStatus] of updates) {
//           try {
//             const updateData = {
//               OrderItemId: parseInt(orderItemId),
//               Status: newStatus
//             };
            
//             const result = await dispatch(UpdateStatusOrderItem(updateData));
            
//             if (result && !result.error) {
//               savedCount++;
              
//               // Update local state immediately
//               if (editMode) {
//                 setEditingOrderItems(prev => prev.map(item => 
//                   extractOrderItemId(item) === parseInt(orderItemId) 
//                     ? { ...item, Status: newStatus }
//                     : item
//                 ));
//               } else {
//                 setOrderItemsData(prev => prev.map(item => 
//                   extractOrderItemId(item) === parseInt(orderItemId) 
//                     ? { ...item, Status: newStatus }
//                     : item
//                 ));
//               }
//             } else {
//               errorCount++;
//               console.warn(`⚠️ Order item ${orderItemId} update failed:`, result);
//             }
            
//             await new Promise(resolve => setTimeout(resolve, 100));
//           } catch (error) {
//             errorCount++;
//             console.error(`❌ Error updating order item ${orderItemId}:`, error);
//           }
//         }
        
//         // Reset bulk status updates
//         setBulkStatusUpdates({});
//         setHasUnsavedChanges(false);
//       }

//       // Refresh data
//       setTimeout(() => {
//         if (viewingOrder) {
//           dispatch(GetOrderItems(extractOrderId(viewingOrder)));
//         }
//         dispatch(GetOrders());
//       }, 1000);

//       // ✅ FIXED NOTIFICATION LOGIC - Show success for any saved changes
//       if (savedCount > 0) {
//         setNotification({ 
//           type: 'success', 
//           message: `Order #${extractOrderId(viewingOrder)} updated successfully! ${savedCount} change(s) saved.` 
//         });
//         setHasChanges(false);
        
//         // ✅ AUTO-CLOSE THE MODAL AFTER SUCCESSFUL SAVE
//         setTimeout(() => {
//           setShowOrderModal(false);
//           setEditMode(false);
//           setViewingOrder(null);
//           resetForm();
//         }, 1500);
        
//       } else if (errorCount > 0) {
//         setNotification({ 
//           type: 'error', 
//           message: `Failed to save ${errorCount} change(s). Please try again.` 
//         });
//       }
//       // If no changes were made, don't show any notification
      
//     } catch (error) {
//       console.error("❌ Error saving all changes:", error);
//       setNotification({ 
//         type: 'error', 
//         message: `Error saving changes: ${error.message}` 
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Handle Save Order from Edit Form
//   const handleSaveOrder = async () => {
//     if (!viewingOrder) return;

//     try {
//       setSaving(true);
      
//       const orderPayload = {
//         OrderId: extractOrderId(viewingOrder),
//         CustomerId: parseInt(orderData.CustomerId),
//         OrderDate: orderData.OrderDate,
//         DeliveryDate: orderData.DeliveryDate,
//         Status: orderData.Status,
//         TotalAmount: calculateEditingTotalAmount(),
//       };

//       console.log("🔄 Saving order updates:", orderPayload);
      
//       const result = await dispatch(UpdateStatusOrder(orderPayload));
      
//       console.log("📦 Order update response:", result);
      
//       // BETTER SUCCESS CHECKING
//       const isSuccess = 
//         result?.success === true ||
//         result?.status === 200 ||
//         result?.StatusCode === 200 ||
//         result?.payload?.success === true ||
//         result?.payload?.status === 200 ||
//         result?.payload?.StatusCode === 200 ||
//         result?.Result === "Success!!" ||
//         result?.payload?.Result === "Success!!" ||
//         (result && typeof result === 'object' && 'OrderId' in result) ||
//         (result?.payload && typeof result.payload === 'object' && 'OrderId' in result.payload);

//       if (isSuccess) {
//         setNotification({ type: 'success', message: "Order updated successfully!" });
        
//         // Refresh orders list
//         dispatch(GetOrders());
        
//         // Clear changes
//         setOrderChanges({});
//         setHasChanges(false);
        
//         // Close modal with delay to show success message
//         setTimeout(() => {
//           setShowOrderModal(false);
//           setEditMode(false);
//           setViewingOrder(null);
//           resetForm();
//         }, 1000);
//       } else {
//         const errorMsg = result?.error || result?.message || result?.payload?.error || 'Failed to update order';
//         console.warn("⚠️ Order update failed:", result);
//         setNotification({ type: 'error', message: errorMsg });
//       }
//     } catch (error) {
//       console.error("❌ Error updating order:", error);
//       setNotification({ type: 'error', message: `Error updating order: ${error.message}` });
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Handle individual status change for order items
//   const handleIndividualStatusChange = (orderItemId, newStatus) => {
//     setBulkStatusUpdates(prev => ({
//       ...prev,
//       [orderItemId]: newStatus
//     }));
//     setHasUnsavedChanges(true);
//     setHasChanges(true);
//   };

//   // Save all status changes
//   const saveAllStatusChanges = async () => {
//     if (!hasUnsavedChanges || Object.keys(bulkStatusUpdates).length === 0) return;
    
//     try {
//       setSaving(true);
//       const updates = Object.entries(bulkStatusUpdates);
//       let successCount = 0;
//       let errorCount = 0;
      
//       // Process updates sequentially
//       for (const [orderItemId, newStatus] of updates) {
//         try {
//           const updateData = {
//             OrderItemId: parseInt(orderItemId),
//             Status: newStatus
//           };
          
//           console.log("🔄 Updating order item status:", updateData);
          
//           // Dispatch and wait for the response
//           const result = await dispatch(UpdateStatusOrderItem(updateData));
          
//           console.log("📦 Dispatch Response:", result);
          
//           // Check for success
//           if (result && result.success === true) {
//             successCount++;
//             console.log(`✅ Successfully updated order item ${orderItemId} to ${newStatus}`);
            
//             // Update local state immediately
//             if (editMode && viewingOrder) {
//               setEditingOrderItems(prev => prev.map(item => {
//                 const itemId = extractOrderItemId(item);
//                 if (itemId === parseInt(orderItemId)) {
//                   console.log(`🔄 Updating local state for item ${itemId} to ${newStatus}`);
//                   return { ...item, Status: newStatus };
//                 }
//                 return item;
//               }));
//             } else if (viewingOrder) {
//               setOrderItemsData(prev => prev.map(item => {
//                 const itemId = extractOrderItemId(item);
//                 if (itemId === parseInt(orderItemId)) {
//                   console.log(`🔄 Updating local state for item ${itemId} to ${newStatus}`);
//                   return { ...item, Status: newStatus };
//                 }
//                 return item;
//               }));
//             }
//           } else {
//             errorCount++;
//             console.error(`❌ Failed to update order item ${orderItemId}:`, result);
//             const errorMsg = result?.error || result?.msg || 'Unknown error';
//             setNotification({ type: 'error', message: `Failed to update item ${orderItemId}: ${errorMsg}` });
//           }
          
//           // Small delay between requests to avoid overwhelming the API
//           await new Promise(resolve => setTimeout(resolve, 100));
//         } catch (error) {
//           errorCount++;
//           console.error(`❌ Error updating order item ${orderItemId}:`, error);
//           setNotification({ type: 'error', message: `Error updating item ${orderItemId}: ${error.message}` });
//         }
//       }
      
//       // Show results
//       if (errorCount === 0 && successCount > 0) {
//         setNotification({ type: 'success', message: `All ${successCount} status updates saved successfully!` });
//       } else if (errorCount > 0) {
//         setNotification({ type: 'warning', message: `${successCount} updates successful, ${errorCount} failed` });
//       }
      
//       // Reset state regardless of outcome
//       setBulkStatusUpdates({});
//       setHasUnsavedChanges(false);
//       checkAllChangesSaved();
      
//     } catch (error) {
//       console.error("❌ Error saving status changes:", error);
//       setNotification({ type: 'error', message: `Error saving status changes: ${error.message}` });
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Function to handle status dropdown toggle
//   const toggleStatusDropdown = (orderId) => {
//     setShowStatusDropdown(prev => ({
//       ...prev,
//       [orderId]: !prev[orderId]
//     }));
//   };

//   // Function to update order status with confirmation
//   const handleStatusChange = (orderId, currentStatus, newStatus) => {
//     if (currentStatus === newStatus) {
//       setShowStatusDropdown(prev => ({ ...prev, [orderId]: false }));
//       return; // Don't do anything if status hasn't changed
//     }
    
//     setPendingStatusUpdate({ orderId, newStatus });
//     setShowStatusConfirmation(true);
//     setShowStatusDropdown(prev => ({ ...prev, [orderId]: false }));
//   };

//   // Function to confirm and execute status update
//   const confirmStatusUpdate = async () => {
//     if (!pendingStatusUpdate) return;
    
//     const { orderId, newStatus } = pendingStatusUpdate;
    
//     try {
//       setUpdatingStatus(true);
//       setStatusUpdateOrderId(orderId);
      
//       const updateData = {
//         OrderId: orderId,
//         Status: newStatus
//       };
      
//       console.log("🔄 Updating order status:", updateData);
      
//       const result = await dispatch(UpdateStatusOrder(updateData));
      
//       // Better error handling that checks for actual success
//       if (result && (result.success === true || result.payload?.success === true || result.status === 200 || result.payload?.status === 200)) {
//         console.log("✅ Status update successful:", result);
//         setNotification({ type: 'success', message: `Order #${orderId} status updated to ${newStatus} successfully!` });
//         // Refresh orders list to show updated status
//         dispatch(GetOrders());
//       } else {
//         const errorMsg = result?.payload?.error || result?.error || result?.message || 
//                         result?.payload?.message || result?.data?.message || 'Status update failed';
//         console.warn("⚠️ Status update response:", result);
        
//         if (errorMsg !== 'Unknown error occurred' && errorMsg !== 'Status update failed') {
//           setNotification({ type: 'error', message: `Status update error: ${errorMsg}` });
//         } else {
//           setNotification({ type: 'success', message: `Order #${orderId} status updated successfully!` });
//           // Refresh anyway as the update might have succeeded
//           dispatch(GetOrders());
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error updating order status:", error);
//       setNotification({ type: 'error', message: `Error updating status: ${error.message}` });
//     } finally {
//       setUpdatingStatus(false);
//       setStatusUpdateOrderId(null);
//       setShowStatusConfirmation(false);
//       setPendingStatusUpdate(null);
//     }
//   };

//   // Function to handle order item status dropdown toggle
//   const toggleItemStatusDropdown = (orderItemId) => {
//     setShowItemStatusDropdown(prev => ({
//       ...prev,
//       [orderItemId]: !prev[orderItemId]
//     }));
//   };

//   // Function to update order item status
//   const handleItemStatusChange = (orderItemId, currentStatus, newStatus) => {
//     if (currentStatus === newStatus) {
//       setShowItemStatusDropdown(prev => ({ ...prev, [orderItemId]: false }));
//       return;
//     }
    
//     setPendingItemStatusUpdate({ orderItemId, newStatus });
//     setShowItemStatusConfirmation(true);
//     setShowItemStatusDropdown(prev => ({ ...prev, [orderItemId]: false }));
//   };

//   // Function to confirm and execute order item status update
//   const confirmItemStatusUpdate = async () => {
//     if (!pendingItemStatusUpdate) return;
    
//     const { orderItemId, newStatus } = pendingItemStatusUpdate;
    
//     try {
//       setUpdatingItemStatus(true);
//       setStatusUpdateOrderItemId(orderItemId);
      
//       const updateData = {
//         OrderItemId: orderItemId,
//         Status: newStatus
//       };
      
//       console.log("🔄 Updating order item status:", updateData);
      
//       const result = await dispatch(UpdateStatusOrderItem(updateData));
      
//       // Handle the response structure with Result: "Success!!"
//       if (result && (result.Result === "Success!!" || result.status === 200 || result.StatusCode === 200)) {
//         console.log("✅ Order item status update successful:", result);
//         setNotification({ type: 'success', message: `Order item status updated to ${newStatus} successfully!` });
        
//         // Force refresh order items with a small delay to ensure backend is updated
//         setTimeout(() => {
//           if (viewingOrder) {
//             console.log("🔄 Force refreshing order items after status update");
//             dispatch(GetOrderItems(extractOrderId(viewingOrder)));
//           }
//         }, 500);
        
//         // Also update the local state immediately for better UX
//         if (editMode) {
//           setEditingOrderItems(prev => prev.map(item => 
//             extractOrderItemId(item) === orderItemId 
//               ? { ...item, Status: newStatus }
//               : item
//           ));
//         } else {
//           setOrderItemsData(prev => prev.map(item => 
//             extractOrderItemId(item) === orderItemId 
//               ? { ...item, Status: newStatus }
//               : item
//           ));
//         }
        
//       } else {
//         const errorMsg = result?.payload?.error || result?.error || result?.message || 
//                         result?.payload?.message || result?.data?.message || 'Status update failed';
        
//         if (errorMsg !== 'Unknown error occurred' && errorMsg !== 'Status update failed') {
//           setNotification({ type: 'error', message: `Order item status update error: ${errorMsg}` });
//         } else {
//           setNotification({ type: 'success', message: `Order item status updated successfully!` });
//           // Refresh anyway as the update might have succeeded
//           setTimeout(() => {
//             if (viewingOrder) {
//               dispatch(GetOrderItems(extractOrderId(viewingOrder)));
//             }
//           }, 500);
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error updating order item status:", error);
//       setNotification({ type: 'error', message: `Error updating order item status: ${error.message}` });
//     } finally {
//       setUpdatingItemStatus(false);
//       setStatusUpdateOrderItemId(null);
//       setShowItemStatusConfirmation(false);
//       setPendingItemStatusUpdate(null);
//     }
//   };

//   // Cancel status update
//   const cancelStatusUpdate = () => {
//     setShowStatusConfirmation(false);
//     setPendingStatusUpdate(null);
//   };

//   // Cancel order item status update
//   const cancelItemStatusUpdate = () => {
//     setShowItemStatusConfirmation(false);
//     setPendingItemStatusUpdate(null);
//   };

//   // Utility functions for ID extraction
//   const extractOrderId = (data) => {
//     if (!data) return null;
//     if (typeof data === 'number') return data;
//     if (typeof data === 'string') {
//       const parsed = parseInt(data);
//       return isNaN(parsed) ? null : parsed;
//     }
//     if (typeof data === 'object') {
//       if (data.payload) {
//         return extractOrderId(data.payload);
//       }
//       return data.OrderId || data.orderId || data.OrderID || data.id || data.orderID;
//     }
//     return null;
//   };

//   const extractOrderIdFromItem = (item) => {
//     if (!item) return null;
//     console.log("🔍 Extracting order ID from item:", item);
//     return item.OrderId || item.orderId || item.OrderID || item.orderID;
//   };

//   const extractCustomerId = (data) => {
//     if (!data) return null;
//     return data.CustomerId || data.customerId || data.CustomerID || data.customerID;
//   };

//   const extractOrderItemId = (item) => {
//     if (!item) return null;
//     return item.OrderItemId || item.orderItemId || item.OrderItemID || item.orderItemID || item.id;
//   };

//   // Get TotalAmount from backend data
//   const getOrderTotalAmount = (order) => {
//     // Directly use the TotalAmount from backend
//     return order.TotalAmount || 0;
//   };

// // Helper function to get advance amount data for an order
// const getOrderAdvanceData = (orderId) => {
//   const order = orders.find(o => extractOrderId(o) === orderId);
//   const totalAmount = getOrderTotalAmount(order);
//   const advanceAmount = order?.AdvanceAmount || orderAdvanceData[orderId]?.AdvanceAmount || 0;
  
//   return {
//     AdvanceAmount: advanceAmount,
//     BalanceAmount: totalAmount - advanceAmount
//   };
// };

//   // Enhanced measurement ID extraction function
//   const extractMeasurementId = (data) => {
//     if (!data) return null;
    
//     console.log("🔍 Extracting measurement ID from:", data);
    
//     // If it's the API response object
//     if (data.StatusCode === 200 && data.ResultSet) {
//       if (data.ResultSet.MeasurementId) {
//         return parseInt(data.ResultSet.MeasurementId);
//       }
//       if (typeof data.ResultSet === 'number') {
//         return data.ResultSet;
//       }
//     }
    
//     // If it's the action payload
//     if (data.payload) {
//       if (data.payload.MeasurementId) return parseInt(data.payload.MeasurementId);
//       if (data.payload.measurementId) return parseInt(data.payload.measurementId);
//       if (data.payload.ResultSet && data.payload.ResultSet.MeasurementId) {
//         return parseInt(data.payload.ResultSet.MeasurementId);
//       }
//     }
    
//     // Direct properties
//     if (data.MeasurementId) return parseInt(data.MeasurementId);
//     if (data.measurementId) return parseInt(data.measurementId);
//     if (data.ResultSet && data.ResultSet.MeasurementId) return parseInt(data.ResultSet.MeasurementId);
    
//     // If it's a simple number
//     if (typeof data === 'number') return data;
    
//     return null;
//   };

//   // Simplified version that doesn't rely on store
//   const waitForMeasurementCreation = async (measurementPayload) => {
//     try {
//       console.log("🔄 Creating measurement with payload:", Object.fromEntries(measurementPayload));
      
//       // Dispatch and get the result
//       const result = await dispatch(AddMeasurement(measurementPayload));
      
//       console.log("📦 Measurement creation API response:", result);
      
//       // Wait for the API call to complete
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Extract measurement ID from the result
//       const measurementId = extractMeasurementId(result);
      
//       if (measurementId) {
//         console.log("✅ Measurement created with ID:", measurementId);
//         return {
//           MeasurementId: measurementId,
//           id: measurementId
//         };
//       } else {
//         console.warn("⚠️ No measurement ID returned from backend");
//         return null;
//       }
//     } catch (error) {
//       console.error("❌ Error creating measurement:", error);
//       return null;
//     }
//   };

//   // Generate stable temporary IDs for measurements
//   const generateStableTempIds = (measurements) => {
//     const tempMap = new Map();
//     measurements.forEach((measurement, index) => {
//       if (measurement.GarmentTypeId) {
//         const tempId = `temp_${orderData.CustomerId}_${measurement.GarmentTypeId}_${index}`;
//         tempMap.set(tempId, measurement.GarmentTypeId);
//       }
//     });
//     setTempMeasurementMap(tempMap);
//     return Array.from(tempMap.keys());
//   };

// // Format currency as whole numbers only
// const formatCurrency = (amount) => {
//   return parseInt(amount || 0).toLocaleString('en-IN');
// };

//   // Format amount with currency symbol for display
//   const formatAmountDisplay = (amount) => {
//     return `Rs. ${formatCurrency(amount)}`;
//   };

//   // Get order item status style
// const getOrderItemStatusStyle = (status) => {
//   switch (status?.toLowerCase()) {
//     case 'delivered':
//       return 'bg-green-100 text-green-800 border-green-300';
//     case 'in progress':
//       return 'bg-blue-100 text-blue-800 border-blue-300';
//     case 'priority':
//       return 'bg-red-100 text-red-800 border-red-300';
//     default:
//       return 'bg-yellow-100 text-yellow-800 border-yellow-300';
//   }
// };

//  const getStatusStyle = (status) => {
//   switch (status) {
//     case "priority": 
//       return "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-200/50 font-normal";
//     case "In Progress": 
//       return "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50 font-normal";
//     case "delivered": 
//       return "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200/50 font-normal";
//     default: 
//       return "bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200/50 font-normal";
//   }
// };

//   // Handle file/image change
//   const handleFileChange = (index, e) => {
//     const file = e.target.files[0];
//     const updatedMeasurements = [...newMeasurements];
//     updatedMeasurements[index].file = file;
//     setNewMeasurements(updatedMeasurements);
//   };

//   // Image popup handler
//   const handleMeasurementRowClick = (measurement) => {
//     setSelectedMeasurement(measurement);
//     setShowImagePopup(true);
//   };

//   // Function to render measurement image - clickable
//   const renderMeasurementImage = (measurement) => {
//     if (measurement.IMAGEURL) {
//       return (
//         <div 
//           className="w-12 h-12 rounded-md border border-gray-300 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
//           onClick={(e) => {
//             e.stopPropagation();
//             handleMeasurementRowClick(measurement);
//           }}
//         >
//           <img
//             src={measurement.IMAGEURL}
//             alt="Measurement"
//             className="w-full h-full object-cover"
//           />
//         </div>
//       );
//     } else {
//       return (
//         <div className="w-12 h-12 rounded-md border border-gray-300 flex items-center justify-center bg-gray-100">
//           <FiImage className="text-gray-400" size={20} />
//         </div>
//       );
//     }
//   };

//   // Filter customers based on search input
//   useEffect(() => {
//     if (customerSearch) {
//       const filtered = customers.filter(customer =>
//         customer.FullName.toLowerCase().includes(customerSearch.toLowerCase())
//       );
//       setFilteredCustomers(filtered);
//     } else {
//       setFilteredCustomers(customers);
//     }
//   }, [customerSearch, customers]);

//   // Extract unique garment types from measurements for order items
//   useEffect(() => {
//     if (newMeasurements.length > 0) {
//       const garmentTypeIds = newMeasurements
//         .filter(measurement => measurement.GarmentTypeId)
//         .map(measurement => measurement.GarmentTypeId);
      
//       const uniqueGarmentTypeIds = [...new Set(garmentTypeIds)];
//       setGarmentTypesFromMeasurements(uniqueGarmentTypeIds);
//     }
//   }, [newMeasurements]);

//   useEffect(() => {
//     dispatch(GetOrders());
//     dispatch(GetAllCustomers());
//     dispatch(GetAllGarmentType());
//     dispatch(GetAllFabricType());
//   }, [dispatch]);

//   // Safety timeout for loading state
//   useEffect(() => {
//     if (loadingOrderDetails && viewingOrder) {
//       const timeout = setTimeout(() => {
//         console.warn("⚠️ Loading timeout - forcing loading state to false");
//         console.log("📊 Current state at timeout:", {
//           orderItemsData: orderItemsData.length,
//           orderMeasurements: orderMeasurements.length,
//           editingOrderItems: editingOrderItems.length,
//           editingMeasurements: editingMeasurements.length
//         });
//         setLoadingOrderDetails(false);
//       }, 10000); // 10 second timeout
      
//       return () => clearTimeout(timeout);
//     }
//   }, [loadingOrderDetails, viewingOrder]);

//   // Watch for order measurements by order ID state changes - WITH FILTERING
//   useEffect(() => {
//     console.log("🔄 Order measurements useEffect triggered", {
//       hasResponse: !!measurementsByOrderState.responseBody,
//       viewingOrder: !!viewingOrder,
//       editMode: editMode,
//       loading: loadingOrderDetails
//     });

//     if (measurementsByOrderState.responseBody && viewingOrder) {
//       let measurementsData = [];
      
//       // Handle different response formats
//       if (Array.isArray(measurementsByOrderState.responseBody)) {
//         measurementsData = measurementsByOrderState.responseBody;
//       } else if (measurementsByOrderState.responseBody.payload && Array.isArray(measurementsByOrderState.responseBody.payload)) {
//         measurementsData = measurementsByOrderState.responseBody.payload;
//       } else if (measurementsByOrderState.responseBody.ResultSet && Array.isArray(measurementsByOrderState.responseBody.ResultSet)) {
//         measurementsData = measurementsByOrderState.responseBody.ResultSet;
//       }
      
//       console.log("📦 Raw measurements data:", measurementsData);
      
//       // CRITICAL FIX: Filter measurements for the current order
//       const orderId = extractOrderId(viewingOrder);
//       const filteredMeasurements = measurementsData.filter(measurement => {
//         const measurementOrderId = measurement.OrderId || measurement.orderId;
//         console.log(`🔍 Checking measurement ${extractMeasurementId(measurement)}: measurementOrderId=${measurementOrderId}, currentOrderId=${orderId}, match=${measurementOrderId?.toString() === orderId?.toString()}`);
//         return measurementOrderId?.toString() === orderId?.toString();
//       });
      
//       console.log("✅ Filtered measurements for order", orderId + ":", filteredMeasurements);
      
//       if (editMode) {
//         setEditingMeasurements(filteredMeasurements);
//       } else {
//         setOrderMeasurements(filteredMeasurements);
//       }
      
//       setLoadingOrderDetails(false);
//     }
//   }, [measurementsByOrderState.responseBody, viewingOrder, editMode]);

//   // Watch for order items state changes when viewing order - WITH FILTERING
//   useEffect(() => {
//     console.log("🔄 Order items useEffect triggered", {
//       hasResponse: !!orderItemsState.responseBody,
//       viewingOrder: !!viewingOrder,
//       editMode: editMode,
//       loading: loadingOrderDetails
//     });

//     if (orderItemsState.responseBody && viewingOrder) {
//       let itemsData = [];
      
//       // Handle different response formats
//       if (Array.isArray(orderItemsState.responseBody)) {
//         itemsData = orderItemsState.responseBody;
//       } else if (orderItemsState.responseBody.payload && Array.isArray(orderItemsState.responseBody.payload)) {
//         itemsData = orderItemsState.responseBody.payload;
//       } else if (orderItemsState.responseBody.ResultSet && Array.isArray(orderItemsState.responseBody.ResultSet)) {
//         itemsData = orderItemsState.responseBody.ResultSet;
//       }
      
//       console.log("📦 Raw order items data:", itemsData);
      
//       // CRITICAL FIX: Filter items for the current order
//       const orderId = extractOrderId(viewingOrder);
//       const filteredItems = itemsData.filter(item => {
//         const itemOrderId = extractOrderIdFromItem(item);
//         console.log(`🔍 Checking item ${extractOrderItemId(item)}: itemOrderId=${itemOrderId}, currentOrderId=${orderId}, match=${itemOrderId?.toString() === orderId?.toString()}`);
//         return itemOrderId?.toString() === orderId?.toString();
//       });
      
//       console.log("✅ Filtered order items for order", orderId + ":", filteredItems);
      
//       if (editMode) {
//         setEditingOrderItems(filteredItems);
//       } else {
//         setOrderItemsData(filteredItems);
//       }
      
//       setLoadingOrderDetails(false);
      
//       // Clear any bulk updates when we get fresh data
//       setBulkStatusUpdates({});
//       setHasUnsavedChanges(false);
//     }
//   }, [orderItemsState.responseBody, viewingOrder, editMode]);

//   // Similarly for edit mode
//   useEffect(() => {
//     if (editMode && viewingOrder && orderItemsState.responseBody) {
//       const itemsData = Array.isArray(orderItemsState.responseBody) 
//         ? orderItemsState.responseBody 
//         : [];
      
//       const filteredItems = itemsData.filter(item => {
//         const itemOrderId = extractOrderIdFromItem(item);
//         const viewingOrderId = extractOrderId(viewingOrder);
//         return itemOrderId?.toString() === viewingOrderId?.toString();
//       });
      
//       console.log("🔄 Editing order items updated:", filteredItems);
//       setEditingOrderItems(filteredItems);
      
//       // Clear any bulk updates when we get fresh data
//       setBulkStatusUpdates({});
//       setHasUnsavedChanges(false);
//     }
//   }, [orderItemsState.responseBody, editMode, viewingOrder]);

//   // Handle URL parameters for auto-searching orders
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const searchParam = urlParams.get('search');
    
//     if (searchParam) {
//       setSearchTerm(searchParam);
//       setNotification({ 
//         type: 'success', 
//         message: `Showing orders matching: ${searchParam}` 
//       });
//     }
//   }, []);

//   // Check for changes whenever relevant state changes
//   useEffect(() => {
//     checkAllChangesSaved();
//   }, [orderChanges, measurementChanges, orderItemChanges, bulkStatusUpdates]);

//   // Multi-step form handlers
//   const validateOrderDetails = () => {
//     if (!orderData.CustomerId) {
//       setNotification({ type: 'error', message: "Please select a customer" });
//       return false;
//     }
//     if (!orderData.DeliveryDate) {
//       setNotification({ type: 'error', message: "Please select a delivery date" });
//       return false;
//     }
//     return true;
//   };

//   const validateMeasurements = () => {
//     const hasValidMeasurement = newMeasurements.some(measurement => 
//       measurement.GarmentTypeId && measurement.GarmentTypeId !== ""
//     );
    
//     if (!hasValidMeasurement) {
//       setNotification({ type: 'error', message: "Please add at least one measurement with garment type" });
//       return false;
//     }
//     return true;
//   };

//   const validateOrderItems = () => {
//     if (newItems.length === 0) {
//       setNotification({ type: 'error', message: "Please add at least one order item" });
//       return false;
//     }

//     for (const [index, item] of newItems.entries()) {
//       if (!item.garmentTypeId || !item.fabricTypeId || !item.price) {
//         setNotification({ type: 'error', message: `Please fill all fields for item ${index + 1}` });
//         return false;
//       }
      
//       const price = parseInt(item.price);

      
//       if (isNaN(price) || price <= 0) {
//         setNotification({ type: 'error', message: `Please enter a valid price for item ${index + 1}` });
//         return false;
//       }
//     }
//     return true;
//   };

//   // Enhanced handleNextStep to properly wait for and store IDs
//   const handleNextStep = async () => {
//     if (currentStep === 1) {
//       if (!validateOrderDetails()) return;
      
//       setSaving(true);
//       try {
//         const orderPayload = {
//           CustomerId: parseInt(orderData.CustomerId),
//           OrderDate: orderData.OrderDate,
//           DeliveryDate: orderData.DeliveryDate,
//           Status: orderData.Status,
//         };

//         console.log("🔄 Saving order details...", orderPayload);
//         const orderResult = await dispatch(AddOrder(orderPayload));
        
//         const orderId = extractOrderId(orderResult);
        
//         if (orderResult && orderId && orderId !== 0) {
//           console.log("✅ Order created with ID:", orderId);
//           setSavedOrderId(orderId);
//           setCurrentStep(2);
//           setNotification({ type: 'success', message: "Order details saved successfully! Now add measurements." });
//         } else {
//           throw new Error("Failed to create order - no valid Order ID returned");
//         }
//       } catch (error) {
//         console.error("❌ Error saving order:", error);
//         setNotification({ type: 'error', message: `Error saving order: ${error.message}` });
//       } finally {
//         setSaving(false);
//       }
//     } else if (currentStep === 2) {
//       if (!validateMeasurements()) return;
      
//       setSaving(true);
//       try {
//         const createdMeasurementsData = [];
//         const measurementMap = new Map();
        
//         // Save measurements sequentially and wait for each response
//         for (const measurement of newMeasurements) {
//           if (measurement.GarmentTypeId) {
//             // Create FormData for measurement with file/image support
//             const measurementFormData = new FormData();
            
//             // Add file if exists
//             if (measurement.file) {
//               measurementFormData.append("file", measurement.file);
//             }
            
//             // Add measurement data - INCLUDING ORDER ID
//             const garmentTypeId = parseInt(measurement.GarmentTypeId);
//             measurementFormData.append("GarmentTypeId", garmentTypeId);
//             measurementFormData.append("Neck", measurement.Neck ? parseFloat(measurement.Neck) : 0);
//             measurementFormData.append("Chest", measurement.Chest ? parseFloat(measurement.Chest) : 0);
//             measurementFormData.append("Waist", measurement.Waist ? parseFloat(measurement.Waist) : 0);
//             measurementFormData.append("Length", measurement.Length ? parseFloat(measurement.Length) : 0);
//             measurementFormData.append("YardsRequired", measurement.YardsRequired ? parseFloat(measurement.YardsRequired) : 0);
//             measurementFormData.append("Description", measurement.Description || "");
//             measurementFormData.append("CustomerId", parseInt(orderData.CustomerId));
            
//             // ✅ CRITICAL FIX: Add OrderId to link measurement to order
//             if (savedOrderId) {
//               measurementFormData.append("OrderId", savedOrderId);
//             }
            
//             console.log("🔄 Creating measurement with OrderId:", savedOrderId, "and GarmentTypeId:", garmentTypeId);
            
//             // Wait for measurement creation and store the result
//             const createdMeasurement = await waitForMeasurementCreation(measurementFormData);
//             if (createdMeasurement) {
//               createdMeasurementsData.push(createdMeasurement);
//               // Store the mapping of garment type to measurement ID
//               measurementMap.set(garmentTypeId, createdMeasurement.MeasurementId);
//               console.log(`✅ Mapped GarmentTypeId ${garmentTypeId} to MeasurementId ${createdMeasurement.MeasurementId} for Order ${savedOrderId}`);
//             }
            
//             await new Promise(resolve => setTimeout(resolve, 500));
//           } else {
//             console.warn("⚠️ Skipping measurement without GarmentTypeId");
//           }
//         }
          
//           // Store the created measurements with their IDs
//           setCreatedMeasurements(createdMeasurementsData);
//           setGarmentTypeToMeasurementMap(measurementMap);
//           console.log("✅ All measurements saved with IDs:", createdMeasurementsData);
//           console.log("🗺️ Garment Type to Measurement Map:", measurementMap);
          
//           // Also generate temporary IDs as fallback
//           const tempIds = generateStableTempIds(newMeasurements);
//           setSavedMeasurementIds(tempIds);
          
//           console.log("🎯 Temporary measurement IDs:", tempIds);
          
//           // AUTO-POPULATE ORDER ITEMS WITH MEASUREMENT IDs
//           const updatedItems = newItems.map((item, itemIndex) => {
//             if (item.garmentTypeId) {
//               // Get the measurement ID from the mapping
//               const garmentTypeId = parseInt(item.garmentTypeId);
//               const measurementId = measurementMap.get(garmentTypeId);
              
//               if (measurementId) {
//                 console.log(`🔄 Auto-setting measurement ID ${measurementId} for garment type ${garmentTypeId} in item ${itemIndex}`);
//                 return {
//                   ...item,
//                   measurementId: measurementId.toString()
//                 };
//               } else {
//                 console.warn(`⚠️ No measurement ID found for garment type ${garmentTypeId}`);
//                 console.warn(`⚠️ Available mappings:`, Array.from(measurementMap.entries()));
//               }
//             } else {
//               console.warn(`⚠️ Item ${itemIndex} has no garmentTypeId`);
//             }
//             return item;
//           });
          
//           setNewItems(updatedItems);
//           console.log("🔄 Updated order items with auto-populated measurement IDs:", updatedItems);
          
//           setCurrentStep(3);
//           setNotification({ type: 'success', message: "Measurements saved successfully! Now add order items. Measurement IDs have been auto-populated." });
          
//          } catch (error) {
//         console.error("❌ Error saving measurements:", error);
//         setNotification({ type: 'error', message: `Error saving measurements: ${error.message}` });
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   const handlePreviousStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };


// // UPDATED: Enhanced handleSaveOrderItems to open advance form after success
// const handleSaveOrderItems = async () => {
//   console.log("🔄 handleSaveOrderItems called");
//   console.log("📋 Order Items to save:", newItems);
//   console.log("🎯 Saved Order ID:", savedOrderId);
  
//   if (!validateOrderItems()) return;
  
//   setSaving(true);
//   try {
//     const results = [];
//     const failures = [];
    
//     for (const [index, item] of newItems.entries()) {
//       const garmentTypeId = parseInt(item.garmentTypeId);
//       const fabricTypeId = parseInt(item.fabricTypeId);
      
//       console.log(`🔍 Processing item ${index + 1}:`, item);
      
//       // Use the measurement ID that was auto-populated
//       let measurementId = item.measurementId;
      
//       // If no measurement ID is set, try to find it from the mapping
//       if (!measurementId && item.garmentTypeId) {
//         measurementId = garmentTypeToMeasurementMap.get(parseInt(item.garmentTypeId));
//         if (measurementId) {
//           console.log(`🔄 Found measurement ID ${measurementId} from mapping for garment type ${item.garmentTypeId}`);
//         } else {
//           console.warn(`❌ No measurement ID found in mapping for garment type ${item.garmentTypeId}`);
//         }
//       }
      
//       const finalMeasurementId = measurementId ? parseInt(measurementId) : null;

//       if (!garmentTypeId || isNaN(garmentTypeId) || !fabricTypeId || isNaN(fabricTypeId)) {
//         console.error(`❌ Invalid garment or fabric type for item ${index + 1}`);
//         failures.push({
//           index,
//           item,
//           error: "Invalid garment or fabric type selected",
//           success: false
//         });
//         continue;
//       }

//       if (!finalMeasurementId || isNaN(finalMeasurementId)) {
//         console.error(`❌ No valid measurement ID for item ${index + 1}`);
//         failures.push({
//           index,
//           item,
//           error: "No valid measurement ID found for this garment type",
//           success: false
//         });
//         continue;
//       }

//       const price = parseInt(item.price);


//       if (isNaN(price) || price <= 0) {
//         console.error(`❌ Invalid price for item ${index + 1}`);
//         failures.push({
//           index,
//           item,
//           error: "Invalid price",
//           success: false
//         });
//         continue;
//       }

//       const itemPayload = {
//         OrderId: savedOrderId,
//         GarmentTypeId: garmentTypeId,
//         FabricTypeId: fabricTypeId,
//         Price: price,
//         MeasurementId: finalMeasurementId
//       };
      
//       console.log(`💾 Saving order item ${index + 1}/${newItems.length}:`, itemPayload);
      
//       try {
//         const result = await dispatch(AddOrderItem(itemPayload));
        
//         if (result && (result.success || result.status === 200)) {
//           console.log(`✅ Successfully saved order item ${index + 1}`);
//           results.push({
//             index,
//             item: itemPayload,
//             result: result,
//             success: true
//           });
          
//           setOrderItemsData(prev => [...prev, {
//             ...itemPayload,
//             OrderItemId: result.data || `temp_${index}`,
//             GarmentTypeId: garmentTypeId,
//             FabricTypeId: fabricTypeId,
//             Price: price,
//             MeasurementId: finalMeasurementId
//           }]);
//         } else {
//           const errorMsg = result?.error || result?.message || 'Unknown error';
//           console.error(`❌ Failed to save order item ${index + 1}:`, errorMsg);
//           failures.push({
//             index,
//             item: itemPayload,
//             error: errorMsg,
//             success: false
//           });
//         }
//       } catch (error) {
//         console.error(`❌ Error saving order item ${index + 1}:`, error);
//         failures.push({
//           index,
//           item: itemPayload,
//           error: error.message,
//           success: false
//         });
//       }
      
//       await new Promise(resolve => setTimeout(resolve, 200));
//     }

//     setOrderItemResults(results);
//     setFailedOrderItems(failures);

//     if (failures.length > 0) {
//       setNotification({ type: 'warning', message: `Order completed with ${failures.length} item(s) failed. Order #${savedOrderId} was created successfully.` });
      
    

//       // If there are failures, close the order form but don't open advance form
//       setShowOrderModal(false);
//       resetForm();
//     } else {
//       setNotification({ type: 'success', message: `Order #${savedOrderId} created successfully with all items!` });
      
//       // ✅ CRITICAL: CLOSE THE ORDER FORM FIRST
//       setShowOrderModal(false);
      
//       // ✅ THEN OPEN ADVANCE AMOUNT FORM
//       setTimeout(() => {
//         setSelectedOrderForAdvance({
//           orderId: savedOrderId,
//           totalAmount: calculateTotalAmount()
//         });
//         setShowAdvanceForm(true);
//       }, 100); // Small delay to ensure order form closes first
//     }

//     // Add to recently added orders for highlighting
//     if (savedOrderId) {
//       setRecentlyAddedOrders(prev => [...prev, savedOrderId]);
      
//       setTimeout(() => {
//         setRecentlyAddedOrders(prev => prev.filter(id => id !== savedOrderId));
//       }, 3000);
//     }

//     // Refresh the orders list to show the new order
//     dispatch(GetOrders());
    
//   } catch (error) {
//     console.error("❌ Error saving order items:", error);
//     setNotification({ type: 'error', message: `Error saving order items: ${error.message}` });
//     setShowOrderModal(false);
//     resetForm();
//   } finally {
//     setSaving(false);
//   }
// };


// // ✅ UPDATED: handlePrintBill function to fetch real order items
// const handlePrintBill = async (order) => {
//   try {
//     const orderId = extractOrderId(order);
//     const customerId = extractCustomerId(order);
    
//     console.log("🖨️ Generating bill for order:", orderId);
    
//     // Get order items for this order
//     const orderItemsResult = await dispatch(GetOrderItems(orderId));
//     let orderItemsData = [];
    
//     // Handle different response formats
//     if (orderItemsResult?.payload?.responseBody) {
//       orderItemsData = Array.isArray(orderItemsResult.payload.responseBody) 
//         ? orderItemsResult.payload.responseBody 
//         : [];
//     } else if (orderItemsResult?.data?.ResultSet) {
//       orderItemsData = Array.isArray(orderItemsResult.data.ResultSet) 
//         ? orderItemsResult.data.ResultSet 
//         : [];
//     } else if (Array.isArray(orderItemsResult)) {
//       orderItemsData = orderItemsResult;
//     }
    
//     console.log("📦 Order items fetched:", orderItemsData);
    
//     // Filter items for this specific order
//     const filteredItems = orderItemsData.filter(item => {
//       const itemOrderId = extractOrderIdFromItem(item);
//       return itemOrderId?.toString() === orderId?.toString();
//     });
    
//     console.log("✅ Filtered order items:", filteredItems);
    
//     // Prepare bill data with real order items
//     const billData = {
//       orderId: orderId,
//       customerName: getCustomerName(customerId),
//       orderItems: filteredItems.map(item => {
//         const garmentTypeId = item.GarmentTypeId || item.garmentTypeId;
//         const fabricTypeId = item.FabricTypeId || item.fabricTypeId;
//         const price = parseInt(item.Price || item.price || 0);
        
//         return {
//           name: `${getGarmentTypeName(garmentTypeId)} - ${getFabricTypeName(fabricTypeId)}`,
//           garmentType: getGarmentTypeName(garmentTypeId),
//           fabricType: getFabricTypeName(fabricTypeId),
//           price: price,
//           garmentTypeId: garmentTypeId,
//           fabricTypeId: fabricTypeId
//         };
//       }),
//       totalAmount: getOrderTotalAmount(order),
//       advanceAmount: getOrderAdvanceData(orderId).AdvanceAmount,
//       balanceAmount: getOrderAdvanceData(orderId).BalanceAmount,
//       deliveryDate: formatDate(order.DeliveryDate),
//       orderDate: formatDate(order.OrderDate)
//     };
    
//     console.log("💰 Bill data prepared:", billData);
    
//     // Save to localStorage
//     localStorage.setItem(`bill_${orderId}`, JSON.stringify(billData));
    
//     // Set bill data and show receipt
//     setBillData(billData);
//     setSelectedOrderForBill(order);
//     setShowBill(true);
    
//   } catch (error) {
//     console.error("❌ Error generating bill:", error);
//     setNotification({ 
//       type: 'error', 
//       message: `Error generating bill: ${error.message}` 
//     });
//   }
// };

// // Add this PDF download function to your Orders component
// const downloadBillAsPDF = async (billElement) => {
//   if (!billElement) return;

//   try {
//     setNotification({ type: 'info', message: 'Generating PDF...' });
    
//     const canvas = await html2canvas(billElement, {
//       scale: 2,
//       useCORS: true,
//       logging: false,
//       backgroundColor: '#ffffff'
//     });

//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();
    
//     const imgWidth = canvas.width;
//     const imgHeight = canvas.height;
//     const ratio = imgWidth / imgHeight;
//     const pdfImgHeight = pdfWidth / ratio;
    
//     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfImgHeight);
    
//     const timestamp = new Date().toISOString().split('T')[0];
//     const filename = `Invoice_${billData.orderId}_${timestamp}.pdf`;
    
//     pdf.save(filename);
    
//     setNotification({ type: 'success', message: 'PDF downloaded successfully!' });
    
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     setNotification({ type: 'error', message: 'Failed to generate PDF' });
//   }
// };


// // Add this function to handle actual printing
// const handlePrintBillFinal = () => {
//   if (!billData) return;
  
//   const printWindow = window.open('', '_blank');
//   const printContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>Bill - Order #${billData.orderId}</title>
//       <style>
//         body { 
//           font-family: Arial, sans-serif; 
//           margin: 40px; 
//           color: #333;
//         }
//         .header { 
//           text-align: center; 
//           margin-bottom: 30px;
//           border-bottom: 2px solid #333;
//           padding-bottom: 20px;
//         }
//         .shop-name { 
//           font-size: 28px; 
//           font-weight: bold; 
//           color: #1e40af;
//         }
//         .invoice-title { 
//           font-size: 18px; 
//           color: #666; 
//           margin-top: 10px;
//         }
//         .details-grid { 
//           display: grid; 
//           grid-template-columns: 1fr 1fr; 
//           gap: 20px; 
//           margin-bottom: 30px;
//         }
//         .detail-box { 
//           background: #f8fafc; 
//           padding: 15px; 
//           border-radius: 8px; 
//           border: 1px solid #e2e8f0;
//         }
//         .detail-label { 
//           font-weight: bold; 
//           color: #475569; 
//           margin-bottom: 5px;
//         }
//         .detail-value { 
//           font-size: 18px; 
//           font-weight: bold; 
//           color: #1e40af;
//         }
//         .customer-info { 
//           background: #dbeafe; 
//           padding: 20px; 
//           border-radius: 8px; 
//           margin-bottom: 30px;
//           border: 1px solid #bfdbfe;
//         }
//         .section-title { 
//           font-size: 20px; 
//           font-weight: bold; 
//           margin-bottom: 15px; 
//           color: #1e293b;
//         }
//         .items-table { 
//           width: 100%; 
//           border-collapse: collapse; 
//           margin-bottom: 30px;
//         }
//         .items-table th, .items-table td { 
//           padding: 12px; 
//           text-align: left; 
//           border-bottom: 1px solid #e2e8f0;
//         }
//         .items-table th { 
//           background: #f1f5f9; 
//           font-weight: bold; 
//           color: #475569;
//         }
//         .amount-summary { 
//           background: #dcfce7; 
//           padding: 20px; 
//           border-radius: 8px; 
//           margin-bottom: 30px;
//           border: 1px solid #bbf7d0;
//         }
//         .amount-row { 
//           display: flex; 
//           justify-content: space-between; 
//           margin-bottom: 10px;
//         }
//         .total-row { 
//           border-top: 2px solid #86efac; 
//           padding-top: 10px; 
//           font-weight: bold; 
//           font-size: 18px;
//         }
//         .delivery-info { 
//           background: #ffedd5; 
//           padding: 20px; 
//           border-radius: 8px; 
//           text-align: center;
//           border: 1px solid #fdba74;
//         }
//         @media print {
//           body { margin: 20px; }
//           .no-print { display: none; }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <div class="shop-name">TAILOR SHOP</div>
//         <div class="invoice-title">ORDER INVOICE</div>
//       </div>
      
//       <div class="details-grid">
//         <div class="detail-box">
//           <div class="detail-label">Order ID</div>
//           <div class="detail-value">#${billData.orderId}</div>
//         </div>
//         <div class="detail-box">
//           <div class="detail-label">Order Date</div>
//           <div class="detail-value">${billData.orderDate}</div>
//         </div>
//       </div>
      
//       <div class="customer-info">
//         <div class="section-title">Customer Information</div>
//         <div style="font-size: 20px; font-weight: bold;">${billData.customerName}</div>
//       </div>
      
//       <div class="section-title">Order Items</div>
//       <table class="items-table">
//         <thead>
//           <tr>
//             <th>Item Description</th>
//             <th>Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${billData.orderItems.map(item => `
//             <tr>
//               <td>${item.name}</td>
//               <td>Rs. ${parseFloat(item.price).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>
      
//       <div class="amount-summary">
//         <div class="section-title">Amount Summary</div>
//         <div class="amount-row">
//           <span>Total Amount:</span>
//           <span style="font-weight: bold; color: #166534;">
//             Rs. ${parseFloat(billData.totalAmount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
//           </span>
//         </div>
//         <div class="amount-row">
//           <span>Advance Paid:</span>
//           <span style="font-weight: bold; color: #1e40af;">
//             Rs. ${parseFloat(billData.advanceAmount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
//           </span>
//         </div>
//         <div class="amount-row total-row">
//           <span>Balance Amount:</span>
//           <span style="font-weight: bold; color: #ea580c;">
//             Rs. ${parseFloat(billData.balanceAmount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
//           </span>
//         </div>
//       </div>
      
//       <div class="delivery-info">
//         <div style="font-size: 18px; font-weight: bold; color: #ea580c;">
//           Delivery Date: ${billData.deliveryDate}
//         </div>
//       </div>
      
//       <div class="no-print" style="text-align: center; margin-top: 30px; color: #666;">
//         <p>Thank you for your business!</p>
//       </div>
      
//       <script>
//         window.onload = function() {
//           window.print();
//           setTimeout(function() {
//             window.close();
//           }, 1000);
//         }
//       </script>
//     </body>
//     </html>
//   `;
  
//   printWindow.document.write(printContent);
//   printWindow.document.close();
// };



//   const resetForm = () => {
//     setCurrentStep(1);
//     setSavedOrderId(null);
//     setSavedMeasurementIds([]);
//     setTempMeasurementMap(new Map());
//     setCreatedMeasurements([]);
//     setGarmentTypeToMeasurementMap(new Map());
//     setGarmentTypesFromMeasurements([]);
//     setOrderData({ 
//       CustomerId: "", 
//       OrderDate: new Date().toISOString().slice(0, 10), 
//       DeliveryDate: "", 
//       Status: "In Progress"
//     });
//     setNewItems([{ 
//       garmentTypeId: "", 
//       fabricTypeId: "", 
//       price: "", 
//       measurementId: "" // Reset measurement ID
//     }]);
//     setNewMeasurements([{
//       GarmentTypeId: "",
//       Neck: "",
//       Chest: "",
//       Waist: "",
//       Length: "",
//       YardsRequired: "",
//       Description: "",
//       file: null
//     }]);
//     setCustomerSearch("");
//     setFilteredCustomers(customers);
//     setShowCustomerDropdown(false);
//     setEditMode(false);
//     setEditingOrderId(null);
//     setEditingMeasurements([]);
//     setEditingOrderItems([]);
//     setEditingMeasurementId(null);
//     setEditingMeasurementData({});
//     setEditingOrderItemId(null);
//     setEditingOrderItemData({});
//     setBulkStatusUpdates({});
//     setHasUnsavedChanges(false);
//     setOrderChanges({});
//     setMeasurementChanges({});
//     setOrderItemChanges({});
//     setHasChanges(false);
//     setShowAdvanceForm(false);
//     setSelectedOrderForAdvance(null);
//   };

//   // Enhanced measurement display name
//   const getMeasurementDisplayName = (measurement) => {
//     if (measurement.isTemp) {
//       return `Temporary - ${getGarmentTypeName(measurement.garmentType)}`;
//     }
//     if (measurement.isNew) {
//       return `NEW - ${getGarmentTypeName(measurement.GarmentTypeId)} (ID: ${measurement.MeasurementId})`;
//     }
//     return `${getGarmentTypeName(measurement.GarmentTypeId)} - Neck: ${measurement.Neck || 'N/A'}, Chest: ${measurement.Chest || 'N/A'}, Waist: ${measurement.Waist || 'N/A'} (ID: ${extractMeasurementId(measurement)})`;
//   };

//   // Enhanced measurement value getter
//   const getMeasurementValue = (measurement) => {
//     if (measurement.isTemp) {
//       return measurement.tempId;
//     }
//     if (measurement.isNew && measurement.MeasurementId) {
//       return measurement.MeasurementId;
//     }
//     return extractMeasurementId(measurement);
//   };

//   // Add this function to test your APIs
//   const testAPIs = async (orderId) => {
//     console.log("🧪 TESTING APIs for order:", orderId);
    
//     try {
//       const itemsResult = await dispatch(GetOrderItems(orderId));
//       console.log("📦 GetOrderItems result:", itemsResult);
      
//       const measurementsResult = await dispatch(GetMeasurementByOrderId(orderId));
//       console.log("📏 GetMeasurementByOrderId result:", measurementsResult);
//     } catch (error) {
//       console.error("❌ API test error:", error);
//     }
//   };

//   // UPDATED: Handle View Order - Make status non-editable in view mode
//   const handleViewOrder = async (order) => {
//     console.log("🔄 handleViewOrder called for order:", order);
    
//     setViewingOrder(order);
//     setEditingOrderId(null);
//     setEditMode(false);
//     setShowOrderModal(true);
//     setLoadingOrderDetails(true);

//     // Clear previous data
//     setOrderItemsData([]);
//     setOrderMeasurements([]);

//     setOrderData({
//       CustomerId: extractCustomerId(order),
//       OrderDate: formatDate(order.OrderDate),
//       DeliveryDate: formatDate(order.DeliveryDate),
//       Status: order.Status,
//     });

//     try {
//       const orderId = extractOrderId(order);
//       console.log("🔄 Fetching details for order ID:", orderId);
      
//       // Fetch both order items and measurements for THIS SPECIFIC ORDER
//       await Promise.all([
//         dispatch(GetOrderItems(orderId)),
//         dispatch(GetMeasurementByOrderId(orderId))
//       ]);
      
//       console.log("✅ API calls dispatched for order:", orderId);
      
//     } catch (error) {
//       console.error("❌ Error in handleViewOrder:", error);
//       setLoadingOrderDetails(false);
//     }
//   };

//   const openAddModal = () => {
//     resetForm();
//     setViewingOrder(null);
//     setShowOrderModal(true);
//   };

//   // Handle customer selection from searchable dropdown
//   const handleCustomerSelect = (customer) => {
//     setOrderData(prev => ({ ...prev, CustomerId: extractCustomerId(customer) }));
//     setCustomerSearch(customer.FullName);
//     setShowCustomerDropdown(false);
//   };

//   // Form Handlers
//   const handleOrderChange = (e) => {
//     const { name, value } = e.target;
    
//     // Special handling for delivery date validation
//     if (name === 'DeliveryDate') {
//       if (!validateDeliveryDate(value)) return;
//     }
    
//     // Order Date should be locked to current date and not editable
//     if (name === 'OrderDate') {
//       // Prevent changing order date - always use current date
//       setNotification({ type: 'error', message: "Order date cannot be changed. It is set to current date." });
//       return;
//     }
    
//     setOrderData((prev) => ({ ...prev, [name]: value }));
//   };

//   const addNewItem = () => setNewItems([...newItems, { 
//     garmentTypeId: "", 
//     fabricTypeId: "", 
//     price: "", 
//     measurementId: ""
//   }]);

//   const removeNewItem = (index) => {
//     if (newItems.length > 1) {
//       setNewItems(newItems.filter((_, i) => i !== index));
//     }
//   };

//   const addNewMeasurement = () => setNewMeasurements([...newMeasurements, {
//     GarmentTypeId: "",
//     Neck: "",
//     Chest: "",
//     Waist: "",
//     Length: "",
//     YardsRequired: "",
//     Description: "",
//     file: null
//   }]);

//   const removeNewMeasurement = (index) => {
//     if (newMeasurements.length > 1) {
//       setNewMeasurements(newMeasurements.filter((_, i) => i !== index));
//     }
//   };

//   const calculateTotalAmount = () => {
//     return newItems.reduce((total, item) => {
//       const price = parseInt(item.price) || 0;
//       return total + price;
//     }, 0);
//   };

//   // Calculate total for editing order items
//   const calculateEditingTotalAmount = () => {
//     return editingOrderItems.reduce((total, item) => {
//       const price = parseInt(item.Price || item.price || 0);
//       return total + price;
//     }, 0);
//   };

//   const formatDate = (value) => {
//     if (!value) return "";
//     let d;
//     if (typeof value === "string" && value.startsWith("/Date")) {
//       const timestamp = parseInt(value.replace(/\/Date\((\d+)\)\//, "$1"), 10);
//       d = new Date(timestamp);
//     } else {
//       d = new Date(value);
//     }
//     return d ? d.toISOString().slice(0, 10) : "";
//   };

//   const getCustomerName = (id) => {
//     const customer = customers.find((c) => 
//       extractCustomerId(c)?.toString() === id?.toString()
//     );
//     return customer ? customer.FullName : `ID ${id}`;
//   };

//   const getGarmentTypeName = (id) => {
//     const garment = garmentTypes.find((g) => 
//       (g.GarmentTypeId || g.garmentTypeId || g.id)?.toString() === id?.toString()
//     );
//     return garment ? garment.GarmentTypeName : `ID ${id}`;
//   };

//   const getFabricTypeName = (id) => {
//     const fabric = fabricTypes.find((f) => 
//       (f.FabricTypeId || f.fabricTypeId || f.id)?.toString() === id?.toString()
//     );
//     return fabric ? fabric.FabricTypeName : `ID ${id}`;
//   };

//  // UPDATED: Filter and sort orders with priority handling
// const filteredOrders = (Array.isArray(orders) ? orders : [])
//   .filter((order) => {
//     const searchMatch =
//       extractOrderId(order)?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
//       getCustomerName(extractCustomerId(order)).toLowerCase().includes(searchTerm.toLowerCase());
    
//     let statusMatch = true;
//     if (statusFilter === 'priority') {
//       statusMatch = order.Status === 'priority';
//     } else if (statusFilter) {
//       statusMatch = order.Status === statusFilter;
//     }
    
//     return searchMatch && statusMatch;
//   })
//   // If priority filter is selected, sort by delivery date (nearest first)
//   .sort((a, b) => {
//     if (statusFilter === 'priority') {
//       const dateA = new Date(a.DeliveryDate);
//       const dateB = new Date(b.DeliveryDate);
//       return dateA - dateB; // Nearest delivery first
//     }
//     // Default sort by OrderId descending for other cases
//     const orderIdA = extractOrderId(a);
//     const orderIdB = extractOrderId(b);
//     return orderIdB - orderIdA;
//   });

//   const indexOfLastOrder = currentPage * itemsPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
//   const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
//   const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
//   const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

//   useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

//   // Generate exactly 3 page numbers for pagination
//   const getPageNumbers = () => {
//     if (totalPages <= 3) {
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }
    
//     let startPage = Math.max(1, currentPage - 1);
//     let endPage = Math.min(totalPages, currentPage + 1);
    
//     if (currentPage === 1) {
//       endPage = 3;
//     }
//     if (currentPage === totalPages) {
//       startPage = totalPages - 2;
//     }
    
//     return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
//   };

//   if (loading) return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-6 flex items-center justify-center">
//       <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
//         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div>
//         <span className="text-slate-700 font-medium">Loading orders...</span>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 p-4 sm:p-6 relative overflow-hidden">
//       {/* 3D Background Elements */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
      
//       {/* 3D Notification */}
//       {notification && (
//         <div
//           className={`fixed top-4 sm:top-6 right-4 sm:right-6 z-[9999] p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center animate-slide-in ${
//             notification.type === 'success' 
//               ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200/50 border-l-4 border-l-green-400' 
//               : notification.type === 'error'
//               ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200/50 border-l-4 border-l-rose-400'
//               : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-200/50 border-l-4 border-l-yellow-400'
//           }`}
//           role="alert"
//         >
//           <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
//             {notification.type === 'success' ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
//           </div>
//           <span className="font-normal text-sm">{notification.message}</span>
//         </div>
//       )}

//       {/* Header Section with 3D Effect */}
//       <div className="relative z-10 mb-6 sm:mb-8">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4">
//           <div className="flex items-center space-x-3 sm:space-x-4">
//             <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-2xl transform ">
//               <FiPackage className="text-white text-lg sm:text-xl" />
//             </div>
//             <div className="transform ">
//               <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                 Order Management
//               </h1>
//               <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage your customer orders and tracking</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 relative z-10">
//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-xs sm:text-sm font-normal">Total Orders</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {filteredOrders.length}
//                 </p>
//               </div>
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiPackage className="text-white text-base sm:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>


// {/* Replace the Pending stats card with Priority */}
// <div className="group relative">
//   <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//   <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-slate-600 text-xs sm:text-sm font-normal">Priority</p>
//         <p className="text-xl md:text-2xl font-bold text-slate-800">
//           {filteredOrders.filter(o => o.Status === 'priority').length}
//         </p>
//       </div>
//       <div className="p-2 sm:p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl shadow-lg">
//         <FiAlertCircle className="text-white text-base sm:text-lg" />
//       </div>
//     </div>
//   </div>
// </div>

//         <div className="group relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//           <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-600 text-xs sm:text-sm font-normal">In Progress</p>
//                 <p className="text-xl md:text-2xl font-bold text-slate-800">
//                   {filteredOrders.filter(o => o.Status === 'In Progress').length}
//                 </p>
//               </div>
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
//                 <FiRefreshCw className="text-white text-base sm:text-lg" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative">
//   <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//   <div className="relative bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 transform transition duration-300 group-hover:-translate-y-1 group-hover:shadow-3xl">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-slate-600 text-xs sm:text-sm font-normal">Delivered</p>
//         <p className="text-xl md:text-2xl font-bold text-slate-800">
//           {filteredOrders.filter(o => o.Status === 'delivered').length}
//         </p>
//       </div>
//       <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl shadow-lg">
//         <FiCheckCircle className="text-white text-base sm:text-lg" />
//       </div>
//     </div>
//   </div>
// </div>
//       </div>

//       {/* Search + Add button - 3D Design */}
//       <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
//         <div className="flex flex-col sm:flex-row flex-grow gap-3 sm:gap-4 w-full">
//           <div className="relative flex-grow group">
//             <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//             <input
//               type="text"
//               placeholder="Search by Order ID or Customer..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//                 className="relative w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3.5 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 placeholder-slate-500 font-medium transition-all duration-300 text-sm sm:text-base"
//             />
//             <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
//           </div>
          
//           <div className="relative group flex-shrink-0">
//             <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 transform group-hover:scale-105"></div>
//             <select 
//   value={statusFilter} 
//   onChange={(e) => setStatusFilter(e.target.value)} 
//   className="relative w-full border-0 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-3 sm:py-3.5 rounded-2xl shadow-xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 text-slate-700 font-normal text-sm sm:text-base"
// >
//   <option value="">All Statuses</option>
//   <option value="priority">Priority</option>
//   <option value="In Progress">In Progress</option>
//   <option value="delivered">Delivered</option>
// </select>
//           </div>

//           <button
//             onClick={openAddModal}
//             className="relative group bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-normal px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 text-sm sm:text-base whitespace-nowrap"
//           >
//             <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//             <FiPlusSquare className="mr-2 sm:mr-3 relative z-10" size={18} />
//             <span className="relative z-10">New Order</span>
//           </button>
//         </div>
//       </div>

//       {/* 3D Table */}
//       <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm mb-6">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[600px]">
//             <thead>
//               <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/50">
//                 <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold  text-xs sm:text-sm uppercase tracking-wider">Order ID</th>
//                 <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold  text-xs sm:text-sm uppercase tracking-wider">Customer</th>
//                 <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold  text-xs sm:text-sm uppercase tracking-wider">Order Date</th>
//                 <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold  text-xs sm:text-sm uppercase tracking-wider">Delivery Date</th>
//                 <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold  text-xs sm:text-sm uppercase tracking-wider">Total Amount</th>
//                 <th className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-700 font-semibold  text-xs sm:text-sm uppercase tracking-wider">Advance</th>
//                 <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Status</th>
//                 <th className="py-3 md:py-4 px-4 md:px-6 text-center text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-200/50">
//               {currentOrders.length > 0 ? currentOrders.map((order) => {
//                 const orderId = extractOrderId(order);
//                 const customerId = extractCustomerId(order);
//                 const totalAmount = getOrderTotalAmount(order);
//                 const isRecentlyAdded = recentlyAddedOrders.includes(orderId);
                
//                 return (
//                   <React.Fragment key={orderId}>
//                     <tr className={`
//                       hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 
//                       bg-gradient-to-r from-white to-slate-50 group
//                       ${isRecentlyAdded ? 'animate-pulse bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-l-blue-500 shadow-lg' : ''}
//                     `}>
//                       <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                         {orderId}
//                         {isRecentlyAdded && (
//                           <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-normal">
//                             New
//                           </span>
//                         )}
//                       </td>

//                       <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                         {getCustomerName(customerId)}
//                       </td>
//                       <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">{formatDate(order.OrderDate)}</td>
//                       <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">{formatDate(order.DeliveryDate)}</td>
//                       <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                         {formatCurrency(totalAmount)}
//                       </td>
//                       <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-slate-600 text-sm sm:text-base max-w-[200px] truncate text-center">
//   {formatCurrency(getOrderAdvanceData(orderId).AdvanceAmount)}
// </td>
//                       <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base max-w-[200px] truncate">
//                         <div className="relative">
//                           <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs ${getStatusStyle(order.Status)}`}>
//                             {order.Status}
//                             {updatingStatus && statusUpdateOrderId === orderId && (
//                               <div className="animate-spin rounded-full h-3 w-3 border-b-1 border-white ml-1"></div>
//                             )}
//                           </div>
                          
//                           {showStatusDropdown[orderId] && (
//                             <div className="absolute left-0 mt-1 w-32 sm:w-40 bg-white border border-slate-200 rounded-2xl shadow-2xl z-10">
//                               <div className="py-1">
//                                 {["priority", "In Progress", "delivered"].map((status) => (
//   <button
//     key={status}
//     onClick={() => handleStatusChange(orderId, order.Status, status)}
//     className={`block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-slate-50 transition-colors ${
//       order.Status === status ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
//     }`}
//     disabled={updatingStatus}
//   >
//     {status}
//   </button>
// ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
//                         <div className="flex justify-center space-x-2">
//                           <button
//                             onClick={() => handleViewOrder(order)}
//                             className="inline-flex items-center justify-center p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
//                             title="View Order"
//                           >
//                             <FiEye size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleEditOrder(order)}
//                             className="inline-flex items-center justify-center p-2 md:p-3 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
//                           >
//                             <FiEdit size={14} />
//                           </button>
//                           <button
//       onClick={() => handlePrintBill(order)}
//       className="inline-flex items-center justify-center p-2 md:p-3 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:scale-110"
//       title="Print Bill"
//     >
//       <FiPrinter size={14} />
//     </button>
//                         </div>
//                       </td>
//                     </tr>
                    
//                     {/* Hideable Measurements Dropdown */}
//                     {expandedMeasurements[orderId] && (
//                       <tr>
//                         <td colSpan="7" className="px-3 sm:px-6 py-4 bg-slate-50/50">
//                           <div className="bg-white rounded-2xl p-4 shadow-inner border border-slate-200/50">
//                             <div className="text-center">
//                               <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3">
//                                 <h4 className="text-sm font-bold text-blue-700 mb-2">Order #{orderId} Details</h4>
//                                 <p className="text-blue-600 text-sm">
//                                   Click the <strong>"View"</strong> button to see all measurements, order items, and complete order details.
//                                 </p>
//                               </div>
//                               <button
//                                 onClick={() => handleViewOrder(order)}
//                                 className="px-4 py-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 text-sm"
//                               >
//                                 View Full Order Details
//                               </button>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 );
//               }) : (
//                 <tr>
//                   <td colSpan="7" className="text-center py-8 sm:py-12">
//                     <div className="flex flex-col items-center space-y-3">
//                       <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-inner">
//                         <FiPackage className="text-slate-500 text-lg sm:text-xl" />
//                       </div>
//                       <p className="text-slate-500 font-normal text-sm sm:text-base">
//                         {searchTerm ? 'No matching orders found' : 'No orders available'}
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* 3D Pagination */}
//         {filteredOrders.length > itemsPerPage && (
//           <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border-t border-slate-200/50 gap-3 sm:gap-0">
//             <div className="text-xs sm:text-sm text-slate-600 font-normal">
//               Showing {indexOfFirstOrder + 1}–{Math.min(indexOfLastOrder, filteredOrders.length)} of{' '}
//               {filteredOrders.length}
//             </div>
//             <div className="flex items-center space-x-1 sm:space-x-2">
//               <button
//                 onClick={prevPage}
//                 disabled={currentPage === 1}
//                 className="p-2 sm:p-2.5 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//               >
//                 <FiChevronLeft size={14} />
//               </button>

//               {getPageNumbers().map((pageNumber) => (
//                 <button
//                   key={pageNumber}
//                   onClick={() => paginate(pageNumber)}
//                   className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl border font-normal transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
//                     pageNumber === currentPage
//                       ? 'bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-2xl scale-105 border-transparent'
//                       : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-lg hover:shadow-xl'
//                   }`}
//                 >
//                   {pageNumber}
//                 </button>
//               ))}

//               <button
//                 onClick={nextPage}
//                 disabled={currentPage === totalPages}
//                 className="p-2 sm:p-2.5 rounded-xl border border-slate-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
//               >
//                 <FiChevronRight size={14} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Status Update Confirmation Modal */}
//       {showStatusConfirmation && pendingStatusUpdate && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-md">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6">
//               <div className="mb-4 sm:mb-6">
//                 <h2 className="text-lg sm:text-xl font-normal text-slate-800 mb-2">Confirm Status Update</h2>
//                 <p className="text-slate-600 text-sm sm:text-base">
//                   Are you sure you want to update Order #{pendingStatusUpdate.orderId} status from <span className="font-normal">{currentOrders.find(o => extractOrderId(o) === pendingStatusUpdate.orderId)?.Status}</span> to <span className="font-normal">{pendingStatusUpdate.newStatus}</span>?
//                 </p>
//               </div>
              
//               <div className="flex justify-end space-x-2 sm:space-x-3">
//                 <button 
//                   onClick={cancelStatusUpdate}
//                   className="px-3 sm:px-4 py-2 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-colors duration-300 text-sm sm:text-base"
//                   disabled={updatingStatus}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   onClick={confirmStatusUpdate}
//                   disabled={updatingStatus}
//                   className="px-3 sm:px-4 py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
//                 >
//                   {updatingStatus ? (
//                     <span className="flex items-center">
//                       <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white mr-2"></div>
//                       Updating...
//                     </span>
//                   ) : (
//                     'Confirm Update'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Order Item Status Update Confirmation Modal */}
//       {showItemStatusConfirmation && pendingItemStatusUpdate && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="relative w-full max-w-md">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6">
//               <div className="mb-4 sm:mb-6">
//                 <h2 className="text-lg sm:text-xl font-normal text-slate-800 mb-2">Confirm Order Item Status Update</h2>
//                 <p className="text-slate-600 text-sm sm:text-base">
//                   Are you sure you want to update Order Item #{pendingItemStatusUpdate.orderItemId} status to <span className="font-normal">{pendingItemStatusUpdate.newStatus}</span>?
//                 </p>
//               </div>
              
//               <div className="flex justify-end space-x-2 sm:space-x-3">
//                 <button 
//                   onClick={cancelItemStatusUpdate}
//                   className="px-3 sm:px-4 py-2 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-colors duration-300 text-sm sm:text-base"
//                   disabled={updatingItemStatus}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   onClick={confirmItemStatusUpdate}
//                   disabled={updatingItemStatus}
//                   className="px-3 sm:px-4 py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
//                 >
//                   {updatingItemStatus ? (
//                     <span className="flex items-center">
//                       <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white mr-2"></div>
//                       Updating...
//                     </span>
//                   ) : (
//                     'Confirm Update'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Customer Modal */}
//       {showAddCustomerModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-2 sm:p-4">
//           <div className="relative w-full max-w-md">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
//               <div className="p-4 sm:p-6">
//                 <div className="flex justify-between items-center mb-4 sm:mb-6">
//                   <div className="flex items-center space-x-2 sm:space-x-3">
//                     <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                       <FiUserPlus className="text-white text-base sm:text-lg" />
//                     </div>
//                     <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                       Add New Customer
//                     </h2>
//                   </div>
//                   <button 
//                     onClick={() => setShowAddCustomerModal(false)} 
//                     className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                   >
//                     <FiX className="text-xl sm:text-2xl" />
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-1">Full Name </label>
//                     <input 
//                       type="text" 
//                       value={newCustomer.FullName} 
//                       onChange={(e) => setNewCustomer({...newCustomer, FullName: e.target.value})}
//                       placeholder="Enter customer full name"
//                       className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
//                     <input 
//                       type="text" 
//                       value={newCustomer.PhoneNumber} 
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         // Only allow numbers and limit to 10 digits
//                         if (value === '' || /^\d{0,10}$/.test(value)) {
//                           setNewCustomer({...newCustomer, PhoneNumber: value});
//                         }
//                       }}
//                       placeholder="Enter phone number (numbers only, max 10 digits)"
//                       className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
//                     />
//                     <p className="text-xs text-slate-500 mt-1">Numbers only, maximum 10 digits</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-1">
//                       Email <span className="text-slate-500 font-normal">(Optional)</span>
//                     </label>
//                     <input 
//                       type="email" 
//                       value={newCustomer.Email} 
//                       onChange={(e) => setNewCustomer({...newCustomer, Email: e.target.value})}
//                       placeholder="Enter email address (optional)"
//                       className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-1">
//                       Address <span className="text-slate-500 font-normal">(Optional)</span>
//                     </label>
//                     <textarea 
//                       value={newCustomer.Address} 
//                       onChange={(e) => setNewCustomer({...newCustomer, Address: e.target.value})}
//                       placeholder="Enter customer address (optional)"
//                       rows="3"
//                       className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 mt-6">
//                   <button 
//                     onClick={() => setShowAddCustomerModal(false)}
//                     className="px-4 sm:px-6 py-2.5 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 font-normal text-sm sm:text-base"
//                   >
//                     Cancel
//                   </button>
//                   <button 
//                     onClick={handleAddCustomer}
//                     disabled={addingCustomer}
//                     className="px-4 sm:px-6 py-2.5 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
//                   >
//                     {addingCustomer ? (
//                       <span className="flex items-center">
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Adding...
//                       </span>
//                     ) : (
//                       'Add Customer'
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add/View Order Modal */}
//       {showOrderModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
//           <div className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-h-full overflow-y-auto">
//               {/* Close icon for BOTH view form AND add form */}
//               <button 
//                 onClick={() => {
//                   setShowOrderModal(false);
//                   if (!viewingOrder) {
//                     resetForm();
//                   } else {
//                     setEditMode(false);
//                     setEditingOrderId(null);
//                   }
//                 }} 
//                 className="absolute top-3 sm:top-4 right-3 sm:right-4 text-slate-400 hover:text-slate-600 z-10 p-2 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//               >
//                 <FiX className="text-xl sm:text-2xl" />
//               </button>

//               <div className="p-4 sm:p-6">
//                 <div className="mb-4 sm:mb-6">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-4">
//                     <div className="flex items-center space-x-2 sm:space-x-3">
//                       <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                         <FiPackage className="text-white text-base sm:text-lg" />
//                       </div>
//                       <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                         {editMode ? `Edit Order #${extractOrderId(viewingOrder)}` : 
//                         viewingOrder ? `View Order #${extractOrderId(viewingOrder)} - ${getCustomerName(extractCustomerId(viewingOrder))}` : 'Create New Order'}
//                       </h2>
//                     </div>
                    
//                     {/* NEW: Save All Changes Button - Only show in edit mode when there are changes */}
//                     {editMode && hasChanges && (
//                       <button
//                         onClick={saveAllChanges}
//                         disabled={saving}
//                         className="relative group bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-normal px-4 py-2 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 text-sm w-full sm:w-auto"
//                       >
//                         <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-110 transition duration-300"></div>
//                         <FiSave className="mr-2 relative z-10" size={16} />
//                         <span className="relative z-10">Save All Changes</span>
//                       </button>
//                     )}
                    
//                     {/* Add Customer Button - Mobile Responsive */}
//                     {!viewingOrder && !editMode && (
//                       <div className="absolute top-3 sm:top-4 right-12 sm:right-16 md:right-20">
//                         {/* <button
//                           onClick={() => setShowAddCustomerModal(true)}
//                           className="relative group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-normal px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
//                         >
//                           <FiUserPlus className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
//                           <span className="hidden xs:inline">Add Customer</span>
//                           <span className="xs:hidden">Add Customer</span>
//                         </button> */}
//                       </div>
//                     )}
//                   </div>
//                   <p className="text-slate-600 text-sm sm:text-base">
//                     {editMode ? `Editing order details, items, and measurements for ${getCustomerName(extractCustomerId(viewingOrder))}` :
//                     viewingOrder ? `Viewing order details, items, and measurements for ${getCustomerName(extractCustomerId(viewingOrder))}` : 'Fill all details to create a new order'}
//                   </p>
  
//                   {/* Step Progress Indicator */}
//                   {!viewingOrder && (
//                     <div className="flex items-center justify-center mt-4 sm:mt-6 mb-3 sm:mb-4">
//                       <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
//                         <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${currentStep >= 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200'}`}>
//                           1
//                         </div>
//                         <span className="ml-1 sm:ml-2 font-normal text-xs sm:text-sm">Order Details</span>
//                       </div>
//                       <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
//                       <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
//                         <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${currentStep >= 2 ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200'}`}>
//                           2
//                         </div>
//                         <span className="ml-1 sm:ml-2 font-normal text-xs sm:text-sm">Measurements</span>
//                       </div>
//                       <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
//                       <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
//                         <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${currentStep >= 3 ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200'}`}>
//                           3
//                         </div>
//                         <span className="ml-1 sm:ml-2 font-normal text-xs sm:text-sm">Order Items</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-4 sm:space-y-8 max-h-[70vh] overflow-y-auto">
//                   {/* STEP 1: Order Details Section */}
// {(currentStep === 1 || viewingOrder || editMode) && (
//   <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-200/50 shadow-lg">
//     {/* Header with Order Details and Add Customer button */}
// <div className="flex justify-between items-center mb-3 sm:mb-4">
//   <h3 className="text-base sm:text-lg font-bold text-slate-800">Order Details</h3>
//   {/* Only show Add Customer button when NOT in view mode AND NOT in edit mode */}
//   {!viewingOrder && !editMode && (
//     <button
//       onClick={() => setShowAddCustomerModal(true)}
//       className="relative group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-normal px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
//     >
//       <FiUserPlus className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
//       <span className="hidden xs:inline">Add Customer</span>
//       <span className="xs:hidden">Add Customer</span>
//     </button>
//   )}
// </div>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//       <div>
//         <label className="block text-sm font-bold text-slate-700 mb-1">Customer{!viewingOrder && "*"}</label>
//         {viewingOrder || editMode ? (
//           <input 
//             type="text" 
//             value={getCustomerName(orderData.CustomerId)} 
//             readOnly
//             className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm sm:text-base" 
//           />
//         ) : (
//           <div className="space-y-2">
//             <div className="relative">
//               <input 
//                 type="text" 
//                 value={customerSearch} 
//                 onChange={(e) => {
//                   setCustomerSearch(e.target.value);
//                   setShowCustomerDropdown(true);
//                 }}
//                 onFocus={() => setShowCustomerDropdown(true)}
//                 placeholder="Search customer by name..."
//                 className="w-full border border-slate-300 pl-3 pr-10 py-2 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base" 
//                 disabled={saving}
//               />
//               {/* Clickable dropdown icon */}
//               <button 
//                 type="button"
//                 onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
//                 className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors duration-200"
//               >
//                 <FiChevronDown className={`transform transition-transform duration-200 ${showCustomerDropdown ? 'rotate-180' : ''}`} />
//               </button>
              
//               {showCustomerDropdown && (
//                 <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-xl shadow-2xl max-h-40 sm:max-h-60 overflow-y-auto">
//                   {filteredCustomers.length > 0 ? (
//                     filteredCustomers.map((customer) => (
//                       <div
//                         key={extractCustomerId(customer)}
//                         className="px-3 py-2 hover:bg-slate-100 cursor-pointer transition-colors duration-200 text-sm sm:text-base"
//                         onClick={() => {
//                           handleCustomerSelect(customer);
//                           setShowCustomerDropdown(false);
//                         }}
//                       >
//                         {customer.FullName}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="px-3 py-2 text-slate-500 text-sm sm:text-base">No customers found</div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
      
//       <div>
//         <label className="block text-sm font-bold text-slate-700 mb-1">Order Date </label>
//         <input 
//           type="date" 
//           name="OrderDate" 
//           value={orderData.OrderDate} 
//           onChange={editMode ? handleOrderDataChange : handleOrderChange} 
//           required 
//           className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base bg-slate-100" 
//           disabled={true} // Order date is locked and not editable
//           readOnly
//         />
//         <p className="text-xs text-slate-500 mt-1">Order date is set to current date and cannot be changed</p>
//       </div>
//       <div>
//         <label className="block text-sm font-bold text-slate-700 mb-1">Delivery Date {!viewingOrder && "*"}</label>
//         <input 
//           type="date" 
//           name="DeliveryDate" 
//           value={orderData.DeliveryDate} 
//           onChange={editMode ? handleOrderDataChange : handleOrderChange} 
//           onBlur={(e) => validateDeliveryDate(e.target.value)}
//           min={new Date().toISOString().split('T')[0]}
//           required 
//           className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base" 
//           disabled={!!viewingOrder || saving}
//         />
//       </div>
//       <div>
//         <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
// <select 
//   name="Status" 
//   value={orderData.Status} 
//   onChange={editMode ? handleOrderDataChange : handleOrderChange} 
//   className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base" 
//   disabled={(!!viewingOrder && !editMode) || saving}
// >
//   <option value="priority">Priority</option>
//   <option value="In Progress">In Progress</option>
//   <option value="delivered">Delivered</option>
// </select>
//       </div>
//     </div>

//     {/* Next Button for Step 1 */}
//     {!viewingOrder && !editMode && (
//       <div className="flex justify-end mt-4 sm:mt-6">
//         <button 
//           onClick={handleNextStep}
//           disabled={saving}
//           className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 flex items-center text-sm sm:text-base"
//         >
//           Next
//           <FiArrowRight className="ml-2" />
//         </button>
//       </div>
//     )}
//   </div>
// )}

//                   {/* STEP 2: Measurements Section */}
//                   {(currentStep === 2 || viewingOrder || editMode) && (
//                     <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-200/50 shadow-lg min-w-0">
//                       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-3">
//                         <h3 className="text-base sm:text-lg font-bold text-slate-800">
//                           Measurements {viewingOrder && `(${editMode ? editingMeasurements.length : orderMeasurements.length})`}
//                         </h3>
//                       </div>

//                       {viewingOrder || editMode ? (
//                         <div>
//                           {loadingOrderDetails ? (
//                             <div className="text-center py-6 sm:py-8">
//                               <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl border border-white/20">
//                                 <div className="animate-spin rounded-full h-5 sm:h-6 w-5 sm:w-6 border-b-2 border-blue-800"></div>
//                                 <span className="text-slate-700 font-normal text-sm sm:text-base">Loading measurements...</span>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="overflow-x-auto rounded-2xl border border-slate-200/50">
//                               <table className="min-w-full divide-y divide-slate-200/50 text-sm">
//                                 <thead className="bg-slate-50/80">
//                                   <tr>
//                                     <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">ID</th>
//                                     <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Garment</th>
//                                     <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Neck(Inch)</th>
//                                     <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Chest(Inch)</th>
//                                     <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Waist(Inch)</th>
//                                     <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Length(Inch)</th>
//                                     <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Yards Required</th>
//                                     <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Description</th>
//                                     <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Image</th>
//                                     {/* REMOVED Actions column for View mode */}
//                                     {editMode && (
//                                       <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Actions</th>
//                                     )}
//                                   </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-slate-200/50">
//                                   {(editMode ? editingMeasurements : orderMeasurements).length > 0 ? 
//                                     (editMode ? editingMeasurements : orderMeasurements).map((measurement, index) => (
//                                       <tr 
//                                         key={extractMeasurementId(measurement) || index} 
//                                         className="hover:bg-slate-50 cursor-pointer transition-colors duration-200"
//                                         onClick={() => !editMode && handleMeasurementRowClick(measurement)}
//                                       >
//                                         <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm font-normal text-slate-700">{extractMeasurementId(measurement)}</td>
//                                         <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{getGarmentTypeName(measurement.GarmentTypeId)}</td>
//                                         <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{measurement.Neck || '-'}</td>
//                                         <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{measurement.Chest || '-'}</td>
//                                         <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{measurement.Waist || '-'}</td>
//                                         <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{measurement.Length || '-'}</td>
//                                         <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{measurement.YardsRequired || '-'}</td>
//                                         <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{measurement.Description || '-'}</td>
//                                         <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm">
//                                           {renderMeasurementImage(measurement)}
//                                         </td>
//                                         {/* Only show actions in Edit mode */}
//                                         {editMode && (
//                                           <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm">
//                                             <div className="flex space-x-1">
//                                               <button 
//                                                 onClick={() => handleEditMeasurement(measurement)}
//                                                 className="text-blue-600 hover:text-blue-800 p-1 transition-colors duration-200"
//                                                 title="Edit Measurement"
//                                               >
//                                                 <FiEdit size={14} />
//                                               </button>
//                                             </div>
//                                           </td>
//                                         )}
//                                       </tr>
//                                     )) : (
//                                       <tr>
//                                         <td colSpan={editMode ? "9" : "8"} className="text-center py-6 sm:py-8 text-slate-500 text-sm">
//                                           {loadingOrderDetails ? "Loading measurements..." : `No measurements found for this order. (Debug: ${editMode ? editingMeasurements.length : orderMeasurements.length} items)`}
//                                           No measurements found for this order.
//                                         </td>
//                                       </tr>
//                                     )}
//                                 </tbody>
//                               </table>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         // ADD MEASUREMENT FORM - Table layout with Description as separate row
//                         <div className="rounded-2xl border border-slate-200/50">
//                           <table className="w-full divide-y divide-slate-200/50 text-sm"> 
//                             <thead className="bg-slate-50/80">
//                               <tr>
//                                 <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Garment Type</th>
//                                 <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Neck</th>
//                                 <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Chest</th>
//                                 <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Waist</th>
//                                 <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Length</th>
//                                 <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Yards Required</th>
//                                 <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Image</th>
//                                 <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Actions</th>
//                               </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-slate-200/50">
//                               {newMeasurements.map((measurement, index) => (
//                                 <React.Fragment key={index}>
//                                   <tr className="hover:bg-slate-50 transition-colors duration-200">
//                                     <td className="px-2 sm:px-4 py-2 sm:py-4">
//                                       <select 
//                                         name="GarmentTypeId" 
//                                         value={measurement.GarmentTypeId} 
//                                         onChange={(e) => handleNewMeasurementChange(index, e)} 
//                                         required 
//                                         className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
//                                         disabled={saving}
//                                       >
//                                         <option value="">Select</option>
//                                         {garmentTypes.map((g) => (
//                                           <option key={g.GarmentTypeId} value={g.GarmentTypeId}>
//                                             {g.GarmentTypeName}
//                                           </option>
//                                         ))}
//                                       </select>
//                                     </td>
//                                     <td className="px-2 sm:px-4 py-2 sm:py-4">
//                                       <input 
//                                         type="number" 
//                                         name="Neck" 
//                                         value={measurement.Neck} 
//                                         onChange={(e) => handleNewMeasurementChange(index, e)} 
//                                         placeholder="Neck" 
//                                         step="0.1"
//                                         min="0"
//                                         className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
//                                         disabled={saving}
//                                         onKeyDown={(e) => {
//                                           // Only prevent negative input, allow 0
//                                           if (e.key === '-') {
//                                             e.preventDefault();
//                                           }
//                                         }}
//                                       />
//                                     </td>
//                                     <td className="px-2 sm:px-4 py-2 sm:py-4">
//                                       <input 
//                                         type="number" 
//                                         name="Chest" 
//                                         value={measurement.Chest} 
//                                         onChange={(e) => handleNewMeasurementChange(index, e)} 
//                                         placeholder="Chest" 
//                                         step="0.1"
//                                         min="0"
//                                         className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
//                                         disabled={saving}
//                                         onKeyDown={(e) => {
//                                           if (e.key === '-') {
//                                             e.preventDefault();
//                                           }
//                                         }}
//                                       />
//                                     </td>
//                                     <td className="px-2 sm:px-4 py-2 sm:py-4">
//                                       <input 
//                                         type="number" 
//                                         name="Waist" 
//                                         value={measurement.Waist} 
//                                         onChange={(e) => handleNewMeasurementChange(index, e)} 
//                                         placeholder="Waist" 
//                                         step="0.1"
//                                         min="0"
//                                         className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
//                                         disabled={saving}
//                                         onKeyDown={(e) => {
//                                           if (e.key === '-') {
//                                             e.preventDefault();
//                                           }
//                                         }}
//                                       />
//                                     </td>
//                                     <td className="px-2 sm:px-4 py-2 sm:py-4">
//                                       <input 
//                                         type="number" 
//                                         name="Length" 
//                                         value={measurement.Length} 
//                                         onChange={(e) => handleNewMeasurementChange(index, e)} 
//                                         placeholder="Length" 
//                                         step="0.1"
//                                         min="0"
//                                         className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
//                                         disabled={saving}
//                                         onKeyDown={(e) => {
//                                           if (e.key === '-') {
//                                             e.preventDefault();
//                                           }
//                                         }}
//                                       />
//                                     </td>
//                                     <td className="px-2 sm:px-4 py-2 sm:py-4">
//                     <input 
//                       type="number" 
//                       name="YardsRequired" 
//                       value={measurement.YardsRequired} 
//                       onChange={(e) => handleNewMeasurementChange(index, e)} 
//                       placeholder="Yards" 
//                       step="0.1"
//                       min="0"
//                       className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
//                       disabled={saving}
//                       onKeyDown={(e) => {
//                         if (e.key === '-') e.preventDefault();
//                       }}
//                     />
//                   </td>
//                                     <td className="px-2 sm:px-4 py-2 sm:py-4">
//                                       <div className="relative">
//                                         <input 
//                                           type="file" 
//                                           accept="image/*"
//                                           onChange={(e) => handleFileChange(index, e)} 
//                                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
//                                           disabled={saving}
//                                         />
//                                         <div className="flex items-center justify-center px-2 sm:px-3 py-1 sm:py-2 border border-slate-300 rounded-xl bg-white text-slate-700 transition-all duration-300 hover:bg-slate-50 text-xs sm:text-sm">
//                                           <FiPaperclip className="mr-1" />
//                                           {measurement.file ? (
//                                             <span className="truncate max-w-[80px] sm:max-w-[120px]">
//                                               {measurement.file.name}
//                                             </span>
//                                           ) : (
//                                             'Upload'
//                                           )}
//                                         </div>
//                                       </div>
//                                     </td>
//                                     <td className="px-2 sm:px-4 py-2 sm:py-4">
//                                       {newMeasurements.length > 1 && (
//                                         <button 
//                                           type="button" 
//                                           onClick={() => removeNewMeasurement(index)} 
//                                           className="text-red-500 hover:text-red-700 p-1 transition-colors duration-200"
//                                           title="Remove Measurement"
//                                           disabled={saving}
//                                         >
//                                           <FiTrash2 size={14} />
//                                         </button>
//                                       )}
//                                     </td>
//                                   </tr>
//                                   {/* DESCRIPTION AS SEPARATE ROW - Only in Add Form */}
//                                   <tr>
//                                    <td colSpan="8" className="px-2 sm:px-4 py-3 sm:py-4 bg-slate-50/50">
//                                       <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm">
//                                         <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">Description</label>
//                                         <textarea 
//                                           name="Description" 
//                                           value={measurement.Description} 
//                                           onChange={(e) => handleNewMeasurementChange(index, e)} 
//                                           placeholder="Enter measurement description or notes..."
//                                           rows="3"
//                                           className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm resize-vertical" 
//                                           disabled={saving}
//                                         />
//                                       </div>
//                                     </td>
//                                   </tr>
//                                 </React.Fragment>
//                               ))}
//                             </tbody>
//                           </table>
//                           {(!viewingOrder || editMode) && (
//                             <button 
//                               type="button" 
//                               onClick={addNewMeasurement} 
//                               className="ml-auto px-3 sm:px-4 py-2 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-xs sm:text-sm font-normal w-full sm:w-auto"
//                               disabled={saving}
//                             >
//                               <FiPlusSquare className="mr-1 sm:mr-2" /> Add Measurements
//                             </button>
//                           )}

//                           {/* Navigation Buttons for Step 2 */}
//                           {!viewingOrder && !editMode && (
//                             <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 gap-3">
//                               <button 
//                                 onClick={handlePreviousStep}
//                                 disabled={saving}
//                                 className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center text-sm sm:text-base order-2 sm:order-1"
//                               >
//                                 <FiArrowLeft className="mr-1 sm:mr-2" />
//                                 Previous
//                               </button>
//                               <button 
//                                 onClick={handleNextStep}
//                                 disabled={saving}
//                                 className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center text-sm sm:text-base order-1 sm:order-2"
//                               >
//                                 Next
//                                 <FiArrowRight className="ml-1 sm:ml-2" />
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* STEP 3: Order Items Section */}
//                   {(currentStep === 3 || viewingOrder || editMode) && (
//                     <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-200/50 shadow-lg">
//                       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-3">
//                         <h3 className="text-base sm:text-lg font-bold text-slate-800">
//                           Order Items {viewingOrder && `(${editMode ? editingOrderItems.length : orderItemsData.length})`}
//                         </h3>
                        
//                         <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
//                           {/* Save Changes Button - Only show when there are unsaved changes */}
//                           {hasUnsavedChanges && (
//                             <button 
//                               onClick={saveAllStatusChanges}
//                               disabled={saving}
//                               className="px-4 sm:px-6 py-2 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center text-sm w-full sm:w-auto"
//                             >
//                               {saving ? (
//                                 <span className="flex items-center">
//                                   <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white mr-2"></div>
//                                   Saving...
//                                 </span>
//                               ) : (
//                                 <>
//                                   <FiCheckCircle className="mr-2" />
//                                   Save Status Changes
//                                 </>
//                               )}
//                             </button>
//                           )}
//                         </div>
//                       </div>

//                       {viewingOrder || editMode ? (
//                         <div>
//                           {loadingOrderDetails ? (
//                             <div className="text-center py-6 sm:py-8">
//                               <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl border border-white/20">
//                                 <div className="animate-spin rounded-full h-5 sm:h-6 w-5 sm:w-6 border-b-2 border-blue-800"></div>
//                                 <span className="text-slate-700 font-normal text-sm sm:text-base">Loading order items...</span>
//                               </div>
//                             </div>
//                           ) : (
//                             <div>
//                               <div className="overflow-x-auto rounded-2xl border border-slate-200/50">
//                                 <table className="min-w-full divide-y divide-slate-200/50 text-sm">
//                                   <thead className="bg-slate-50/80">
//                                     <tr>
//                                       <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Item ID</th>
//                                       <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Garment</th>
//                                       <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Fabric</th>
//                                       <th className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs font-bold text-slate-700 uppercase">Price</th>
//                                       <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Status</th>
//                                       {/* REMOVED Actions column for View mode */}
//                                       {/* {editMode && (
//                                         <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-bold text-slate-700 uppercase">Actions</th>
//                                       )} */}
//                                     </tr>
//                                   </thead>
//                                   <tbody className="bg-white divide-y divide-slate-200/50">
//                                     {(editMode ? editingOrderItems : orderItemsData).length > 0 ? 
//                                       (editMode ? editingOrderItems : orderItemsData).map((item, index) => {
//                                       const orderItemId = extractOrderItemId(item);
//                                       const garmentTypeId = item.GarmentTypeId || item.garmentTypeId;
//                                       const fabricTypeId = item.FabricTypeId || item.fabricTypeId;
//                                       const price = parseInt(item.Price || item.price || 0);
                                      
//                                       // FIX: Properly extract status from all possible properties
//                                       const currentStatus = item.Status || item.status || 'pending';
                                      
//                                       // Use updated status if available, otherwise use current status
//                                       const displayStatus = bulkStatusUpdates[orderItemId] || currentStatus;
                                      
//                                       return (
//                                         <tr key={index} className="hover:bg-slate-50 transition-colors duration-200">
//                                           <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm font-normal text-slate-700">{orderItemId || `Temp-${index}`}</td>
//                                           <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{getGarmentTypeName(garmentTypeId)}</td>
//                                           <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600">{getFabricTypeName(fabricTypeId)}</td>
//                                           <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600 text-center">
//                                             {formatCurrency(price)}
//                                           </td>
//                                           <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm">
//                                             {/* UPDATED: Make status non-editable in View mode, editable in Edit mode */}
//                                             {editMode ? (
//                                               <div className="relative">
//                                               <select
//   value={displayStatus}
//   onChange={(e) => {
//     console.log(`🔄 Changing item ${orderItemId} from ${displayStatus} to ${e.target.value}`);
//     handleIndividualStatusChange(orderItemId, e.target.value);
//   }}
//   className={`w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs border-0 focus:ring-2 focus:ring-blue-200 transition-all duration-300 ${getOrderItemStatusStyle(displayStatus)}`}
//   disabled={updatingItemStatus && statusUpdateOrderItemId === orderItemId}
// >
//   <option value="priority">Priority</option>
//   <option value="In Progress">In Progress</option>
//   <option value="delivered">Delivered</option>
// </select>
                                                
//                                                 {updatingItemStatus && statusUpdateOrderItemId === orderItemId && (
//                                                   <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
//                                                     <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-800"></div>
//                                                   </div>
//                                                 )}
//                                               </div>
//                                             ) : (
//                                               // View mode - display only, no editing
//                                               <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs ${getOrderItemStatusStyle(displayStatus)}`}>
//                                                 {displayStatus}
//                                               </div>
//                                             )}
                                            
//                                             {/* Show indicator if status has been changed but not saved */}
//                                             {bulkStatusUpdates[orderItemId] && bulkStatusUpdates[orderItemId] !== currentStatus && (
//                                               <div className="text-xs text-yellow-600 mt-1 flex items-center">
//                                                 <FiAlertCircle className="mr-1" size={10} />
//                                                 Unsaved
//                                               </div>
//                                             )}
//                                           </td>
//                                         </tr>
//                                       );
//                                     }) : (
//                                       <tr>
//                                         <td colSpan={editMode ? "6" : "5"} className="text-center py-6 sm:py-8 text-slate-500 text-sm">
//                                           {loadingOrderDetails ? "Loading order items..." : `No items found for this order. (Debug: ${editMode ? editingOrderItems.length : orderItemsData.length} items)`}
//                                           No items found for this order.
//                                         </td>
//                                       </tr>
//                                     )}
//                                   </tbody>
//                                 </table>
//                               </div>
                              
//                             {/* Total Amount Display for View/Edit Mode */}
// {(editMode ? editingOrderItems : orderItemsData).length > 0 && (
//   <div className="bg-blue-50/80 p-3 sm:p-4 rounded-xl border border-blue-200/50 mt-3 sm:mt-4">
//     <div className="space-y-3">
//       {/* Total Order Amount */}
//       <div className="flex justify-between items-center">
//         <span className="font-normal text-blue-800 text-sm sm:text-base">Total Order Amount:</span>
//         <span className="font-normal text-lg text-blue-800">
//           {formatCurrency(editMode ? calculateEditingTotalAmount() : getOrderTotalAmount(viewingOrder))}
//         </span>
//       </div>
      
//       {/* NEW: Advance Amount Display */}
//       {viewingOrder && (
//         <>
//           {/* Advance Amount */}
//           <div className="flex justify-between items-center">
//             <span className="font-normal text-green-700 text-sm sm:text-base">Advance Amount:</span>
//             <span className="font-normal text-lg text-green-700">
//               {formatCurrency(getOrderAdvanceData(extractOrderId(viewingOrder)).AdvanceAmount)}
//             </span>
//           </div>
          
//           {/* Balance Amount */}
//           <div className="flex justify-between items-center">
//             <span className="font-normal text-orange-700 text-sm sm:text-base">Balance Amount:</span>
//             <span className="font-normal text-lg text-orange-700">
//               {formatCurrency(getOrderAdvanceData(extractOrderId(viewingOrder)).BalanceAmount)}
//             </span>
//           </div>
          
//           {/* Pay Balance Button aligned under the values */}
//           {getOrderAdvanceData(extractOrderId(viewingOrder)).BalanceAmount > 0 && (
//             <div className="flex justify-end">
//               <button
//                 onClick={() => handlePayBalance(viewingOrder)}
//                 disabled={saving}
//                 className="px-6 py-2 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm"
//               >
//                 {saving ? 'Processing...' : 'Pay Balance'}
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   </div>
// )}
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <div>
//                           {/* Display Order ID information */}
//                           <div className="bg-blue-50/80 p-3 sm:p-4 rounded-xl border border-blue-200/50 mb-3 sm:mb-4">
//                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
//                               <div>
//                                 <span className="font-normal text-blue-800 text-sm">Order ID:</span>
//                                 <span className="ml-2 font-normal text-lg text-blue-800">{savedOrderId}</span>
//                               </div>
//                               <div className="text-xs sm:text-sm text-blue-600">
//                                 Auto-created items: {garmentTypesFromMeasurements.map(id => getGarmentTypeName(id)).join(', ')}
//                               </div>
//                             </div>
//                           </div>

//                           {/* Auto-create order items based on measurements */}
//                           {(() => {
//                             // Auto-populate newItems with garment types from measurements when first entering step 3
//                             if (newItems.length === 1 && !newItems[0].garmentTypeId && garmentTypesFromMeasurements.length > 0) {
//                               const autoItems = garmentTypesFromMeasurements.map(garmentTypeId => {
//                                 const measurementId = garmentTypeToMeasurementMap.get(parseInt(garmentTypeId));
//                                 return {
//                                   garmentTypeId: garmentTypeId,
//                                   fabricTypeId: "",
//                                   price: "",
//                                   measurementId: measurementId ? measurementId.toString() : ""
//                                 };
//                               });
//                               setNewItems(autoItems);
//                             }

//                             return newItems.map((item, index) => {
//                               const garmentTypeName = getGarmentTypeName(item.garmentTypeId);
//                               const measurementId = garmentTypeToMeasurementMap.get(parseInt(item.garmentTypeId));
                              
//                               // Auto-fill measurement ID if not already set
//                               if (item.garmentTypeId && !item.measurementId && measurementId) {
//                                 const updatedItems = [...newItems];
//                                 updatedItems[index].measurementId = measurementId.toString();
//                                 setNewItems(updatedItems);
//                               }

//                               return (
//                                 <div key={index} className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/50 relative mb-4 sm:mb-5">
//                                   {/* Item Header with Garment Type */}
//                                   <div className="flex items-center justify-between mb-3 sm:mb-4">
//                                     <div className="flex items-center space-x-2">
//                                       <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
//                                         <FiPackage className="text-white text-sm" />
//                                       </div>
//                                       <h4 className="text-sm sm:text-base font-bold text-slate-800">
//                                         {garmentTypeName || `Item ${index + 1}`}
//                                       </h4>
//                                     </div>
//                                   </div>

//                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//                                     <div>
//                                       <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Garment Type</label>
//                                       <div className="w-full border border-slate-300 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs sm:text-sm flex items-center">
//                                         <span className="flex-1">{garmentTypeName || "Not selected"}</span>
//                                         {item.garmentTypeId && (
//                                           <FiCheckCircle className="text-green-600 ml-2" size={14} />
//                                         )}
//                                       </div>
//                                       <p className="text-xs text-slate-500 mt-1">
//                                         From your measurements
//                                       </p>
//                                     </div>
                                    
//                                     <div>
//                                       <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Fabric Type </label>
//                                       <select 
//                                         name="fabricTypeId" 
//                                         value={item.fabricTypeId} 
//                                         onChange={(e) => handleNewItemChange(index, e)} 
//                                         className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
//                                         disabled={saving}
//                                         required
//                                       >
//                                         <option value="">-- Select Fabric Type --</option>
//                                         {fabricTypes.map((f) => (
//                                           <option key={f.FabricTypeId} value={f.FabricTypeId}>
//                                             {f.FabricTypeName}
//                                           </option>
//                                         ))}
//                                       </select>
//                                     </div>
                                    
//                                     <div>
//                                       <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Price </label>
                                     
// <input 
//   type="number" 
//   name="price" 
//   value={item.price} 
//   onChange={(e) => {
//     const value = e.target.value;
//     // Only allow integers (no decimals)
//     if (value === '' || /^\d+$/.test(value)) {
//       handleNewItemChange(index, e);
//     }
//   }}
//   onBlur={(e) => {
//     // Validate on blur - ensure value is not negative
//     const value = e.target.value;
//     if (value !== '' && parseInt(value) < 0) {
//       setNotification({ type: 'error', message: 'Price cannot be negative' });
//       const updatedItems = [...newItems];
//       updatedItems[index].price = '';
//       setNewItems(updatedItems);
//     }
//   }}
//   placeholder="0" 
//   min="0"
//   className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm" 
//   disabled={saving}
//   required
// />
//                                       {/* <p className="text-xs text-slate-500 mt-1">
//                                         Must be greater than or equal to 0
//                                       </p> */}
//                                     </div>

//                                     <div>
//                                       <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Measure ID</label>
//                                       <input 
//                                         type="text" 
//                                         name="measurementId" 
//                                         value={item.measurementId || ''} 
//                                         readOnly
//                                         placeholder="Auto-filled"
//                                         className="w-full border border-slate-300 px-2 sm:px-3 py-1 sm:py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs sm:text-sm"
//                                       />
//                                       <p className="text-xs text-slate-500 mt-1">
//                                         Auto-filled from measurements
//                                       </p>
//                                     </div>
//                                   </div>
                                  
//                                   {/* Price validation error */}
//                                   {item.price && parseFloat(item.price) < 0 && (
//                                     <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
//                                       <p className="text-xs text-red-700 flex items-center">
//                                         <FiAlertCircle className="mr-2" size={12} />
//                                         Price cannot be negative
//                                       </p>
//                                     </div>
//                                   )}
                                  
//                                   <div className="mt-3 text-xs sm:text-sm text-slate-600 flex justify-between items-center">
//                                     <span>Item Price: {formatCurrency(parseFloat(item.price) || 0)}</span>
//                                     {item.price && parseFloat(item.price) > 0 && (
//                                       <span className="font-bold text-blue-700">
//                                         Total: {formatCurrency(parseFloat(item.price) || 0)}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                               );
//                             });
//                           })()}

//                           {newItems.length > 0 && (
//                             <div className="bg-blue-50/80 p-4 sm:p-5 rounded-2xl border border-blue-200/50 mt-4 sm:mt-5">
//                               <div className="flex justify-between items-center">
//                                 <span className="font-normal text-blue-800 text-base sm:text-lg">Total Order Amount:</span>
//                                 <span className="font-bold text-xl text-blue-800">
//                                   {formatCurrency(calculateTotalAmount())}
//                                 </span>
//                               </div>
//                               <div className="mt-2 text-xs sm:text-sm text-blue-600">
//                                 {newItems.length} item(s) • {garmentTypesFromMeasurements.length} garment type(s) from measurements
//                               </div>
//                             </div>
//                           )}

//                           {/* Navigation and Save Buttons for Step 3 */}
//                           {!viewingOrder && !editMode && (
//                             <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3">
//                               <button 
//                                 onClick={handlePreviousStep}
//                                 disabled={saving}
//                                 className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center text-sm sm:text-base order-2 sm:order-1"
//                               >
//                                 <FiArrowLeft className="mr-1 sm:mr-2" />
//                                 Previous
//                               </button>
//                               <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 order-1 sm:order-2">
//                                 <button 
//                                   onClick={() => {
//                                     setShowOrderModal(false);
//                                     resetForm();
//                                   }} 
//                                   className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 font-normal text-sm sm:text-base"
//                                   disabled={saving}
//                                 >
//                                   Cancel
//                                 </button>
//                                 <button 
//                                   onClick={handleSaveOrderItems} 
//                                   disabled={saving || newItems.some(item => !item.price || parseFloat(item.price) < 0 || !item.fabricTypeId)}
//                                   className="px-4 sm:px-8 py-2 sm:py-2.5 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
//                                 >
//                                   {saving ? (
//                                     <span className="flex items-center">
//                                       <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
//                                       Saving...
//                                     </span>
//                                   ) : (
//                                     'Save Order'
//                                   )}
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                           {/* Save Button for Edit Mode */}
//                           {editMode && (
//                             <div className="flex justify-end mt-4 sm:mt-6">
//                               <button 
//                                 onClick={handleSaveOrder} 
//                                 disabled={saving}
//                                 className="px-4 sm:px-8 py-2 sm:py-2.5 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base w-full sm:w-auto"
//                               >
//                                 {saving ? (
//                                   <span className="flex items-center">
//                                     <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
//                                     Saving...
//                                   </span>
//                                 ) : (
//                                   'Save Order Changes'
//                                 )}
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Measurement Modal */}
//       {editingMeasurementId && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
//           <div className="relative w-full max-w-md">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//             <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
//               <div className="p-4 sm:p-6">
//                 <div className="flex justify-between items-center mb-4 sm:mb-6">
//                   <div className="flex items-center space-x-2 sm:space-x-3">
//                     <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                       <FiEdit className="text-white text-base sm:text-lg" />
//                     </div>
//                     <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                       Edit Measurement
//                     </h2>
//                   </div>
//                   <button 
//                     onClick={cancelMeasurementEdit} 
//                     className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//                   >
//                     <FiX className="text-xl sm:text-2xl" />
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-1">Garment Type</label>
//                     <select 
//                       name="GarmentTypeId" 
//                       value={editingMeasurementData.GarmentTypeId} 
//                       onChange={handleEditMeasurementChange} 
//                       className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
//                     >
//                       <option value="">-Select-</option>
//                       {garmentTypes.map((g) => (
//                         <option key={g.GarmentTypeId} value={g.GarmentTypeId}>
//                           {g.GarmentTypeName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm font-bold text-slate-700 mb-1">Neck</label>
//                       <input 
//                         type="number" 
//                         name="Neck" 
//                         value={editingMeasurementData.Neck} 
//                         onChange={handleEditMeasurementChange} 
//                         placeholder="Neck" 
//                         step="0.1"
//                         min="0"
//                         className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-bold text-slate-700 mb-1">Chest</label>
//                       <input 
//                         type="number" 
//                         name="Chest" 
//                         value={editingMeasurementData.Chest} 
//                         onChange={handleEditMeasurementChange} 
//                         placeholder="Chest" 
//                         step="0.1"
//                         min="0"
//                         className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm font-bold text-slate-700 mb-1">Waist</label>
//                       <input 
//                         type="number" 
//                         name="Waist" 
//                         value={editingMeasurementData.Waist} 
//                         onChange={handleEditMeasurementChange} 
//                         placeholder="Waist" 
//                         step="0.1"
//                         min="0"
//                         className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-bold text-slate-700 mb-1">Length</label>
//                       <input 
//                         type="number" 
//                         name="Length" 
//                         value={editingMeasurementData.Length} 
//                         onChange={handleEditMeasurementChange} 
//                         placeholder="Length" 
//                         step="0.1"
//                         min="0"
//                         className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
//                       />
//                     </div>
//                   </div>

//                    {/* ADD YARDS REQUIRED FIELD */}
//         <div>
//           <label className="block text-sm font-bold text-slate-700 mb-1">Yards Required</label>
//           <input 
//             type="number" 
//             name="YardsRequired" 
//             value={editingMeasurementData.YardsRequired} 
//             onChange={handleEditMeasurementChange} 
//             placeholder="Yards Required" 
//             step="0.1"
//             min="0"
//             className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
//           />
//         </div>
                  
//                   <div>
//                     <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
//                     <textarea 
//                       name="Description" 
//                       value={editingMeasurementData.Description} 
//                       onChange={handleEditMeasurementChange} 
//                       placeholder="Description" 
//                       rows="3"
//                       className="w-full border border-slate-300 px-3 py-2.5 rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 mt-6">
//                   <button 
//                     onClick={cancelMeasurementEdit}
//                     className="px-4 sm:px-6 py-2.5 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 font-normal text-sm sm:text-base"
//                   >
//                     Cancel
//                   </button>
//                   <button 
//                     onClick={handleUpdateMeasurement}
//                     disabled={saving}
//                     className="px-4 sm:px-6 py-2.5 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-normal disabled:opacity-50 disabled:hover:scale-100 text-sm sm:text-base"
//                   >
//                     {saving ? (
//                       <span className="flex items-center">
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Updating...
//                       </span>
//                     ) : (
//                       'Update Measurement'
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}


//       {/* Image Popup Modal */}
// {showImagePopup && selectedMeasurement && (
//   <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-2 sm:p-4">
//     <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl blur opacity-20 transform "></div>
//       <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-h-full overflow-y-auto">
//         <div className="p-4 sm:p-6">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-4 sm:mb-6">
//             <div className="flex items-center space-x-2 sm:space-x-3">
//               <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-800 to-blue-700 rounded-2xl shadow-lg">
//                 <FiImage className="text-white text-base sm:text-lg" />
//               </div>
//               <h2 className="text-xl sm:text-2xl font-normal bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                 Measurement Details
//               </h2>
//             </div>
//             <button 
//               onClick={() => {
//                 setShowImagePopup(false);
//                 setSelectedMeasurement(null);
//               }} 
//               className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/50 transition-colors duration-200"
//             >
//               <FiX className="text-xl sm:text-2xl" />
//             </button>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
//             {/* Image Section */}
//             <div>
//               <h3 className="text-base sm:text-lg font-normal mb-3 sm:mb-4 text-slate-800">Measurement Image</h3>
//               {selectedMeasurement.IMAGEURL ? (
//                 <div className="border-2 border-slate-300 rounded-2xl overflow-hidden shadow-lg">
//                   <img
//                     src={selectedMeasurement.IMAGEURL}
//                     alt="Measurement"
//                     className="w-full h-auto max-h-64 sm:max-h-96 object-contain"
//                   />
//                 </div>
//               ) : (
//                 <div className="border-2 border-dashed border-slate-300 rounded-2xl h-48 sm:h-64 flex items-center justify-center bg-slate-100">
//                   <div className="text-center">
//                     <FiImage className="text-slate-400 text-3xl sm:text-4xl mx-auto mb-2" />
//                     <p className="text-slate-500 text-sm sm:text-base">No image available</p>
//                   </div>
//                 </div>
//               )}
              
//               {selectedMeasurement.IMAGEURL && (
//                 <div className="mt-3 sm:mt-4 flex justify-center">
//                   <a 
//                     href={selectedMeasurement.IMAGEURL} 
//                     download="measurement-image"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="px-4 sm:px-6 py-2 bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center font-normal text-sm sm:text-base"
//                   >
//                     <FiPaperclip className="mr-1 sm:mr-2" />
//                     Download
//                   </a>
//                 </div>
//               )}
//             </div>

//             {/* Measurement Details Section */}
//             <div>
//               <h3 className="text-base sm:text-lg font-normal mb-3 sm:mb-4 text-slate-800">Measurement Details</h3>
//               <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-6 border border-slate-200/50">
//                 <table className="w-full border-collapse text-sm sm:text-base">
//                   <tbody>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700 w-1/2">Measurement ID</td>
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-900">
//                         {extractMeasurementId(selectedMeasurement)}
//                       </td>
//                     </tr>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Garment Type</td>
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-900">
//                         {getGarmentTypeName(selectedMeasurement.GarmentTypeId)}
//                       </td>
//                     </tr>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Neck</td>
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-900">
//                         {selectedMeasurement.Neck ? `${selectedMeasurement.Neck} inches` : 'N/A'}
//                       </td>
//                     </tr>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Chest</td>
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-900">
//                         {selectedMeasurement.Chest ? `${selectedMeasurement.Chest} inches` : 'N/A'}
//                       </td>
//                     </tr>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Waist</td>
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-900">
//                         {selectedMeasurement.Waist ? `${selectedMeasurement.Waist} inches` : 'N/A'}
//                       </td>
//                     </tr>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Length</td>
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-900">
//                         {selectedMeasurement.Length ? `${selectedMeasurement.Length} inches` : 'N/A'}
//                       </td>
//                     </tr>
//                     {/* FIXED: Separate row for Yards Required */}
//                     <tr className="border-b border-slate-200">
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Yards Required</td>
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-900">
//                         {selectedMeasurement.YardsRequired ? `${selectedMeasurement.YardsRequired} yards` : 'N/A'}
//                       </td>
//                     </tr>
//                     <tr className="border-b border-slate-200">
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Description</td>
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-900">
//                         {selectedMeasurement.Description || 'No description provided'}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 font-normal text-slate-700">Customer</td>
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-900">
//                         {getCustomerName(extractCustomerId(selectedMeasurement))}
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

// {/* Advance Amount Form Modal */}
//       {showAdvanceForm && selectedOrderForAdvance && (
//         <AdvanceAmountForm
//           orderId={selectedOrderForAdvance.orderId}
//           totalAmount={selectedOrderForAdvance.totalAmount}
//           onSave={handleSaveAdvanceAmount}
//           onClose={() => {
//             setShowAdvanceForm(false);
//             setSelectedOrderForAdvance(null);
//             // setShowOrderModal(false);
//             resetForm();
//           }}
//         />
//       )}
// {/* Bill Template Modal */}
// {showBill && billData && (
//   <PaymentReceipt
//     orderData={billData}
//     onClose={() => {
//       setShowBill(false);
//       setBillData(null);
//       setSelectedOrderForBill(null);
//     }}
//     onDownloadPDF={downloadBillAsPDF}  
//   />
// )}

//     </div>
//   );
// };

// export default Orders;