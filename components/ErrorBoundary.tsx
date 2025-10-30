"use client";
import { Component, ReactNode } from "react";
import Link from "next/link";
import { DiamondLogo } from "./DiamondLogo";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-page">
          <div className="error-content">
            <DiamondLogo size={80} animated={true} />
            <h2>Something went wrong</h2>
            <p>{this.state.error?.message || "An unexpected error occurred"}</p>
            <div className="error-actions">
              <button
                className="btn primary large"
                onClick={() => this.setState({ hasError: false })}
              >
                Try again
              </button>
              <Link href="/" className="btn secondary large">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

