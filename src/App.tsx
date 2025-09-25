import AppRoutes from './routes/AppRoutes';
import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useAuthStore } from './store/AuthStore';
import { loginRequest } from './authConfig';

function App() {
  const { instance, inProgress } = useMsal();
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);
  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    const rehydrate = async () => {
      if (inProgress !== "none" || token) {
        setRehydrated(true);
        return;
      }

      const account = instance.getAllAccounts()[0];
      if (!account) {
        setRehydrated(true);
        return;
      }

      try {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account,
        });

        const { accessToken, account: tokenAccount, idTokenClaims } = response;
        const payload = JSON.parse(
          atob(response?.accessToken?.split(".")[1])
        );
        const exp = payload.exp;
        const claims = idTokenClaims as { roles?: string[];[key: string]: any };

        login(
          {
            displayName: tokenAccount.name,
            email: tokenAccount.username,
          },
          accessToken,
          claims.roles,
          exp
        );

      } catch (error) {
        console.warn("Rehydration failed", error);
      } finally {
        setRehydrated(true);
      }
    }
    rehydrate();
  }, [instance, inProgress, token, login]);

  if (!rehydrated) return null;

  return <AppRoutes />;
}

export default App;
