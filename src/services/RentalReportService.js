import axios from 'axios';

const RentalReport = async () => {
  let config = {
    method: 'get',
    url: `/Rental/RentalReprot` 
  };
  return axios.request(config);
}; 

export const RentalReportService = {
  RentalReport 
};