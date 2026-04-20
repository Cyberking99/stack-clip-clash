"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-surface/5 rounded-3xl border border-surface/10 backdrop-blur-sm">
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          
          <h1 className="text-2xl font-heading font-bold text-text mb-2">Something went wrong</h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            The Arena encountered an unexpected error. Don&apos;t worry, your Clout and Tokens are safe.
          </p>

          <button
            onClick={this.handleReload}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            Reload Application
          </button>
          
          {process.env.NODE_ENV === "development" && (
            <pre className="mt-8 p-4 bg-black/50 rounded-lg text-left text-xs text-rose-300 overflow-auto max-w-full">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.children;
  }
}
