import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NotFound from './pages/404';
import FacultyProjectsList from './pages/Faculty/FacultyProjectsList';
import FacultyCourseList from './pages/Faculty/FacultyCourseList';
import DepartmentCourseList from './pages/Department/DepartmentCourseList';
import StudentProfile from './pages/Student/StudentProfile';
import FacultyProfile from './pages/Faculty/FacultyProfile';
import ScrollToTop from './components/ScrollToTop';
import ProjectsList from './pages/Student/ProjectsList';
import ProjectsApplied from './pages/Student/ProjectsApplied';
import ArchivedApplications from './pages/Student/ArchivedApplications';
import IndustryProjects from './pages/Student/IndustryProjects';
import Login from './pages/Login';
import Grading from './pages/Grading';
import Categories from './pages/Categories';
import Navbar from './components/Navbar/Navbar';
import StudentProtected from './components/RestrictedRoutes/StudentProtected';
import FacultyProtected from './components/RestrictedRoutes/FacultyProtected';
import DepartmentProtected from './components/RestrictedRoutes/DepartmentProtected';

const App = () => {
  return (
    <Router>
      <Navbar />
      <ScrollToTop />
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/grading" component={Grading} />
        <Route path="/categories" component={Categories} />
        <FacultyProtected path="/faculty-profile" component={FacultyProfile} />
        <FacultyProtected
          path="/faculty-projects"
          component={FacultyProjectsList}
        />
        <FacultyProtected
          path="/faculty-courses"
          component={FacultyCourseList}
        />
        <DepartmentProtected
          path="/department-courses"
          component={DepartmentCourseList}
        />
        <StudentProtected path="/student-profile" component={StudentProfile} />
        <StudentProtected path="/student-projects" component={ProjectsList} />
        <StudentProtected
          path="/student-projects-applied"
          component={ProjectsApplied}
        />
        <StudentProtected
          path="/student-archived-applications"
          component={ArchivedApplications}
        />
        <StudentProtected
          path="/student-industry-applications"
          component={IndustryProjects}
        />
        <Route default component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
