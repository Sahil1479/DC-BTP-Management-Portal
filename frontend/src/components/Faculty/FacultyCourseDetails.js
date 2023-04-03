import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import styles from '../../styles/components/Faculty/FacultyCourseDetails.module.css';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Paper from '@material-ui/core/Paper';
import FacultyProjectDescription from './FacultyProjectDescription';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LinkIcon from '@mui/icons-material/Link';

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: false,
  },
  {
    field: 'roll_number',
    headerName: 'Roll No',
    width: 150,
    editable: false,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 150,
    editable: false,
  },
  {
    field: 'year',
    headerName: 'Year',
    width: 150,
    editable: false,
  },
  {
    field: 'cgpa',
    headerName: 'CGPA',
    width: 150,
    editable: false,
  },
  {
    field: 'project_title',
    headerName: 'Project Name',
    width: 150,
    editable: false,
  },
  {
    field: 'category',
    headerName: 'Project Category',
    width: 150,
    editable: false,
  },
  {
    field: 'project_supervisor',
    headerName: 'Supervisor',
    width: 150,
    editable: false,
  },
  {
    field: 'grade',
    headerName: 'Grade',
    width: 150,
    editable: false,
  },
  {
    field: 'project',
    headerName: 'Project',
    renderCell: (cellValues) => {
      return <FacultyProjectDescription data={cellValues.row.project} />;
    },
  },
];

const IndustryColumns = [
  {
    field: 'is_accepted',
    headerName: 'Accepted',
    width: 100,
    editable: false,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: false,
  },
  {
    field: 'roll_number',
    headerName: 'Roll No',
    width: 150,
    editable: false,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 150,
    editable: false,
  },
  {
    field: 'year',
    headerName: 'Year',
    width: 150,
    editable: false,
  },
  {
    field: 'cgpa',
    headerName: 'CGPA',
    width: 150,
    editable: false,
  },
  {
    field: 'project_title',
    headerName: 'Project Name',
    width: 150,
    editable: false,
  },
  {
    field: 'organization',
    headerName: 'Organization',
    width: 150,
    editable: false,
  },
  {
    field: 'mentors_name',
    headerName: "Mentor's Name",
    width: 150,
    editable: false,
  },
  {
    field: 'mentors_email',
    headerName: "Mentor's Email",
    width: 150,
    editable: false,
  },
  {
    field: 'mentors_designation',
    headerName: "Mentor's Designation",
    width: 150,
    editable: false,
  },
  {
    field: 'grade',
    headerName: 'Grade',
    width: 150,
    editable: false,
  },
  {
    field: 'report_link',
    headerName: 'Report',
    renderCell: (cellValues) => {
      return (
        <IconButton
          href={cellValues.row.report_link}
          aria-label="report link"
          color="primary"
        >
          <LinkIcon />
        </IconButton>
      );
    },
  },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FacultyCourseDetails({ course }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [datarow, setDataRow] = useState([]);
  const [industryApplications, setIndustryApplications] = useState([]);
  const [applicationType, setApplicationType] = React.useState('internal');

  const handleApplicationType = (event, newAlignment) => {
    setApplicationType(newAlignment);
  };

  useEffect(() => {
    instance
      .get(`/projects/course_applications/${course.id}`)
      .then((res) => {
        console.log(res.data);
        setApplications(res.data);
        res.data.map((a) => {
          datarow.push({
            id: a.id,
            name: a.student.user.full_name,
            roll_number: a.student.roll_number,
            email: a.student.user.email,
            year: a.student.year,
            cgpa: a.student.cgpa,
            project_title: a.project.title,
            category: a.project.category
              .map((item) => item.category)
              .join(', '),
            project_supervisor: a.project.faculty.user.full_name,
            grade: a.grade,
            project: a.project,
          });
          setLoading(false);
          console.log(datarow);
        });
      })
      .catch((error) => console.log(error));

    instance
      .get(`/projects/course_industry_applications/${course.id}`)
      .then((res) => {
        console.log(res.data);
        res.data.map((a) => {
          industryApplications.push({
            id: a.id,
            is_accepted: a.is_accepted,
            name: a.student.user.full_name,
            roll_number: a.student.roll_number,
            email: a.student.user.email,
            year: a.student.year,
            cgpa: a.student.cgpa,
            project_title: a.title,
            category: a.category.category,
            organization: a.organization_name,
            mentors_name: a.mentors_name,
            mentors_designation: a.mentors_designation,
            mentors_email: a.mentors_email,
            grade: a.grade,
            report_link: a.report_link,
          });
          console.log(industryApplications);
          setLoading(false);
          console.log(datarow);
        });
      })
      .catch((error) => console.log(error));
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={2} className={styles.listHeader}>
          <Grid
            container
            direction="row"
            spacing={5}
            style={{ width: '100%', margin: '0 auto' }}
          >
            <Paper elevation={3} className={styles.course}>
              <div className={styles.courseCode}>{course.course_code}</div>
              <div className={styles.courseName}>{course.course_name}</div>
              <div className={styles.footer}>
                <div className={styles.applications}>
                  <button
                    className={styles.applicants}
                    onClick={() => handleClickOpen()}
                  >
                    Applicants:{' '}
                    {applications.length + industryApplications.length}
                  </button>
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        fullScreen
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }} style={{ marginBottom: '50px' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {course.course_code}
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
          <Grid
            container
            direction="row"
            spacing={5}
            style={{ width: '100%', margin: '0 auto 0 auto' }}
          >
            <ToggleButtonGroup
              color="primary"
              value={applicationType}
              exclusive
              onChange={handleApplicationType}
              aria-label="Platform"
            >
              <ToggleButton value="internal">Internal</ToggleButton>
              <ToggleButton value="industry">Industry</ToggleButton>
            </ToggleButtonGroup>
            <Box sx={{ height: 600, width: '100%' }}>
              {applicationType === 'internal' ? (
                <DataGrid
                  pagination
                  rows={datarow}
                  columns={columns}
                  // pageSize={10}
                  // rowsPerPageOptions={[10]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  components={{ Toolbar: GridToolbar }}
                  initialState={{ pagination: { pageSize: 25 } }}
                />
              ) : (
                <DataGrid
                  pagination
                  rows={industryApplications}
                  columns={IndustryColumns}
                  // pageSize={10}
                  // rowsPerPageOptions={[10]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  components={{ Toolbar: GridToolbar }}
                  initialState={{ pagination: { pageSize: 25 } }}
                />
              )}
            </Box>
          </Grid>
        </Container>
      </Dialog>
    </>
  );
}
