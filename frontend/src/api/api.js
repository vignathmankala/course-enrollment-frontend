import axios from 'axios';

// On Render, set REACT_APP_API_URL to your deployed backend's URL (e.g. https://your-backend.onrender.com/api)
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Students
export const getStudents = () => axios.get(`${API_BASE}/students`);
export const createStudent = (data) => axios.post(`${API_BASE}/students`, data);
export const updateStudent = (id, data) => axios.put(`${API_BASE}/students/${id}`, data);
export const deleteStudent = (id) => axios.delete(`${API_BASE}/students/${id}`);

// Courses
export const getCourses = () => axios.get(`${API_BASE}/courses`);
export const createCourse = (data) => axios.post(`${API_BASE}/courses`, data);
export const updateCourse = (id, data) => axios.put(`${API_BASE}/courses/${id}`, data);
export const deleteCourse = (id) => axios.delete(`${API_BASE}/courses/${id}`);

// Enrollments
export const getAllEnrollments = () => axios.get(`${API_BASE}/enrollments`);
export const getEnrollmentsForStudent = (studentId) => axios.get(`${API_BASE}/enrollments/student/${studentId}`);
export const enrollStudent = (studentId, courseId) => axios.post(`${API_BASE}/enrollments`, { studentId, courseId });
export const dropEnrollment = (id) => axios.delete(`${API_BASE}/enrollments/${id}`);
