import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Grid,
    Divider,
    Box,
    LinearProgress,
    Snackbar,
    Alert
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LockIcon from '@mui/icons-material/Lock';
import apiService from '../services/apiService';
import { Helmet } from 'react-helmet';
import Loading from '../components/Loading';
import { useQuery } from 'react-query';

const Achievements = () => {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const {
        data: achievements,
        isLoading,
        error,
        refetch
    } = useQuery('achievements', apiService.fetchUserAchievements, {
        onError: (error) => {
            setSnackbar({
                open: true,
                message: 'Ошибка при загрузке достижений',
                severity: 'error'
            });
        }
    });

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 60000);

        return () => clearInterval(interval);
    }, [refetch]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    if (isLoading) return <Loading />;
    if (error) return <Typography color="error">{error.message}</Typography>;

    return (
        <>
            <Helmet>
                <title>Достижения - Изучение чешского языка</title>
                <meta
                    name="description"
                    content="Просмотрите свои достижения в изучении чешского языка."
                />
            </Helmet>
            <Container maxWidth="sm">
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Достижения
                    </Typography>
                    <Paper elevation={3}>
                        <List>
                            {achievements.map((achievement, index) => (
                                <React.Fragment key={achievement.id}>
                                    {index > 0 && <Divider variant="inset" component="li" />}
                                    <ListItem>
                                        <ListItemIcon>
                                            {achievement.unlocked ? (
                                                <EmojiEventsIcon color="primary" />
                                            ) : (
                                                <LockIcon color="disabled" />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={achievement.name}
                                            secondary={
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}>
                                                        {achievement.description}
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={
                                                                (achievement.progress /
                                                                    achievement.target) *
                                                                100
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        {achievement.unlocked
                                                            ? 'Разблокировано'
                                                            : `${achievement.progress}/${achievement.target}`}
                                                    </Grid>
                                                </Grid>
                                            }
                                        />
                                    </ListItem>
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Box>
            </Container>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Achievements;
