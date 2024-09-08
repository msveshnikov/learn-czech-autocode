import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const apiService = {
    setToken: (token) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    clearToken: () => {
        delete axios.defaults.headers.common['Authorization'];
    },

    login: async (credentials) => {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        apiService.setToken(response.data.token);
        return response.data;
    },

    register: async (userData) => {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
        apiService.setToken(response.data.token);
        return response.data;
    },

    getUserAccount: async () => {
        const response = await axios.get(`${API_BASE_URL}/user`);
        return response.data;
    },

    updateUser: async (userData) => {
        const response = await axios.put(`${API_BASE_URL}/user`, userData);
        return response.data;
    },

    fetchLessons: async () => {
        const response = await axios.get(`${API_BASE_URL}/lessons`);
        return response.data;
    },

    getLesson: async (lessonId) => {
        const response = await axios.get(`${API_BASE_URL}/lesson/${lessonId}`);
        return response.data;
    },

    submitExercise: async (exerciseId, answer, timeSpent) => {
        const response = await axios.post(`${API_BASE_URL}/complete-exercise`, {
            exerciseId,
            answer,
            timeSpent
        });
        return response.data;
    },

    fetchUserProgress: async () => {
        const response = await axios.get(`${API_BASE_URL}/user-progress`);
        return response.data;
    },

    fetchLeaderboard: async () => {
        const response = await axios.get(`${API_BASE_URL}/leaderboard`);
        return response.data;
    },

    fetchUserAchievements: async () => {
        const response = await axios.get(`${API_BASE_URL}/achievements`);
        return response.data;
    },

    getNotifications: async () => {
        const response = await axios.get(`${API_BASE_URL}/notifications`);
        return response.data;
    },

    markNotificationAsRead: async (notificationId) => {
        const response = await axios.post(`${API_BASE_URL}/mark-notification-read`, {
            notificationId
        });
        return response.data;
    },

    getDashboardData: async () => {
        const response = await axios.get(`${API_BASE_URL}/dashboard`);
        return response.data;
    },

    getVocabulary: async () => {
        const response = await axios.get(`${API_BASE_URL}/vocabulary`);
        return response.data;
    },

    getPracticeExercises: async () => {
        const response = await axios.get(`${API_BASE_URL}/practice-exercises`);
        return response.data;
    },

    submitPracticeExercise: async (exerciseId, answer, timeSpent) => {
        const response = await axios.post(`${API_BASE_URL}/submit-practice-exercise`, {
            exerciseId,
            answer,
            timeSpent
        });
        return response.data;
    },

    updateStreak: async () => {
        const response = await axios.post(`${API_BASE_URL}/update-streak`);
        return response.data;
    },

    completeLesson: async (lessonId) => {
        const response = await axios.post(`${API_BASE_URL}/complete-lesson`, {
            lessonId
        });
        return response.data;
    },

    getNextLesson: async (currentLessonId) => {
        const response = await axios.get(`${API_BASE_URL}/next-lesson/${currentLessonId}`);
        return response.data;
    },

    getExercises: async () => {
        const response = await axios.get(`${API_BASE_URL}/exercises`);
        return response.data;
    },

    getExercise: async (exerciseId) => {
        const response = await axios.get(`${API_BASE_URL}/exercise/${exerciseId}`);
        return response.data;
    },

    setLearningGoal: async (goal) => {
        const response = await axios.put(`${API_BASE_URL}/user`, {
            learningGoal: goal
        });
        return response.data;
    },

    getWordOfTheDay: async () => {
        const response = await axios.get(`${API_BASE_URL}/word-of-the-day`);
        return response.data;
    },

    updateDailyGoal: async (newGoal) => {
        const response = await axios.put(`${API_BASE_URL}/user`, {
            dailyGoal: newGoal
        });
        return response.data;
    },

    checkDailyGoal: async () => {
        const response = await axios.get(`${API_BASE_URL}/check-daily-goal`);
        return response.data;
    },

    logout: async () => {
        apiService.clearToken();
    },

    speakToTeacher: async (message) => {
        const response = await axios.post(`${API_BASE_URL}/speak-to-teacher`, { message });
        return response.data.response;
    }
};

export default apiService;
