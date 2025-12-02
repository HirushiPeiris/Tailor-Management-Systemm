
// import {
//   AddAdmin_REQUEST,
//   AddAdmin_SUCCESS,
//   AddAdmin_FAIL,
//   GetAllAdmins_REQUEST,
//   GetAllAdmins_SUCCESS,
//   GetAllAdmins_FAIL,
// } from "../constants/AdminConstants";

// const initialState = {
//   responseBody: [],
//   loading: false,
//   msg: null,
// };

// export const AddAdmin = (state = initialState, action) => {
//   switch (action.type) {
//     case AddAdmin_REQUEST:
//       return { ...state, loading: true, msg: null };
//     case AddAdmin_SUCCESS:
//       return { ...state, loading: false, responseBody: action.payload, msg: null };
//     case AddAdmin_FAIL:
//       return { ...state, loading: false, msg: action.payload.msg, responseBody: [] };
//     default:
//       return state;
//   }
// };

// export const GetAllAdmins = (state = initialState, action) => {
//   switch (action.type) {
//     case GetAllAdmins_REQUEST:
//       return { ...state, loading: true, msg: null };
//     case GetAllAdmins_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         responseBody: action.payload.responseBody,
//         msg: null,
//       };
//     case GetAllAdmins_FAIL:
//       return { ...state, loading: false, msg: action.payload.msg, responseBody: [] };
//     default:
//       return state;
//   }
// };



// AdminReducer.js
import {
  AddAdmin_REQUEST,
  AddAdmin_SUCCESS,
  AddAdmin_FAIL,
  GetAllAdmins_REQUEST,
  GetAllAdmins_SUCCESS,
  GetAllAdmins_FAIL,
} from "../constants/AdminConstants";

const initialState = {
  responseBody: [],
  loading: false,
  msg: null,
  error: null,
};

// ✅ CHANGE THIS: Export as GetAllAdmins instead of adminsList
export const GetAllAdmins = (state = initialState, action) => {
  switch (action.type) {
    case GetAllAdmins_REQUEST:
      return { ...state, loading: true, msg: null, error: null };
    case GetAllAdmins_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: null,
        error: null
      };
    case GetAllAdmins_FAIL:
      return { 
        ...state, 
        loading: false, 
        msg: null, 
        error: action.payload.msg, 
        responseBody: [] 
      };
    default:
      return state;
  }
};

// ✅ CHANGE THIS: Export as AddAdmin instead of adminAdd
export const AddAdmin = (state = initialState, action) => {
  switch (action.type) {
    case AddAdmin_REQUEST:
      return { ...state, loading: true, msg: null, error: null };
    case AddAdmin_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        responseBody: action.payload, 
        msg: "Admin added successfully!",
        error: null 
      };
    case AddAdmin_FAIL:
      return { 
        ...state, 
        loading: false, 
        msg: null, 
        error: action.payload.msg, 
        responseBody: [] 
      };
    default:
      return state;
  }
};