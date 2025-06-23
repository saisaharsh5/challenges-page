import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useStaticContent = (key: string) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [key]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('static_content')
        .select('content')
        .eq('key', key);

      if (error) {
        console.error('Error fetching content:', error);
        return;
      }

      setContent(data?.[0]?.content || '');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: string) => {
    try {
      const { error } = await supabase
        .from('static_content')
        .upsert({ key, content: newContent }, { onConflict: 'key' });

      if (error) {
        console.error('Error updating content:', error);
        return false;
      }

      setContent(newContent);
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return { content, updateContent, loading };
};