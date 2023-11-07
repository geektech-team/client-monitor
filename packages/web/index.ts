import { Monitor } from '../../core';
import { Tracker } from '../../core/tracker';
import { WebErrorMonitor } from './error-monitor';
import { WebPerformanceMonitor } from './performance-monitor';

export class WebMonitor extends Monitor {
  constructor(tracker: Tracker) {
    super(new WebErrorMonitor(tracker), new WebPerformanceMonitor(tracker));
  }
}
const tracker = new Tracker('http://localhost:6000/track');

export const monitor = new WebMonitor(tracker);
