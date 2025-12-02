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

const initialState = {
  loading: false,
  data: [],
  selectedRental: null,
  error: null,
  message: null,
  success: false
};

export const AddRentalCloths = (state = initialState, action) => {
  switch (action.type) {
    case AddRentalCloths_REQUEST:
      return { 
        ...state,
        loading: true,
        success: false,
        message: null,
        error: null 
      };
    case AddRentalCloths_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
        error: null
      };
    case AddRentalCloths_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        message: null,
        error: action.payload
      };
    default:
      return state;
  }
};

export const GetAllRental = (state = initialState, action) => {
  switch (action.type) {
    case GetAllRental_REQUEST:
      return { 
        ...state,
        loading: true,
        error: null
      };
    case GetAllRental_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null
      };
    case GetAllRental_FAIL:
      return {
        ...state,
        loading: false,
        data: [],
        error: action.payload
      };
    default:
      return state;
  }
};

export const UpdateRentalCloths = (state = initialState, action) => {
  switch (action.type) {
    case UpdateRentalCloths_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        message: null,
        error: null
      };
    case UpdateRentalCloths_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
        error: null
      };
    case UpdateRentalCloths_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        message: null,
        error: action.payload
      };
    default:
      return state;
  }
};

export const GetRentalById = (state = initialState, action) => {
  switch (action.type) {
    case GetRentalById_REQUEST:
      return {
        ...state,
        loading: true,
        selectedRental: null,
        error: null
      };
    case GetRentalById_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedRental: action.payload,
        error: null
      };
    case GetRentalById_FAIL:
      return {
        ...state,
        loading: false,
        selectedRental: null,
        error: action.payload
      };
    default:
      return state;
  }
};

export const ReturnCloth = (state = initialState, action) => {
  switch (action.type) {
    case ReturnCloth_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        message: null,
        error: null
      };
    case ReturnCloth_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
        error: null
      };
    case ReturnCloth_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        message: null,
        error: action.payload
      };
    default:
      return state;
  }
};

export const RequestCloth = (state = initialState, action) => {
  switch (action.type) {
    case RequestCloth_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        message: null,
        error: null
      };
    case RequestCloth_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
        error: null
      };
    case RequestCloth_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        message: null,
        error: action.payload
      };
    default:
      return state;
  }
};


export const PhotoPrivew = (state = initialState, action) => {
  switch (action.type) {
    case PhotoPrivew_REQUEST:
      return {
        ...state,
        loading: true,
        selectedRental: null,
        error: null
      };
    case PhotoPrivew_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedRental: action.payload,
        error: null
      };
    case PhotoPrivew_FAIL:
      return {
        ...state,
        loading: false,
        selectedRental: null,
        error: action.payload
      };
    default:
      return state;
  }
};