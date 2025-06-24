import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Settings, LogOut, Home } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-gray-900 border-b border-terminal-green/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 group">
            <Shield className="h-8 w-8 text-terminal-green group-hover:animate-pulse" />
            <span className="text-xl font-mono font-bold text-white group-hover:text-terminal-green transition-colors">
              CyberSec Portfolio
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Home button - Always visible */}
            <Link
              to="/"
              className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-blue-400 hover:text-white transition-all duration-200"
            >
              <Home className="h-4 w-4" />
              <span className="font-mono">Home</span>
            </Link>

            {/* Admin-specific buttons - Only visible when authenticated */}
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-terminal-green hover:text-white transition-all duration-200"
                >
                  <Settings className="h-4 w-4" />
                  <span className="font-mono">Admin</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-mono">Logout</span>
                </button>
              </>
            ) : (
              /* Admin Login button - Only visible when NOT authenticated */
              <Link
                to="/admin/login"
                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-terminal-green/10 hover:bg-terminal-green/20 text-terminal-green hover:text-white transition-all duration-200 border border-terminal-green/30"
              >
                <Shield className="h-4 w-4" />
                <span className="font-mono">Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};