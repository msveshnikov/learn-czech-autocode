import React, { useState, useEffect } from 'react';
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
    ListItemIcon
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import apiService from '../services/apiService';
import Loading from '../components/Loading';
import Onboarding from '../components/Onboarding';
import { useLanguage } from '../contexts/LanguageContext';
import TranslateIcon from '@mui/icons-material/Translate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';

const Dashboard = () => {
    const [lessons, setLessons] = useState([]);
    const [userProgress, setUserProgress] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const [showOnboarding, setShowOnboarding] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { language } = useLanguage();

    const {
        data: dashboardData,
        isLoading,
        error
    } = useQuery('dashboard', apiService.getDashboardData);

    useEffect(() => {
        if (dashboardData) {
            setLessons(dashboardData.lessons || []);
            setUserProgress(dashboardData.userProgress || {});
        }
    }, [dashboardData]);

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
            content: 'Here you can see all available lessons.'
        },
        {
            target: '#user-progress',
            content: 'Track your learning progress here.'
        }
    ];

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Typography color="error">{error.message}</Typography>
            </Box>
        );
    }

    return (
        <>
            <Helmet>
                <title>Dashboard - Learn Czech from Russian</title>
                <meta
                    name="description"
                    content="Learn Czech language with interactive lessons designed for Russian speakers."
                />
            </Helmet>
            <Container maxWidth="lg">
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {language === 'ru' ? 'Панель управления' : 'Dashboard'}
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Paper
                                elevation={3}
                                sx={{ p: 2 }}
                                id="lessons-overview"
                            >
                                <Typography variant="h6" gutterBottom>
                                    {language === 'ru' ? 'Уроки' : 'Lessons'}
                                </Typography>
                                <List>
                                    {lessons.map((lesson) => (
                                        <ListItem
                                            key={lesson.id}
                                            secondaryAction={
                                                <Button
                                                    variant="contained"
                                                    onClick={() =>
                                                        handleStartLesson(
                                                            lesson.id
                                                        )
                                                    }
                                                >
                                                    {language === 'ru'
                                                        ? 'Начать'
                                                        : 'Start'}
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
                                    {language === 'ru'
                                        ? 'Ваш прогресс'
                                        : 'Your Progress'}
                                </Typography>
                                <List>
                                    {Object.entries(userProgress).map(
                                        ([key, value]) => (
                                            <ListItem key={key}>
                                                <ListItemIcon>
                                                    <CheckCircleIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={key}
                                                    secondary={`${value}%`}
                                                />
                                            </ListItem>
                                        )
                                    )}
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    {language === 'ru'
                                        ? 'Языковая практика'
                                        : 'Language Practice'}
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<TranslateIcon />}
                                    onClick={() => navigate('/lessons')}
                                    fullWidth={isMobile}
                                >
                                    {language === 'ru'
                                        ? 'Начать практику'
                                        : 'Start Practice'}
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
            {showOnboarding && (
                <Onboarding
                    steps={onboardingSteps}
                    onComplete={() => setShowOnboarding(false)}
                />
            )}
        </>
    );
};

export default React.memo(Dashboard);
