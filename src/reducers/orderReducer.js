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

const initialState = {
  loading: false,
  responseBody: null,
  msg: null,
  error: null,
  success: false
};

export const GetOrders = (state = initialState, action) => {
  switch (action.type) {
    case GetOrders_REQUEST:
      return { 
        ...state,
         loading: true,
          msg: null,
          error: null,
         };
    case GetOrders_SUCCESS:
      return {
         ...state,
          loading: false,
           responseBody: action.payload.responseBody,
            msg: action.payload.msg,
           };
    case GetOrders_FAIL:
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

export const AddOrder = (state = initialState, action) => {
  switch (action.type) {
    case AddOrder_REQUEST:
      return { ...state,
         loading: true, 
         msg: null,
         error: null 
        };
    case AddOrder_SUCCESS:
      return {
         ...state,
         loading: false,
         responseBody: action.payload.responseBody,
         msg: action.payload.msg, 
        error: null
       };
    case AddOrder_FAIL:
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

export const UpdateStatusOrder = (state = initialState, action) => {
  switch (action.type) {
    case UpdateStatusOrder_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null
      };
    case UpdateStatusOrder_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
        error: null
      };
    case UpdateStatusOrder_FAIL:
      return {
        ...state,
        loading: false,
        msg: action.payload.msg,
        error: action.payload.error,
        responseBody: []
      };
    default:
      return state;
  }
};

export const UpdateStatusOrderItem = (state = initialState, action) => {
  switch (action.type) {
    case UpdateStatusOrderItem_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null,
        success: false
      };
    case UpdateStatusOrderItem_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
        error: null,
        success: true
      };
    case UpdateStatusOrderItem_FAIL:
      return {
        ...state,
        loading: false,
        msg: action.payload.msg,
        error: action.payload.error,
        responseBody: null,
        success: false
      };
    default:
      return state;
  }
};



export const GetOrderItemByID = (state = initialState, action) => {
  switch (action.type) {
    case GetOrderItemByID_REQUEST:
      return { ...state, loading: true, msg: null };
    case GetOrderItemByID_SUCCESS:
      return { ...state, loading: false, responseBody: action.payload, msg: null };
    case GetOrderItemByID_FAIL:
      return { ...state, loading: false, msg: action.payload, responseBody: [] };
    default:
      return state;
  }
};

export const PayAdvance = (state = initialState, action) => {
  switch (action.type) {
    case PayAdvance_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null,
        success: false
      };
    case PayAdvance_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
        error: null,
        success: true
      };
    case PayAdvance_FAIL:
      return {
        ...state,
        loading: false,
        msg: action.payload.msg,
        error: action.payload.error,
        responseBody: null,
        success: false
      };
    default:
      return state;
  }
};