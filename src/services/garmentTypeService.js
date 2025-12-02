import axios from 'axios';

const GetAllGarmentType = async () => {
  let config = {
    method: 'get',
    url: '/Tailor/GetAllGarmentType'
  };
  return axios.request(config);
};

const AddGarmentType = async (GarmentTypeName) => {
  let config = {
    method: 'post',
    url: '/Tailor/AddGarmentType',
    data: GarmentTypeName
  };
  return axios.request(config);
};


const UpdateGarmentType = async (UpdateGarmentTypeData) => {
  const queryParams = new URLSearchParams({
    Status: UpdateGarmentTypeData.Status || 'A',
    GarmentTypeName: UpdateGarmentTypeData.GarmentTypeName
  }).toString();

  let config = {
    method: 'post',
    url: `/Tailor/UpdateGarmentType?${queryParams}`,
    data: {} 
  };
  return axios.request(config);
}; 



const GetAllInactiveGarmentType = async (GetAllInactiveGarmentTypeData) => {
  let config = {
    method: 'get', 
    url: '/Tailor/GetAllInactiveGarmentType', 
    data: GetAllInactiveGarmentTypeData
  };
  return axios.request(config);
}; 


export const garmentTypeService = {
  GetAllGarmentType,
  AddGarmentType,
  UpdateGarmentType,
  GetAllInactiveGarmentType,
};
