import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { supabase } from './lib/supabase';

function App() {
  useEffect(() => {
    // Clear any cached authentication state on app initialization
    const clearAuthState = async () => {
      try {
        // Check if we're on the login page or home page, if so clear any existing sessions
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/admin/login') {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && currentPath === '/admin/login') {
            // If there's a session but user is on login page, clear it
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error('Error clearing auth state:', error);
      }
    };

    clearAuthState();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #00ff41',
              fontFamily: 'monospace',
            },
            success: {
              iconTheme: {
                primary: '#00ff41',
                secondary: '#000',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;