import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await apiService.get('/exercises');
                setExercises(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching exercises:', error);
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    const handleExerciseClick = (exerciseId) => {
        navigate(`/lesson/${exerciseId}`);
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
                                    {exercise.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {exercise.description}
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
        </Box>
    );
};

export default Exercises;