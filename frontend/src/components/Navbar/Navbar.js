/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import instance from '../../api/axios';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Grid from '@material-ui/core/Grid';
import cclab_iitj_logo from '../../assets/cclab_iitj_logo.png';

const Navbar = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = (event) => {
    event.preventDefault();
    setLoading(true);
    instance
      .post('logout/blacklist/', {
        refresh: localStorage.getItem('btp_dc_portal_refreshToken'),
      })
      .then((res) => {
        instance.defaults.headers['Authorization'] = null;
        localStorage.setItem('btp_dc_portal_loggedIn', false);
        localStorage.removeItem('btp_dc_portal_refreshToken');
        localStorage.removeItem('btp_dc_portal_accessToken');
        localStorage.removeItem('btp_dc_portal_username');
        localStorage.removeItem('btp_dc_portal_email');
        localStorage.removeItem('btp_dc_portal_role');
        window.location = '/';
      })
      .then(() => setLoading(false))
      .catch(function (error) {
        if (error.response) {
          setError(error.response.data['Error']);
        }
        setLoading(false);
      });
  };

  return (
    <Grid container>
      <div className="wrapper">
        <nav>
          <input
            onChange={(event) => setIsChecked(event.currentTarget.checked)}
            checked={isChecked}
            type="checkbox"
            id="show-menu"
          />
          <label htmlFor="show-menu" className="menu-icon">
            <i className="fas fa-bars"></i>
          </label>
          <div className="content">
            <div className="logo">
              {localStorage.getItem('btp_dc_portal_loggedIn') === 'true' ? (
                localStorage.getItem('btp_dc_portal_role') === 'student' ? (
                  <Link to="/student-projects">
                    <img
                      src={cclab_iitj_logo}
                      alt="logo"
                      width="69px"
                      heigth="64px"
                    />
                  </Link>
                ) : localStorage.getItem('btp_dc_portal_role') === 'faculty' ? (
                  <Link to="/faculty-projects">
                    <img
                      src={cclab_iitj_logo}
                      alt="logo"
                      width="69px"
                      heigth="64px"
                    />
                  </Link>
                ) : (
                  <Link to="/department-courses">
                    <img
                      src={cclab_iitj_logo}
                      alt="logo"
                      width="69px"
                      heigth="64px"
                    />
                  </Link>
                )
              ) : (
                <Link to="/">
                  <img
                    src={cclab_iitj_logo}
                    alt="logo"
                    width="69px"
                    heigth="64px"
                  />
                </Link>
              )}
            </div>
            {localStorage.getItem('btp_dc_portal_loggedIn') === 'true' ? (
              <ul className="links">
                <li className="FAQ">
                  <Link to="#" className="desktop-link">
                    FAQ <i className="fa fa-caret-down"></i>
                  </Link>
                  <input type="checkbox" id="show-faq" />
                  <label htmlFor="show-faq">
                    FAQ <i className="fa fa-caret-down"></i>
                  </label>
                  <ul>
                    <li onClick={() => setIsChecked(!isChecked)}>
                      <Link to="/grading">Grading</Link>
                    </li>
                    <li onClick={() => setIsChecked(!isChecked)}>
                      <Link to="/categories">Category Details</Link>
                    </li>
                  </ul>
                </li>
                {localStorage.getItem('btp_dc_portal_role') ===
                  'department' ? null : (
                  <li className="Projects">
                    <Link to="#" className="desktop-link">
                      Projects <i className="fa fa-caret-down"></i>
                    </Link>
                    <input type="checkbox" id="show-projects" />
                    <label htmlFor="show-projects">
                      Projects <i className="fa fa-caret-down"></i>
                    </label>
                    <ul>
                      {localStorage.getItem('btp_dc_portal_role') ===
                        'student' ? (
                        <>
                          <li onClick={() => setIsChecked(!isChecked)}>
                            <Link to="/student-projects">Available</Link>
                          </li>
                          <li onClick={() => setIsChecked(!isChecked)}>
                            <Link to="/student-projects-applied">Applied</Link>
                          </li>
                        </>
                      ) : (
                        <>
                          <li onClick={() => setIsChecked(!isChecked)}>
                            <Link to="/faculty-projects">Floated</Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </li>
                )}
                {localStorage.getItem('btp_dc_portal_role') === 'faculty' ? (
                  <li className="Courses">
                    <Link to="#" className="desktop-link">
                      Courses <i className="fa fa-caret-down"></i>
                    </Link>
                    <input type="checkbox" id="show-courses" />
                    <label htmlFor="show-courses">
                      Courses <i className="fa fa-caret-down"></i>
                    </label>
                    <ul>
                      <li onClick={() => setIsChecked(!isChecked)}>
                        <Link to="/faculty-courses">Courses</Link>
                      </li>
                    </ul>
                  </li>
                ) : null}
                {localStorage.getItem('btp_dc_portal_role') === 'student' ? (
                  <li className="Applications">
                    <Link to="#" className="desktop-link">
                      Applications <i className="fa fa-caret-down"></i>
                    </Link>
                    <input type="checkbox" id="show-applications" />
                    <label htmlFor="show-applications">
                      Applications <i className="fa fa-caret-down"></i>
                    </label>
                    <ul>
                      <li onClick={() => setIsChecked(!isChecked)}>
                        <Link to="/student-projects-applied">Active</Link>
                      </li>
                      <li onClick={() => setIsChecked(!isChecked)}>
                        <Link to="/student-archived-applications">
                          Archived
                        </Link>
                      </li>
                      <li onClick={() => setIsChecked(!isChecked)}>
                        <Link to="/student-industry-applications">
                          Industry
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : null}
                <li>
                  <Link
                    className="desktop-link"
                    to={
                      localStorage.getItem('btp_dc_portal_role') === 'student'
                        ? '/student-projects'
                        : localStorage.getItem('btp_dc_portal_role') ===
                          'faculty'
                          ? '/faculty-projects'
                          : '/department-courses'
                    }
                  >
                    <span>
                      {localStorage.getItem('btp_dc_portal_username')}{' '}
                      <i className="fa fa-caret-down"></i>
                    </span>
                  </Link>
                  <input type="checkbox" id="show-login" />
                  <label htmlFor="show-login">
                    {localStorage.getItem('btp_dc_portal_username')}{' '}
                    <i className="fa fa-caret-down"></i>
                  </label>
                  <ul>
                    {localStorage.getItem('btp_dc_portal_role') ===
                      'department' ? null : localStorage.getItem('btp_dc_portal_role') === 'student' ?
                      (
                        <li onClick={() => setIsChecked(!isChecked)}>
                          <a href="/student-profile">Profile</a>
                        </li>
                      ) : (
                        <li onClick={() => setIsChecked(!isChecked)}>
                          <a href="/faculty-profile">Profile</a>
                        </li>
                      )
                    }
                    <li onClick={(event) => handleLogout(event)}>
                      <Link to="#">Logout</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            ) : null}
          </div>
        </nav>
      </div>
    </Grid>
  );
};

export default Navbar;
