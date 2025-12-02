import {
  RentalReprot_REQUEST,
  RentalReprot_SUCCESS,
  RentalReprot_FAIL,
} from "../constants/RentalReportConstants";

const initialState = {
  requestBody: null,
  responseBody: [],
  error: null,
  msg: null,
  loading: false,
};

export const RentalReprot = (state = initialState, action) => {
  switch (action.type) {
    case RentalReprot_REQUEST:
      return { 
        ...state,
        loading: true,
        msg: null,
        error: null,
      };
    case RentalReprot_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
      };
    case RentalReprot_FAIL:
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