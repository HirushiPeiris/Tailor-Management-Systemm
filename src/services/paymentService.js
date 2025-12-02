import axios from 'axios';

const GetAllPayment = async () => {
  const config = {
    method: 'get',
    url: '/Payment/GetAllPayment'
  };
  return axios.request(config);
};


const AddPayment = async (paymentData) => {
  let config = {
    method: 'post', 
    url: '/Payment/AddPayment',
    data: paymentData
  };
  return axios.request(config);
}; 

const GetPaymentByOrderID = async (OrderId) => {
  let config = {
    method: 'get',
    url: `/Payment/GetPaymentByOrderID?OrderId=${OrderId}`
  };
  return axios.request(config);
}; 

const GetOrderPending = async () => {
  let config = {
    method: 'get',
    url: `/Order/GetOrderPending`
  };
  return axios.request(config);
}; 


export const paymentService = {
  GetAllPayment,
  AddPayment,
  GetPaymentByOrderID,
  GetOrderPending,
};