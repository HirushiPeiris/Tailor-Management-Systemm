// orderService.js
import axios from 'axios';


const AddOrderItem = async (AddOrderItemData) => {
  const config = {
    method: 'post',
    url: '/Order/AddOrderItem',
    data: AddOrderItemData
  };
  return axios.request(config);
};

const GetOrderItems = async (orderId) => {
  const config = {
    method: 'get',
    url: `/Order/GetOrderItems?orderId=${orderId}`
  };
  return axios.request(config);
};

export const orderItemService = {
  AddOrderItem,
  GetOrderItems,
};