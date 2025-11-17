import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from '../constants/authConstants';
import authService from '../services/authService';

export const login = (email, password) => async (dispatch) => {
  try {
    const isValid = await authService.login(email, password);
    if (isValid) {
      dispatch({ type: LOGIN_SUCCESS, payload: email });
    } else {
      dispatch({ type: LOGIN_FAIL });
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};