
import { useState, useCallback, useMemo } from 'react';
import { StorageLocation, Part } from '@/types/ams';
import { createInitialStorage } from '@/data/initialData';

export const useStorageManager = () => {
  const [storage, setStorage] = useState<StorageLocation[]>(createInitialStorage());
  const [searchTerm, setSearchTerm] = useState<string>('');

  const markPartUnavailable = useCallback((partId: string) => {
    setStorage(prev => prev.map(item => 
      item.part.id === partId ? { ...item, available: false } : item
    ));
  }, []);

  const markPartAvailable = useCallback((partId: string) => {
    setStorage(prev => prev.map(item => 
      item.part.id === partId ? { ...item, available: true } : item
    ));
  }, []);

  const isPartAvailable = useCallback((partId: string) => {
    const storageItem = storage.find(item => item.part.id === partId);
    return storageItem?.available || false;
  }, [storage]);

  const availableParts = useMemo(() => {
    const filtered = storage
      .filter(item => item.available)
      .map(item => item.part)
      .filter(part => 
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return filtered;
  }, [storage, searchTerm]);

  return {
    storage,
    searchTerm,
    setSearchTerm,
    markPartUnavailable,
    markPartAvailable,
    isPartAvailable,
    availableParts,
  };
};
