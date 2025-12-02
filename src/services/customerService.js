
// import axios from 'axios';

// const GetAllCustomers = async () => {
//   let config = {
//     method: 'get',
//     url: '/Customer/GetAllCustomers'
//   };
//   return axios.request(config);
// };

// const GetCustomerByID = async (CustomerId) => {
//   let config = {
//     method: 'get',
//     url: '/Customer/GetCustomerByID',
//     data:CustomerId
//   };
//   return axios.request(config);
// }; 


// const AddCustomer = async (Customer) => {
//     let config = {
//         method: 'post',
//         url: '/Customer/AddCustomer',
//         data: Customer
//     };

//   return axios.request(config);
// };

// const SearchCustomersByEmail = async (CustomerEmail) => {
//   let config = {
//     method: 'get',
//     url: '/Customer/SearchCustomersByEmail',
//     data: CustomerEmail
//   };
//   return axios.request(config);
// };


// const UpdateCustomers = async (customersData) => {
//   let config = {
//     method: 'put', // Using PUT for updating an existing resource
//     url: '/Customer/UpdateCustomers', // The URL for your update API endpoint
//     data: customersData,
//   };
//   return axios.request(config);
// }; 

// export const customerService = {
//   GetAllCustomers,
//   GetCustomerByID,
//   AddCustomer,
//   SearchCustomersByEmail,
//   UpdateCustomers
// };


//................................correct code is bellow.................
// import axios from 'axios';

// const GetAllCustomers = async () => {
//   let config = {
//     method: 'get',
//     url: '/Customer/GetAllCustomers'
//   };
//   return axios.request(config);
// };

// // const GetCustomerByID = async (CustomerId) => {
// //   let config = {
// //     method: 'get',
// //     url: '/Customer/GetCustomerByID',
// //     // Change 'data' to 'params'
// //     params: {
// //       CustomerId: CustomerId
// //     }
// //   };
// //   return axios.request(config);
// // }; 

// const AddCustomer = async (Customer) => {
//     let config = {
//         method: 'post',
//         url: '/Customer/AddCustomer',
//         data: Customer
//     };
//   return axios.request(config);
// };



// // Change 'CustomerEmail' to 'Email'
// const SearchCustomersByEmail = async (CustomerEmail) => {
//   let config = {
//     method: 'get',
//     url: '/Customer/SearchCustomersByEmail',
//     params: {
//       Email: CustomerEmail // Corrected parameter name to match backend model
//     }
//   };
//   return axios.request(config);
// };

// // Change this line in your customerService.js file
// const GetCustomerByID = async (CustomerId) => {
//   let config = {
//     method: 'get',
//     url: '/Customer/GetCustomerByID',
//     params: {
//       CustomerId: CustomerId // Change the parameter name here
//     }
//   };
//   return axios.request(config);
// };


// // const SearchCustomersByEmail = async (CustomerEmail) => {
// //   let config = {
// //     method: 'get',
// //     url: '/Customer/SearchCustomersByEmail',
// //     // Change 'data' to 'params'
// //     params: {
// //       CustomerEmail: CustomerEmail
// //     }
// //   };
// //   return axios.request(config);
// // };

// const UpdateCustomers = async (customersData) => {
//   let config = {
//     method: 'put',
//     url: '/Customer/UpdateCustomers',
//     data: customersData,
//   };
//   return axios.request(config);
// }; 

// export const customerService = {
//   GetAllCustomers,
//   GetCustomerByID,
//   AddCustomer,
//   SearchCustomersByEmail,
//   UpdateCustomers
// };


import axios from 'axios';

const GetAllCustomers = async () => {
  let config = {
    method: 'get',
    url: '/Customer/GetAllCustomers'
  };
  return axios.request(config);
};

const AddCustomer = async (Customer) => {
  let config = {
    method: 'post',
    url: '/Customer/AddCustomer',
    data: Customer
  };
  return axios.request(config);
};

// Change 'CustomerEmail' to 'Email'
const SearchCustomersByEmail = async (CustomerEmail) => {
  let config = {
    method: 'get',
    url: '/Customer/SearchCustomersByEmail',
    params: {
      Email: CustomerEmail // Corrected parameter name to match backend model
    }
  };
  return axios.request(config);
};

// Change this line in your customerService.js file
const GetCustomerByID = async (CustomerId) => {
  let config = {
    method: 'get',
    url: '/Customer/GetCustomerByID',
    params: {
      CustomerId: CustomerId // Change the parameter name here
    }
  };
  return axios.request(config);
};

// // ✅ Correct UpdateCustomerDetails function using query params
// const UpdateCustomerDetails = async (customerData) => {
//   const { CustomerId, FullName, PhoneNumber } = customerData;
//   let config = {
//     method: 'get', // backend expects GET with query params
//     url: '/Customer/UpdateCustomerDetails',
//     params: {
//       CustomerId,
//       FullName,
//       PhoneNumber
//     }
//   };
//   return axios.request(config);
// };


// ✅ CORRECT: Use POST method with params (as shown in your Postman)
const UpdateCustomerDetails = async (customerData) => {
  const { CustomerId, FullName, PhoneNumber, Email, Address, States } = customerData;
  
  console.log('Update Service - Sending data:', customerData);
  
  let config = {
    method: 'post', // MUST be POST (not GET)
    url: '/Customer/UpdateCustomerDetails',
    params: { // Use params for query parameters in POST
      CustomerId,
      FullName,
      PhoneNumber,
      Email,
      Address,
      States
    }
  };
  
  try {
    const response = await axios.request(config);
    console.log('Update Service - Response:', response.data);
    return response;
  } catch (error) {
    console.error('Update Service - Error:', error);
    throw error;
  }
};

export const customerService = {
  GetAllCustomers,
  GetCustomerByID,
  AddCustomer,
  SearchCustomersByEmail,
  UpdateCustomerDetails // updated function name
};
