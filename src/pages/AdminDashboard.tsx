import React, { useState, useEffect } from 'react';
import { BarChart3, Database, Shield, Users, Plus, Activity } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { TryHackMeSection } from '../components/sections/TryHackMeSection';
import { HackTheBoxSection } from '../components/sections/HackTheBoxSection';
import { CTFSection } from '../components/sections/CTFSection';
import { ReturnToMainButton } from '../components/ReturnToMainButton';

interface Stats {
  tryhackme: number;
  hackthebox: number;
  ctf: number;
  total: number;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ tryhackme: 0, hackthebox: 0, ctf: 0, total: 0 });
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-black relative z-10">
      {/* Dashboard Header */}
      <section className="py-8 bg-gray-900 border-b border-terminal-green/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-mono font-bold text-white">
                <span className="text-terminal-green">{'>'}</span> Admin Dashboard
              </h1>
              <p className="text-gray-400 font-mono mt-2">
                Manage your cybersecurity portfolio content
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 px-4 py-2 rounded-md border border-gray-700">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-terminal-green" />
                  <span className="text-white font-mono text-sm">
                    Welcome, {user?.email?.split('@')[0]}
                  </span>
                </div>
              </div>
              <div className="bg-terminal-green/10 px-3 py-2 rounded-md border border-terminal-green/30">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-terminal-green" />
                  <span className="text-terminal-green font-mono text-sm">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-terminal-green/50 transition-colors">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-terminal-green" />
                <div className="ml-4">
                  <p className="text-sm font-mono text-gray-400">Total</p>
                  <p className="text-2xl font-mono font-bold text-white">
                    {loading ? '...' : stats.total}
                  </p>
                  <p className="text-xs font-mono text-terminal-green">Achievements</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-mono text-gray-400">TryHackMe</p>
                  <p className="text-2xl font-mono font-bold text-white">
                    {loading ? '...' : stats.tryhackme}
                  </p>
                  <p className="text-xs font-mono text-blue-500">Rooms</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-mono text-gray-400">HTB</p>
                  <p className="text-2xl font-mono font-bold text-white">
                    {loading ? '...' : stats.hackthebox}
                  </p>
                  <p className="text-xs font-mono text-purple-500">Machines</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-mono text-gray-400">CTF</p>
                  <p className="text-2xl font-mono font-bold text-white">
                    {loading ? '...' : stats.ctf}
                  </p>
                  <p className="text-xs font-mono text-yellow-500">Challenges</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Only visible to authenticated admin users */}
          {user && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-mono font-semibold text-white mb-4">
                <span className="text-terminal-green">{'>'}</span> Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-left">
                  <Plus className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-mono text-white">Add TryHackMe Room</p>
                    <p className="text-xs text-gray-400">Document a new room completion</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-left">
                  <Plus className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-mono text-white">Add HTB Machine</p>
                    <p className="text-xs text-gray-400">Record a machine pwned</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-left">
                  <Plus className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-mono text-white">Add CTF Challenge</p>
                    <p className="text-xs text-gray-400">Log a competition result</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Management Sections */}
      <div className="space-y-0">
        <TryHackMeSection />
        <HackTheBoxSection />
        <CTFSection />
        
        {/* Return to Main Page Button - Now placed below CTF section */}
        <ReturnToMainButton />
      </div>
    </div>
  );
};