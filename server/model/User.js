import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    progress: {
        lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
        completedExercises: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }
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
    ]
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

userSchema.methods.addCompletedExercise = function (exerciseId) {
    if (!this.progress.completedExercises.includes(exerciseId)) {
        this.progress.completedExercises.push(exerciseId);
    }
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
        streak: this.progress.streak,
        achievements: this.achievements.length,
        leaderboardScore: this.leaderboardScore
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

const User = mongoose.model('User', userSchema);

export default User;
