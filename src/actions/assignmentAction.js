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

import { assignmentService } from '../services/assignmentService';

export const AssingTailor = (AssingTailorData) => async (dispatch) => {
  try {
    dispatch({ type: AssingTailor_REQUEST });
    const { data } = await assignmentService.AssingTailor(AssingTailorData);
    if (data.StatusCode === 200) {
      dispatch({
        type: AssingTailor_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
           msg: "Assignment added successfully!",
          data: AssingTailorData,
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not add the Assingnment. Please try again!";
      dispatch({
        type: AssingTailor_FAIL,
        payload: {
          msg: msg,
          error: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: AssingTailor_FAIL,
      payload: {
        msg: message,
        error: message,
      },
    });
  }
};

export const GetAllAssignment = () => async (dispatch) => {
  try {
    dispatch({ type: GetAllAssignment_REQUEST });
    const { data } = await assignmentService.GetAllAssignment();

    if (data.StatusCode === 200) {
      dispatch({
        type: GetAllAssignment_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          msg: "Assignments loaded successfully",
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({
        type: GetAllAssignment_FAIL,
        payload: {
          msg: msg,
          error: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: GetAllAssignment_FAIL,
      payload: {
        msg: message,
        error: message,
      },
    });
  }
};

export const AssingmentStatusUpdate = (AssingmentStatusUpdateData) => async (dispatch) => {
  try {
    dispatch({ type: AssingmentStatusUpdate_REQUEST });
    const { data } = await assignmentService.AssingmentStatusUpdate(AssingmentStatusUpdateData);
    if (data.StatusCode === 200) {
      dispatch({
        type: AssingmentStatusUpdate_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          msg: "Assignment status updated successfully!",
          data: AssingmentStatusUpdateData,
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not update the assignment. Please try again!";
      dispatch({
        type: AssingmentStatusUpdate_FAIL,
        payload: {
          msg: msg,
          error: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: AssingmentStatusUpdate_FAIL,
      payload: {
        msg: message,
        error: message
      },
    });
  }
};