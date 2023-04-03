import * as React from 'react';
import DepatmentCourseApplications from '../Department/DepartmentCourseApplications';
import styles from '../../styles/components/Department/DepartmentCourseCard.module.css';
import DepartmentCourseEdit from './DepartmentCourseEdit';
import FadeUpWhenVisible from '../Animation/FadeUp';
import Paper from '@material-ui/core/Paper';
import IconButton from '@mui/material/IconButton';
import EmailIcon from '@material-ui/icons/Email';
import Tooltip from '@mui/material/Tooltip';

export default function DepartmentCourseCard({ course }) {
  return (
    <FadeUpWhenVisible>
      <Paper elevation={3} className={styles.project}>
        <div className={styles.header}>
          <div className={styles.courseCode}>{course.course_code}</div>
          <div className={styles.courseActions}>
            <DepartmentCourseEdit course={course} />
            <Tooltip placement="top" title={course.faculty.user.email}>
              <IconButton
                className={styles.email}
                href={`mailto:${course.faculty.user.email}`}
              >
                <EmailIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className={styles.courseAdvisor}>
          {course.faculty.user.full_name}
        </div>
        <div className={styles.footer}>
          <div className={styles.applications}>
            <DepatmentCourseApplications course={course} />
          </div>
        </div>
      </Paper>
    </FadeUpWhenVisible>
  );
}
