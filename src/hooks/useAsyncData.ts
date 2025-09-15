import { useState, useEffect } from 'react';

interface UseAsyncDataOptions<T> {
  initialData?: T;
}

export function useAsyncData<T>(
  fetchFn: () => Promise<T> | T,
  options: UseAsyncDataOptions<T> = {}
) {
  const { initialData } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchFn();
        
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // 빈 의존성 배열로 한 번만 실행

  const refetch = () => {
    setLoading(true);
    setError(null);
    
    const loadData = async () => {
      try {
        const result = await fetchFn();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}
