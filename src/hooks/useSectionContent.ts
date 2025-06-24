import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    fetchContent();
  }, [sectionKey]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('section_content')
        .select('*')
        .eq('section_key', sectionKey)
        .maybeSingle();

      if (error) {
        console.error('Error fetching section content:', error);
        return;
      }

      setContent(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (updates: Partial<Pick<SectionContent, 'title' | 'description'>>) => {
    try {
      const { error } = await supabase
        .from('section_content')
        .upsert({ 
          section_key: sectionKey, 
          ...updates 
        }, { onConflict: 'section_key' });

      if (error) {
        console.error('Error updating section content:', error);
        return false;
      }

      // Update local state
      setContent(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return { content, updateContent, loading, refetch: fetchContent };
};