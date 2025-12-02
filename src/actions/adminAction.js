// import {
//   AddAdmin_REQUEST,
//   AddAdmin_SUCCESS,
//   AddAdmin_FAIL,
//   GetAllAdmins_REQUEST,
//   GetAllAdmins_SUCCESS,
//   GetAllAdmins_FAIL,
// } from "../constants/AdminConstants";

// import { AdminService } from "../services/AdminService";

// // ✅ ADD ADMIN
// export const AddAdmin = (AddAdminData) => async (dispatch) => {
//   try {
//     dispatch({ type: AddAdmin_REQUEST });

//     const { data } = await AdminService.AddAdmin(AddAdminData);

//     if (data.StatusCode === 200) {
//       dispatch({
//         type: AddAdmin_SUCCESS,
//         payload: data.ResultSet,
//       });
//     } else {
//       dispatch({
//         type: AddAdmin_FAIL,
//         payload: { msg: data.Message || "Failed to add admin." },
//       });
//     }
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();

//     dispatch({
//       type: AddAdmin_FAIL,
//       payload: { msg: message },
//     });
//   }
// };

// // ✅ GET ALL ADMINS
// export const GetAllAdmins = () => async (dispatch) => {
//   try {
//     dispatch({ type: GetAllAdmins_REQUEST });

//     const { data } = await AdminService.GetAllAdmins();

//     if (data.StatusCode === 200) {
//       const adminsArray = Array.isArray(data.ResultSet)
//         ? data.ResultSet
//         : data.ResultSet
//         ? [data.ResultSet]
//         : [];

//       dispatch({
//         type: GetAllAdmins_SUCCESS,
//         payload: { responseBody: adminsArray },
//       });
//     } else {
//       dispatch({
//         type: GetAllAdmins_FAIL,
//         payload: { msg: data.Message || "Failed to fetch admins." },
//       });
//     }
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString();

//     dispatch({
//       type: GetAllAdmins_FAIL,
//       payload: { msg: message },
//     });
//   }
// };






// adminAction.js
import {
  AddAdmin_REQUEST,
  AddAdmin_SUCCESS,
  AddAdmin_FAIL,
  GetAllAdmins_REQUEST,
  GetAllAdmins_SUCCESS,
  GetAllAdmins_FAIL,
} from "../constants/AdminConstants";

import { AdminService } from "../services/AdminService";

// ✅ ADD ADMIN
export const AddAdmin = (AddAdminData) => async (dispatch) => {
  try {
    dispatch({ type: AddAdmin_REQUEST });

    const response = await AdminService.AddAdmin(AddAdminData);
    const data = response.data;

    console.log('🔄 AddAdmin Action - Response:', data);

    if (data.StatusCode === 200) {
      dispatch({
        type: AddAdmin_SUCCESS,
        payload: data.ResultSet || data,
      });
    } else {
      dispatch({
        type: AddAdmin_FAIL,
        payload: { msg: data.Message || data.Result || "Failed to add admin." },
      });
    }
  } catch (error) {
    console.error('❌ AddAdmin Action - Error:', error);
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    dispatch({
      type: AddAdmin_FAIL,
      payload: { msg: message },
    });
  }
};

// ✅ GET ALL ADMINS
export const GetAllAdmins = () => async (dispatch) => {
  try {
    dispatch({ type: GetAllAdmins_REQUEST });

    const response = await AdminService.GetAllAdmins();
    const data = response.data;

    console.log('🔄 GetAllAdmins Action - Response:', data);

    if (data.StatusCode === 200) {
      const adminsArray = Array.isArray(data.ResultSet)
        ? data.ResultSet
        : data.ResultSet
        ? [data.ResultSet]
        : [];

      dispatch({
        type: GetAllAdmins_SUCCESS,
        payload: { responseBody: adminsArray },
      });
    } else {
      dispatch({
        type: GetAllAdmins_FAIL,
        payload: { msg: data.Message || "Failed to fetch admins." },
      });
    }
  } catch (error) {
    console.error('❌ GetAllAdmins Action - Error:', error);
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    dispatch({
      type: GetAllAdmins_FAIL,
      payload: { msg: message },
    });
  }
};