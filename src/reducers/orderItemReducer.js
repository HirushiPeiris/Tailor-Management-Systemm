import {
AddOrderItem_REQUEST,
AddOrderItem_SUCCESS,
AddOrderItem_FAIL,
GetOrderItems_REQUEST,
GetOrderItems_SUCCESS,
GetOrderItems_FAIL,
} from "../constants/OrderItemConstant";

const initialState = {
  requestBody: null,
  responseBody: [],
  error: null,
  msg: null,
  loading: false,
};



export const AddOrderItem = (state = initialState, action) => {
  switch (action.type) {
    case AddOrderItem_REQUEST:
      return { ...state,
         loading: true, 
         msg: null,
         error: null 
        };
    case AddOrderItem_SUCCESS:
      return {
         ...state,
         loading: false,
         responseBody: action.payload.responseBody,
         msg: action.payload.msg, 
        error: null
       };
    case AddOrderItem_FAIL:
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

export const GetOrderItems = (state = initialState, action) => {
  switch (action.type) {
    case GetOrderItems_REQUEST:
      return { 
        ...state,
         loading: true,
          msg: null,
          error: null,
         };
    case GetOrderItems_SUCCESS:
      return {
         ...state,
          loading: false,
           responseBody: action.payload.responseBody,
            msg: action.payload.msg,
           };
    case GetOrderItems_FAIL:
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


