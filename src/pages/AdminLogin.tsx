import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, User, Lock, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();

  // Force clear any existing session when login page loads
  useEffect(() => {
    const initializeLoginPage = async () => {
      try {
        // Force sign out any existing session
        await signOut();
        
        // Clear form
        setEmail('');
        setPassword('');
        setShowPassword(false);
        setShowSetupInstructions(false);
        
        console.log('Login page initialized - session cleared');
      } catch (error) {
        console.error('Error initializing login page:', error);
      }
    };

    initializeLoginPage();
  }, [signOut]);

  // Only redirect if user is actually authenticated and has email
  if (user && user.email && user.aud === 'authenticated') {
    return <Navigate to="/admin" replace />;
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        console.error('Login error:', error);
        
        // Handle different types of authentication errors
        if (error.message.includes('Invalid login credentials') || 
            error.message.includes('invalid_credentials') ||
            error.message.includes('Email not confirmed')) {
          toast.error('Admin user not found or not verified. Please set up the admin user first.');
          setShowSetupInstructions(true);
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email address in Supabase dashboard');
          setShowSetupInstructions(true);
        } else {
          toast.error(`Authentication failed: ${error.message}`);
          setShowSetupInstructions(true);
        }
      } else {
        toast.success('Login successful!');
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Login exception:', error);
      toast.error('Authentication system error. Please check your setup.');
      setShowSetupInstructions(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900 border border-terminal-green/30 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-terminal-green mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl font-mono font-bold text-white">Admin Access</h1>
            <p className="text-gray-400 font-mono text-sm mt-2">
              <span className="text-terminal-green">{'>'}</span> Secure login required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                <User className="inline h-4 w-4 mr-2" />
                Email/Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-terminal-green transition-colors font-mono"
                required
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                <Lock className="inline h-4 w-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-terminal-green transition-colors font-mono pr-12"
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-terminal-green transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terminal-green text-black py-3 rounded-md font-mono font-semibold hover:bg-terminal-green/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Access Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {showSetupInstructions && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-md">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-mono text-red-400 font-semibold mb-2">
                    Admin User Setup Required
                  </h4>
                  <p className="text-xs text-gray-300 font-mono mb-3">
                    The admin user doesn't exist in your Supabase authentication. Follow these steps:
                  </p>
                  <ol className="text-xs text-gray-400 font-mono space-y-1 list-decimal list-inside mb-4">
                    <li>Open your Supabase project dashboard</li>
                    <li>Go to Authentication → Users</li>
                    <li>Click "Add user" or "Invite user"</li>
                    <li>Enter email: <span className="text-terminal-green">saisaharsh@saharsh.net</span></li>
                    <li>Enter password: <span className="text-terminal-green">saharsh@23062003.sai</span></li>
                    <li>Make sure "Auto Confirm User" is checked</li>
                    <li>Click "Send invitation" or "Create user"</li>
                    <li>If email confirmation is required, confirm the user manually</li>
                  </ol>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                      className="inline-flex items-center justify-center space-x-2 text-xs bg-terminal-green text-black px-3 py-2 rounded hover:bg-terminal-green/80 transition-colors font-mono"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Open Supabase Dashboard</span>
                    </button>
                    <button
                      onClick={() => setShowSetupInstructions(false)}
                      className="text-xs text-gray-400 hover:text-gray-300 transition-colors font-mono"
                    >
                      Hide instructions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};