import {
  AddOrderItem_REQUEST,
  AddOrderItem_SUCCESS,
  AddOrderItem_FAIL,
  GetOrderItems_REQUEST,
  GetOrderItems_SUCCESS,
  GetOrderItems_FAIL
} from "../constants/OrderItemConstant";

import { orderItemService } from '../services/orderItemService';

export const AddOrderItem = (AddOrderItemData) => async (dispatch) => {
  try {
    dispatch({ type: AddOrderItem_REQUEST });
    const { data } = await orderItemService.AddOrderItem(AddOrderItemData);
    
    console.log("📦 AddOrderItem API Response:", data);
    
    if (data.StatusCode === 200) {
      dispatch({
        type: AddOrderItem_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: AddOrderItemData,
        },
      });
      // ✅ RETURN THE SUCCESS RESULT
      return { success: true, data: data.ResultSet,orderItemId: data.ResultSet?.OrderItemId || data.ResultSet?.orderItemId };
    } else {
      const msg = data.Message || "Sorry, we could not add the order item. Please try again!";
      dispatch({
        type: AddOrderItem_FAIL,
        payload: {
          msg: msg,
        },
      });
      // ✅ RETURN THE ERROR
      return { success: false, error: msg };
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: AddOrderItem_FAIL,
      payload: {
        msg: message,
      },
    });
    // ✅ RETURN THE ERROR
    return { success: false, error: message };
  }
};

export const GetOrderItems = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: GetOrderItems_REQUEST });
    const { data } = await orderItemService.GetOrderItems(orderId);
    
    console.log("📦 GetOrderItems API Response:", data);
    
    if (data.StatusCode === 200) {
      dispatch({
        type: GetOrderItems_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
        },
      });
      // ✅ RETURN DATA
      return { success: true, data: data.ResultSet };
    } else {
      const msg = data.Message || "Sorry, we could not find the order items. Please try again!";
      dispatch({
        type: GetOrderItems_FAIL,
        payload: {
          msg: msg,
        },
      });
      // ✅ RETURN ERROR
      return { success: false, error: msg };
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: GetOrderItems_FAIL,
      payload: {
        msg: message,
      },
    });
    // ✅ RETURN ERROR
    return { success: false, error: message };
  }
};