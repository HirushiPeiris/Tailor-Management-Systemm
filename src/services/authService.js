
import axios from "axios";

const LoginTailor = async (credentials) => {
  const config = {
    method: "post",
    url: '/Tailor/LoginTailor', 
    data: credentials,
  };
  return axios.request(config);
};

export const authService = {
  LoginTailor,
};

