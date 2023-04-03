import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const FacultyProtected = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return localStorage.getItem('btp_dc_portal_loggedIn') === 'true' &&
          localStorage.getItem('btp_dc_portal_role') === 'faculty' ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname:
                localStorage.getItem('btp_dc_portal_loggedIn') === 'true'
                  ? localStorage.getItem('btp_dc_portal_role') === 'student'
                    ? '/student-projects'
                    : '/department-courses'
                  : '/',
              state: {
                from: props.location,
              },
            }}
          />
        );
      }}
    />
  );
};

export default FacultyProtected;
