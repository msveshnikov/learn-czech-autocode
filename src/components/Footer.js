import React from 'react';
import { Box, Typography, Link, Container, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            О нас
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Изучайте чешский с русского с помощью нашей интерактивной платформы для
                            изучения языков.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Юридическая информация
                        </Typography>
                        <Link component={RouterLink} to="/terms" color="inherit" display="block">
                            Условия использования
                        </Link>
                        <Link component={RouterLink} to="/privacy" color="inherit" display="block">
                            Политика конфиденциальности
                        </Link>
                    </Grid>
                </Grid>
                <Box mt={3}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'© '}
                        {new Date().getFullYear()}{' '}
                        <Link color="inherit" href="https://autocode.work/">
                            MaxSoft
                        </Link>
                        {'. '}
                        Все права защищены.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
