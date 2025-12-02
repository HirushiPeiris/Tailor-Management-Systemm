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

const initialState = {
  responseBody: [],
  loading: false,
  msg: null,
};

export const GetAllTailors = (state = initialState, action) => {
  switch (action.type) {
    case GetAllTailors_REQUEST:
      return {
        ...state,
        loading: true,
        msg: null,
      };
    case GetAllTailors_SUCCESS:
      return {
        ...state,
        loading: false,
        responseBody: action.payload.responseBody,
        msg: null,
      };
    case GetAllTailors_FAIL:
      return {
        ...state,
        loading: false,
        msg: action.payload.msg,
        responseBody: [],
      };
    default:
      return state;
  }
};

export const GetTailorsByID = (state = initialState, action) => {
  switch (action.type) {
    case GetTailorsByID_REQUEST:
      return { ...state, loading: true, msg: null };
    case GetTailorsByID_SUCCESS:
      return { ...state, loading: false, responseBody: action.payload, msg: null };
    case GetTailorsByID_FAIL:
      return { ...state, loading: false, msg: action.payload, responseBody: [] };
    default:
      return state;
  }
};

export const AddTailors = (state = initialState, action) => {
  switch (action.type) {
    case AddTailors_REQUEST:
      return { ...state, loading: true, msg: null };
    case AddTailors_SUCCESS:
      return { ...state, loading: false, responseBody: action.payload, msg: null };
    case AddTailors_FAIL:
      return { ...state, loading: false, msg: action.payload, responseBody: [] };
    default:
      return state;
  }
};

export const LoginTailor = (state = initialState, action) => {
  switch (action.type) {
    case LoginTailor_REQUEST:
      return { ...state, loading: true, msg: null };
    case LoginTailor_SUCCESS:
      return { ...state, loading: false, responseBody: action.payload, msg: null };
    case LoginTailor_FAIL:
      return { ...state, loading: false, msg: action.payload, responseBody: [] };
    default:
      return state;
  }
};

export const UpdateTailorDetails = (state = initialState, action) => {
  switch (action.type) {
    case UpdateTailorDetails_REQUEST:
      return { ...state, loading: true, msg: null };
    case UpdateTailorDetails_SUCCESS:
      return { ...state, loading: false, responseBody: action.payload, msg: null };
    case UpdateTailorDetails_FAIL:
      return { ...state, loading: false, msg: action.payload, responseBody: [] };
    default:
      return state;
  }
};
