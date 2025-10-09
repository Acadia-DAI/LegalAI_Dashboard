// export const API_BASE_URL =   "https://legalai-f3gjbmbhchh2g3g5.eastus-01.azurewebsites.net"
export const API_BASE_URL = window._env_?.REACT_APP_API_BASE_URL || "http://localhost:8000";
export const SUPPORT_EMAIL = "Acadia_AI@acadiahealthcare.com"
console.log(API_BASE_URL)