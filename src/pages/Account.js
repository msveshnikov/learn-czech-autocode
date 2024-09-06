import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    Stepper,
    Step,
    StepLabel,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const Account = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        balance: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeStep] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        data: userData,
        isLoading,
        error
    } = useQuery('userAccount', apiService.getUserAccount);

    const updateUserMutation = useMutation(apiService.updateUserAccount, {
        onSuccess: () => {
            queryClient.invalidateQueries('userAccount');
            setIsEditing(false);
            setSuccessMessage('Account updated successfully');
        }
    });

    useEffect(() => {
        if (userData) {
            setUser(userData);
        }
    }, [userData]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        updateUserMutation.mutate(user);
    };

    const onboardingSteps = [
        {
            label: 'Account Details',
            tooltip: 'Review and update your account information'
        },
        {
            label: 'Verify Email',
            tooltip: 'Confirm your email address'
        },
        {
            label: 'Set Preferences',
            tooltip: 'Customize your trading experience'
        }
    ];

    const handleCreateDemoAccount = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmDemoAccount = () => {
        // Implement demo account creation logic here
        setOpenDialog(false);
        setSuccessMessage('Demo account created successfully');
    };

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ my: 4, flexGrow: 1, padding: 3 }}>
            <Helmet>
                <title>Account - FX Trading Platform</title>
                <meta
                    name="description"
                    content="Manage your FX trading account"
                />
            </Helmet>
            <Typography variant="h4" gutterBottom>
                Account Details
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error.message}
                </Alert>
            )}
            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}
            <Paper elevation={3} sx={{ padding: 3, mb: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {onboardingSteps.map((step, index) => (
                        <Step key={step.label}>
                            <Tooltip title={step.tooltip}>
                                <StepLabel>{step.label}</StepLabel>
                            </Tooltip>
                        </Step>
                    ))}
                </Stepper>
            </Paper>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={user.username}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={user.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                Account Balance: ${user?.balance?.toFixed(2)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {isEditing ? (
                                <>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        sx={{ marginRight: 2 }}
                                        disabled={updateUserMutation.isLoading}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            <Paper elevation={3} sx={{ padding: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Demo Account
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCreateDemoAccount}
                >
                    Create Demo Account
                </Button>
            </Paper>
            <Paper elevation={3} sx={{ padding: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Quick Links
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/trading')}
                    sx={{ mr: 2 }}
                >
                    Go to Trading
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/positions')}
                >
                    View Positions
                </Button>
            </Paper>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Create Demo Account</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to create a demo account? This
                        will allow you to practice trading without using real
                        money.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        onClick={handleConfirmDemoAccount}
                        variant="contained"
                        color="primary"
                    >
                        Create Demo Account
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Account;
