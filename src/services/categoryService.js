import axios from 'axios';

const GetAllCategory = async () => {
  let config = {
    method: 'get',
    url: '/Rental/GetAllCategory'
  };
  return axios.request(config);
};

const AddCategory = async (CategoryName) => {
  let config = {
    method: 'post',
    url: '/Rental/AddCategory',
    data: CategoryName
  };
  return axios.request(config);
};


export const categoryService = {
  GetAllCategory,
  AddCategory,
};
