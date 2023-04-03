/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@material-ui/core/Typography';
import styles from '../../styles/components/Students/ProjectDetailsModal.module.css';

const ProjectDetailsModal = ({ data }) => {
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

  const descriptionElementRef = React.useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <button
        className={styles.projectDetails}
        onClick={() => handleClickOpen()}
      >
        Details
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
          <div className={styles.categories}>Categories</div>
          <Stack direction="row" className={styles.categoryChips}>
            {data.category.map((category) => {
              return <Chip className={styles.category} label={category.category} />;
            })}
          </Stack>
          <div className={styles.description}>Description</div>
          <Typography
            gutterBottom
            dangerouslySetInnerHTML={createText(data.description)}
            className={styles.descriptionContent}
          ></Typography>
          <div className={styles.deliverables}>Deliverables</div>
          <Typography
            gutterBottom
            dangerouslySetInnerHTML={createText(data.deliverables)}
            className={styles.deliverablesContent}
          ></Typography>
          {data.skills && data.skills.length > 0 ? (
            <>
              <div className={styles.skills}>Skills</div>
              <Stack direction="row" className={styles.skillsChips}>
                {data.skills?.split(',').map((skill) => {
                  return <Chip className={styles.skill} label={skill} />;
                })}
              </Stack>
            </>
          ) : null}
          {data.courses && data.courses.length > 0 ? (
            <>
              <div className={styles.courses}>Courses</div>
              <Stack direction="row" className={styles.coursesChips}>
                {data.courses?.split(',').map((course) => {
                  return <Chip className={styles.course} label={course} />;
                })}
              </Stack>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetailsModal;
