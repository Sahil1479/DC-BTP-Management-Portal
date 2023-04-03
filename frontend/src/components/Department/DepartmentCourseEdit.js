import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import Form from 'react-bootstrap/Form';
import IconButton from '@mui/material/IconButton';
import Loading from '../Loading';
import styles from '../../styles/components/Faculty/FacultyProjectCreate.module.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';

export default function DepartmentCourseEdit({ course }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [course_code, setCourseCode] = useState(course.course_code);
  const [course_name, setCourseName] = useState(course.course_name);
  const [course_advisor, setCourseAdvisor] = useState(course.faculty);
  const [dept_faculty, setDeptFaculty] = useState([]);
  const [inputFacultyValue, setInputFacultyValue] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateProjectFields = () => {
    if (course_code === '' || course_name === '' || course_advisor === null) {
      return true;
    }
    return false;
  };

  const resetForm = () => {
    setCourseCode('');
    setCourseName('');
    setCourseAdvisor(null);
  };

  useEffect(() => {
    instance
      .get('/projects/department_faculties/')
      .then((res) => {
        setDeptFaculty(res.data);
      })
      .then(() => setLoading(false))
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = () => {
    var form = new FormData();
    form.append('course_code_id', course.id);
    form.append('course_code', course_code);
    form.append('course_name', course_name);
    form.append('course_advisor_id', course_advisor.id);
    console.log(form);
    instance
      .put('/projects/department_courses/', form)
      .then((res) => {
        if (res.status === 200) {
          window.alert('Course created successfully');
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          window.alert('Invalid Form');
        }
        setLoading(false);
      });
  };

  return (
    <div>
      <div className={styles.editButton}>
        <IconButton onClick={() => handleOpen()}>
          <EditIcon />
        </IconButton>
      </div>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => handleClose()}
        scroll="paper"
        aria-labelledby="Course Updated"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="Edit_Course">
          <div className={styles.title}>Update Course</div>
        </DialogTitle>
        {loading ? (
          <Loading />
        ) : (
          <DialogContent dividers="true">
            <Form>
              <Form.Group className="mb-3" controlId="Application Type">
                <Form.Label className={styles.projectTitle}>
                  Course Code
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  className={styles.inputBox}
                  onChange={(e) => setCourseCode(e.target.value)}
                  value={course_code}
                />
                <Form.Label className={styles.description}>
                  Course Name
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className={styles.inputBox}
                  rows={4}
                  placeholder="Course Name"
                  onChange={(e) => setCourseName(e.target.value)}
                  value={course_name}
                />
                <Form.Label className={styles.deliverables}>
                  Course Advisor
                </Form.Label>
                <Autocomplete
                  value={course_advisor}
                  onChange={(event, newValue) => {
                    console.log(newValue);
                    setCourseAdvisor(newValue);
                  }}
                  inputValue={inputFacultyValue}
                  onInputChange={(event, newInputFacultyValue) => {
                    setInputFacultyValue(newInputFacultyValue);
                  }}
                  id="controllable-states-demo"
                  options={dept_faculty}
                  getOptionLabel={(option) => option.user.full_name}
                  sx={{ width: 300 }}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      {option.user.full_name} ({option.user.email})
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Course Advisor" />
                  )}
                />
              </Form.Group>
              <div className={styles.projectActions}>
                <Button
                  className={styles.submitButton}
                  variant="primary"
                  type="submit"
                  disabled={validateProjectFields()}
                  onClick={() => handleSubmit()}
                >
                  Update
                </Button>
              </div>
            </Form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
