/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Loading from '../../components/Loading';
import Footer from '../../components/Footer/Footer';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import styles from '../../styles/pages/Faculty/FacultyProfile.module.css';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import EditIcon from '@mui/icons-material/Edit';

const FacultyProfile = () => {
	const [loading, setLoading] = useState(true);
	const [facultyProfile, setFacultyProfile] = useState({});
	const [facultyDetails, setFacultyDetails] = useState('');

	const resetForm = () => {
		setFacultyDetails(facultyProfile.description);
	};

	const checkDisabled = (profile) => {
		if (facultyDetails === profile.description) {
			return true;
		}
		return false;
	}

	const handleSubmit = () => {
		setLoading(true);
		var form = new FormData();
		form.append('description', facultyDetails);
		instance
			.put('profile/faculty_profile/', form)
			.then((res) => {
				if (res.status === 200) {
					window.alert('Profile updated successfully');
					window.location.reload();
				}
			})
			.catch((error) => {
				console.log(error);
				// if (error.response) {
				// 	setError('Invalid Form. All * fields are required');
				// }
				setLoading(false);
			});
	};

	useEffect(() => {
		instance
			.get('profile/faculty_profile/')
			.then((res) => {
				console.log(res.data);
				setFacultyProfile(res.data);
				setFacultyDetails(res.data.description);
			})
			.then(() => setLoading(false))
			.catch((error) => console.log(error));
	}, []);

	return (
		<>
			<div style={{ minHeight: '100vh', width: '100%' }}>
				{loading ? (
					<Loading />
				) : (
					<Container maxWidth="lg" style={{ display: 'flex', marginTop: '4rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
						<Grid style={{ width: '100%', paddingTop: '3rem', margin: '0 auto' }} item lg={12} md={12} sm={12} xs={12}>
							<Form>
								<Form.Group className="mb-3" controlId="Application Type">
									<div className={styles.header}>
										<PersonIcon />
										<div className={styles.facultyName}>Name</div>
									</div>
									<Form.Control
										type="text"
										placeholder="Enter Full Name"
										className={styles.facultyNameForm}
										value={facultyProfile.user.full_name}
										disabled
										readOnly
									/>
									<div className={styles.header}>
										<EmailIcon />
										<div className={styles.facultyEmail}>Email</div>
									</div>
									<Form.Control
										type="text"
										placeholder="Enter Email ID"
										className={styles.facultyEmailForm}
										value={facultyProfile.user.email}
										disabled
										readOnly
									/>
									<div className={styles.header}>
										<BadgeIcon />
										<div className={styles.facultyDepartment}>Department</div>
									</div>
									<Form.Control
										type="text"
										placeholder="Enter Department"
										className={styles.facultyDepartmentForm}
										value={facultyProfile.program_branch.name}
										disabled
										readOnly
									/>
									<div className={styles.header}>
										<EditIcon />
										<div className={styles.facultyDescription}>Additional Details</div>
									</div>
									<Form.Control
										as="textarea"
										value={facultyDetails}
										className={styles.facultyDetailsForm}
										rows={6}
										onChange={(e) => setFacultyDetails(e.target.value)}
									/>
								</Form.Group>
								<div className={styles.projectActions}>
									<button
										variant="primary"
										type="button"
										onClick={() => resetForm()}
									>
										Reset
									</button>
									<button
										className={styles.submitButton}
										variant="primary"
										type="submit"
										disabled={checkDisabled(facultyProfile)}
										onClick={() => handleSubmit()}
									>
										Submit
									</button>
								</div>
							</Form>
						</Grid>
					</Container>
				)
				}
			</div >
			<Footer />
		</>
	);
};

export default FacultyProfile;