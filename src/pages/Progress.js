import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Container,
    CircularProgress
} from '@mui/material';
import apiService from '../services/apiService';

const Progress = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProgress = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiService.fetchUserProgress();
            setProgress(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching progress:', err);
            setError('Не удалось загрузить прогресс. Пожалуйста, попробуйте позже.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProgress();
    }, [fetchProgress]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Ваш прогресс
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Дней подряд
                                </Typography>
                                <Typography variant="h3" color="primary">
                                    {progress.streak}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Опыт (XP)
                                </Typography>
                                <Typography variant="h3" color="secondary">
                                    {progress.experiencePoints}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Уровень
                                </Typography>
                                <Typography variant="h3" color="info.main">
                                    {progress.level}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Завершенные упражнения
                                </Typography>
                                <Typography variant="h3" color="success.main">
                                    {progress.completedExercises}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Завершенные уроки
                    </Typography>
                    <Typography variant="h3" color="text.secondary">
                        {progress.completedLessons}
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Progress;
