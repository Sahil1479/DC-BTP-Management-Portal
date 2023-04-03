import React from 'react';
import Link from '@material-ui/core/Link';
import styles from '../../styles/components/Footer.module.css';

const Footer = (props) => {
  return (
    <footer className={styles.footer}>
      <span className={styles.maintainers}>
        Designed & Maintained by{' '}
        <a href="mailto:santosh.2@iitj.ac.in" target="_blank" rel="noreferrer">
          Sahil Harpal
        </a>{' '}
        and{' '}
        <a href="mailto:jain.38@iitj.ac.in" target="_blank" rel="noreferrer">
          Darshit Jain
        </a>
      </span>
      <span className={styles.copyright}>
        {'Copyright © '}
        <a href="http://iitj.ac.in/">
          Indian Institute of Technology, Jodhpur
        </a>{' '}
        {new Date().getFullYear()}
        {'.'}
      </span>
    </footer>
  );
};

export default Footer;
