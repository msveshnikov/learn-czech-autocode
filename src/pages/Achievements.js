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
    Divider
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import apiService from './../services/apiService';

const Achievements = () => {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        const loadAchievements = async () => {
            try {
                const data = await apiService.fetchUserAchievements();
                setAchievements(data);
            } catch (error) {
                console.error('Failed to load achievements:', error);
            }
        };
        loadAchievements();
    }, []);

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom align="center">
                {'Achievements'}
            </Typography>
            <Paper elevation={3}>
                <List>
                    {achievements.map((achievement, index) => (
                        <React.Fragment key={achievement.id}>
                            {index > 0 && (
                                <Divider variant="inset" component="li" />
                            )}
                            <ListItem>
                                <ListItemIcon>
                                    <EmojiEventsIcon
                                        color={
                                            achievement.unlocked
                                                ? 'primary'
                                                : 'disabled'
                                        }
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={achievement.name}
                                    secondary={
                                        <Grid
                                            container
                                            justifyContent="space-between"
                                        >
                                            <Grid item>
                                                {achievement.description}
                                            </Grid>
                                            <Grid item>
                                                {achievement.unlocked
                                                    ? 'Unlocked'
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
        </Container>
    );
};

export default Achievements;
