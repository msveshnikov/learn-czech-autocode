import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Box,
    CircularProgress,
    Avatar,
    Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';
import apiService from '../services/apiService';

const MessageContainer = styled(Box)(({ theme, isUser }) => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    marginBottom: theme.spacing(2)
}));

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
    padding: theme.spacing(1, 2),
    maxWidth: '70%',
    borderRadius: isUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
    backgroundColor: isUser ? theme.palette.primary.light : theme.palette.secondary.light
}));

const SpeakTeacher = () => {
    const [input, setInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, user } = useContext(AuthContext);

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
            <Typography sx={{ mt: 3 }} variant="h4" gutterBottom>
                Говорите с учителем
            </Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 2, height: '60vh', overflowY: 'auto' }}>
                {conversation.map((message, index) => (
                    <MessageContainer key={index} isUser={message.role === 'user'}>
                        {message.role === 'teacher' && <Avatar sx={{ mr: 1 }}>T</Avatar>}
                        <MessageBubble isUser={message.role === 'user'}>
                            <Typography variant="body1">{message.content}</Typography>
                        </MessageBubble>
                        {message.role === 'user' && (
                            <Avatar sx={{ ml: 1 }}>{user?.name?.charAt(0) || 'U'}</Avatar>
                        )}
                    </MessageContainer>
                ))}
            </Paper>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={9}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Введите ваше сообщение..."
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={isLoading}
                            sx={{ height: '100%' }}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Отправить'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default SpeakTeacher;
