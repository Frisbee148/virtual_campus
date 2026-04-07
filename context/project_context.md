# VirtualCampus Project Context

## Overview
VirtualCampus is a modern, comprehensive academic portal built using React, Vite, and Tailwind CSS. The application is designed to cater to multiple stakeholders within an educational institute (specifically inspired by LNMIIT), providing tailored interfaces for Students, Faculty, and Parents/Guardians. 

## Technology Stack
- **Frontend Framework:** React 19, Vite
- **Styling:** Tailwind CSS, PostCSS, custom CSS module files
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Charts:** Recharts

## Interface Breakdown

### 1. Custom Authentication (Login Page)
The login screen is highly customized, reflecting the institute's branding:
- **Aesthetics:** Uses a blurred backdrop of LNMIIT (`lnmiit.jpg`), custom cursors, and an animated transparent LNMIIT logo. It features a 3D glow preloader.
- **Role Selection:** A custom dropdown to select the login role (Student, Faculty, Staff, Admin, Guardian/Parent, HOD), which dynamically dictates the routing upon successful login.
- **Form Features:** Username, Password, and CAPTCHA fields. Includes "Remember me" functionality, "Forgot Password", and shake animation for validation errors.
- **Navigation:** An "About" dropdown in the header for institutional links.

### 2. Student Interface
The student portal provides extensive tools for academic and extracurricular tracking:
- **Dashboard (`/dashboard`):** Main hub for the student.
- **Performance Tracking:** CGPA overview (`/performance`) and detailed grades (`/grades`).
- **Course Management:** Course Overview, Syllabus, Attendance tracking, and Faculty profiles.
- **Finance:** Fee Status (`/fee-status`).
- **Calendar & Timetable:** Monthly calendar view, weekly timetable, and daily schedule.
- **Community:** Faculty Feedback, Community Clubs, and Club Details.
- **Resources:** Downloads screen.
- **User System:** Profile, Notifications.
- **AI Mentor:** A unique floating interactive AI assistant integrated into the bottom right of the student layout (`/ai`, `/ai/active`).

### 3. Faculty Interface
Designed to help professors manage classes and monitor student progress:
- **Dashboard (`/faculty/dashboard`):** Main faculty landing page.
- **Analytics & Insights:** Batch Insights and an "At-Risk Students" tracker to identify students needing intervention.
- **Schedule Management:** Faculty Calendar and Timetable.
- **Settings:** Faculty Profile.

### 4. Parent/Guardian Interface
A specialized view mapped to track their ward's progress:
- **Dashboard (`/parent/dashboard`):** Snapshot of the student's current status.
- **Monitoring Tools:** Modules for Academic Performance, Detailed Grades, Attendance, and Fee Status.
- **Schedules:** Parent's view of the Calendar and Timetable.
- **User System:** Parent Profile and Notifications.

## Development Context
The codebase is structured efficiently within `client/src`:
- `/src/auth/`: Contains the customized login page logic and stylesheets.
- `/src/studentinterface/`: All student components, screens, and the Layout containing the AI Mentor.
- `/src/facultyinterface/`: Faculty components, screens, and Layout.
- `/src/parentinterface/`: Parent components, screens, and Layout.

*Important Note: Code snippets for the Custom Login Page (JSX & CSS) are included in this `context` folder for design reference.*
