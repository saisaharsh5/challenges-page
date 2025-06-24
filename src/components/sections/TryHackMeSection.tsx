import React, { useState, useEffect } from 'react';
import { Plus, Shield, Clock, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { TryHackMeRoom } from '../../types';
import { AchievementCard } from '../AchievementCard';
import { LoadingSpinner } from '../LoadingSpinner';
import { Modal } from '../Modal';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export const TryHackMeSection: React.FC = () => {
  const [rooms, setRooms] = useState<TryHackMeRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<TryHackMeRoom | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy' as const,
    url: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('tryhackme_rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load TryHackMe rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRoom) {
        const { error } = await supabase
          .from('tryhackme_rooms')
          .update(formData)
          .eq('id', editingRoom.id);
        
        if (error) throw error;
        toast.success('Room updated successfully');
      } else {
        const { error } = await supabase
          .from('tryhackme_rooms')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('Room added successfully');
      }
      
      fetchRooms();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error('Failed to save room');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    
    try {
      const { error } = await supabase
        .from('tryhackme_rooms')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Room deleted successfully');
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
    }
  };

  const handleEdit = (room: TryHackMeRoom) => {
    setEditingRoom(room);
    setFormData({
      title: room.title,
      description: room.description,
      difficulty: room.difficulty,
      url: room.url
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'Easy',
      url: ''
    });
    setEditingRoom(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'Medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'Hard': return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'Insane': return 'bg-gradient-to-r from-purple-500 to-indigo-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terminal-green/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex justify-between items-center mb-16">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-4xl font-mono font-bold text-white">
                  TryHackMe Rooms
                </h2>
                <p className="text-gray-400 font-mono text-lg mt-2">
                  Hands-on cybersecurity challenges and learning paths
                </p>
              </div>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
          </div>
          
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-terminal-green/20 to-blue-500/20 hover:from-terminal-green/30 hover:to-blue-500/30 text-terminal-green border border-terminal-green/30 hover:border-terminal-green/50 rounded-xl transition-all duration-300 font-mono font-medium group"
            >
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Room</span>
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-2xl font-mono font-bold text-white">{rooms.length}</p>
                <p className="text-sm text-gray-400 font-mono">Rooms Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-2xl font-mono font-bold text-white">
                  {rooms.filter(r => r.difficulty === 'Easy').length}
                </p>
                <p className="text-sm text-gray-400 font-mono">Easy Rooms</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-red-400" />
              <div>
                <p className="text-2xl font-mono font-bold text-white">
                  {rooms.filter(r => ['Hard', 'Insane'].includes(r.difficulty)).length}
                </p>
                <p className="text-sm text-gray-400 font-mono">Advanced Rooms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms grid */}
        {rooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-mono font-semibold text-gray-400 mb-2">No Rooms Yet</h3>
              <p className="text-gray-500 font-mono text-sm">
                Start your TryHackMe journey by adding your first completed room.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <AchievementCard
                key={room.id}
                title={room.title}
                description={room.description}
                badge={room.difficulty}
                badgeColor={getDifficultyColor(room.difficulty)}
                url={room.url}
                category="TryHackMe"
                date={formatDate(room.created_at)}
                onEdit={user ? () => handleEdit(room) : undefined}
                onDelete={user ? () => handleDelete(room.id) : undefined}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingRoom ? 'Edit TryHackMe Room' : 'Add TryHackMe Room'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Room Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-terminal-green transition-colors font-mono"
                required
                placeholder="e.g., Basic Pentesting"
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-terminal-green h-24 resize-none font-mono"
                required
                placeholder="Brief description of what you learned..."
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-terminal-green font-mono"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Insane">Insane</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Room URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-terminal-green font-mono"
                required
                placeholder="https://tryhackme.com/room/..."
              />
            </div>
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="px-6 py-3 text-gray-400 hover:text-white transition-colors font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-terminal-green to-blue-500 text-black rounded-lg hover:from-terminal-green/80 hover:to-blue-500/80 transition-all duration-300 font-mono font-medium"
              >
                {editingRoom ? 'Update' : 'Add'} Room
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </section>
  );
};