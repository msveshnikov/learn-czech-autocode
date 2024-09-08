import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const Lessons = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getLessons = async () => {
            try {
                const fetchedLessons = await apiService.fetchLessons();
                setLessons(fetchedLessons);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching lessons:', error);
                setLoading(false);
            }
        };

        getLessons();
    }, []);

    const handleLessonClick = (lessonId) => {
        navigate(`/lesson/${lessonId}`);
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
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Уроки
            </Typography>
            <Grid container spacing={3}>
                {lessons.map((lesson) => (
                    <Grid item xs={12} sm={6} md={4} key={lesson._id}>
                        <Card>
                            <CardActionArea onClick={() => handleLessonClick(lesson._id)}>
                                <CardContent>
                                    <Typography variant="h6" component="h2">
                                        {lesson.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {lesson.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Lessons;
