import axios from "axios";

const LoginAdmin = async (credentials) => {
  const config = {
    method: "post",
    url: '/Admin/LoginAdmin',
    data: credentials,
  };
  return axios.request(config);
};

const LoginTailor = async (credentials) => {
  const config = {
    method: "post",
    url: '/Tailor/LoginTailor',
    data: credentials,
  };
  return axios.request(config);
};


export const unifiedLoginService = {
  LoginAdmin,
  LoginTailor,
};