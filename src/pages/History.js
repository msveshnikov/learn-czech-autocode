import React, { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Box,
    Grid,
    Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet';
import apiService from '../services/apiService';
import Loading from '../components/Loading';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../contexts/LanguageContext';

const History = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const theme = useTheme();
    const { language } = useLanguage();

    const fetchLessonHistory = async () => {
        const token = localStorage.getItem('token');
        return apiService.getLessonHistory(token, startDate, endDate);
    };

    const {
        data: lessons,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery(['lessonHistory', startDate, endDate], fetchLessonHistory, {
        enabled: false
    });

    useEffect(() => {
        refetch();
    }, []);

    const handleFilter = () => {
        refetch();
    };

    const sortedLessons = useMemo(() => {
        return lessons
            ? [...lessons].sort((a, b) => new Date(b.date) - new Date(a.date))
            : [];
    }, [lessons]);

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Alert severity="error">{error.message}</Alert>
            </Box>
        );
    }

    return (
        <>
            <Helmet>
                <title>
                    {language === 'ru' ? 'История уроков' : 'Lesson History'} -
                    Czech from Russian
                </title>
            </Helmet>
            <Container maxWidth="lg">
                <Typography sx={{ my: 4 }} variant="h4" component="h1">
                    {language === 'ru' ? 'История уроков' : 'Lesson History'}
                </Typography>
                <Box mb={3}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <DatePicker
                                label={
                                    language === 'ru'
                                        ? 'Дата начала'
                                        : 'Start Date'
                                }
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DatePicker
                                label={
                                    language === 'ru'
                                        ? 'Дата окончания'
                                        : 'End Date'
                                }
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                variant="contained"
                                onClick={handleFilter}
                                fullWidth
                            >
                                {language === 'ru' ? 'Фильтр' : 'Filter'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {language === 'ru' ? 'Дата' : 'Date'}
                                </TableCell>
                                <TableCell>
                                    {language === 'ru' ? 'Урок' : 'Lesson'}
                                </TableCell>
                                <TableCell>
                                    {language === 'ru' ? 'Тема' : 'Topic'}
                                </TableCell>
                                <TableCell>
                                    {language === 'ru' ? 'Оценка' : 'Score'}
                                </TableCell>
                                <TableCell>
                                    {language === 'ru'
                                        ? 'Время выполнения'
                                        : 'Completion Time'}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedLessons.map((lesson) => (
                                <TableRow key={lesson.id}>
                                    <TableCell>
                                        {format(
                                            new Date(lesson.date),
                                            'yyyy-MM-dd HH:mm:ss'
                                        )}
                                    </TableCell>
                                    <TableCell>{lesson.lessonName}</TableCell>
                                    <TableCell>{lesson.topic}</TableCell>
                                    <TableCell
                                        sx={{
                                            color:
                                                lesson.score >= 80
                                                    ? theme.palette.success.main
                                                    : lesson.score >= 60
                                                    ? theme.palette.warning.main
                                                    : theme.palette.error.main
                                        }}
                                    >
                                        {lesson.score}%
                                    </TableCell>
                                    <TableCell>
                                        {lesson.completionTime} min
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    );
};

export default History;
