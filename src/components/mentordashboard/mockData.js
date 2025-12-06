// mockData.js - Centralized mock data for Mentor Dashboard

export const MOCK_UPCOMING_SESSIONS = [
    { id: 1, student: "Priya Sharma", topic: "Career Guidance", time: "Today, 2:00 PM", status: "Confirmed" },
    { id: 2, student: "Arjun Mehta", topic: "Project Discussion", time: "Today, 4:30 PM", status: "Confirmed" },
    { id: 3, student: "Neha Patel", topic: "Internship Prep", time: "Tomorrow, 10:00 AM", status: "Pending" },
];

export const MOCK_ASSIGNED_STUDENTS = [
    { id: 101, name: "Priya Sharma", course: "Computer Science", progress: 85, lastContact: "2 days ago" },
    { id: 102, name: "Arjun Mehta", course: "Data Science", progress: 70, lastContact: "5 days ago" },
    { id: 103, name: "Neha Patel", course: "AI/ML", progress: 92, lastContact: "1 day ago" },
    { id: 104, name: "Rohan Kumar", course: "Web Development", progress: 60, lastContact: "1 week ago" },
];

export const MOCK_STUDENTS_DETAILED = [
    {
        id: 101,
        name: 'Priya Sharma',
        email: 'priya.sharma@college.edu',
        course: 'Computer Science',
        year: '3rd Year',
        progress: 85,
        lastContact: '2 days ago',
        sessionsCompleted: 8,
        upcomingSessions: 2,
        status: 'Active',
        interests: ['AI/ML', 'Web Development', 'Career Planning']
    },
    {
        id: 102,
        name: 'Arjun Mehta',
        email: 'arjun.mehta@college.edu',
        course: 'Data Science',
        year: '4th Year',
        progress: 70,
        lastContact: '5 days ago',
        sessionsCompleted: 5,
        upcomingSessions: 1,
        status: 'Active',
        interests: ['Data Analytics', 'Research', 'Internship Prep']
    },
    {
        id: 103,
        name: 'Neha Patel',
        email: 'neha.patel@college.edu',
        course: 'AI/ML',
        year: '3rd Year',
        progress: 92,
        lastContact: '1 day ago',
        sessionsCompleted: 12,
        upcomingSessions: 3,
        status: 'Excelling',
        interests: ['Deep Learning', 'Research Papers', 'Project Guidance']
    },
    {
        id: 104,
        name: 'Rohan Kumar',
        email: 'rohan.kumar@college.edu',
        course: 'Web Development',
        year: '2nd Year',
        progress: 60,
        lastContact: '1 week ago',
        sessionsCompleted: 3,
        upcomingSessions: 0,
        status: 'Needs Attention',
        interests: ['Full Stack', 'DSA', 'Problem Solving']
    },
    {
        id: 105,
        name: 'Sanya Verma',
        email: 'sanya.verma@college.edu',
        course: 'Cybersecurity',
        year: '4th Year',
        progress: 78,
        lastContact: '3 days ago',
        sessionsCompleted: 7,
        upcomingSessions: 1,
        status: 'Active',
        interests: ['Network Security', 'Ethical Hacking', 'Placement Prep']
    }
];

export const MOCK_BOOKINGS = [
    {
        id: 1,
        date: '2025-12-08',
        time: '10:00 AM - 11:00 AM',
        student: 'Priya Sharma',
        topic: 'Career Guidance',
        status: 'Confirmed',
        notes: 'Discussion about career paths in AI/ML'
    },
    {
        id: 2,
        date: '2025-12-08',
        time: '02:00 PM - 03:00 PM',
        student: 'Arjun Mehta',
        topic: 'Project Review',
        status: 'Pending',
        notes: 'Review of final year project progress'
    },
    {
        id: 3,
        date: '2025-12-09',
        time: '11:00 AM - 12:00 PM',
        student: 'Neha Patel',
        topic: 'Internship Preparation',
        status: 'Confirmed',
        notes: 'Interview preparation and resume review'
    },
    {
        id: 4,
        date: '2025-12-10',
        time: '03:00 PM - 04:00 PM',
        student: 'Rohan Kumar',
        topic: 'Technical Doubt Solving',
        status: 'Pending',
        notes: 'Help with data structures concepts'
    },
    {
        id: 5,
        date: '2025-12-11',
        time: '10:00 AM - 11:00 AM',
        student: 'Sanya Verma',
        topic: 'Course Selection',
        status: 'Confirmed',
        notes: 'Guidance on elective courses'
    }
];

export const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: 'booking_request',
        title: 'New Booking Request',
        message: 'Priya Sharma has requested a session on Dec 12 at 2:00 PM for Career Guidance',
        timestamp: '5 minutes ago',
        read: false,
        priority: 'high',
        actionRequired: true,
        relatedContext: {
            student: 'Priya Sharma',
            date: 'Dec 12, 2025',
            time: '2:00 PM',
            topic: 'Career Guidance'
        }
    },
    {
        id: 2,
        type: 'session_reminder',
        title: 'Upcoming Session Reminder',
        message: 'You have a session with Arjun Mehta starting in 2 hours',
        timestamp: '1 hour ago',
        read: false,
        priority: 'medium',
        actionRequired: false,
        relatedContext: {
            student: 'Arjun Mehta',
            time: '2 hours from now'
        }
    },
    {
        id: 3,
        type: 'message',
        title: 'New Message',
        message: 'Neha Patel sent you a message regarding project guidance',
        timestamp: '3 hours ago',
        read: false,
        priority: 'low',
        actionRequired: true,
        relatedContext: {
            student: 'Neha Patel'
        }
    },
    {
        id: 4,
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: 'Rohan Kumar confirmed the session scheduled for tomorrow at 10:00 AM',
        timestamp: '5 hours ago',
        read: true,
        priority: 'low',
        actionRequired: false,
        relatedContext: {
            student: 'Rohan Kumar',
            date: 'Tomorrow',
            time: '10:00 AM'
        }
    },
    {
        id: 5,
        type: 'booking_cancelled',
        title: 'Booking Cancelled',
        message: 'Sanya Verma cancelled the session scheduled for Dec 15',
        timestamp: '1 day ago',
        read: true,
        priority: 'medium',
        actionRequired: false,
        relatedContext: {
            student: 'Sanya Verma',
            date: 'Dec 15, 2025'
        }
    },
    {
        id: 6,
        type: 'system',
        title: 'Weekly Report Ready',
        message: 'Your weekly mentorship report is now available for review',
        timestamp: '2 days ago',
        read: true,
        priority: 'low',
        actionRequired: false
    }
];

export const MOCK_CHAT_CONTACTS = [
    {
        id: 1,
        name: 'Priya Sharma',
        avatar: 'PS',
        lastMessage: 'Thank you for the guidance!',
        timestamp: '2 min ago',
        unread: 2,
        online: true
    },
    {
        id: 2,
        name: 'Arjun Mehta',
        avatar: 'AM',
        lastMessage: 'Can we schedule a meeting?',
        timestamp: '15 min ago',
        unread: 1,
        online: true
    },
    {
        id: 3,
        name: 'Neha Patel',
        avatar: 'NP',
        lastMessage: 'I completed the assignment',
        timestamp: '1 hour ago',
        unread: 0,
        online: false
    },
    {
        id: 4,
        name: 'Rohan Kumar',
        avatar: 'RK',
        lastMessage: 'Need help with DSA',
        timestamp: '3 hours ago',
        unread: 0,
        online: false
    },
    {
        id: 5,
        name: 'Sanya Verma',
        avatar: 'SV',
        lastMessage: 'Thanks for the resources!',
        timestamp: '1 day ago',
        unread: 0,
        online: true
    }
];

export const MOCK_CHAT_MESSAGES = {
    1: [
        { id: 1, sender: 'student', text: 'Hi! I need some guidance on my career path.', timestamp: '10:00 AM' },
        { id: 2, sender: 'mentor', text: 'Hello Priya! I\'d be happy to help. What specific areas are you interested in?', timestamp: '10:02 AM' },
        { id: 3, sender: 'student', text: 'I\'m interested in AI/ML but also considering web development.', timestamp: '10:05 AM' },
        { id: 4, sender: 'mentor', text: 'Great choices! Both fields have excellent opportunities. Let\'s discuss your strengths and interests in our next session.', timestamp: '10:07 AM' },
        { id: 5, sender: 'student', text: 'Thank you for the guidance!', timestamp: '10:10 AM' }
    ],
    2: [
        { id: 1, sender: 'student', text: 'Hello sir, hope you\'re doing well.', timestamp: '9:30 AM' },
        { id: 2, sender: 'mentor', text: 'Hi Arjun! Yes, doing great. How can I help you?', timestamp: '9:35 AM' },
        { id: 3, sender: 'student', text: 'Can we schedule a meeting? I want to discuss my project.', timestamp: '9:40 AM' },
        { id: 4, sender: 'mentor', text: 'Sure! Let me check my calendar. How about tomorrow at 2 PM?', timestamp: '9:42 AM' }
    ]
};

export const MOCK_DASHBOARD_STATS = {
    totalStudents: 12,
    upcomingSessions: 3,
    pendingRequests: 5,
    monthlyHours: 24
};
