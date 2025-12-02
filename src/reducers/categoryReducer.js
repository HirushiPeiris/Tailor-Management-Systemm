import {
  AddCategory_REQUEST,
  AddCategory_SUCCESS,
  AddCategory_FAIL,
  GetAllCategory_REQUEST,
  GetAllCategory_SUCCESS,
  GetAllCategory_FAIL
} from "../constants/categoryConstant";

const initialState = {
  requestBody: null,
  responseBody: [],
  error: null,
  msg: null,
  loading: false,
};

export const GetAllCategory = (state = initialState, action) => {
  switch (action.type) {
    case GetAllCategory_REQUEST:
      return { 
        ...state,
         loading: true,
          msg: null,
          error: null,
         };
    case GetAllCategory_SUCCESS:
      return {
         ...state,
          loading: false,
           responseBody: action.payload.responseBody,
            msg: action.payload.msg,
           };
    case GetAllCategory_FAIL:
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

export const  AddCategory = (state = initialState, action) => {
  switch (action.type) {
    case  AddCategory_REQUEST:
      return { ...state,
         loading: true, 
         msg: null,
         error: null 
        };
    case  AddCategory_SUCCESS:
      return {
         ...state,
         loading: false,
         responseBody: action.payload.responseBody,
         msg: action.payload.msg, 
        error: null
       };
    case  AddCategory_FAIL:
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
