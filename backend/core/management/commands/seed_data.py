from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decimal import Decimal
from datetime import date
from students.models import Student
from teachers.models import Teacher
from courses.models import Course
from attendance.models import AttendanceSession, AttendanceRecord
from fees.models import FeeRecord, PaymentTransaction
from examinations.models import ExamSchedule, StudentResult, SubjectMark
from timetable.models import TimetableSlot
from notices.models import NoticeItem
from core.models import CollegeSettings

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds initial realistic database for Government Polytechnic Bansdeeh, Ballia'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE('Starting database seed for Government Polytechnic Bansdeeh, Ballia...'))

        # 1. College Settings
        settings_obj, _ = CollegeSettings.objects.get_or_create(id=1)
        settings_obj.college_name = 'Government Polytechnic Bansdeeh, Ballia'
        settings_obj.hindi_name = 'राजकीय पॉलिटेक्निक बांसडीह, बलिया'
        settings_obj.address = 'Bansdeeh, Ballia, Uttar Pradesh - 277202'
        settings_obj.phone = '+91 5498 290124'
        settings_obj.email = 'principal.gpbansdeeh@gmail.com'
        settings_obj.website = 'https://gpbansdeeh.ac.in'
        settings_obj.aicte_code = '1-3328491021'
        settings_obj.bteup_code = '4412'
        settings_obj.principal_name = 'Er. R. C. Srivastava'
        settings_obj.save()
        self.stdout.write(self.style.SUCCESS('[OK] College Settings configured'))

        # 2. Demo Users
        # Admin
        admin_user, _ = User.objects.get_or_create(username='admin', defaults={'email': 'admin@polytechnic.edu'})
        admin_user.first_name = 'Er. R. C.'
        admin_user.last_name = 'Srivastava'
        admin_user.email = 'admin@polytechnic.edu'
        admin_user.role = 'admin'
        admin_user.designation = 'Principal & Chief Administrator'
        admin_user.department = 'Administration'
        admin_user.phone = '+91 94150 24510'
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.set_password('admin123')
        admin_user.save()

        # Teacher
        teacher_user, _ = User.objects.get_or_create(username='teacher', defaults={'email': 'teacher@polytechnic.edu'})
        teacher_user.first_name = 'Dr. Alok Kumar'
        teacher_user.last_name = 'Rai'
        teacher_user.email = 'teacher@polytechnic.edu'
        teacher_user.role = 'teacher'
        teacher_user.designation = 'HOD & Associate Professor'
        teacher_user.department = 'Computer Science & Engineering'
        teacher_user.phone = '+91 94150 12345'
        teacher_user.is_staff = True
        teacher_user.set_password('teacher123')
        teacher_user.save()

        # Student
        student_user, _ = User.objects.get_or_create(username='student', defaults={'email': 'student@polytechnic.edu'})
        student_user.first_name = 'Rahul'
        student_user.last_name = 'Verma'
        student_user.email = 'student@polytechnic.edu'
        student_user.role = 'student'
        student_user.roll_number = 'E224412355001'
        student_user.branch = 'Computer Science & Engineering'
        student_user.semester = 4
        student_user.phone = '+91 98381 23450'
        student_user.set_password('student123')
        student_user.save()
        self.stdout.write(self.style.SUCCESS('[OK] Demo accounts created (Admin, Teacher, Student)'))

        # 3. Courses / Engineering Branches
        courses_data = [
            {
                'course_code': 'DIP-CSE',
                'course_name': 'Diploma in Computer Science & Engineering',
                'short_code': 'CSE',
                'duration_years': 3,
                'total_seats': 60,
                'active_students': 58,
                'faculty_count': 6,
                'hod_name': 'Dr. Alok Kumar Rai',
                'labs_count': 4,
                'description': 'Comprehensive curriculum covering programming in C/Python, Data Structures, DBMS, Computer Networks, Web Technologies, and IoT.',
                'status': 'Active'
            },
            {
                'course_code': 'DIP-ME',
                'course_name': 'Diploma in Mechanical Engineering (Production)',
                'short_code': 'ME',
                'duration_years': 3,
                'total_seats': 60,
                'active_students': 57,
                'faculty_count': 7,
                'hod_name': 'Er. S. N. Pandey',
                'labs_count': 6,
                'description': 'Hands-on training in Thermal Engineering, Machine Design, CAD/CAM CNC machining, Hydraulics, and Workshop Technology.',
                'status': 'Active'
            },
            {
                'course_code': 'DIP-CE',
                'course_name': 'Diploma in Civil Engineering',
                'short_code': 'CE',
                'duration_years': 3,
                'total_seats': 60,
                'active_students': 56,
                'faculty_count': 5,
                'hod_name': 'Er. Vikram Pratap Singh',
                'labs_count': 5,
                'description': 'Specialized syllabus covering Surveying, Structural Analysis, RCC Design, Soil Mechanics, Highway Engineering, and Estimating.',
                'status': 'Active'
            },
            {
                'course_code': 'DIP-EE',
                'course_name': 'Diploma in Electrical Engineering',
                'short_code': 'EE',
                'duration_years': 3,
                'total_seats': 60,
                'active_students': 54,
                'faculty_count': 6,
                'hod_name': 'Dr. Manoj Kumar Mishra',
                'labs_count': 5,
                'description': 'In-depth education in Electrical Machines, Power Systems, Switchgear & Protection, PLC Microcontrollers, and Renewable Energy.',
                'status': 'Active'
            },
            {
                'course_code': 'DIP-ECE',
                'course_name': 'Diploma in Electronics Engineering',
                'short_code': 'ECE',
                'duration_years': 3,
                'total_seats': 60,
                'active_students': 52,
                'faculty_count': 5,
                'hod_name': 'Er. Priya Sharma',
                'labs_count': 4,
                'description': 'Advanced training in Digital Electronics, VLSI & Microprocessors, Analog Communication, Embedded Systems, and PCB Design.',
                'status': 'Active'
            },
            {
                'course_code': 'DIP-IT',
                'course_name': 'Diploma in Information Technology',
                'short_code': 'IT',
                'duration_years': 3,
                'total_seats': 60,
                'active_students': 48,
                'faculty_count': 4,
                'hod_name': 'Er. Amit Kumar Gupta',
                'labs_count': 3,
                'description': 'Modern IT curriculum specializing in Full-stack Web Development, Cloud Computing, Cybersecurity, and Software Engineering.',
                'status': 'Active'
            }
        ]

        for c_data in courses_data:
            Course.objects.update_or_create(course_code=c_data['course_code'], defaults=c_data)
        self.stdout.write(self.style.SUCCESS(f'[OK] {len(courses_data)} Engineering branches seeded'))

        # 4. Teachers
        teachers_data = [
            {
                'emp_code': 'FAC-CSE-001',
                'full_name': 'Dr. Alok Kumar Rai',
                'photo_url': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces',
                'department': 'Computer Science & Engineering',
                'designation': 'HOD & Associate Professor',
                'qualification': 'Ph.D. (CSE), M.Tech (IIT BHU), B.Tech',
                'email': 'alok.rai@polytechnic.edu',
                'mobile': '+91 94150 12345',
                'joining_date': date(2015, 7, 15),
                'subjects': ['Data Structures & Algorithms', 'Database Management Systems', 'Python Programming'],
                'experience_years': 11,
                'status': 'Active'
            },
            {
                'emp_code': 'FAC-ME-002',
                'full_name': 'Er. Satya Narayan Pandey',
                'photo_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
                'department': 'Mechanical Engineering',
                'designation': 'HOD & Assistant Professor',
                'qualification': 'M.Tech (CAD/CAM - NIT Allahabad), B.Tech',
                'email': 'sn.pandey@polytechnic.edu',
                'mobile': '+91 94151 23456',
                'joining_date': date(2016, 8, 1),
                'subjects': ['Theory of Machines', 'CNC Machining & CAD', 'Thermal Engineering'],
                'experience_years': 10,
                'status': 'Active'
            },
            {
                'emp_code': 'FAC-CE-003',
                'full_name': 'Er. Vikram Pratap Singh',
                'photo_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
                'department': 'Civil Engineering',
                'designation': 'HOD & Senior Lecturer',
                'qualification': 'M.Tech (Structural Engg), B.Tech (Civil)',
                'email': 'vikram.singh@polytechnic.edu',
                'mobile': '+91 94152 34567',
                'joining_date': date(2017, 3, 10),
                'subjects': ['Structural Analysis', 'Surveying-II', 'RCC Design'],
                'experience_years': 9,
                'status': 'Active'
            },
            {
                'emp_code': 'FAC-EE-004',
                'full_name': 'Dr. Manoj Kumar Mishra',
                'photo_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
                'department': 'Electrical Engineering',
                'designation': 'HOD & Lecturer',
                'qualification': 'Ph.D. (Electrical), M.Tech (Power Systems)',
                'email': 'manoj.mishra@polytechnic.edu',
                'mobile': '+91 94153 45678',
                'joining_date': date(2018, 1, 5),
                'subjects': ['Electrical Machines-II', 'Power Systems & Protection', 'Control Systems'],
                'experience_years': 8,
                'status': 'Active'
            },
            {
                'emp_code': 'FAC-ECE-005',
                'full_name': 'Er. Priya Sharma',
                'photo_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
                'department': 'Electronics Engineering',
                'designation': 'Lecturer',
                'qualification': 'M.Tech (VLSI Design - AKTU), B.Tech',
                'email': 'priya.sharma@polytechnic.edu',
                'mobile': '+91 94154 56789',
                'joining_date': date(2019, 9, 20),
                'subjects': ['Digital Electronics', 'Microprocessor 8085/8086', 'Analog Circuits'],
                'experience_years': 7,
                'status': 'Active'
            }
        ]

        for t_data in teachers_data:
            Teacher.objects.update_or_create(emp_code=t_data['emp_code'], defaults=t_data)
        self.stdout.write(self.style.SUCCESS(f'[OK] {len(teachers_data)} Faculty members seeded'))

        # 5. Students
        students_data = [
            {
                'roll_number': 'E224412355001',
                'enrollment_number': '224412001',
                'full_name': 'Rahul Verma',
                'father_name': 'Shri Ramakant Verma',
                'mother_name': 'Smt. Shanti Devi',
                'date_of_birth': date(2004, 5, 14),
                'gender': 'Male',
                'mobile': '+91 98381 23450',
                'email': 'rahul.verma@student.polytechnic.edu',
                'address': 'Vill - Maniar, Post - Bansdeeh, Dist - Ballia, UP - 277202',
                'branch': 'Computer Science & Engineering',
                'semester': 4,
                'admission_year': 2023,
                'category': 'OBC',
                'blood_group': 'B+',
                'status': 'Active',
                'photo_url': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
                'attendance_percentage': 88.5,
                'fee_status': 'Paid'
            },
            {
                'roll_number': 'E224412355002',
                'enrollment_number': '224412002',
                'full_name': 'Anjali Kumari',
                'father_name': 'Shri Surendra Nath Tiwari',
                'mother_name': 'Smt. Pratima Devi',
                'date_of_birth': date(2005, 3, 22),
                'gender': 'Female',
                'mobile': '+91 98382 34561',
                'email': 'anjali.kumari@student.polytechnic.edu',
                'address': 'Ward No. 4, Bansdeeh Road, Ballia, UP - 277202',
                'branch': 'Computer Science & Engineering',
                'semester': 4,
                'admission_year': 2023,
                'category': 'General',
                'blood_group': 'O+',
                'status': 'Active',
                'photo_url': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
                'attendance_percentage': 92.0,
                'fee_status': 'Paid'
            },
            {
                'roll_number': 'E224412355003',
                'enrollment_number': '224412003',
                'full_name': 'Amit Kumar Yadav',
                'father_name': 'Shri Din Dayal Yadav',
                'mother_name': 'Smt. Geeta Devi',
                'date_of_birth': date(2003, 11, 8),
                'gender': 'Male',
                'mobile': '+91 98383 45672',
                'email': 'amit.yadav@student.polytechnic.edu',
                'address': 'Vill - Reoti, Post - Sahatwar, Dist - Ballia, UP - 277207',
                'branch': 'Mechanical Engineering',
                'semester': 4,
                'admission_year': 2023,
                'category': 'OBC',
                'blood_group': 'A+',
                'status': 'Active',
                'photo_url': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces',
                'attendance_percentage': 79.4,
                'fee_status': 'Partial'
            },
            {
                'roll_number': 'E224412355004',
                'enrollment_number': '224412004',
                'full_name': 'Pooja Singh',
                'father_name': 'Shri Chandra Shekhar Singh',
                'mother_name': 'Smt. Madhuri Singh',
                'date_of_birth': date(2004, 8, 19),
                'gender': 'Female',
                'mobile': '+91 98384 56783',
                'email': 'pooja.singh@student.polytechnic.edu',
                'address': 'Near Tehsil Campus, Bansdeeh, Ballia, UP - 277202',
                'branch': 'Civil Engineering',
                'semester': 4,
                'admission_year': 2023,
                'category': 'General',
                'blood_group': 'AB+',
                'status': 'Active',
                'photo_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
                'attendance_percentage': 84.6,
                'fee_status': 'Paid'
            },
            {
                'roll_number': 'E224412355005',
                'enrollment_number': '224412005',
                'full_name': 'Vikas Gond',
                'father_name': 'Shri Subhash Gond',
                'mother_name': 'Smt. Munni Devi',
                'date_of_birth': date(2004, 1, 30),
                'gender': 'Male',
                'mobile': '+91 98385 67894',
                'email': 'vikas.gond@student.polytechnic.edu',
                'address': 'Vill - Beruarbari, Dist - Ballia, UP - 277304',
                'branch': 'Electrical Engineering',
                'semester': 4,
                'admission_year': 2023,
                'category': 'ST',
                'blood_group': 'O+',
                'status': 'Active',
                'photo_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
                'attendance_percentage': 68.0,
                'fee_status': 'Pending'
            },
            {
                'roll_number': 'E224412355006',
                'enrollment_number': '224412006',
                'full_name': 'Sachin Sharma',
                'father_name': 'Shri Dinesh Sharma',
                'mother_name': 'Smt. Sunita Sharma',
                'date_of_birth': date(2005, 8, 20),
                'gender': 'Male',
                'mobile': '+91 98386 78901',
                'email': 'sachin.sharma@student.polytechnic.edu',
                'address': 'Kharid Road, Bansdeeh, Ballia, UP - 277202',
                'branch': 'Computer Science & Engineering',
                'semester': 4,
                'admission_year': 2023,
                'category': 'General',
                'blood_group': 'B+',
                'status': 'Active',
                'photo_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
                'attendance_percentage': 91.5,
                'fee_status': 'Paid'
            }
        ]

        for s_data in students_data:
            s_obj, _ = Student.objects.update_or_create(roll_number=s_data['roll_number'], defaults=s_data)

            # Auto-create or update User account for every student
            std_user, created = User.objects.get_or_create(
                username=s_data['roll_number'],
                defaults={
                    'email': s_data['email'],
                    'first_name': s_data['full_name'].split()[0],
                    'last_name': ' '.join(s_data['full_name'].split()[1:]),
                    'role': 'student',
                    'roll_number': s_data['roll_number'],
                    'branch': s_data['branch'],
                    'semester': s_data['semester']
                }
            )
            std_user.set_password(s_data['date_of_birth'].strftime('%Y-%m-%d'))
            std_user.save()

            # Create Fee record for student
            paid_amt = Decimal('12450.00') if s_data['fee_status'] == 'Paid' else Decimal('6000.00') if s_data['fee_status'] == 'Partial' else Decimal('0.00')
            pend_amt = Decimal('12450.00') - paid_amt
            fee_obj, _ = FeeRecord.objects.get_or_create(
                receipt_number=f"GPB/FEE/2026/{s_data['roll_number'][-4:]}",
                defaults={
                    'student': s_obj,
                    'student_id_str': f"std-{s_data['roll_number'][-3:]}",
                    'student_name': s_data['full_name'],
                    'roll_number': s_data['roll_number'],
                    'branch': s_data['branch'],
                    'semester': s_data['semester'],
                    'academic_year': '2025-2026',
                    'total_amount': Decimal('12450.00'),
                    'paid_amount': paid_amt,
                    'pending_amount': pend_amt,
                    'due_date': date(2026, 4, 30),
                    'payment_status': s_data['fee_status']
                }
            )

            # If paid or partial, create PaymentTransaction
            if paid_amt > 0 and fee_obj.transactions.count() == 0:
                PaymentTransaction.objects.create(
                    fee_record=fee_obj,
                    receipt_number=fee_obj.receipt_number,
                    amount=paid_amt,
                    payment_mode='Online UPI (SBI Collect)',
                    transaction_ref=f"SBI/UP/{s_data['roll_number'][-4:]}99",
                    remarks='Semester Tuition & Board Exam Fee',
                    collected_by='Accounts Section, GP Bansdeeh'
                )

        self.stdout.write(self.style.SUCCESS(f'[OK] {len(students_data)} Students & User Accounts seeded'))

        # 6. Exam Schedules
        exam_schedules_data = [
            {
                'exam_name': 'BTEUP Even Semester Examination 2026',
                'branch': 'Computer Science & Engineering',
                'semester': 4,
                'subject': 'Data Structures & Algorithms Using Python',
                'subject_code': 'CS-401',
                'exam_date': date(2026, 5, 18),
                'start_time': '09:30 AM',
                'end_time': '12:30 PM',
                'room_no': 'Hall A-101',
                'max_marks': 50,
                'passing_marks': 17,
                'exam_type': 'Theory'
            },
            {
                'exam_name': 'BTEUP Even Semester Examination 2026',
                'branch': 'Computer Science & Engineering',
                'semester': 4,
                'subject': 'Database Management Systems (DBMS)',
                'subject_code': 'CS-402',
                'exam_date': date(2026, 5, 20),
                'start_time': '09:30 AM',
                'end_time': '12:30 PM',
                'room_no': 'Hall A-102',
                'max_marks': 50,
                'passing_marks': 17,
                'exam_type': 'Theory'
            },
            {
                'exam_name': 'BTEUP Even Semester Examination 2026',
                'branch': 'Mechanical Engineering',
                'semester': 4,
                'subject': 'Theory of Machines & Mechanisms',
                'subject_code': 'ME-401',
                'exam_date': date(2026, 5, 19),
                'start_time': '09:30 AM',
                'end_time': '12:30 PM',
                'room_no': 'Hall B-201',
                'max_marks': 50,
                'passing_marks': 17,
                'exam_type': 'Theory'
            }
        ]

        for es in exam_schedules_data:
            ExamSchedule.objects.get_or_create(
                exam_name=es['exam_name'],
                subject_code=es['subject_code'],
                exam_date=es['exam_date'],
                defaults=es
            )
        self.stdout.write(self.style.SUCCESS(f'[OK] {len(exam_schedules_data)} Examination schedules seeded'))

        # 7. Student Marksheet / Results for All Semesters (Sem 1, Sem 2, Sem 3, Sem 4)
        rahul_std = Student.objects.filter(roll_number='E224412355001').first()
        sachin_std = Student.objects.filter(roll_number='E224412355006').first()

        multi_semester_results = [
            {
                'roll_number': 'E224412355001',
                'student': rahul_std,
                'student_name': 'Rahul Verma',
                'semester': 1,
                'academic_year': '2023-2024',
                'grand_total_max': 700,
                'grand_total_obtained': 568,
                'percentage': 81.14,
                'cgpa': 8.2,
                'division': 'First Division',
                'status': 'PASSED',
                'subjects': [
                    { 'subject_code': 'BAS-101', 'subject_name': 'Applied Mathematics-I', 'theory_max': 50, 'theory_obtained': 40, 'practical_max': 50, 'practical_obtained': 42, 'total_max': 100, 'total_obtained': 82, 'grade': 'A', 'status': 'PASS' },
                    { 'subject_code': 'BAS-102', 'subject_name': 'Applied Physics-I', 'theory_max': 50, 'theory_obtained': 38, 'practical_max': 50, 'practical_obtained': 40, 'total_max': 100, 'total_obtained': 78, 'grade': 'B+', 'status': 'PASS' },
                    { 'subject_code': 'BAS-103', 'subject_name': 'Applied Chemistry', 'theory_max': 50, 'theory_obtained': 39, 'practical_max': 50, 'practical_obtained': 41, 'total_max': 100, 'total_obtained': 80, 'grade': 'A', 'status': 'PASS' },
                    { 'subject_code': 'ENG-104', 'subject_name': 'Engineering Drawing-I', 'theory_max': 60, 'theory_obtained': 51, 'practical_max': 40, 'practical_obtained': 34, 'total_max': 100, 'total_obtained': 85, 'grade': 'A+', 'status': 'PASS' },
                    { 'subject_code': 'CS-105', 'subject_name': 'Basics of Information Technology', 'theory_max': 50, 'theory_obtained': 45, 'practical_max': 50, 'practical_obtained': 46, 'total_max': 100, 'total_obtained': 91, 'grade': 'O (Outstanding)', 'status': 'PASS' },
                    { 'subject_code': 'WKP-106', 'subject_name': 'General Workshop Practice-I', 'theory_max': 0, 'theory_obtained': 0, 'practical_max': 100, 'practical_obtained': 86, 'total_max': 100, 'total_obtained': 86, 'grade': 'A+', 'status': 'PASS' },
                    { 'subject_code': 'SCA-100', 'subject_name': 'Student Centered Activities', 'theory_max': 0, 'theory_obtained': 0, 'practical_max': 100, 'practical_obtained': 66, 'total_max': 100, 'total_obtained': 66, 'grade': 'B', 'status': 'PASS' }
                ]
            },
            {
                'roll_number': 'E224412355001',
                'student': rahul_std,
                'student_name': 'Rahul Verma',
                'semester': 2,
                'academic_year': '2023-2024',
                'grand_total_max': 700,
                'grand_total_obtained': 577,
                'percentage': 82.43,
                'cgpa': 8.4,
                'division': 'First Division with Honours',
                'status': 'PASSED',
                'subjects': [
                    { 'subject_code': 'BAS-201', 'subject_name': 'Applied Mathematics-II', 'theory_max': 50, 'theory_obtained': 41, 'practical_max': 50, 'practical_obtained': 43, 'total_max': 100, 'total_obtained': 84, 'grade': 'A', 'status': 'PASS' },
                    { 'subject_code': 'BAS-202', 'subject_name': 'Applied Physics-II', 'theory_max': 50, 'theory_obtained': 40, 'practical_max': 50, 'practical_obtained': 41, 'total_max': 100, 'total_obtained': 81, 'grade': 'A', 'status': 'PASS' },
                    { 'subject_code': 'EE-203', 'subject_name': 'Basics of Electrical & Electronics Engg', 'theory_max': 50, 'theory_obtained': 41, 'practical_max': 50, 'practical_obtained': 42, 'total_max': 100, 'total_obtained': 83, 'grade': 'A', 'status': 'PASS' },
                    { 'subject_code': 'ENV-204', 'subject_name': 'Environmental Studies & Disaster Mgmt', 'theory_max': 50, 'theory_obtained': 39, 'practical_max': 50, 'practical_obtained': 40, 'total_max': 100, 'total_obtained': 79, 'grade': 'B+', 'status': 'PASS' },
                    { 'subject_code': 'CS-205', 'subject_name': 'Programming in C & Problem Solving', 'theory_max': 50, 'theory_obtained': 44, 'practical_max': 50, 'practical_obtained': 46, 'total_max': 100, 'total_obtained': 90, 'grade': 'A+', 'status': 'PASS' },
                    { 'subject_code': 'WKP-206', 'subject_name': 'General Workshop Practice-II', 'theory_max': 0, 'theory_obtained': 0, 'practical_max': 100, 'practical_obtained': 88, 'total_max': 100, 'total_obtained': 88, 'grade': 'A+', 'status': 'PASS' },
                    { 'subject_code': 'SCA-200', 'subject_name': 'Student Centered Activities', 'theory_max': 0, 'theory_obtained': 0, 'practical_max': 100, 'practical_obtained': 72, 'total_max': 100, 'total_obtained': 72, 'grade': 'B+', 'status': 'PASS' }
                ]
            },
            {
                'roll_number': 'E224412355001',
                'student': rahul_std,
                'student_name': 'Rahul Verma',
                'semester': 3,
                'academic_year': '2024-2025',
                'grand_total_max': 700,
                'grand_total_obtained': 579,
                'percentage': 82.71,
                'cgpa': 8.3,
                'division': 'First Division with Honours',
                'status': 'PASSED',
                'subjects': [
                    { 'subject_code': 'BAS-301', 'subject_name': 'Applied Mathematics-III', 'theory_max': 50, 'theory_obtained': 42, 'practical_max': 50, 'practical_obtained': 43, 'total_max': 100, 'total_obtained': 85, 'grade': 'A+', 'status': 'PASS' },
                    { 'subject_code': 'CS-302', 'subject_name': 'Internet & Web Technology', 'theory_max': 50, 'theory_obtained': 44, 'practical_max': 50, 'practical_obtained': 45, 'total_max': 100, 'total_obtained': 89, 'grade': 'A+', 'status': 'PASS' },
                    { 'subject_code': 'EC-303', 'subject_name': 'Digital Electronics & Microprocessors', 'theory_max': 50, 'theory_obtained': 39, 'practical_max': 50, 'practical_obtained': 42, 'total_max': 100, 'total_obtained': 81, 'grade': 'A', 'status': 'PASS' },
                    { 'subject_code': 'CS-304', 'subject_name': 'Object Oriented Programming with C++', 'theory_max': 50, 'theory_obtained': 43, 'practical_max': 50, 'practical_obtained': 44, 'total_max': 100, 'total_obtained': 87, 'grade': 'A+', 'status': 'PASS' },
                    { 'subject_code': 'CS-305', 'subject_name': 'Computer Architecture & Hardware Lab', 'theory_max': 50, 'theory_obtained': 40, 'practical_max': 50, 'practical_obtained': 42, 'total_max': 100, 'total_obtained': 82, 'grade': 'A', 'status': 'PASS' },
                    { 'subject_code': 'CS-306', 'subject_name': 'Data Communication Fundamentals', 'theory_max': 50, 'theory_obtained': 37, 'practical_max': 50, 'practical_obtained': 41, 'total_max': 100, 'total_obtained': 78, 'grade': 'B+', 'status': 'PASS' },
                    { 'subject_code': 'SCA-300', 'subject_name': 'Student Centered Activities', 'theory_max': 0, 'theory_obtained': 0, 'practical_max': 100, 'practical_obtained': 77, 'total_max': 100, 'total_obtained': 77, 'grade': 'A', 'status': 'PASS' }
                ]
            },
            {
                'roll_number': 'E224412355001',
                'student': rahul_std,
                'student_name': 'Rahul Verma',
                'semester': 4,
                'academic_year': '2024-2025',
                'grand_total_max': 700,
                'grand_total_obtained': 585,
                'percentage': 83.57,
                'cgpa': 8.5,
                'division': 'First Division with Honours',
                'status': 'PASSED',
                'subjects': [
                    { 'subject_code': 'CS-401', 'subject_name': 'Data Structures & Algorithms Using Python', 'theory_max': 50, 'theory_obtained': 42, 'practical_max': 50, 'practical_obtained': 45, 'total_max': 100, 'total_obtained': 87, 'grade': 'A+', 'status': 'PASS' },
                    { 'subject_code': 'CS-402', 'subject_name': 'Database Management Systems (DBMS)', 'theory_max': 50, 'theory_obtained': 38, 'practical_max': 50, 'practical_obtained': 46, 'total_max': 100, 'total_obtained': 84, 'grade': 'A', 'status': 'PASS' },
                    { 'subject_code': 'CS-403', 'subject_name': 'Operating Systems & Linux Architecture', 'theory_max': 50, 'theory_obtained': 41, 'practical_max': 50, 'practical_obtained': 44, 'total_max': 100, 'total_obtained': 85, 'grade': 'A+', 'status': 'PASS' },
                    { 'subject_code': 'CS-404', 'subject_name': 'Computer Communication Networks', 'theory_max': 50, 'theory_obtained': 36, 'practical_max': 50, 'practical_obtained': 42, 'total_max': 100, 'total_obtained': 78, 'grade': 'A', 'status': 'PASS' },
                    { 'subject_code': 'CS-405', 'subject_name': 'Web Technologies & PHP Frameworks', 'theory_max': 50, 'theory_obtained': 44, 'practical_max': 50, 'practical_obtained': 48, 'total_max': 100, 'total_obtained': 92, 'grade': 'O (Outstanding)', 'status': 'PASS' },
                    { 'subject_code': 'CS-406', 'subject_name': 'Universal Human Values & Professional Ethics', 'theory_max': 50, 'theory_obtained': 35, 'practical_max': 50, 'practical_obtained': 40, 'total_max': 100, 'total_obtained': 75, 'grade': 'B+', 'status': 'PASS' },
                    { 'subject_code': 'SCA-400', 'subject_name': 'Student Centered Activities (SCA)', 'theory_max': 0, 'theory_obtained': 0, 'practical_max': 100, 'practical_obtained': 84, 'total_max': 100, 'total_obtained': 84, 'grade': 'A', 'status': 'PASS' }
                ]
            }
        ]

        for r_item in multi_semester_results:
            subjs = r_item.pop('subjects')
            res_obj, _ = StudentResult.objects.update_or_create(
                roll_number=r_item['roll_number'],
                semester=r_item['semester'],
                defaults=r_item
            )
            res_obj.subjects.all().delete()
            for sm in subjs:
                SubjectMark.objects.create(result=res_obj, **sm)

        self.stdout.write(self.style.SUCCESS('[OK] Detailed multi-semester (Sem 1 to 4) BTEUP marksheets seeded'))

        # 8. Timetable Slots
        timetable_data = [
            { 'branch': 'Computer Science & Engineering', 'semester': 4, 'day': 'Monday', 'start_time': '09:30 AM', 'end_time': '10:30 AM', 'subject': 'Data Structures & Algorithms', 'subject_code': 'CS-401', 'teacher_name': 'Dr. Alok Kumar Rai', 'room_no': 'Room 101', 'slot_type': 'Theory' },
            { 'branch': 'Computer Science & Engineering', 'semester': 4, 'day': 'Monday', 'start_time': '10:30 AM', 'end_time': '11:30 AM', 'subject': 'DBMS', 'subject_code': 'CS-402', 'teacher_name': 'Er. Priya Sharma', 'room_no': 'Room 101', 'slot_type': 'Theory' },
            { 'branch': 'Computer Science & Engineering', 'semester': 4, 'day': 'Monday', 'start_time': '11:30 AM', 'end_time': '01:30 PM', 'subject': 'Python & DSA Programming Lab', 'subject_code': 'CS-401P', 'teacher_name': 'Dr. Alok Kumar Rai', 'room_no': 'Computer Lab 2', 'slot_type': 'Practical' },
            { 'branch': 'Computer Science & Engineering', 'semester': 4, 'day': 'Tuesday', 'start_time': '09:30 AM', 'end_time': '10:30 AM', 'subject': 'Operating Systems', 'subject_code': 'CS-403', 'teacher_name': 'Er. Amit Kumar Gupta', 'room_no': 'Room 101', 'slot_type': 'Theory' },
            { 'branch': 'Computer Science & Engineering', 'semester': 4, 'day': 'Wednesday', 'start_time': '09:30 AM', 'end_time': '10:30 AM', 'subject': 'Computer Networks', 'subject_code': 'CS-404', 'teacher_name': 'Dr. Alok Kumar Rai', 'room_no': 'Room 101', 'slot_type': 'Theory' }
        ]

        for tt in timetable_data:
            TimetableSlot.objects.get_or_create(
                branch=tt['branch'],
                semester=tt['semester'],
                day=tt['day'],
                start_time=tt['start_time'],
                defaults=tt
            )
        self.stdout.write(self.style.SUCCESS(f'[OK] {len(timetable_data)} Timetable slots seeded'))

        # 9. Notices
        notices_data = [
            {
                'title': 'BTEUP Even Semester 2026 Examination Schedule Released',
                'content': 'All diploma engineering students of 2nd, 4th, and 6th semesters are informed that the Board of Technical Education Uttar Pradesh (BTEUP) has released the tentative scheme for the Even Semester Examination 2026. Students must verify their exam roll numbers, subject codes, and seating arrangements.',
                'category': 'Examination',
                'publish_date': date(2026, 4, 15),
                'priority': 'High',
                'target_audience': 'All',
                'issued_by': 'Office of the Principal / Exam Controller',
                'reference_no': 'GPB/EXAM/2026/042',
                'attachment_name': 'BTEUP_Even_Sem_Scheme_2026.pdf'
            },
            {
                'title': 'Last Date for Even Semester Fee Submission & Scholarship Verification',
                'content': 'All registered students of Government Polytechnic Bansdeeh are hereby notified that the deadline for deposit of Even Semester Institutional Fees and UP Post-Matric Scholarship biometric verification is 30th April 2026. Defaulters will be barred from appearing in Board Examinations.',
                'category': 'Fees',
                'publish_date': date(2026, 4, 10),
                'priority': 'High',
                'target_audience': 'Students',
                'issued_by': 'Accounts Section, GP Bansdeeh',
                'reference_no': 'GPB/ACCOUNTS/2026/118',
                'attachment_name': 'Fee_Schedule_Notice_2026.pdf'
            },
            {
                'title': 'National Level Workshop on AI & Cloud Computing Applications',
                'content': 'Department of Computer Science & Engineering is organizing a 2-day hands-on National Workshop on "Applied Artificial Intelligence and Modern Cloud Infrastructure" in partnership with Industry Experts on 28-29 April 2026.',
                'category': 'Events',
                'publish_date': date(2026, 4, 8),
                'priority': 'Medium',
                'target_audience': 'All',
                'issued_by': 'Dept. of Computer Science & Engg.',
                'reference_no': 'GPB/CSE/WORKSHOP/2026/07',
                'attachment_name': 'AI_Workshop_Brochure.pdf'
            },
            {
                'title': 'Confidential: AICTE Mandatory Faculty Workload & Lab Audit Formats',
                'content': 'All HODs and Faculty members are requested to review the updated AICTE & BTEUP workload norms for Session 2025-2026. Please verify theory teaching hours (16 hrs/week) and practical laboratory sessions before the upcoming committee visit.',
                'category': 'Academic',
                'publish_date': date(2026, 4, 12),
                'priority': 'High',
                'target_audience': 'Teachers',
                'issued_by': 'Office of the Principal (Er. R. C. Srivastava)',
                'reference_no': 'GPB/STAFF/CONF/2026/01',
                'attachment_name': 'AICTE_Faculty_Audit_Guidelines.pdf',
                'is_confidential_staff': True,
                'discussion_comments': [
                    {
                        'id': 'cmt-01',
                        'author_name': 'Dr. Alok Kumar Rai (HOD CSE)',
                        'author_role': 'teacher',
                        'text': 'CSE Department laboratory schedules and machine logs are compiled for audit verification.',
                        'created_at': '18 Aug 2026, 11:30 AM'
                    },
                    {
                        'id': 'cmt-02',
                        'author_name': 'Er. Priya Sharma (Lecturer CSE)',
                        'author_role': 'teacher',
                        'text': 'Student tutorial groups have been finalized as per new AICTE ratio.',
                        'created_at': '19 Aug 2026, 03:15 PM'
                    }
                ]
            }
        ]

        for n in notices_data:
            NoticeItem.objects.update_or_create(reference_no=n['reference_no'], defaults=n)
        self.stdout.write(self.style.SUCCESS(f'[OK] {len(notices_data)} Official & Confidential Staff Notices seeded'))

        # 10. About College Information & Location
        from website.models import (
            AboutCollege,
            CollegeLocation,
            Facility,
            FacilityPhoto,
            GalleryItem,
            ImportantLink,
            PublicFeeStructure
        )

        about_obj, _ = AboutCollege.objects.get_or_create(id=1)
        about_obj.college_name = 'Government Polytechnic Bansdeeh, Ballia'
        about_obj.bteup_code = '4412'
        about_obj.aicte_approval = 'Approved by AICTE, New Delhi & Affiliated to BTEUP Lucknow'
        about_obj.history = 'Government Polytechnic Bansdeeh, Ballia was established in Uttar Pradesh as a flagship government polytechnic institution to deliver world-class technical education, industrial vocational skills, and career opportunities to youth across the Purvanchal region. Since its inception, the institute has maintained high standards of academic rigor, practical workshop training, and successful industry placements under the Board of Technical Education, Uttar Pradesh.'
        about_obj.vision = 'To be a premier technical institute in Northern India empowering diploma engineers with deep technical competence, innovative mindset, ethical stewardship, and community impact.'
        about_obj.mission = 'Provide industry-aligned curriculum, world-class laboratory infrastructure, dedicated faculty mentorship, and holistic skill development for aspiring diploma technicians.'
        about_obj.principal_name = 'Er. R. C. Srivastava'
        about_obj.principal_message = 'Welcome to Government Polytechnic Bansdeeh, Ballia. Our institution is dedicated to building robust technical foundation, practical engineering skills, and career opportunities for our diploma students under BTEUP curriculum.'
        about_obj.principal_photo = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces'
        about_obj.achievements = [
            '100% AICTE Approval & BTEUP Code 4412 Accreditation',
            'Over 85% placement rate across leading core engineering & IT firms',
            'State-of-the-art Computer Labs & Modern Production Workshops',
            'Active MOUs with prominent regional manufacturing & IT industries'
        ]
        about_obj.save()
        self.stdout.write(self.style.SUCCESS('[OK] About College data seeded'))

        loc_obj, _ = CollegeLocation.objects.get_or_create(id=1)
        loc_obj.address = 'Near Bansdeeh Road Railway Station, Bansdeeh, Ballia, Uttar Pradesh - 277202'
        loc_obj.district = 'Ballia'
        loc_obj.state = 'Uttar Pradesh'
        loc_obj.pincode = '277202'
        loc_obj.landmark = 'State Highway 1, Near Bansdeeh Tehsil'
        loc_obj.latitude = 25.8647
        loc_obj.longitude = 84.2185
        loc_obj.map_embed_url = 'https://maps.google.com/maps?q=Bansdeeh,Ballia,Uttar+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed'
        loc_obj.map_view_url = 'https://maps.google.com/?q=25.8647,84.2185'
        loc_obj.directions_url = 'https://www.google.com/maps/dir//Bansdeeh+Ballia+Uttar+Pradesh+277202'
        loc_obj.connectivity_bus = 'Frequent UPSRTC and private bus connectivity from Ballia Central Bus Stand (18 km) and Bansdeeh Chauraha (2.5 km).'
        loc_obj.connectivity_train = 'Nearest Railway Stations: Bansdeeh Road Station (BUI) - 4 km; Ballia Junction (BUI) - 19 km with direct express trains to Lucknow, Varanasi, Delhi, and Patna.'
        loc_obj.contact_phone = '+91 94150 24510'
        loc_obj.contact_email = 'principal.gpbansdeeh@gmail.com'
        loc_obj.save()
        self.stdout.write(self.style.SUCCESS('[OK] Verified College Location coordinates seeded'))

        # 11. Facilities
        facilities_data = [
            {
                'title': 'Advanced Computer & IoT Lab',
                'category': 'Computer Labs',
                'cover_image': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
                'short_description': 'Fully air-conditioned computer center equipped with 120 high-performance workstations, gigabit LAN, and Linux/Windows environments.',
                'detailed_notes': 'The Advanced Computer Lab hosts high-speed optic fiber connectivity (100 Mbps), enterprise Cisco switches, licensed MATLAB, Python, Visual Studio Code, Oracle DBMS, and IoT development kits for computer science and IT students.',
                'equipment_list': ['120 Dell OptiPlex Core i7 Workstations', 'Dual 100 Mbps Dedicated Fiber Leased Lines', 'Smart Interactive Whiteboard & Audio-Visual System', 'Raspberry Pi 4 & Arduino IoT Sensor Kits'],
                'display_order': 1,
                'status': 'Published',
                'photos': [
                    {'image_url': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop', 'caption': 'Main Computing Section'},
                    {'image_url': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop', 'caption': 'Programming & Lab Work'}
                ]
            },
            {
                'title': 'Central Technical Library & Digital E-Resource Center',
                'category': 'Library',
                'cover_image': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop',
                'short_description': 'Over 18,000 engineering textbook volumes, National & International journals, DELNET e-books subscription, and quiet reading zones.',
                'detailed_notes': 'The library provides an open-access system with automated barcode book issue/return, specialized book bank scheme for SC/ST and OBC students, and 20 multimedia terminals for accessing NPTEL, Swayam, and IEEE e-journals.',
                'equipment_list': ['18,500+ Technical Textbooks & Reference Books', 'DELNET & National Digital Library (NDL) Access', '200-Seat Air-Conditioned Reading Hall', 'Book Bank Facility for all Semester Students'],
                'display_order': 2,
                'status': 'Published',
                'photos': [
                    {'image_url': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop', 'caption': 'Reference Book Stacks'},
                    {'image_url': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop', 'caption': 'Reading Hall'}
                ]
            },
            {
                'title': 'Heavy Mechanical & Production Engineering Workshop',
                'category': 'Workshops',
                'cover_image': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop',
                'short_description': 'Spacious workshop facility comprising Lathe Machine Shop, Fitting Shop, Welding Booths, Carpentry, Foundry, and Sheet Metal sections.',
                'detailed_notes': 'Equipped with heavy-duty all-geared lathe machines, universal milling machines, CNC trainer lathe, TIG/MIG welding sets, and UTM tensile testing apparatus to impart hands-on manufacturing skills.',
                'equipment_list': ['15 Precision Gear-Head Lathes', 'CNC Turning & Milling Trainer', 'TIG / MIG / Arc Welding Stations', 'Universal Testing Machine (UTM 40 Ton)'],
                'display_order': 3,
                'status': 'Published',
                'photos': [
                    {'image_url': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop', 'caption': 'Machine & Lathe Shop'},
                    {'image_url': 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&h=400&fit=crop', 'caption': 'Welding & Fabrication Bay'}
                ]
            },
            {
                'title': 'Electrical Machines & Power Systems Laboratory',
                'category': 'Laboratories',
                'cover_image': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&h=400&fit=crop',
                'short_description': 'Dedicated lab for AC/DC machines, transformer testing, transmission line simulators, and PLC automation modules.',
                'detailed_notes': 'Enables students to conduct real-time experiments on synchronous motors, DC generators, alternator synchronization, induction motors, and switchgear protection panels.',
                'equipment_list': ['DC Shunt & Series Motor-Generator Sets', '3-Phase Induction Motor Test Benches', 'Single & 3-Phase Transformer Test Benches', 'Siemens S7 PLC Automation Trainer'],
                'display_order': 4,
                'status': 'Published',
                'photos': [
                    {'image_url': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&h=400&fit=crop', 'caption': 'Motors & Generators Test Bench'},
                    {'image_url': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop', 'caption': 'Electronics & Measurement Station'}
                ]
            }
        ]

        for fac in facilities_data:
            photos = fac.pop('photos', [])
            f_obj, _ = Facility.objects.get_or_create(title=fac['title'], defaults=fac)
            if f_obj.photos.count() == 0:
                for idx, p in enumerate(photos):
                    FacilityPhoto.objects.create(facility=f_obj, image_url=p['image_url'], caption=p['caption'], display_order=idx)
        self.stdout.write(self.style.SUCCESS(f'[OK] {len(facilities_data)} Facilities and multi-photo sets seeded'))

        # 12. Gallery Items
        gallery_data = [
            { 'title': 'Campus Main Academic Block & Green Courtyard', 'category': 'Campus', 'image_url': 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop', 'date': date(2026, 2, 10), 'description': 'Panoramic view of Government Polytechnic Bansdeeh campus main entrance and lush gardens.' },
            { 'title': 'Annual Technical Project Exhibition 2026', 'category': 'Events', 'image_url': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop', 'date': date(2026, 3, 20), 'description': 'Diploma engineering students demonstrating working robotics and IoT models.' },
            { 'title': 'Mechanical Engineering CNC Machining Demonstration', 'category': 'Workshops', 'image_url': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop', 'date': date(2026, 1, 15), 'description': 'Final year students working on precision lathe and milling operations.' },
            { 'title': 'Computer Science Python Programming Session', 'category': 'Laboratories', 'image_url': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop', 'date': date(2026, 2, 25), 'description': 'Students working on algorithmic data structure practicals.' },
            { 'title': 'Annual Inter-Polytechnic Cricket & Athletics Tournament', 'category': 'Sports', 'image_url': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=400&fit=crop', 'date': date(2026, 2, 5), 'description': 'College sports meet held at Bansdeeh Polytechnic athletic grounds.' },
            { 'title': 'Independence Day & Cultural Festival Celebrations', 'category': 'Cultural Activities', 'image_url': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop', 'date': date(2025, 8, 15), 'description': 'Students performing patriotic cultural programs and speech competitions.' }
        ]

        for g in gallery_data:
            GalleryItem.objects.get_or_create(title=g['title'], defaults=g)
        self.stdout.write(self.style.SUCCESS(f'[OK] {len(gallery_data)} Gallery items seeded'))

        # 13. Important Links
        links_data = [
            { 'title': 'Board of Technical Education Uttar Pradesh (BTEUP)', 'description': 'Official portal for diploma syllabus, examination results, and institute logins.', 'url': 'https://bteup.ac.in', 'category': 'Examination & Board', 'display_order': 1 },
            { 'title': 'All India Council for Technical Education (AICTE)', 'description': 'National statutory body for technical education planning and standards.', 'url': 'https://www.aicte-india.org', 'category': 'Technical Education', 'display_order': 2 },
            { 'title': 'Joint Entrance Examination Council (JEECUP)', 'description': 'Official portal for Uttar Pradesh Polytechnic entrance exam and admissions.', 'url': 'https://jeecup.admissions.nic.in', 'category': 'Admission & Entrance', 'display_order': 3 },
            { 'title': 'UP State Scholarship & Fee Reimbursement Portal', 'description': 'Online application and status tracking for Post-Matric scholarships.', 'url': 'https://scholarship.up.gov.in', 'category': 'Scholarship & Welfare', 'display_order': 4 },
            { 'title': 'URISE Portal (Unified Re-imagined Innovation for Student Empowerment)', 'description': 'Unified student portal for e-learning, attendance, and placement services in UP.', 'url': 'https://urise.up.gov.in', 'category': 'Digital Learning', 'display_order': 5 },
            { 'title': 'SWAYAM & NPTEL E-Learning Portal', 'description': 'Free online diploma and engineering video courses by IITs and IISc.', 'url': 'https://swayam.gov.in', 'category': 'Digital Learning', 'display_order': 6 }
        ]

        for l in links_data:
            ImportantLink.objects.get_or_create(title=l['title'], defaults=l)
        self.stdout.write(self.style.SUCCESS(f'[OK] {len(links_data)} Important Links seeded'))

        # 14. Public Fee Structure
        fees_structure_data = [
            { 'branch': 'All 3-Year Diploma Programs (Regular)', 'academic_year': '2025-2026', 'fee_type': 'Tuition Fee (Per Annum)', 'amount': Decimal('8000.00'), 'notes': 'Government subsidized annual tuition fee.', 'display_order': 1 },
            { 'branch': 'All 3-Year Diploma Programs (Regular)', 'academic_year': '2025-2026', 'fee_type': 'BTEUP Examination & Registration Fee', 'amount': Decimal('2450.00'), 'notes': 'Semester examination and marksheet processing charge.', 'display_order': 2 },
            { 'branch': 'All 3-Year Diploma Programs (Regular)', 'academic_year': '2025-2026', 'fee_type': 'Caution Money & Library Deposit (One-time, Refundable)', 'amount': Decimal('1000.00'), 'notes': 'Refundable after completion of 3-year diploma course.', 'display_order': 3 },
            { 'branch': 'All 3-Year Diploma Programs (Regular)', 'academic_year': '2025-2026', 'fee_type': 'Student Welfare & Sports Activity Fund', 'amount': Decimal('1000.00'), 'notes': 'Annual development, internet, and cultural activity charge.', 'display_order': 4 },
            { 'branch': 'Hostel Residents Only', 'academic_year': '2025-2026', 'fee_type': 'Hostel Room Rent & Maintenance (Per Annum)', 'amount': Decimal('3000.00'), 'notes': 'Subject to room allotment availability. Mess charges extra on actual basis.', 'display_order': 5 }
        ]

        for fs in fees_structure_data:
            PublicFeeStructure.objects.get_or_create(fee_type=fs['fee_type'], defaults=fs)
        self.stdout.write(self.style.SUCCESS(f'[OK] {len(fees_structure_data)} Public Fee Structure records seeded'))

        # 15. Student Applications / Grievances
        from students.models import StudentApplication
        if rahul_std:
            apps_data = [
                {
                    'student': rahul_std,
                    'application_no': 'APP-2026-001',
                    'subject': 'Spelling Correction in Father Name on Portal',
                    'category': 'Personal Information Correction',
                    'description': 'Respected Sir, My father\'s name was misspelled as Santosh Kumar instead of Santosh Verma. Kindly update the record as per my High School Certificate.',
                    'status': 'Approved',
                    'staff_response': 'Verified with 10th marksheet. Father name updated to Santosh Verma.',
                    'reviewed_by': 'Er. R. C. Srivastava (Principal)'
                },
                {
                    'student': rahul_std,
                    'application_no': 'APP-2026-002',
                    'subject': 'Duplicate Statement of Marks Request for 3rd Semester',
                    'category': 'Document / Certificate Request',
                    'description': 'Requesting official signed duplicate marksheet copy for UP Scholarship submission.',
                    'status': 'Under Review',
                    'staff_response': 'Application received. Processing with BTEUP examination cell.',
                    'reviewed_by': 'Academic Section'
                }
            ]
            for app_item in apps_data:
                StudentApplication.objects.get_or_create(application_no=app_item['application_no'], defaults=app_item)
            self.stdout.write(self.style.SUCCESS(f'[OK] {len(apps_data)} Student Applications & Grievances seeded'))

        self.stdout.write(self.style.SUCCESS('\n========================================'))
        self.stdout.write(self.style.SUCCESS('DATABASE SEEDING COMPLETED SUCCESSFULLY!'))
        self.stdout.write(self.style.SUCCESS('Demo Credentials:'))
        self.stdout.write(self.style.SUCCESS('  Admin:   admin@polytechnic.edu   / admin123'))
        self.stdout.write(self.style.SUCCESS('  Teacher: teacher@polytechnic.edu / teacher123'))
        self.stdout.write(self.style.SUCCESS('  Student: student@polytechnic.edu / student123'))
        self.stdout.write(self.style.SUCCESS('========================================\n'))


