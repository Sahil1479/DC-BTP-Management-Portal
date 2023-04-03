/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import Loading from '../../components/Loading';
import Footer from '../../components/Footer/Footer';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import styles from '../../styles/pages/Students/StudentProfile.module.css';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import InfoIcon from '@mui/icons-material/Info';
import SchoolIcon from '@mui/icons-material/School';
import EngineeringIcon from '@mui/icons-material/Engineering';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SettingsIcon from '@mui/icons-material/Settings';

const StudentProfile = () => {
    const [loading, setLoading] = useState(true);
    const [studentProfile, setStudentProfile] = useState({});
    const [skills, setSkills] = useState('');
    const [courses, setCourses] = useState('');

    const resetForm = () => {
        setSkills(studentProfile.skills);
        setCourses(studentProfile.courses);
    };

    const checkDisabled = (profile) => {
        if (skills === profile.skills && courses === profile.courses) {
            return true;
        }
        return false;
    }

    const handleSubmit = () => {
        setLoading(true);
        var form = new FormData();
        form.append('skills', skills);
        form.append('courses', courses);
        instance
            .put('profile/student_profile/', form)
            .then((res) => {
                if (res.status === 200) {
                    window.alert('Profile updated successfully');
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        instance
            .get('profile/student_profile/')
            .then((res) => {
                console.log(res.data);
                setStudentProfile(res.data);
                setSkills(res.data.skills);
                setCourses(res.data.courses);
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
                        <Grid style={{ width: '100%', paddingTop: '1rem', margin: '0 auto' }} item lg={12} md={12} sm={12} xs={12}>
                            <Form>
                                <Form.Group className="mb-3" controlId="Application Type">
                                    <div className={styles.header}>
                                        <PersonIcon />
                                        <div className={styles.studentName}>Name</div>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Full Name"
                                        className={styles.studentNameForm}
                                        value={studentProfile.user.full_name}
                                        disabled
                                        readOnly
                                    />
                                    <div className={styles.header}>
                                        <InfoIcon />
                                        <div className={styles.studentRollNumber}>Roll Number</div>
                                    </div>
                                    <Form.Control
                                        placeholder="Enter Roll Number"
                                        className={styles.studentRollNumberForm}
                                        value={studentProfile.roll_number}
                                        disabled
                                        type="text"
                                        readOnly
                                    />
                                    <div className={styles.header}>
                                        <EmailIcon />
                                        <div className={styles.studentEmail}>Email</div>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Email ID"
                                        className={styles.studentEmailForm}
                                        value={studentProfile.user.email}
                                        disabled
                                        readOnly
                                    />
                                    <div className={styles.header}>
                                        <BadgeIcon />
                                        <div className={styles.studentDepartment}>Department</div>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Department"
                                        className={styles.studentDepartmentForm}
                                        value={studentProfile.program_branch.name}
                                        disabled
                                        readOnly
                                    />
                                    <div style={{ display: 'flex', width: '100%' }}>
                                        <div style={{ width: '50%', marginRight: '1rem' }}>
                                            <div className={styles.header}>
                                                <SchoolIcon />
                                                <div className={styles.studentYear}>Year</div>
                                            </div>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Year"
                                                className={styles.studentYearForm}
                                                value={studentProfile.year}
                                                disabled
                                                readOnly
                                            />
                                        </div>
                                        <div style={{ width: '50%', marginLeft: '1rem' }}>
                                            <div className={styles.header}>
                                                <EngineeringIcon />
                                                <div className={styles.studentCGPA}>CGPA</div>
                                            </div>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter CGPA"
                                                className={styles.studentCGPAForm}
                                                value={studentProfile.cgpa}
                                                disabled
                                                readOnly
                                            /></div>
                                    </div>
                                    <div className={styles.header}>
                                        <SettingsIcon />
                                        <div className={styles.studentSkills}>Skills (comma seperated)</div>
                                    </div>
                                    <Form.Control
                                        as="textarea"
                                        value={skills}
                                        className={styles.studentSkillsForm}
                                        rows={3}
                                        onChange={(e) => setSkills(e.target.value)}
                                    />
                                    <div className={styles.header}>
                                        <MenuBookIcon />
                                        <div className={styles.studentCourses}>Courses (comma seperated)</div>
                                    </div>
                                    <Form.Control
                                        as="textarea"
                                        value={courses}
                                        className={styles.studentCoursesForm}
                                        rows={3}
                                        onChange={(e) => setCourses(e.target.value)}
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
                                        disabled={checkDisabled(studentProfile)}
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

export default StudentProfile;
