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
    Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet';
import apiService from '../services/apiService';
import Loading from '../components/Loading';
import { useTheme } from '@mui/material/styles';

const History = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const theme = useTheme();

    const fetchTradeHistory = async () => {
        const token = localStorage.getItem('token');
        return apiService.getTradeHistory(token, startDate, endDate);
    };

    const {
        data: trades,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery(['tradeHistory', startDate, endDate], fetchTradeHistory, {
        enabled: false
    });

    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilter = () => {
        refetch();
    };

    const sortedTrades = useMemo(() => {
        return trades
            ? [...trades].sort((a, b) => new Date(b.date) - new Date(a.date))
            : [];
    }, [trades]);

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
                <Typography color="error">{error.message}</Typography>
            </Box>
        );
    }

    return (
        <>
            <Helmet>
                <title>Trade History - FX Trading Platform</title>
            </Helmet>
            <Container maxWidth="lg">
                <Typography
                    sx={{ my: 4 }}
                    variant="h4"
                    component="h1"
                    gutterBottom
                >
                    Trade History
                </Typography>
                <Box mb={3}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                textField={(params) => (
                                    <TextField {...params} fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                textField={(params) => (
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
                                Filter
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Currency Pair</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Profit/Loss</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedTrades.map((trade) => (
                                <TableRow key={trade.id}>
                                    <TableCell>
                                        {format(
                                            new Date(trade.date),
                                            'yyyy-MM-dd HH:mm:ss'
                                        )}
                                    </TableCell>
                                    <TableCell>{trade.pair}</TableCell>
                                    <TableCell>{trade.type}</TableCell>
                                    <TableCell>{trade.amount}</TableCell>
                                    <TableCell>{trade.price}</TableCell>
                                    <TableCell
                                        sx={{
                                            color:
                                                trade.profit > 0
                                                    ? theme.palette.success.main
                                                    : theme.palette.error.main
                                        }}
                                    >
                                        {trade.profit}
                                    </TableCell>
                                    <TableCell>{trade.status}</TableCell>
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
