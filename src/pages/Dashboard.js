import React, { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    useMediaQuery,
    Snackbar,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import apiService from '../services/apiService';
import Loading from '../components/Loading';
import Chart from 'react-apexcharts';
import Onboarding from '../components/Onboarding';

const Dashboard = () => {
    const [currencyPairs, setCurrencyPairs] = useState([]);
    const [accountBalance, setAccountBalance] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const [showOnboarding, setShowOnboarding] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        data: quotesData,
        isLoading: quotesLoading,
        error: quotesError
    } = useQuery(
        'quotes',
        () => apiService.getQuotes(['EUR/USD', 'GBP/USD', 'USD/JPY']),
        {
            refetchInterval: 10000
        }
    );

    const {
        data: accountData,
        isLoading: accountLoading,
        error: accountError
    } = useQuery('account', apiService.getUserAccount);

    const {
        data: dashboardConfig,
        isLoading: dashboardLoading,
        error: dashboardError
    } = useQuery('dashboard', apiService.getDashboardData);

    useEffect(() => {
        if (quotesData) setCurrencyPairs(quotesData);
        if (accountData) setAccountBalance(accountData.balance);
        if (dashboardConfig) setDashboardData(dashboardConfig);
    }, [quotesData, accountData, dashboardConfig]);

    const sortedCurrencyPairs = useMemo(() => {
        return [...currencyPairs].sort((a, b) => a.pair.localeCompare(b.pair));
    }, [currencyPairs]);

    const chartOptions = {
        chart: {
            type: 'line',
            height: 300,
            toolbar: { show: !isMobile }
        },
        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
        theme: { mode: theme.palette.mode },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: { width: '100%' },
                    legend: { position: 'bottom' }
                }
            }
        ]
    };

    const chartSeries = [
        {
            name: 'EUR/USD',
            data: [1.12, 1.13, 1.15, 1.14, 1.16, 1.15]
        }
    ];

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleQuickTrade = () => {
        navigate('/trading');
        setSnackbar({
            open: true,
            message: 'Redirecting to trading page',
            severity: 'info'
        });
    };

    const onboardingSteps = [
        {
            target: '#account-balance',
            content: 'This is your current account balance.'
        },
        {
            target: '#quick-trade',
            content: 'Click here to start trading quickly.'
        },
        {
            target: '#currency-pairs',
            content: 'View real-time currency pair quotes here.'
        }
    ];

    if (quotesLoading || accountLoading || dashboardLoading) {
        return <Loading />;
    }

    if (quotesError || accountError || dashboardError) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Typography color="error">
                    {quotesError?.message ||
                        accountError?.message ||
                        dashboardError?.message}
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Helmet>
                <title>Dashboard - FX Trading Platform</title>
                <meta
                    name="description"
                    content="View your FX trading dashboard with real-time currency pair quotes and account information."
                />
            </Helmet>
            <Container maxWidth="lg">
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Dashboard
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{ p: 2 }}
                                id="account-balance"
                            >
                                <Typography variant="h6" gutterBottom>
                                    Account Balance
                                </Typography>
                                {accountBalance !== null ? (
                                    <Typography variant="h4">
                                        ${accountBalance.toFixed(2)}
                                    </Typography>
                                ) : (
                                    <Typography>Balance unavailable</Typography>
                                )}
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 2 }} id="quick-trade">
                                <Typography variant="h6" gutterBottom>
                                    Quick Trade
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleQuickTrade}
                                    fullWidth
                                >
                                    Start Trading
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper
                                elevation={3}
                                sx={{ p: 2 }}
                                id="currency-pairs"
                            >
                                <Typography variant="h6" gutterBottom>
                                    Currency Pairs
                                </Typography>
                                {sortedCurrencyPairs.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {sortedCurrencyPairs.map(
                                            ({ pair, bid, ask }) => (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    md={4}
                                                    key={pair}
                                                >
                                                    <Paper
                                                        elevation={1}
                                                        sx={{
                                                            p: 2,
                                                            backgroundColor:
                                                                theme.palette
                                                                    .background
                                                                    .default
                                                        }}
                                                    >
                                                        <Typography variant="subtitle1">
                                                            {pair}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Bid:{' '}
                                                            {bid.toFixed(5)}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Ask:{' '}
                                                            {ask.toFixed(5)}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            )
                                        )}
                                    </Grid>
                                ) : (
                                    <Typography>
                                        No currency pairs available
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                        {dashboardData && dashboardData.openPositions > 0 && (
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Open Positions
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => navigate('/positions')}
                                        fullWidth
                                    >
                                        View Positions
                                    </Button>
                                </Paper>
                            </Grid>
                        )}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Recent Orders
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => navigate('/history')}
                                    fullWidth
                                >
                                    View Order History
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Market Chart
                                </Typography>
                                <Box height={300}>
                                    <Chart
                                        options={chartOptions}
                                        series={chartSeries}
                                        type="line"
                                        height={300}
                                        width="100%"
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            {showOnboarding && (
                <Onboarding
                    steps={onboardingSteps}
                    onComplete={() => setShowOnboarding(false)}
                />
            )}
        </>
    );
};

export default React.memo(Dashboard);
