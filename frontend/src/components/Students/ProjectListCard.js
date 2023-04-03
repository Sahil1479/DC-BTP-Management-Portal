import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import styles from '../../styles/components/Students/ProjectsListCard.module.css';
import FadeUpWhenVisible from '../Animation/FadeUp';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@material-ui/core/Typography';
import EmailIcon from '@material-ui/icons/Email';
import IconButton from '@mui/material/IconButton';
import ProjectDetailsModal from '../../components/Students/ProjectDetailsModal';
import ProjectApplyModal from '../../components/Students/ProjectApplyModal';

const ProjectListCard = ({ data }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createText = (text) => {
    return { __html: text };
  };

  return (
    <FadeUpWhenVisible>
      <Paper elevation={3} className={styles.project}>
        <div className={styles.projectTitle}>{data.title}</div>
        <button className={styles.faculty} onClick={() => handleClickOpen()}>
          {`${data.faculty.user.full_name} (${data.faculty.program_branch.name})`}
        </button>
        <Dialog
          fullWidth
          maxWidth="sm"
          open={open}
          onClose={() => handleClose()}
          scroll="paper"
          aria-labelledby={data.faculty.user.full_name}
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id={data.faculty.user.full_name}>
            <div className={styles.header}>
              <div className={styles.facultyName}>
                {data.faculty.user.full_name}
              </div>
              <IconButton
                className={styles.email}
                href={`mailto:${data.faculty.user.email}`}
              >
                <EmailIcon />
              </IconButton>
            </div>
            <div className={styles.facultyDepartment}>
              Department:{' '}
              <span style={{ fontWeight: 'normal' }}>
                {data.faculty.program_branch.name}
              </span>
            </div>
          </DialogTitle>
          <DialogContent>
            <Typography
              gutterBottom
              dangerouslySetInnerHTML={createText(data.faculty.description)}
              className={styles.description}
            ></Typography>
          </DialogContent>
        </Dialog>
        <div className={styles.projectActions}>
          <ProjectDetailsModal data={data} />
          <ProjectApplyModal data={data} />
        </div>
      </Paper>
    </FadeUpWhenVisible>
  );
};

export default ProjectListCard;
