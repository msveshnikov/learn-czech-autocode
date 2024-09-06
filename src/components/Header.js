import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    Box
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Header = ({ toggleTheme }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const menuItems = [
        { label: 'Главная', path: '/dashboard' },
        { label: 'Уроки', path: '/lessons' },
        { label: 'Упражнения', path: '/exercises' },
        { label: 'Прогресс', path: '/progress' },
        { label: 'Достижения', path: '/achievements' },
        { label: 'Рейтинг', path: '/leaderboard' }
    ];

    return (
        <AppBar position="static">
            <Toolbar>
                {isMobile && (
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenu}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Чешский с нуля
                </Typography>
                {!isMobile && (
                    <Box sx={{ display: 'flex' }}>
                        {menuItems.map((item) => (
                            <Button
                                key={item.path}
                                color="inherit"
                                component={RouterLink}
                                to={item.path}
                                sx={{ mx: 1 }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                )}
                <IconButton
                    sx={{ ml: 1 }}
                    onClick={toggleTheme}
                    color="inherit"
                >
                    {theme.palette.mode === 'dark' ? (
                        <Brightness7Icon />
                    ) : (
                        <Brightness4Icon />
                    )}
                </IconButton>

                <Button color="inherit" component={RouterLink} to="/account">
                    Аккаунт
                </Button>
                <Button color="inherit" component={RouterLink} to="/login">
                    Войти
                </Button>
            </Toolbar>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.path}
                        component={RouterLink}
                        to={item.path}
                        onClick={handleClose}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </AppBar>
    );
};

Header.propTypes = {
    toggleTheme: PropTypes.func.isRequired
};

export default Header;
