/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Loading from '../../components/Loading';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import { CSVLink } from 'react-csv';
import StudentProjectApplication from '../../components/Students/StudentProjectApplication';
import styles from '../../styles/pages/Students/ProjectsApplied.module.css';
import Footer from '../../components/Footer/Footer';

const ProjectsApplied = () => {
	const [loading, setLoading] = useState(true);
	const [applications, setApplications] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [CSVData, setCSVData] = useState([]);

	const handleQueryChange = (event) => {
		setSearchQuery(event.target.value);
		filterData(event.target.value);
	};

	const exportData = () => {
		if (filteredData.length !== 0) {
			const data = [];
			const headers = [
				'title',
				'faculty',
				'department',
				'category',
				'description',
				'deliverables',
				'skills',
				'courses',
				'application_type',
				'course_code',
				'course_name',
				'status',
				'resume_link',
				'notes',
			];
			data.push(headers);
			filteredData.forEach((application) => {
				const exportData = [];
				headers.forEach((header) => {
					if (
						header === 'title' ||
						header === 'description' ||
						header === 'deliverables' ||
						header === 'skills' ||
						header === 'courses'
					) {
						exportData.push(application['project'][header]);
					} else if (header === 'faculty') {
						exportData.push(
							application['project'][header]['user']['full_name']
						);
					} else if (header === 'department') {
						exportData.push(
							application['project']['faculty']['program_branch']['name']
						);
					} else if (header === 'category') {
						exportData.push(application['project']['category']['category']);
					} else if (header === 'application_type') {
						exportData.push(application[header]['application_type']);
					} else if (header === 'course_code') {
						exportData.push(application[header]['course_code']);
					} else if (header === 'course_name') {
						exportData.push(application['course_code']['course_name']);
					} else if (header === 'status') {
						if (application['is_accepted']) {
							exportData.push('Accepted');
						} else {
							exportData.push('Pending');
						}
					} else {
						exportData.push(application[header]);
					}
				});
				data.push(exportData);
			});
			setCSVData(data);
		}
	};

	const filterData = (value) => {
		if (value === '') {
			setFilteredData(applications);
		} else {
			setFilteredData(
				applications.filter((application) => {
					return Object.keys(application).some((key) => {
						if (key === 'application_type') {
							return application[key]['application_type']
								.toString()
								.toLowerCase()
								.includes(value.toLowerCase());
						} else if (key === 'course_code') {
							const course_code = application[key]['course_code']
								.toString()
								.toLowerCase()
								.includes(value.toLowerCase());

							const course_name = application[key]['course_name']
								.toString()
								.toLowerCase()
								.includes(value.toLowerCase());

							return course_code || course_name;
						} else if (key === 'notes' || key === 'resume_link') {
							return application[key]
								.toString()
								.toLowerCase()
								.includes(value.toLowerCase());
						} else if (key === 'is_accepted') {
							let target = '';
							if (application[key].toString().toLowerCase() === 'true') {
								target = 'accepted';
							} else {
								target = 'pending';
							}
							return target.includes(value.toLowerCase());
						} else if (key === 'project') {
							return Object.keys(application[key]).some((projectKey) => {
								if (projectKey === 'category') {
									var present = false;
									application[key][projectKey].forEach((category) => {
										present =
											present ||
											category.category
												.toLowerCase()
												.includes(value.toLowerCase());
									});
									return present;
								} else if (projectKey === 'faculty') {
									const branch = application[key][projectKey]['program_branch'][
										'name'
									]
										.toString()
										.toLowerCase()
										.includes(value.toLowerCase());

									const full_name = application[key][projectKey]['user'][
										'full_name'
									]
										.toString()
										.toLowerCase()
										.includes(value.toLowerCase());

									return branch || full_name;
								} else {
									return application[key][projectKey]
										.toString()
										.toLowerCase()
										.includes(value.toLowerCase());
								}
							});
						}
					});
				})
			);
		}
	};

	useEffect(() => {
		instance
			.get('/projects/student_applications/')
			.then((res) => {
				console.log(res.data);
				setSearchQuery('');
				setApplications(res.data);
				setFilteredData(res.data);
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
					<>
						<Container maxWidth="lg">
							<div className={styles.header}>
								<div className={styles.searchbar}>
									<SearchIcon className={styles.searchInput} />
									<input
										type="text"
										placeholder="Search projects..."
										onChange={(event) => handleQueryChange(event)}
										value={searchQuery}
										className={styles.searchInput}
									/>
								</div>
								<div className={styles.exportButton}>
									<button onClick={() => exportData()}>
										<CSVLink
											className={styles.csvLink}
											filename={'Applications'}
											data={CSVData}
										>
											Export
										</CSVLink>
									</button>
								</div>
							</div>
							<Grid
								container
								direction="row"
								spacing={5}
								style={{ width: '100%', margin: '12rem auto 100vh auto' }}
							>
								{filteredData.length === 0 ? (
									<div
										style={{
											height: '100vh',
											width: '100%',
											textAlign: 'center',
											lineHeight: '100vh',
										}}
									>
										NO ACTIVE APPLICATIONS
									</div>
								) : (
									filteredData.map((application) => {
										return (
											<Grid
												key={application.id}
												item
												xs={12}
												sm={12}
												md={6}
												lg={6}
											>
												<StudentProjectApplication data={application} />
											</Grid>
										);
									})
								)}
							</Grid>
						</Container>
					</>
				)}
			</div>
			<Footer />
		</>
	);
};

export default ProjectsApplied;
