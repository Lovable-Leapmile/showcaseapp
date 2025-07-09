
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

interface ApiPart {
  item_id: string;
  item_description: string;
  item_image: string | null;
  item_category: string;
  tray_id: string | null;
}

interface ApiResponse {
  records: ApiPart[];
}

interface CategoryResponse {
  records: Array<{
    item_category_list: string[];
  }>;
}

export const usePartsApi = () => {
  const [parts, setParts] = useState<ApiPart[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('https://staging.qikpod.com/showcase/items/category_list', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CategoryResponse = await response.json();
      const categoryList = data.records[0]?.item_category_list || [];
      setCategories(['All Categories', ...categoryList]);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories');
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  }, []);

  const fetchParts = useCallback(async (category?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      let url = 'https://staging.qikpod.com/showcase/items?order_by_field=updated_at&order_by_type=ASC';
      
      if (category && category !== 'All Categories') {
        url += `&item_category=${encodeURIComponent(category)}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setParts(data.records || []);
    } catch (err) {
      console.error('Failed to fetch parts:', err);
      setError('Failed to load parts');
      toast({
        title: "Error",
        description: "Failed to load parts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchParts();
  }, [fetchCategories, fetchParts]);

  return {
    parts,
    categories,
    isLoading,
    error,
    fetchParts,
    refetch: () => fetchParts(),
  };
};
