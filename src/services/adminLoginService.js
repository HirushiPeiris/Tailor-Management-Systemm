import axios from "axios";

const LoginAdmin = async (credentials) => {
  const config = {
    method: "post",
    url: '/Admin/LoginAdmin', // ✅ backend login route
    data: credentials,
  };
  return axios.request(config);
};

export const adminLoginService = {
  LoginAdmin,
};