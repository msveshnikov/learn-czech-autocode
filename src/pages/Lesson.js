import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    TextField,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import { Helmet } from 'react-helmet';
import apiService from '../services/apiService';
import Loading from '../components/Loading';

const Lesson = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [currentExercise, setCurrentExercise] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);

    const {
        data: lessonData,
        isLoading,
        error
    } = useQuery(['lesson', lessonId], () => apiService.getLesson(lessonId));

    const submitExerciseMutation = useMutation(
        ({ exerciseId, answer, timeSpent }) =>
            apiService.submitExercise(exerciseId, answer, timeSpent),
        {
            onSuccess: (data) => {
                if (data.correct) {
                    setScore(score + 1);
                }
                if (currentExercise < lessonData.exercises.length - 1) {
                    setCurrentExercise(currentExercise + 1);
                    setUserAnswer('');
                    setTimeSpent(0);
                } else {
                    setShowResult(true);
                }
            }
        }
    );

    const completeLessonMutation = useMutation(() =>
        apiService.completeLesson(lessonId)
    );

    useEffect(() => {
        if (lessonData) {
            setCurrentExercise(0);
            setUserAnswer('');
            setScore(0);
            setShowResult(false);
            setTimeSpent(0);
        }
    }, [lessonData]);

    useEffect(() => {
        let timer;
        if (!showResult) {
            timer = setInterval(() => {
                setTimeSpent((prevTime) => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showResult]);

    const handleAnswer = useCallback((event) => {
        setUserAnswer(event.target.value);
    }, []);

    const handleSubmit = useCallback(() => {
        const currentExerciseData = lessonData.exercises[currentExercise];
        submitExerciseMutation.mutate({
            exerciseId: currentExerciseData._id,
            answer: userAnswer,
            timeSpent
        });
    }, [
        currentExercise,
        lessonData,
        submitExerciseMutation,
        userAnswer,
        timeSpent
    ]);

    const resetLesson = useCallback(() => {
        setCurrentExercise(0);
        setUserAnswer('');
        setScore(0);
        setShowResult(false);
        setTimeSpent(0);
    }, []);

    const goToNextLesson = useCallback(() => {
        completeLessonMutation.mutate(null, {
            onSuccess: () => {
                apiService.getNextLesson(lessonId).then((nextLesson) => {
                    if (nextLesson) {
                        navigate(`/lesson/${nextLesson._id}`);
                    } else {
                        navigate('/lessons');
                    }
                });
            }
        });
    }, [completeLessonMutation, lessonId, navigate]);

    const renderExercise = useCallback(() => {
        const exercise = lessonData.exercises[currentExercise];
        switch (exercise.type) {
            case 'multipleChoice':
                return (
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <FormLabel component="legend">
                            Выберите правильный ответ
                        </FormLabel>
                        <RadioGroup
                            aria-label="quiz"
                            name="quiz"
                            value={userAnswer}
                            onChange={handleAnswer}
                        >
                            {exercise.answers.map((option, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                );
            case 'fillInTheBlank':
                return (
                    <TextField
                        fullWidth
                        label="Введите ответ"
                        variant="outlined"
                        value={userAnswer}
                        onChange={handleAnswer}
                        sx={{ mt: 2 }}
                    />
                );
            default:
                return null;
        }
    }, [lessonData, currentExercise, userAnswer, handleAnswer]);

    if (isLoading) return <Loading />;
    if (error) return <Typography color="error">{error.message}</Typography>;

    return (
        <Container maxWidth="md">
            <Helmet>
                <title>{`Урок ${lessonData.title} - Учим чешский с русского`}</title>
            </Helmet>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {`Урок ${lessonData.title}: ${lessonData.description}`}
                </Typography>
                <Paper elevation={3} sx={{ p: 3 }}>
                    {!showResult ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                {
                                    lessonData.exercises[currentExercise]
                                        .question
                                }
                            </Typography>
                            {renderExercise()}
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
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Результат
                            </Typography>
                            <Typography>
                                {`Вы ответили правильно на ${score} из ${lessonData.exercises.length} вопросов.`}
                            </Typography>
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={resetLesson}
                                    sx={{ mr: 2 }}
                                >
                                    Повторить урок
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={goToNextLesson}
                                >
                                    Следующий урок
                                </Button>
                            </Box>
                        </>
                    )}
                </Paper>
                <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Словарь урока
                    </Typography>
                    <List>
                        {lessonData.vocabulary.map((word, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`${word.czech} - ${word.russian}`}
                                    secondary={word.english}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>
        </Container>
    );
};

export default Lesson;