import React from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useLanguage } from '../contexts/LanguageContext';

const Terms = () => {
    const { language } = useLanguage();

    const termsContent = {
        en: {
            title: 'Terms of Service',
            introduction:
                'Welcome to our Czech language learning platform. By using our services, you agree to be bound by the following terms and conditions.',
            sections: [
                {
                    title: '1. Acceptance of Terms',
                    content:
                        'By accessing or using our platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.'
                },
                {
                    title: '2. Use of Services',
                    content:
                        'Our platform is designed for Russian speakers learning Czech. You are responsible for maintaining the confidentiality of your account and password.'
                },
                {
                    title: '3. Content and Intellectual Property',
                    content:
                        'All content provided on this platform is for educational purposes only. The intellectual property rights of all materials belong to their respective owners.'
                },
                {
                    title: '4. User Conduct',
                    content:
                        'You agree not to use the platform for any unlawful purpose or in any way that could damage, disable, or impair the platform.'
                },
                {
                    title: '5. Privacy',
                    content:
                        'Your use of the platform is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.'
                },
                {
                    title: '6. Modifications to Terms',
                    content:
                        'We reserve the right to modify these terms at any time. Your continued use of the platform after any such changes constitutes your acceptance of the new terms.'
                },
                {
                    title: '7. Termination',
                    content:
                        'We reserve the right to terminate or suspend your account and access to the platform at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users of the platform, us, or third parties, or for any other reason.'
                }
            ]
        },
        ru: {
            title: 'Условия использования',
            introduction:
                'Добро пожаловать на нашу платформу для изучения чешского языка. Используя наши услуги, вы соглашаетесь соблюдать следующие условия.',
            sections: [
                {
                    title: '1. Принятие условий',
                    content:
                        'Используя нашу платформу, вы соглашаетесь соблюдать настоящие Условия использования. Если вы не согласны с этими условиями, пожалуйста, не используйте нашу платформу.'
                },
                {
                    title: '2. Использование услуг',
                    content:
                        'Наша платформа предназначена для русскоговорящих, изучающих чешский язык. Вы несете ответственность за сохранение конфиденциальности вашей учетной записи и пароля.'
                },
                {
                    title: '3. Контент и интеллектуальная собственность',
                    content:
                        'Весь контент, предоставленный на этой платформе, предназначен только для образовательных целей. Права интеллектуальной собственности на все материалы принадлежат их соответствующим владельцам.'
                },
                {
                    title: '4. Поведение пользователя',
                    content:
                        'Вы соглашаетесь не использовать платформу в незаконных целях или любым способом, который может повредить, отключить или ухудшить работу платформы.'
                },
                {
                    title: '5. Конфиденциальность',
                    content:
                        'Использование платформы также регулируется нашей Политикой конфиденциальности. Пожалуйста, ознакомьтесь с нашей Политикой конфиденциальности, чтобы понять наши практики.'
                },
                {
                    title: '6. Изменения в условиях',
                    content:
                        'Мы оставляем за собой право изменять эти условия в любое время. Продолжение использования платформы после любых таких изменений означает ваше принятие новых условий.'
                },
                {
                    title: '7. Прекращение доступа',
                    content:
                        'Мы оставляем за собой право прекратить или приостановить действие вашей учетной записи и доступ к платформе по нашему усмотрению, без уведомления, за поведение, которое, по нашему мнению, нарушает настоящие Условия использования или наносит вред другим пользователям платформы, нам или третьим лицам, или по любой другой причине.'
                }
            ]
        }
    };

    const content = termsContent[language] || termsContent.en;

    return (
        <Container maxWidth="md">
            <Helmet>
                <title>{content.title} - Czech Learning Platform</title>
                <meta
                    name="description"
                    content="Terms of Service for our Czech language learning platform"
                />
            </Helmet>
            <Paper elevation={3} sx={{ p: 4, my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {content.title}
                </Typography>
                <Typography variant="body1" paragraph>
                    {content.introduction}
                </Typography>
                <List>
                    {content.sections.map((section, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemText
                                primary={
                                    <Typography variant="h6">
                                        {section.title}
                                    </Typography>
                                }
                                secondary={
                                    <Box
                                        component="span"
                                        sx={{ display: 'inline' }}
                                    >
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {section.content}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default Terms;
