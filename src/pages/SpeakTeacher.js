import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Box,
    CircularProgress
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import apiService from '../services/apiService';

const SpeakTeacher = () => {
    const [input, setInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            setConversation([
                {
                    role: 'teacher',
                    content: 'Dobrý den! Jsem váš učitel češtiny. Jak vám mohu pomoci?'
                }
            ]);
        }
    }, [isAuthenticated]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsLoading(true);
        setConversation((prev) => [...prev, { role: 'user', content: input }]);
        setInput('');

        try {
            const response = await apiService.speakToTeacher(input);
            setConversation((prev) => [...prev, { role: 'teacher', content: response }]);
        } catch (error) {
            console.error('Error getting response from Claude:', error);
            setConversation((prev) => [
                ...prev,
                { role: 'teacher', content: 'Omlouvám se, došlo k chybě. Zkuste to prosím znovu.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <Container>
                <Typography variant="h4" gutterBottom>
                    Пожалуйста, войдите в систему, чтобы использовать эту функцию.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Говорите с учителем
            </Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 2, maxHeight: '60vh', overflowY: 'auto' }}>
                {conversation.map((message, index) => (
                    <Box
                        key={index}
                        sx={{
                            mb: 2,
                            textAlign: message.role === 'user' ? 'right' : 'left'
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                display: 'inline-block',
                                p: 1,
                                borderRadius: 1,
                                bgcolor:
                                    message.role === 'user' ? 'primary.light' : 'secondary.light'
                            }}
                        >
                            {message.content}
                        </Typography>
                    </Box>
                ))}
            </Paper>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Введите ваше сообщение..."
                    disabled={isLoading}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Отправить'}
                </Button>
            </form>
        </Container>
    );
};

export default SpeakTeacher;
