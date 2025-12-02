import axios from 'axios';

const GetAllRental = async () => {
  const config = {
    method: 'get',
    url: '/Rental/GetAllRental'
  };
  return axios.request(config);
};

const AddRentalCloths = async (AddRentalClothsData) => {
  const formData = new FormData();
  
  // Append all fields as form-data
  formData.append('Name', AddRentalClothsData.Name);
  formData.append('Color', AddRentalClothsData.Color || '');
  formData.append('Size', AddRentalClothsData.Size || '');
  formData.append('Quantity', AddRentalClothsData.Quantity || 1);
  formData.append('RentPrice', AddRentalClothsData.RentPrice);
  formData.append('Status', AddRentalClothsData.Status || 'Available');
  formData.append('CategoryId', AddRentalClothsData.CategoryId || '');
  
  // Append file if exists
  if (AddRentalClothsData.file) {
    formData.append('file', AddRentalClothsData.file);
  }

  console.log('FormData entries for Add:');
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const config = {
    method: 'post',
    url: '/Rental/AddRentalCloths',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  };
  return axios.request(config);
}; 

const UpdateRentalCloths = async (UpdateRentalClothsData) => {
  const formData = new FormData();
  
  // Append all fields as form-data
  formData.append('ClothId', UpdateRentalClothsData.ClothId);
  formData.append('Name', UpdateRentalClothsData.Name);
  formData.append('Color', UpdateRentalClothsData.Color || '');
  formData.append('Size', UpdateRentalClothsData.Size || '');
  formData.append('Quantity', UpdateRentalClothsData.Quantity || 1);
  formData.append('RentPrice', UpdateRentalClothsData.RentPrice);
  formData.append('Status', UpdateRentalClothsData.Status || 'Available');
  formData.append('CategoryId', UpdateRentalClothsData.CategoryId || '');
  
  // Append file if exists
  if (UpdateRentalClothsData.file) {
    formData.append('file', UpdateRentalClothsData.file);
  }

  console.log('FormData entries for Update:');
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const config = {
    method: 'post', 
    url: '/Rental/UpdateRentalCloths',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  };
  return axios.request(config);
};

const GetRentalById = async (ClothId) => {
  const config = {
    method: 'get',
    url: `/Rental/GetByID?ClothId=${ClothId}`
  };
  return axios.request(config);
};

const ReturnCloth = async (returnData) => {
  const config = {
    method: 'post',
    url: '/Rental/ReturnCloth',
    data: returnData
  };
  return axios.request(config);
};

const RequestCloth = async (requestData) => {
  const config = {
    method: 'post',
    url: '/Rental/Requestcloth',
    data: requestData
  };
  return axios.request(config);
};

const PhotoPrivew = async (CID) => {
  const config = {
    method: 'get',
    url: `/Rental/PhotoPrivew?CID=${CID}`
  };
  return axios.request(config);
};

export const rentalService = {
  GetAllRental,
  AddRentalCloths,
  UpdateRentalCloths,
  GetRentalById,
  ReturnCloth,
  RequestCloth,
  PhotoPrivew
};