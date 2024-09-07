import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField,
    Paper,
    Snackbar,
    Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const Exercise = () => {
    const { exerciseId } = useParams();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeSpent, setTimeSpent] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const fetchExercise = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.getExercises();
            const fetchedExercise = response.find(
                (ex) => ex._id === exerciseId
            );
            if (fetchedExercise) {
                setExercise(fetchedExercise);
            } else {
                setError('Exercise not found');
            }
        } catch (err) {
            setError('Failed to load exercise');
        } finally {
            setLoading(false);
        }
    }, [exerciseId]);

    useEffect(() => {
        fetchExercise();
    }, [fetchExercise]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeSpent((prevTime) => prevTime + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleAnswerChange = (event) => {
        setUserAnswer(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await apiService.submitExercise(
                exerciseId,
                userAnswer,
                timeSpent
            );
            setIsCorrect(response.correct);
            setShowFeedback(true);
        } catch (err) {
            setError('Failed to submit answer');
        }
    };

    const handleNextExercise = () => {
        navigate('/exercises');
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

    if (error) {
        return (
            <Box p={3}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {exercise.question}
                </Typography>
                {exercise.type === 'multipleChoice' && (
                    <RadioGroup
                        value={userAnswer}
                        onChange={handleAnswerChange}
                    >
                        {exercise.answers.map((answer, index) => (
                            <FormControlLabel
                                key={index}
                                value={answer}
                                control={<Radio />}
                                label={answer}
                            />
                        ))}
                    </RadioGroup>
                )}
                {exercise.type === 'fillInTheBlank' && (
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={userAnswer}
                        onChange={handleAnswerChange}
                        margin="normal"
                    />
                )}
                {exercise.type === 'listeningComprehension' && (
                    <>
                        <audio
                            controls
                            src={exercise.audioUrl}
                            style={{ marginBottom: '1rem' }}
                        />
                        <RadioGroup
                            value={userAnswer}
                            onChange={handleAnswerChange}
                        >
                            {exercise.answers.map((answer, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={answer}
                                    control={<Radio />}
                                    label={answer}
                                />
                            ))}
                        </RadioGroup>
                    </>
                )}
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Подтвердить
                    </Button>
                </Box>
            </Paper>
            <Typography variant="body2">
                Время: {Math.floor(timeSpent / 60)}:
                {timeSpent % 60 < 10 ? '0' : ''}
                {timeSpent % 60}
            </Typography>
            <Snackbar
                open={showFeedback}
                autoHideDuration={3000}
                onClose={() => setShowFeedback(false)}
            >
                <Alert
                    severity={isCorrect ? 'success' : 'error'}
                    sx={{ width: '100%' }}
                >
                    {isCorrect
                        ? 'Правильно!'
                        : 'Неправильно. Попробуйте еще раз.'}
                </Alert>
            </Snackbar>
            {showFeedback && (
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNextExercise}
                    >
                        Следующее упражнение
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Exercise;
