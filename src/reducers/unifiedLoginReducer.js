// reducers/unifiedLoginReducer.js
import {
  UNIFIED_LOGIN_REQUEST,
  UNIFIED_LOGIN_SUCCESS,
  UNIFIED_LOGIN_FAIL,
  UNIFIED_LOGOUT,
  CLEAR_UNIFIED_LOGIN_ERRORS,
} from "../constants/unifiedLoginConstants";

// Helper function to get user from storage with migration
const getUserFromStorage = () => {
  // First try unified storage
  const unifiedUser = localStorage.getItem("user");
  if (unifiedUser) {
    try {
      return JSON.parse(unifiedUser);
    } catch (error) {
      localStorage.removeItem("user");
    }
  }
  
  // Then try old storage locations and migrate to unified
  const adminUser = localStorage.getItem("adminUser");
  if (adminUser) {
    try {
      const user = JSON.parse(adminUser);
      // Migrate to unified storage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("adminUser");
      console.log("Migrated admin user to unified storage");
      return user;
    } catch (error) {
      localStorage.removeItem("adminUser");
    }
  }
  
  const tailorUser = localStorage.getItem("tailorUser");
  if (tailorUser) {
    try {
      const user = JSON.parse(tailorUser);
      // Migrate to unified storage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("tailorUser");
      console.log("Migrated tailor user to unified storage");
      return user;
    } catch (error) {
      localStorage.removeItem("tailorUser");
    }
  }
  
  return null;
};

const initialState = {
  loading: false,
  user: getUserFromStorage(),
  error: null,
};

export const unifiedLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case UNIFIED_LOGIN_REQUEST:
      return { 
        ...state, 
        loading: true, 
        error: null 
      };

    case UNIFIED_LOGIN_SUCCESS:
      console.log("Reducer: Login success", action.payload);
      return { 
        ...state, 
        loading: false, 
        user: action.payload,
        error: null 
      };

    case UNIFIED_LOGIN_FAIL:
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        user: null 
      };

    case UNIFIED_LOGOUT:
      return { 
        ...state, 
        user: null, 
        error: null,
        loading: false 
      };

    case CLEAR_UNIFIED_LOGIN_ERRORS:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};