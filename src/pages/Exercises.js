import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchExercises = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.getPracticeExercises();
            setExercises(response);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching exercises:', error);
            setError(
                'Не удалось загрузить упражнения. Пожалуйста, попробуйте позже.'
            );
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises]);

    const handleExerciseClick = (exerciseId) => {
        navigate(`/lesson/${exerciseId}`);
    };

    const handleCloseError = () => {
        setError(null);
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Упражнения
            </Typography>
            <Grid container spacing={3}>
                {exercises.map((exercise) => (
                    <Grid item xs={12} sm={6} md={4} key={exercise._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {exercise.question}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {exercise.type === 'multipleChoice' &&
                                        'Выберите правильный ответ'}
                                    {exercise.type === 'fillInTheBlank' &&
                                        'Заполните пропуск'}
                                    {exercise.type ===
                                        'listeningComprehension' &&
                                        'Прослушайте и ответьте'}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                        handleExerciseClick(exercise._id)
                                    }
                                    sx={{ mt: 2 }}
                                >
                                    Начать
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseError}
            >
                <Alert
                    onClose={handleCloseError}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Exercises;
