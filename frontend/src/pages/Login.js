/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import styles from '../styles/pages/Login.module.css';
import instance from '../api/axios';
import backgroundImage from '../assets/loginback.jpg';
import Loading from '../components/Loading';
import jwt_decode from 'jwt-decode';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Footer from '../components/Footer/Footer';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    return username.length > 0 && password.length > 0;
  };

  const clearForm = () => {
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const body = { username: username, password: password };
    instance
      .post('token/', body)
      .then((res) => {
        const { refresh, access } = res.data;
        const data = jwt_decode(access);
        instance.defaults.headers['Authorization'] = 'Token ' + access;
        localStorage.clear();
        localStorage.setItem('btp_dc_portal_refreshToken', refresh);
        localStorage.setItem('btp_dc_portal_accessToken', access);
        localStorage.setItem('btp_dc_portal_loggedIn', true);
        localStorage.setItem('btp_dc_portal_username', data.username);
        localStorage.setItem('btp_dc_portal_email', data.email);
        localStorage.setItem('btp_dc_portal_role', data.role);
        if (data.role === 'faculty') {
          window.location = '/faculty-projects';
        } else if (data.role === 'student') {
          window.location = '/student-projects';
        } else {
          window.location = '/department-courses';
        }
      })
      .then(() => setLoading(false))
      .catch(function (error) {
        if (error.response) {
          setError(error.response.data['Error']);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    if (localStorage.getItem('btp_dc_portal_loggedIn') === 'true') {
      const role = localStorage.getItem('btp_dc_portal_role');
      if (role === 'faculty') {
        window.location = '/faculty-projects';
      } else if (role === 'student') {
        window.location = '/student-projects';
      } else {
        window.location = '/department-courses';
      }
    }
  });

  return (
    <div
      style={{
        height: '100vh',
        background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImage}) no-repeat fixed`,
        backgroundSize: 'cover',
        backgroundPosition: '50%',
        paddingTop: '7rem',
        justifyContent: 'center',
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.Login}>
          <div className={styles.heading}>LOGIN</div>
          <div className={styles.form}>
            <div className={styles.username}>
              <PersonIcon className={styles.personIcon} />
              <input
                type="text"
                autoFocus
                placeholder="Enter Username"
                onChange={(event) => setUsername(event.target.value)}
                value={username}
                className={styles.usernameInput}
              />
            </div>
            <div className={styles.password}>
              <LockIcon className={styles.lockIcon} />
              <input
                type="password"
                placeholder="Enter Password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                className={styles.passwordInput}
              />
            </div>
          </div>
          <center className={styles.buttons} style={{ marginTop: '0.5rem' }}>
            <button
              size="lg"
              className={styles.clearButton}
              onClick={() => clearForm()}
            >
              Clear
            </button>
            <button
              type="submit"
              size="lg"
              onClick={(event) => handleSubmit(event)}
              disabled={!validateForm()}
              className={styles.loginButton}
            >
              Login
            </button>
          </center>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Login;
