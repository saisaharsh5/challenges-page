import React, { useState, useEffect } from 'react';
import { Plus, Trophy, Medal, Crown, Star, Users, Calendar } from 'lucide-react';
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
    if (ranking <= 3) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    if (ranking <= 10) return 'bg-gradient-to-r from-gray-400 to-gray-500';
    if (ranking <= 50) return 'bg-gradient-to-r from-orange-500 to-red-500';
    return 'bg-gradient-to-r from-gray-600 to-gray-700';
  };

  const getRankingIcon = (ranking: number) => {
    if (ranking === 1) return <Crown className="h-4 w-4" />;
    if (ranking <= 3) return <Medal className="h-4 w-4" />;
    if (ranking <= 10) return <Star className="h-4 w-4" />;
    return <Trophy className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTopRankings = () => challenges.filter(c => c.my_ranking <= 10).length;
  const getAverageRanking = () => {
    if (challenges.length === 0) return 0;
    return Math.round(challenges.reduce((sum, c) => sum + c.my_ranking, 0) / challenges.length);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex justify-between items-center mb-16">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                <Trophy className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-4xl font-mono font-bold text-white">
                  CTF Challenges
                </h2>
                <p className="text-gray-400 font-mono text-lg mt-2">
                  Competitive cybersecurity challenges and tournament results
                </p>
              </div>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
          </div>
          
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 text-yellow-400 border border-yellow-500/30 hover:border-yellow-500/50 rounded-xl transition-all duration-300 font-mono font-medium group"
            >
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Challenge</span>
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Trophy className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-2xl font-mono font-bold text-white">{challenges.length}</p>
                <p className="text-sm text-gray-400 font-mono">Total Challenges</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-2xl font-mono font-bold text-white">{getTopRankings()}</p>
                <p className="text-sm text-gray-400 font-mono">Top 10 Finishes</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Star className="h-6 w-6 text-orange-400" />
              <div>
                <p className="text-2xl font-mono font-bold text-white">{getAverageRanking()}</p>
                <p className="text-sm text-gray-400 font-mono">Average Ranking</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-red-400" />
              <div>
                <p className="text-2xl font-mono font-bold text-white">
                  {new Set(challenges.map(c => c.event_name)).size}
                </p>
                <p className="text-sm text-gray-400 font-mono">Events Participated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges grid */}
        {challenges.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-mono font-semibold text-gray-400 mb-2">No Challenges Yet</h3>
              <p className="text-gray-500 font-mono text-sm">
                Start competing in CTF events and add your achievements here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.map((challenge) => (
              <AchievementCard
                key={challenge.id}
                title={challenge.challenge_title}
                description={`${challenge.event_name} - ${challenge.category}`}
                badge={`#${challenge.my_ranking}`}
                badgeColor={getRankingColor(challenge.my_ranking)}
                category="CTF Competition"
                date={formatDate(challenge.created_at)}
                onEdit={user ? () => handleEdit(challenge) : undefined}
                onDelete={user ? () => handleDelete(challenge.id) : undefined}
              >
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <div className="flex items-center space-x-2">
                    {getRankingIcon(challenge.my_ranking)}
                    <span className="font-mono">Rank #{challenge.my_ranking}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-mono">{challenge.event_name}</span>
                  </div>
                </div>
              </AchievementCard>
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
          title={editingChallenge ? 'Edit CTF Challenge' : 'Add CTF Challenge'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Event Name
              </label>
              <input
                type="text"
                value={formData.event_name}
                onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-terminal-green transition-colors font-mono"
                required
                placeholder="e.g., PicoCTF 2023"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-terminal-green transition-colors font-mono"
                required
                placeholder="e.g., Web Exploitation Challenge"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-terminal-green transition-colors font-mono"
                placeholder="e.g., Web, Crypto, Pwn, Reverse, Forensics"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-terminal-green transition-colors font-mono"
                min="1"
                required
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
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-lg hover:from-yellow-500/80 hover:to-orange-500/80 transition-all duration-300 font-mono font-medium"
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