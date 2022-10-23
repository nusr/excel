import React from "react";

type Props = unknown;
type State = {
  error: Error | null;
};

export class ErrorBoundary extends React.Component<React.PropsWithChildren<Props>, State> {
  constructor(props: React.PropsWithChildren<Props>) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  // componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
  // console.log("componentDidCatch", error, errorInfo);
  // }

  render(): React.ReactNode {
    const { error } = this.state;
    if (error) {
      return (
        <div>
          <div>{error.message}</div>
          <div>{error.stack}</div>
        </div>
      );
    }

    return this.props.children;
  }
}
