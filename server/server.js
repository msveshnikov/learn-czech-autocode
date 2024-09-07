import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

import User from './model/User.js';
import Lesson from './model/Lesson.js';
import Exercise from './model/Exercise.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error registering user',
            error: error.message
        });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const validPassword = await user.comparePassword(password);
        if (!validPassword)
            return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '14d'
        });
        res.json({ token });
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
});

app.get('/api/lessons', authenticateToken, async (req, res) => {
    try {
        const lessons = await Lesson.find().populate('exercises');
        res.json(lessons);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching lessons',
            error: error.message
        });
    }
});

app.get('/api/lesson/:id', authenticateToken, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate(
            'exercises'
        );
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.json(lesson);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching lesson',
            error: error.message
        });
    }
});

app.post('/api/complete-exercise', authenticateToken, async (req, res) => {
    try {
        const { exerciseId, answer, timeSpent } = req.body;
        const user = await User.findById(req.user.id);
        const exercise = await Exercise.findById(exerciseId);
        const correct = exercise.checkAnswer(answer);
        const score = exercise.calculateScore(timeSpent);
        user.addCompletedExercise(exerciseId, correct, score);
        await user.save();
        res.json({ correct, score });
    } catch (error) {
        res.status(500).json({
            message: 'Error completing exercise',
            error: error.message
        });
    }
});

app.get('/api/user-progress', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate(
            'progress.lessons progress.completedExercises'
        );
        res.json(user.getProgress());
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user progress',
            error: error.message
        });
    }
});

app.get('/api/leaderboard', authenticateToken, async (req, res) => {
    try {
        const leaderboard = await User.find()
            .sort({ leaderboardScore: -1 })
            .limit(10)
            .select('email leaderboardScore');
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching leaderboard',
            error: error.message
        });
    }
});

app.get('/api/achievements', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.achievements);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching achievements',
            error: error.message
        });
    }
});

app.post('/api/update-streak', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.updateStreak();
        await user.save();
        res.json({
            message: 'Streak updated successfully',
            streak: user.progress.streak
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating streak',
            error: error.message
        });
    }
});

app.post('/api/complete-lesson', authenticateToken, async (req, res) => {
    try {
        const { lessonId } = req.body;
        const user = await User.findById(req.user.id);
        user.addCompletedLesson(lessonId);
        await user.save();
        res.json({ message: 'Lesson completed successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error completing lesson',
            error: error.message
        });
    }
});

app.get(
    '/api/next-lesson/:currentLessonId',
    authenticateToken,
    async (req, res) => {
        try {
            const currentLesson = await Lesson.findById(
                req.params.currentLessonId
            );
            const nextLesson = await Lesson.findOne({
                order: currentLesson.order + 1
            });
            res.json(nextLesson);
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching next lesson',
                error: error.message
            });
        }
    }
);

app.get('/api/vocabulary', authenticateToken, async (req, res) => {
    try {
        const lessons = await Lesson.find().select('vocabulary');
        const vocabulary = lessons.reduce(
            (acc, lesson) => [...acc, ...lesson.vocabulary],
            []
        );
        res.json(vocabulary);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching vocabulary',
            error: error.message
        });
    }
});

app.get('/api/practice-exercises', authenticateToken, async (req, res) => {
    try {
        const exercises = await Exercise.aggregate([{ $sample: { size: 10 } }]);
        res.json(exercises);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching practice exercises',
            error: error.message
        });
    }
});

app.post(
    '/api/submit-practice-exercise',
    authenticateToken,
    async (req, res) => {
        try {
            const { exerciseId, answer, timeSpent } = req.body;
            const exercise = await Exercise.findById(exerciseId);
            const correct = exercise.checkAnswer(answer);
            const score = exercise.calculateScore(timeSpent);
            const user = await User.findById(req.user.id);
            user.updateLeaderboardScore(score);
            await user.save();
            res.json({ correct, score });
        } catch (error) {
            res.status(500).json({
                message: 'Error submitting practice exercise',
                error: error.message
            });
        }
    }
);

app.get('/api/dashboard', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const lessons = await Lesson.find().select('title description');
        const userProgress = user.getProgress();
        res.json({ lessons, userProgress });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
});

app.get('/api/exercises', authenticateToken, async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.json(exercises);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching exercises',
            error: error.message
        });
    }
});

app.put('/api/user', authenticateToken, async (req, res) => {
    try {
        const { username, learningGoal, language } = req.body;
        const user = await User.findById(req.user.id);
        if (username) user.username = username;
        if (learningGoal) user.learningGoal = learningGoal;
        if (language) user.language = language;
        user.onboardingCompleted = true;
        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user',
            error: error.message
        });
    }
});

app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.getUnreadNotifications());
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching notifications',
            error: error.message
        });
    }
});

app.post('/api/mark-notification-read', authenticateToken, async (req, res) => {
    try {
        const { notificationId } = req.body;
        const user = await User.findById(req.user.id);
        user.markNotificationAsRead(notificationId);
        await user.save();
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({
            message: 'Error marking notification as read',
            error: error.message
        });
    }
});

app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user data',
            error: error.message
        });
    }
});

const loadDataToMongo = async () => {
    try {
        const lessonsData = JSON.parse(
            await fs.readFile(path.join(process.cwd(), 'lessons.json'), 'utf-8')
        );

        await Lesson.deleteMany({});
        await Exercise.deleteMany({});

        for (const lessonData of lessonsData) {
            const lesson = new Lesson({
                ...lessonData,
                exercises: []
            });

            for (const exerciseData of lessonData.exercises) {
                const exercise = new Exercise(exerciseData);
                await exercise.save();
                lesson.exercises.push(exercise._id);
            }

            await lesson.save();
        }

        console.log('Data loaded successfully');
    } catch (error) {
        console.error('Error loading data:', error);
    }
};

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    loadDataToMongo();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
