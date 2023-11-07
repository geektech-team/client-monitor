export enum ErrorType {
  JavascriptError = 'JAVASCRIPT_ERROR',
  PromiseError = 'PROMISE_ERROR',
  ResourceError = 'RESOURCE_ERROR',
}

export interface ErrorInfo {
  errorType: ErrorType;
  message: string;

  file: string;
  stack: string; // 堆栈
}
