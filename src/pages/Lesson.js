import React, { useState, useEffect } from 'react';
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
    TextField
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

    const {
        data: lessonData,
        isLoading,
        error
    } = useQuery(['lesson', lessonId], () => apiService.getLesson(lessonId));

    const submitExerciseMutation = useMutation(
        ({ exerciseId, answer }) =>
            apiService.submitExercise(lessonId, exerciseId, answer),
        {
            onSuccess: (data) => {
                if (data.correct) {
                    setScore(score + 1);
                }
                if (currentExercise < lessonData.exercises.length - 1) {
                    setCurrentExercise(currentExercise + 1);
                    setUserAnswer('');
                } else {
                    setShowResult(true);
                }
            }
        }
    );

    useEffect(() => {
        if (lessonData) {
            setCurrentExercise(0);
            setUserAnswer('');
            setScore(0);
            setShowResult(false);
        }
    }, [lessonData]);

    if (isLoading) return <Loading />;
    if (error) return <Typography color="error">{error.message}</Typography>;

    const handleAnswer = (event) => {
        setUserAnswer(event.target.value);
    };

    const handleSubmit = () => {
        const currentExerciseData = lessonData.exercises[currentExercise];
        submitExerciseMutation.mutate({
            exerciseId: currentExerciseData.id,
            answer: userAnswer
        });
    };

    const resetLesson = () => {
        setCurrentExercise(0);
        setUserAnswer('');
        setScore(0);
        setShowResult(false);
    };

    const goToNextLesson = () => {
        const nextLessonId = parseInt(lessonId) + 1;
        navigate(`/lesson/${nextLessonId}`);
    };

    const renderExercise = () => {
        const exercise = lessonData.exercises[currentExercise];
        switch (exercise.type) {
            case 'multiple-choice':
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
                            {exercise.options.map((option, index) => (
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
            case 'fill-in-the-blank':
                return (
                    <TextField
                        fullWidth
                        label={'Введите ответ'}
                        variant="outlined"
                        value={userAnswer}
                        onChange={handleAnswer}
                        sx={{ mt: 2 }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md">
            <Helmet>
                <title>{`Урок ${lessonId} - Учим чешский с русского`}</title>
            </Helmet>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {`Урок ${lessonId}: ${lessonData.title}`}
                </Typography>
                <Paper elevation={3} sx={{ p: 3 }}>
                    {!showResult ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                {lessonData.exercises[currentExercise].question}
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
            </Box>
        </Container>
    );
};

export default Lesson;
