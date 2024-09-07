import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
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
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
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
        const { exerciseId, timeSpent } = req.body;
        const user = await User.findById(req.user.id);
        const exercise = await Exercise.findById(exerciseId);
        const score = exercise.calculateScore(timeSpent);
        user.addCompletedExercise(exerciseId, score);
        await user.save();
        res.json({ message: 'Exercise completed successfully', score });
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
            .select('username leaderboardScore');
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
            const nextLesson = await currentLesson.getNextLesson();
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
        const exercises = await Exercise.getRandomExercises(10);
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
            user.updateScore(score);
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
