import {
GetAllGarmentType_REQUEST,
GetAllGarmentType_SUCCESS,
GetAllGarmentType_FAIL,
AddGarmentType_REQUEST,
AddGarmentType_SUCCESS,
AddGarmentType_FAIL,
UpdateGarmentType_REQUEST,
UpdateGarmentType_SUCCESS,
UpdateGarmentType_FAIL,
GetAllInactiveGarmentType_REQUEST,
GetAllInactiveGarmentType_SUCCESS,
GetAllInactiveGarmentType_FAIL,
} from "../constants/GarmentTypeConstant";

import  {garmentTypeService}  from '../services/garmentTypeService';

export const GetAllGarmentType = () => async (dispatch) => {
  try {
    dispatch({ type: GetAllGarmentType_REQUEST });
    const { data } = await garmentTypeService.GetAllGarmentType();

    if (data.StatusCode === 200) {
      dispatch({
        type: GetAllGarmentType_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          msg: data.Result || "Data fetched successfully" // ADD THIS
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({
        type: GetAllGarmentType_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: GetAllGarmentType_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

export const AddGarmentType = (GarmentType) => async (dispatch) => {
  try {
    dispatch({ type: AddGarmentType_REQUEST });
    const { data } = await garmentTypeService.AddGarmentType(GarmentType);

    if (data.StatusCode === 200) {
      dispatch({
        type: AddGarmentType_SUCCESS,
        payload: {
          data: GarmentType,
          responseBody: data.ResultSet,
          msg: data.Result || "Garment type added successfully!" // ADD THIS
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not add the Garment Type. Please try again!";
      dispatch({
        type: AddGarmentType_FAIL,
        payload: {
          data: GarmentType,
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: AddGarmentType_FAIL,
      payload: {
        data: GarmentType,
        msg: message,
      },
    });
  }
};


export const UpdateGarmentType = (UpdateGarmentTypeData) => async (dispatch) => {
  try {
    dispatch({ type: UpdateGarmentType_REQUEST });
    const { data } = await garmentTypeService.UpdateGarmentType(UpdateGarmentTypeData);
    if (data.StatusCode === 200) {
      dispatch({
        type: UpdateGarmentType_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: UpdateGarmentTypeData,
          msg: data.Result || "Garment type updated successfully!" // CRITICAL FIX - ADD THIS
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not update the garment type. Please try again!";
      dispatch({
        type: UpdateGarmentType_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: UpdateGarmentType_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

export const GetAllInactiveGarmentType = (GetAllInactiveGarmentTypeData) => async (dispatch) => {
  try {
    dispatch({ type: GetAllInactiveGarmentType_REQUEST });
    const { data } = await garmentTypeService.GetAllInactiveGarmentType(GetAllInactiveGarmentTypeData);
    if (data.StatusCode === 200) {
      dispatch({
        type: GetAllInactiveGarmentType_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          data: GetAllInactiveGarmentTypeData,
          msg: data.Result || "Data fetched successfully" // ADD THIS
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not update the Garment Type. Please try again!";
      dispatch({
        type: GetAllInactiveGarmentType_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: GetAllInactiveGarmentType_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};
