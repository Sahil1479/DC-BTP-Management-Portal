import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Loading from '../../components/Loading';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import styles from '../../styles/pages/Department/DepartmentCourseList.module.css';
import DepartmentCourseCreate from '../../components/Department/DepartmentCourseCreate';
import DepartmentCourseCard from '../../components/Department/DepartmentCourseCard';
import Footer from '../../components/Footer/Footer';

const DepartmentCourseList = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleQueryChange = (event) => {
    setSearchQuery(event.target.value);
    filterData(event.target.value);
  };

  const filterData = (value) => {
    if (value === '') {
      setFilteredData(courses);
    } else {
      setFilteredData(
        courses.filter((course) => {
          return Object.keys(course).some((key) => {
            if (key === 'faculty') {
              const full_name = course[key]['user']['full_name']
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase());

              const email = course[key]['user']['email']
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase());

              return full_name || email;
            } else if (key === 'course_code' || key === 'course_name') {
              return course[key]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase());
            }
          });
        })
      );
    }
  };

  const getCourses = () => {
    instance
      .get('projects/department_courses/')
      .then((res) => {
        console.log(res.data);
        setCourses(res.data);
        setSearchQuery('');
        setFilteredData(res.data);
      })
      .then(() => setLoading(false))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <>
      <div style={{ minHeight: '100vh', width: '100%' }}>
        {loading ? (
          <Loading />
        ) : (
          <Container maxWidth="lg">
            <Grid container spacing={2} className={styles.listHeader}>
              <Grid item xs={10}>
                <div className={styles.searchbar}>
                  <SearchIcon className={styles.searchInput} />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    onChange={(event) => handleQueryChange(event)}
                    value={searchQuery}
                    className={styles.searchInput}
                  />
                </div>
              </Grid>
              <Grid style={{ width: '100%', margin: '1rem 0 0 0' }} item xs={2}>
                <DepartmentCourseCreate />
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              spacing={5}
              style={{ width: '100%', margin: '0 auto' }}
            >
              {filteredData.length === 0 ? (
                <div
                  style={{
                    height: '100vh',
                    width: '100%',
                    textAlign: 'center',
                    lineHeight: '100vh',
                  }}
                >
                  NO COURSES AVAILABLE
                </div>
              ) : (
                filteredData.map((course) => {
                  return (
                    <Grid key={course.id} item xs={12} sm={12} md={6} lg={6}>
                      <DepartmentCourseCard course={course} />
                    </Grid>
                  );
                })
              )}
            </Grid>
          </Container>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DepartmentCourseList;
