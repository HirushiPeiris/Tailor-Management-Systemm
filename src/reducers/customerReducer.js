
import {
  GetAllCustomers_REQUEST,
  GetAllCustomers_SUCCESS,
  GetAllCustomers_FAIL,
  GetCustomerByID_REQUEST,
  GetCustomerByID_SUCCESS,
  GetCustomerByID_FAIL,
  AddCustomer_REQUEST,
  AddCustomer_SUCCESS,
  AddCustomer_FAIL, 
  SearchCustomersByEmail_REQUEST,
  SearchCustomersByEmail_SUCCESS,
  SearchCustomersByEmail_FAIL,
  UpdateCustomerDetails_REQUEST,
  UpdateCustomerDetails_SUCCESS,
  UpdateCustomerDetails_FAIL,
} from "../constants/CustomerConstants";

const initialState = {
  requestBody: null,
  responseBody: [],
  error: null,
  msg: null,
  loading: false,
};

// ------------------ Get All Customers ------------------
export const GetAllCustomers = (state = initialState, action) => {
  switch (action.type) {
    case GetAllCustomers_REQUEST:
      return { 
        ...state,
        loading: true,
        msg: null,
        error: null,
      };
    case GetAllCustomers_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
      };
    case GetAllCustomers_FAIL:
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

// ------------------ Get Customer By ID ------------------
export const GetCustomerByID = (state = initialState, action) => {
  switch (action.type) {
    case GetCustomerByID_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null
      };
    case GetCustomerByID_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
        error: null
      };
    case GetCustomerByID_FAIL:
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

// ------------------ Add Customer ------------------
export const AddCustomer = (state = initialState, action) => {
  switch (action.type) {
    case AddCustomer_REQUEST:
      return { 
        ...state,
        loading: true, 
        msg: null,
        error: null 
      };
    case AddCustomer_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg, 
        error: null
      };
    case AddCustomer_FAIL:
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

// ------------------ Search Customers By Email ------------------
export const SearchCustomersByEmail = (state = initialState, action) => {
  switch (action.type) {
    case SearchCustomersByEmail_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null,
      };
    case SearchCustomersByEmail_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
      };
    case SearchCustomersByEmail_FAIL:
      return {
        ...state,
        loading: false, 
        msg: action.payload.msg,
        error: action.payload.error,
        responseBody: null,
      };
    default:
      return state;
  }
};

// ------------------ Update Customer Details ------------------
export const UpdateCustomerDetails = (state = initialState, action) => {
  switch (action.type) {
    case UpdateCustomerDetails_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null
      };
    case UpdateCustomerDetails_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
        error: null
      };
    case UpdateCustomerDetails_FAIL:
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



