import { FiX, FiPrinter, FiShoppingBag, FiDownload } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetOrderItems } from "../actions/orderAction";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// localStorage functions
const saveOrderToStorage = (orderData) => {
  try {
    const orders = getOrdersFromStorage();
    const newOrder = {
      ...orderData,
      id: orderData.orderId || Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem('tailorOrders', JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error('Error saving order:', error);
    return false;
  }
};

const getOrdersFromStorage = () => {
  try {
    const orders = localStorage.getItem('tailorOrders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

const getOrderFromStorage = (orderId) => {
  try {
    const orders = getOrdersFromStorage();
    return orders.find(order => order.id === orderId || order.orderId === orderId);
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
};

const PaymentReceipt = ({ orderData, onClose, onPrint, onSaveOrder, onDownloadPDF }) => {
  const receiptRef = useRef();
  const [isSaved, setIsSaved] = useState(false);
  const dispatch = useDispatch();
  
  // Get order items from Redux store
  const orderItemsState = useSelector((state) => state.orderItemsGet || {});
  const orderItems = orderItemsState.responseBody || [];
  const orderItemsLoading = orderItemsState.loading || false;

  // Get garment types and fabric types from Redux for name mapping
  const { responseBody: garmentTypes = [] } = useSelector((state) => state.garmentTypeList || {});
  const { responseBody: fabricTypes = [] } = useSelector((state) => state.fabricTypeList || {});

  // Filter order items for this specific order
  const filteredOrderItems = orderItems.filter(item => {
    const itemOrderId = item.OrderId || item.orderId || item.OrderID || item.orderID;
    return String(itemOrderId) === String(orderData?.orderId);
  });

  // Fetch order items when component mounts or orderId changes
  useEffect(() => {
    if (orderData?.orderId) {
      console.log('📦 Fetching order items for order ID:', orderData.orderId);
      dispatch(GetOrderItems(orderData.orderId));
    }
  }, [dispatch, orderData?.orderId]);

  // Save order to localStorage when component mounts
  useEffect(() => {
    if (orderData && !isSaved) {
      const saved = saveOrderToStorage(orderData);
      if (saved) {
        setIsSaved(true);
        if (onSaveOrder) {
          onSaveOrder(orderData);
        }
      }
    }
  }, [orderData, isSaved, onSaveOrder]);

  // Helper functions to get garment and fabric names
  const getGarmentTypeName = (id) => {
    if (!id) return 'Unknown Garment';
    const garment = garmentTypes.find((g) => 
      String(g.GarmentTypeId || g.garmentTypeId || g.id) === String(id)
    );
    return garment ? garment.GarmentTypeName : `Garment ${id}`;
  };

  const getFabricTypeName = (id) => {
    if (!id) return 'Unknown Fabric';
    const fabric = fabricTypes.find((f) => 
      String(f.FabricTypeId || f.fabricTypeId || f.id) === String(id)
    );
    return fabric ? fabric.FabricTypeName : `Fabric ${id}`;
  };

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Print function
  const handlePrint = () => {
    const printContent = receiptRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Receipt - ${orderData?.orderId}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              @page { margin: 0; size: 80mm auto; }
              body { margin: 0; padding: 10px; font-family: Arial, sans-serif; }
            }
          </style>
        </head>
        <body>
          <div class="max-w-sm mx-auto">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // PDF Download function
  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
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
      const filename = `Invoice_${orderData?.orderId}_${timestamp}.pdf`;
      
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!orderData) return null;

  const {
    orderId,
    customerName,
    totalAmount = 0,
    advanceAmount = 0,
    balanceAmount = 0,
    deliveryDate,
    orderDate,
    paymentMethod = "Cash"
  } = orderData;

  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Format current date as YYYY-MM-DD
  const currentDate = formatDate(new Date());

  // Format delivery date as YYYY-MM-DD
  const formattedDeliveryDate = formatDate(deliveryDate);

  // Format currency
const formatCurrency = (amount) => {
  const numAmount = parseFloat(amount || 0);
  return numAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="relative w-full max-w-sm">
        <div className="relative bg-white rounded-lg shadow-2xl border-2 border-gray-800">
          
          {/* Receipt Header */}
          <div className="bg-white p-4 border-b-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FiShoppingBag className="text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">ELEGANT STITCHES</h1>
              </div>
              <p className="text-xs text-gray-600">Premium Tailoring</p>
              <p className="text-xs text-gray-500 mt-1">123/1,Fashion St, Colombo</p>
              <p className="text-xs text-gray-500">Phone: (011) 286 7511</p>
            </div>
          </div>

          {/* Receipt Content */}
          <div className="p-4" ref={receiptRef}>
            {/* Order Details */}
            <div className="text-center mb-4">
              <div className="text-m font-medium text-gray-700 mb-2">CASH RECEIPT</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-left">
                <div>
                  <span className="text-gray-600">Customer Name:</span>
                  <span className="ml-1 font-normal">{customerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-1 font-normal">{currentDate}</span>
                </div>
                <div>
                  <span className="text-gray-600">Time:</span>
                  <span className="ml-1 font-normal">{currentTime}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="ml-1 font-normal">{formattedDeliveryDate}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 p-2 bg-gray-50 flex justify-between items-center">
              <div className="text-xs text-gray-600">Order ID:</div>
              <div className="font-normal text-m text-gray-900">{orderId}</div>
            </div>

            {/* Order Items Section */}
            {orderItemsLoading ? (
              <div className="text-center py-2 mb-4">
                <p className="text-xs text-gray-500">Loading items...</p>
              </div>
            ) : filteredOrderItems.length > 0 ? (
              <div className=" border-gray-300 rounded-md mb-4">
                <div className="bg-gray-100 px-3 py-2  border-gray-300">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Items</span>
                    <span>Price (Rs.)</span>
                  </div>
                </div>
                <div className="max-h-20 overflow-y-auto">
                  {filteredOrderItems.map((item, index) => {
                    const garmentTypeId = item.GarmentTypeId || item.garmentTypeId;
                    const fabricTypeId = item.FabricTypeId || item.fabricTypeId;
                    const itemPrice = parseInt(item.Price || item.price || 0);
                    const garmentName = getGarmentTypeName(garmentTypeId);
                    const fabricName = getFabricTypeName(fabricTypeId);
                    
                    return (
                      <div key={index} className="px-3 py-2 ">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            {/* Combined Garment and Fabric Name */}
                            <p className="text-sm font-normal text-gray-600">
                              {garmentName} ({fabricName})
                            </p>
                            
                            {/* Additional item details */}
                            {item.Description && (
                              <p className="text-xs text-gray-500 mt-1">{item.Description}</p>
                            )}
                          </div>
                          <div className="text-right ml-2 border-b border-gray-200 last:border-b-0">
                            <p className="text-sm font-normal text-gray-900">
                             Rs. {formatCurrency(itemPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-2 mb-4">
                <p className="text-xs text-gray-500">No items found for this order</p>
              </div>
            )}

            {/* Amount Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm  pb-1  border-b border-gray-200 last:border-b-0">
                <span className="font-semibold text-gray-900">Total Amount:</span>
                <span className="font-semibold text-gray-900 ">
                  Rs. {formatCurrency(totalAmount)}
                </span>
              </div>
              
              <div className="flex justify-between text-sm  pb-1">
                <span className="text-gray-600">Advance Paid:</span>
                <span className="font-normal text-gray-600">
                 Rs. {formatCurrency(advanceAmount)}
                </span>
              </div>

              <div className="flex justify-between text-sm  pb-1">
                <span className="text-gray-600">Balance Due:</span>
                <span className="font-normal text-gray-600">
                  Rs. {formatCurrency(balanceAmount)}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            {/* <div className="border-t border-dashed border-gray-300 pt-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-900">{paymentMethod}</span>
              </div>
            </div> */}

            {/* Footer */}
            <div className="text-center border-t border-dashed border-gray-300 pt-3">
              <p className="text-xs text-gray-500 mb-2">
                Thank you for choosing Elegant Stitches
              </p>
              {/* {isSaved && (
                <p className="text-xs text-blue-600 font-medium">✓ Order saved successfully</p>
              )} */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors w-full sm:w-auto justify-center"
              >
                <FiX size={16} />
                Close
              </button>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors flex-1 justify-center"
                >
                  <FiDownload size={16} />
                  PDF
                </button>
                <button 
                  onClick={handlePrint}
                  className="px-4 py-2 bg-red-600 text-white rounded text-sm font-semibold flex items-center gap-2 hover:bg-red-700 transition-colors flex-1 justify-center"
                >
                  <FiPrinter size={16} />
                  Print
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;