import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
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
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      case 'Insane': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-mono font-bold text-white mb-4">
              TryHackMe Rooms
            </h2>
            <div className="w-20 h-1 bg-terminal-green"></div>
          </div>
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-terminal-green text-black rounded-md hover:bg-terminal-green/80 transition-colors font-mono"
            >
              <Plus className="h-5 w-5" />
              <span>Add Room</span>
            </button>
          )}
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-mono">No TryHackMe rooms added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <AchievementCard
                key={room.id}
                title={room.title}
                description={room.description}
                badge={room.difficulty}
                badgeColor={getDifficultyColor(room.difficulty)}
                url={room.url}
                onEdit={user ? () => handleEdit(room) : undefined}
                onDelete={user ? () => handleDelete(room.id) : undefined}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingRoom ? 'Edit TryHackMe Room' : 'Add TryHackMe Room'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Room Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-terminal-green"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-terminal-green h-24 resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-terminal-green"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Insane">Insane</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-terminal-green"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-terminal-green text-black rounded-md hover:bg-terminal-green/80 transition-colors font-mono"
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