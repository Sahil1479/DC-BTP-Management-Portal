import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Loading from '../../components/Loading';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import FacultyProjectListCard from '../../components/Faculty/FacultyProjectListCard';
import SearchIcon from '@mui/icons-material/Search';
import styles from '../../styles/pages/Faculty/FacultyProjectsList.module.css';
import FacultyProjectCreate from '../../components/Faculty/FacultyProjectCreate.js';
import Footer from '../../components/Footer/Footer';

const FacultyProjectsList = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleQueryChange = (event) => {
    setSearchQuery(event.target.value);
    filterData(event.target.value);
  };

  const filterData = (value) => {
    if (value === '') {
      setFilteredData(projects);
    } else {
      setFilteredData(
        projects.filter((project) => {
          return Object.keys(project).some((key) => {
            if (key === 'category') {
              var present = false;
              project[key].forEach((category) => {
                present =
                  present ||
                  category.category.toLowerCase().includes(value.toLowerCase());
              });
              return present;
            } else {
              return project[key]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase());
            }
          });
        })
      );
    }
  };

  const getAvailableProjects = () => {
    instance
      .get('projects/projects_floated/')
      .then((res) => {
        console.log(res.data);
        setSearchQuery('');
        setProjects(res.data);
        setFilteredData(res.data);
      })
      .then(() => setLoading(false))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAvailableProjects();
  }, []);

  return (
    <>
      <div style={{ minHeight: '100vh', width: '100%' }}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Container maxWidth="lg">
              <Grid container spacing={2} className={styles.listHeader}>
                <Grid item xs={10}>
                  <div className={styles.searchbar}>
                    <SearchIcon className={styles.searchInput} />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      onChange={(event) => handleQueryChange(event)}
                      value={searchQuery}
                      className={styles.searchInput}
                    />
                  </div>
                </Grid>
                <Grid
                  style={{ width: '100%', margin: '1rem 0 0 0' }}
                  item
                  xs={2}
                >
                  <FacultyProjectCreate />
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                spacing={5}
                style={{ width: '100%', margin: '0 auto 0 auto' }}
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
                    NO PROJECTS AVAILABLE
                  </div>
                ) : (
                  filteredData.map((project) => {
                    return (
                      <Grid key={project.id} item xs={12} sm={12} md={6} lg={6}>
                        <FacultyProjectListCard data={project} />
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

export default FacultyProjectsList;
