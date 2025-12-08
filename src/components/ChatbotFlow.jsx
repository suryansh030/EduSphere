// src/components/ChatbotFlow.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle,
  X,
  RotateCcw,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Paperclip,
  Volume2,
  VolumeX,
  StopCircle,
  Loader2,
  File,
  Image,
  FileText,
  Trash2,
  Download,
  ExternalLink,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Users,
  Building2,
  BookOpen,
  UserCog,
  ChevronRight,
  Home,
  ArrowLeft,
  CheckCircle2,
  Star,
} from "lucide-react";

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ============================================
// ROLE DEFINITIONS
// ============================================

const ROLES = [
  {
    id: "student",
    label: "Student",
    icon: GraduationCap,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
    description: "Access courses, internships & track progress",
    nodeId: "StudentDash",
  },
  {
    id: "faculty",
    label: "Faculty",
    icon: BookOpen,
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
    borderColor: "border-emerald-200",
    hoverBorder: "hover:border-emerald-400",
    description: "Manage classes & review student submissions",
    nodeId: "FacultyDash",
  },
  {
    id: "admin",
    label: "Institute Admin",
    icon: Building2,
    color: "purple",
    gradient: "from-purple-500 to-indigo-500",
    bgLight: "bg-purple-50",
    borderColor: "border-purple-200",
    hoverBorder: "hover:border-purple-400",
    description: "Manage faculty, students & partnerships",
    nodeId: "AdminDash",
  },
  {
    id: "mentor",
    label: "Mentor",
    icon: Users,
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
    hoverBorder: "hover:border-amber-400",
    description: "Guide students & manage sessions",
    nodeId: "MentorDash",
  },
  {
    id: "company",
    label: "Company",
    icon: Briefcase,
    color: "rose",
    gradient: "from-rose-500 to-pink-500",
    bgLight: "bg-rose-50",
    borderColor: "border-rose-200",
    hoverBorder: "hover:border-rose-400",
    description: "Post internships & manage applicants",
    nodeId: "CompanyDash",
  },
  {
    id: "publisher",
    label: "Course Publisher",
    icon: UserCog,
    color: "cyan",
    gradient: "from-cyan-500 to-blue-500",
    bgLight: "bg-cyan-50",
    borderColor: "border-cyan-200",
    hoverBorder: "hover:border-cyan-400",
    description: "Create & publish courses",
    nodeId: "PubDash",
  },
];

// ============================================
// FLOW NODES - Simplified Role-Based Flow
// ============================================

const FLOW_NODES = {
  // Student Dashboard
  StudentDash: {
    id: "StudentDash",
    message: "Welcome to your Student Dashboard! 🎓\nHere's what you can do:",
    options: [
      { label: "📝 Log Internship Activity", next: "Student_LogFlow" },
      { label: "📌 Record Activity", next: "Student_ActivityFlow" },
      { label: "💼 Browse Internships", next: "Student_Internships" },
      { label: "📚 Explore Courses", next: "Student_Courses" },
      { label: "📊 View Logbook", next: "Student_Logbook" },
      { label: "📋 Generate NEP Report", next: "Student_Reports" },
    ],
  },
  Student_LogFlow: {
    id: "Student_LogFlow",
    message:
      "📝 Add Internship Log Entry\n\n1️⃣ Click 'Add Log Entry'\n2️⃣ Fill in log details\n3️⃣ Save as Draft or Submit\n4️⃣ Faculty gets notified on submit",
    options: [
      { label: "💾 Save as Draft", next: "Log_Save" },
      { label: "📤 Submit for Review", next: "Log_Submit" },
      { label: "⬅️ Back", next: "StudentDash" },
    ],
  },
  Log_Save: {
    id: "Log_Save",
    message: "✅ Log saved as draft!\nYou can edit and submit later from your logbook.",
    options: [{ label: "⬅️ Back to Dashboard", next: "StudentDash" }],
  },
  Log_Submit: {
    id: "Log_Submit",
    message: "✅ Log submitted successfully!\nYour faculty has been notified for review.",
    options: [{ label: "⬅️ Back to Dashboard", next: "StudentDash" }],
  },
  Student_ActivityFlow: {
    id: "Student_ActivityFlow",
    message:
      "📌 Record an Activity\n\n1️⃣ Click 'Record Activity'\n2️⃣ Fill in activity details\n3️⃣ Upload proof (certificates, files)",
    options: [
      { label: "💾 Save Activity", next: "Activity_Save" },
      { label: "📎 Upload Proof", next: "Activity_Upload" },
      { label: "⬅️ Back", next: "StudentDash" },
    ],
  },
  Activity_Save: {
    id: "Activity_Save",
    message: "✅ Activity saved!\nYou can attach proof later from Activities page.",
    options: [{ label: "⬅️ Back to Dashboard", next: "StudentDash" }],
  },
  Activity_Upload: {
    id: "Activity_Upload",
    message:
      "📎 Upload Proof\n\n• Supported: Images, PDFs, Documents\n• Max size: 10MB\n• Multiple files allowed",
    options: [{ label: "⬅️ Back to Dashboard", next: "StudentDash" }],
  },
  Student_Internships: {
    id: "Student_Internships",
    message:
      "💼 Internship Marketplace\n\n• Browse available openings\n• Filter by skills, location, duration\n• Apply with portfolio\n• Track application status",
    options: [
      { label: "🔍 Search Internships", next: "SearchInternships" },
      { label: "⬅️ Back", next: "StudentDash" },
    ],
  },
  Student_Courses: {
    id: "Student_Courses",
    message:
      "📚 Course Explorer\n\n• Free & Paid courses\n• Government certified options\n• Skill-based recommendations\n• Progress tracking",
    options: [
      { label: "🔍 Search Courses", next: "SearchCourses" },
      { label: "⬅️ Back", next: "StudentDash" },
    ],
  },
  Student_Logbook: {
    id: "Student_Logbook",
    message:
      "📊 Your Logbook\n\n• View all log entries\n• Edit drafts\n• Track review status\n• Export as PDF",
    options: [{ label: "⬅️ Back to Dashboard", next: "StudentDash" }],
  },
  Student_Reports: {
    id: "Student_Reports",
    message:
      "📋 NEP Report Card\n\n1️⃣ Select internship & date range\n2️⃣ Generate PDF report\n3️⃣ Download or request faculty sign-off",
    options: [{ label: "⬅️ Back to Dashboard", next: "StudentDash" }],
  },

  // Faculty Dashboard
  FacultyDash: {
    id: "FacultyDash",
    message: "Welcome to Faculty Dashboard! 👨‍🏫\nManage your classes and students:",
    options: [
      { label: "📚 Manage Classes", next: "F_ManageClasses" },
      { label: "👥 View Students", next: "F_AssignedStudents" },
      { label: "📝 Review Submissions", next: "F_PendingReviews" },
      { label: "📊 Reports & Sign-off", next: "F_Reports" },
      { label: "💬 Chat with Students", next: "FacultyChat" },
    ],
  },
  F_ManageClasses: {
    id: "F_ManageClasses",
    message: "📚 Manage Classes\n\n• Create new classes\n• Assign students\n• Update class details",
    options: [{ label: "⬅️ Back", next: "FacultyDash" }],
  },
  F_AssignedStudents: {
    id: "F_AssignedStudents",
    message: "👥 Assigned Students\n\n• View student profiles\n• Track internship progress\n• Review submitted logs",
    options: [{ label: "⬅️ Back", next: "FacultyDash" }],
  },
  F_PendingReviews: {
    id: "F_PendingReviews",
    message: "📝 Pending Reviews\n\n• View submitted logs\n• Approve or request changes\n• Add feedback comments",
    options: [{ label: "⬅️ Back", next: "FacultyDash" }],
  },
  F_Reports: {
    id: "F_Reports",
    message: "📊 Reports & Sign-off\n\n• View NEP reports\n• Provide digital sign-off\n• Add feedback",
    options: [{ label: "⬅️ Back", next: "FacultyDash" }],
  },
  FacultyChat: {
    id: "FacultyChat",
    message: "💬 Student Chat\n\n• Direct messaging with students\n• Share resources\n• Provide guidance",
    options: [{ label: "⬅️ Back", next: "FacultyDash" }],
  },

  // Admin Dashboard
  AdminDash: {
    id: "AdminDash",
    message: "Welcome to Admin Dashboard! 🏫\nManage your institution:",
    options: [
      { label: "👨‍🏫 Manage Faculty", next: "IA_Faculty" },
      { label: "🎓 Manage Students", next: "IA_Students" },
      { label: "📚 Manage Classes", next: "IA_Classes" },
      { label: "🤝 Partnerships & MoUs", next: "IA_Partnerships" },
      { label: "📊 Analytics", next: "IA_Analytics" },
    ],
  },
  IA_Faculty: {
    id: "IA_Faculty",
    message: "👨‍🏫 Manage Faculty\n\n• Add new faculty\n• Update profiles\n• Manage access permissions",
    options: [{ label: "⬅️ Back", next: "AdminDash" }],
  },
  IA_Students: {
    id: "IA_Students",
    message: "🎓 Manage Students\n\n• View all students\n• Track activities\n• Export data",
    options: [{ label: "⬅️ Back", next: "AdminDash" }],
  },
  IA_Classes: {
    id: "IA_Classes",
    message: "📚 Manage Classes\n\n• Create class groups\n• Assign faculty\n• Bulk student enrollment",
    options: [{ label: "⬅️ Back", next: "AdminDash" }],
  },
  IA_Partnerships: {
    id: "IA_Partnerships",
    message: "🤝 Partnerships & MoUs\n\n• Track industry partnerships\n• Manage MoU documents\n• Company communications",
    options: [{ label: "⬅️ Back", next: "AdminDash" }],
  },
  IA_Analytics: {
    id: "IA_Analytics",
    message: "📊 Institute Analytics\n\n• Dashboard overview\n• Export reports\n• Internship statistics",
    options: [{ label: "⬅️ Back", next: "AdminDash" }],
  },

  // Mentor Dashboard
  MentorDash: {
    id: "MentorDash",
    message: "Welcome to Mentor Dashboard! 🧑‍🏫\nGuide and support students:",
    options: [
      { label: "📅 Set Availability", next: "M_Availability" },
      { label: "📆 View Calendar", next: "M_Calendar" },
      { label: "👥 My Students", next: "M_Assigned" },
      { label: "💬 Chat with Students", next: "MentorChat" },
    ],
  },
  M_Availability: {
    id: "M_Availability",
    message: "📅 Set Availability\n\n• Configure available slots\n• Set session duration\n• Block specific dates",
    options: [{ label: "⬅️ Back", next: "MentorDash" }],
  },
  M_Calendar: {
    id: "M_Calendar",
    message: "📆 Booking Calendar\n\n• View scheduled sessions\n• Upcoming appointments\n• Session history",
    options: [{ label: "⬅️ Back", next: "MentorDash" }],
  },
  M_Assigned: {
    id: "M_Assigned",
    message: "👥 Assigned Students\n\n• View mentee profiles\n• Track their progress\n• Session notes",
    options: [{ label: "⬅️ Back", next: "MentorDash" }],
  },
  MentorChat: {
    id: "MentorChat",
    message: "💬 Student Chat\n\n• Message students\n• Share resources\n• Schedule sessions",
    options: [{ label: "⬅️ Back", next: "MentorDash" }],
  },

  // Company Dashboard
  CompanyDash: {
    id: "CompanyDash",
    message: "Welcome to Company Dashboard! 🏢\nManage your internship programs:",
    options: [
      { label: "➕ Create Opening", next: "C_CreateOpening" },
      { label: "👥 View Applicants", next: "C_Applicants" },
      { label: "📊 Analytics", next: "C_Analytics" },
    ],
  },
  C_CreateOpening: {
    id: "C_CreateOpening",
    message:
      "➕ Create Internship\n\n• Fill opening details\n• Set requirements\n• Define stipend & duration\n• Publish to marketplace",
    options: [{ label: "⬅️ Back", next: "CompanyDash" }],
  },
  C_Applicants: {
    id: "C_Applicants",
    message: "👥 Manage Applicants\n\n• Filter candidates\n• Review portfolios\n• Select or reject\n• Schedule interviews",
    options: [{ label: "⬅️ Back", next: "CompanyDash" }],
  },
  C_Analytics: {
    id: "C_Analytics",
    message: "📊 Recruitment Analytics\n\n• Applications overview\n• Selection metrics\n• Internship performance",
    options: [{ label: "⬅️ Back", next: "CompanyDash" }],
  },

  // Publisher Dashboard
  PubDash: {
    id: "PubDash",
    message: "Welcome to Publisher Dashboard! 📚\nCreate and manage courses:",
    options: [
      { label: "➕ Create Course", next: "P_CreateCourse" },
      { label: "📊 My Courses", next: "P_MyCourses" },
    ],
  },
  P_CreateCourse: {
    id: "P_CreateCourse",
    message:
      "➕ Create Course\n\n• Add course content\n• Define learning outcomes\n• Set pricing (free/paid)\n• Upload resources",
    options: [
      { label: "🆓 Publish Free", next: "P_PublishFree" },
      { label: "💰 Publish Paid", next: "P_PublishPaid" },
      { label: "⬅️ Back", next: "PubDash" },
    ],
  },
  P_MyCourses: {
    id: "P_MyCourses",
    message: "📊 My Courses\n\n• View published courses\n• Track enrollments\n• Update content\n• View ratings",
    options: [{ label: "⬅️ Back", next: "PubDash" }],
  },
  P_PublishFree: {
    id: "P_PublishFree",
    message: "✅ Course published as FREE!\nStudents can now enroll without any cost.",
    options: [{ label: "⬅️ Back to Dashboard", next: "PubDash" }],
  },
  P_PublishPaid: {
    id: "P_PublishPaid",
    message: "✅ Course published as PAID!\nSet up your payment preferences in settings.",
    options: [{ label: "⬅️ Back to Dashboard", next: "PubDash" }],
  },

  // Search nodes
  SearchCourses: {
    id: "SearchCourses",
    message: "🔍 Searching courses...",
    options: [{ label: "⬅️ Back", next: "StudentDash" }],
    isDynamic: true,
  },
  SearchInternships: {
    id: "SearchInternships",
    message: "🔍 Searching internships...",
    options: [{ label: "⬅️ Back", next: "StudentDash" }],
    isDynamic: true,
  },
};

// ============================================
// API SERVICE
// ============================================

const chatbotApi = {
  getUserContext: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const response = await fetch(`${API_BASE_URL}/chatbot/user-context`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },

  getCourses: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.skill) params.append("skill", filters.skill);
      if (filters.limit) params.append("limit", filters.limit);
      const response = await fetch(`${API_BASE_URL}/chatbot/courses?${params}`);
      if (!response.ok) throw new Error("Failed");
      return await response.json();
    } catch {
      return { courses: [], total: 0 };
    }
  },

  getInternships: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.skill) params.append("skill", filters.skill);
      if (filters.limit) params.append("limit", filters.limit);
      const response = await fetch(`${API_BASE_URL}/chatbot/internships?${params}`);
      if (!response.ok) throw new Error("Failed");
      return await response.json();
    } catch {
      return { internships: [], total: 0 };
    }
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const getNode = (id) => FLOW_NODES[id] || FLOW_NODES["StudentDash"];

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Role Selection Card
const RoleCard = ({ role, isSelected, onClick, isAnimating }) => {
  const Icon = role.icon;
  
  return (
    <button
      onClick={onClick}
      disabled={isAnimating}
      className={`
        group relative w-full p-4 rounded-2xl border-2 transition-all duration-300
        ${isSelected 
          ? `${role.borderColor} ${role.bgLight} scale-[1.02] shadow-lg` 
          : `border-gray-100 bg-white hover:${role.bgLight} ${role.hoverBorder} hover:shadow-md`
        }
        ${isAnimating ? 'pointer-events-none' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`
          w-12 h-12 rounded-xl bg-gradient-to-br ${role.gradient} 
          flex items-center justify-center shadow-lg
          group-hover:scale-110 transition-transform duration-300
        `}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-gray-800 group-hover:text-gray-900">
            {role.label}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {role.description}
          </p>
        </div>
        <ChevronRight className={`
          w-5 h-5 text-gray-300 transition-all duration-300
          ${isSelected ? 'text-gray-600 translate-x-1' : 'group-hover:text-gray-500 group-hover:translate-x-1'}
        `} />
      </div>
      
      {isSelected && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 className={`w-5 h-5 text-${role.color}-500`} />
        </div>
      )}
    </button>
  );
};

// Message Bubble
const MessageBubble = ({ message, onOptionClick, isLatest }) => {
  const isUser = message.from === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}>
      <div className={`
        max-w-[85%] rounded-2xl px-4 py-3
        ${isUser 
          ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-md shadow-lg shadow-blue-500/20" 
          : "bg-white text-gray-800 border border-gray-100 rounded-bl-md shadow-sm"
        }
      `}>
        <div className="text-sm leading-relaxed whitespace-pre-line">
          {message.content}
        </div>
        
        {/* Options for bot messages */}
        {!isUser && message.options && isLatest && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            {message.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => onOptionClick(opt)}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-50 text-gray-700 
                         hover:bg-blue-50 hover:text-blue-700 transition-all duration-200
                         border border-gray-200 hover:border-blue-200"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
        
        <div className={`text-[10px] mt-2 ${isUser ? "text-blue-200" : "text-gray-400"}`}>
          {message.timestamp?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
};

// Typing Indicator
const TypingIndicator = () => (
  <div className="flex justify-start animate-fadeIn">
    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function ChatbotFlow() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("role-select"); // "role-select" | "chat"
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userContext, setUserContext] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Load user context
  useEffect(() => {
    if (isOpen) {
      chatbotApi.getUserContext().then(setUserContext);
    }
  }, [isOpen]);

  // Speech recognition setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join("");
        setInputText(transcript);
      };

      recognitionRef.current.onend = () => setIsRecording(false);
      recognitionRef.current.onerror = () => setIsRecording(false);
    }

    return () => recognitionRef.current?.abort();
  }, []);

  // Handle role selection
  const handleRoleSelect = (role) => {
    setIsAnimating(true);
    setSelectedRole(role);

    setTimeout(() => {
      const node = getNode(role.nodeId);
      setCurrentNodeId(role.nodeId);
      setMessages([
        {
          id: Date.now(),
          from: "bot",
          content: node.message,
          options: node.options,
          timestamp: new Date(),
        },
      ]);
      setView("chat");
      setIsAnimating(false);
    }, 500);
  };

  // Handle option click
  const handleOptionClick = (option) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        from: "user",
        content: option.label,
        timestamp: new Date(),
      },
    ]);

    setIsTyping(true);

    setTimeout(() => {
      const nextNode = getNode(option.next);
      setCurrentNodeId(option.next);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "bot",
          content: nextNode.message,
          options: nextNode.options,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  // Handle text input send
  const handleSend = () => {
    if (!inputText.trim() || isTyping) return;

    const text = inputText.trim();
    setInputText("");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        from: "user",
        content: text,
        timestamp: new Date(),
      },
    ]);

    setIsTyping(true);

    setTimeout(() => {
      const currentNode = getNode(currentNodeId);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "bot",
          content: "I understand! Here are your options:",
          options: currentNode.options,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  // Handle voice
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Text-to-speech
  const speakLastMessage = () => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const lastBot = [...messages].reverse().find((m) => m.from === "bot");
        if (lastBot) {
          const utterance = new SpeechSynthesisUtterance(
            lastBot.content.replace(/[📝📌💼📚📊📋💾📤📅📆👥💬➕🔍⬅️✅🆓💰🏢🧑‍🏫🎓👨‍🏫🏫🤝1️⃣2️⃣3️⃣4️⃣]/g, "")
          );
          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utterance);
        }
      }
    }
  };

  // Reset to role selection
  const handleBackToRoles = () => {
    setView("role-select");
    setSelectedRole(null);
    setMessages([]);
    setCurrentNodeId(null);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      {/* Custom Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 0.5; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          {/* Pulse ring */}
          {!isOpen && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full 
                          animate-ping opacity-75" />
          )}
          
          {/* Button */}
          <div className={`
            relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
            p-4 rounded-full shadow-xl shadow-blue-500/30
            transform transition-all duration-300
            ${isOpen ? 'rotate-0' : 'group-hover:scale-110'}
          `}>
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
          </div>

          {/* Notification badge */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full 
                           flex items-center justify-center text-[10px] text-white font-bold 
                           border-2 border-white animate-bounce">
              1
            </span>
          )}
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] 
                      rounded-3xl shadow-2xl bg-white overflow-hidden animate-slideUp
                      border border-gray-100"
             style={{ height: "600px", maxHeight: "calc(100vh - 150px)" }}>
          
          {/* Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            
            <div className="relative px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {view === "chat" && (
                    <button 
                      onClick={handleBackToRoles}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                  )}
                  <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl 
                                flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg">EduSphere</h2>
                    <p className="text-xs text-white/70 flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      {view === "role-select" ? "Choose your role" : selectedRole?.label}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {view === "chat" && (
                    <button 
                      onClick={speakLastMessage}
                      className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white/80" />
                      )}
                    </button>
                  )}
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-white/80" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col" style={{ height: "calc(100% - 80px)" }}>
            
            {/* Role Selection View */}
            {view === "role-select" && (
              <div className="flex-1 overflow-y-auto p-5">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
                    <Star className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Welcome to EduSphere!</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {userContext?.displayName 
                      ? `Hello, ${userContext.displayName}!` 
                      : "Let's get started"
                    }
                  </h3>
                  <p className="text-sm text-gray-500">
                    Select your role to explore the platform
                  </p>
                </div>

                <div className="space-y-3">
                  {ROLES.map((role) => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      isSelected={selectedRole?.id === role.id}
                      onClick={() => handleRoleSelect(role)}
                      isAnimating={isAnimating}
                    />
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-400">
                    Need help? Type a message below
                  </p>
                </div>
              </div>
            )}

            {/* Chat View */}
            {view === "chat" && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                  {messages.map((msg, idx) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      onOptionClick={handleOptionClick}
                      isLatest={idx === messages.length - 1 && msg.from === "bot"}
                    />
                  ))}
                  
                  {isTyping && <TypingIndicator />}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-100 bg-white">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type a message..."
                        disabled={isTyping}
                        className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 
                                 bg-gray-50 focus:bg-white focus:border-blue-300 
                                 focus:ring-2 focus:ring-blue-100 outline-none 
                                 transition-all text-sm disabled:opacity-50"
                      />
                      
                      {/* Voice button inside input */}
                      <button
                        onClick={toggleRecording}
                        disabled={isTyping}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl 
                                  transition-all disabled:opacity-50
                                  ${isRecording 
                                    ? 'bg-red-500 text-white' 
                                    : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                  }`}
                      >
                        {isRecording ? (
                          <MicOff className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Send button */}
                    <button
                      onClick={handleSend}
                      disabled={!inputText.trim() || isTyping}
                      className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                               rounded-2xl shadow-lg shadow-blue-500/30 
                               hover:shadow-xl hover:shadow-blue-500/40 
                               transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                      {isTyping ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <button 
                      onClick={handleBackToRoles}
                      className="text-xs text-gray-500 hover:text-blue-600 
                               flex items-center gap-1.5 transition-colors"
                    >
                      <Home className="w-3.5 h-3.5" />
                      Change Role
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <span className={`
                        text-[10px] px-2 py-1 rounded-full font-medium
                        bg-gradient-to-r ${selectedRole?.gradient} text-white
                      `}>
                        {selectedRole?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}