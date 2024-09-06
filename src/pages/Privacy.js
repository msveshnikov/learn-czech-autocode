import React from 'react';
import { Typography, Container, Box, Paper } from '@mui/material';

const Privacy = () => {
    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Privacy Policy
                </Typography>
                <Box my={4}>
                    <Typography variant="h6" gutterBottom>
                        1. Information Collection
                    </Typography>
                    <Typography paragraph>
                        We collect personal information that you provide
                        directly to us when you create an account, use our
                        services, or communicate with us. This may include your
                        name, email address, phone number, and financial
                        information necessary for trading.
                    </Typography>
                </Box>
                <Box my={4}>
                    <Typography variant="h6" gutterBottom>
                        2. Use of Information
                    </Typography>
                    <Typography paragraph>
                        We use the information we collect to provide, maintain,
                        and improve our services, to process your transactions,
                        to send you technical notices and support messages, and
                        to comply with legal obligations.
                    </Typography>
                </Box>
                <Box my={4}>
                    <Typography variant="h6" gutterBottom>
                        3. Data Security
                    </Typography>
                    <Typography paragraph>
                        We implement appropriate technical and organizational
                        measures to protect your personal information against
                        unauthorized or unlawful processing, accidental loss,
                        destruction, or damage.
                    </Typography>
                </Box>
                <Box my={4}>
                    <Typography variant="h6" gutterBottom>
                        4. Data Sharing
                    </Typography>
                    <Typography paragraph>
                        We do not sell your personal information. We may share
                        your information with third-party service providers who
                        perform services on our behalf, subject to
                        confidentiality agreements.
                    </Typography>
                </Box>
                <Box my={4}>
                    <Typography variant="h6" gutterBottom>
                        5. Your Rights
                    </Typography>
                    <Typography paragraph>
                        You have the right to access, correct, or delete your
                        personal information. You may also have the right to
                        restrict or object to certain processing of your data.
                        To exercise these rights, please contact us using the
                        information provided below.
                    </Typography>
                </Box>
                <Box my={4}>
                    <Typography variant="h6" gutterBottom>
                        6. Changes to This Policy
                    </Typography>
                    <Typography paragraph>
                        We may update this privacy policy from time to time. We
                        will notify you of any changes by posting the new
                        privacy policy on this page and updating the Last
                        Updated date.
                    </Typography>
                </Box>
                <Box my={4}>
                    <Typography variant="h6" gutterBottom>
                        7. Contact Us
                    </Typography>
                    <Typography paragraph>
                        If you have any questions about this privacy policy,
                        please contact us at privacy@fxtrading.com.
                    </Typography>
                </Box>
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
