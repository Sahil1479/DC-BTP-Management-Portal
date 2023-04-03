/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Loading from '../../components/Loading';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import { CSVLink } from 'react-csv';
import ProjectListCard from '../../components/Students/ProjectListCard';
import styles from '../../styles/pages/Students/ProjectsList.module.css';
import Footer from '../../components/Footer/Footer';

const ProjectsList = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [CSVData, setCSVData] = useState([]);

  const handleQueryChange = (event) => {
    setSearchQuery(event.target.value);
    filterData(event.target.value);
  };

  const exportData = () => {
    if (filteredData.length !== 0) {
      const data = [];
      const headers = [
        'title',
        'faculty',
        'department',
        'category',
        'description',
        'deliverables',
        'skills',
        'courses',
      ];
      data.push(headers);
      filteredData.forEach((project) => {
        const exportData = [];
        headers.forEach((header) => {
          if (header === 'faculty') {
            exportData.push(project[header]['user']['full_name']);
          } else if (header === 'department') {
            exportData.push(project['faculty']['program_branch']['name']);
          } else if (header === 'category') {
            exportData.push(project['category']['category']);
          } else {
            exportData.push(project[header]);
          }
        });
        data.push(exportData);
      });
      setCSVData(data);
    }
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
            } else if (key === 'faculty') {
              const branch = project[key]['program_branch']['name']
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase());

              const full_name = project[key]['user']['full_name']
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase());

              return branch || full_name;
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

  useEffect(() => {
    instance
      .get('projects/available_projects/')
      .then((res) => {
        console.log(res.data);
        setSearchQuery('');
        setProjects(res.data);
        setFilteredData(res.data);
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
          <Container maxWidth="lg">
            <div className={styles.header}>
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
              <div className={styles.exportButton}>
                <button onClick={() => exportData()}>
                  <CSVLink
                    className={styles.csvLink}
                    filename={'Projects'}
                    data={CSVData}
                  >
                    Export
                  </CSVLink>
                </button>
              </div>
            </div>
            <Grid
              container
              direction="row"
              spacing={5}
              style={{ width: '100%', margin: '12rem auto 100vh auto' }}
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
                      <ProjectListCard data={project} />
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

export default ProjectsList;
