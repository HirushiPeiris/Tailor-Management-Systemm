
import axios from 'axios';

const GetAllTailors = async () => {
  let config = {
    method: 'get',
    url: '/Tailor/GetAllTailors'
  };
  return axios.request(config);
};

const GetTailorsByID = async (TailorId) => {
  let config = {
    method: 'get',
    url: `/Tailor/GetTailorsByID?TailorId=${TailorId}`
  };
  return axios.request(config);
}; 

const AddTailors = async (tailorData) => {
    let config = {
        method: 'post',
        url: '/Tailor/AddTailors',
        data: tailorData
    };
    return axios.request(config);
};

const LoginTailor = async (credentials) => {
  let config = {
    method: 'post',
    url: '/Tailor/LoginTailor',
    data: credentials
  };
  return axios.request(config);
};

const UpdateTailorDetails = async (tailorData) => {
  const { TailorId, TailorName, Phone, Email, Skills, States } = tailorData;

  console.log('🔄 UpdateTailorDetails Service - Original data:', tailorData);
  console.log('🔄 UpdateTailorDetails Service - Transformed data:', {
    TailorId,
    Name: TailorName, 
    Phone,
    Email,
    Skills,
    States
  });

  let config = {
    method: 'post',
    url: '/Tailor/UpdateTailorDetails',
    params: {
      TailorId,
      Name: TailorName, 
      Phone,
      Email,
      Skills,
      States
    }
  };

  try {
    const response = await axios.request(config);
    console.log('✅ UpdateTailorDetails Service - Response:', response.data);
    return response;
  } catch (error) {
    console.error('❌ UpdateTailorDetails Service - Error:', error);
    console.error('❌ Error details:', error.response?.data || error.message);
    throw error;
  }
};

export const tailorService = {
  GetAllTailors,
  GetTailorsByID,
  AddTailors,
  LoginTailor,
  UpdateTailorDetails
};