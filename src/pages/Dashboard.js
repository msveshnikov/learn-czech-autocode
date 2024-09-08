import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    useMediaQuery,
    Snackbar,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    LinearProgress,
    TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiService from '../services/apiService';
import Loading from '../components/Loading';
import TranslateIcon from '@mui/icons-material/Translate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import UIOverview from '../components/UIOverview';

const Dashboard = () => {
    const [lessons, setLessons] = useState([]);
    const [userProgress, setUserProgress] = useState({});
    const [streak, setStreak] = useState(0);
    const [achievements, setAchievements] = useState([]);
    const [leaderboardScore, setLeaderboardScore] = useState(0);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const [showUIOverview, setShowUIOverview] = useState(false);
    const [learningGoal, setLearningGoal] = useState('');
    const [wordOfTheDay, setWordOfTheDay] = useState({
        czech: '',
        russian: ''
    });
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const queryClient = useQueryClient();

    const {
        data: dashboardData,
        isLoading,
        error
    } = useQuery('dashboard', apiService.getDashboardData);

    const updateUserMutation = useMutation(apiService.updateUser, {
        onSuccess: () => {
            queryClient.invalidateQueries('dashboard');
            setSnackbar({
                open: true,
                message: 'Цель обучения успешно обновлена',
                severity: 'success'
            });
        },
        onError: (error) => {
            setSnackbar({
                open: true,
                message: 'Ошибка при обновлении цели обучения',
                severity: 'error'
            });
        }
    });

    useEffect(() => {
        if (dashboardData) {
            setLessons(dashboardData.lessons || []);
            setUserProgress(dashboardData.userProgress || {});
            setStreak(dashboardData.streak || 0);
            setAchievements(dashboardData.achievements || []);
            setLeaderboardScore(dashboardData.leaderboardScore || 0);
            setLearningGoal(dashboardData.learningGoal || '');
        }
    }, [dashboardData]);

    useEffect(() => {
        const uiOverviewShown = localStorage.getItem('uiOverviewShown');
        setShowUIOverview(!uiOverviewShown);
    }, []);

    useEffect(() => {
        const fetchWordOfTheDay = async () => {
            try {
                const word = await apiService.getWordOfTheDay();
                setWordOfTheDay(word);
            } catch (error) {
                console.error('Error fetching word of the day:', error);
            }
        };
        fetchWordOfTheDay();
    }, []);

    const handleStartLesson = (lessonId) => {
        navigate(`/lesson/${lessonId}`);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleLearningGoalChange = (event) => {
        setLearningGoal(event.target.value);
    };

    const handleLearningGoalSubmit = () => {
        updateUserMutation.mutate({ learningGoal });
    };

    const onboardingSteps = [
        {
            target: '#lessons-overview',
            content: 'Здесь вы можете видеть все доступные уроки.'
        },
        {
            target: '#user-progress',
            content: 'Отслеживайте свой прогресс обучения здесь.'
        },
        {
            target: '#streak',
            content: 'Следите за своей серией ежедневных занятий.'
        },
        {
            target: '#practice-button',
            content: 'Нажмите здесь, чтобы начать практику.'
        },
        {
            target: '#achievements',
            content: 'Ваши достижения и награды.'
        },
        {
            target: '#leaderboard',
            content: 'Сравните свой прогресс с другими учениками.'
        },
        {
            target: '#learning-goal',
            content: 'Установите свою цель обучения здесь.'
        },
        {
            target: '#word-of-the-day',
            content: 'Изучайте новое чешское слово каждый день.'
        }
    ];

    const handleUIOverviewComplete = useCallback(() => {
        setShowUIOverview(false);
        localStorage.setItem('uiOverviewShown', 'true');
    }, []);

    if (isLoading) return <Loading />;
    if (error) return <Typography color="error">{error.message}</Typography>;

    return (
        <>
            <Helmet>
                <title>Главная - Изучение чешского языка</title>
                <meta
                    name="description"
                    content="Изучайте чешский язык с помощью интерактивных уроков, разработанных для русскоговорящих."
                />
            </Helmet>
            <Container maxWidth="lg">
                <Box my={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Paper elevation={3} sx={{ p: 1 }} id="lessons-overview">
                                <Typography variant="h6" gutterBottom>
                                    Уроки
                                </Typography>
                                <List>
                                    {lessons.map((lesson) => (
                                        <ListItem
                                            key={lesson._id}
                                            secondaryAction={
                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleStartLesson(lesson._id)}
                                                >
                                                    Начать
                                                </Button>
                                            }
                                        >
                                            <ListItemIcon>
                                                <SchoolIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                sx={{ mr: 6 }}
                                                primary={lesson.title}
                                                secondary={lesson.description}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 2 }} id="user-progress">
                                <Typography variant="h6" gutterBottom>
                                    Ваш прогресс
                                </Typography>
                                <List>
                                    {Object.entries(userProgress).map(([key, value]) => (
                                        <ListItem key={key}>
                                            <ListItemIcon>
                                                <CheckCircleIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    key === 'completedLessons'
                                                        ? 'Завершенные уроки'
                                                        : key === 'completedExercises'
                                                        ? 'Завершенные упражнения'
                                                        : key === 'experiencePoints'
                                                        ? 'Очки опыта'
                                                        : key === 'level'
                                                        ? 'Уровень'
                                                        : key
                                                }
                                                secondary={
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={value}
                                                        sx={{ mt: 1 }}
                                                    />
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                            <Paper elevation={3} sx={{ p: 2, mt: 2 }} id="streak">
                                <Typography variant="h6" gutterBottom>
                                    Серия
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <WhatshotIcon color="error" sx={{ mr: 1 }} />
                                    <Typography variant="h4">{streak}</Typography>
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        дней
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Языковая практика
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<TranslateIcon />}
                                    onClick={() => navigate('/exercises')}
                                    fullWidth={isMobile}
                                    id="practice-button"
                                >
                                    Начать практику
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 2 }} id="achievements">
                                <Typography variant="h6" gutterBottom>
                                    Достижения
                                </Typography>
                                <List>
                                    {achievements.slice(0, 3).map((achievement, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <EmojiEventsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={achievement} />
                                        </ListItem>
                                    ))}
                                </List>
                                <Button
                                    variant="outlined"
                                    startIcon={<EmojiEventsIcon />}
                                    onClick={() => navigate('/achievements')}
                                    fullWidth={isMobile}
                                    sx={{ mt: 2 }}
                                >
                                    Посмотреть все достижения
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 2 }} id="leaderboard">
                                <Typography variant="h6" gutterBottom>
                                    Таблица лидеров
                                </Typography>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <LeaderboardIcon sx={{ mr: 1 }} />
                                    <Typography variant="body1">
                                        Ваш текущий счет: {leaderboardScore}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<LeaderboardIcon />}
                                    onClick={() => navigate('/leaderboard')}
                                    fullWidth={isMobile}
                                >
                                    Открыть таблицу лидеров
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 2 }} id="learning-goal">
                                <Typography variant="h6" gutterBottom>
                                    Цель обучения
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Ваша цель"
                                    value={learningGoal}
                                    onChange={handleLearningGoalChange}
                                    margin="normal"
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleLearningGoalSubmit}
                                    fullWidth={isMobile}
                                    sx={{ mt: 2 }}
                                >
                                    Установить цель
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 2 }} id="word-of-the-day">
                                <Typography variant="h6" gutterBottom>
                                    Слово дня
                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                    {wordOfTheDay.czech}
                                </Typography>
                                <Typography variant="body1">{wordOfTheDay.russian}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            {showUIOverview && (
                <UIOverview steps={onboardingSteps} onComplete={handleUIOverviewComplete} />
            )}
        </>
    );
};

export default React.memo(Dashboard);
