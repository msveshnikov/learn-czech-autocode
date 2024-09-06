// src/utils/theme.js

import { createTheme } from '@mui/material/styles';

const lightPalette = {
    mode: 'light',
    primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0'
    },
    secondary: {
        main: '#dc004e',
        light: '#ff4081',
        dark: '#c51162'
    },
    background: {
        default: '#f5f5f5',
        paper: '#ffffff'
    },
    text: {
        primary: '#212121',
        secondary: '#757575'
    }
};

const darkPalette = {
    mode: 'dark',
    primary: {
        main: '#90caf9',
        light: '#e3f2fd',
        dark: '#42a5f5'
    },
    secondary: {
        main: '#f48fb1',
        light: '#fce4ec',
        dark: '#f06292'
    },
    background: {
        default: '#121212',
        paper: '#1e1e1e'
    },
    text: {
        primary: '#ffffff',
        secondary: '#b0bec5'
    }
};

const createCustomTheme = (mode) => {
    const palette = mode === 'dark' ? darkPalette : lightPalette;

    return createTheme({
        palette,
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontSize: '2.5rem',
                fontWeight: 500
            },
            h2: {
                fontSize: '2rem',
                fontWeight: 500
            },
            h3: {
                fontSize: '1.75rem',
                fontWeight: 500
            },
            h4: {
                fontSize: '1.5rem',
                fontWeight: 500
            },
            h5: {
                fontSize: '1.25rem',
                fontWeight: 500
            },
            h6: {
                fontSize: '1rem',
                fontWeight: 500
            }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none'
                    }
                }
            },
            MuiTextField: {
                defaultProps: {
                    variant: 'outlined'
                }
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px'
                    }
                }
            },
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        scrollbarColor: '#6b6b6b #2b2b2b',
                        '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                            backgroundColor: palette.background.default
                        },
                        '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb':
                            {
                                borderRadius: 8,
                                backgroundColor: palette.primary.main,
                                minHeight: 24,
                                border: `3px solid ${palette.background.default}`
                            },
                        '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
                            {
                                backgroundColor: palette.primary.dark
                            },
                        '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
                            {
                                backgroundColor: palette.primary.dark
                            },
                        '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
                            {
                                backgroundColor: palette.primary.light
                            },
                        '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner':
                            {
                                backgroundColor: palette.background.default
                            }
                    }
                }
            }
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 960,
                lg: 1280,
                xl: 1920
            }
        }
    });
};

export default createCustomTheme;
