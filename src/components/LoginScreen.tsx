import { useMsal } from "@azure/msal-react"
import { Building2, Shield } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { loginRequest } from '../authConfig'
import { useAuthStore } from "../store/AuthStore"
import { Button } from './modern/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './modern/Card'


export function LoginScreen() {
  const [isLoading] = useState(false)

  const { instance } = useMsal();
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleMicrosoftLogin = async () => {
    try {
      // Interactive login
      const loginResponse = await instance.loginPopup(loginRequest);
      const account = loginResponse.account;

      // Silent token acquisition for API access
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      const { accessToken, account: tokenAccount, idTokenClaims } = response;
      const payload = JSON.parse(atob(response?.accessToken?.split(".")[1]));
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
        navigate("/layout");
    } catch (err) {
      console.warn("Login or silent token acquisition failed, redirecting to Landing", err);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary-solid/20 to-secondary-solid/20 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-accent-solid/20 to-primary-solid/20 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card variant="glass" className="overflow-hidden">
          <CardHeader className="text-center pb-6">
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to your Legal AI dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Azure AD SSO Button */}
            <Button
              onClick={handleMicrosoftLogin}
              isLoading={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
              size="lg"
            >
              <Shield className="mr-3 h-5 w-5" />
              Continue with Microsoft SSO
            </Button>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white/80 px-4 text-muted font-medium">
                  Or sign in with email
                </span>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <Input
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <Button
                type="submit"
                variant="outline"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form> */}

            <div className="text-center space-y-2">
              <p className="text-xs text-muted">
                Protected by Microsoft Azure AD
              </p>
              <p className="text-xs text-muted-light">
                company.acadiahealthcare.com
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}