import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserAuthError, PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig"

const msalInstance = new PublicClientApplication(msalConfig);

async function startApp() {
  await msalInstance.initialize();
  try {
    await msalInstance.handleRedirectPromise();
  } catch (error) {
    if (
      error instanceof BrowserAuthError &&
      error.errorCode === "no_token_request_cache_error"
    ) {
      console.debug("No redirect to handle in this app.");
    } else {
      throw error;
    }
  }
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </StrictMode>
  );
}

startApp();