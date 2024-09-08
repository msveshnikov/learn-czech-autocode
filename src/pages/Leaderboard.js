import React from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Paper,
    Box
} from '@mui/material';
import apiService from '../services/apiService';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import Loading from '../components/Loading';

const Leaderboard = () => {
    const {
        data: leaderboardData,
        isLoading,
        error
    } = useQuery('leaderboard', apiService.fetchLeaderboard);

    const translations = {
        title: 'Таблица лидеров',
        rank: 'Ранг',
        name: 'Имя',
        score: 'Очки'
    };

    if (isLoading) return <Loading />;
    if (error)
        return (
            <Typography color="error">
                Ошибка при загрузке таблицы лидеров: {error.message}
            </Typography>
        );

    return (
        <>
            <Helmet>
                <title>Таблица лидеров - Изучение чешского языка</title>
                <meta
                    name="description"
                    content="Просмотрите таблицу лидеров и соревнуйтесь с другими учениками чешского языка."
                />
            </Helmet>
            <Container maxWidth="sm">
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        {translations.title}
                    </Typography>
                    <Paper elevation={3}>
                        <List>
                            {leaderboardData.map((user, index) => (
                                <ListItem
                                    key={user._id}
                                    divider={index !== leaderboardData.length - 1}
                                >
                                    <ListItemAvatar>
                                        <Avatar>{index + 1}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        secondary={
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '200px',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {user.email}
                                            </Typography>
                                        }
                                    />
                                    <Typography variant="body2">{user.leaderboardScore}</Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Box>
            </Container>
        </>
    );
};

export default Leaderboard;
