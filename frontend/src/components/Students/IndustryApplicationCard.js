/* eslint-disable prettier/prettier */
import React from 'react';
import instance from '../../api/axios';
import Paper from '@material-ui/core/Paper';
import styles from '../../styles/components/Students/ProjectsListCard.module.css';
import FadeUpWhenVisible from '../Animation/FadeUp';
import ApplicationDetails from './ApplicationDetails';
import IndustryApplicationEdit from './IndustryApplicationEdit';

const IndustryApplicationCard = ({ data }) => {
	const handleDeleteApplication = () => {
		instance
			.delete(`/projects/student_industry_applications/${data.id}`)
			.then((res) => {
				if (res.status === 200) {
					window.alert('Application deleted successfully');
					window.location.reload();
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<FadeUpWhenVisible>
			<Paper elevation={3} className={styles.project}>
				<div className={styles.header}>
					<div className={styles.projectTitle}>{data.title}</div>
					<div className={styles.status}>
						{data.is_withdrawn ? (
							<span style={{ color: '#ed5e68', fontWeight: 'bold' }}>
								WITHDRAWN
							</span>
						) : data.is_accepted ? (
							<span style={{ color: '#3DBE29', fontWeight: 'bold' }}>
								ACCEPTED
							</span>
						) : (
							<span style={{ color: '#ed5e68', fontWeight: 'bold' }}>
								PENDING
							</span>
						)}
					</div>
				</div>
                <hr />
                <div style={{color: '#646464', fontSize: '17px' }}><b>Application Type:</b> {data.application_type.application_type}</div>
                <div style={{color: '#646464', fontSize: '17px' }}><b>Course Code:</b> {data.course.course_code}</div>
                <div style={{color: '#646464', fontSize: '17px' }}><b>Organization:</b> {data.organization_name}</div>
				<div className={styles.projectActions}>
					{/* <ApplicationDetails applicationData={data} projectData={data.project} /> */}
					{data.is_accepted || data.is_withdrawn ? null :
						<>
							<button
								className={styles.deleteButton}
								type="submit"
								onClick={() => handleDeleteApplication()}
							>
								Delete
							</button>
							<IndustryApplicationEdit application={data} />
						</>
					}
				</div>
			</Paper>
		</FadeUpWhenVisible>
	);
};

export default IndustryApplicationCard;
