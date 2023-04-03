import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from '../../styles/components/Students/ProjectApplyModal.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProjectApplyModal = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationType, setApplicationType] = useState('Design Credits');
  const [courseCodes, setCourseCodes] = useState([]);
  const [courseCode, setCourseCode] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [notes, setNotes] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApplicationType = (event) => {
    setApplicationType(event.target.value);
  };

  const handleCourseCode = (event) => {
    setCourseCode(event.target.value);
  };

  const handleResume = (event) => {
    setResumeLink(event.target.value);
  };

  const handleNote = (event) => {
    setNotes(event.target.value);
  };

  const resetForm = () => {
    setApplicationType('Design Credits');
    setCourseCode(courseCodes[0].course_code);
    setResumeLink('');
    setNotes('');
  };

  const validateResumeLink = () => {
    if (resumeLink.length > 0) {
      if (
        resumeLink.match('https://drive.google.com/drive/folders/+') ||
        resumeLink.match('https://drive.google.com/file/+')
      ) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (project_id) => {
    setLoading(true);
    var form = new FormData();
    form.append('project_id', project_id);
    form.append('application_type', applicationType);
    form.append('course_code', courseCode);
    form.append('resume_link', resumeLink);
    form.append('notes', notes);
    console.log(form);
    instance
      .post('/projects/student_applications/', form)
      .then((res) => {
        if (res.status === 200) {
          handleClose();
          window.alert('Application submitted successfully');
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          setError('Invalid Form. All * fields are required');
        }
        setLoading(false);
      });
  };

  const descriptionElementRef = React.useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    instance
      .get('/projects/application_course_codes')
      .then((res) => {
        setCourseCodes(res.data);
        setCourseCode(res.data[0].course_code);
      })
      .then(() => setLoading(false))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <button className={styles.projectApply} onClick={() => handleClickOpen()}>
        Apply
      </button>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => handleClose()}
        scroll="paper"
        aria-labelledby={data.title}
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id={data.title}>
          <div className={styles.title}>{data.title}</div>
          <div className={styles.faculty}>
            {`${data.faculty.user.first_name} ${data.faculty.user.last_name} (${data.faculty.program_branch.name})`}
          </div>
        </DialogTitle>
        <DialogContent dividers="true">
          <Form>
            <Form.Group className="mb-3" controlId="Application Type">
              <Form.Label className={styles.applicationType}>
                Application Type
              </Form.Label>
              <Form.Select
                aria-label="Application Type"
                onChange={(event) => handleApplicationType(event)}
                className={styles.dropDown}
                value={applicationType}
              >
                <option value="Design Credits">Design Credits</option>
                <option value="B.Tech. Project">B.Tech. Project</option>
              </Form.Select>
              <Form.Label className={styles.courseCodes}>
                Course Code
              </Form.Label>
              <Form.Select
                aria-label="Course Code"
                onChange={(event) => handleCourseCode(event)}
                className={styles.courseCode}
                value={courseCode}
              >
                {courseCodes?.map((courseCode) => {
                  return (
                    <option value={courseCode.course_code}>
                      {courseCode.course_code} ({courseCode.course_name})
                    </option>
                  );
                })}
              </Form.Select>
              <Form.Label className={styles.resume}>Resume Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Resume Link (Google Drive Folder/File Link)"
                className={styles.resumeLink}
                onChange={(event) => handleResume(event)}
                value={resumeLink}
              />
              <Form.Label className={styles.notes}>Notes (If Any)</Form.Label>
              <Form.Control
                as="textarea"
                value={notes}
                className={styles.notesTextArea}
                rows={6}
                onChange={(event) => handleNote(event)}
              />
            </Form.Group>
            <div className={styles.projectActions}>
              <Button
                variant="primary"
                type="button"
                onClick={() => resetForm()}
              >
                Clear
              </Button>
              <Button
                className={styles.submitButton}
                variant="primary"
                type="submit"
                disabled={!validateResumeLink()}
                onClick={() => handleSubmit(data.id)}
              >
                Submit
              </Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectApplyModal;
