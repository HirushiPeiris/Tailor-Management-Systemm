import { LoginAdmin_REQUEST, LoginAdmin_SUCCESS, LoginAdmin_FAIL, LogoutAdmin } from "../constants/AdminLoginConstants";
import { adminLoginService } from "../services/adminLoginService";

// Login Admin
export const adminLoginAction = (Email, PasswordHash) => async (dispatch) => {
  try {
    dispatch({ type: LoginAdmin_REQUEST });

    const { data } = await adminLoginService.LoginAdmin({ Email, PasswordHash });

    if (data.StatusCode === 200) {
      const userData = { Email, token: data.Result, role: "admin" }; // add role
      localStorage.setItem("adminUser", JSON.stringify(userData));

      dispatch({
        type: LoginAdmin_SUCCESS,
        payload: userData,
      });
    } else {
      dispatch({ type: LoginAdmin_FAIL, payload: data.Result || "Invalid credentials" });
    }
  } catch (error) {
    dispatch({ type: LoginAdmin_FAIL, payload: error.message || "Something went wrong" });
  }
};

// Logout Admin
export const LogoutAdminAction = () => (dispatch) => {
  localStorage.removeItem("adminUser");
  dispatch({ type: LogoutAdmin });
};
