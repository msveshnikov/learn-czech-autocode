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
    LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
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
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const [showUIOverview, setShowUIOverview] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        data: dashboardData,
        isLoading,
        error
    } = useQuery('dashboard', apiService.getDashboardData);

    useEffect(() => {
        if (dashboardData) {
            setLessons(dashboardData.lessons || []);
            setUserProgress(dashboardData.userProgress || {});
            setStreak(dashboardData.streak || 0);
        }
    }, [dashboardData]);

    useEffect(() => {
        const uiOverviewShown = localStorage.getItem('uiOverviewShown');
        setShowUIOverview(!uiOverviewShown);
    }, []);

    const handleStartLesson = (lessonId) => {
        navigate(`/lesson/${lessonId}`);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
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
                <title>Панель управления - Изучение чешского языка</title>
                <meta
                    name="description"
                    content="Изучайте чешский язык с помощью интерактивных уроков, разработанных для русскоговорящих."
                />
            </Helmet>
            <Container maxWidth="lg">
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Панель управления
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Paper
                                elevation={3}
                                sx={{ p: 2 }}
                                id="lessons-overview"
                            >
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
                                                    onClick={() =>
                                                        handleStartLesson(
                                                            lesson._id
                                                        )
                                                    }
                                                >
                                                    Начать
                                                </Button>
                                            }
                                        >
                                            <ListItemIcon>
                                                <SchoolIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={lesson.title}
                                                secondary={lesson.description}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={3}
                                sx={{ p: 2 }}
                                id="user-progress"
                            >
                                <Typography variant="h6" gutterBottom>
                                    Ваш прогресс
                                </Typography>
                                <List>
                                    {Object.entries(userProgress).map(
                                        ([key, value]) => (
                                            <ListItem key={key}>
                                                <ListItemIcon>
                                                    <CheckCircleIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={key === 'completedLessons' ? 'Завершенные уроки' :
                                                             key === 'completedExercises' ? 'Завершенные упражнения' :
                                                             key === 'experiencePoints' ? 'Очки опыта' :
                                                             key === 'level' ? 'Уровень' : key}
                                                    secondary={
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={value}
                                                            sx={{ mt: 1 }}
                                                        />
                                                    }
                                                />
                                            </ListItem>
                                        )
                                    )}
                                </List>
                            </Paper>
                            <Paper
                                elevation={3}
                                sx={{ p: 2, mt: 2 }}
                                id="streak"
                            >
                                <Typography variant="h6" gutterBottom>
                                    Серия
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <WhatshotIcon
                                        color="error"
                                        sx={{ mr: 1 }}
                                    />
                                    <Typography variant="h4">
                                        {streak}
                                    </Typography>
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
                                <Button
                                    variant="outlined"
                                    startIcon={<EmojiEventsIcon />}
                                    onClick={() => navigate('/achievements')}
                                    fullWidth={isMobile}
                                >
                                    Посмотреть достижения
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 2 }} id="leaderboard">
                                <Typography variant="h6" gutterBottom>
                                    Таблица лидеров
                                </Typography>
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
                    </Grid>
                </Box>
            </Container>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            {showUIOverview && (
                <UIOverview
                    steps={onboardingSteps}
                    onComplete={handleUIOverviewComplete}
                />
            )}
        </>
    );
};

export default React.memo(Dashboard);