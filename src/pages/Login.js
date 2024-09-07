import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Box,
    Container,
    Paper,
    Alert,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import apiService from '../services/apiService';
import LanguageContext from '../contexts/LanguageContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const rememberedUser = localStorage.getItem('rememberMe');
        if (token && rememberedUser) {
            apiService.setToken(token);
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await apiService.login({ email, password });
            apiService.setToken(response.token);
            localStorage.setItem('token', response.token);
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || t.loginFailed);
        }
    };

    const translations = {
        ru: {
            title: 'Вход',
            email: 'Электронная почта',
            password: 'Пароль',
            rememberMe: 'Запомнить меня',
            login: 'Войти',
            noAccount: 'Нет аккаунта? Зарегистрируйтесь',
            loginFailed: 'Ошибка входа. Пожалуйста, попробуйте снова.'
        },
        en: {
            title: 'Log in',
            email: 'Email Address',
            password: 'Password',
            rememberMe: 'Remember me',
            login: 'Sign In',
            noAccount: "Don't have an account? Sign Up",
            loginFailed: 'Login failed. Please try again.'
        }
    };

    const t = translations[language] || translations.en;

    return (
        <Container component="main" maxWidth="xs">
            <Paper
                elevation={3}
                sx={{
                    marginTop: 8,
                    padding: 4,
                    backgroundColor: theme.palette.background.paper
                }}
            >
                <Typography
                    component="h1"
                    variant="h5"
                    align="center"
                    color="textPrimary"
                >
                    {t.title}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label={t.email}
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        color="primary"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label={t.password}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        color="primary"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                value="remember"
                                color="primary"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(e.target.checked)
                                }
                            />
                        }
                        label={t.rememberMe}
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color="primary"
                    >
                        {t.login}
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Link
                            to="/register"
                            style={{
                                textDecoration: 'none',
                                color: theme.palette.primary.main
                            }}
                        >
                            <Typography variant="body2">
                                {t.noAccount}
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
