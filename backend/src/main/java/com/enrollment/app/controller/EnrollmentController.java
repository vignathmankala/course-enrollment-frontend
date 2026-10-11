package com.enrollment.app.controller;

import com.enrollment.app.model.Course;
import com.enrollment.app.model.Enrollment;
import com.enrollment.app.model.Student;
import com.enrollment.app.repository.CourseRepository;
import com.enrollment.app.repository.EnrollmentRepository;
import com.enrollment.app.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private CourseRepository courseRepository;

    // Get all enrollments (used for admin report view)
    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    // Get all courses a specific student is enrolled in
    @GetMapping("/student/{studentId}")
    public List<Enrollment> getEnrollmentsForStudent(@PathVariable Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    // Get all students enrolled in a specific course
    @GetMapping("/course/{courseId}")
    public List<Enrollment> getEnrollmentsForCourse(@PathVariable Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    // Enroll a student into a course
    @PostMapping
    public ResponseEntity<?> enroll(@RequestBody Map<String, Long> body) {
        Long studentId = body.get("studentId");
        Long courseId = body.get("courseId");

        Student student = studentRepository.findById(studentId).orElse(null);
        Course course = courseRepository.findById(courseId).orElse(null);

        if (student == null || course == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Student or Course not found"));
        }
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Already enrolled in this course"));
        }

        long currentEnrollments = enrollmentRepository.findByCourseId(courseId).size();
        if (currentEnrollments >= course.getTotalSeats()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "No seats available in this course"));
        }

        Enrollment enrollment = new Enrollment(student, course);
        return ResponseEntity.ok(enrollmentRepository.save(enrollment));
    }

    // Drop / cancel an enrollment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> drop(@PathVariable Long id) {
        if (!enrollmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        enrollmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
