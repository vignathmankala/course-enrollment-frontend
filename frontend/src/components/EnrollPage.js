import React, { useEffect, useState } from 'react';
import { getStudents, getCourses, getEnrollmentsForStudent, enrollStudent, dropEnrollment } from '../api/api';

function EnrollPage() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getStudents().then((res) => setStudents(res.data));
    getCourses().then((res) => setCourses(res.data));
  }, []);

  const loadEnrollments = (studentId) => {
    if (!studentId) { setEnrollments([]); return; }
    getEnrollmentsForStudent(studentId).then((res) => setEnrollments(res.data));
  };

  const handleStudentChange = (id) => {
    setSelectedStudent(id);
    loadEnrollments(id);
  };

  const handleEnroll = () => {
    if (!selectedStudent || !selectedCourse) {
      setMessage('Please select both a student and a course');
      return;
    }
    enrollStudent(selectedStudent, selectedCourse)
      .then(() => {
        setMessage('Enrolled successfully');
        loadEnrollments(selectedStudent);
      })
      .catch((err) => setMessage(err.response?.data?.error || 'Could not enroll'));
  };

  const handleDrop = (enrollmentId) => {
    dropEnrollment(enrollmentId).then(() => {
      setMessage('Enrollment dropped');
      loadEnrollments(selectedStudent);
    });
  };

  return (
    <div className="page">
      <h2>Enroll Students in Courses</h2>
      {message && <p className="message">{message}</p>}

      <div className="form-card">
        <div className="form-group">
          <label>Select Student</label>
          <select value={selectedStudent} onChange={(e) => handleStudentChange(e.target.value)}>
            <option value="">-- Choose Student --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Course</label>
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            <option value="">-- Choose Course --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.courseName} ({c.courseCode})</option>
            ))}
          </select>
        </div>

        <button onClick={handleEnroll}>Enroll</button>
      </div>

      {selectedStudent && (
        <>
          <h3>Enrolled Courses</h3>
          <table>
            <thead>
              <tr><th>Course</th><th>Code</th><th>Enrolled On</th><th>Action</th></tr>
            </thead>
            <tbody>
              {enrollments.length === 0 && (
                <tr><td colSpan="4">No courses enrolled yet</td></tr>
              )}
              {enrollments.map((e) => (
                <tr key={e.id}>
                  <td>{e.course.courseName}</td>
                  <td>{e.course.courseCode}</td>
                  <td>{e.enrollmentDate}</td>
                  <td><button className="danger" onClick={() => handleDrop(e.id)}>Drop</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default EnrollPage;
