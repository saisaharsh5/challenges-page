import React, { useState, useEffect } from 'react';
import { Plus, Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CTFChallenge } from '../../types';
import { AchievementCard } from '../AchievementCard';
import { LoadingSpinner } from '../LoadingSpinner';
import { Modal } from '../Modal';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export const CTFSection: React.FC = () => {
  const [challenges, setChallenges] = useState<CTFChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<CTFChallenge | null>(null);
  const [formData, setFormData] = useState({
    event_name: '',
    challenge_title: '',
    category: '',
    my_ranking: 1
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('ctf_challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast.error('Failed to load CTF challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingChallenge) {
        const { error } = await supabase
          .from('ctf_challenges')
          .update(formData)
          .eq('id', editingChallenge.id);
        
        if (error) throw error;
        toast.success('Challenge updated successfully');
      } else {
        const { error } = await supabase
          .from('ctf_challenges')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('Challenge added successfully');
      }
      
      fetchChallenges();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving challenge:', error);
      toast.error('Failed to save challenge');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;
    
    try {
      const { error } = await supabase
        .from('ctf_challenges')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Challenge deleted successfully');
      fetchChallenges();
    } catch (error) {
      console.error('Error deleting challenge:', error);
      toast.error('Failed to delete challenge');
    }
  };

  const handleEdit = (challenge: CTFChallenge) => {
    setEditingChallenge(challenge);
    setFormData({
      event_name: challenge.event_name,
      challenge_title: challenge.challenge_title,
      category: challenge.category,
      my_ranking: challenge.my_ranking
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      event_name: '',
      challenge_title: '',
      category: '',
      my_ranking: 1
    });
    setEditingChallenge(null);
  };

  const getRankingColor = (ranking: number) => {
    if (ranking <= 3) return 'bg-yellow-500';
    if (ranking <= 10) return 'bg-gray-400';
    if (ranking <= 50) return 'bg-orange-600';
    return 'bg-gray-600';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-mono font-bold text-white mb-4">
              CTF Challenges
            </h2>
            <div className="w-20 h-1 bg-terminal-green"></div>
          </div>
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-terminal-green text-black rounded-md hover:bg-terminal-green/80 transition-colors font-mono"
            >
              <Plus className="h-5 w-5" />
              <span>Add Challenge</span>
            </button>
          )}
        </div>

        {challenges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-mono">No CTF challenges added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <AchievementCard
                key={challenge.id}
                title={challenge.challenge_title}
                description={`${challenge.event_name} - ${challenge.category}`}
                badge={`#${challenge.my_ranking}`}
                badgeColor={getRankingColor(challenge.my_ranking)}
                onEdit={user ? () => handleEdit(challenge) : undefined}
                onDelete={user ? () => handleDelete(challenge.id) : undefined}
              >
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                  <Trophy className="h-4 w-4" />
                  <span className="font-mono">Rank #{challenge.my_ranking}</span>
                </div>
              </AchievementCard>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingChallenge ? 'Edit CTF Challenge' : 'Add CTF Challenge'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Event Name
              </label>
              <input
                type="text"
                value={formData.event_name}
                onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-terminal-green"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Challenge Title
              </label>
              <input
                type="text"
                value={formData.challenge_title}
                onChange={(e) => setFormData({ ...formData, challenge_title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-terminal-green"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-terminal-green"
                placeholder="e.g., Web, Crypto, Pwn, Reverse"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                My Ranking
              </label>
              <input
                type="number"
                value={formData.my_ranking}
                onChange={(e) => setFormData({ ...formData, my_ranking: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-terminal-green"
                min="1"
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
                {editingChallenge ? 'Update' : 'Add'} Challenge
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </section>
  );
};