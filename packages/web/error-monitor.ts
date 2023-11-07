import { Tracker } from '../../core/tracker';
import { ErrorMonitor } from '../../core/error-monitor';
import { ErrorType } from '../../core/error';

export class WebErrorMonitor implements ErrorMonitor {
  constructor(public tracker: Tracker) {
    this.catchJavascriptError();
    this.catchResourceError();
    this.catchPromiseError();
  }

  catchJavascriptError() {
    window.addEventListener(
      'error',
      event => {
        if (!this.isResourceError(event)) {
          this.tracker.send({
            type: 'error', // error
            errorType: ErrorType.JavascriptError, // jsError
            message: event.message, // 报错信息
            filename: event.filename, // 报错链接
            position: (event.lineno || 0) + ':' + (event.colno || 0), // 行列号
            stack: this.getLines(event.error.stack), // 错误堆栈
          });
        }
      },
      true,
    );
  }

  catchResourceError() {
    window.addEventListener(
      'error',
      (event: ErrorEvent) => {
        // 有 e.target.src(href) 的认定为资源加载错误
        if (this.isResourceError(event)) {
          this.tracker.send({
            // 资源加载错误
            type: 'error', // resource
            errorType: ErrorType.ResourceError,
            timeStamp: event.timeStamp, // 时间
          });
        }
      },
      true,
    );
  }

  catchPromiseError() {
    // 当Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件
    window.addEventListener(
      'unhandledrejection',
      event => {
        let message = '';
        let line = 0;
        let column = 0;
        let file = '';
        let stack = '';
        if (typeof event.reason === 'string') {
          message = event.reason;
        } else if (typeof event.reason === 'object') {
          message = event.reason.message;
        }
        const reason = event.reason;
        if (typeof reason === 'object') {
          if (reason.stack) {
            const matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
            if (matchResult) {
              file = matchResult[1];
              line = matchResult[2];
              column = matchResult[3];
            }
            stack = this.getLines(reason.stack);
          }
        }
        this.tracker.send({
          // 未捕获的promise错误
          type: 'error', // jsError
          errorType: ErrorType.PromiseError, // unhandledrejection
          message, // 标签名
          filename: file,
          position: line + ':' + column, // 行列
          stack,
        });
      },
      true,
    ); // true代表在捕获阶段调用,false代表在冒泡阶段捕获,使用true或false都可以
  }

  isResourceError(event: Event) {
    // 有 e.target.src(href) 的认定为资源加载错误
    return event.target && ('src' in event.target || 'href' in event.target);
  }

  getLines(stack: string) {
    return stack
      .split('\n')
      .slice(1)
      .map(item => item.replace(/^\s+at\s+/g, ''))
      .join('^');
  }
}
