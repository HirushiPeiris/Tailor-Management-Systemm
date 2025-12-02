import axios from 'axios';

const GetAllFabricType = async () => {
  const config = {
    method: 'get',
    url: '/Tailor/GetAllFabricType'
  };
  return axios.request(config);
};

const AddFabricType = async (FabricTypeName) => {
  const config = {
    method: 'post',
    url: '/Tailor/AddFabricType',
    data: FabricTypeName
  };
  return axios.request(config);
};

const UpdateFabricType = async (UpdateFabricTypeData) => {
  // Convert to query parameters including Stock
  const queryParams = new URLSearchParams({
    Status: UpdateFabricTypeData.Status || 'A',
    FabricTypeName: UpdateFabricTypeData.FabricTypeName,
    Stock: UpdateFabricTypeData.Stock || 0
  }).toString();

  let config = {
    method: 'post',
    url: `/Tailor/UpdateFabricType?${queryParams}`,
    data: {} // Empty body since data is in query params
  };
  return axios.request(config);
}; 

const GetAllInavctiveFabricType = async (GetAllInavctiveFabricTypeData) => {
  let config = {
    method: 'get',
    url: '/Tailor/GetAllInavctiveFabricType',
    data: GetAllInavctiveFabricTypeData
  };
  return axios.request(config);
}; 

const GetFabTypePresentage = async () => {
  const config = {
    method: 'get',
    url: '/Tailor/GetFabTypePresentage'
  };
  return axios.request(config);
};

export const fabricTypeService = {
  GetAllFabricType,
  AddFabricType,
  UpdateFabricType,
  GetAllInavctiveFabricType,
  GetFabTypePresentage
};