import {
  GetAllTailors_REQUEST,
  GetAllTailors_SUCCESS,
  GetAllTailors_FAIL,
  GetTailorsByID_REQUEST,
  GetTailorsByID_SUCCESS,
  GetTailorsByID_FAIL,
  AddTailors_REQUEST,
  AddTailors_SUCCESS,
  AddTailors_FAIL,
  LoginTailor_REQUEST,
  LoginTailor_SUCCESS,
  LoginTailor_FAIL,
  UpdateTailorDetails_REQUEST,
  UpdateTailorDetails_SUCCESS,
  UpdateTailorDetails_FAIL,
} from "../constants/TailorConstants";

import { tailorService } from "../services/TailorService";

// ------------------ Get All Tailors ------------------
export const GetAllTailors = () => async (dispatch) => {
  try {
    dispatch({ type: GetAllTailors_REQUEST });
    const { data } = await tailorService.GetAllTailors();

    if (data.StatusCode === 200) {
      const tailorArray = Array.isArray(data.ResultSet)
        ? data.ResultSet
        : data.ResultSet
        ? [data.ResultSet]
        : [];

      dispatch({
        type: GetAllTailors_SUCCESS,
        payload: { responseBody: tailorArray },
      });
    } else {
      const msg =
        data.Message ||
        "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({ type: GetAllTailors_FAIL, payload: { msg } });
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({ type: GetAllTailors_FAIL, payload: { msg: message } });
  }
};

// ------------------ Get Tailor By ID ------------------
export const GetTailorsByID = (TailorId) => async (dispatch) => {
  try {
    dispatch({ type: GetTailorsByID_REQUEST });
    const { data } = await tailorService.GetTailorsByID(TailorId);

    if (data.StatusCode === 200) {
      const tailor = data.ResultSet?.[0] || null;
      dispatch({
        type: GetTailorsByID_SUCCESS,
        payload: { responseBody: tailor, msg: data.Message },
      });
    } else {
      const msg =
        data.Message ||
        "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({ type: GetTailorsByID_FAIL, payload: { msg } });
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({ type: GetTailorsByID_FAIL, payload: { msg: message } });
  }
};

// ------------------ Add Tailor ------------------
export const AddTailors = (TailorData) => async (dispatch) => {
  try {
    dispatch({ type: AddTailors_REQUEST });
    const { data } = await tailorService.AddTailors(TailorData);

    if (data.StatusCode === 200) {
      const payload = {
        responseBody: data.ResultSet,
        data: TailorData,
      };
      dispatch({ type: AddTailors_SUCCESS, payload });
      return { type: AddTailors_SUCCESS, payload };
    } else {
      const msg = data.Message || "Sorry, we could not add the tailor. Please try again!";
      const failPayload = { msg };
      dispatch({ type: AddTailors_FAIL, payload: failPayload });
      return { type: AddTailors_FAIL, msg };
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    const failPayload = { msg: message };
    dispatch({ type: AddTailors_FAIL, payload: failPayload });
    return { type: AddTailors_FAIL, msg: message };
  }
};

// ------------------ Login Tailor ------------------
export const LoginTailor = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: LoginTailor_REQUEST });
    const { data } = await tailorService.LoginTailor(credentials);

    if (data.StatusCode === 200) {
      dispatch({
        type: LoginTailor_SUCCESS,
        payload: { responseBody: data.ResultSet },
      });
    } else {
      const msg = data.Message || "Login failed. Please check your credentials.";
      dispatch({ type: LoginTailor_FAIL, payload: { msg } });
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch({ type: LoginTailor_FAIL, payload: { msg: message } });
  }
};

// ------------------ Update Tailor Details ------------------
export const UpdateTailorDetails = (tailorData) => async (dispatch) => {
  try {
    dispatch({ type: UpdateTailorDetails_REQUEST });

    console.log('🔄 UpdateTailorDetails Action - Sending data:', tailorData);

    const { data } = await tailorService.UpdateTailorDetails(tailorData);
    
    console.log("✅ UpdateTailorDetails Action - API Response:", data);

    if (data.StatusCode === 200) {
      const successPayload = {
        type: UpdateTailorDetails_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          msg: data.Message || "Tailor updated successfully",
          data: tailorData,
        },
      };

      dispatch(successPayload);
      return successPayload;
    } else {
      console.log('❌ UpdateTailorDetails Action - API returned non-200 status:', data);
      const msg = data.Message || "Sorry, we could not update the tailor. Please try again!";
      const failPayload = {
        type: UpdateTailorDetails_FAIL,
        payload: { msg },
      };
      dispatch(failPayload);
      return failPayload;
    }
  } catch (error) {
    console.error("❌ UpdateTailorDetails Action - Error:", error);
    console.error("❌ Error response:", error.response?.data);
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    const failPayload = {
      type: UpdateTailorDetails_FAIL,
      payload: { msg: message },
    };
    dispatch(failPayload);
    return failPayload;
  }
};