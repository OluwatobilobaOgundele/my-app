import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css"

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav} className="box" aria-label="Main Navigation">
      <ul style={styles.navList} className="listing">
        <li style={styles.navItem}>
          <Link to="/" style={{ ...styles.link, ...(isActive("/") && styles.active) }}>
            Home
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link
            to="/todos"
            style={{ ...styles.link, ...(isActive("/todos") && styles.active) }}
          >
            Todos
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link
            to="/error-test"
            style={{ ...styles.link, ...(isActive("/error-test") && styles.active) }}
          >
            Test Error Boundary
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link
            to="/404"
            style={{ ...styles.link, ...(isActive("/404") && styles.active) }}
          >
            Not Found Test
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#333",
    padding: "2rem 3rem 4rem",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: "0 10px",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  active: {
        textDecoration: "underline",
        color: "#FFD700", // Highlight active route
      }
};

export default Navbar;
