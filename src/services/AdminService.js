
// import axios from "axios";

// const AddAdmin = async (AddAdminData) => {
//   let config = {
//     method: "post",
//     url: "/Admin/AddAdmin",
//     data: AddAdminData, // ✅ { Email, PasswordHash }
//   };
//   return axios.request(config);
// };

// const GetAllAdmins = async () => {
//   let config = {
//     method: "get",
//     url: "/Admin/GetAllAdmins",
//   };
//   return axios.request(config);
// };

// export const AdminService = {
//   AddAdmin,
//   GetAllAdmins,
// };





// AdminService.js
import axios from "axios";

const AddAdmin = async (AddAdminData) => {
  let config = {
    method: "post",
    url: "/Admin/AddAdmin",
    data: AddAdminData,
  };
  return axios.request(config);
};

const GetAllAdmins = async () => {
  let config = {
    method: "get",
    url: "/Admin/GetAllAdmins",
  };
  return axios.request(config);
};

export const AdminService = {
  AddAdmin,
  GetAllAdmins,
};