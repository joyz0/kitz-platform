import { Component, ReactNode } from 'react';

type State = { error: Error | null };

class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('捕获到错误:', error);
  }

  render() {
    return this.props.children;
  }
}

export default ErrorBoundary;
