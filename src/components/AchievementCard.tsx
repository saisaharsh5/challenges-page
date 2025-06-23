import React from 'react';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AchievementCardProps {
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  url?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  badge,
  badgeColor = 'bg-terminal-green',
  url,
  onEdit,
  onDelete,
  children
}) => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-terminal-green/50 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-mono font-semibold text-white group-hover:text-terminal-green transition-colors">
          {title}
        </h3>
        {user && (
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1 text-gray-400 hover:text-terminal-green transition-colors"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {badge && (
        <span className={`inline-block px-2 py-1 text-xs font-mono rounded ${badgeColor} text-black mb-3`}>
          {badge}
        </span>
      )}
      
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{description}</p>
      
      {children}
      
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-terminal-green hover:text-white transition-colors text-sm font-mono"
        >
          <span>View Details</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
};