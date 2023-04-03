import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/pages/NotFoundPage.module.css';

const NotFound = () => {
  return (
    <div className={styles.error}>
      <div className={styles.notFound}>
        <div className={styles.brokenLink}>
          <div></div>
          <h1>404</h1>
        </div>
        <h2>Page not found</h2>
        <p>
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <center>
          <Link to="/">
            <button size="lg" className={styles.homeButton}>
              Home Page
            </button>
          </Link>
        </center>
      </div>
    </div>
  );
};

export default NotFound;
