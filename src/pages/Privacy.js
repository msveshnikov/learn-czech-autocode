import React from 'react';
import { Typography, Container, Box, Paper } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useLanguage } from '../contexts/LanguageContext';

const Privacy = () => {
    const { language } = useLanguage();

    const content = {
        en: {
            title: 'Privacy Policy',
            sections: [
                {
                    title: '1. Information Collection',
                    content:
                        'We collect personal information that you provide directly to us when you create an account, use our services, or communicate with us. This may include your name, email address, and language learning progress data.'
                },
                {
                    title: '2. Use of Information',
                    content:
                        'We use the information we collect to provide, maintain, and improve our language learning services, to process your requests, to send you technical notices and support messages, and to comply with legal obligations.'
                },
                {
                    title: '3. Data Security',
                    content:
                        'We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.'
                },
                {
                    title: '4. Data Sharing',
                    content:
                        'We do not sell your personal information. We may share your information with third-party service providers who perform services on our behalf, subject to confidentiality agreements.'
                },
                {
                    title: '5. Your Rights',
                    content:
                        'You have the right to access, correct, or delete your personal information. You may also have the right to restrict or object to certain processing of your data.'
                },
                {
                    title: '6. Changes to This Policy',
                    content:
                        'We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.'
                },
                {
                    title: '7. Contact Us',
                    content:
                        'If you have any questions about this privacy policy, please contact us at privacy@czechfromrussian.com.'
                }
            ]
        },
        ru: {
            title: 'Политика конфиденциальности',
            sections: [
                {
                    title: '1. Сбор информации',
                    content:
                        'Мы собираем личную информацию, которую вы предоставляете нам напрямую при создании учетной записи, использовании наших услуг или общении с нами. Это может включать ваше имя, адрес электронной почты и данные о прогрессе в изучении языка.'
                },
                {
                    title: '2. Использование информации',
                    content:
                        'Мы используем собранную информацию для предоставления, поддержки и улучшения наших услуг по изучению языка, обработки ваших запросов, отправки технических уведомлений и сообщений поддержки, а также для соблюдения юридических обязательств.'
                },
                {
                    title: '3. Безопасность данных',
                    content:
                        'Мы применяем соответствующие технические и организационные меры для защиты вашей личной информации от несанкционированной или незаконной обработки, случайной потери, уничтожения или повреждения.'
                },
                {
                    title: '4. Обмен данными',
                    content:
                        'Мы не продаем вашу личную информацию. Мы можем делиться вашей информацией с сторонними поставщиками услуг, которые выполняют услуги от нашего имени, при условии соблюдения соглашений о конфиденциальности.'
                },
                {
                    title: '5. Ваши права',
                    content:
                        'У вас есть право на доступ, исправление или удаление вашей личной информации. Вы также можете иметь право ограничивать или возражать против определенной обработки ваших данных.'
                },
                {
                    title: '6. Изменения в этой политике',
                    content:
                        'Мы можем время от времени обновлять эту политику конфиденциальности. Мы уведомим вас о любых изменениях, разместив новую политику конфиденциальности на этой странице.'
                },
                {
                    title: '7. Свяжитесь с нами',
                    content:
                        'Если у вас есть какие-либо вопросы об этой политике конфиденциальности, пожалуйста, свяжитесь с нами по адресу privacy@czechfromrussian.com.'
                }
            ]
        }
    };

    const currentContent = content[language] || content.en;

    return (
        <Container maxWidth="md">
            <Helmet>
                <title>{currentContent.title} - Czech from Russian</title>
                <meta
                    name="description"
                    content="Privacy policy for Czech from Russian language learning application"
                />
            </Helmet>
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {currentContent.title}
                </Typography>
                {currentContent.sections.map((section, index) => (
                    <Box key={index} my={4}>
                        <Typography variant="h6" gutterBottom>
                            {section.title}
                        </Typography>
                        <Typography paragraph>{section.content}</Typography>
                    </Box>
                ))}
                <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                >
                    Last Updated: {new Date().toLocaleDateString()}
                </Typography>
            </Paper>
        </Container>
    );
};

export default Privacy;
