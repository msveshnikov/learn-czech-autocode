/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Tooltip,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Select,
    MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import apiService from '../services/apiService';

const steps = [
    'Добро пожаловать',
    'Настройка аккаунта',
    'Обзор платформы',
    'Основы чешского языка',
    'Цели обучения'
];

const tooltips = {
    'Добро пожаловать': 'Добро пожаловать в наше приложение для изучения чешского языка!',
    'Настройка аккаунта': 'Настройте свой профиль и предпочтения обучения.',
    'Обзор платформы': 'Ознакомьтесь с основными функциями нашей платформы.',
    'Основы чешского языка': 'Узнайте базовые концепции чешского языка.',
    'Цели обучения': 'Установите свои цели обучения и выберите темп.'
};

const OnboardingTooltip = ({ children, title }) => (
    <Tooltip title={title} arrow placement="top">
        <Box>{children}</Box>
    </Tooltip>
);

const Onboarding = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [username, setUsername] = useState('');
    const [learningGoal, setLearningGoal] = useState('');
    const [learningPace, setLearningPace] = useState('');
    const [showOnboarding, setShowOnboarding] = useState(true);
    const navigate = useNavigate();
    const { user, updateUser } = useContext(AuthContext);

    useEffect(() => {
        if (user && user.onboardingCompleted) {
            setShowOnboarding(false);
        }
    }, [user, navigate]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleFinish = async () => {
        try {
            const updatedUser = await apiService.updateUser({
                username,
                learningGoal,
                learningPace,
                onboardingCompleted: true
            });
            updateUser(updatedUser);
            setShowOnboarding(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Typography>
                        Добро пожаловать в приложение для изучения чешского языка с русского!
                    </Typography>
                );
            case 1:
                return (
                    <TextField
                        fullWidth
                        label="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        margin="normal"
                    />
                );
            case 2:
                return (
                    <Typography>
                        Чешский язык - западнославянский язык. Вы обнаружите много схожестей с
                        русским!
                    </Typography>
                );
            case 3:
                return (
                    <>
                        <FormControl component="fieldset" fullWidth margin="normal">
                            <FormLabel component="legend">Выберите цель обучения:</FormLabel>
                            <RadioGroup
                                value={learningGoal}
                                onChange={(e) => setLearningGoal(e.target.value)}
                            >
                                <FormControlLabel
                                    value="basic"
                                    control={<Radio />}
                                    label="Базовое общение"
                                />
                                <FormControlLabel
                                    value="intermediate"
                                    control={<Radio />}
                                    label="Средний уровень"
                                />
                                <FormControlLabel
                                    value="advanced"
                                    control={<Radio />}
                                    label="Продвинутый уровень"
                                />
                            </RadioGroup>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <FormLabel component="legend">Выберите темп обучения:</FormLabel>
                            <Select
                                value={learningPace}
                                onChange={(e) => setLearningPace(e.target.value)}
                            >
                                <MenuItem value="relaxed">Расслабленный</MenuItem>
                                <MenuItem value="regular">Регулярный</MenuItem>
                                <MenuItem value="intense">Интенсивный</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                );
            default:
                return null;
        }
    };

    if (!showOnboarding) {
        return null;
    }

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <OnboardingTooltip title={tooltips[label]}>
                            <StepLabel>{label}</StepLabel>
                        </OnboardingTooltip>
                    </Step>
                ))}
            </Stepper>
            <Box sx={{ mt: 2, mb: 1 }}>{renderStepContent(activeStep)}</Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                >
                    Назад
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {activeStep === steps.length - 1 ? (
                    <Button onClick={handleFinish}>Завершить</Button>
                ) : (
                    <Button onClick={handleNext}>Далее</Button>
                )}
            </Box>
        </Box>
    );
};

export default Onboarding;
