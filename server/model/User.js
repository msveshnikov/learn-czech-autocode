import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String },
    progress: {
        lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
        completedExercises: [
            {
                exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
                score: { type: Number, default: 0 },
                correct: { type: Boolean, default: false },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        streak: { type: Number, default: 0 },
        lastLoginDate: { type: Date, default: Date.now }
    },
    achievements: [
        {
            id: { type: String, required: true },
            name: { type: String, required: true },
            description: { type: String, required: true },
            icon: { type: String, required: true },
            unlocked: { type: Boolean, default: false },
            progress: { type: Number, default: 0 },
            target: { type: Number, required: true }
        }
    ],
    leaderboardScore: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    language: { type: String, default: 'ru' },
    notifications: [
        {
            message: String,
            read: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    learningGoal: { type: String },
    onboardingCompleted: { type: Boolean, default: false },
    dailyGoal: { type: Number, default: 50 },
    experiencePoints: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    lastActivity: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    this.updatedAt = Date.now();
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateStreak = function () {
    const now = new Date();
    const lastLogin = this.progress.lastLoginDate;
    const timeDiff = Math.abs(now - lastLogin);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
        this.progress.streak += 1;
    } else if (daysDiff > 1) {
        this.progress.streak = 0;
    }

    this.progress.lastLoginDate = now;
};

userSchema.methods.addCompletedExercise = function (exerciseId, correct, score) {
    const existingExercise = this.progress.completedExercises.find(
        (ce) => ce.exercise.toString() === exerciseId.toString()
    );

    if (existingExercise) {
        existingExercise.score = Math.max(existingExercise.score, score);
        existingExercise.correct = correct;
        existingExercise.createdAt = Date.now();
    } else {
        this.progress.completedExercises.push({
            exercise: exerciseId,
            score,
            correct,
            createdAt: Date.now()
        });
    }

    this.updateLeaderboardScore(score);
    this.addExperiencePoints(score);
    this.lastActivity = Date.now();
    this.checkAndUpdateAchievements();
};

userSchema.methods.addAchievement = function (achievement) {
    const existingAchievement = this.achievements.find((a) => a.id === achievement.id);
    if (existingAchievement) {
        existingAchievement.progress = achievement.progress;
        existingAchievement.unlocked = achievement.unlocked;
    } else {
        this.achievements.push(achievement);
    }
};

userSchema.methods.updateLeaderboardScore = function (score) {
    this.leaderboardScore += score;
};

userSchema.methods.addCompletedLesson = function (lessonId) {
    if (!this.progress.lessons.includes(lessonId)) {
        this.progress.lessons.push(lessonId);
    }
    this.lastActivity = Date.now();
    this.checkAndUpdateAchievements();
};

userSchema.methods.getProgress = function () {
    return {
        completedLessons: this.progress.lessons.length,
        completedExercises: this.progress.completedExercises.length,
        experiencePoints: this.experiencePoints,
        level: this.level,
        streak: this.progress.streak
    };
};

userSchema.methods.addNotification = function (message) {
    this.notifications.push({ message });
};

userSchema.methods.markNotificationAsRead = function (notificationId) {
    const notification = this.notifications.id(notificationId);
    if (notification) {
        notification.read = true;
    }
};

userSchema.methods.getUnreadNotifications = function () {
    return this.notifications.filter((notification) => !notification.read);
};

userSchema.methods.addExperiencePoints = function (points) {
    this.experiencePoints += points;
    this.updateLevel();
};

userSchema.methods.updateLevel = function () {
    const newLevel = Math.floor(this.experiencePoints / 100) + 1;
    if (newLevel > this.level) {
        this.level = newLevel;
        this.addNotification(`Поздравляем! Вы достигли уровня ${newLevel}!`);
    }
};

userSchema.methods.updateDailyGoal = function (newGoal) {
    this.dailyGoal = newGoal;
};

userSchema.methods.checkDailyGoal = function () {
    const today = new Date().toDateString();
    const todayExercises = this.progress.completedExercises.filter(
        (ce) => new Date(ce.createdAt).toDateString() === today
    );
    const todayScore = todayExercises.reduce((sum, ce) => sum + ce.score, 0);
    return todayScore >= this.dailyGoal;
};

userSchema.methods.updateLearningGoal = function (newGoal) {
    this.learningGoal = newGoal;
};

userSchema.methods.completeOnboarding = function () {
    this.onboardingCompleted = true;
};

userSchema.methods.getLastActivity = function () {
    return this.lastActivity;
};

userSchema.methods.updateLanguage = function (newLanguage) {
    this.language = newLanguage;
};

userSchema.methods.checkAndUpdateAchievements = function () {
    const achievementsToCheck = [
        {
            id: 'exercise_10',
            name: 'Начинающий ученик',
            description: 'Выполните 10 упражнений',
            icon: '🎓',
            target: 10,
            check: () => this.progress.completedExercises.length
        },
        {
            id: 'lesson_5',
            name: 'Прилежный студент',
            description: 'Завершите 5 уроков',
            icon: '📚',
            target: 5,
            check: () => this.progress.lessons.length
        },
        {
            id: 'streak_3',
            name: 'На верном пути',
            description: 'Достигните серии в 3 дня',
            icon: '🔥',
            target: 3,
            check: () => this.progress.streak
        },
        {
            id: 'perfect_score',
            name: 'Отличник',
            description: 'Получите идеальный результат в упражнении',
            icon: '🏅',
            target: 1,
            check: () => this.progress.completedExercises.some((ce) => ce.score === 100)
        },
        {
            id: 'level_5',
            name: 'Восходящая звезда',
            description: 'Достигните 5 уровня',
            icon: '⭐',
            target: 5,
            check: () => this.level
        }
    ];

    achievementsToCheck.forEach((achievement) => {
        const progress = achievement.check();
        const unlocked = progress >= achievement.target;
        this.addAchievement({
            ...achievement,
            progress,
            unlocked
        });
    });
};

const User = mongoose.model('User', userSchema);

export default User;
