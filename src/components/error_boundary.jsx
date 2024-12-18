
import React from "react";
import { useNavigate } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback onReset={this.handleReset} />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ onReset }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.errorContainer}>
      <h1>Something went wrong.</h1>
      <p>We're sorry for the inconvenience.</p>
      <button onClick={onReset} style={styles.button}>
        Reload Page
      </button>
      <button
        onClick={() => navigate("/")}
        style={{ ...styles.button, marginLeft: "10px" }}
      >
        Go to Home
      </button>
    </div>
  );
};

const styles = {
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "50px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#FF6347",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ErrorBoundary;
