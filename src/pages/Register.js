import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Paper,
    Alert,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import apiService from '../services/apiService';
import LanguageContext from '../contexts/LanguageContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [errors, setErrors] = useState({});
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const { language } = useContext(LanguageContext);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'acceptTerms' ? checked : value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await apiService.register(formData);
                setAlertMessage('Registration successful. Please log in.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (error) {
                setAlertMessage('Registration failed. Please try again.');
            }
        }
    };

    const getTranslation = (key) => {
        const translations = {
            en: {
                register: 'Register',
                username: 'Username',
                email: 'Email Address',
                password: 'Password',
                confirmPassword: 'Confirm Password',
                acceptTerms: 'I accept the terms and conditions',
                submit: 'Register',
                alreadyHaveAccount: 'Already have an account? Sign in'
            },
            ru: {
                register: 'Регистрация',
                username: 'Имя пользователя',
                email: 'Адрес электронной почты',
                password: 'Пароль',
                confirmPassword: 'Подтвердите пароль',
                acceptTerms: 'Я принимаю условия использования',
                submit: 'Зарегистрироваться',
                alreadyHaveAccount: 'Уже есть аккаунт? Войти'
            }
        };
        return translations[language][key] || translations['en'][key];
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper
                elevation={3}
                sx={{
                    mt: 8,
                    p: 4,
                    backgroundColor: theme.palette.background.paper
                }}
            >
                <Typography component="h1" variant="h5" align="center">
                    {getTranslation('register')}
                </Typography>
                {alertMessage && (
                    <Alert
                        severity="info"
                        onClose={() => setAlertMessage('')}
                        sx={{ mt: 2 }}
                    >
                        {alertMessage}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={getTranslation('username')}
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                error={!!errors.username}
                                helperText={errors.username}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={getTranslation('email')}
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={getTranslation('password')}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={getTranslation('confirmPassword')}
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleChange}
                                        color="primary"
                                    />
                                }
                                label={getTranslation('acceptTerms')}
                            />
                            {errors.acceptTerms && (
                                <Typography color="error" variant="caption">
                                    {errors.acceptTerms}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {getTranslation('submit')}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/login" variant="body2">
                                {getTranslation('alreadyHaveAccount')}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
