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

  const defaultAboutTitle = "> My Cybersecurity Journey";
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
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-mono font-bold text-white mb-6 leading-tight">
              <EditableText
                contentKey="hero-title"
                defaultText="> Ethical Hacking\n> Learning Portfolio"
                className="whitespace-pre-line"
              />
            </h1>
            <div className="text-xl text-gray-300 leading-relaxed mb-8">
              <EditableText
                contentKey="hero-description"
                defaultText="Documenting my hands-on cybersecurity learning journey through TryHackMe rooms, Hack The Box machines, and CTF competitions. Each challenge solved and vulnerability discovered represents practical skills gained in ethical hacking, penetration testing, and digital forensics."
                className="block"
              />
            </div>
            <div className="inline-block">
              <div className="flex items-center space-x-2 text-terminal-green font-mono">
                <span className="animate-pulse">█</span>
                <span>Learning to secure the digital world</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Now visible to all users */}
      <section className="py-12 bg-gray-900 border-t border-terminal-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-mono font-bold text-white mb-4">
              <span className="text-terminal-green">{'>'}</span> Learning Progress
            </h2>
            <p className="text-gray-400 font-mono">
              Tracking my practical cybersecurity education and skill development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-terminal-green/50 transition-colors">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-terminal-green" />
                <div className="ml-4">
                  <p className="text-sm font-mono text-gray-400">Total</p>
                  <p className="text-2xl font-mono font-bold text-white">
                    {loading ? '...' : stats.total}
                  </p>
                  <p className="text-xs font-mono text-terminal-green">Challenges Completed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-mono text-gray-400">TryHackMe</p>
                  <p className="text-2xl font-mono font-bold text-white">
                    {loading ? '...' : stats.tryhackme}
                  </p>
                  <p className="text-xs font-mono text-blue-500">Learning Rooms</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center">
                <HardDrive className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-mono text-gray-400">Hack The Box</p>
                  <p className="text-2xl font-mono font-bold text-white">
                    {loading ? '...' : stats.hackthebox}
                  </p>
                  <p className="text-xs font-mono text-purple-500">Machines Pwned</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-mono text-gray-400">CTF Events</p>
                  <p className="text-2xl font-mono font-bold text-white">
                    {loading ? '...' : stats.ctf}
                  </p>
                  <p className="text-xs font-mono text-yellow-500">Competitions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-900 border-t border-terminal-green/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h2 className="text-3xl font-mono font-bold text-white mb-8 text-center">
                {displayAboutTitle}
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
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <div className="text-gray-300 leading-relaxed">
              <EditableText
                contentKey="about-me"
                defaultText="I am a dedicated cybersecurity student passionate about ethical hacking and digital security. My learning journey encompasses hands-on practice through TryHackMe educational rooms, challenging Hack The Box machines, and competitive CTF events. Each completed challenge strengthens my understanding of penetration testing methodologies, vulnerability assessment techniques, and security best practices. I believe in learning by doing and continuously expanding my practical cybersecurity skills."
                className="block min-h-[120px]"
              />
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