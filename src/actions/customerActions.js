import {
  GetAllCustomers_REQUEST,
  GetAllCustomers_SUCCESS,
  GetAllCustomers_FAIL,
  GetCustomerByID_REQUEST,
  GetCustomerByID_SUCCESS,
  GetCustomerByID_FAIL,
  AddCustomer_REQUEST,
  AddCustomer_SUCCESS,
  AddCustomer_FAIL,
  SearchCustomersByEmail_REQUEST,
  SearchCustomersByEmail_SUCCESS,
  SearchCustomersByEmail_FAIL,
  UpdateCustomerDetails_REQUEST,
  UpdateCustomerDetails_SUCCESS,
  UpdateCustomerDetails_FAIL,
} from "../constants/CustomerConstants";

import { customerService } from '../services/customerService';

// ------------------ Get All Customers ------------------
export const GetAllCustomers = () => async (dispatch) => {
  try {
    dispatch({ type: GetAllCustomers_REQUEST });
    const { data } = await customerService.GetAllCustomers();

    if (data.StatusCode === 200) {
      const customerArray = Array.isArray(data.ResultSet) ? data.ResultSet : (data.ResultSet ? [data.ResultSet] : []);
      dispatch({
        type: GetAllCustomers_SUCCESS,
        payload: { responseBody: customerArray },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({ type: GetAllCustomers_FAIL, payload: { msg } });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({ type: GetAllCustomers_FAIL, payload: { msg: message } });
  }
};

// ------------------ Get Customer By ID ------------------
export const GetCustomerByID = (CustomerId) => async (dispatch) => {
  try {
    dispatch({ type: GetCustomerByID_REQUEST });
    const { data } = await customerService.GetCustomerByID(CustomerId);

    if (data.StatusCode === 200) {
      const customer = data.ResultSet?.[0] || null;
      dispatch({
        type: GetCustomerByID_SUCCESS,
        payload: { responseBody: customer, msg: data.Message },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({ type: GetCustomerByID_FAIL, payload: { msg } });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({ type: GetCustomerByID_FAIL, payload: { msg: message } });
  }
};

// ------------------ Search Customers By Email ------------------
export const SearchCustomersByEmail = (CustomerEmail) => async (dispatch) => {
  try {
    dispatch({ type: SearchCustomersByEmail_REQUEST });
    const { data } = await customerService.SearchCustomersByEmail(CustomerEmail);

    if (data.StatusCode === 200) {
      dispatch({
        type: SearchCustomersByEmail_SUCCESS,
        payload: { responseBody: data.ResultSet, data: CustomerEmail },
      });
    } else {
      const msg = data.Message || "Sorry, we could not find the result for your search query. Please try again!";
      dispatch({ type: SearchCustomersByEmail_FAIL, payload: { msg } });
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    dispatch({ type: SearchCustomersByEmail_FAIL, payload: { msg: message } });
  }
};

// ------------------ Add Customer ------------------
export const AddCustomer = (CustomerData) => async (dispatch) => {
  try {
    dispatch({ type: AddCustomer_REQUEST });
    const { data } = await customerService.AddCustomer(CustomerData);

    if (data.StatusCode === 200) {
      const payload = { responseBody: data.ResultSet, data: CustomerData };
      dispatch({ type: AddCustomer_SUCCESS, payload });
      return { type: AddCustomer_SUCCESS, payload };
    } else {
      const msg = data.Message || "Sorry, we could not add the customer. Please try again!";
      const failPayload = { msg };
      dispatch({ type: AddCustomer_FAIL, payload: failPayload });
      return { type: AddCustomer_FAIL, msg };
    }
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const failPayload = { msg: message };
    dispatch({ type: AddCustomer_FAIL, payload: failPayload });
    return { type: AddCustomer_FAIL, msg: message };
  }
};

export const UpdateCustomerDetails = (customerData) => async (dispatch) => {
  try {
    dispatch({ type: UpdateCustomerDetails_REQUEST });

    const { data } = await customerService.UpdateCustomerDetails(customerData);
    console.log('Update API Response:', data); // Add logging

    if (data.StatusCode === 200) {
      const successPayload = {
        type: UpdateCustomerDetails_SUCCESS,
        payload: { 
          responseBody: data.ResultSet, 
          msg: data.Message || "Customer updated successfully",
          data: customerData 
        }
      };
      
      dispatch(successPayload);
      return successPayload; // RETURN the success result
    } else {
      const msg = data.Message || "Sorry, we could not update the customer. Please try again!";
      const failPayload = { type: UpdateCustomerDetails_FAIL, payload: { msg } };
      dispatch(failPayload);
      return failPayload; // RETURN the failure result
    }
  } catch (error) {
    console.error('Update Customer Error:', error);
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    const failPayload = { type: UpdateCustomerDetails_FAIL, payload: { msg: message } };
    dispatch(failPayload);
    return failPayload; // RETURN the error result
  }
};