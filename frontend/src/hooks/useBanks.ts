'use client';

import { useState, useEffect } from 'react';
import { Bank } from '@/types';
import { bankAPI } from '@/lib/api';

export function useBanks() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bankAPI.getActiveBanks()
      .then(setBanks)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { banks, isLoading, error };
}
