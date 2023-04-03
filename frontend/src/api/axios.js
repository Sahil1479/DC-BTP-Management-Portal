/* eslint-disable prettier/prettier */
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    Authorization: localStorage.getItem('btp_dc_portal_accessToken')
      ? 'Token ' + localStorage.getItem('btp_dc_portal_accessToken')
      : null,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (typeof error.response === 'undefined') {
      window.alert('A server/network error occured.');
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url ===
      `http://${process.env.BACKEND_HOST ? process.env.BACKEND_HOST : '127.0.0.1'
      }:8000/token/refresh/`
    ) {
      instance.defaults.headers['Authorization'] = null;
      localStorage.setItem('btp_dc_portal_loggedIn', false);
      localStorage.removeItem('btp_dc_portal_refreshToken');
      localStorage.removeItem('btp_dc_portal_accessToken');
      localStorage.removeItem('btp_dc_portal_username');
      localStorage.removeItem('btp_dc_portal_email');
      localStorage.removeItem('btp_dc_portal_role');
      window.alert('Session expired');
      return Promise.reject(error);
    }

    if (
      error.response.data.code === 'token_not_valid' &&
      error.response.status === 401 &&
      error.response.statusText === 'Unauthorized'
    ) {
      const refreshToken = localStorage.getItem('btp_dc_portal_refreshToken');

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          return instance
            .post('/token/refresh/', {
              refresh: refreshToken,
            })
            .then((res) => {
              const { refresh, access } = res.data;
              instance.defaults.headers['Authorization'] = 'Token ' + access;
              originalRequest.headers['Authorization'] = 'Token ' + access;
              localStorage.setItem('btp_dc_portal_refreshToken', refresh);
              localStorage.setItem('btp_dc_portal_accessToken', access);
              return instance(originalRequest);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          instance.defaults.headers['Authorization'] = null;
          localStorage.setItem('btp_dc_portal_loggedIn', false);
          localStorage.removeItem('btp_dc_portal_refreshToken');
          localStorage.removeItem('btp_dc_portal_accessToken');
          localStorage.removeItem('btp_dc_portal_username');
          localStorage.removeItem('btp_dc_portal_email');
          localStorage.removeItem('btp_dc_portal_role');
          window.alert('Session expired');
          window.location = '/';
        }
      } else {
        window.alert('No token found');
        window.location = '/';
      }
    }
  }
);

export default instance;
