/**
 * Performance optimization utilities
 * Debounce, throttle, and lazy loading helpers
 */

/**
 * Debounce function - delays execution until after wait time has elapsed
 * Useful for search inputs, window resize events, etc.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - ensures function is called at most once per specified time period
 * Useful for scroll events, mousemove events, etc.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Lazy load component - delays loading until component is needed
 */
export function lazyLoadWithRetry<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries: number = 3
): Promise<{ default: T }> {
  return new Promise((resolve, reject) => {
    const attempt = (retriesLeft: number) => {
      importFn()
        .then(resolve)
        .catch((error) => {
          if (retriesLeft === 0) {
            reject(error);
            return;
          }
          
          // Exponential backoff
          const delay = Math.pow(2, retries - retriesLeft) * 1000;
          setTimeout(() => attempt(retriesLeft - 1), delay);
        });
    };
    
    attempt(retries);
  });
}

/**
 * Check if device has limited resources (mobile, low-end devices)
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Check hardware concurrency (CPU cores)
  const lowCPU = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
  
  // Check device memory (if available)
  const lowMemory = 'deviceMemory' in navigator ? (navigator as any).deviceMemory < 4 : false;
  
  // Check connection speed
  const slowConnection = 'connection' in navigator 
    ? ['slow-2g', '2g', '3g'].includes((navigator as any).connection.effectiveType)
    : false;
  
  return prefersReducedMotion || lowCPU || lowMemory || slowConnection;
}

/**
 * Batch updates to reduce re-renders
 */
export function batchUpdates<T>(
  updates: Array<() => T>,
  onComplete?: (results: T[]) => void
): void {
  requestAnimationFrame(() => {
    const results = updates.map(update => update());
    if (onComplete) {
      onComplete(results);
    }
  });
}

/**
 * Virtual scrolling helper - calculate visible range
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleCount + overscan * 2);
  
  return { start, end };
}

/**
 * Memoization helper for expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }
    
    return result;
  }) as T;
}

/**
 * Request idle callback wrapper with fallback
 */
export function requestIdleCallback(callback: () => void, options?: { timeout?: number }): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Fallback for browsers that don't support requestIdleCallback
  return setTimeout(callback, 1) as any;
}

/**
 * Cancel idle callback with fallback
 */
export function cancelIdleCallback(id: number): void {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}
