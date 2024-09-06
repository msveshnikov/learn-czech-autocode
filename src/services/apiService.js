// src/services/apiService.js

const mockDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const apiService = {
    login: async (credentials) => {
        await mockDelay(500);
        return {
            token: 'mock_token',
            user: { id: 1, username: credentials.username }
        };
    },

    register: async (userData) => {
        await mockDelay(500);
        return { message: 'User registered successfully' };
    },

    getUserAccount: async () => {
        await mockDelay(300);
        return {
            id: 1,
            username: 'johndoe',
            email: 'john@example.com',
            balance: 50000
        };
    },

    updateUserAccount: async (accountData) => {
        await mockDelay(400);
        return { message: 'Account updated successfully' };
    },

    fetchLessons: async () => {
        await mockDelay(300);
        return [
            { id: 1, title: 'Basic Vocabulary', completed: false },
            { id: 2, title: 'Greetings', completed: false },
            { id: 3, title: 'Numbers', completed: false }
        ];
    },

    getLesson: async (lessonId) => {
        await mockDelay(300);
        return {
            id: lessonId,
            title: 'Basic Vocabulary',
            content: 'Content for Basic Vocabulary lesson',
            exercises: [
                {
                    id: 1,
                    type: 'multiple-choice',
                    question: 'What is "hello" in Czech?',
                    options: ['Ahoj', 'Nashledanou', 'Prosím', 'Děkuji'],
                    correctAnswer: 'Ahoj'
                },
                {
                    id: 2,
                    type: 'fill-in-the-blank',
                    question: 'Complete the sentence: "Jak se ___?"',
                    correctAnswer: 'máš'
                }
            ]
        };
    },

    submitExercise: async (lessonId, exerciseId, answer) => {
        await mockDelay(300);
        return {
            correct: true,
            feedback: 'Great job!'
        };
    },

    fetchUserProgress: async () => {
        await mockDelay(300);
        return {
            lessonsCompleted: 5,
            totalLessons: 20,
            streak: 3,
            xp: 1500
        };
    },

    fetchLeaderboard: async () => {
        await mockDelay(300);
        return [
            { id: 1, username: 'user1', xp: 2000 },
            { id: 2, username: 'user2', xp: 1800 },
            { id: 3, username: 'user3', xp: 1600 }
        ];
    },

    fetchUserAchievements: async () => {
        await mockDelay(300);
        return [
            { id: 1, title: 'First Lesson Completed', earned: true },
            { id: 2, title: '7 Day Streak', earned: false },
            { id: 3, title: 'Vocabulary Master', earned: false }
        ];
    },

    getNotifications: async () => {
        await mockDelay(300);
        return [
            { id: 1, message: 'New lesson available!', read: false },
            { id: 2, message: "You've reached a 3-day streak!", read: true }
        ];
    },

    markNotificationAsRead: async (notificationId) => {
        await mockDelay(200);
        return { message: `Notification ${notificationId} marked as read` };
    },

    getDashboardData: async () => {
        await mockDelay(500);
        return {
            lessonsCompleted: 5,
            totalLessons: 20,
            streak: 3,
            xp: 1500,
            recentAchievements: [{ id: 1, title: 'First Lesson Completed' }],
            nextLesson: { id: 6, title: 'Family Members' }
        };
    },

    getVocabulary: async () => {
        await mockDelay(400);
        return [
            { czech: 'Ahoj', russian: 'Привет', english: 'Hello' },
            { czech: 'Děkuji', russian: 'Спасибо', english: 'Thank you' },
            { czech: 'Prosím', russian: 'Пожалуйста', english: 'Please' }
        ];
    },

    getPracticeExercises: async () => {
        await mockDelay(400);
        return [
            {
                id: 1,
                type: 'multiple-choice',
                question: 'Translate "Dobrý den" to Russian',
                options: [
                    'Добрый день',
                    'Спокойной ночи',
                    'Пока',
                    'Здравствуйте'
                ],
                correctAnswer: 'Добрый день'
            },
            {
                id: 2,
                type: 'listening',
                audioUrl: 'https://example.com/audio/jak-se-mas.mp3',
                question: 'What did you hear?',
                options: ['Jak se máš?', 'Dobrý den', 'Na shledanou', 'Děkuji'],
                correctAnswer: 'Jak se máš?'
            }
        ];
    },

    submitPracticeExercise: async (exerciseId, answer) => {
        await mockDelay(300);
        return {
            correct: true,
            explanation: 'Correct! "Dobrý den" means "Добрый день" in Russian.'
        };
    }
};

export default apiService;
