import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Terms = () => {
    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Terms of Service
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Welcome to our FX Trading Platform. By using our
                        services, you agree to be bound by the following terms
                        and conditions.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        1. Acceptance of Terms
                    </Typography>
                    <Typography variant="body1" paragraph>
                        By accessing or using our FX Trading Platform, you agree
                        to comply with and be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use
                        our platform.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        2. Use of Services
                    </Typography>
                    <Typography variant="body1" paragraph>
                        You must be at least 18 years old to use our services.
                        You are responsible for maintaining the confidentiality
                        of your account and password and for restricting access
                        to your computer.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        3. Trading Risks
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Foreign exchange trading carries a high level of risk
                        and may not be suitable for all investors. The high
                        degree of leverage can work against you as well as for
                        you. Before deciding to trade foreign exchange, you
                        should carefully consider your investment objectives,
                        level of experience, and risk appetite.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        4. Limitation of Liability
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We shall not be liable for any direct, indirect,
                        incidental, special, consequential, or exemplary damages
                        resulting from your use or inability to use the service.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        5. Modifications to Terms
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We reserve the right to modify these terms at any time.
                        Your continued use of the platform after any such
                        changes constitutes your acceptance of the new terms.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        6. Governing Law
                    </Typography>
                    <Typography variant="body1" paragraph>
                        These terms shall be governed by and construed in
                        accordance with the laws of the jurisdiction in which
                        our company is registered, without regard to its
                        conflict of law provisions.
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default Terms;
