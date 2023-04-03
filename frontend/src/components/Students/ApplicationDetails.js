/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@material-ui/core/Typography';
import ApplicationNavbar from './ApplicationNavbar';
import ApplicationComments from './ApplicationComments';
import projectStyles from '../../styles/components/Students/ProjectDetailsModal.module.css';
import applicationStyles from '../../styles/components/Students/ApplicationDetails.module.css';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';


const ProjectDetailsModal = ({ applicationData, projectData }) => {
	const [open, setOpen] = useState(false);
	const [tab, setTab] = useState(0);
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
		setApplicationType(applicationData.application_type.application_type);
		setCourseCode(applicationData.course_code.course_code);
		setResumeLink(applicationData.resume_link);
		setNotes(applicationData.notes);
		setOpen(false);
		setTab(0);
	};

	const changeTab = (newTab) => {
		setApplicationType(applicationData.application_type.application_type);
		setCourseCode(applicationData.course_code.course_code);
		setResumeLink(applicationData.resume_link);
		setNotes(applicationData.notes);
		setTab(newTab);
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


	const handleUpdateApplication = () => {
		setLoading(true);
		var form = new FormData();
		form.append('project_id', projectData.id);
		form.append('application_type', applicationType);
		form.append('course_code', courseCode);
		form.append('resume_link', resumeLink);
		form.append('notes', notes);
		instance
			.put(`/projects/student_applications/${applicationData.id}`, form)
			.then((res) => {
				if (res.status === 200) {
					handleClose();
					window.alert('Application updated successfully');
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

	useEffect(() => {
		instance
			.get('/projects/application_course_codes')
			.then((res) => {
				setCourseCodes(res.data);
				setApplicationType(applicationData.application_type.application_type);
				setCourseCode(applicationData.course_code.course_code);
				setResumeLink(applicationData.resume_link);
				setNotes(applicationData.notes);
			})
			.catch((error) => console.log(error));
	}, []);

	return (
		<div>
			<button
				className={projectStyles.projectDetails}
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
				aria-labelledby={projectData.title}
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id={projectData.title}>
					<div className={projectStyles.title}>{projectData.title}</div>
					<div className={projectStyles.faculty}>
						{`${projectData.faculty.user.first_name} ${projectData.faculty.user.last_name} (${projectData.faculty.program_branch.name})`}
					</div>
				</DialogTitle>
				<DialogContent style={{ paddingBottom: 0 }} dividers="true">
					{tab === 0 ? (
						<>
							<div className={projectStyles.categories}>Categories</div>
							<Stack direction="row" className={projectStyles.categoryChips}>
								{projectData.category.map((category) => {
									return <Chip className={projectStyles.category} label={category.category} />;
								})}
							</Stack>
							<div className={projectStyles.description}>Description</div>
							<Typography
								gutterBottom
								dangerouslySetInnerHTML={createText(projectData.description)}
								className={projectStyles.descriptionContent}
							></Typography>
							<div className={projectStyles.deliverables}>Deliverables</div>
							<Typography
								gutterBottom
								dangerouslySetInnerHTML={createText(projectData.deliverables)}
								className={projectStyles.deliverablesContent}
							></Typography>
							{projectData.skills && projectData.skills.length > 0 ? (
								<>
									<div className={projectStyles.skills}>Skills</div>
									<Stack direction="row" className={projectStyles.skillsChips}>
										{projectData.skills?.split(',').map((skill) => {
											return <Chip className={projectStyles.skill} label={skill} />;
										})}
									</Stack>
								</>
							) : null}
							{projectData.courses && projectData.courses.length > 0 ? (
								<>
									<div className={projectStyles.courses}>Courses</div>
									<Stack direction="row" className={projectStyles.coursesChips}>
										{projectData.courses?.split(',').map((course) => {
											return <Chip className={projectStyles.course} label={course} />;
										})}
									</Stack>
								</>
							) : null}
						</>) : tab === 1 ? (
							<>
								<Form>
									<Form.Group className="mb-3" controlId="Application Type">
										<Form.Label className={applicationStyles.applicationType}>
											Application Type
										</Form.Label>
										<Form.Select
											aria-label="Application Type"
											onChange={(event) => handleApplicationType(event)}
											className={applicationStyles.dropDown}
											value={applicationType}
										>
											<option value="Design Credits">Design Credits</option>
											<option value="B.Tech. Project">B.Tech. Project</option>
										</Form.Select>
										<Form.Label className={applicationStyles.courseCodes}>
											Course Code
										</Form.Label>
										<Form.Select
											aria-label="Course Code"
											onChange={(event) => handleCourseCode(event)}
											className={applicationStyles.courseCode}
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
										<Form.Label className={applicationStyles.resume}>Resume Link</Form.Label>
										<Form.Control
											type="text"
											placeholder="Resume Link (Google Drive Folder/File Link)"
											className={applicationStyles.resumeLink}
											onChange={(event) => handleResume(event)}
											value={resumeLink}
										/>
										<Form.Label className={applicationStyles.notes}>
											Notes (If Any)
										</Form.Label>
										<Form.Control
											as="textarea"
											value={notes}
											className={applicationStyles.notesTextArea}
											rows={4}
											onChange={(event) => handleNote(event)}
										/>
									</Form.Group>
									<div className={applicationStyles.projectActions}>
										{applicationData.is_accepted || applicationData.is_withdrawn ?
											null :
											<>
												<Button
													className={applicationStyles.updateButton}
													variant="primary"
													type="submit"
													disabled={!validateResumeLink()}
													onClick={() => handleUpdateApplication()}
												>
													Update
												</Button>
											</>
										}
									</div>
								</Form>
							</>
						) : <ApplicationComments data={applicationData} />}
				</DialogContent>
				<DialogActions style={{ padding: 0 }}>
					<ApplicationNavbar changeTab={changeTab} />
				</DialogActions>
			</Dialog>
		</div >
	);
};

export default ProjectDetailsModal;
