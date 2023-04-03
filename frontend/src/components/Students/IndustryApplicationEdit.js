/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Form from 'react-bootstrap/Form';
import Loading from '../Loading';
import AddIcon from '@mui/icons-material/Add';
import styles from '../../styles/components/Faculty/FacultyProjectCreate.module.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@material-ui/icons/Edit';

export default function IndustryApplicationEdit({application}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(application.title);
  const [description, setDescription] = useState(application.description);
  const [deliverables, setDeliverables] = useState(application.deliverables);
  const [application_type, setApplicationType] = useState(application.application_type.application_type);
  const [category, setCategory] = useState(application.category.category);
  const [course, setCourse] = useState(application.course.course_code);
  const [organization_name, setOrganizationName] = useState(application.organization_name);
  const [mentors_name, setMentorsName] = useState(application.mentors_name);
  const [mentors_designation, setMentorsDesignation] = useState(application.mentors_designation);
  const [mentors_email, setMentorsEmail] = useState(application.mentors_email);
  const [report_link, setReportLink] = useState(application.report_link);
  const [notes, setNotes] = useState(application.notes);
  const [categories, setCategories] = useState([]);
  const [application_type_list, setApplicationTypeList] = useState([]);
  const [course_list, setCourseList] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setTitle(application.title);
    setDescription(application.description);
    setDeliverables(application.deliverables);
    setApplicationType(application.application_type.application_type);
    setCategory(application.category.category);
    setCourse(application.course.course_code);
    setOrganizationName(application.organization_name);
    setMentorsDesignation(application.mentors_designation);
    setMentorsEmail(application.mentors_email);
    setReportLink(application.report_link);
    setNotes(application.notes);
    setOpen(false);
  };

  const validateProjectFields = () => {
    if (organization_name === '' || mentors_name === '' || mentors_designation === '' || mentors_email === '' || title === '' || description === '' || deliverables === '' || application_type === '' || category === '' || course === '') {
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log(application);
    instance
      .get('/projects/categories/')
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
      })
      .catch((error) => console.log(error));
    instance
      .get('/projects/types/')
      .then((res) => {
        setApplicationTypeList(res.data);
      })
      .catch((error) => console.log(error));
    instance
      .get('/projects/application_course_codes')
      .then((res) => {
        setCourseList(res.data);
      })
      .then(() => setLoading(false))
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = () => {
    var form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('deliverables', deliverables);
    form.append('application_type', application_type);
    form.append('category', category);
    form.append('course_code', course);
    form.append('organization_name', organization_name);
    form.append('mentors_name', mentors_name);
    form.append('mentors_designation', mentors_designation);
    form.append('mentors_email', mentors_email);
    form.append('report_link', report_link);
    form.append('notes', mentors_name);
    console.log(form);
    instance
      .put(`/projects/student_industry_applications/${application.id}`, form)
      .then((res) => {
        if (res.status === 200) {
          window.alert('Application submitted successfully');
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
      <div className={styles.addProjectAction}>
        <button
          className={styles.addProjectButton}
          style={{ marginInline: 10}}
          type="submit"
          onClick={() => handleOpen()}
        >
          <EditIcon fontSize="small" /> <span className={styles.AddIconText}>Edit</span>
        </button>
      </div>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => handleClose()}
        scroll="paper"
        aria-labelledby="Create New Project"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="New_Project">
          <div className={styles.title}>Update Application</div>
        </DialogTitle>
        {loading ? (
          <Loading />
        ) : (
          <DialogContent dividers="true">
            <Form>
              <Form.Group className="mb-3" controlId="Application Type">
                <Form.Label className={styles.projectTitle}>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  className={styles.inputBox}
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
                <Form.Label className={styles.description}>
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className={styles.inputBox}
                  rows={4}
                  placeholder="Description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
                <Form.Label className={styles.deliverables}>
                  Deliverables
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className={styles.inputBox}
                  rows={4}
                  placeholder="Deliverables"
                  onChange={(e) => setDeliverables(e.target.value)}
                  value={deliverables}
                />
                <Form.Label className={styles.deliverables}>Application Type</Form.Label>
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    value={application_type}
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={(e) => setApplicationType(e.target.value)}
                  >
                    {application_type_list.map((type) => {
                      return (
                        <MenuItem value={type.application_type}>{type.application_type}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
                <Form.Label className={styles.deliverables}>Category</Form.Label>
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    value={category}
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((category_obj) => {
                      return (
                        <MenuItem value={category_obj.category}>{category_obj.category}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
                <Form.Label className={styles.deliverables}>Course Code</Form.Label>
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    value={course}
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={(e) => setCourse(e.target.value)}
                  >
                    {course_list.map((course) => {
                      return (
                        <MenuItem value={course.course_code}>{course.course_code}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
                <Form.Label className={styles.deliverables}>
                  Organization Name
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className={styles.inputBox}
                  rows={4}
                  placeholder="Organization Name"
                  onChange={(e) => setOrganizationName(e.target.value)}
                  value={organization_name}
                />
                <Form.Label className={styles.deliverables}>
                  Mentor's Name
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className={styles.inputBox}
                  rows={4}
                  placeholder="Mentor's Name"
                  onChange={(e) => setMentorsName(e.target.value)}
                  value={mentors_name}
                />
                <Form.Label className={styles.deliverables}>
                  Mentor's Designation
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className={styles.inputBox}
                  rows={4}
                  placeholder="Mentor's Designation"
                  onChange={(e) => setMentorsDesignation(e.target.value)}
                  value={mentors_designation}
                />
                <Form.Label className={styles.deliverables}>
                  Mentors Email
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className={styles.inputBox}
                  rows={4}
                  placeholder="Mentors Email"
                  onChange={(e) => setMentorsEmail(e.target.value)}
                  value={mentors_email}
                />
                <Form.Label className={styles.deliverables}>
                  Report Link
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className={styles.inputBox}
                  rows={4}
                  placeholder="Report Link"
                  onChange={(e) => setReportLink(e.target.value)}
                  value={report_link}
                />
                <Form.Label className={styles.deliverables}>
                  Notes
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className={styles.inputBox}
                  rows={4}
                  placeholder="Notes"
                  onChange={(e) => setNotes(e.target.value)}
                  value={notes}
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
