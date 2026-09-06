import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

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

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in PyMACS DOM app:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-[#0A0A0B] text-white flex flex-col items-center justify-center p-8 select-none">
          <div className="max-w-md w-full bg-[#141416] border border-[#2D2D30] rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h2 className="text-lg font-semibold mb-2">PyMACS Runtime Recovered</h2>
            <p className="text-xs text-[#A1A1AA] mb-4">
              An unexpected render exception was caught by the Microkernel diagnostic layer:
            </p>

            <div className="w-full bg-[#09090A] border border-[#222224] rounded p-3 font-mono text-[11px] text-red-400 text-left overflow-x-auto mb-6 max-h-40">
              {this.state.error?.message || 'Unknown render error'}
            </div>

            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 bg-[#4ADE80] text-black hover:bg-[#3ec46f] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
