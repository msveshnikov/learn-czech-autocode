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
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import TranslateIcon from '@mui/icons-material/Translate';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const Account = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        learningGoal: '',
        language: '',
        balance: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeStep] = useState(0);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        data: userData,
        isLoading,
        error
    } = useQuery('userAccount', apiService.getUserAccount);

    const updateUserMutation = useMutation(apiService.updateUser, {
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
            label: 'Цели обучения',
            tooltip: 'Установите свои цели изучения чешского языка'
        },
        {
            label: 'Настройки языка',
            tooltip: 'Выберите язык интерфейса'
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
                Детали аккаунта
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
                                label="Имя пользователя"
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
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Цель обучения"
                                name="learningGoal"
                                value={user.learningGoal}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth disabled={!isEditing}>
                                <InputLabel id="language-select-label">
                                    Язык интерфейса
                                </InputLabel>
                                <Select
                                    labelId="language-select-label"
                                    name="language"
                                    value={user.language}
                                    onChange={handleInputChange}
                                    label="Язык интерфейса"
                                >
                                    <MenuItem value="ru">Русский</MenuItem>
                                    <MenuItem value="cs">Чешский</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                Баланс: {user?.balance?.toFixed(2)} XP
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
                                        Сохранить изменения
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Отмена
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Редактировать профиль
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            <Paper elevation={3} sx={{ padding: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Быстрые ссылки
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/dashboard')}
                    sx={{ mr: 2 }}
                    startIcon={<WhatshotIcon />}
                >
                    Панель управления
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/lessons')}
                    sx={{ mr: 2 }}
                    startIcon={<TranslateIcon />}
                >
                    Уроки
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/achievements')}
                    startIcon={<EmojiEventsIcon />}
                >
                    Достижения
                </Button>
            </Paper>
        </Box>
    );
};

export default Account;
