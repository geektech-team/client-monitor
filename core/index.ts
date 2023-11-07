import { PerformanceMonitor } from './performance-monitor';
import { ErrorMonitor } from './error-monitor';

export class Monitor {
  constructor(
    public errorMonitor: ErrorMonitor,
    public performanceMonitor: PerformanceMonitor,
  ) {
    this.errorMonitor = errorMonitor;
    this.performanceMonitor = performanceMonitor;
  }
}
