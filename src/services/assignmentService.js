
import axios from 'axios';

const AssingTailor = async (AssingTailorData) => {
  const config = {
    method: 'post',
    url: '/Admin/AssingTailor',
    data: AssingTailorData
  };

  try {
    console.log('📦 Payload being sent to AssingTailor:', AssingTailorData);

    const response = await axios.request(config);
    console.log('✅ AssingTailor added successfully:', response.data);

    return response;
  } catch (error) {
    console.error('❌ Error adding AssingTailor:', error);
    throw error;
  }
};

const GetAllAssignment = async () => {
  const config = {
    method: 'get',
    url: '/Admin/GetAllAssignment'
  };
  return axios.request(config);
};

const AssingmentStatusUpdate = async (AssingmentStatusUpdateData) => {
  let config = {
    method: 'post',
    url: '/Admin/AssingmentStatusUpdate',
    data: AssingmentStatusUpdateData
  };
  return axios.request(config);
}; 

export const assignmentService = {
  AssingTailor,
  GetAllAssignment,
  AssingmentStatusUpdate
};