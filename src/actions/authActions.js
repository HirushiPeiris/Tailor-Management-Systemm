import { LoginTailor_REQUEST, LoginTailor_SUCCESS, LoginTailor_FAIL, LogoutTailor } from "../constants/authConstants";
import { authService } from "../services/authService";

// Login Tailor
export const LoginTailorAction = (Email, PasswordHash) => async (dispatch) => {
  try {
    dispatch({ type: LoginTailor_REQUEST });

    const { data } = await authService.LoginTailor({ Email, PasswordHash });

    if (data.StatusCode === 200) {
      const userData = { Email, token: data.Result, role: "tailor" }; // add role
      localStorage.setItem("tailorUser", JSON.stringify(userData));

      dispatch({
        type: LoginTailor_SUCCESS,
        payload: userData,
      });
    } else {
      dispatch({ type: LoginTailor_FAIL, payload: data.Result || "Invalid credentials" });
    }
  } catch (error) {
    dispatch({ type: LoginTailor_FAIL, payload: error.message || "Something went wrong" });
  }
};

// Logout Tailor
export const LogoutTailorAction = () => (dispatch) => {
  localStorage.removeItem("tailorUser");
  dispatch({ type: LogoutTailor });
};
