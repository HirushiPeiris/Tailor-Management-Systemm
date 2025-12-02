import {
  AddCategory_REQUEST,
  AddCategory_SUCCESS,
  AddCategory_FAIL,
  GetAllCategory_REQUEST,
  GetAllCategory_SUCCESS,
  GetAllCategory_FAIL
} from "../constants/categoryConstant";

import  {categoryService}  from '../services/categoryService';

export const GetAllCategory = () => async (dispatch) => {
  try {
    dispatch({ type: GetAllCategory_REQUEST });
    const { data } = await categoryService.GetAllCategory();

    if (data.StatusCode === 200) {
      dispatch({
        type: GetAllCategory_SUCCESS,
        payload: {
          responseBody: data.ResultSet,
          msg: data.Result || "Data fetched successfully" // ADD THIS
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({
        type: GetAllCategory_FAIL,
        payload: {
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: GetAllCategory_FAIL,
      payload: {
        msg: message,
      },
    });
  }
};

export const AddCategory = (CategoryName) => async (dispatch) => {
  try {
    dispatch({ type: AddCategory_REQUEST });
    const { data } = await categoryService.AddCategory(CategoryName);

    if (data.StatusCode === 200) {
      dispatch({
        type: AddCategory_SUCCESS,
        payload: {
          data: CategoryName,
          responseBody: data.ResultSet,
          msg: data.Result || "Category added successfully!" // ADD THIS
        },
      });
    } else {
      const msg = data.Message || "Sorry, we could not add the category. Please try again!";
      dispatch({
        type: AddCategory_FAIL,
        payload: {
          data: CategoryName,
          msg: msg,
        },
      });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({
      type: AddCategory_FAIL,
      payload: {
        data: CategoryName,
        msg: message,
      },
    });
  }
};
