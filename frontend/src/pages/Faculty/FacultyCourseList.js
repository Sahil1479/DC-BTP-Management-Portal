import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Loading from '../../components/Loading';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import Box from '@mui/material/Box';
import styles from '../../styles/pages/Faculty/FacultyCourseList.module.css';
import FacultyCourseDetails from '../../components/Faculty/FacultyCourseDetails';
import Footer from '../../components/Footer/Footer';

const FacultyCourseList = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    instance
      .get('projects/faculty_courses/')
      .then((res) => {
        console.log(res.data);
        setCourses(res.data);
      })
      .then(() => setLoading(false))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <div style={{ minHeight: '100vh', width: '100%' }}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Container maxWidth="lg">
              <Grid
                container
                direction="row"
                spacing={5}
                style={{ width: '100%', margin: '8rem auto 0 auto' }}
              >
                {courses.length === 0 ? (
                  <div
                    style={{
                      height: '100vh',
                      width: '100%',
                      textAlign: 'center',
                      lineHeight: '100vh',
                    }}
                  >
                    NOT A FACULTY ADVISOR
                  </div>
                ) : (
                  courses.map((course) => {
                    return (
                      <Grid key={course.id} item xs={12} sm={12} md={6} lg={6}>
                        <FacultyCourseDetails course={course} />;
                      </Grid>
                    );
                  })
                )}
              </Grid>
            </Container>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FacultyCourseList;
