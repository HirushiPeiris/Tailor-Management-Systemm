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

import { measurementService } from '../services/measurementService';

export const GetMeasurementsByCustomerId = (CustomerId) => async (dispatch) => {
  try {
    dispatch({ type: GetMeasurementsByCustomerId_REQUEST });
    const { data } = await measurementService.GetMeasurementsByCustomerId(CustomerId);
    if (data.StatusCode === 200) {
      dispatch({
        type: GetMeasurementsByCustomerId_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: CustomerId,
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({
        type: GetMeasurementsByCustomerId_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: GetMeasurementsByCustomerId_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

export const AddMeasurement = (MeasurementData) => async (dispatch) => {
  try {
    dispatch({ type: AddMeasurement_REQUEST });
    const { data } = await measurementService.AddMeasurement(MeasurementData);
    
    console.log("📏 AddMeasurement API Response:", data);
    
    if (data.StatusCode === 200) {
      dispatch({
        type: AddMeasurement_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: MeasurementData,
        },
      });
      
      // ✅ Refresh measurements list after successful add
      dispatch(GetAllMeasurements());
      
      return { 
        success: true, 
        data: data.ResultSet,
        measurementId: data.ResultSet?.MeasurementId || data.ResultSet?.measurementId
      };
    } else {
      const msg = data.Message || "Sorry, we could not add the Measurement. Please try again!";
      dispatch({
        type: AddMeasurement_FAIL,
        payload: {
          msg: msg,
        },
      });
      return { success: false, error: msg };
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: AddMeasurement_FAIL,
      payload: {
        msg: message,
      },
    });
    return { success: false, error: message };
  }
};

// ✅ FIXED: UpdateMeasurement now returns result and refreshes data
export const UpdateMeasurement = (UpdateMeasurementData) => async (dispatch) => {
  try {
    dispatch({ type: UpdateMeasurement_REQUEST });
    const { data } = await measurementService.UpdateMeasurement(UpdateMeasurementData);
    
    console.log("📏 UpdateMeasurement API Response:", data);
    
    if (data.StatusCode === 200) {
      dispatch({
        type: UpdateMeasurement_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: UpdateMeasurementData,
        },
      });
      
      // ✅ Refresh measurements list after successful update
      dispatch(GetAllMeasurements());
      
      // ✅ RETURN SUCCESS RESULT - This was missing!
      return { 
        success: true, 
        data: data.ResultSet,
        measurementId: data.ResultSet?.MeasurementId || data.ResultSet?.measurementId
      };
    } else {
      const msg = data.Message || "Sorry, we could not update the measurements. Please try again!";
      dispatch({
        type: UpdateMeasurement_FAIL,
        payload: {
          msg: msg,
        },
      });
      // ✅ RETURN FAILURE RESULT
      return { success: false, error: msg };
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: UpdateMeasurement_FAIL,
      payload: {
        msg: message,
      },
    });
    // ✅ RETURN ERROR RESULT
    return { success: false, error: message };
  }
};

export const GetAllMeasurements = () => async (dispatch) => {
  try {
    dispatch({ type: GetAllMeasurements_REQUEST });
    const { data } = await measurementService.GetAllMeasurements();
    if (data.StatusCode === 200) {
      dispatch({
        type: GetAllMeasurements_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({
        type: GetAllMeasurements_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: GetAllMeasurements_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

export const GetMeasurementByOrderId = (OrderId) => async (dispatch) => {
  try {
    dispatch({ type: GetMeasurementByOrderId_REQUEST });
    const { data } = await measurementService.GetMeasurementByOrderId(OrderId);
    if (data.StatusCode === 200) {
      dispatch({
        type: GetMeasurementByOrderId_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: OrderId,
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({
        type: GetMeasurementByOrderId_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: GetMeasurementByOrderId_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};