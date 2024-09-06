import React from 'react';
import { Box, Typography, Link, Container, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
    const { language } = useLanguage();

    const translations = {
        en: {
            about: 'About Us',
            description:
                'Learn Czech from Russian with our interactive language learning platform.',
            quickLinks: 'Quick Links',
            dashboard: 'Dashboard',
            lessons: 'Lessons',
            practice: 'Practice',
            progress: 'Progress',
            legal: 'Legal',
            terms: 'Terms of Service',
            privacy: 'Privacy Policy',
            rights: 'All rights reserved.'
        },
        ru: {
            about: 'О нас',
            description:
                'Изучайте чешский с русского с помощью нашей интерактивной платформы для изучения языков.',
            quickLinks: 'Быстрые ссылки',
            dashboard: 'Панель управления',
            lessons: 'Уроки',
            practice: 'Практика',
            progress: 'Прогресс',
            legal: 'Юридическая информация',
            terms: 'Условия использования',
            privacy: 'Политика конфиденциальности',
            rights: 'Все права защищены.'
        }
    };

    const t = translations[language];

    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800]
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Typography
                            variant="h6"
                            color="text.primary"
                            gutterBottom
                        >
                            {t.about}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography
                            variant="h6"
                            color="text.primary"
                            gutterBottom
                        >
                            {t.quickLinks}
                        </Typography>
                        <Link
                            component={RouterLink}
                            to="/dashboard"
                            color="inherit"
                        >
                            {t.dashboard}
                        </Link>
                        <br />
                        <Link
                            component={RouterLink}
                            to="/lessons"
                            color="inherit"
                        >
                            {t.lessons}
                        </Link>
                        <br />
                        <Link
                            component={RouterLink}
                            to="/practice"
                            color="inherit"
                        >
                            {t.practice}
                        </Link>
                        <br />
                        <Link
                            component={RouterLink}
                            to="/progress"
                            color="inherit"
                        >
                            {t.progress}
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography
                            variant="h6"
                            color="text.primary"
                            gutterBottom
                        >
                            {t.legal}
                        </Typography>
                        <Link
                            component={RouterLink}
                            to="/terms"
                            color="inherit"
                        >
                            {t.terms}
                        </Link>
                        <br />
                        <Link
                            component={RouterLink}
                            to="/privacy"
                            color="inherit"
                        >
                            {t.privacy}
                        </Link>
                    </Grid>
                </Grid>
                <Box mt={3}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                    >
                        {'© '}
                        {new Date().getFullYear()}{' '}
                        <Link color="inherit" href="https://autocode.work/">
                            Czech from Russian
                        </Link>
                        {'. '}
                        {t.rights}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
