import React from 'react';
import { Box, Typography, Link, Container, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
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
                            About Us
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            FX Trading Platform provides a seamless foreign
                            exchange trading experience with real-time quotes
                            and advanced tools.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography
                            variant="h6"
                            color="text.primary"
                            gutterBottom
                        >
                            Quick Links
                        </Typography>
                        <Link
                            component={RouterLink}
                            to="/dashboard"
                            color="inherit"
                        >
                            Dashboard
                        </Link>
                        <br />
                        <Link
                            component={RouterLink}
                            to="/trading"
                            color="inherit"
                        >
                            Trading
                        </Link>
                        <br />
                        <Link
                            component={RouterLink}
                            to="/positions"
                            color="inherit"
                        >
                            Positions
                        </Link>
                        <br />
                        <Link
                            component={RouterLink}
                            to="/history"
                            color="inherit"
                        >
                            History
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography
                            variant="h6"
                            color="text.primary"
                            gutterBottom
                        >
                            Legal
                        </Typography>
                        <Link
                            component={RouterLink}
                            to="/terms"
                            color="inherit"
                        >
                            Terms of Service
                        </Link>
                        <br />
                        <Link
                            component={RouterLink}
                            to="/privacy"
                            color="inherit"
                        >
                            Privacy Policy
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
                            FX Trading Platform
                        </Link>
                        {'. All rights reserved.'}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
