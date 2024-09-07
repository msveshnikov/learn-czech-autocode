import axios from 'axios';

const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

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
        const response = await axios.get(`${API_BASE_URL}/lessons/${lessonId}`);
        return response.data;
    },

    submitExercise: async (exerciseId, answer, timeSpent) => {
        const response = await axios.post(`${API_BASE_URL}/exercises/submit`, {
            exerciseId,
            answer,
            timeSpent
        });
        return response.data;
    },

    fetchUserProgress: async () => {
        const response = await axios.get(`${API_BASE_URL}/user/progress`);
        return response.data;
    },

    fetchLeaderboard: async () => {
        const response = await axios.get(`${API_BASE_URL}/leaderboard`);
        return response.data;
    },

    fetchUserAchievements: async () => {
        const response = await axios.get(`${API_BASE_URL}/user/achievements`);
        return response.data;
    },

    getNotifications: async () => {
        const response = await axios.get(`${API_BASE_URL}/notifications`);
        return response.data;
    },

    markNotificationAsRead: async (notificationId) => {
        const response = await axios.put(
            `${API_BASE_URL}/notifications/${notificationId}`
        );
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
        const response = await axios.get(`${API_BASE_URL}/exercises`);
        return response.data;
    },

    submitPracticeExercise: async (exerciseId, answer, timeSpent) => {
        const response = await axios.post(
            `${API_BASE_URL}/exercises/submit`,
            { exerciseId, answer, timeSpent }
        );
        return response.data;
    },

    updateStreak: async () => {
        const response = await axios.post(`${API_BASE_URL}/user/streak`);
        return response.data;
    },

    completeLesson: async (lessonId) => {
        const response = await axios.post(`${API_BASE_URL}/lessons/complete`, {
            lessonId
        });
        return response.data;
    },

    getNextLesson: async (currentLessonId) => {
        const response = await axios.get(
            `${API_BASE_URL}/lessons/next/${currentLessonId}`
        );
        return response.data;
    },

    refreshToken: async () => {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`);
        apiService.setToken(response.data.token);
        return response.data;
    },

    logout: async () => {
        const response = await axios.post(`${API_BASE_URL}/auth/logout`);
        apiService.clearToken();
        return response.data;
    },

    getLanguageSettings: async () => {
        const response = await axios.get(`${API_BASE_URL}/settings/language`);
        return response.data;
    },

    updateLanguageSettings: async (settings) => {
        const response = await axios.put(
            `${API_BASE_URL}/settings/language`,
            settings
        );
        return response.data;
    },

    getFeedback: async () => {
        const response = await axios.get(`${API_BASE_URL}/feedback`);
        return response.data;
    },

    submitFeedback: async (feedback) => {
        const response = await axios.post(`${API_BASE_URL}/feedback`, feedback);
        return response.data;
    },

    getSpacedRepetitionExercises: async () => {
        const response = await axios.get(
            `${API_BASE_URL}/exercises/spaced-repetition`
        );
        return response.data;
    },

    submitSpacedRepetitionExercise: async (exerciseId, answer, timeSpent) => {
        const response = await axios.post(
            `${API_BASE_URL}/exercises/spaced-repetition/submit`,
            { exerciseId, answer, timeSpent }
        );
        return response.data;
    },

    getGamificationData: async () => {
        const response = await axios.get(`${API_BASE_URL}/gamification`);
        return response.data;
    },

    updateGamificationData: async (data) => {
        const response = await axios.put(`${API_BASE_URL}/gamification`, data);
        return response.data;
    },

    getPerformanceAnalytics: async () => {
        const response = await axios.get(
            `${API_BASE_URL}/analytics/performance`
        );
        return response.data;
    },

    updatePerformanceAnalytics: async (data) => {
        const response = await axios.put(
            `${API_BASE_URL}/analytics/performance`,
            data
        );
        return response.data;
    },

    getExercises: async () => {
        const response = await axios.get(`${API_BASE_URL}/exercises`);
        return response.data;
    }
};

export default apiService;
