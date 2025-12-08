// Sidebar.jsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({
  open,
  onClose,
  user = { name: "Student Name", avatarUrl: "" },
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // ---------------------------------------------------------
  // Navigation Handler
  // ---------------------------------------------------------
  const handleNavigation = (key) => {
    switch (key) {
      case "home":
        navigate("/studentdashboard");
        break;

      case "profile":
        navigate("/studentprofile");
        break;

      case "logbook":
        navigate("/logbook");
        break;

      case "activity":
        navigate("/activitytracker");
        break;

      case "academics":
        navigate("/academicdashboard");
        break;

      case "certifications":
        navigate("/certificates");
        break;

      case "courses":
        navigate("/courses");
        break;

      case "mentors":
        navigate("/mentors");
        break;

      case "internships":
        navigate("/internships");
        break;

      case "chat":
        navigate("/studentchat");
        break;

      case "help":
        navigate("");
        break;

      case "signout":
        navigate("/studentlogin");
        break;

      default:
        console.warn(`No route defined for key: ${key}`);
        break;
    }

    if (onClose) onClose();
  };

  // ---------------------------------------------------------
  // Active State Logic
  // ---------------------------------------------------------
  const isKeyActive = (key) => {
    const path = location.pathname;
    const view = location.state?.view;

    switch (key) {
      case "home":
        return path === "/studentdashboard";

      case "profile":
        return path === "/studentprofile";

      case "logbook":
        return path.startsWith("/logbook");

      case "activity":
        return path.startsWith("/activitytracker");

      case "academics":
        return path === "/studentdashboard" && view === "academics";

      case "certifications":
        return path === "/studentdashboard" && view === "certifications";

      case "courses":
        return path === "/studentdashboard" && view === "courses";

      case "mentors":
        return path === "/studentdashboard" && view === "mentors";

      case "internships":
        return path === "/studentdashboard" && view === "internships";

      case "chat":
        return path === "/studentchat";

      default:
        return false;
    }
  };

  // ---------------------------------------------------------
  // Button UI Component
  // ---------------------------------------------------------
  const NavButton = ({ label, menuKey, badge }) => {
    const active = isKeyActive(menuKey);

    return (
      <button
        onClick={() => handleNavigation(menuKey)}
        className={`w-full text-left flex items-center gap-3 py-3 px-3 rounded-md transition-colors
          ${active
            ? "bg-blue-50 text-blue-700 font-semibold"
            : "hover:bg-gray-50 text-gray-800 font-medium"
          }`}
        type="button"
      >
        <span>{label}</span>
        {badge && <span className="ml-auto text-xs text-gray-500">{badge}</span>}
      </button>
    );
  };

  // ---------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------
  return (
    <div aria-hidden={!open} className="fixed inset-0 z-50 pointer-events-none">
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sidebar Panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-[20rem] bg-white shadow-xl transform transition-transform duration-300
          ${open ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}`}
      >
        <div className="h-full flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <div className="text-lg font-bold text-blue-600">Prashikshan</div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigation("profile")}
                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-50"
              >
                <img
                  src={
                    user.avatarUrl ||
                    `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
                      user.name
                    )}`
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full border"
                />
                <span className="hidden md:inline-block text-sm text-gray-700">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
                ✕
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-4 space-y-1 flex-1 overflow-auto">
            <NavButton label="Home" menuKey="home" />
            <NavButton label="Profile" menuKey="profile" />
            <NavButton label="Logbook" menuKey="logbook" />
            <NavButton label="Activity Feed" menuKey="activity" />

            <div className="pt-2 pb-1">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Learning
              </p>
            </div>

            <NavButton label="Academics" menuKey="academics" />
            <NavButton label="Certifications" menuKey="certifications" />
            <NavButton label="Courses" menuKey="courses" />
            <NavButton label="Mentors" menuKey="mentors" />
            <NavButton label="Internships" menuKey="internships" />
            <NavButton label="Chat" menuKey="chat" />
          </nav>

          {/* Footer */}
          <div className="mt-auto px-4 py-4 border-t">
            <button
              onClick={() => handleNavigation("help")}
              className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 text-gray-700"
            >
              Help & Support
            </button>

            <button
              onClick={() => handleNavigation("signout")}
              className="mt-2 w-full text-left py-2 px-3 rounded-md text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>

        </div>
      </aside>
    </div>
  );
}
