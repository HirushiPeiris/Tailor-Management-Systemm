import {
  LoginAdmin_REQUEST,
  LoginAdmin_SUCCESS,
  LoginAdmin_FAIL,
  LogoutAdmin,
} from "../constants/AdminLoginConstants";

const initialState = {
  loading: false,
  user: JSON.parse(localStorage.getItem("adminUser")) || null, // persist across refresh
  error: null,
};

export const adminLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LoginAdmin_REQUEST:
      return { ...state, loading: true, error: null };

    case LoginAdmin_SUCCESS:
  console.log("Reducer LoginAdmin_SUCCESS payload:", action.payload);
  return { ...state, loading: false, user: action.payload };


    case LoginAdmin_FAIL:
      return { ...state, loading: false, error: action.payload };

     case "LogoutAdmin":
      return { ...state, user: null, error: null };
    default:
      return state;
  }
};