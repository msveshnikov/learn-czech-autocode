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
    Alert,
    Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({ category: null, difficulty: null });
    const navigate = useNavigate();

    const fetchExercises = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.getExercises();
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
        navigate(`/exercise/${exerciseId}`);
    };

    const handleCloseError = () => {
        setError(null);
    };

    const handleFilterChange = (type, value) => {
        setFilter((prev) => ({ ...prev, [type]: value }));
    };

    const filteredExercises = exercises.filter((exercise) => {
        return (
            (!filter.category || exercise.category === filter.category) &&
            (!filter.difficulty || exercise.difficulty === filter.difficulty)
        );
    });

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
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Фильтры:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {['vocabulary', 'grammar', 'pronunciation'].map(
                        (category) => (
                            <Chip
                                key={category}
                                label={category}
                                onClick={() =>
                                    handleFilterChange('category', category)
                                }
                                color={
                                    filter.category === category
                                        ? 'primary'
                                        : 'default'
                                }
                            />
                        )
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {['easy', 'medium', 'hard'].map((difficulty) => (
                        <Chip
                            key={difficulty}
                            label={difficulty}
                            onClick={() =>
                                handleFilterChange('difficulty', difficulty)
                            }
                            color={
                                filter.difficulty === difficulty
                                    ? 'primary'
                                    : 'default'
                            }
                        />
                    ))}
                </Box>
            </Box>
            <Grid container spacing={3}>
                {filteredExercises.map((exercise) => (
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
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 2
                                    }}
                                >
                                    <Chip
                                        label={exercise.category}
                                        size="small"
                                    />
                                    <Chip
                                        label={exercise.difficulty}
                                        size="small"
                                    />
                                </Box>
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
