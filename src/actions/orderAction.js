import {
  GetOrders_REQUEST,
  GetOrders_SUCCESS,
  GetOrders_FAIL,
  AddOrder_REQUEST,
  AddOrder_SUCCESS,
  AddOrder_FAIL,
  AddOrderItem_REQUEST,
  AddOrderItem_SUCCESS,
  AddOrderItem_FAIL,
  GetOrderItems_REQUEST,
  GetOrderItems_SUCCESS,
  GetOrderItems_FAIL,
  UpdateStatusOrder_REQUEST,
  UpdateStatusOrder_SUCCESS,
 UpdateStatusOrder_FAIL,
 UpdateStatusOrderItem_REQUEST,
UpdateStatusOrderItem_SUCCESS,
UpdateStatusOrderItem_FAIL,
GetOrderItemByID_REQUEST,
GetOrderItemByID_SUCCESS,
GetOrderItemByID_FAIL,
PayAdvance_REQUEST,
PayAdvance_SUCCESS,
PayAdvance_FAIL,
} from "../constants/OrderConstants";

import { orderService } from '../services/orderService';

// Get all orders
export const GetOrders = () => async (dispatch) => {
  try {
    dispatch({ type: GetOrders_REQUEST });
    const { data } = await orderService.GetOrders();
    if (data.StatusCode === 200) {
      dispatch({
        type: GetOrders_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find orders. Please try again!";
      dispatch({
        type: GetOrders_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = error.message || error.toString();
    dispatch({
      type: GetOrders_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

// Add Order
export const AddOrder = (AddOrderData) => async (dispatch) => {
  try {
    dispatch({ type: AddOrder_REQUEST });
    const response = await orderService.AddOrder(AddOrderData);
    const { data } = response;
    
    console.log("📦 AddOrder API Response:", data);
    
    if (data.StatusCode === 200) {
      const orderId = response.orderId;
      
      dispatch({
        type: AddOrder_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: AddOrderData,
          orderId: orderId
        },
      });
      
      return { 
        success: true, 
        orderId: orderId,
        data: data.ResultSet 
      };
    } else {
      const msg = data.Message || "Sorry, we could not add the order. Please try again!";
      dispatch({
        type: AddOrder_FAIL,
        payload: {
          msg: msg,
        },
      });
      return { success: false, error: msg };
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: AddOrder_FAIL,
      payload: {
        msg: message,
      },
    });
    return { success: false, error: message };
  }
};

// Add order item
export const AddOrderItem = (AddOrderItemData) => async (dispatch) => {
  try {
    dispatch({ type: AddOrderItem_REQUEST });
    
    const { data } = await orderService.AddOrderItem(AddOrderItemData);
    
    console.log("📦 AddOrderItem API Response:", data);
    
    if (data.StatusCode === 200) {
      dispatch({
        type: AddOrderItem_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: AddOrderItemData,
        },
      });
      
      return { success: true, data: data.ResultSet };
    } else {
      const msg = data.Message || "Sorry, we could not add the order item. Please try again!";
      dispatch({
        type: AddOrderItem_FAIL,
        payload: {
          msg: msg,
        },
      });
      return { success: false, error: msg };
    }
  } catch (error) {
    const message = error.message || error.toString();
    dispatch({
      type: AddOrderItem_FAIL,
      payload: {
        msg: message,
      },
    });
    return { success: false, error: message };
  }
};

// Get order items by orderId
export const GetOrderItems = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: GetOrderItems_REQUEST });
    const { data } = await orderService.GetOrderItems(orderId);
    
    console.log("📦 GetOrderItems API Response:", data);
    
    if (data.StatusCode === 200) {
      dispatch({
        type: GetOrderItems_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
        },
      });
      return { success: true, data: data.ResultSet };
    } else {
      const msg = data.Message || "Sorry, we could not find the order items. Please try again!";
      dispatch({
        type: GetOrderItems_FAIL,
        payload: {
          msg: msg,
        },
      });
      return { success: false, error: msg };
    }
  } catch (error) {
    const message = error.message || error.toString();
    dispatch({
      type: GetOrderItems_FAIL,
      payload: {
        msg: message,
      },
    });
    return { success: false, error: message };
  }
};

export const UpdateStatusOrder = (UpdateStatusOrderData) => async (dispatch) => {
  try {
    dispatch({ type: UpdateStatusOrder_REQUEST });
    const response = await orderService.UpdateStatusOrder(UpdateStatusOrderData);
    const { data } = response;
    
    console.log("📦 UpdateStatusOrder API Response:", data);
    
    if (data.StatusCode === 200) {
      dispatch({
        type: UpdateStatusOrder_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: UpdateStatusOrderData,
          msg: "Order updated successfully"
        },
      });
      
      // RETURN SUCCESS INFORMATION - This is critical
      return { 
        success: true,
        StatusCode: data.StatusCode,
        Result: data.Result,
        ResultSet: data.ResultSet
      };
    } else {
      const msg = data.Message || "Sorry, we could not update the order. Please try again!";
      dispatch({
        type: UpdateStatusOrder_FAIL,
        payload: {
          msg: msg,
          error: msg
        },
      });
      
      return { 
        success: false, 
        error: msg
      };
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: UpdateStatusOrder_FAIL,
      payload: {
        msg: message,
        error: message
      },
    });
    
    return { 
      success: false, 
      error: message
    };
  }
};

export const UpdateStatusOrderItem = (updateData) => async (dispatch) => {
  try {
    dispatch({ type: UpdateStatusOrderItem_REQUEST });
    const { data } = await orderService.UpdateStatusOrderItem(updateData);
    
    console.log("✅ UpdateStatusOrderItem API Response:", data);
    
    // BETTER SUCCESS CHECK - check both StatusCode AND Result
    if (data.StatusCode === 200 && data.Result === "Success!!") {
      dispatch({
        type: UpdateStatusOrderItem_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: updateData,
          msg: "Status updated successfully"
        },
      });
      
      return { 
        success: true, 
        StatusCode: data.StatusCode,
        Result: data.Result,
        ResultSet: data.ResultSet 
      };
    } else {
      const msg = data.Message || data.Result || "Failed to update order item status";
      dispatch({
        type: UpdateStatusOrderItem_FAIL,
        payload: {
          msg: msg,
          error: msg
        },
      });
      
      return { 
        success: false, 
        StatusCode: data.StatusCode,
        error: msg 
      };
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: UpdateStatusOrderItem_FAIL,
      payload: {
        msg: message,
        error: message
      },
    });
    throw error;
  }
};



export const GetOrderItemByID = (OrderItemId) => async (dispatch) => {
  try {
    dispatch({ type: GetOrderItemByID_REQUEST });
    const { data } = await  orderService.GetOrderItemByID(OrderItemId);
    if (data.StatusCode === 200) {
      dispatch({
        type: GetOrderItemByID_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data:OrderItemId,
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({
        type: GetOrderItemByID_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: GetOrderItemByID_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

export const PayAdvance = (OrderId, AdvanceAmount) => async (dispatch) => {
  try {
    dispatch({ type: PayAdvance_REQUEST });
    
    console.log("💰 PayAdvance Action - Input:", { 
      OrderId, 
      AdvanceAmount,
      OrderIdType: typeof OrderId,
      AdvanceAmountType: typeof AdvanceAmount
    });
    
    // Convert to proper data types
    const orderIdInt = parseInt(OrderId, 10);
    const advanceAmountFloat = parseFloat(AdvanceAmount);
    
    console.log("💰 PayAdvance Action - Converted:", { 
      orderIdInt, 
      advanceAmountFloat 
    });
    
    // Validate data types
    if (isNaN(orderIdInt) || isNaN(advanceAmountFloat)) {
      const errorMsg = 'Invalid order ID or advance amount';
      dispatch({
        type: PayAdvance_FAIL,
        payload: {
          msg: errorMsg,
          error: errorMsg
        },
      });
      return { success: false, error: errorMsg };
    }
    
    // Use query parameters as your API expects
    const response = await orderService.PayAdvance(orderIdInt, advanceAmountFloat);
    
    console.log("💰 PayAdvance API Response:", response);
    
    // Check if response indicates success
    if (response && response.StatusCode === 200) {
      dispatch({
        type: PayAdvance_SUCCESS,
        payload: {
          responseBody: response.ResultSet,
          data: { OrderId: orderIdInt, AdvanceAmount: advanceAmountFloat },
          msg: "Advance payment successful"
        },
      });
      
      return { 
        success: true, 
        data: response.ResultSet 
      };
    } else {
      const msg = (response && response.Result) || "Sorry, we could not process the advance payment. Please try again!";
      dispatch({
        type: PayAdvance_FAIL,
        payload: {
          msg: msg,
          error: msg
        },
      });
      return { success: false, error: msg };
    }
  } catch (error) {
    console.error("❌ PayAdvance Action Error:", error);
    
    let errorMessage = "Sorry, we could not process the advance payment. Please try again!";
    
    if (error.response && error.response.data) {
      errorMessage = error.response.data.Result || error.response.data.Message || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    dispatch({
      type: PayAdvance_FAIL,
      payload: {
        msg: errorMessage,
        error: errorMessage
      },
    });
    
    return { success: false, error: errorMessage };
  }
};