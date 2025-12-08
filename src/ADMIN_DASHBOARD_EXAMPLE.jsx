/**
 * EXAMPLE: Updated AdminDashboardMain.jsx with Automation
 * 
 * This shows how to migrate from manual state to automatic data fetching
 * 
 * Copy this pattern to other components
 */

import React, { useState } from "react";
import { useAppData } from "../context/AppDataContext";

// Layout Components
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import OverviewUI from "./OverviewUI.jsx";
import Footer from "./Footer.jsx";

// Admin Pages
import ManageFaculty from "./pages/ManageFaculty.jsx";
import AddFaculty from "./pages/AddFaculty.jsx";
import ManageStudents from "./pages/ManageStudents.jsx";
import ForceAddStudent from "./pages/ForceAddStudent.jsx";
import Partnerships from "./pages/Partnerships.jsx";
import AdminCompany from "./pages/AdminCompany.jsx";
import Analytics from "./pages/Analytics.jsx";
import ExportData from "./pages/ExportData.jsx";
import Chats from "./pages/Chats.jsx";

export default function AdminDashboardMain() {
  const [activePage, setActivePage] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ⭐ AUTOMATIC DATA FETCHING - Replace manual state
  const { 
    faculty, 
    facultyLoading,
    fetchFaculty,
    students,
    companiesLoading
  } = useAppData();

  // ⭐ ADD FACULTY - Replaced with API mutation
  const addFaculty = async (newFaculty) => {
    try {
      // Call API endpoint POST /api/faculty
      const response = await fetch('http://localhost:3001/api/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFaculty),
      });
      
      if (response.ok) {
        // Refresh faculty list after add
        await fetchFaculty(true); // force refresh
      }
    } catch (error) {
      console.error('Failed to add faculty:', error);
    }
  };

  // ⭐ REMOVE FACULTY - Replaced with API mutation
  const removeFaculty = async (id) => {
    try {
      // Call API endpoint DELETE /api/faculty/:id
      const response = await fetch(`http://localhost:3001/api/faculty/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh faculty list after delete
        await fetchFaculty(true); // force refresh
      }
    } catch (error) {
      console.error('Failed to remove faculty:', error);
    }
  };

  // PAGE SWITCH HANDLER - Same as before
  const renderContent = () => {
    switch (activePage) {
      case "managefaculty":
        return (
          <ManageFaculty
            facultyList={faculty}        // ⭐ Use context data
            removeFaculty={removeFaculty}
          />
        );

      case "addfaculty":
        return <AddFaculty addFaculty={addFaculty} />;

      case "managestudents":
        return <ManageStudents />;

      case "forceadd":
        return <ForceAddStudent />;

      case "partnerships":
        return <Partnerships />;

      case "admincompany":
        return <AdminCompany />;

      case "analytics":
        return <Analytics />;

      case "exportdata":
        return <ExportData />;

      case "chats":
        return <Chats />;

      default:
        return <OverviewUI />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR - Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`fixed md:relative w-64 h-full bg-white shadow-xl z-40 md:z-10 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar 
          setActivePage={setActivePage} 
          activePage={activePage}
          onNavigate={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 w-full">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} isMobileMenuOpen={isSidebarOpen} />

        <main className="p-4 md:p-6 overflow-y-auto flex-1">
          {facultyLoading && activePage === 'managefaculty' && <div>Loading faculty...</div>}
          {renderContent()}
        </main>

        <Footer />
      </div>

    </div>
  );
}

/**
 * MIGRATION CHECKLIST:
 * ==================
 * 
 * [ ] Create .env file with VITE_API_BASE_URL
 * [ ] Install files: apiClient.js, useData.js, AppDataContext.jsx
 * [ ] Update main.jsx with AppDataProvider
 * [ ] Replace useState with useAppData hook
 * [ ] Update addFaculty to call API
 * [ ] Update removeFaculty to call API
 * [ ] Test data fetching in browser console
 * [ ] Update other components (ManageStudents, AdminCompany, etc.)
 * [ ] Setup backend endpoints
 * [ ] Test authentication flow
 */
