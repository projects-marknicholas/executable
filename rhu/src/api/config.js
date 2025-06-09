export const API_KEY = '';
export const BASE_URL = process.env.REACT_APP_BASE_URL;

export const endpoints = {
  // Auth
  register: `${BASE_URL}/api/auth/register`,
  login: `${BASE_URL}/api/auth/login`,
  forgotPassword: `${BASE_URL}/api/auth/forgot-password`,
  resetPassword: `${BASE_URL}/api/auth/reset-password`,

  // Data
  reportSymptoms: `${BASE_URL}/api/user/symptoms`,
  userSymptoms: `${BASE_URL}/api/user/user-symptoms`,
  getSymptoms: `${BASE_URL}/api/user/symptoms`,
  updateGender: `${BASE_URL}/api/user/gender`,
  updateCategory: `${BASE_URL}/api/user/category`,
  updateAccount: `${BASE_URL}/api/user/account`,
  registers: `${BASE_URL}/api/user/register`,
  registerIndividual: `${BASE_URL}/api/user/register/individual`,
  registerFamily: `${BASE_URL}/api/user/register/family`,
  registerInstitution: `${BASE_URL}/api/user/register/institution`,
};