
import {
  UpdateMeasurement_REQUEST,
  UpdateMeasurement_SUCCESS,
  UpdateMeasurement_FAIL,
  AddMeasurement_REQUEST,
  AddMeasurement_SUCCESS,
  AddMeasurement_FAIL,
  GetMeasurementsByCustomerId_REQUEST,
  GetMeasurementsByCustomerId_SUCCESS,
  GetMeasurementsByCustomerId_FAIL,
  GetAllMeasurements_REQUEST,
  GetAllMeasurements_SUCCESS,
  GetAllMeasurements_FAIL,
  GetMeasurementByOrderId_REQUEST,
  GetMeasurementByOrderId_SUCCESS,
  GetMeasurementByOrderId_FAIL,
} from "../constants/MeasurementConstant";

const initialState = {
  requestBody: null,
  responseBody: [],
  error: null,
  msg: null,
  loading: false,
};

// CORRECTED: Removed the extra `(state = initialState, action) =>`
export const GetAllMeasurements = (state = initialState, action) => {
  switch (action.type) {
    case GetAllMeasurements_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null,
      };
    case GetAllMeasurements_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
      };
    case GetAllMeasurements_FAIL:
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

export const AddMeasurement = (state = initialState, action) => {
  switch (action.type) {
    case AddMeasurement_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null
      };
    case AddMeasurement_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
        error: null
      };
    case AddMeasurement_FAIL:
      return {
        ...state,
        loading: false,
        msg: action.payload.msg,
        error: action.payload.error,
        responseBody: null
      };
    default:
      return state;
  }
};

export const GetMeasurementsByCustomerId = (state = initialState, action) => {
  switch (action.type) {
    case GetMeasurementsByCustomerId_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null
      };
    case GetMeasurementsByCustomerId_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
        error: null
      };
    case GetMeasurementsByCustomerId_FAIL:
      return {
        ...state,
        loading: false,
        msg: action.payload.msg,
        error: action.payload.error,
        responseBody: null
      };
    default:
      return state;
  }
};


export const UpdateMeasurement = (state = initialState, action) => {
  switch (action.type) {
    case UpdateMeasurement_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null
      };
    case UpdateMeasurement_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
        error: null
      };
    case UpdateMeasurement_FAIL:
      return {
        ...state,
        loading: false,
        msg: action.payload.msg,
        error: action.payload.error,
        responseBody: []
      };
    default:
      return state;
  }
};


export const GetMeasurementByOrderId = (state = initialState, action) => {
  switch (action.type) {
    case GetMeasurementByOrderId_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null
      };
    case GetMeasurementByOrderId_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg,
        error: null
      };
    case GetMeasurementByOrderId_FAIL:
      return {
        ...state,
        loading: false,
        msg: action.payload.msg,
        error: action.payload.error,
        responseBody: null
      };
    default:
      return state;
  }
};