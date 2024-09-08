import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Helmet } from 'react-helmet';
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';
import createCustomTheme from './utils/theme';
import PrivateRoute from './components/PrivateRoute';
import Onboarding from './components/Onboarding';
import { AuthProvider } from './context/AuthContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Lesson = lazy(() => import('./pages/Lesson'));
const Account = lazy(() => import('./pages/Account'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Lessons = lazy(() => import('./pages/Lessons'));
const Exercises = lazy(() => import('./pages/Exercises'));
const Progress = lazy(() => import('./pages/Progress'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Exercise = lazy(() => import('./pages/Exercise'));

const queryClient = new QueryClient();

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) {
            setDarkMode(JSON.parse(savedMode));
        }

        const onboardingCompleted = localStorage.getItem('onboardingCompleted');
        setShowOnboarding(!onboardingCompleted);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    const theme = createCustomTheme(darkMode ? 'dark' : 'light');

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
        localStorage.setItem('onboardingCompleted', 'true');
    };

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Router>
                        <div className="App">
                            <Helmet>
                                <title>Учим чешский с русского</title>
                                <meta
                                    name="description"
                                    content="Изучайте чешский язык с русского с нашим интерактивным приложением"
                                />
                            </Helmet>
                            <Header toggleTheme={toggleDarkMode} />
                            {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

                            <Suspense fallback={<Loading />}>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={<Navigate to="/dashboard" replace />}
                                    />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route
                                        path="/dashboard"
                                        element={
                                            <PrivateRoute>
                                                <Dashboard />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/account"
                                        element={
                                            <PrivateRoute>
                                                <Account />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route path="/privacy" element={<Privacy />} />
                                    <Route path="/terms" element={<Terms />} />
                                    <Route
                                        path="/lessons"
                                        element={
                                            <PrivateRoute>
                                                <Lessons />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/lesson/:lessonId"
                                        element={
                                            <PrivateRoute>
                                                <Lesson />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/exercises"
                                        element={
                                            <PrivateRoute>
                                                <Exercises />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/exercise/:exerciseId"
                                        element={
                                            <PrivateRoute>
                                                <Exercise />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/progress"
                                        element={
                                            <PrivateRoute>
                                                <Progress />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/achievements"
                                        element={
                                            <PrivateRoute>
                                                <Achievements />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/leaderboard"
                                        element={
                                            <PrivateRoute>
                                                <Leaderboard />
                                            </PrivateRoute>
                                        }
                                    />
                                </Routes>
                            </Suspense>
                            <Footer />
                        </div>
                    </Router>
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
