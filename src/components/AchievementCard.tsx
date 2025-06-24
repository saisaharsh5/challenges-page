import React from 'react';
import { ExternalLink, Edit, Trash2, Calendar, Award, Target, Link as LinkIcon } from 'lucide-react';
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

  // Enhanced URL validation
  const isValidUrl = (urlString: string): boolean => {
    if (!urlString || typeof urlString !== 'string') return false;
    
    const trimmedUrl = urlString.trim();
    if (trimmedUrl.length === 0) return false;
    if (trimmedUrl === 'null' || trimmedUrl === 'undefined') return false;
    if (trimmedUrl.startsWith('your_') || trimmedUrl.includes('placeholder')) return false;
    
    try {
      const url = new URL(trimmedUrl);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const hasValidUrl = url && isValidUrl(url);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!hasValidUrl || !url) {
      console.error('Invalid URL for explore button:', { url, hasValidUrl });
      return;
    }

    const cleanUrl = url.trim();
    console.log('Opening URL:', cleanUrl);
    
    try {
      // Create a temporary anchor element for reliable navigation
      const link = document.createElement('a');
      link.href = cleanUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Temporarily add to DOM and click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Successfully opened URL:', cleanUrl);
    } catch (error) {
      console.error('Error opening URL:', error);
      
      // Fallback: try window.open
      try {
        window.open(cleanUrl, '_blank', 'noopener,noreferrer');
      } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError);
      }
    }
  };

  return (
    <div className="group relative">
      {/* Enhanced glowing border effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-terminal-green/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      
      {/* Main card with improved styling */}
      <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-terminal-green/40 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-terminal-green/10 overflow-hidden">
        
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-terminal-green rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-purple-500 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Header section with improved layout */}
        <div className="relative flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-3">
              {badge && (
                <span className={`inline-flex items-center px-3 py-1 text-xs font-mono font-semibold rounded-full ${badgeColor} text-black shadow-lg border border-black/20`}>
                  <Award className="h-3 w-3 mr-1" />
                  {badge}
                </span>
              )}
              {category && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-700/60 text-gray-300 rounded-md border border-gray-600/50 backdrop-blur-sm">
                  <Target className="h-3 w-3 mr-1" />
                  {category}
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-mono font-bold text-white group-hover:text-terminal-green transition-colors duration-300 leading-tight break-words">
              {title}
            </h3>
          </div>
          
          {/* Admin controls with improved positioning */}
          {user && (
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 ml-4 flex-shrink-0">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-2 bg-gray-800/90 hover:bg-terminal-green/20 text-gray-400 hover:text-terminal-green rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-600/30 hover:border-terminal-green/50 shadow-lg"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-2 bg-gray-800/90 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-600/30 hover:border-red-500/50 shadow-lg"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Description with improved typography */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4 font-mono break-words">
          {description}
        </p>

        {/* Custom children content */}
        {children && (
          <div className="mb-4">
            {children}
          </div>
        )}

        {/* Enhanced footer section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
          {/* Date with improved styling */}
          {date && (
            <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
              <Calendar className="h-3 w-3 text-gray-500" />
              <span>{date}</span>
            </div>
          )}
          
          {/* Action button with enhanced design */}
          <div className="flex items-center space-x-2">
            {hasValidUrl ? (
              <button
                onClick={handleExploreClick}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-terminal-green/15 to-blue-500/15 hover:from-terminal-green/25 hover:to-blue-500/25 text-terminal-green hover:text-white border border-terminal-green/40 hover:border-terminal-green/60 rounded-lg transition-all duration-300 text-sm font-mono font-medium group/link cursor-pointer shadow-lg backdrop-blur-sm hover:shadow-terminal-green/20"
                title={`Open: ${url}`}
              >
                <LinkIcon className="h-4 w-4" />
                <span>Explore</span>
                <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
              </button>
            ) : user ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-600/15 to-gray-500/15 hover:from-gray-600/25 hover:to-gray-500/25 text-gray-400 hover:text-gray-300 border border-gray-600/40 hover:border-gray-500/60 rounded-lg transition-all duration-300 text-sm font-mono font-medium shadow-lg backdrop-blur-sm"
                title="Add URL"
              >
                <Edit className="h-4 w-4" />
                <span>Add URL</span>
              </button>
            ) : (
              <div className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-700/15 to-gray-600/15 text-gray-500 border border-gray-700/40 rounded-lg text-sm font-mono font-medium shadow-lg backdrop-blur-sm">
                <span>No URL</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-terminal-green/3 via-transparent to-blue-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl pointer-events-none"></div>
        
        {/* Subtle animated border */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-xl border border-terminal-green/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};