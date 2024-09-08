import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField,
    Paper,
    Snackbar,
    Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { Helmet } from 'react-helmet';
import apiService, { API_BASE_URL } from '../services/apiService';
import Loading from '../components/Loading';

const Exercise = () => {
    const { exerciseId } = useParams();
    const navigate = useNavigate();
    const [userAnswer, setUserAnswer] = useState('');
    const [timeSpent, setTimeSpent] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const {
        data: exercise,
        isLoading,
        error
    } = useQuery(['exercise', exerciseId], () => apiService.getExercise(exerciseId));

    const submitExerciseMutation = useMutation(
        (data) => apiService.submitPracticeExercise(data.exerciseId, data.answer, data.timeSpent),
        {
            onSuccess: (data) => {
                setIsCorrect(data.correct);
                setShowFeedback(true);
            }
        }
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeSpent((prevTime) => prevTime + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleAnswerChange = useCallback((event) => {
        setUserAnswer(event.target.value);
    }, []);

    const handleSubmit = useCallback(() => {
        submitExerciseMutation.mutate({
            exerciseId,
            answer: userAnswer,
            timeSpent
        });
    }, [exerciseId, userAnswer, timeSpent, submitExerciseMutation]);

    const handleNextExercise = useCallback(() => {
        navigate('/exercises');
    }, [navigate]);

    if (isLoading) return <Loading />;
    if (error) return <Typography color="error">Ошибка при загрузке упражнения</Typography>;

    return (
        <Box p={3}>
            <Helmet>
                <title>Упражнение - Учим чешский с русского</title>
            </Helmet>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {exercise.question}
                </Typography>
                {exercise.type === 'multipleChoice' && (
                    <RadioGroup value={userAnswer} onChange={handleAnswerChange}>
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
                            crossOrigin="anonymous"
                            src={API_BASE_URL + exercise.audioUrl}
                            style={{ marginBottom: '1rem' }}
                        />
                        <RadioGroup value={userAnswer} onChange={handleAnswerChange}>
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
                        disabled={!userAnswer}
                    >
                        Подтвердить
                    </Button>
                </Box>
            </Paper>
            <Typography variant="body2">
                Время: {Math.floor(timeSpent / 60)}:{timeSpent % 60 < 10 ? '0' : ''}
                {timeSpent % 60}
            </Typography>
            <Snackbar
                open={showFeedback}
                autoHideDuration={3000}
                onClose={() => setShowFeedback(false)}
            >
                <Alert severity={isCorrect ? 'success' : 'error'} sx={{ width: '100%' }}>
                    {isCorrect ? 'Правильно!' : 'Неправильно. Попробуйте еще раз.'}
                </Alert>
            </Snackbar>
            {showFeedback && (
                <Box mt={2}>
                    <Button variant="contained" color="primary" onClick={handleNextExercise}>
                        Следующее упражнение
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Exercise;
