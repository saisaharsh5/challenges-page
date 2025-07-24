import React, { useState, useEffect } from 'react';
import { BarChart3, Database, Shield, Users, HardDrive, Zap, Trophy, Target, Clock, Edit, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EditableText } from '../components/EditableText';
import { TryHackMeSection } from '../components/sections/TryHackMeSection';
import { HackTheBoxSection } from '../components/sections/HackTheBoxSection';
import { CTFSection } from '../components/sections/CTFSection';
import { ReturnToMainButton } from '../components/ReturnToMainButton';
import { useAuth } from '../hooks/useAuth';
import { useStaticContent } from '../hooks/useStaticContent';
import toast from 'react-hot-toast';

interface Stats {
  tryhackme: number;
  hackthebox: number;
  ctf: number;
  total: number;
}

export const HomePage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ tryhackme: 0, hackthebox: 0, ctf: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [isEditingAboutTitle, setIsEditingAboutTitle] = useState(false);
  const [editAboutTitle, setEditAboutTitle] = useState('');
  const [saving, setSaving] = useState(false);
  
  const { user } = useAuth();
  const { content: aboutTitle, updateContent: updateAboutTitle } = useStaticContent('about-title');

  const defaultAboutTitle = "> My Practical World Journey";
  const displayAboutTitle = aboutTitle || defaultAboutTitle;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [tryhackmeResult, hacktheboxResult, ctfResult] = await Promise.all([
        supabase.from('tryhackme_rooms').select('id', { count: 'exact' }),
        supabase.from('hackthebox_machines').select('id', { count: 'exact' }),
        supabase.from('ctf_challenges').select('id', { count: 'exact' })
      ]);

      const tryhackme = tryhackmeResult.count || 0;
      const hackthebox = hacktheboxResult.count || 0;
      const ctf = ctfResult.count || 0;

      setStats({
        tryhackme,
        hackthebox,
        ctf,
        total: tryhackme + hackthebox + ctf
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAboutTitle = () => {
    setEditAboutTitle(displayAboutTitle);
    setIsEditingAboutTitle(true);
  };

  const handleSaveAboutTitle = async () => {
    if (!editAboutTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }

    setSaving(true);
    const success = await updateAboutTitle(editAboutTitle.trim());

    if (success) {
      toast.success('About title updated successfully');
      setIsEditingAboutTitle(false);
    } else {
      toast.error('Failed to update about title');
    }
    setSaving(false);
  };

  const handleCancelAboutTitle = () => {
    setIsEditingAboutTitle(false);
    setEditAboutTitle('');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        {/* Enhanced background effects with green theme */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-terminal-green/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Enhanced hero title with green glow effect */}
            <div className="relative mb-6">
              <div className="absolute inset-0 text-5xl md:text-6xl font-mono font-bold text-terminal-green/20 blur-sm">
                <EditableText
                  contentKey="hero-title"
                  defaultText="> Practical World\n> Portfolio"
                  className="whitespace-pre-line"
                />
              </div>
              <h1 className="relative text-5xl md:text-6xl font-mono font-bold text-transparent bg-gradient-to-r from-terminal-green via-emerald-400 to-green-400 bg-clip-text leading-tight drop-shadow-2xl">
                <EditableText
                  contentKey="hero-title"
                  defaultText="> Practical World\n> Portfolio"
                  className="whitespace-pre-line"
                />
              </h1>
            </div>
            
            <div className="text-xl text-gray-300 leading-relaxed mb-8 backdrop-blur-sm bg-black/20 rounded-lg p-6 border border-terminal-green/20">
              <EditableText
                contentKey="hero-description"
                defaultText="Welcome to my practical world of cybersecurity learning. Explore real-world scenarios through TryHackMe challenges, Hack The Box machines, and CTF competitions. Each hands-on experience in this practical world builds genuine skills through direct application and real-world problem solving."
                className="block"
              />
            </div>
            
            <div className="inline-block">
              <div className="flex items-center space-x-2 text-terminal-green font-mono bg-gray-900/50 backdrop-blur-sm px-6 py-3 rounded-full border border-terminal-green/30 shadow-lg shadow-terminal-green/20">
                <span className="animate-pulse text-xl">█</span>
                <span className="text-lg">Exploring the practical world of cybersecurity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section with green theme */}
      <section className="py-12 bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-terminal-green/30 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-terminal-green/10 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-mono font-bold text-white mb-4">
              <span className="text-terminal-green text-4xl">{'>'}</span> 
              <span className="bg-gradient-to-r from-terminal-green to-emerald-400 bg-clip-text text-transparent ml-2">
                Practical World Progress
              </span>
            </h2>
            <p className="text-gray-400 font-mono">
              Tracking real-world cybersecurity skills through hands-on practical world experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Stats - Enhanced with green theme */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-terminal-green/20 to-emerald-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-terminal-green/50 rounded-xl p-6 hover:border-terminal-green transition-all duration-300 hover:shadow-lg hover:shadow-terminal-green/20">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-terminal-green/20 to-emerald-500/20 rounded-lg border border-terminal-green/30">
                    <BarChart3 className="h-8 w-8 text-terminal-green" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-mono text-gray-400">Total</p>
                    <p className="text-3xl font-mono font-bold text-white group-hover:text-terminal-green transition-colors">
                      {loading ? '...' : stats.total}
                    </p>
                    <p className="text-xs font-mono text-terminal-green font-semibold">Real-World Labs</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* TryHackMe Stats */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
                    <Shield className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-mono text-gray-400">TryHackMe</p>
                    <p className="text-3xl font-mono font-bold text-white group-hover:text-blue-400 transition-colors">
                      {loading ? '...' : stats.tryhackme}
                    </p>
                    <p className="text-xs font-mono text-blue-400 font-semibold">Practical Rooms</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hack The Box Stats */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                    <HardDrive className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-mono text-gray-400">Hack The Box</p>
                    <p className="text-3xl font-mono font-bold text-white group-hover:text-purple-400 transition-colors">
                      {loading ? '...' : stats.hackthebox}
                    </p>
                    <p className="text-xs font-mono text-purple-400 font-semibold">Real Machines</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTF Stats */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                    <Trophy className="h-8 w-8 text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-mono text-gray-400">CTF Events</p>
                    <p className="text-3xl font-mono font-bold text-white group-hover:text-yellow-400 transition-colors">
                      {loading ? '...' : stats.ctf}
                    </p>
                    <p className="text-xs font-mono text-yellow-400 font-semibold">World Challenges</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section className="py-16 bg-gradient-to-b from-black via-gray-900 to-black border-t border-terminal-green/20 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-terminal-green/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative group mb-8">
            {isEditingAboutTitle ? (
              <div className="text-center">
                <input
                  type="text"
                  value={editAboutTitle}
                  onChange={(e) => setEditAboutTitle(e.target.value)}
                  className="text-3xl font-mono font-bold bg-gray-800 border border-terminal-green rounded px-3 py-2 text-white text-center w-full max-w-md"
                  placeholder="About section title..."
                  disabled={saving}
                />
                <div className="flex justify-center space-x-2 mt-4">
                  <button
                    onClick={handleSaveAboutTitle}
                    disabled={saving || !editAboutTitle.trim()}
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
                    onClick={handleCancelAboutTitle}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors font-mono"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <h2 className="text-3xl font-mono font-bold text-center mb-8">
                <span className="bg-gradient-to-r from-terminal-green via-emerald-400 to-green-400 bg-clip-text text-transparent">
                  {displayAboutTitle}
                </span>
                {user && (
                  <button
                    onClick={handleEditAboutTitle}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-gray-800 hover:bg-gray-700 text-terminal-green hover:text-white rounded-full border border-gray-600 hover:border-terminal-green"
                    title="Edit about title"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </h2>
            )}
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-terminal-green/20 to-emerald-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-terminal-green/30 rounded-xl p-8 hover:border-terminal-green/50 transition-all duration-300 shadow-lg hover:shadow-terminal-green/10">
              <div className="text-gray-300 leading-relaxed">
                <EditableText
                  contentKey="about-me"
                  defaultText="Welcome to my practical world of cybersecurity exploration. This is where theory meets reality through hands-on experiences in real-world scenarios. From TryHackMe's guided learning environments to Hack The Box's challenging machines, and competitive CTF events - each experience in this practical world builds genuine expertise through direct engagement with actual security challenges and vulnerabilities."
                  className="block min-h-[120px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Sections */}
      <TryHackMeSection />
      <HackTheBoxSection />
      <CTFSection />
      
      {/* Return to Main Page Button - Now placed below CTF section */}
      <ReturnToMainButton />
    </div>
  );
};