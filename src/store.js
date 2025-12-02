import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

import {
  GetAllCustomers,
  GetCustomerByID,
  AddCustomer,
  SearchCustomersByEmail,
  UpdateCustomerDetails,
} from './reducers/customerReducer';

import {
  GetAllTailors,
  GetTailorsByID,
  AddTailors,
  UpdateTailorDetails
} from './reducers/TailorReducer';

import { authReducer } from './reducers/authReducer';
import { adminLoginReducer } from './reducers/adminLoginReducer';
import { 
  AssingTailor,
  GetAllAssignment,
  AssingmentStatusUpdate
} from './reducers/assignmentReducer';

import {
  GetAllGarmentType,
  AddGarmentType,
  UpdateGarmentType,
  GetAllInactiveGarmentType
} from './reducers/garmentTypeReducer';

import {
  GetAllFabricType,
  AddFabricType,
  UpdateFabricType,
  GetAllInavctiveFabricType,
  GetFabTypePresentage
} from './reducers/fabricTypeReducer';

import {
  GetMeasurementsByCustomerId,
  AddMeasurement,
  UpdateMeasurement,
  GetAllMeasurements,
  GetMeasurementByOrderId
} from './reducers/measurementReducer';

import {
  GetOrders,
  AddOrder,
  AddOrderItem,
  GetOrderItems,
  UpdateStatusOrder,
  UpdateStatusOrderItem,
  GetOrderItemByID,
  PayAdvance 
} from './reducers/orderReducer';

import {
AddAdmin,
GetAllAdmins
} from './reducers/AdminReducer';

import { unifiedLoginReducer } from "./reducers/unifiedLoginReducer";

import{
GetAllPayment,
AddPayment, 
GetPaymentByOrderID,
GetOrderPending,
} from "./reducers/paymentReducer";

import{ Report } from "./reducers/reportReducer";

import { 
  AddRentalCloths, 
  GetAllRental, 
  UpdateRentalCloths,
  GetRentalById,
  ReturnCloth,
  RequestCloth,
  PhotoPrivew 
} from './reducers/rentalReducer';

import {
  AddCategory,
  GetAllCategory
} from "./reducers/categoryReducer";

import { RentalReprot } from './reducers/RentalReportReducer'; 

const rootReducer = combineReducers({
  unifiedLogin: unifiedLoginReducer,
  customerList: GetAllCustomers,
  customerDetails: GetCustomerByID,
  customerAdd: AddCustomer,
  customerSearch: SearchCustomersByEmail,
  customersUpdate: UpdateCustomerDetails,

  tailorList: GetAllTailors,
  tailorDetails: GetTailorsByID,
  tailorsUpdate:UpdateTailorDetails,
  tailorAdd: AddTailors,
  
  auth: authReducer,
  adminLogin: adminLoginReducer,
  
  assingTailor: AssingTailor,
  getAllAssignment: GetAllAssignment,
  assignmentStatusUpdate: AssingmentStatusUpdate,

  adminsList: GetAllAdmins,
  adminAdd: AddAdmin,
  
  garmentTypeList: GetAllGarmentType,
  garmentTypeAdd: AddGarmentType,
  garmentTypeUpdate:UpdateGarmentType,
  InactiveGarmentType:GetAllInactiveGarmentType,

  fabricTypeList: GetAllFabricType,
  fabricTypeAdd: AddFabricType,
  fabricTypeUpdate:UpdateFabricType,
  InactiveFabricTypeData:GetAllInavctiveFabricType,
  getFabTypePresentage:GetFabTypePresentage,

  getMeasurementsByCustomerId: GetMeasurementsByCustomerId,
  measurementAdd: AddMeasurement,
  measurementUpdate: UpdateMeasurement,
  getAllMeasurements: GetAllMeasurements,
  getMeasurementByOrderId:GetMeasurementByOrderId,

  orderList: GetOrders,
  addOrder: AddOrder,
  orderItemAdd: AddOrderItem,
  orderItemsGet: GetOrderItems, 
  updateStatusOrder: UpdateStatusOrder,
  updateStatusOrderItem: UpdateStatusOrderItem,
  getOrderItemByID:GetOrderItemByID,
  payAdvance: PayAdvance,

  getAllPayment:GetAllPayment,
  addPayment:AddPayment, 
  getPaymentByOrderID:GetPaymentByOrderID,
  getOrderPending:GetOrderPending,

  report: Report,  
  rentalReport: RentalReprot,

  addRental: AddRentalCloths,
  getAllRental: GetAllRental,
  updateRental: UpdateRentalCloths,
  getRentalById: GetRentalById,
  returnCloth: ReturnCloth,
  requestCloth: RequestCloth,
  photoPreview:PhotoPrivew,
  addCategory: AddCategory,
  getAllCategory: GetAllCategory,

});

const middleware = [thunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;