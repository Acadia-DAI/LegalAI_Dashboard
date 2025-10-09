export const UI_BASE_URL = window._env_?.REACT_APP_UI_BASE_URL || "http://localhost:5173";
export const CLIENT_ID = window._env_?.CLIENT_ID || "04770079-70a5-45c1-89e4-eb1dde80de6c";
export const TENANT_ID = window._env_?.TENANT_ID || "707e8816-9153-4841-b8eb-17b974748957";

export const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: `${UI_BASE_URL}/blank.html`,
    postLogoutRedirectUri: `${UI_BASE_URL}/blank.html`,
    popupRedirectUri: `${UI_BASE_URL}/blank.html`,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: [`${CLIENT_ID}/.default`],
};
