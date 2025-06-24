import { useState, useEffect } from 'react';
import { supabase, testConnection } from '../lib/supabase';

interface SectionContent {
  id: string;
  section_key: string;
  title: string;
  description: string;
  updated_at: string;
}

export const useSectionContent = (sectionKey: string) => {
  const [content, setContent] = useState<SectionContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [sectionKey]);

  const fetchContent = async () => {
    try {
      setError(null);
      
      // Test connection first
      const connectionOk = await testConnection();
      if (!connectionOk) {
        setError('Unable to connect to database');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('section_content')
        .select('*')
        .eq('section_key', sectionKey)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching section content:', fetchError);
        setError(`Database error: ${fetchError.message}`);
        return;
      }

      setContent(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (updates: Partial<Pick<SectionContent, 'title' | 'description'>>) => {
    try {
      setError(null);
      
      const { error: updateError } = await supabase
        .from('section_content')
        .upsert({ 
          section_key: sectionKey, 
          ...updates 
        }, { onConflict: 'section_key' });

      if (updateError) {
        console.error('Error updating section content:', updateError);
        setError(`Update error: ${updateError.message}`);
        return false;
      }

      // Update local state
      setContent(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      return false;
    }
  };

  return { content, updateContent, loading, error, refetch: fetchContent };
};