import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useStaticContent } from '../hooks/useStaticContent';
import toast from 'react-hot-toast';

interface EditableTextProps {
  contentKey: string;
  defaultText: string;
  className?: string;
  placeholder?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  defaultText,
  className = '',
  placeholder = 'Click to edit...'
}) => {
  const { user } = useAuth();
  const { content, updateContent, loading } = useStaticContent(contentKey);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const displayText = content || defaultText;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (!user) return;
    setEditValue(displayText);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editValue !== displayText) {
      const success = await updateContent(editValue);
      if (success) {
        toast.success('Content updated successfully');
      } else {
        toast.error('Failed to update content');
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  if (loading) {
    return <div className={`${className} animate-pulse bg-gray-800`}>Loading...</div>;
  }

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${className} bg-gray-800 border border-terminal-green rounded px-2 py-1 resize-none min-h-[100px]`}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div
      className={`${className} ${user ? 'cursor-pointer hover:bg-gray-800 hover:border border-dashed border-terminal-green/50 rounded px-1 transition-all duration-200' : ''}`}
      onClick={handleEdit}
      title={user ? 'Click to edit' : ''}
    >
      {displayText || placeholder}
    </div>
  );
};