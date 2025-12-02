// actions/unifiedLoginActions.js
import {
  UNIFIED_LOGIN_REQUEST,
  UNIFIED_LOGIN_SUCCESS,
  UNIFIED_LOGIN_FAIL,
  UNIFIED_LOGOUT,
  CLEAR_UNIFIED_LOGIN_ERRORS,
} from "../constants/unifiedLoginConstants";
import { unifiedLoginService } from "../services/unifiedLoginService";

// Unified Login Action
export const unifiedLoginAction = (Email, PasswordHash) => async (dispatch) => {
  try {
    dispatch({ type: UNIFIED_LOGIN_REQUEST });

    const credentials = { Email, PasswordHash };

    console.log("Attempting login with:", Email);

    // Try Admin login first
    try {
      console.log("Trying Admin login...");
      const response = await unifiedLoginService.LoginAdmin(credentials);
      const data = response.data;
      
      if (data.StatusCode === 200) {
        console.log("Admin login successful");
        const userData = { 
          Email, 
          token: data.Result, 
          role: "admin" 
        };
        
        // Store in unified localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.removeItem("adminUser"); // Clean up old
        localStorage.removeItem("tailorUser"); // Clean up old
        
        dispatch({
          type: UNIFIED_LOGIN_SUCCESS,
          payload: userData,
        });
        return; // Exit if successful
      }
    } catch (adminError) {
      console.log("Admin login failed, trying Tailor login...");
      // Continue to tailor login
    }

    // Try Tailor login
    try {
      console.log("Trying Tailor login...");
      const response = await unifiedLoginService.LoginTailor(credentials);
      const data = response.data;
      
      if (data.StatusCode === 200) {
        console.log("Tailor login successful");
        const userData = { 
          Email, 
          token: data.Result, 
          role: "tailor" 
        };
        
        // Store in unified localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.removeItem("adminUser"); // Clean up old
        localStorage.removeItem("tailorUser"); // Clean up old
        
        dispatch({
          type: UNIFIED_LOGIN_SUCCESS,
          payload: userData,
        });
        return; // Exit if successful
      }
    } catch (tailorError) {
      console.log("Tailor login failed");
      // Continue to error handling
    }

    // If both logins failed
    console.log("Both logins failed");
    dispatch({ 
      type: UNIFIED_LOGIN_FAIL, 
      payload: "Invalid email or password. Please check your credentials." 
    });

  } catch (error) {
    console.log("Login error:", error);
    dispatch({ 
      type: UNIFIED_LOGIN_FAIL, 
      payload: "Login failed. Please try again." 
    });
  }
};

// Check existing login on app start
export const checkExistingLoginAction = () => (dispatch) => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log("Found existing login:", user);
      dispatch({
        type: UNIFIED_LOGIN_SUCCESS,
        payload: user,
      });
    } catch (error) {
      console.log("Invalid user data in storage, clearing...");
      localStorage.removeItem("user");
    }
  }
};

// Unified Logout
export const unifiedLogoutAction = () => (dispatch) => {
  console.log("Logging out...");
  localStorage.removeItem("user");
  localStorage.removeItem("adminUser");
  localStorage.removeItem("tailorUser");
  dispatch({ type: UNIFIED_LOGOUT });
};

// Clear errors
export const clearUnifiedLoginErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_UNIFIED_LOGIN_ERRORS });
};