import React, { useState, useEffect, useContext } from 'react';
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
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const { setIsAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const rememberedUser = localStorage.getItem('rememberMe');
        if (token && rememberedUser) {
            apiService.setToken(token);
            setIsAuthenticated(true);
            navigate('/dashboard');
        }
    }, [navigate, setIsAuthenticated]);

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
            setIsAuthenticated(true);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка входа. Пожалуйста, попробуйте снова.');
        }
    };

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
                <Typography component="h1" variant="h5" align="center" color="textPrimary">
                    Вход
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Электронная почта"
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
                        label="Пароль"
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
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                        }
                        label="Запомнить меня"
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
                        Войти
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Link
                            to="/register"
                            style={{
                                textDecoration: 'none',
                                color: theme.palette.primary.main
                            }}
                        >
                            <Typography variant="body2">Нет аккаунта? Зарегистрируйтесь</Typography>
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
