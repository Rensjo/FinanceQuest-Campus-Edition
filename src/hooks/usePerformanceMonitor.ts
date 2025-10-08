import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  renderCount: number;
}

const performanceData: Map<string, PerformanceMetrics> = new Map();

export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(0);

  // Start timing before render
  startTime.current = performance.now();

  useEffect(() => {
    // Calculate render time after render
    const renderTime = performance.now() - startTime.current;
    renderCount.current++;

    const existing = performanceData.get(componentName);
    performanceData.set(componentName, {
      componentName,
      renderTime: existing ? (existing.renderTime + renderTime) / 2 : renderTime,
      renderCount: renderCount.current,
    });

    // Performance monitoring disabled in console
    // To view performance metrics, use: window.performanceTests.runAll()
    // or call: logPerformanceReport()
    
    // Console warnings completely disabled - no more spam!
  });

  return {
    getMetrics: () => performanceData.get(componentName),
    getAllMetrics: () => Array.from(performanceData.values()),
  };
};

// Export function to log all performance data
export const logPerformanceReport = () => {
  console.group('📊 Performance Report');
  Array.from(performanceData.values())
    .sort((a, b) => b.renderTime - a.renderTime)
    .forEach(metric => {
      console.log(
        `${metric.componentName}: ${metric.renderTime.toFixed(2)}ms avg (${metric.renderCount} renders)`
      );
    });
  console.groupEnd();
};
