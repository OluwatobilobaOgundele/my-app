import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/error.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      // Reset the error boundary when the route changes
      this.setState({ hasError: false });
    }
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  handleNavigateHome = (navigate) => {
    this.setState({ hasError: false }, () => {
      navigate("/"); // Navigate to the home route
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          onReload={this.handleReload}
          onNavigateHome={this.handleNavigateHome}
        />
      );
    }
    return this.props.children;
  }
}

const ErrorFallback = ({ onReload, onNavigateHome }) => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <h1>Something went wrong.</h1>
      <p>We apologize for the inconvenience.</p>
      <div className="error-buttons">
        <button onClick={onReload} className="error-button">
          Reload Page
        </button>
        <button
          onClick={() => onNavigateHome(navigate)}
          className="error-button"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
