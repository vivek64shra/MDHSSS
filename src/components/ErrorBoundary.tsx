import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Readonly<Props>;
  declare setState: (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | null) | null
  ) => void;

  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || 'अज्ञात त्रुटि (Unexpected error)',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Portal ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  public render() {
    if (this.state.hasError) {
      let parsedError: string | null = null;
      try {
        const obj = JSON.parse(this.state.errorMessage);
        if (obj && obj.operationType && obj.error) {
          parsedError = `Firestore ${String(obj.operationType).toUpperCase()} (${obj.path || 'unknown'}): ${obj.error}`;
        }
      } catch {
        // plain error message
      }

      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center max-w-xl mx-auto my-6">
          <div className="text-3xl mb-2">⚠️</div>
          <h3 className="text-lg font-extrabold text-red-900 mb-2">
            पैनल लोड करने में तकनीकी त्रुटि आई
          </h3>
          <p className="text-sm text-red-700 mb-4 break-words">
            {parsedError || this.state.errorMessage}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg cursor-pointer transition-colors"
          >
            🔄 पुनः प्रयास करें (Retry)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
