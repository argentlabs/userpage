import { Component, ReactNode } from "react"

interface ErrorBoundaryProps {
  fallback: ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps> {
  state = {
    hasError: false,
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback
    }

    return this.props.children
  }
}
