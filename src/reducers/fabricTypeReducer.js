import {
GetAllFabricType_REQUEST,
GetAllFabricType_SUCCESS,
GetAllFabricType_FAIL,
AddFabricType_REQUEST,
AddFabricType_SUCCESS,
AddFabricType_FAIL,
UpdateFabricType_REQUEST,
UpdateFabricType_SUCCESS,
UpdateFabricType_FAIL,
GetAllInavctiveFabricType_REQUEST,
GetAllInavctiveFabricType_SUCCESS,
GetAllInavctiveFabricType_FAIL,
GetFabTypePresentage_REQUEST,
GetFabTypePresentage_SUCCESS,
GetFabTypePresentage_FAIL,
} from "../constants/FabricTypeConstant";

const initialState = {
  requestBody: null,
  responseBody: [],
  error: null,
  msg: null,
  loading: false,
};

export const GetAllFabricType = (state = initialState, action) => {
  switch (action.type) {
    case GetAllFabricType_REQUEST:
      return { 
        ...state,
         loading: true,
          msg: null,
          error: null,
         };
    case GetAllFabricType_SUCCESS:
      return {
         ...state,
          loading: false,
           responseBody: action.payload.responseBody,
            msg: action.payload.msg,
           };
    case GetAllFabricType_FAIL:
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

export const AddFabricType = (state = initialState, action) => {
  switch (action.type) {
    case AddFabricType_REQUEST:
      return { ...state,
         loading: true, 
         msg: null,
         error: null 
        };
    case AddFabricType_SUCCESS:
      return {
         ...state,
         loading: false,
         responseBody: action.payload.responseBody,
         msg: action.payload.msg, 
        error: null
       };
    case AddFabricType_FAIL:
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



export const UpdateFabricType = (state = initialState, action) => {
  switch (action.type) {
    case UpdateFabricType_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null
      };
    case UpdateFabricType_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
        error: null
      };
    case UpdateFabricType_FAIL:
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

export const GetAllInavctiveFabricType = (state = initialState, action) => {
  switch (action.type) {
    case GetAllInavctiveFabricType_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null
      };
    case GetAllInavctiveFabricType_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
        error: null
      };
    case GetAllInavctiveFabricType_FAIL:
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


export const GetFabTypePresentage = (state = initialState, action) => {
  switch (action.type) {
    case GetFabTypePresentage_REQUEST:
      return { 
        ...state,
         loading: true,
          msg: null,
          error: null,
         };
    case GetFabTypePresentage_SUCCESS:
      return {
         ...state,
          loading: false,
           responseBody: action.payload.responseBody,
            msg: action.payload.msg,
           };
    case GetFabTypePresentage_FAIL:
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