import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    Stepper,
    Step,
    StepLabel,
    Tooltip} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Account = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        balance: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeStep] = useState(0);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { language } = useLanguage();

    const {
        data: userData,
        isLoading,
        error
    } = useQuery('userAccount', apiService.getUserAccount);

    const updateUserMutation = useMutation(apiService.updateUserAccount, {
        onSuccess: () => {
            queryClient.invalidateQueries('userAccount');
            setIsEditing(false);
            setSuccessMessage('Аккаунт успешно обновлен');
        }
    });

    useEffect(() => {
        if (userData) {
            setUser(userData);
        }
    }, [userData]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        updateUserMutation.mutate(user);
    };

    const onboardingSteps = [
        {
            label: 'Детали аккаунта',
            tooltip: 'Просмотр и обновление информации об аккаунте'
        },
        {
            label: 'Подтвердить email',
            tooltip: 'Подтвердите ваш email адрес'
        },
        {
            label: 'Настройки',
            tooltip: 'Настройте ваш опыт обучения'
        }
    ];

    if (isLoading) {
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
        <Box sx={{ my: 4, flexGrow: 1, padding: 3 }}>
            <Helmet>
                <title>Аккаунт - Изучение чешского языка</title>
                <meta
                    name="description"
                    content="Управление аккаунтом для изучения чешского языка"
                />
            </Helmet>
            <Typography variant="h4" gutterBottom>
                {language === 'ru' ? 'Детали аккаунта' : 'Account Details'}
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error.message}
                </Alert>
            )}
            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}
            <Paper elevation={3} sx={{ padding: 3, mb: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {onboardingSteps.map((step, index) => (
                        <Step key={step.label}>
                            <Tooltip title={step.tooltip}>
                                <StepLabel>{step.label}</StepLabel>
                            </Tooltip>
                        </Step>
                    ))}
                </Stepper>
            </Paper>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={
                                    language === 'ru'
                                        ? 'Имя пользователя'
                                        : 'Username'
                                }
                                name="username"
                                value={user.username}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={user.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                {language === 'ru' ? 'Баланс: ' : 'Balance: '}
                                {user?.balance?.toFixed(2)} XP
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {isEditing ? (
                                <>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        sx={{ marginRight: 2 }}
                                        disabled={updateUserMutation.isLoading}
                                    >
                                        {language === 'ru'
                                            ? 'Сохранить изменения'
                                            : 'Save Changes'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        {language === 'ru'
                                            ? 'Отмена'
                                            : 'Cancel'}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={() => setIsEditing(true)}
                                >
                                    {language === 'ru'
                                        ? 'Редактировать профиль'
                                        : 'Edit Profile'}
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            <Paper elevation={3} sx={{ padding: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    {language === 'ru' ? 'Быстрые ссылки' : 'Quick Links'}
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/dashboard')}
                    sx={{ mr: 2 }}
                >
                    {language === 'ru'
                        ? 'Перейти к панели управления'
                        : 'Go to Dashboard'}
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/lessons')}
                >
                    {language === 'ru' ? 'Просмотреть уроки' : 'View Lessons'}
                </Button>
            </Paper>
        </Box>
    );
};

export default Account;
