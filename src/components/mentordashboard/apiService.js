// apiService.js - API service with fallback to mock data

import {
    MOCK_UPCOMING_SESSIONS,
    MOCK_ASSIGNED_STUDENTS,
    MOCK_STUDENTS_DETAILED,
    MOCK_BOOKINGS,
    MOCK_NOTIFICATIONS,
    MOCK_CHAT_CONTACTS,
    MOCK_CHAT_MESSAGES,
    MOCK_DASHBOARD_STATS
} from './mockData';

// Base API URL - Update this with your actual backend URL
const API_BASE_URL = typeof process !== 'undefined' && process.env?.REACT_APP_API_URL 
    ? process.env.REACT_APP_API_URL 
    : 'http://localhost:5000/api';

// Generic fetch function with error handling and fallback
async function fetchWithFallback(endpoint, mockData, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // If API returns empty data, use mock data
        if (!data || (Array.isArray(data) && data.length === 0)) {
            console.log(`📦 Using mock data for ${endpoint} (empty response)`);
            return mockData;
        }

        console.log(`✅ Fetched data from API: ${endpoint}`);
        return data;
    } catch (error) {
        console.log(`⚠️ API unavailable for ${endpoint}, using mock data:`, error.message);
        return mockData;
    }
}

// Dashboard Stats API
export async function getDashboardStats() {
    return fetchWithFallback('/mentor/stats', MOCK_DASHBOARD_STATS);
}

// Upcoming Sessions API
export async function getUpcomingSessions() {
    return fetchWithFallback('/mentor/sessions/upcoming', MOCK_UPCOMING_SESSIONS);
}

// Assigned Students API
export async function getAssignedStudents(detailed = false) {
    const mockData = detailed ? MOCK_STUDENTS_DETAILED : MOCK_ASSIGNED_STUDENTS;
    return fetchWithFallback('/mentor/students', mockData);
}

// Bookings API
export async function getBookings() {
    return fetchWithFallback('/mentor/bookings', MOCK_BOOKINGS);
}

export async function confirmBooking(bookingId) {
    try {
        const response = await fetch(`${API_BASE_URL}/mentor/bookings/${bookingId}/confirm`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) throw new Error('API Error');
        
        return await response.json();
    } catch (error) {
        console.log('⚠️ Using local state update for booking confirmation');
        return { success: true, bookingId };
    }
}

export async function cancelBooking(bookingId) {
    try {
        const response = await fetch(`${API_BASE_URL}/mentor/bookings/${bookingId}/cancel`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) throw new Error('API Error');
        
        return await response.json();
    } catch (error) {
        console.log('⚠️ Using local state update for booking cancellation');
        return { success: true, bookingId };
    }
}

// Notifications API
export async function getNotifications() {
    return fetchWithFallback('/mentor/notifications', MOCK_NOTIFICATIONS);
}

export async function markNotificationAsRead(notificationId) {
    try {
        const response = await fetch(`${API_BASE_URL}/mentor/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) throw new Error('API Error');
        
        return await response.json();
    } catch (error) {
        console.log('⚠️ Using local state update for notification read status');
        return { success: true, notificationId };
    }
}

export async function markAllNotificationsAsRead() {
    try {
        const response = await fetch(`${API_BASE_URL}/mentor/notifications/read-all`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) throw new Error('API Error');
        
        return await response.json();
    } catch (error) {
        console.log('⚠️ Using local state update for marking all notifications as read');
        return { success: true };
    }
}

// Chat API
export async function getChatContacts() {
    return fetchWithFallback('/mentor/chat/contacts', MOCK_CHAT_CONTACTS);
}

export async function getChatMessages(contactId) {
    const mockMessages = MOCK_CHAT_MESSAGES[contactId] || [];
    return fetchWithFallback(`/mentor/chat/messages/${contactId}`, mockMessages);
}

export async function sendChatMessage(contactId, message) {
    try {
        const response = await fetch(`${API_BASE_URL}/mentor/chat/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contactId, message }),
        });
        
        if (!response.ok) throw new Error('API Error');
        
        return await response.json();
    } catch (error) {
        console.log('⚠️ Using local state update for sending message');
        return {
            success: true,
            message: {
                id: Date.now(),
                sender: 'mentor',
                text: message,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
        };
    }
}

// Availability API
export async function getAvailability() {
    const mockAvailability = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    };
    return fetchWithFallback('/mentor/availability', mockAvailability);
}

export async function saveAvailability(availabilityData) {
    try {
        const response = await fetch(`${API_BASE_URL}/mentor/availability`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(availabilityData),
        });
        
        if (!response.ok) throw new Error('API Error');
        
        return await response.json();
    } catch (error) {
        console.log('⚠️ Using local state for availability update');
        return { success: true, data: availabilityData };
    }
}
