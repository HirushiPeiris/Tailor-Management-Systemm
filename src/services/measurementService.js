
import axios from 'axios';


const GetMeasurementsByCustomerId = async (CustomerId) => {
    const config = {
        method: 'get',
        url: `/Measurements/GetMeasurementsByCustomerId?CustomerId=${CustomerId}`,
    };
    return axios.request(config);
};


const AddMeasurement = async (MeasurementData) => {
  const config = {
    method: 'post',
    url: '/Measurements/AddMeasurement',
    data: MeasurementData
  };

  try {
    // ✅ Log payload before sending
    console.log('📦 Payload being sent to AddMeasurement:', MeasurementData);

    const response = await axios.request(config);
    console.log('✅ Measurement added successfully:', response.data);

    return response;
  } catch (error) {
    console.error('❌ Error adding measurement:', error);
    throw error;
  }
};



const UpdateMeasurement = async (UpdateMeasurementData) => {
  let config = {
    method: 'post', 
    url: '/Measurements/UpdateMeasurement', 
    data: UpdateMeasurementData
  };
  return axios.request(config);
}; 

const GetAllMeasurements = async () => {
  const config = {
    method: 'get',
    url: '/Measurements/GetAllMeasurements',
  };
  return axios.request(config);
};

const GetMeasurementByOrderId = async (OrderId) => {
    const config = {
        method: 'get',
        url: `/Measurements/GetMeasurementByOrderId?OrderId=${OrderId}`,
    };
    return axios.request(config);
};


export const measurementService = {
  GetMeasurementsByCustomerId,
  AddMeasurement,
  UpdateMeasurement,
  GetAllMeasurements,
  GetMeasurementByOrderId
};