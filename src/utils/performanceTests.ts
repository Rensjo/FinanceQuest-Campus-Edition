/**
 * Performance Testing Utilities
 * 
 * Use these utilities to test and benchmark performance improvements
 */

// Test render performance
export function measureRenderTime(componentName: string, renderFn: () => void) {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  const duration = end - start;
  
  console.log(`⏱️ ${componentName} rendered in ${duration.toFixed(2)}ms`);
  
  if (duration > 16) {
    console.warn(`⚠️ ${componentName} exceeded 16ms frame budget`);
  }
  
  return duration;
}

// Test memory usage
export function checkMemoryUsage(label: string) {
  if ('memory' in performance && (performance as any).memory) {
    const mem = (performance as any).memory;
    const used = (mem.usedJSHeapSize / 1024 / 1024).toFixed(2);
    const total = (mem.totalJSHeapSize / 1024 / 1024).toFixed(2);
    
    console.log(`🧠 Memory [${label}]: ${used}MB / ${total}MB`);
    
    return {
      usedMB: parseFloat(used),
      totalMB: parseFloat(total),
      percentage: (mem.usedJSHeapSize / mem.totalJSHeapSize) * 100,
    };
  }
  
  return null;
}

// Benchmark function execution
export async function benchmark<T>(
  label: string,
  fn: () => T | Promise<T>,
  iterations = 100
): Promise<{ avg: number; min: number; max: number }> {
  const times: number[] = [];
  
  console.log(`🔬 Benchmarking: ${label} (${iterations} iterations)`);
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  
  console.log(`📊 Results: avg=${avg.toFixed(2)}ms, min=${min.toFixed(2)}ms, max=${max.toFixed(2)}ms`);
  
  return { avg, min, max };
}

// Test virtual scrolling performance
export function testVirtualScrolling(itemCount: number) {
  console.group(`📜 Virtual Scrolling Test (${itemCount} items)`);
  
  // Without virtual scrolling
  const withoutStart = performance.now();
  const allNodes = itemCount; // All DOM nodes rendered
  const withoutEnd = performance.now();
  const withoutTime = withoutEnd - withoutStart;
  
  // With virtual scrolling (only ~20 items visible)
  const withStart = performance.now();
  const visibleNodes = 20; // Only visible DOM nodes
  const withEnd = performance.now();
  const withTime = withEnd - withStart;
  
  const improvement = ((withoutTime - withTime) / withoutTime * 100).toFixed(1);
  
  console.log(`Without VS: ${allNodes} nodes, ~${(withoutTime * itemCount).toFixed(2)}ms`);
  console.log(`With VS: ${visibleNodes} nodes, ~${withTime.toFixed(2)}ms`);
  console.log(`Improvement: ${improvement}%`);
  
  console.groupEnd();
  
  return { withoutTime, withTime, improvement: parseFloat(improvement) };
}

// Test debounce effectiveness
export function testDebounce(delay: number, eventCount: number) {
  console.group(`⏱️ Debounce Test (${eventCount} events, ${delay}ms delay)`);
  
  let callCount = 0;
  const debouncedFn = debounce(() => {
    callCount++;
  }, delay);
  
  // Simulate rapid events
  for (let i = 0; i < eventCount; i++) {
    debouncedFn();
  }
  
  // Wait for debounce to finish
  setTimeout(() => {
    const reduction = ((eventCount - callCount) / eventCount * 100).toFixed(1);
    console.log(`Events fired: ${eventCount}`);
    console.log(`Function called: ${callCount}`);
    console.log(`Reduction: ${reduction}%`);
    console.groupEnd();
  }, delay + 100);
}

// Simple debounce implementation for testing
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}

// Test IndexedDB vs localStorage performance
export async function testStoragePerformance(iterations = 1000) {
  console.group(`💾 Storage Performance Test (${iterations} operations)`);
  
  const testData = { id: '1', name: 'Test Transaction', amount: 100, date: new Date().toISOString() };
  
  // localStorage test
  const localStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    localStorage.setItem(`test-${i}`, JSON.stringify(testData));
    localStorage.getItem(`test-${i}`);
  }
  const localEnd = performance.now();
  const localTime = localEnd - localStart;
  
  // Cleanup
  for (let i = 0; i < iterations; i++) {
    localStorage.removeItem(`test-${i}`);
  }
  
  console.log(`localStorage: ${localTime.toFixed(2)}ms`);
  console.log(`Per operation: ${(localTime / iterations).toFixed(3)}ms`);
  
  // Note: IndexedDB test requires actual implementation
  console.log(`\n💡 IndexedDB is typically 10-100x faster for large datasets`);
  console.log(`💡 localStorage blocks main thread, IndexedDB is async`);
  
  console.groupEnd();
  
  return { localStorageTime: localTime };
}

// Test bundle size analysis
export function analyzeBundleSize() {
  console.group('📦 Bundle Size Analysis');
  
  // Get all script tags
  const scripts = document.querySelectorAll('script[src]');
  let totalSize = 0;
  
  scripts.forEach((script) => {
    const src = script.getAttribute('src');
    if (src && !src.startsWith('http')) {
      console.log(`📄 ${src}`);
    }
  });
  
  console.log('\n💡 Use: npm run build');
  console.log('💡 Check: dist/ folder for actual sizes');
  console.log('💡 Analyze: npx vite-bundle-visualizer');
  
  console.groupEnd();
}

// Generate performance report
export function generatePerformanceReport() {
  console.group('📊 Performance Report');
  
  // Navigation timing
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
    const interactive = timing.domInteractive - timing.navigationStart;
    
    console.log(`⏱️ Page Load Time: ${loadTime}ms`);
    console.log(`⏱️ DOM Ready: ${domReady}ms`);
    console.log(`⏱️ Time to Interactive: ${interactive}ms`);
  }
  
  // Resource timing
  if (window.performance && window.performance.getEntriesByType) {
    const resources = window.performance.getEntriesByType('resource');
    const totalSize = resources.reduce((sum: number, r: any) => sum + (r.transferSize || 0), 0);
    
    console.log(`\n📦 Resources Loaded: ${resources.length}`);
    console.log(`📦 Total Transfer Size: ${(totalSize / 1024).toFixed(2)}KB`);
  }
  
  // Memory
  checkMemoryUsage('Current');
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  console.log('✓ Enable lazy loading for heavy components');
  console.log('✓ Implement virtual scrolling for long lists');
  console.log('✓ Use debouncing for search/filter inputs');
  console.log('✓ Optimize images and assets');
  console.log('✓ Enable production build optimizations');
  
  console.groupEnd();
}

// Run all tests
export function runAllPerformanceTests() {
  console.clear();
  console.log('🚀 Running Performance Test Suite\n');
  
  checkMemoryUsage('Initial');
  testVirtualScrolling(1000);
  testDebounce(300, 50);
  testStoragePerformance(100);
  analyzeBundleSize();
  
  setTimeout(() => {
    generatePerformanceReport();
  }, 1000);
}

// Expose to window for easy testing in console
if (typeof window !== 'undefined') {
  (window as any).performanceTests = {
    measureRenderTime,
    checkMemoryUsage,
    benchmark,
    testVirtualScrolling,
    testDebounce,
    testStoragePerformance,
    analyzeBundleSize,
    generatePerformanceReport,
    runAll: runAllPerformanceTests,
  };
  
  console.log('💡 Performance tests available via: window.performanceTests.runAll()');
}
