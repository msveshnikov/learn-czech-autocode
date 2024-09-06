import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    Card,
    CardContent,
    Grid,
    Container
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import apiService from '../services/apiService';

const Progress = () => {
    const [progress, setProgress] = useState({
        overallProgress: 0,
        lessonProgress: [],
        streakDays: 0,
        totalXP: 0
    });
    const theme = useTheme();

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const data = await apiService.fetchUserProgress();
                setProgress(data);
            } catch (error) {
                console.error('Error fetching progress:', error);
            }
        };
        loadProgress();
    }, []);

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Ваш прогресс
                </Typography>
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Общий прогресс
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={progress.overallProgress}
                            sx={{ height: 10, borderRadius: 5 }}
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {progress.overallProgress}% завершено
                        </Typography>
                    </CardContent>
                </Card>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Дней подряд
                                </Typography>
                                <Typography variant="h3" color="primary">
                                    {progress.streakDays}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Всего XP
                                </Typography>
                                <Typography variant="h3" color="secondary">
                                    {progress.totalXP}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Прогресс по урокам
                    </Typography>
                    {progress.lessonProgress.map((lesson, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                {lesson.name}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={lesson.progress}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: theme.palette.grey[300]
                                }}
                            />
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {lesson.progress}% завершено
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Container>
    );
};

export default Progress;
