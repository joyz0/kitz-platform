'use client';

import { useEffect } from 'react';

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

export function GlobalErrorHandler({ children }: GlobalErrorHandlerProps) {
  useEffect(() => {
    // 监听全局错误事件 - 捕获 JavaScript 运行时错误
    const handleError = (event: ErrorEvent) => {
      console.error('Global JavaScript error:', event.error);

      // 在开发环境下显示详细信息
      if (process.env.NODE_ENV === 'development') {
        console.error('Error details:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        });
      }
    };

    // 监听未处理的 Promise rejection - 只处理真正的意外错误
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);

      // 在开发环境下显示详细信息
      if (process.env.NODE_ENV === 'development') {
        console.error('Rejection details:', event.reason);
      }

      // 这里只记录错误，不做业务逻辑处理
      // 业务相关的错误应该通过 CustomEventBus 或其他机制处理
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
}