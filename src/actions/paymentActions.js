import{
GetAllPayment_REQUEST,
GetAllPayment_SUCCESS,
GetAllPayment_FAIL,
AddPayment_REQUEST,
AddPayment_FAIL,
AddPayment_SUCCESS, 
GetPaymentByOrderID_REQUEST,
GetPaymentByOrderID_SUCCESS,
GetPaymentByOrderID_FAIL,
GetOrderPending_REQUEST,
GetOrderPending_SUCCESS,
GetOrderPending_FAIL,
} from "../constants/PaymentConstants";

import { paymentService } from '../services/paymentService';

export const AddPayment= (paymentData) => async (dispatch) => {
  try {
    dispatch({ type: AddPayment_REQUEST });
    const { data } = await paymentService.AddPayment(paymentData);
    if (data.StatusCode === 200) {
      dispatch({
        type: AddPayment_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: paymentData,
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not add the AssingTailor. Please try again!";
      dispatch({
        type: AddPayment_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: AddPayment_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

export const GetAllPayment = () => async (dispatch) => {
  try {
    dispatch({ type: GetAllPayment_REQUEST });
    const { data } = await paymentService.GetAllPayment();

    if (data.StatusCode === 200) {
      dispatch({
        type: GetAllPayment_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
        },
      });
    } else {
      // Use the message from the API response if available, otherwise a default message
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({
        type: GetAllPayment_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: GetAllPayment_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};



export const GetPaymentByOrderID = (OrderId) => async (dispatch) => {
  try {
    dispatch({ type: GetPaymentByOrderID_REQUEST });
    const { data } = await paymentService.GetPaymentByOrderID(OrderId);

    if (data.StatusCode === 200) {
      const tailor = data.ResultSet?.[0] || null;
      dispatch({
        type: GetPaymentByOrderID_SUCCESS,
        payload: { responseBody: tailor, msg: data.Message },
      });
    } else {
      const msg =
        data.Message ||
        "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({ type: GetPaymentByOrderID_FAIL, payload: { msg } });
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({ type: GetPaymentByOrderID_FAIL, payload: { msg: message } });
  }
};


// export const GetOrderPending = () => async (dispatch) => {
//   try {
//     dispatch({ type: GetOrderPending_REQUEST });
//     const { data } = await paymentService.GetOrderPending();

//     if (data.StatusCode === 200) {
//       const orders = data.ResultSet || [];
//       dispatch({
//         type: GetOrderPending_SUCCESS,
//         payload: { responseBody: tailor, msg: data.Message },
//       });
//     } else {
//       const msg =
//         data.Message ||
//         "Sorry, we could not find the result for your search query. Please try again!";
//       dispatch({ type: GetOrderPending_FAIL, payload: { msg } });
//     }
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();
//     dispatch({ type: GetOrderPending_FAIL, payload: { msg: message } });
//   }
// };

export const GetOrderPending = () => async (dispatch) => {
  try {
    dispatch({ type: GetOrderPending_REQUEST });
    const { data } = await paymentService.GetOrderPending();

    console.log('GetOrderPending API Response:', data); // Debug log

    if (data.StatusCode === 200) {
      // FIX: Use the entire ResultSet array, not just the first item
      dispatch({
        type: GetOrderPending_SUCCESS,
        payload: { 
          responseBody: data.ResultSet || [], 
          msg: data.Message 
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find pending orders. Please try again!";
      dispatch({ 
        type: GetOrderPending_FAIL, 
        payload: { 
          msg: msg,
          responseBody: [] 
        } 
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    console.error('GetOrderPending error:', error); // Debug log
    dispatch({ 
      type: GetOrderPending_FAIL, 
      payload: { 
        msg: message,
        responseBody: [] 
      } 
    });
  }
};