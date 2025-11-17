import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from '../constants/authConstants';

const initialState = {
  isAuthenticated: false,
  user: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { isAuthenticated: true, user: action.payload };
    case LOGIN_FAIL:
    case LOGOUT:
      return { isAuthenticated: false, user: null };
    default:
      return state;
  }
};