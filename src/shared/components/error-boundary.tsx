"use client";

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the whole app.
 */

import { Component, ReactNode, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      errorInfo,
    });

    // TODO: Send error to logging service in production
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = "/dashboard";
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-red-500/10 p-3 rounded-xl ring-1 ring-red-500/20">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    Oops! Something went wrong
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    We encountered an unexpected error
                  </p>
                </div>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Error Details (Development):
                  </p>
                  <pre className="text-xs text-red-600 dark:text-red-400 overflow-x-auto whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-zinc-600 dark:text-zinc-400 overflow-x-auto whitespace-pre-wrap max-h-48">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              </div>

              <p className="text-xs text-center text-zinc-500 dark:text-zinc-500">
                If this problem persists, please contact support
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
