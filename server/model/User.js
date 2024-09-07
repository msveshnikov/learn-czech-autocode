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
                exercise: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Exercise'
                },
                score: { type: Number, default: 0 },
                correct: { type: Boolean, default: false },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        streak: { type: Number, default: 0 },
        lastLoginDate: { type: Date, default: Date.now }
    },
    achievements: [{ type: String }],
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
    level: { type: Number, default: 1 }
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

userSchema.methods.addCompletedExercise = function (
    exerciseId,
    correct,
    score
) {
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
};

userSchema.methods.addAchievement = function (achievement) {
    if (!this.achievements.includes(achievement)) {
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

const User = mongoose.model('User', userSchema);

export default User;
