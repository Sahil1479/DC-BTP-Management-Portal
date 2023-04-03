/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Form from 'react-bootstrap/Form';
import Loading from '../../components/Loading';
import AddIcon from '@mui/icons-material/Add';
import styles from '../../styles/components/Faculty/FacultyProjectCreate.module.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

export default function FacultyProjectCreate() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState([]);
  const [description, setDescription] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [skills, setSkills] = useState('');
  const [courses, setCourses] = useState('');
  const [active, setActive] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleActive = () => {
    setActive(!active);
  };

  const validateProjectFields = () => {
    if (title === '' || description === '' || deliverables === '' || category.length === 0) {
      return true;
    }
    return false;
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategory(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDeliverables('');
    setSkills('');
    setCourses('');
    setActive(false);
    setCategory([]);
  };

  useEffect(() => {
    instance
      .get('/projects/categories/')
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
        setCategory([]);
      })
      .then(() => setLoading(false))
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = () => {
    var form = new FormData();
    form.append('title', title);
    form.append('category', category);
    form.append('description', description);
    form.append('deliverables', deliverables);
    form.append('skills', skills);
    form.append('courses', courses);
    form.append('active', active);
    console.log(form);
    instance
      .post('/projects/projects_floated/', form)
      .then((res) => {
        if (res.status === 200) {
          window.alert('Project created successfully');
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
          type="submit"
          onClick={() => handleOpen()}
        >
          <AddIcon fontSize="small" /> <span className={styles.AddIconText}>Add</span>
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
          <div className={styles.title}>Create New Project</div>
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
                <div className={styles.projectStatus}>
                  <Form.Label className={styles.status}>Status</Form.Label>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    checked={active}
                    label={
                      active ? (
                        <span style={{ color: '#3DBE29', fontWeight: 'bold' }}>
                          ACTIVE
                        </span>
                      ) : (
                        <span style={{ color: '#ed5e68', fontWeight: 'bold' }}>
                          INACTIVE
                        </span>
                      )
                    }
                    onClick={(e) => toggleActive()}
                    className={styles.toggleButton}
                  />
                </div>
                <Form.Label className={styles.category}>Category</Form.Label>
                <div>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    displayEmpty
                    value={category}
                    onChange={(event) => handleChange(event)}
                    input={<OutlinedInput />}
                    labelStyle={{ color: '#ff0000' }}
                    sx={{
                      '.MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #ced4da',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #86b7fe',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #ced4da',
                      },
                    }}
                    style={{ width: '50%' }}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <span style={{ color: '#848484' }}>Select Categories</span>;
                      }
                      return <span style={{ color: '#848484' }}>{selected.join(', ')}</span>;
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    {categories.map((c) => (
                      <MenuItem
                        key={c.category}
                        value={c.category}
                      >
                        <Checkbox checked={category.indexOf(c.category) > -1} />
                        <ListItemText primary={c.category} />
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <Form.Label className={styles.skills}>
                  Skills (comma seperated)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  value={skills}
                  className={styles.inputBox}
                  rows={3}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <Form.Label className={styles.courses}>
                  Courses (comma seperated)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  value={courses}
                  className={styles.inputBox}
                  rows={3}
                  onChange={(e) => setCourses(e.target.value)}
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
                  disabled={validateProjectFields()}
                  onClick={() => handleSubmit()}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
