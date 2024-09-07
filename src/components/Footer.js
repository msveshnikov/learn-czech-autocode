import React from 'react';
import { Box, Typography, Link, Container, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    const translations = {
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
    };

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
                            {translations.about}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {translations.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography
                            variant="h6"
                            color="text.primary"
                            gutterBottom
                        >
                            {translations.quickLinks}
                        </Typography>
                        <Link
                            component={RouterLink}
                            to="/dashboard"
                            color="inherit"
                        >
                            {translations.dashboard}
                        </Link>
                        <br />
                        <Link
                            component={RouterLink}
                            to="/lessons"
                            color="inherit"
                        >
                            {translations.lessons}
                        </Link>
                        <br />
                        <Link
                            component={RouterLink}
                            to="/progress"
                            color="inherit"
                        >
                            {translations.progress}
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography
                            variant="h6"
                            color="text.primary"
                            gutterBottom
                        >
                            {translations.legal}
                        </Typography>
                        <Link
                            component={RouterLink}
                            to="/terms"
                            color="inherit"
                        >
                            {translations.terms}
                        </Link>
                        <br />
                        <Link
                            component={RouterLink}
                            to="/privacy"
                            color="inherit"
                        >
                            {translations.privacy}
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
                            MaxSoft
                        </Link>
                        {'. '}
                        {translations.rights}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
