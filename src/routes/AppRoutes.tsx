import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LoginScreen } from '../components/LoginScreen';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../components/NotFound';
import Layout from '../components/Layout';

const AppRoutes = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/layout" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#0f172a',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
            closeButton: true,
          }}
        />
    </>
  );
};

export default AppRoutes;