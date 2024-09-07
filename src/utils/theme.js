// src/utils/theme.js

import { createTheme } from '@mui/material/styles';

const duolingoPalette = {
    primary: {
        main: '#58CC02',
        light: '#89E219',
        dark: '#45A302'
    },
    secondary: {
        main: '#FF4B4B',
        light: '#FF7676',
        dark: '#D33131'
    },
    background: {
        default: '#FFFFFF',
        paper: '#F7F7F7'
    },
    text: {
        primary: '#3C3C3C',
        secondary: '#777777'
    }
};

const darkPalette = {
    primary: {
        main: '#58CC02',
        light: '#89E219',
        dark: '#45A302'
    },
    secondary: {
        main: '#FF4B4B',
        light: '#FF7676',
        dark: '#D33131'
    },
    background: {
        default: '#121212',
        paper: '#1E1E1E'
    },
    text: {
        primary: '#FFFFFF',
        secondary: '#B0BEC5'
    }
};

const createCustomTheme = (mode) => {
    const palette = mode === 'dark' ? darkPalette : duolingoPalette;

    return createTheme({
        palette: {
            mode,
            ...palette
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontSize: '2.5rem',
                fontWeight: 700
            },
            h2: {
                fontSize: '2rem',
                fontWeight: 700
            },
            h3: {
                fontSize: '1.75rem',
                fontWeight: 600
            },
            h4: {
                fontSize: '1.5rem',
                fontWeight: 600
            },
            h5: {
                fontSize: '1.25rem',
                fontWeight: 500
            },
            h6: {
                fontSize: '1rem',
                fontWeight: 500
            },
            button: {
                textTransform: 'none',
                fontWeight: 600
            }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '8px',
                        padding: '10px 16px'
                    },
                    containedPrimary: {
                        '&:hover': {
                            backgroundColor: palette.primary.dark
                        }
                    },
                    containedSecondary: {
                        '&:hover': {
                            backgroundColor: palette.secondary.dark
                        }
                    }
                }
            },
            MuiTextField: {
                defaultProps: {
                    variant: 'outlined'
                },
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px'
                        }
                    }
                }
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px'
                    }
                }
            },
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        scrollbarColor: `${palette.primary.main} ${palette.background.default}`,
                        '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                            backgroundColor: palette.background.default,
                            width: '8px'
                        },
                        '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb':
                            {
                                borderRadius: '8px',
                                backgroundColor: palette.primary.main,
                                minHeight: '24px'
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
