import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import StudentList from './components/StudentList';
import CourseList from './components/CourseList';
import EnrollPage from './components/EnrollPage';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>Student Course Enrollment System</h1>
          <div className="nav-links">
            <NavLink to="/" end>Students</NavLink>
            <NavLink to="/courses">Courses</NavLink>
            <NavLink to="/enroll">Enroll</NavLink>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<StudentList />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/enroll" element={<EnrollPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
