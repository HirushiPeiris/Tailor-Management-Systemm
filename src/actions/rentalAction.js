import {
  AddRentalCloths_REQUEST,
  AddRentalCloths_SUCCESS, 
  AddRentalCloths_FAIL, 
  GetAllRental_REQUEST, 
  GetAllRental_SUCCESS,
  GetAllRental_FAIL,
  UpdateRentalCloths_REQUEST,
  UpdateRentalCloths_SUCCESS,
  UpdateRentalCloths_FAIL,
  GetRentalById_REQUEST,
  GetRentalById_SUCCESS,
  GetRentalById_FAIL,
  ReturnCloth_REQUEST,
  ReturnCloth_SUCCESS,
  ReturnCloth_FAIL,
  RequestCloth_REQUEST,
  RequestCloth_SUCCESS,
  RequestCloth_FAIL,
  PhotoPrivew_REQUEST,
  PhotoPrivew_SUCCESS,
  PhotoPrivew_FAIL
} from "../constants/RentalConstant";

import { rentalService } from '../services/rentalService';

// Add Rental Cloths
export const AddRentalCloths = (AddRentalClothsData) => async (dispatch) => {
  try {
    dispatch({ type: AddRentalCloths_REQUEST });
    
    if (!AddRentalClothsData?.Name || !AddRentalClothsData?.RentPrice) {
      dispatch({
        type: AddRentalCloths_FAIL,
        payload: "Name and RentPrice are required fields"
      });
      return;
    }

    console.log('AddRentalCloths action data:', AddRentalClothsData);

    const response = await rentalService.AddRentalCloths(AddRentalClothsData);
    const data = response.data;
    
    console.log('AddRentalCloths response:', data);
    
    if (data.StatusCode === 200) {
      dispatch({
        type: AddRentalCloths_SUCCESS,
        payload: {
          data: data.ResultSet || data,
          message: data.Message || "Rental cloth added successfully!"
        }
      });
    } else {
      dispatch({
        type: AddRentalCloths_FAIL,
        payload: data.Message || "Failed to add rental cloth"
      });
    }
  } catch (error) {
    console.error("AddRentalCloths Error:", error);
    const message = error.response?.data?.Message || error.response?.data?.message || error.message || "Network error occurred";
    dispatch({
      type: AddRentalCloths_FAIL,
      payload: message
    });
  }
};

// Get All Rental Cloths
export const GetAllRental = () => async (dispatch) => {
  try {
    dispatch({ type: GetAllRental_REQUEST });
    const response = await rentalService.GetAllRental();
    const data = response.data;

    if (data.StatusCode === 200) {
      dispatch({
        type: GetAllRental_SUCCESS,
        payload: data.ResultSet || data
      });
    } else {
      dispatch({
        type: GetAllRental_FAIL,
        payload: data.Message || "Failed to fetch rental data"
      });
    }
  } catch (error) {
    console.error("GetAllRental Error:", error);
    const message = error.response?.data?.Message || error.message || "Network error occurred";
    dispatch({
      type: GetAllRental_FAIL,
      payload: message
    });
  }
};

// Update Rental Cloths
export const UpdateRentalCloths = (UpdateRentalClothsData) => async (dispatch) => {
  try {
    dispatch({ type: UpdateRentalCloths_REQUEST });
    
    if (!UpdateRentalClothsData?.ClothId) {
      dispatch({
        type: UpdateRentalCloths_FAIL,
        payload: "ClothId is required for update"
      });
      return;
    }

    console.log('UpdateRentalCloths action data:', UpdateRentalClothsData);

    const response = await rentalService.UpdateRentalCloths(UpdateRentalClothsData);
    const data = response.data;
    
    console.log('UpdateRentalCloths response:', data);
    
    if (data.StatusCode === 200) {
      dispatch({
        type: UpdateRentalCloths_SUCCESS,
        payload: {
          data: data.ResultSet || data,
          message: data.Message || "Rental cloth updated successfully!"
        }
      });
    } else {
      dispatch({
        type: UpdateRentalCloths_FAIL,
        payload: data.Message || "Failed to update rental cloth"
      });
    }
  } catch (error) {
    console.error("UpdateRentalCloths Error:", error);
    const message = error.response?.data?.Message || error.response?.data?.message || error.message || "Network error occurred";
    dispatch({
      type: UpdateRentalCloths_FAIL,
      payload: message
    });
  }
};

// Get Rental by ID
export const GetRentalById = (ClothId) => async (dispatch) => {
  try {
    dispatch({ type: GetRentalById_REQUEST });
    const response = await rentalService.GetRentalById(ClothId);
    const data = response.data;

    if (data.StatusCode === 200) {
      dispatch({
        type: GetRentalById_SUCCESS,
        payload: data.ResultSet || data
      });
    } else {
      dispatch({
        type: GetRentalById_FAIL,
        payload: data.Message || "Failed to fetch rental details"
      });
    }
  } catch (error) {
    console.error("GetRentalById Error:", error);
    const message = error.response?.data?.Message || error.message || "Network error occurred";
    dispatch({
      type: GetRentalById_FAIL,
      payload: message
    });
  }
};

// Return Cloth
export const ReturnCloth = (returnData) => async (dispatch) => {
  try {
    dispatch({ type: ReturnCloth_REQUEST });
    
    if (!returnData?.RentalId) {
      dispatch({
        type: ReturnCloth_FAIL,
        payload: "RentalId is required for return"
      });
      return;
    }

    const response = await rentalService.ReturnCloth(returnData);
    const data = response.data;
    
    if (data.StatusCode === 200) {
      dispatch({
        type: ReturnCloth_SUCCESS,
        payload: {
          data: data.ResultSet || data,
          message: data.Message || "Cloth returned successfully!"
        }
      });
    } else {
      dispatch({
        type: ReturnCloth_FAIL,
        payload: data.Message || "Failed to return cloth"
      });
    }
  } catch (error) {
    console.error("ReturnCloth Error:", error);
    const message = error.response?.data?.Message || error.message || "Network error occurred";
    dispatch({
      type: ReturnCloth_FAIL,
      payload: message
    });
  }
};

// Request Cloth
export const RequestCloth = (requestData) => async (dispatch) => {
  try {
    dispatch({ type: RequestCloth_REQUEST });
    
    if (!requestData?.ClothId || !requestData?.CustomerId || !requestData?.RentQuantity) {
      dispatch({
        type: RequestCloth_FAIL,
        payload: "ClothId, CustomerId, and RentQuantity are required fields"
      });
      return;
    }

    const response = await rentalService.RequestCloth(requestData);
    const data = response.data;
    
    if (data.StatusCode === 200) {
      dispatch({
        type: RequestCloth_SUCCESS,
        payload: {
          data: data.ResultSet || data,
          message: data.Message || "Cloth requested successfully!"
        }
      });
    } else {
      dispatch({
        type: RequestCloth_FAIL,
        payload: data.Message || "Failed to request cloth"
      });
    }
  } catch (error) {
    console.error("RequestCloth Error:", error);
    const message = error.response?.data?.Message || error.message || "Network error occurred";
    dispatch({
      type: RequestCloth_FAIL,
      payload: message
    });
  }
};

export const PhotoPrivew = (CID) => async (dispatch) => {
  try {
    dispatch({ type: PhotoPrivew_REQUEST });
    
    if (!CID) {
      dispatch({
        type: PhotoPrivew_FAIL,
        payload: "CID is required for photo preview"
      });
      return;
    }

    const response = await rentalService.PhotoPrivew(CID);
    const data = response.data;

    if (data.StatusCode === 200) {
      dispatch({
        type: PhotoPrivew_SUCCESS,
        payload: data.ResultSet || data
      });
    } else {
      dispatch({
        type: PhotoPrivew_FAIL,
        payload: data.Message || "Failed to fetch photo preview"
      });
    }
  } catch (error) {
    console.error("PhotoPreview Error:", error);
    const message = error.response?.data?.Message || error.message || "Network error occurred";
    dispatch({
      type: PhotoPrivew_FAIL,
      payload: message
    });
  }
};