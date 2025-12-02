import {
  RentalReprot_REQUEST,
  RentalReprot_SUCCESS,
  RentalReprot_FAIL,
} from "../constants/RentalReportConstants";
import { RentalReportService } from '../services/RentalReportService';

export const RentalReprot = () => async (dispatch) => {
  try {
    dispatch({ type: RentalReprot_REQUEST });
    const { data } = await RentalReportService.RentalReport(); // Fixed service call

    if (data.StatusCode === 200) {
      dispatch({
        type: RentalReprot_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          msg: data.Message || "Rental Report data loaded successfully",
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({
        type: RentalReprot_FAIL,
        payload: {
          msg: msg,
          error: data.Message,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: RentalReprot_FAIL,
      payload: {
        msg: message,
        error: message,
      },
    });
  }
};