import React, { useState } from "react";

// MAIN COMPONENT IMPORTS
import ManageClasses from "./manageclasses/ManageClasses.jsx";
import CreateClass from "./manageclasses/CreateClass.jsx";
import OverviewUI from "./OverviewUI.jsx";
import AssignedStudentsUI from "./assignedstudents/AssignedStudents.jsx"; 
// ⬆️ Make sure file path is correct (we can adjust if needed)

// TEMP UI FOR PENDING MODULES
const MissingTabUI = ({ tabName }) => (
  <div className="p-10 text-center">
    <h1 className="text-2xl font-bold">{tabName} Coming Soon</h1>
  </div>
);

export default function FacultyDashboardMain({
  activeTab,
  classList,
  setClassList,
}) {
  const [isCreating, setIsCreating] = useState(false);

  // ------------------------ HANDLERS -------------------------

  const handleCreate = () => setIsCreating(true);

  const handleClassCreated = (newClass) => {
    setClassList((prev) => [...prev, newClass]);
    setIsCreating(false);
  };

  const handleDelete = (cls) => {
    if (window.confirm(`Delete ${cls.className}?`)) {
      setClassList((prev) => prev.filter((c) => c.id !== cls.id));
    }
  };

  const handleEdit = (cls) => {
    const newName = prompt("New class name:", cls.className);
    if (newName) {
      setClassList((prev) =>
        prev.map((c) => (c.id === cls.id ? { ...c, className: newName } : c))
      );
    }
  };

  const handleView = (cls) => {
    alert(`View Student Work for: ${cls.className}`);
  };

  const handleGenerateLink = (classId) => {
    return `https://edusphere.com/join/${classId}`;
  };

  // ------------------------ ROUTING --------------------------

  switch (activeTab) {
    case "Dashboard":
    case "Overview":
      return <OverviewUI />;

    case "Manage Classes":
      return isCreating ? (
        <CreateClass
          onBack={() => setIsCreating(false)}
          onClassCreated={handleClassCreated}
        />
      ) : (
        <ManageClasses
          classList={classList}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onGenerateLink={handleGenerateLink}
        />
      );

    case "Assigned Students":
      return <AssignedStudentsUI />; // ✅ NOW ROUTES PROPERLY

    case "Pending Reviews":
      return <MissingTabUI tabName="Pending Reviews" />;

    case "Assessments":
      return <MissingTabUI tabName="Assessments" />;

    case "Reports and Signoff":
      return <MissingTabUI tabName="Reports and Signoff" />;

    case "Chat Faculty Student":
      return <MissingTabUI tabName="Chat Faculty Student" />;

    default:
      return <OverviewUI />;
  }
}
