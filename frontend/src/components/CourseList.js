import React, { useEffect, useState } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api/api';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseName: '', courseCode: '', credits: '', totalSeats: '' });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadCourses = () => {
    getCourses().then((res) => setCourses(res.data)).catch(() => setMessage('Could not load courses. Is the backend running?'));
  };

  useEffect(() => { loadCourses(); }, []);

  const validate = () => {
    const errs = {};
    if (!form.courseName.trim()) errs.courseName = 'Course name is required';
    if (!form.courseCode.trim()) errs.courseCode = 'Course code is required';
    if (!form.credits || form.credits < 1 || form.credits > 6) errs.credits = 'Credits must be between 1 and 6';
    if (!form.totalSeats || form.totalSeats < 1) errs.totalSeats = 'Total seats must be at least 1';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...form, credits: Number(form.credits), totalSeats: Number(form.totalSeats) };
    const action = editingId ? updateCourse(editingId, payload) : createCourse(payload);
    action
      .then(() => {
        setForm({ courseName: '', courseCode: '', credits: '', totalSeats: '' });
        setEditingId(null);
        setMessage(editingId ? 'Course updated' : 'Course added');
        loadCourses();
      })
      .catch((err) => setMessage(err.response?.data?.message || 'Something went wrong'));
  };

  const handleEdit = (course) => {
    setForm({
      courseName: course.courseName,
      courseCode: course.courseCode,
      credits: course.credits,
      totalSeats: course.totalSeats,
    });
    setEditingId(course.id);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this course?')) return;
    deleteCourse(id).then(loadCourses);
  };

  return (
    <div className="page">
      <h2>Courses</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="form-card">
        <h3>{editingId ? 'Edit Course' : 'Add Course'}</h3>
        <div className="form-group">
          <label>Course Name</label>
          <input value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} />
          {errors.courseName && <span className="error">{errors.courseName}</span>}
        </div>
        <div className="form-group">
          <label>Course Code</label>
          <input value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} />
          {errors.courseCode && <span className="error">{errors.courseCode}</span>}
        </div>
        <div className="form-group">
          <label>Credits</label>
          <input type="number" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} />
          {errors.credits && <span className="error">{errors.credits}</span>}
        </div>
        <div className="form-group">
          <label>Total Seats</label>
          <input type="number" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} />
          {errors.totalSeats && <span className="error">{errors.totalSeats}</span>}
        </div>
        <button type="submit">{editingId ? 'Update' : 'Add'} Course</button>
        {editingId && (
          <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm({ courseName: '', courseCode: '', credits: '', totalSeats: '' }); }}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr><th>Course</th><th>Code</th><th>Credits</th><th>Seats</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td>{c.courseName}</td>
              <td>{c.courseCode}</td>
              <td>{c.credits}</td>
              <td>{c.totalSeats}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseList;
