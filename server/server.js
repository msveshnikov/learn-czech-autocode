import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './model/User.js';
import Lesson from './model/Lesson.js';
import Exercise from './model/Exercise.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(
    cors({
        origin: [
            'https://czech.autocode.work',
            'http://localhost:5000',
            'http://localhost:3000',
            '*'
        ],
        optionsSuccessStatus: 200
    })
);
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка при регистрации пользователя',
            error: error.message
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Пользователь не найден' });

        const validPassword = await user.comparePassword(password);
        if (!validPassword) return res.status(400).json({ message: 'Неверный пароль' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '14d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при входе в систему', error: error.message });
    }
});

app.get('/lessons', authenticateToken, async (req, res) => {
    try {
        const lessons = await Lesson.find().populate('exercises');
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении уроков', error: error.message });
    }
});

app.get('/lesson/:id', authenticateToken, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate('exercises');
        if (!lesson) {
            return res.status(404).json({ message: 'Урок не найден' });
        }
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении урока', error: error.message });
    }
});

app.post('/complete-exercise', authenticateToken, async (req, res) => {
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
        res.status(500).json({ message: 'Ошибка при выполнении упражнения', error: error.message });
    }
});

app.get('/user-progress', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate(
            'progress.lessons progress.completedExercises'
        );
        res.json(user.getProgress());
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка при получении прогресса пользователя',
            error: error.message
        });
    }
});

app.get('/leaderboard', authenticateToken, async (req, res) => {
    try {
        const leaderboard = await User.find()
            .sort({ leaderboardScore: -1 })
            .limit(10)
            .select('email leaderboardScore');
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка при получении таблицы лидеров',
            error: error.message
        });
    }
});

app.get('/achievements', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.achievements);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении достижений', error: error.message });
    }
});

app.post('/complete-lesson', authenticateToken, async (req, res) => {
    try {
        const { lessonId } = req.body;
        const user = await User.findById(req.user.id);
        user.addCompletedLesson(lessonId);
        user.updateStreak();
        await user.save();
        res.json({ message: 'Урок успешно завершен' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при завершении урока', error: error.message });
    }
});

app.get('/next-lesson/:currentLessonId', authenticateToken, async (req, res) => {
    try {
        const currentLesson = await Lesson.findById(req.params.currentLessonId);
        const nextLesson = await Lesson.findOne({ order: currentLesson.order + 1 });
        res.json(nextLesson);
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка при получении следующего урока',
            error: error.message
        });
    }
});

app.get('/vocabulary', authenticateToken, async (req, res) => {
    try {
        const lessons = await Lesson.find().select('vocabulary');
        const vocabulary = lessons.reduce((acc, lesson) => [...acc, ...lesson.vocabulary], []);
        res.json(vocabulary);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении словаря', error: error.message });
    }
});

app.get('/practice-exercises', authenticateToken, async (req, res) => {
    try {
        const exercises = await Exercise.aggregate([{ $sample: { size: 10 } }]);
        res.json(exercises);
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка при получении упражнений для практики',
            error: error.message
        });
    }
});

app.post('/submit-practice-exercise', authenticateToken, async (req, res) => {
    try {
        const { exerciseId, answer, timeSpent } = req.body;
        const exercise = await Exercise.findById(exerciseId);
        const correct = exercise.checkAnswer(answer);
        const score = exercise.calculateScore(timeSpent);
        const user = await User.findById(req.user.id);
        user.addCompletedExercise(exerciseId, correct, score);
        await user.save();
        res.json({ correct, score });
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка при отправке упражнения для практики',
            error: error.message
        });
    }
});

app.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const lessons = await Lesson.find().select('title description');
        const userProgress = user.getProgress();
        res.json({ lessons, userProgress });
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка при получении данных для панели управления',
            error: error.message
        });
    }
});

app.get('/exercises', authenticateToken, async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении упражнений', error: error.message });
    }
});

app.get('/exercise/:id', authenticateToken, async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) {
            return res.status(404).json({ message: 'Упражнение не найдено' });
        }
        res.json(exercise);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении упражнения', error: error.message });
    }
});

app.put('/user', authenticateToken, async (req, res) => {
    try {
        const { username, learningGoal, language, dailyGoal } = req.body;
        const user = await User.findById(req.user.id);
        if (username) user.username = username;
        if (learningGoal) user.learningGoal = learningGoal;
        if (language) user.language = language;
        if (dailyGoal) user.updateDailyGoal(dailyGoal);
        user.onboardingCompleted = true;
        await user.save();
        res.json({ message: 'Данные пользователя успешно обновлены' });
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка при обновлении данных пользователя',
            error: error.message
        });
    }
});

app.get('/notifications', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.getUnreadNotifications());
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении уведомлений', error: error.message });
    }
});

app.post('/mark-notification-read', authenticateToken, async (req, res) => {
    try {
        const { notificationId } = req.body;
        const user = await User.findById(req.user.id);
        user.markNotificationAsRead(notificationId);
        await user.save();
        res.json({ message: 'Уведомление отмечено как прочитанное' });
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка при отметке уведомления как прочитанного',
            error: error.message
        });
    }
});

app.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка при получении данных пользователя',
            error: error.message
        });
    }
});

app.get('/word-of-the-day', async (req, res) => {
    try {
        const vocabulary = await Lesson.aggregate([
            { $unwind: '$vocabulary' },
            { $sample: { size: 1 } }
        ]);
        res.json(vocabulary[0].vocabulary);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении слова дня', error: error.message });
    }
});

app.get('/check-daily-goal', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const goalAchieved = user.checkDailyGoal();
        res.json({ goalAchieved });
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка при проверке ежедневной цели',
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

        console.log('Данные успешно загружены');
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
};

mongoose.connection.once('open', () => {
    console.log('Подключено к MongoDB');
    loadDataToMongo();
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
