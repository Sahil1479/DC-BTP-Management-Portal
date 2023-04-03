import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@material-ui/core/Typography';
import styles from '../../styles/components/Faculty/FacultyProjectDescription.module.css';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function FacultyProjectDescription({ data }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div className={styles.viewButton}>
        <IconButton onClick={() => handleOpen()}>
          <VisibilityIcon />
        </IconButton>
      </div>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => handleClose()}
        scroll="paper"
        aria-labelledby={'data.title'}
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id={data.id}>
          <div className={styles.title}>{data.title}</div>
          <div className={styles.faculty}>
            <span>
              {' '}
              Status:{' '}
              {data.active ? (
                <span style={{ color: '#3DBE29', fontWeight: 'bold' }}>
                  ACTIVE
                </span>
              ) : (
                <span style={{ color: '#ed5e68', fontWeight: 'bold' }}>
                  INACTIVE
                </span>
              )}
            </span>
          </div>
        </DialogTitle>
        <DialogContent dividers="true">
          <div className={styles.categories}>Categories</div>
          <Stack direction="row" className={styles.categoryChips}>
            {data.category.map((category) => {
              return (
                <Chip className={styles.category} label={category.category} />
              );
            })}
          </Stack>
          <div className={styles.description}>Description</div>
          <Typography gutterBottom className={styles.descriptionContent}>
            {data.description}
          </Typography>
          <div className={styles.deliverables}>Deliverables</div>
          <Typography gutterBottom className={styles.deliverablesContent}>
            {data.deliverables}
          </Typography>
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
}
