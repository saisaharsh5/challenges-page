import React, { useState, useEffect } from 'react';
import { Plus, Monitor, Server, Cpu, HardDrive, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { HackTheBoxMachine } from '../../types';
import { AchievementCard } from '../AchievementCard';
import { LoadingSpinner } from '../LoadingSpinner';
import { Modal } from '../Modal';
import { EditableSectionHeader } from '../EditableSectionHeader';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export const HackTheBoxSection: React.FC = () => {
  const [machines, setMachines] = useState<HackTheBoxMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<HackTheBoxMachine | null>(null);
  const [formData, setFormData] = useState({
    machine_name: '',
    description: '',
    os_type: 'Linux' as const,
    points: 20,
    url: '',
    completion_date: new Date().toISOString().split('T')[0]
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const { data, error } = await supabase
        .from('hackthebox_machines')
        .select('*')
        .order('completion_date', { ascending: false });

      if (error) throw error;
      setMachines(data || []);
    } catch (error) {
      console.error('Error fetching machines:', error);
      toast.error('Failed to load Hack The Box machines');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMachine) {
        const { error } = await supabase
          .from('hackthebox_machines')
          .update(formData)
          .eq('id', editingMachine.id);
        
        if (error) throw error;
        toast.success('Machine updated successfully');
      } else {
        const { error } = await supabase
          .from('hackthebox_machines')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('Machine added successfully');
      }
      
      fetchMachines();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving machine:', error);
      toast.error('Failed to save machine');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this machine?')) return;
    
    try {
      const { error } = await supabase
        .from('hackthebox_machines')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Machine deleted successfully');
      fetchMachines();
    } catch (error) {
      console.error('Error deleting machine:', error);
      toast.error('Failed to delete machine');
    }
  };

  const handleEdit = (machine: HackTheBoxMachine) => {
    setEditingMachine(machine);
    setFormData({
      machine_name: machine.machine_name,
      description: machine.description,
      os_type: machine.os_type,
      points: machine.points,
      url: machine.url,
      completion_date: machine.completion_date || new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      machine_name: '',
      description: '',
      os_type: 'Linux',
      points: 20,
      url: '',
      completion_date: new Date().toISOString().split('T')[0]
    });
    setEditingMachine(null);
  };

  const getOSIcon = (osType: string) => {
    return osType === 'Windows' ? <Monitor className="h-5 w-5" /> : <Server className="h-5 w-5" />;
  };

  const getOSColor = (osType: string) => {
    switch (osType) {
      case 'Linux': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Windows': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editable Section header */}
        <EditableSectionHeader
          sectionKey="hackthebox"
          defaultTitle="Hack The Box Machines"
          defaultDescription="Advanced penetration testing challenges and machine exploitation"
          icon={<HardDrive className="h-8 w-8 text-purple-400" />}
          gradientFrom="from-purple-500/20"
          gradientTo="to-pink-500/20"
          iconColor="text-purple-400"
        >
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 rounded-xl transition-all duration-300 font-mono font-medium group"
            >
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Machine</span>
            </button>
          )}
        </EditableSectionHeader>

        {/* Stats bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <HardDrive className="h-6 w-6 text-purple-400" />
              <div>
                <p className="text-2xl font-mono font-bold text-white">{machines.length}</p>
                <p className="text-sm text-gray-400 font-mono">Machines Pwned</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Server className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-2xl font-mono font-bold text-white">
                  {machines.filter(m => m.os_type === 'Linux').length}
                </p>
                <p className="text-sm text-gray-400 font-mono">Linux Boxes</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Monitor className="h-6 w-6 text-purple-400" />
              <div>
                <p className="text-2xl font-mono font-bold text-white">
                  {machines.filter(m => m.os_type === 'Windows').length}
                </p>
                <p className="text-sm text-gray-400 font-mono">Windows Boxes</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-2xl font-mono font-bold text-white">
                  {machines.reduce((sum, m) => sum + m.points, 0)}
                </p>
                <p className="text-sm text-gray-400 font-mono">Total Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Machines grid */}
        {machines.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <HardDrive className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-mono font-semibold text-gray-400 mb-2">No Machines Yet</h3>
              <p className="text-gray-500 font-mono text-sm">
                Start your Hack The Box journey by adding your first pwned machine.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {machines.map((machine) => (
              <AchievementCard
                key={machine.id}
                title={machine.machine_name}
                description={machine.description}
                badge={machine.os_type}
                badgeColor={getOSColor(machine.os_type)}
                url={machine.url}
                category="Hack The Box"
                date={formatDate(machine.completion_date)}
                onEdit={user ? () => handleEdit(machine) : undefined}
                onDelete={user ? () => handleDelete(machine.id) : undefined}
              >
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <div className="flex items-center space-x-2">
                    {getOSIcon(machine.os_type)}
                    <span className="font-mono">{machine.os_type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4 text-yellow-400" />
                    <span className="font-mono text-yellow-400 font-semibold">{machine.points} pts</span>
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
          title={editingMachine ? 'Edit HTB Machine' : 'Add HTB Machine'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Machine Name
              </label>
              <input
                type="text"
                value={formData.machine_name}
                onChange={(e) => setFormData({ ...formData, machine_name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-terminal-green transition-colors font-mono"
                required
                placeholder="e.g., Lame"
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
                placeholder="Brief description of the machine and exploitation method..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-gray-300 mb-2">
                  OS Type
                </label>
                <select
                  value={formData.os_type}
                  onChange={(e) => setFormData({ ...formData, os_type: e.target.value as any })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-terminal-green font-mono"
                >
                  <option value="Linux">Linux</option>
                  <option value="Windows">Windows</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-mono text-gray-300 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-terminal-green font-mono"
                  min="1"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Completion Date
              </label>
              <input
                type="date"
                value={formData.completion_date}
                onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-terminal-green font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Machine URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-terminal-green font-mono"
                required
                placeholder="https://app.hackthebox.com/machines/..."
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
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-500/80 hover:to-pink-500/80 transition-all duration-300 font-mono font-medium"
              >
                {editingMachine ? 'Update' : 'Add'} Machine
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </section>
  );
};