import { getRegisters, getReports } from "./data";

export const API_KEY = '';
export const BASE_URL = process.env.REACT_APP_BASE_URL;

export const endpoints = {
  // Auth
  register: `${BASE_URL}/api/auth/admin/register`,
  login: `${BASE_URL}/api/auth/admin/login`,

  // Data
  getReports: `${BASE_URL}/api/admin/reports`,
  updateReport: `${BASE_URL}/api/admin/reports`,
  getOldReports: `${BASE_URL}/api/admin/old-reports`,
  getOldSymptoms: `${BASE_URL}/api/admin/old-symptoms`,
  getBarangayReports: `${BASE_URL}/api/admin/barangay-reports`,
  getRegisters: `${BASE_URL}/api/admin/registers`,
  getAccounts: `${BASE_URL}/api/admin/accounts`,
  deleteAccount: `${BASE_URL}/api/admin/accounts`,
  postSymptom: `${BASE_URL}/api/admin/symptom`,
  updateSymptom: `${BASE_URL}/api/admin/symptom`,
  getSymptom: `${BASE_URL}/api/admin/symptom`,
  deleteSymptom: `${BASE_URL}/api/admin/symptom`,
  getOldSymptom: `${BASE_URL}/api/admin/old-symptom`,
  updateStatus: `${BASE_URL}/api/admin/status`,
  displayStatus: `${BASE_URL}/api/admin/status`,

  // Dashboard
  getTotals: `${BASE_URL}/api/total/dashboard`,
  getHistoricalSymptoms: `${BASE_URL}/api/total/old`,
  getThreshold: `${BASE_URL}/api/total/threshold`,
};