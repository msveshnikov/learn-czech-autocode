import React, { useState, useContext, useEffect } from 'react';
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
    Box,
    Avatar,
    Badge
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import apiService from '../services/apiService';
import { AuthContext } from '../context/AuthContext';

const Header = ({ toggleTheme }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated, user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
        }
    }, [isAuthenticated]);

    const fetchNotifications = async () => {
        try {
            const fetchedNotifications = await apiService.getNotifications();
            setNotifications(fetchedNotifications);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationMenu = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleNotificationClick = async (notificationId) => {
        try {
            await apiService.markNotificationAsRead(notificationId);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
        handleNotificationClose();
    };

    const handleLogout = async () => {
        try {
            await apiService.logout();
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('rememberMe');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
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
                {!isMobile && isAuthenticated && (
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
                <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                {isAuthenticated && (
                    <>
                        <IconButton color="inherit" onClick={handleNotificationMenu}>
                            <Badge badgeContent={notifications.length} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Menu
                            anchorEl={notificationAnchorEl}
                            open={Boolean(notificationAnchorEl)}
                            onClose={handleNotificationClose}
                        >
                            {notifications.map((notification) => (
                                <MenuItem
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification._id)}
                                >
                                    {notification.message}
                                </MenuItem>
                            ))}
                        </Menu>
                        <IconButton
                            color="inherit"
                            component={RouterLink}
                            to="/speak-teacher"
                            sx={{ ml: 1 }}
                        >
                            <ChatIcon />
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar alt={user?.name} src={user?.avatar} />
                        </IconButton>
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
                            <MenuItem component={RouterLink} to="/account" onClick={handleClose}>
                                Аккаунт
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                        </Menu>
                    </>
                )}
                {!isAuthenticated && (
                    <>
                        <Button color="inherit" component={RouterLink} to="/login">
                            Войти
                        </Button>
                        <Button color="inherit" component={RouterLink} to="/register">
                            Регистрация
                        </Button>
                    </>
                )}
            </Toolbar>
            {isMobile && isAuthenticated && (
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
            )}
        </AppBar>
    );
};

Header.propTypes = {
    toggleTheme: PropTypes.func.isRequired
};

export default Header;
