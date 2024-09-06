import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    Grid,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel
} from '@mui/material';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet';
import apiService from '../services/apiService';
import Loading from '../components/Loading';
import { useLanguage } from '../contexts/LanguageContext';

const Lesson = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const { language } = useLanguage();

    const {
        data: lessonData,
        isLoading,
        error
    } = useQuery('lesson', () => apiService.getLesson(language));

    useEffect(() => {
        if (lessonData) {
            setCurrentQuestion(0);
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
        if (userAnswer === lessonData[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }

        if (currentQuestion < lessonData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setUserAnswer('');
        } else {
            setShowResult(true);
        }
    };

    const resetLesson = () => {
        setCurrentQuestion(0);
        setUserAnswer('');
        setScore(0);
        setShowResult(false);
    };

    return (
        <Container maxWidth="md">
            <Helmet>
                <title>Lesson - Learn Czech from Russian</title>
            </Helmet>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {language === 'ru' ? 'Урок' : 'Lekce'}
                </Typography>
                <Paper elevation={3} sx={{ p: 3 }}>
                    {!showResult ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                {lessonData[currentQuestion].question}
                            </Typography>
                            <FormControl component="fieldset" sx={{ mt: 2 }}>
                                <FormLabel component="legend">
                                    {language === 'ru'
                                        ? 'Выберите правильный ответ'
                                        : 'Vyberte správnou odpověď'}
                                </FormLabel>
                                <RadioGroup
                                    aria-label="quiz"
                                    name="quiz"
                                    value={userAnswer}
                                    onChange={handleAnswer}
                                >
                                    {lessonData[currentQuestion].options.map(
                                        (option, index) => (
                                            <FormControlLabel
                                                key={index}
                                                value={option}
                                                control={<Radio />}
                                                label={option}
                                            />
                                        )
                                    )}
                                </RadioGroup>
                            </FormControl>
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={!userAnswer}
                                >
                                    {language === 'ru'
                                        ? 'Подтвердить'
                                        : 'Potvrdit'}
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" gutterBottom>
                                {language === 'ru' ? 'Результат' : 'Výsledek'}
                            </Typography>
                            <Typography>
                                {language === 'ru'
                                    ? `Вы ответили правильно на ${score} из ${lessonData.length} вопросов.`
                                    : `Správně jste odpověděli na ${score} z ${lessonData.length} otázek.`}
                            </Typography>
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={resetLesson}
                                >
                                    {language === 'ru'
                                        ? 'Начать заново'
                                        : 'Začít znovu'}
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
