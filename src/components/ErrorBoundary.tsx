import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error("Uncaught error in boundary:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#ECFFED] flex items-center justify-center p-6 font-sans">
          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-[#2C5E2E]/10 shadow-xl max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-[#FCE8E6] text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-rose-100 animate-bounce">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#1A3F1C] tracking-tight">Something went wrong</h2>
              <p className="text-gray-400 text-xs md:text-sm font-semibold leading-relaxed">
                An unexpected error occurred while loading this section. Our chef is looking into it!
              </p>
              {this.state.error && (
                <pre className="mt-4 p-3 bg-gray-50 rounded-xl text-[10px] font-mono text-left text-gray-500 overflow-x-auto max-h-24 select-text">
                  {this.state.error.message}
                </pre>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-extrabold px-6 py-3.5 rounded-2xl transition-all shadow-md text-xs cursor-pointer select-none"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#1A3F1C] border border-[#2C5E2E]/10 font-extrabold px-6 py-3.5 rounded-2xl transition-all shadow-sm text-xs cursor-pointer select-none"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
