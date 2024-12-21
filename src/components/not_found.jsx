import React from "react";
import "../styles/not_found.css";

const NotFound = () => {
  return (
    <section className="containerr">
      <h1 className="title">404 - Page Not Found</h1>
      <p className="message">
        Sorry, the page you are looking for does not exist.
      </p>
    </section>
  );
};

export default NotFound;
