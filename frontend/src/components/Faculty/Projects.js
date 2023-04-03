import React from 'react';
import Paper from '@material-ui/core/Paper';
import styles from '../../styles/components/Students/ProjectsListCard.module.css';
import FadeUpWhenVisible from '../Animation/FadeUp';
import ProjectDetailsModal from '../../components/Students/ProjectDetailsModal';
import ProjectApplyModal from '../../components/Students/ProjectApplyModal';

const ProjectListCard = ({ data }) => {
  return (
    <FadeUpWhenVisible>
      <Paper elevation={3} className={styles.project}>
        <div className={styles.projectTitle}>{data.title}</div>
        <div className={styles.faculty}>
          {`${data.faculty.user.first_name} ${data.faculty.user.last_name} (${data.faculty.program_branch.name})`}
        </div>
        <div className={styles.projectActions}>
          <ProjectDetailsModal data={data} />
          <ProjectApplyModal data={data} />
        </div>
      </Paper>
    </FadeUpWhenVisible>
  );
};

export default ProjectListCard;
