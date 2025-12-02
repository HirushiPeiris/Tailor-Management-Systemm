import {
  Report_REQUEST,
  Report_SUCCESS,
  Report_FAIL,
} from "../constants/ReportConstants";
import { reportService } from '../services/reportService';

export const Report = () => async (dispatch) => {
  try {
    dispatch({ type: Report_REQUEST });
    const { data } = await reportService.Report();

    if (data.StatusCode === 200) {
      dispatch({
        type: Report_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          msg: data.Message || "Report data loaded successfully",
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({
        type: Report_FAIL,
        payload: {
          msg: msg,
          error: data.Message,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: Report_FAIL,
      payload: {
        msg: message,
        error: message,
      },
    });
  }
};

