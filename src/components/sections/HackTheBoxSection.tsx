import React, { useState, useEffect } from 'react';
import { Plus, Monitor, Server } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { HackTheBoxMachine } from '../../types';
import { AchievementCard } from '../AchievementCard';
import { LoadingSpinner } from '../LoadingSpinner';
import { Modal } from '../Modal';
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
    url: ''
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
        .order('created_at', { ascending: false });

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
      url: machine.url
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      machine_name: '',
      description: '',
      os_type: 'Linux',
      points: 20,
      url: ''
    });
    setEditingMachine(null);
  };

  const getOSIcon = (osType: string) => {
    return osType === 'Windows' ? <Monitor className="h-5 w-5" /> : <Server className="h-5 w-5" />;
  };

  const getOSColor = (osType: string) => {
    switch (osType) {
      case 'Linux': return 'bg-blue-500';
      case 'Windows': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-mono font-bold text-white mb-4">
              Hack The Box Machines
            </h2>
            <div className="w-20 h-1 bg-terminal-green"></div>
          </div>
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-terminal-green text-black rounded-md hover:bg-terminal-green/80 transition-colors font-mono"
            >
              <Plus className="h-5 w-5" />
              <span>Add Machine</span>
            </button>
          )}
        </div>

        {machines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-mono">No Hack The Box machines added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <AchievementCard
                key={machine.id}
                title={machine.machine_name}
                description={machine.description}
                badge={machine.os_type}
                badgeColor={getOSColor(machine.os_type)}
                url={machine.url}
                onEdit={user ? () => handleEdit(machine) : undefined}
                onDelete={user ? () => handleDelete(machine.id) : undefined}
              >
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <div className="flex items-center space-x-2">
                    {getOSIcon(machine.os_type)}
                    <span className="font-mono">{machine.os_type}</span>
                  </div>
                  <span className="font-mono text-terminal-green">{machine.points} pts</span>
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
          title={editingMachine ? 'Edit HTB Machine' : 'Add HTB Machine'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Machine Name
              </label>
              <input
                type="text"
                value={formData.machine_name}
                onChange={(e) => setFormData({ ...formData, machine_name: e.target.value })}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-gray-300 mb-2">
                  OS Type
                </label>
                <select
                  value={formData.os_type}
                  onChange={(e) => setFormData({ ...formData, os_type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-terminal-green"
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
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-terminal-green"
                  min="1"
                  required
                />
              </div>
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
                {editingMachine ? 'Update' : 'Add'} Machine
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </section>
  );
};