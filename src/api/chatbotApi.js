// src/api/chatbotApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - maybe redirect to login
      console.error('Unauthorized request');
    }
    return Promise.reject(error);
  }
);

export const chatbotApi = {
  // ============================================
  // MAIN CHAT ENDPOINT
  // ============================================
  
  /**
   * Send a message to the chatbot and get AI response
   * @param {string} message - User's message
   * @param {object} context - Conversation context
   * @returns {Promise<object>} Bot response with type and content
   */
  sendMessage: async (message, context = {}) => {
    try {
      const response = await api.post('/chatbot/message', {
        message,
        context,
        conversationHistory: context.history || [],
        files: context.files || [],
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // ============================================
  // COURSES ENDPOINTS
  // ============================================

  /**
   * Get all courses with optional filters
   * Based on: courses table with CourseType enum (PAID, FREE, GOVT)
   */
  getCourses: async (filters = {}) => {
    try {
      const response = await api.get('/chatbot/courses', { 
        params: {
          skill: filters.skill,
          type: filters.type, // PAID, FREE, GOVT
          search: filters.search,
          limit: filters.limit || 5,
          page: filters.page || 1,
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  /**
   * Search courses by skill/keyword
   */
  searchCoursesBySkill: async (skill) => {
    try {
      const response = await api.get('/chatbot/courses/search', {
        params: { skill },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  },

  /**
   * Get course recommendations based on user profile
   */
  getCourseRecommendations: async (profileId) => {
    try {
      const response = await api.get('/chatbot/courses/recommendations', {
        params: { profileId },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  },

  // ============================================
  // INTERNSHIPS ENDPOINTS
  // ============================================

  /**
   * Get internships with filters
   * Based on: internships table
   */
  getInternships: async (filters = {}) => {
    try {
      const response = await api.get('/chatbot/internships', { 
        params: {
          skill: filters.skill,
          location: filters.location,
          type: filters.type,
          isActive: filters.isActive ?? true,
          limit: filters.limit || 5,
          page: filters.page || 1,
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching internships:', error);
      throw error;
    }
  },

  /**
   * Search internships by required skills
   */
  searchInternshipsBySkill: async (skill) => {
    try {
      const response = await api.get('/chatbot/internships/search', {
        params: { skill },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching internships:', error);
      throw error;
    }
  },

  /**
   * Get internship application status
   * Based on: internship_applications table
   */
  getApplicationStatus: async (studentId) => {
    try {
      const response = await api.get('/chatbot/internships/applications', {
        params: { studentId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  // ============================================
  // MENTORS ENDPOINTS
  // ============================================

  /**
   * Get available mentors
   * Based on: mentors table
   */
  getMentors: async (filters = {}) => {
    try {
      const response = await api.get('/chatbot/mentors', { 
        params: {
          expertise: filters.expertise,
          limit: filters.limit || 5,
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching mentors:', error);
      throw error;
    }
  },

  /**
   * Get mentor sessions for a student
   * Based on: mentorSessions table
   */
  getMentorSessions: async (studentId) => {
    try {
      const response = await api.get('/chatbot/mentors/sessions', {
        params: { studentId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },

  // ============================================
  // USER CONTEXT & PROFILE
  // ============================================

  /**
   * Get user context for personalized responses
   * Based on: users, profile tables
   */
  getUserContext: async () => {
    try {
      const response = await api.get('/chatbot/user-context');
      return response.data;
    } catch (error) {
      console.error('Error getting user context:', error);
      return null; // Return null for unauthenticated users
    }
  },

  /**
   * Get user's learning progress
   * Based on: studentLearningProgress table
   */
  getLearningProgress: async (profileId) => {
    try {
      const response = await api.get('/chatbot/progress', {
        params: { profileId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  },

  // ============================================
  // ROADMAPS ENDPOINTS
  // ============================================

  /**
   * Get learning roadmaps
   * Based on: roadmaps, checkpoints tables
   */
  getRoadmaps: async (domain) => {
    try {
      const response = await api.get('/chatbot/roadmaps', {
        params: { domain },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      throw error;
    }
  },

  // ============================================
  // CERTIFICATES ENDPOINTS
  // ============================================

  /**
   * Get user certificates
   * Based on: certificates table
   */
  getCertificates: async (studentId) => {
    try {
      const response = await api.get('/chatbot/certificates', {
        params: { studentId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching certificates:', error);
      throw error;
    }
  },

  // ============================================
  // ASSESSMENTS ENDPOINTS
  // ============================================

  /**
   * Get assessments
   * Based on: assessments table
   */
  getAssessments: async (filters = {}) => {
    try {
      const response = await api.get('/chatbot/assessments', {
        params: {
          category: filters.category, // LOG, QUIZ, CAPSTONE, PROJECT, ASSIGNMENT
          instituteId: filters.instituteId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  },

  // ============================================
  // PARTNERSHIPS ENDPOINTS
  // ============================================

  /**
   * Get active partnerships
   * Based on: partnerships table
   */
  getPartnerships: async (filters = {}) => {
    try {
      const response = await api.get('/chatbot/partnerships', {
        params: {
          type: filters.type, // PLACEMENT, INTERNSHIP, TRAINING, RESEARCH, SPONSORSHIP
          status: filters.status, // ACTIVE, PENDING
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching partnerships:', error);
      throw error;
    }
  },

  // ============================================
  // COMPANIES ENDPOINTS
  // ============================================

  /**
   * Get companies
   * Based on: companies table
   */
  getCompanies: async (filters = {}) => {
    try {
      const response = await api.get('/chatbot/companies', {
        params: {
          industry: filters.industry,
          location: filters.location,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  // ============================================
  // INSTITUTIONS ENDPOINTS
  // ============================================

  /**
   * Get institutions
   * Based on: institutions table
   */
  getInstitutions: async (filters = {}) => {
    try {
      const response = await api.get('/chatbot/institutions', {
        params: {
          state: filters.state,
          city: filters.city,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching institutions:', error);
      throw error;
    }
  },

  // ============================================
  // FACULTY ENDPOINTS
  // ============================================

  /**
   * Get faculty members
   * Based on: faculty table
   */
  getFaculty: async (filters = {}) => {
    try {
      const response = await api.get('/chatbot/faculty', {
        params: {
          department: filters.department,
          instituteId: filters.instituteId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching faculty:', error);
      throw error;
    }
  },

  // ============================================
  // ANNOUNCEMENTS ENDPOINTS
  // ============================================

  /**
   * Get announcements
   * Based on: Announcement table
   */
  getAnnouncements: async (targetAudience) => {
    try {
      const response = await api.get('/chatbot/announcements', {
        params: { targetAudience },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  },

  // ============================================
  // SITE STATISTICS
  // ============================================

  /**
   * Get site-wide statistics
   */
  getSiteStats: async () => {
    try {
      const response = await api.get('/chatbot/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // ============================================
  // FILE UPLOAD
  // ============================================

  /**
   * Upload file attachment
   * @param {File} file - File to upload
   * @param {function} onProgress - Progress callback
   */
  uploadFile: async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/chatbot/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  /**
   * Delete uploaded file
   */
  deleteFile: async (fileId) => {
    try {
      const response = await api.delete(`/chatbot/upload/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // ============================================
  // FEEDBACK & HISTORY
  // ============================================

  /**
   * Submit feedback for a message
   */
  submitFeedback: async (messageId, rating, comment) => {
    try {
      const response = await api.post('/chatbot/feedback', {
        messageId,
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  /**
   * Get conversation history
   */
  getConversationHistory: async (conversationId) => {
    try {
      const response = await api.get('/chatbot/history', {
        params: { conversationId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  },

  /**
   * Save conversation to history
   */
  saveConversation: async (conversationData) => {
    try {
      const response = await api.post('/chatbot/history', conversationData);
      return response.data;
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================

  /**
   * Get user notifications
   * Based on: notifications, user_notifications tables
   */
  getNotifications: async () => {
    try {
      const response = await api.get('/chatbot/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // ============================================
  // LOGBOOK ENTRIES
  // ============================================

  /**
   * Get logbook entries
   * Based on: logbook_entries table
   */
  getLogbookEntries: async (applicationId) => {
    try {
      const response = await api.get('/chatbot/logbook', {
        params: { applicationId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching logbook:', error);
      throw error;
    }
  },

  // ============================================
  // CREDITS
  // ============================================

  /**
   * Get student credits
   * Based on: credits table
   */
  getCredits: async (studentId) => {
    try {
      const response = await api.get('/chatbot/credits', {
        params: { studentId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching credits:', error);
      throw error;
    }
  },
};

export default chatbotApi;