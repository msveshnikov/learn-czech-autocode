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

app.post('/api/complete-exercise', authenticateToken, async (req, res) => {
    try {
        const { exerciseId } = req.body;
        const user = await User.findById(req.user.id);
        user.progress.completedExercises.push(exerciseId);
        await user.save();
        res.json({ message: 'Exercise completed successfully' });
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
        res.json(user.progress);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user progress',
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
