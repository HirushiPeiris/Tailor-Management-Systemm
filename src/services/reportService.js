import axios from 'axios';

const Report = async () => {
  let config = {
    method: 'get',
    url: `/Admin/Report`
  };
  return axios.request(config);
}; 

export const reportService = {
 Report
};