import { useState, useEffect } from "react";

/**
 * Custom hook for handling data loading states
 * @param loadFn - An async function that loads data
 * @param initialData - Optional initial data
 * @param delayMs - Optional delay for showing loading state (for UX purposes)
 * @returns An object with loading state, data, and error
 */
export function useDataLoader<T>(
  loadFn: () => Promise<T>,
  initialData?: T,
  delayMs = 0
) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const loadData = async () => {
      try {
        // Add minimal delay for smoother UX if specified
        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }

        const result = await loadFn();

        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted && !signal.aborted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [loadFn, delayMs]);

  return { isLoading, data, error };
}
