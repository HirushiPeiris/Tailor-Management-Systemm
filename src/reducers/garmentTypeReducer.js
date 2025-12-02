
import {
GetAllGarmentType_REQUEST,
GetAllGarmentType_SUCCESS,
GetAllGarmentType_FAIL,
AddGarmentType_REQUEST,
AddGarmentType_SUCCESS,
AddGarmentType_FAIL,
UpdateGarmentType_REQUEST,
UpdateGarmentType_SUCCESS,
UpdateGarmentType_FAIL,
GetAllInactiveGarmentType_REQUEST,
GetAllInactiveGarmentType_SUCCESS,
GetAllInactiveGarmentType_FAIL,
} from "../constants/GarmentTypeConstant";

const initialState = {
  requestBody: null,
  responseBody: [],
  error: null,
  msg: null,
  loading: false,
};

export const GetAllGarmentType = (state = initialState, action) => {
  switch (action.type) {
    case GetAllGarmentType_REQUEST:
      return { 
        ...state,
         loading: true,
          msg: null,
          error: null,
         };
    case GetAllGarmentType_SUCCESS:
      return {
         ...state,
          loading: false,
           responseBody: action.payload.responseBody,
            msg: action.payload.msg,
           };
    case GetAllGarmentType_FAIL:
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

export const AddGarmentType = (state = initialState, action) => {
  switch (action.type) {
    case AddGarmentType_REQUEST:
      return { ...state,
         loading: true, 
         msg: null,
         error: null 
        };
    case AddGarmentType_SUCCESS:
      return {
         ...state,
         loading: false,
         responseBody: action.payload.responseBody,
         msg: action.payload.msg, 
        error: null
       };
    case AddGarmentType_FAIL:
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


export const UpdateGarmentType = (state = initialState, action) => {
  switch (action.type) {
    case UpdateGarmentType_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null
      };
    case UpdateGarmentType_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg, // THIS WAS MISSING - CRITICAL FIX
        error: null
      };
    case UpdateGarmentType_FAIL:
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


export const GetAllInactiveGarmentType = (state = initialState, action) => {
  switch (action.type) {
    case GetAllInactiveGarmentType_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null
      };
    case GetAllInactiveGarmentType_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
        error: null
      };
    case GetAllInactiveGarmentType_FAIL:
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