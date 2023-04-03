/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import EmailIcon from '@material-ui/icons/Email';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Form from 'react-bootstrap/Form';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import FacultyApplicationEdit from './FacultyApplicationEdit.js';
import styles from '../../styles/components/Faculty/FacultyApplicationCard.module.css';
import Tooltip from '@mui/material/Tooltip';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function FacultyApplicationCard({ application }) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleComment = (event) => {
    setComment(event.target.value);
  };

  const resetComment = () => {
    setComment('');
  };

  const validateComment = () => {
    if (comment === '') {
      return true;
    }
    return false;
  };

  const handleSubmit = () => {
    var form = new FormData();
    form.append('comment', comment);
    instance
      .post(`/projects/applications_comments/${application.id}`, form)
      .then((res) => {
        if (res.status === 200) {
          window.alert('Comment posted successfully');
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          window.alert('Invalid Form');
        }
      });
  };

  const sortComments = (data) => {
    return (
      data.sort((x, y) => {
        return new Date(x.timestamp) > new Date(y.timestamp) ? 1 : -1
      })
    ).reverse()
  };

  useEffect(() => {
    instance
      .get(`/projects/applications_comments/${application.id}`)
      .then((res) => {
        console.log(sortComments(res.data));
        setCommentsList(sortComments(res.data));
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Card class={styles.studentApplications}>
      <div className={styles.header}>
        <div className={styles.studentName}>{application.student.user.full_name} ({application.student.roll_number})</div>
        <div className={styles.applicationActions}>
          <FacultyApplicationEdit className={styles.editApplication} data={application} />
          <Tooltip placement="top" title={application.student.user.email}>
            <IconButton
              className={styles.email}
              href={`mailto:${application.student.user.email}`}
            >
              <EmailIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className={styles.department}>{application.student.program_branch.program} {application.student.program_branch.name}</div>
      <div className={styles.basicProfileDetails}>
        Year: {application.student.year}{' '}
        <span style={{ marginLeft: '1rem' }}>
          CGPA: {application.student.cgpa}{' '}
        </span>
      </div>
      <CardActions className={styles.expandCard}>
        {application.is_accepted ? (
          <span>
            Status: {' '}
            <span style={{ color: '#3DBE29', fontWeight: 'bold' }}>
              Approved
            </span>
          </span>
        ) : (
          <span>
            Status: {' '}
            <span style={{ color: '#ed5e68', fontWeight: 'bold' }}>
              Not Approved
            </span>
          </span>
        )}
        <ExpandMore
          expand={expanded}
          onClick={() => handleExpandClick()}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className={styles.cardContent}>
          <div className={styles.courseCode}>Course Code</div>
          <Typography gutterBottom className={styles.courseCodeContent}>{`${application.course_code.course_code} ${application.course_code.course_name}`}</Typography>
          <div className={styles.applicationType}>Application Type</div>
          <Typography gutterBottom className={styles.applicationTypeContent}>{application.application_type.application_type}</Typography>
          <div className={styles.resume}>Resume</div>
          <Typography gutterBottom className={styles.resumeContent}>{application.resume_link === '' ? '-' : <a href={application.resume_link}>Link</a>}</Typography>
          <div className={styles.notes}>Notes</div>
          <Typography paragraph className={styles.notesContent}>{application.notes === '' ? '-' : application.notes}</Typography>
          {application.student.skills && application.student.skills.length > 0 ? (
            <>
              <div className={styles.skills}>Skills</div>
              <Stack direction="row" className={styles.skillsChips}>
                {application.student.skills?.split(',').map((skill) => {
                  return <Chip className={styles.skill} label={skill} />;
                })}
              </Stack>
            </>
          ) : null}
          {application.student.courses && application.student.courses.length > 0 ? (
            <>
              <div className={styles.courses}>Courses</div>
              <Stack direction="row" className={styles.coursesChips}>
                {application.student.courses?.split(',').map((course) => {
                  return <Chip className={styles.course} label={course} />;
                })}
              </Stack>
            </>
          ) : null}
        </CardContent>
        <div className={styles.comments}>Comments (Track Progress)</div>
        <Form>
          <Form.Group className="mb-3" controlId="Comment Section">
            <Form.Control
              as="textarea"
              value={comment}
              className={styles.commentTextArea}
              rows={3}
              onChange={(event) => handleComment(event)}
            />
          </Form.Group>
          <div className={styles.projectActions}>
            <button
              variant="primary"
              type="button"
              onClick={() => resetComment()}
            >
              Clear
            </button>
            <button
              className={styles.submitButton}
              variant="primary"
              type="submit"
              disabled={validateComment()}
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          </div>
        </Form>
        <CardContent className={styles.commentsContent}>
          {commentsList && commentsList.length > 0 ? (
            <>
              {commentsList.map((commentContent) => {
                return (
                  <div>
                    <div className={styles.commentHeader}>
                      <span className={styles.commentUser}>{commentContent.user.full_name}</span>
                      <span className={styles.commentTimestamp}>{new Date(commentContent.timestamp).toLocaleString()}</span>
                    </div>
                    <span className={styles.comment}>{commentContent.comment}</span>
                  </div>
                );
              })}
            </>
          ) : null}
        </CardContent>
      </Collapse>
    </Card>
  );
}
