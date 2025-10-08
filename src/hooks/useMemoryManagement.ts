import { useEffect, useRef, useCallback } from 'react';

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export const useMemoryManagement = (componentName: string) => {
  const cleanupFunctions = useRef<Array<() => void>>([]);
  const timers = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervals = useRef<Set<NodeJS.Timeout>>(new Set());

  // Register cleanup function
  const registerCleanup = useCallback((cleanupFn: () => void) => {
    cleanupFunctions.current.push(cleanupFn);
  }, []);

  // Safe setTimeout that auto-cleans
  const safeSetTimeout = useCallback((fn: () => void, delay: number) => {
    const timer = setTimeout(() => {
      fn();
      timers.current.delete(timer);
    }, delay);
    timers.current.add(timer);
    return timer;
  }, []);

  // Safe setInterval that auto-cleans
  const safeSetInterval = useCallback((fn: () => void, delay: number) => {
    const interval = setInterval(fn, delay);
    intervals.current.add(interval);
    return interval;
  }, []);

  // Clear specific timer
  const clearTimer = useCallback((timer: NodeJS.Timeout) => {
    clearTimeout(timer);
    timers.current.delete(timer);
  }, []);

  // Clear specific interval
  const clearIntervalTimer = useCallback((interval: NodeJS.Timeout) => {
    clearInterval(interval);
    intervals.current.delete(interval);
  }, []);

  // Get memory info if available
  const getMemoryInfo = useCallback((): MemoryInfo | null => {
    if ('memory' in performance && (performance as any).memory) {
      const mem = (performance as any).memory;
      return {
        usedJSHeapSize: mem.usedJSHeapSize,
        totalJSHeapSize: mem.totalJSHeapSize,
        jsHeapSizeLimit: mem.jsHeapSizeLimit,
      };
    }
    return null;
  }, []);

  // Log memory usage
  const logMemoryUsage = useCallback(() => {
    const memInfo = getMemoryInfo();
    if (memInfo) {
      const usedMB = (memInfo.usedJSHeapSize / 1024 / 1024).toFixed(2);
      const totalMB = (memInfo.totalJSHeapSize / 1024 / 1024).toFixed(2);
      const limitMB = (memInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
      console.log(
        `🧠 Memory [${componentName}]: ${usedMB}MB / ${totalMB}MB (Limit: ${limitMB}MB)`
      );
    }
  }, [componentName, getMemoryInfo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all timers
      timers.current.forEach(timer => clearTimeout(timer));
      timers.current.clear();

      // Clear all intervals
      intervals.current.forEach(interval => clearInterval(interval));
      intervals.current.clear();

      // Run all cleanup functions
      cleanupFunctions.current.forEach(fn => {
        try {
          fn();
        } catch (error) {
          console.error(`Cleanup error in ${componentName}:`, error);
        }
      });
      cleanupFunctions.current = [];
    };
  }, [componentName]);

  return {
    registerCleanup,
    safeSetTimeout,
    safeSetInterval,
    clearTimer,
    clearIntervalTimer,
    getMemoryInfo,
    logMemoryUsage,
  };
};
