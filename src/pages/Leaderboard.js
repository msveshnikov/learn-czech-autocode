import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Paper,
    CircularProgress
} from '@mui/material';
import apiService from '../services/apiService';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLeaderboardData = async () => {
            try {
                const data = await apiService.fetchLeaderboard();
                setLeaderboardData(data);
                setLoading(false);
            } catch (error) {
                console.error(
                    'Ошибка при получении данных таблицы лидеров:',
                    error
                );
                setLoading(false);
            }
        };

        getLeaderboardData();
    }, []);

    const translations = {
        title: 'Таблица лидеров',
        rank: 'Ранг',
        name: 'Имя',
        score: 'Очки'
    };

    if (loading) {
        return (
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}
            >
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                {translations.title}
            </Typography>
            <Paper elevation={3}>
                <List>
                    {leaderboardData.map((user, index) => (
                        <ListItem
                            key={user.id}
                            divider={index !== leaderboardData.length - 1}
                        >
                            <ListItemAvatar>
                                <Avatar>{index + 1}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={user.name} />
                            <Typography variant="body2">
                                {user.score}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default Leaderboard;
