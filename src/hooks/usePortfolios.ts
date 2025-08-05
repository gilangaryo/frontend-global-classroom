'use client';

import { useState, useEffect } from 'react';

export interface Portfolio {
  id: string;
  title: string;
  description?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/portfolios`)
      .then((res) => res.json())
      .then((data) => setPortfolios(data.data))
      .finally(() => setLoading(false));
  }, []);

  return { portfolios, loading };
}
