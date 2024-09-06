import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const Loading = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2 }}>
                Loading...
            </Typography>
        </Box>
    );
};

export default Loading;
