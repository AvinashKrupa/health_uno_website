import axios from 'axios';
import instance from './Interceptor';
import qs from 'qs';

export const API = {
  SENDOTP: 'auth/sendOtp',
  VERIFYOTP: 'auth/verifyOtp',
  REGISTERPATIENT: 'auth/registerPatient',
  GETCOUNTRY: 'country',
  GETCITY: 'city',
  GETSTATE: 'state',
  GETHOMECONTENT: 'patient/homeContent',
  GETTOPCONSULTANT: 'patient/getTopConsultants',
  GETLANGUAGE: 'languages',
  FILEUPLOAD: 'fileUpload',
  GETPROFILE: 'user/profile',
  UPDATEPROFILE: 'user/updateProfile',
  GETDEPARTMENTS: 'departments',
  GETSPECIALITIES: 'specialities',
  GETQUALIFICATIONS: 'qualifications',
  GETSLOTS: 'slot/getSlots',
  REGISTERDOCTOR: 'auth/registerDoctor',
  GETDOCTORDETAILS: 'doctor/getDoctorDetails',
  GETAVAILABLESLOT :'slot/getAvailableSlots',
  BOOKAPPOINTMENT: 'patient/bookAppointment',
  CONFIRMPAYENT: 'transaction/confirmPayment',
  GETAPPOINTMENTS: 'patient/getAppointments',
};

export function post(endPoint, params, isStringfy = true) {
  return instance.post(
    endPoint,
    isStringfy ? JSON.stringify(params) : qs.stringify(params),
  );
}

export function get(endPoint) {
  return instance.get(endPoint);
}

export function deleteCall(endPoint) {
  return instance.delete(endPoint);
}

export function putCall(endPoint, params) {
  return instance.put(endPoint, params);
}
