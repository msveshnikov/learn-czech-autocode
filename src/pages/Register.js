import React, { useState } from 'react';
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

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [errors, setErrors] = useState({});
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'acceptTerms' ? checked : value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Неверный формат email';
        }
        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Вы должны принять условия использования';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await apiService.register(formData);
                setAlertMessage(
                    'Регистрация успешна. Пожалуйста, войдите в систему.'
                );
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (error) {
                setAlertMessage(
                    'Ошибка регистрации. Пожалуйста, попробуйте снова.'
                );
            }
        }
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
                    Регистрация
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
                                label="Адрес электронной почты"
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
                                label="Пароль"
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
                                label="Подтвердите пароль"
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
                                label="Я принимаю условия использования"
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
                        Зарегистрироваться
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/login" variant="body2">
                                Уже есть аккаунт? Войти
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
