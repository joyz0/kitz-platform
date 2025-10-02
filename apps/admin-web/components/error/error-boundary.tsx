'use client';

import React, { Component, ReactNode } from 'react';
import { RoutePath } from '@/lib/constants';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.reset);
      }

      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center">
          <div className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow">
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
              页面出现错误
            </h5>
            <div className="mb-4 font-normal text-gray-700">
              <p>抱歉，页面遇到了未知错误</p>
              <code className="mt-2 block rounded-sm bg-slate-100 p-2 text-xs">
                {this.state.error?.message || '未知错误'}
              </code>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.reset}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                重试
              </button>
              <a
                href={RoutePath.INDEX}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                返回首页
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}