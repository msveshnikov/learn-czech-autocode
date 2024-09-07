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
    Box
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LockIcon from '@mui/icons-material/Lock';
import apiService from './../services/apiService';
import { Helmet } from 'react-helmet';
import Loading from '../components/Loading';
import { useQuery } from 'react-query';

const Achievements = () => {
    const {
        data: achievements,
        isLoading,
        error
    } = useQuery('achievements', apiService.fetchUserAchievements);

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
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        align="center"
                    >
                        Достижения
                    </Typography>
                    <Paper elevation={3}>
                        <List>
                            {achievements.map((achievement, index) => (
                                <React.Fragment key={achievement.id}>
                                    {index > 0 && (
                                        <Divider
                                            variant="inset"
                                            component="li"
                                        />
                                    )}
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
                                                <Grid
                                                    container
                                                    justifyContent="space-between"
                                                >
                                                    <Grid item>
                                                        {
                                                            achievement.description
                                                        }
                                                    </Grid>
                                                    <Grid item>
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
        </>
    );
};

export default Achievements;
