import React from 'react';
import { ExternalLink, Edit, Trash2, Calendar, Award, Target } from 'lucide-react';
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
  category?: string;
  date?: string;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  badge,
  badgeColor = 'bg-terminal-green',
  url,
  onEdit,
  onDelete,
  children,
  category,
  date
}) => {
  const { user } = useAuth();

  // Check if URL is valid (not empty, null, or just whitespace)
  const hasValidUrl = url && url.trim() !== '' && url.trim() !== 'undefined' && url.trim() !== 'null';

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!hasValidUrl) {
      console.log('No valid URL available');
      return;
    }

    const cleanUrl = url!.trim();
    console.log('Opening URL:', cleanUrl);
    
    try {
      // Ensure URL has protocol
      let finalUrl = cleanUrl;
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        finalUrl = `https://${cleanUrl}`;
      }
      
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <div className="group relative">
      {/* Glowing border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-terminal-green/20 via-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
      
      {/* Main card */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6 hover:border-terminal-green/30 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-terminal-green/10 overflow-hidden">
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-terminal-green rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        {/* Header section */}
        <div className="relative flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              {badge && (
                <span className={`inline-flex items-center px-3 py-1 text-xs font-mono font-semibold rounded-full ${badgeColor} text-black shadow-lg`}>
                  <Award className="h-3 w-3 mr-1" />
                  {badge}
                </span>
              )}
              {category && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-700/50 text-gray-300 rounded-md border border-gray-600/50">
                  <Target className="h-3 w-3 mr-1" />
                  {category}
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-mono font-bold text-white group-hover:text-terminal-green transition-colors duration-300 leading-tight">
              {title}
            </h3>
          </div>
          
          {/* Admin controls */}
          {user && (
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 bg-gray-800/80 hover:bg-terminal-green/20 text-gray-400 hover:text-terminal-green rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-600/30 hover:border-terminal-green/50"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-2 bg-gray-800/80 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-600/30 hover:border-red-500/50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4 font-mono">
          {description}
        </p>

        {/* Custom children content */}
        {children && (
          <div className="mb-4">
            {children}
          </div>
        )}

        {/* Footer section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
          {/* Date */}
          {date && (
            <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
              <Calendar className="h-3 w-3" />
              <span>{date}</span>
            </div>
          )}
          
          {/* Action button */}
          <div className="flex items-center space-x-2">
            {hasValidUrl ? (
              <button
                onClick={handleExploreClick}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-terminal-green/10 to-blue-500/10 hover:from-terminal-green/20 hover:to-blue-500/20 text-terminal-green hover:text-white border border-terminal-green/30 hover:border-terminal-green/50 rounded-lg transition-all duration-300 text-sm font-mono font-medium group/link cursor-pointer"
                title={`Open: ${url}`}
              >
                <span>Explore</span>
                <ExternalLink className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
              </button>
            ) : user ? (
              <button
                onClick={onEdit}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-600/10 to-gray-500/10 hover:from-gray-600/20 hover:to-gray-500/20 text-gray-400 hover:text-gray-300 border border-gray-600/30 hover:border-gray-500/50 rounded-lg transition-all duration-300 text-sm font-mono font-medium"
                title="Add URL"
              >
                <span>Add URL</span>
                <Edit className="h-4 w-4" />
              </button>
            ) : (
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700/10 to-gray-600/10 text-gray-500 border border-gray-700/30 rounded-lg text-sm font-mono font-medium">
                <span>No URL</span>
              </div>
            )}
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-terminal-green/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"></div>
      </div>
    </div>
  );
};