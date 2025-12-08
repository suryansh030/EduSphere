// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Adding .jsx extensions back to fix file resolution errors
// Landing + Role Select
import LandingPage from "./pages/LandingPage.jsx";
import SkillGapApp from "./skillGap/SkillGapApp.jsx";

// Student Pages
import StudentSignUpPage from "./pages/StudentSignupPage.jsx";
import StudentLoginPage from "./pages/StudentLoginPage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import LogbookPage from "./pages/LogBook.jsx";
import ActivityTrackerPage from "./pages/StudentActivityTracker.jsx";
import Internships from "./pages/InternshipsPage.jsx";
import Courses from "./pages/CoursesPage.jsx";
import Mentors from "./pages/MentorsPage.jsx";
import Certificates from "./pages/Certificates.jsx";
import MentorLoginPage from "./pages/MentorLoginPage.jsx";
import MentorSignupPage from "./pages/MentorSignupPage.jsx";
import MentorDashboard from "./pages/MentorDashboard.jsx";
import ProfilePage from "./pages/StudentProfile.jsx";
import RoleSelectPage from "../src/pages/RoleSelectPage.jsx"

import FacultyLoginPage from "./pages/FacultyLoginPage.jsx";
import FacultySignupPage from "./pages/FacultySignupPage.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import AcademicDashboard from "./pages/AcademicDashboard.jsx";

/* NEW: Internship Report page */
import InternshipReport from "./pages/InternshipReport.jsx";

// Company Pages
import CompanySignupPage from "./pages/CompanySignupPage.jsx";
import CompanyLoginPage from "./pages/CompanyLoginPage.jsx"; 

// Admin Pages
import AdminSignupPage from "./pages/AdminSignupPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";  

// Company Dashboard Layout + Pages
import { CompanyProvider } from "./context/CompanyContext";
import DashboardLayout from "./components/companydashboard/Layout/DashboardLayout";
import Overview from "./pages/company/Overview";
import CreateOpening from "./pages/company/CreateOpening";
import Applicants from "./pages/company/Applicants";
import Analytics from "./pages/company/Analytics";
import Chat from "./pages/company/Chat";
import StudentProfile from "./pages/company/StudentProfile";
import SelectedStudents from "./pages/company/SelectedStudents";
import RejectedStudents from "./pages/company/RejectedStudents";
import RecruitedStudents from "./pages/company/RecruitedStudents";
import ChatStudent from "../src/components/studentdashboard/StudentChat.jsx"

// NEW: Under Maintenance page
import UnderMaintenance from "./pages/company/UnderMaintenance";

// ⚡⚡ NEW: IMPORT CHATBOT (your assistant)
import ChatbotFlow from "./components/ChatbotFlow.jsx";

// Company Layout Wrapper Component
const CompanyDashboardWrapper = () => {
  return (
    <CompanyProvider>
      <DashboardLayout />
    </CompanyProvider>
  );
};

export default function App() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">

      {/* 🚀 Chatbot appears on ALL pages */}
      <ChatbotFlow />

      <Routes>

        {/* Landing + Role Selection */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/roleselect" element={<RoleSelectPage />} />

        {/* Student Routes */}
        <Route path="/studentsignup" element={<StudentSignUpPage />} />
        <Route path="/studentlogin" element={<StudentLoginPage />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/logbook" element={<LogbookPage />} />
        <Route path="/activitytracker" element={<ActivityTrackerPage />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/studentchat" element={<ChatStudent />} />

        {/* NEW: Skill Gap Analysis route */}
        <Route path="/skill-gap" element={<SkillGapApp />} />

        {/* ---------------- FACULTY ROUTES ---------------- */}
        <Route path="/facultylogin" element={<FacultyLoginPage />} /> 
        <Route path="/facultysignup" element={<FacultySignupPage />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/internships" element={<Internships />} />

        {/* ---------------- COMPANY ROUTES ---------------- */}
        <Route path="/companysignup" element={<CompanySignupPage />} />
        <Route path="/companylogin" element={<CompanyLoginPage />} /> 
        <Route path="/courses" element={<Courses />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/academicdashboard" element={<AcademicDashboard />} />
        <Route path="/certificates" element={<Certificates />} />

        {/* Mentor Routes */}
        <Route path="/mentorlogin" element={<MentorLoginPage />} />
        <Route path="/mentorsignup" element={<MentorSignupPage />} />
        <Route path="/mentordashboard" element={<MentorDashboard />} />
        <Route path="/studentprofile" element={<ProfilePage />} />

        {/* ---------------- ADMIN ROUTES ---------------- */}
        <Route path="/adminsignup" element={<AdminSignupPage />} />
        <Route path="/adminlogin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />  

        {/* NEW: Internship Report Generator */}
        <Route path="/internship-report" element={<InternshipReport />} />

        {/* Company Dashboard Routes */}
        <Route path="/company" element={<CompanyDashboardWrapper />}>
          <Route index element={<replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="create-opening" element={<CreateOpening />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="selected-students" element={<SelectedStudents />} />
          <Route path="rejected-students" element={<RejectedStudents />} />
          <Route path="recruited-students" element={<RecruitedStudents />} />
          <Route path="chat" element={<Chat />} />
          <Route path="student/:id" element={<StudentProfile />} />

          {/* NEW: Settings & Help route to UnderMaintenance */}
          <Route path="settings" element={<UnderMaintenance />} />
          <Route path="help" element={<UnderMaintenance />} />
        </Route>

        {/* 404 - Catch all */}
        <Route path="*" element={< replace />} />

      </Routes>
    </div>
  );
}
