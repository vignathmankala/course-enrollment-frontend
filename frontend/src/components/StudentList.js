import React, { useEffect, useState } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../api/api';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', department: '' });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadStudents = () => {
    getStudents().then((res) => setStudents(res.data)).catch(() => setMessage('Could not load students. Is the backend running?'));
  };

  useEffect(() => { loadStudents(); }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.department.trim()) errs.department = 'Department is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const action = editingId ? updateStudent(editingId, form) : createStudent(form);
    action
      .then(() => {
        setForm({ name: '', email: '', department: '' });
        setEditingId(null);
        setMessage(editingId ? 'Student updated' : 'Student added');
        loadStudents();
      })
      .catch((err) => setMessage(err.response?.data?.message || 'Something went wrong'));
  };

  const handleEdit = (student) => {
    setForm({ name: student.name, email: student.email, department: student.department });
    setEditingId(student.id);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this student?')) return;
    deleteStudent(id).then(loadStudents);
  };

  return (
    <div className="page">
      <h2>Students</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="form-card">
        <h3>{editingId ? 'Edit Student' : 'Add Student'}</h3>
        <div className="form-group">
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Department</label>
          <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          {errors.department && <span className="error">{errors.department}</span>}
        </div>
        <button type="submit">{editingId ? 'Update' : 'Add'} Student</button>
        {editingId && (
          <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm({ name: '', email: '', department: '' }); }}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Department</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.department}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
