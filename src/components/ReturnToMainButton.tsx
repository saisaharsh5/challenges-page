import React, { useState, useEffect } from 'react';
import { Home, Edit, Trash2, ExternalLink, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Modal } from './Modal';
import toast from 'react-hot-toast';

export const ReturnToMainButton: React.FC = () => {
  const { user } = useAuth();
  const [redirectUrl, setRedirectUrl] = useState('/');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRedirectUrl();
  }, []);

  const fetchRedirectUrl = async () => {
    try {
      const { data, error } = await supabase
        .from('static_content')
        .select('content')
        .eq('key', 'return_button_url')
        .maybeSingle();

      if (error) {
        console.error('Error fetching redirect URL:', error);
        return;
      }

      setRedirectUrl(data?.content || '/');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReturnToMain = () => {
    if (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')) {
      // External URL - open in new tab
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Internal URL - navigate directly
      window.location.href = redirectUrl;
    }
  };

  const handleEdit = () => {
    setEditUrl(redirectUrl);
    setIsEditModalOpen(true);
  };

  const handleSaveUrl = async () => {
    if (!editUrl.trim()) {
      toast.error('URL cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('static_content')
        .upsert({ 
          key: 'return_button_url', 
          content: editUrl.trim() 
        }, { onConflict: 'key' });

      if (error) throw error;

      setRedirectUrl(editUrl.trim());
      setIsEditModalOpen(false);
      toast.success('Return button URL updated successfully');
    } catch (error) {
      console.error('Error updating URL:', error);
      toast.error('Failed to update URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to reset the return button URL to default (/)?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('static_content')
        .delete()
        .eq('key', 'return_button_url');

      if (error) throw error;

      setRedirectUrl('/');
      toast.success('Return button URL reset to default');
    } catch (error) {
      console.error('Error resetting URL:', error);
      toast.error('Failed to reset URL');
    } finally {
      setLoading(false);
    }
  };

  const isExternalUrl = redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://');

  return (
    <>
      <section className="py-12 bg-gray-900 border-t border-terminal-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative inline-block group">
            {/* Main Return Button - Visible to ALL users */}
            <button
              onClick={handleReturnToMain}
              className="inline-flex items-center space-x-3 px-6 py-3 rounded-lg bg-blue-900/20 hover:bg-blue-900/40 text-blue-400 hover:text-blue-300 transition-all duration-300 border border-blue-500/30 font-mono text-lg hover:scale-105 transform"
              title={`Navigate to: ${redirectUrl}`}
            >
              <Home className="h-5 w-5" />
              <span>Return to Main Page</span>
              {isExternalUrl && <ExternalLink className="h-4 w-4" />}
            </button>

            {/* Admin Controls - Only visible to authenticated admin users */}
            {user && (
              <div className="absolute -top-2 -right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={handleEdit}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 text-terminal-green hover:text-white rounded-full border border-gray-600 hover:border-terminal-green transition-all duration-200"
                  title="Edit redirect URL"
                >
                  <Edit className="h-3 w-3" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 text-red-400 hover:text-red-300 rounded-full border border-gray-600 hover:border-red-400 transition-all duration-200"
                  title="Reset to default URL"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-500 font-mono text-sm mt-3">
            {isExternalUrl ? 'Opens in new tab' : 'Navigate within site'}
          </p>
          
          {user && (
            <p className="text-gray-600 font-mono text-xs mt-1">
              Current URL: <span className="text-blue-400">{redirectUrl}</span>
            </p>
          )}
        </div>
      </section>

      {/* Edit URL Modal - Only accessible to admin users */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditUrl('');
        }}
        title="Edit Return Button URL"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">
              Redirect URL
            </label>
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-terminal-green font-mono"
              placeholder="Enter URL (e.g., / or https://example.com)"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 font-mono mt-2">
              Use "/" for homepage, or full URL for external sites
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditUrl('');
              }}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors font-mono"
              disabled={loading}
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSaveUrl}
              disabled={loading || !editUrl.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-terminal-green text-black rounded-md hover:bg-terminal-green/80 transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save URL</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};