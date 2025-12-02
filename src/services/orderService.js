
import axios from 'axios';

const GetOrders = async () => {
  const config = {
    method: 'get',
    url: '/Order/GetOrders'
  };
  return axios.request(config);
};

const AddOrder = async (AddOrderData) => {
  try {
    console.log("📤 Creating order:", AddOrderData);
    
    const response = await axios.post('/Order/AddOrder', AddOrderData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ AddOrder response:", response.data);
    
    // Extract Order ID from response
    let orderId;
    
    if (response.data.ResultSet !== undefined && response.data.ResultSet !== null) {
      orderId = Number(response.data.ResultSet);
      console.log("🎯 Order ID from ResultSet:", orderId);
    }
    else if (response.data.Result !== undefined && response.data.Result !== null) {
      orderId = Number(response.data.Result);
      console.log("🎯 Order ID from Result:", orderId);
    }
    else {
      console.warn("⚠️ Order ID not found in standard fields, searching...");
      const allFields = Object.keys(response.data);
      
      for (let key of allFields) {
        const value = response.data[key];
        if (typeof value === 'number' && value > 0) {
          orderId = value;
          console.log(`🎯 Order ID found in field '${key}':`, orderId);
          break;
        }
      }
      
      if (!orderId) {
        throw new Error("No Order ID found in response: " + JSON.stringify(response.data));
      }
    }

    console.log("🎯 FINAL Order ID:", orderId);
    return { ...response, orderId };
    
  } catch (error) {
    console.error("❌ AddOrder error:", error);
    throw error;
  }
};

const AddOrderItem = async (AddOrderItemData) => {
  try {
    console.log("📤 Creating order item:", AddOrderItemData);
    
    const queryParams = new URLSearchParams();
    
    // Add all required parameters with exact names
    if (AddOrderItemData.OrderId) queryParams.append('OrderId', AddOrderItemData.OrderId);
    if (AddOrderItemData.GarmentTypeId) queryParams.append('GarmentTypeId', AddOrderItemData.GarmentTypeId);
    if (AddOrderItemData.FabricTypeId) queryParams.append('FabricTypeId', AddOrderItemData.FabricTypeId);
    if (AddOrderItemData.Price) queryParams.append('Price', AddOrderItemData.Price);
    if (AddOrderItemData.MeasurementId) queryParams.append('MeasurementId', AddOrderItemData.MeasurementId);
    if (AddOrderItemData.Quantity) queryParams.append('Quantity', AddOrderItemData.Quantity);
    if (AddOrderItemData.CustomerId) queryParams.append('CustomerId', AddOrderItemData.CustomerId);
    
    const url = `/Order/AddOrderItem?${queryParams.toString()}`;
    console.log("🔗 Final URL:", url);
    
    // Send empty body, all data in query parameters
    const response = await axios.post(url, null, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ AddOrderItem response:", response.data);
    return response;
    
  } catch (error) {
    console.error("❌ AddOrderItem error:", error);
    throw error;
  }
};

const GetOrderItems = async (orderId) => {
  try {
    console.log("🔍 Fetching order items for order ID:", orderId);
    
    const response = await axios.get(`/Order/GetOrderItems?orderId=${orderId}`);
    
    console.log("✅ GetOrderItems response:", response.data);
    return response;
    
  } catch (error) {
    console.error("❌ GetOrderItems error:", error);
    throw error;
  }
};

const UpdateStatusOrder = async (UpdateStatusOrdereData) => {
  let config = {
    method: 'post', 
    url: '/Order/UpdateStatusOrder', 
    data: UpdateStatusOrdereData
  };
  return axios.request(config);
}; 

const UpdateStatusOrderItem = async (updateData) => {
  let config = {
    method: 'post', 
    url: '/Order/UpdateStatusOrderItem', 
    data: updateData
  };
  return axios.request(config);
}; 


const GetOrderItemByID = async (OrderItemId) => {
  let config = {
    method: 'get',
    url: `/Order/GetOrderItemByID?OrderItemId=${OrderItemId}`
  };
  return axios.request(config);
}; 

const PayAdvance = async (OrderId, AdvanceAmount) => {
  try {
    console.log("💰 PayAdvance Service - Input:", { OrderId, AdvanceAmount });
    
    // Convert to proper data types
    const orderIdInt = parseInt(OrderId, 10);
    const advanceAmountFloat = parseFloat(AdvanceAmount);
    
    console.log("💰 PayAdvance Service - Converted:", { 
      orderIdInt, 
      advanceAmountFloat
    });
    
    // Validate data types
    if (isNaN(orderIdInt) || isNaN(advanceAmountFloat)) {
      throw new Error('Invalid order ID or advance amount');
    }
    
    // Use query parameters as your API expects
    const config = {
      method: 'post',
      url: `/Order/PayAdvance?OrderId=${orderIdInt}&AdvanceAmount=${advanceAmountFloat}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    console.log("💰 PayAdvance Service - Request:", config);
    
    const response = await axios.request(config);
    console.log("💰 PayAdvance Service - Response:", response.data);
    return response.data;
    
  } catch (error) {
    console.error("❌ PayAdvance Service Error:", error);
    
    // Provide detailed error information
    if (error.response) {
      console.error("❌ Server Response:", error.response.data);
      console.error("❌ Status Code:", error.response.status);
    }
    
    throw error;
  }
};

export const orderService = {
  GetOrders,
  AddOrder,
  AddOrderItem,
  GetOrderItems,
  UpdateStatusOrder,
  UpdateStatusOrderItem,
  GetOrderItemByID,
  PayAdvance,
};