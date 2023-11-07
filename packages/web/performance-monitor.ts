import { PerformanceMonitor } from '../../core/performance-monitor';
import { Tracker } from '../../core/tracker';
import { getPageURL } from './utils';

export class WebPerformanceMonitor implements PerformanceMonitor {
  constructor(public tracker: Tracker) {
    this.observeFirstContentfulPaint();
    this.observeLargestContentfulPaint();
  }

  /**
   * FCP（First Contentful Paint）
   * 指页面上首次渲染任何文本、图像、非空白的canvas或SVG的时间点。
   * 它表示了用户首次看到页面有实际内容的时间，即页面开始呈现有意义的内容的时间点
   * 标准 ≤1s
   */
  observeFirstContentfulPaint() {
    if (!this.isSupportPerformanceObserver()) return;

    const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          observer.disconnect();
        }

        const json = entry.toJSON();
        delete json.duration;

        const reportData = {
          ...json,
          subType: entry.name,
          type: 'performance',
          pageURL: getPageURL(),
        };

        this.tracker.send(reportData);
      }
    });
    // buffered 属性表示是否观察缓存数据，也就是说观察代码添加时机比事情触发时机晚也没关系。

    observer.observe({ type: 'paint', buffered: true });
  }

  /**
   * LCP（Largest Contentful Paint）
   * 最大内容绘制，即视口中最大的图像或文本块的渲染完成的时间点
   * 标准 ≤2s
   */
  observeLargestContentfulPaint() {
    if (!this.isSupportPerformanceObserver()) return;

    const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
      if (observer) {
        observer.disconnect();
      }

      for (const entry of list.getEntries()) {
        const json = entry.toJSON();
        delete json.duration;

        const reportData = {
          ...json,
          name: entry.entryType,
          subType: entry.entryType,
          type: 'performance',
          pageURL: getPageURL(),
        };

        this.tracker.send(reportData);
      }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  isSupportPerformanceObserver() {
    return !!PerformanceObserver;
  }
}
