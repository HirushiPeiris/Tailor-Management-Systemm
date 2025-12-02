import {
GetAllFabricType_REQUEST,
GetAllFabricType_SUCCESS,
GetAllFabricType_FAIL,
AddFabricType_REQUEST,
AddFabricType_SUCCESS,
AddFabricType_FAIL,
UpdateFabricType_REQUEST,
UpdateFabricType_SUCCESS,  
UpdateFabricType_FAIL,
GetAllInavctiveFabricType_REQUEST,
GetAllInavctiveFabricType_SUCCESS,  
GetAllInavctiveFabricType_FAIL,
GetFabTypePresentage_REQUEST,
GetFabTypePresentage_SUCCESS,
GetFabTypePresentage_FAIL,
} from "../constants/FabricTypeConstant";

import { fabricTypeService } from '../services/fabricTypeService';

export const GetAllFabricType = () => async (dispatch) => {
  try {
    dispatch({ type: GetAllFabricType_REQUEST });
    const { data } = await fabricTypeService.GetAllFabricType();

    if (data.StatusCode === 200) {
      dispatch({
        type: GetAllFabricType_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          msg: data.Result || "Data fetched successfully"
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({
        type: GetAllFabricType_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: GetAllFabricType_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

export const AddFabricType = (FabricType) => async (dispatch) => {
  try {
    dispatch({ type: AddFabricType_REQUEST });
    const { data } = await fabricTypeService.AddFabricType(FabricType);

    if (data.StatusCode === 200) {
      dispatch({
        type: AddFabricType_SUCCESS,
        payload: {
          data: FabricType,
          responseBody: data.ResultSet,
          msg: data.Result || "Fabric type added successfully!"
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not add the Fabric type. Please try again!";
      dispatch({
        type: AddFabricType_FAIL,
        payload: {
          data: FabricType,
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: AddFabricType_FAIL,
      payload: {
        data: FabricType,
        msg: message,
      },
    });
  }
};

export const UpdateFabricType = (UpdateFabricTypeData) => async (dispatch) => {
  try {
    dispatch({ type: UpdateFabricType_REQUEST });
    const { data } = await fabricTypeService.UpdateFabricType(UpdateFabricTypeData);
    
    if (data.StatusCode === 200) {
      dispatch({
        type: UpdateFabricType_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: UpdateFabricTypeData,
          msg: data.Result || "Fabric type updated successfully!"
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not update the fabric type. Please try again!";
      dispatch({
        type: UpdateFabricType_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: UpdateFabricType_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

// FIXED: Corrected the parameter name to match the service
export const GetAllInactiveFabricType = (GetAllInactiveFabricTypeData) => async (dispatch) => {
  try {
    dispatch({ type: GetAllInavctiveFabricType_REQUEST });
    const { data } = await fabricTypeService.GetAllInavctiveFabricType(GetAllInactiveFabricTypeData);
    
    if (data.StatusCode === 200) {
      dispatch({
        type: GetAllInavctiveFabricType_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: GetAllInactiveFabricTypeData,
          msg: data.Result || "Data fetched successfully"
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not fetch inactive fabric types. Please try again!";
      dispatch({
        type: GetAllInavctiveFabricType_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: GetAllInavctiveFabricType_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

export const GetFabTypePresentage = (GetFabTypePresentageData) => async (dispatch) => {
  try {
    dispatch({ type: GetFabTypePresentage_REQUEST });
    const { data } = await fabricTypeService.GetFabTypePresentage(GetFabTypePresentageData);
    
    if (data.StatusCode === 200) {
      dispatch({
        type: GetFabTypePresentage_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: GetFabTypePresentageData,
          msg: data.Result || "Data fetched successfully"
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not get the Fabric Type percentage. Please try again!";
      dispatch({
        type: GetFabTypePresentage_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: GetFabTypePresentage_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};