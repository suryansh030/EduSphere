// Centralized mock data for mentors - used by both mentorship landing page and mentor profiles

export const MENTORS_MOCK_DATA = [
  {
    id: "m1",
    name: "Aisha Khan",
    title: "Senior Product Manager",
    company: "Google",
    companyLogo: "G",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&fit=crop&q=80",
    skills: ["Product Strategy", "Roadmapping", "Interview Prep"],
    languages: ["English", "Hindi"],
    rating: 4.9,
    reviewsCount: 128,
    pricePerSession: 1500,
    sessionDurations: [30, 60],
    timezone: "Asia/Kolkata",
    availabilitySlots: [
      { id: "s1", start: "2026-01-12T09:00:00", label: "Tue, 9:00 AM" },
      { id: "s2", start: "2026-01-12T10:00:00", label: "Tue, 10:00 AM" },
    ],
    bio: "I help early-career PMs land their first product job. Ex-Microsoft, now leading growth at Google. Let's work on your resume and mock interviews.",
    metrics: { sessions: 356, acceptance: 98 },
    verified: true,
    superMentor: true,
    domain: "Product",
    availableToday: true
  },
  {
    id: "m2",
    name: "Rohit Gupta",
    title: "Staff Software Engineer",
    company: "Netflix",
    companyLogo: "N",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80",
    skills: ["React", "System Design", "Frontend"],
    languages: ["English"],
    rating: 4.8,
    reviewsCount: 84,
    pricePerSession: 2000,
    sessionDurations: [45],
    timezone: "US/Pacific",
    availabilitySlots: [
      { id: "s3", start: "2026-01-13T20:00:00", label: "Wed, 8:00 PM" },
    ],
    bio: "Frontend infrastructure expert. I can help you master React performance, advanced hooks, and crack system design rounds.",
    metrics: { sessions: 120, acceptance: 90 },
    verified: true,
    superMentor: false,
    domain: "Engineering",
    availableToday: false
  },
  {
    id: "m3",
    name: "Dr. Neha Rao",
    title: "AI Researcher",
    company: "OpenAI",
    companyLogo: "O",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&fit=crop&q=80",
    skills: ["Machine Learning", "LLMs", "Python"],
    languages: ["English", "Kannada"],
    rating: 5.0,
    reviewsCount: 210,
    pricePerSession: 3500,
    sessionDurations: [60],
    timezone: "Asia/Kolkata",
    availabilitySlots: [
      { id: "s4", start: "2026-01-15T11:00:00", label: "Fri, 11:00 AM" },
    ],
    bio: "Transitioning into AI? I guide engineers on building their first LLM applications and understanding the math behind transformers.",
    metrics: { sessions: 500, acceptance: 95 },
    verified: true,
    superMentor: true,
    domain: "Data Science",
    availableToday: true
  },
  {
    id: "m4",
    name: "Vikram Singh",
    title: "Design Lead",
    company: "Airbnb",
    companyLogo: "A",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&q=80",
    skills: ["UI/UX", "Figma", "Portfolio Review"],
    languages: ["English", "Punjabi"],
    rating: 4.7,
    reviewsCount: 65,
    pricePerSession: 1200,
    sessionDurations: [30, 60],
    timezone: "Europe/London",
    availabilitySlots: [],
    bio: "Design is about solving problems. I help designers build portfolios that get hired by top tech companies.",
    metrics: { sessions: 85, acceptance: 88 },
    verified: false,
    superMentor: false,
    domain: "Design",
    availableToday: false
  },
  {
    id: "m5",
    name: "Anjali Mehta",
    title: "Marketing Manager",
    company: "Spotify",
    companyLogo: "S",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80",
    skills: ["Brand Strategy", "Social Media", "Growth"],
    languages: ["English", "Hindi"],
    rating: 4.6,
    reviewsCount: 42,
    pricePerSession: 900,
    sessionDurations: [45],
    timezone: "Asia/Kolkata",
    availabilitySlots: [
      { id: "s5", start: "2026-01-12T16:00:00", label: "Tue, 4:00 PM" }
    ],
    bio: "Growth marketer with 7 years of experience. I can help you understand the modern marketing landscape.",
    metrics: { sessions: 60, acceptance: 92 },
    verified: true,
    superMentor: false,
    domain: "Marketing",
    availableToday: true
  }
];

// Get featured mentors (first 4 for trending section)
export const getFeaturedMentors = () => MENTORS_MOCK_DATA.slice(0, 4);

// Get all mentors
export const getAllMentors = () => MENTORS_MOCK_DATA;

// Get mentor by ID
export const getMentorById = (id) => MENTORS_MOCK_DATA.find(mentor => mentor.id === id);
