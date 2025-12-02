import {
  Report_REQUEST,
  Report_SUCCESS,
  Report_FAIL,
} from "../constants/ReportConstants";

const initialState = {
  requestBody: null,
  responseBody: [],
  error: null,
  msg: null,
  loading: false,
};

export const Report = (state = initialState, action) => {
  switch (action.type) {
    case Report_REQUEST:
      return { 
        ...state,
         loading: true,
          msg: null,
          error: null,
         };
    case Report_SUCCESS:
      return {
         ...state,
          loading: false,
           responseBody: action.payload.responseBody,
            msg: action.payload.msg,
           };
    case Report_FAIL:
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