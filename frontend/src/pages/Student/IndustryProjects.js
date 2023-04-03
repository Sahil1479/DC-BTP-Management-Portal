/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Loading from '../../components/Loading';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import { CSVLink } from 'react-csv';
import IndustryApplicationCard from '../../components/Students/IndustryApplicationCard';
import styles from '../../styles/pages/Students/ProjectsApplied.module.css';
import IndustryApplicationCreate from '../../components/Students/IndustryApplicationCreate';

const IndustryProjects = () => {
	const [loading, setLoading] = useState(true);
	const [applications, setApplications] = useState([]);

	useEffect(() => {
		instance
			.get('/projects/student_industry_applications/')
			.then((res) => {
				console.log(res.data);
				setApplications(res.data);
			})
			.then(() => setLoading(false))
			.catch((error) => console.log(error));
	}, []);

	return (
		<div style={{ height: 'auto', width: '100%' }}>
			{loading ? (
				<Loading />
			) : (
				<>
					<Container maxWidth="lg">
						<div className={styles.header}>
							<div className={styles.searchbar}>
								<SearchIcon className={styles.searchInput} />
								<input
									type="text"
									placeholder="Search applications..."
									className={styles.searchInput}
								/>
							</div>
							<div className={styles.exportButton}>
								<IndustryApplicationCreate />
							</div>
						</div>
						<Grid
							container
							direction="row"
							spacing={5}
							style={{ width: '100%', margin: '12rem auto auto auto' }}
						>
							{applications.length === 0 ? <div
								style={{
									height: '100vh',
									width: '100%',
									marginTop: '-10rem',
									textAlign: 'center',
									lineHeight: '100vh',
								}}
								>
								NO APPLICATIONS AVAILABLE
								</div> : applications.map((application) => {
								return (
									<Grid key={application.id} item xs={12} sm={12} md={6} lg={6}>
										<IndustryApplicationCard data={application} />
									</Grid>
								);
							})}
						</Grid>
					</Container>
				</>
			)}
		</div>
	);
};

export default IndustryProjects;
