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

const initialState = {
  requestBody: null,
  responseBody: [],
  error: null,
  msg: null,
  loading: false,
};

export const GetAllPayment = (state = initialState, action) => {
  switch (action.type) {
    case GetAllPayment_REQUEST:
      return { 
        ...state,
         loading: true,
          msg: null,
          error: null,
         };
    case GetAllPayment_SUCCESS:
      return {
         ...state,
          loading: false,
           responseBody: action.payload.responseBody,
            msg: action.payload.msg,
           };
    case GetAllPayment_FAIL:
      return {
         ...state,
          loading: false,
           msg: action.payload.msg,
           error: action.payload.error,
           responseBody: [],
           };
    default:
      return state;
  }
};

export const AddPayment = (state = initialState, action) => {
  switch (action.type) {
    case AddPayment_REQUEST:
      return { ...state,
         loading: true, 
         msg: null,
         error: null 
        };
    case AddPayment_SUCCESS:
      return {
         ...state,
         loading: false,
         responseBody: action.payload.responseBody,
         msg: action.payload.msg, 
        error: null
       };
    case AddPayment_FAIL:
      return {
         ...state,
          loading: false,
         msg: action.payload.msg,
         error: action.payload.error,
         responseBody: null 
         };
    default:
      return state;
  }
};


export const GetPaymentByOrderID = (state = initialState, action) => {
  switch (action.type) {
    case GetPaymentByOrderID_REQUEST:
      return { ...state, loading: true, msg: null };
    case GetPaymentByOrderID_SUCCESS:
      return { ...state, loading: false, responseBody: action.payload, msg: null };
    case GetPaymentByOrderID_FAIL:
      return { ...state, loading: false, msg: action.payload, responseBody: [] };
    default:
      return state;
  }
};

// export const GetOrderPending = (state = initialState, action) => {
//   switch (action.type) {
//     case GetOrderPending_REQUEST:
//       return { ...state, loading: true, msg: null };
//     case GetOrderPending_SUCCESS:
//       return { ...state, loading: false, responseBody: action.payload, msg: null };
//     case GetOrderPending_FAIL:
//       return { ...state, loading: false, msg: action.payload, responseBody: [] };
//     default:
//       return state;
//   }
// };

export const GetOrderPending = (state = initialState, action) => {
  switch (action.type) {
    case GetOrderPending_REQUEST:
      return { 
        ...state, 
        loading: true, 
        msg: null,
        error: null 
      };
    case GetOrderPending_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        responseBody: action.payload.responseBody || [], 
        msg: action.payload.msg,
        error: null
      };
    case GetOrderPending_FAIL:
      return { 
        ...state, 
        loading: false, 
        msg: action.payload.msg, 
        responseBody: [],
        error: action.payload.msg
      };
    default:
      return state;
  }
};