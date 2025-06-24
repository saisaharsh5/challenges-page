import React, { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSectionContent } from '../hooks/useSectionContent';
import toast from 'react-hot-toast';

interface EditableSectionHeaderProps {
  sectionKey: string;
  defaultTitle: string;
  defaultDescription: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
  children?: React.ReactNode;
}

export const EditableSectionHeader: React.FC<EditableSectionHeaderProps> = ({
  sectionKey,
  defaultTitle,
  defaultDescription,
  icon,
  gradientFrom,
  gradientTo,
  iconColor,
  children
}) => {
  const { user } = useAuth();
  const { content, updateContent, loading } = useSectionContent(sectionKey);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const displayTitle = content?.title || defaultTitle;
  const displayDescription = content?.description || defaultDescription;

  const handleEdit = () => {
    setEditTitle(displayTitle);
    setEditDescription(displayDescription);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      toast.error('Title and description cannot be empty');
      return;
    }

    setSaving(true);
    const success = await updateContent({
      title: editTitle.trim(),
      description: editDescription.trim()
    });

    if (success) {
      toast.success('Section updated successfully');
      setIsEditing(false);
    } else {
      toast.error('Failed to update section');
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditDescription('');
  };

  if (loading) {
    return (
      <div className="flex justify-between items-center mb-16">
        <div className="space-y-4 flex-1">
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl border border-opacity-30`}>
              {icon}
            </div>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mb-16">
      <div className="space-y-4 flex-1">
        <div className="flex items-center space-x-4">
          <div className={`p-3 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl border border-opacity-30`}>
            {icon}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-4xl font-mono font-bold bg-gray-800 border border-terminal-green rounded px-3 py-2 text-white w-full max-w-2xl"
                  placeholder="Section title..."
                  disabled={saving}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="text-gray-400 font-mono text-lg bg-gray-800 border border-terminal-green rounded px-3 py-2 w-full max-w-3xl resize-none"
                  rows={2}
                  placeholder="Section description..."
                  disabled={saving}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={saving || !editTitle.trim() || !editDescription.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-terminal-green text-black rounded-lg hover:bg-terminal-green/80 transition-colors font-mono font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors font-mono"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="group relative">
                <h2 className="text-4xl font-mono font-bold text-white">
                  {displayTitle}
                </h2>
                <p className="text-gray-400 font-mono text-lg mt-2">
                  {displayDescription}
                </p>
                {user && (
                  <button
                    onClick={handleEdit}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-gray-800 hover:bg-gray-700 text-terminal-green hover:text-white rounded-full border border-gray-600 hover:border-terminal-green"
                    title="Edit section"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className={`w-24 h-1 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full`}></div>
      </div>
      
      {children && !isEditing && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};