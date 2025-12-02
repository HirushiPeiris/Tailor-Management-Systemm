
import {
  LoginTailor_REQUEST,
  LoginTailor_SUCCESS,
  LoginTailor_FAIL,
  LogoutTailor,
} from "../constants/authConstants";

const initialState = {
  loading: false,
  user: JSON.parse(localStorage.getItem("tailorUser")) || null, // persist across refresh
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LoginTailor_REQUEST:
      return { ...state, loading: true, error: null };

    case LoginTailor_SUCCESS:
  console.log("Reducer LoginTailor_SUCCESS payload:", action.payload);
  return { ...state, loading: false, user: action.payload };


    case LoginTailor_FAIL:
      return { ...state, loading: false, error: action.payload };

     case "LogoutTailor":
      return { ...state, user: null, error: null };
    default:
      return state;
  }
};
