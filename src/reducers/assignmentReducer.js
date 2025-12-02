
import {
  AssingTailor_REQUEST,
  AssingTailor_SUCCESS,
  AssingTailor_FAIL, 
  GetAllAssignment_REQUEST,
  GetAllAssignment_SUCCESS,
  GetAllAssignment_FAIL,
  AssingmentStatusUpdate_REQUEST,
  AssingmentStatusUpdate_SUCCESS,
  AssingmentStatusUpdate_FAIL,
} from "../constants/AssignmentConstant";

const initialState = {
  requestBody: null,
  responseBody: [],
  error: null,
  msg: null,
  loading: false,
};

export const AssingTailor = (state = initialState, action) => {
  switch (action.type) {
    case AssingTailor_REQUEST:
      return { ...state,
        loading: true, 
        msg: null,
        error: null 
      };
    case AssingTailor_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg, 
        error: null
      };
    case AssingTailor_FAIL:
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

export const GetAllAssignment = (state = initialState, action) => {
  switch (action.type) {
    case GetAllAssignment_REQUEST:
      return { 
        ...state,
         loading: true,
          msg: null,
          error: null,
         };
    case GetAllAssignment_SUCCESS:
      return {
         ...state,
          loading: false,
           responseBody: action.payload.responseBody,
           msg: action.payload.msg || "Assignments fetched successfully",
           error: null
           };
    case GetAllAssignment_FAIL:
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

export const AssingmentStatusUpdate = (state = initialState, action) => {
  switch (action.type) {
    case AssingmentStatusUpdate_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
        error: null
      };
    case AssingmentStatusUpdate_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: action.payload.msg || "Assignment status updated successfully",
        error: null
      };
    case AssingmentStatusUpdate_FAIL:
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