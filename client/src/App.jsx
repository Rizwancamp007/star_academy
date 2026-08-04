import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/public/Home'
import About from './pages/public/About'
import Faculty from './pages/public/Faculty'
import SuccessStories from './pages/public/SuccessStories'
import Contact from './pages/public/Contact'
import Lectures from './pages/public/Lectures'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import StudentLayout from './pages/student/StudentLayout'
import DashboardHome from './pages/student/DashboardHome'
import StudentLectures from './pages/student/StudentLectures'
import StudentTests from './pages/student/StudentTests'
import TestAttempt from './pages/student/TestAttempt'
import TestResult from './pages/student/TestResult'
import StudentChallan from './pages/student/StudentChallan'
import StudentAnalytics from './pages/student/StudentAnalytics'
import StudentSettings from './pages/student/StudentSettings'

import TeacherLayout from './pages/teacher/TeacherLayout'
import TeacherHome from './pages/teacher/TeacherHome'
import TeacherLectures from './pages/teacher/TeacherLectures'
import TeacherMCQBank from './pages/teacher/TeacherMCQBank'
import TeacherTestCreator from './pages/teacher/TeacherTestCreator'
import TeacherResults from './pages/teacher/TeacherResults'

import ClerkLayout from './pages/clerk/ClerkLayout'
import ClerkDashboard from './pages/clerk/ClerkDashboard'
import ClerkStudents from './pages/clerk/ClerkStudents'
import ClerkChallans from './pages/clerk/ClerkChallans'
import ClerkSuccessStories from './pages/clerk/ClerkSuccessStories'
import ClerkSettings from './pages/clerk/ClerkSettings'

import AdminLayout from './pages/admin/AdminLayout'
import AdminHome from './pages/admin/AdminHome'
import AdminMessages from './pages/admin/AdminMessages'
import AdminStaffAccounts from './pages/admin/AdminStaffAccounts'
import AdminStudents from './pages/admin/AdminStudents'
import AdminFees from './pages/admin/AdminFees'
import AdminFaculty from './pages/admin/AdminFaculty'
import AdminHeroMedia from './pages/admin/AdminHeroMedia'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminAuditLog from './pages/admin/AdminAuditLog'
import AdminSettings from './pages/admin/AdminSettings'

function App() {
  return (
    <Routes>
      {/* Public Site Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/lectures" element={<Lectures />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Student Dashboard Portal */}
      <Route path="/dashboard" element={<StudentLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="lectures" element={<StudentLectures />} />
        <Route path="tests" element={<StudentTests />} />
        <Route path="tests/:id/attempt" element={<TestAttempt />} />
        <Route path="tests/:id/result" element={<TestResult />} />
        <Route path="challan" element={<StudentChallan />} />
        <Route path="analytics" element={<StudentAnalytics />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* Teacher & Faculty Portal */}
      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<TeacherHome />} />
        <Route path="lectures" element={<TeacherLectures />} />
        <Route path="mcq" element={<TeacherMCQBank />} />
        <Route path="tests/create" element={<TeacherTestCreator />} />
        <Route path="results" element={<TeacherResults />} />
      </Route>

      {/* Clerk Portal */}
      <Route path="/clerk" element={<ClerkLayout />}>
        <Route index element={<ClerkDashboard />} />
        <Route path="students" element={<ClerkStudents />} />
        <Route path="challans" element={<ClerkChallans />} />
        <Route path="success-stories" element={<ClerkSuccessStories />} />
        <Route path="settings" element={<ClerkSettings />} />
      </Route>

      {/* Admin Governance Portal */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="staff-accounts" element={<AdminStaffAccounts />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="fees" element={<AdminFees />} />
        <Route path="faculty" element={<AdminFaculty />} />
        <Route path="hero-media" element={<AdminHeroMedia />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="audit-log" element={<AdminAuditLog />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  )
}

export default App
