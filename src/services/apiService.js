// src/services/apiService.js

const mockDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const apiService = {
    login: async (credentials) => {
        await mockDelay(500);
        return {
            token: 'mock_token',
            user: { id: 1, username: credentials.username }
        };
    },

    register: async (userData) => {
        await mockDelay(500);
        return { message: 'User registered successfully' };
    },

    getQuotes: async (currencyPairs) => {
        await mockDelay(300);
        return currencyPairs.map((pair) => ({
            pair,
            bid: Math.random() + 1,
            ask: Math.random() + 1.01
        }));
    },

    placeOrder: async (orderData) => {
        await mockDelay(400);
        return { orderId: Math.floor(Math.random() * 1000000) };
    },

    getPositions: async () => {
        await mockDelay(300);
        return [
            {
                id: 1,
                pair: 'EUR/USD',
                amount: 10000,
                openPrice: 1.1234,
                currentPrice: 1.1256
            },
            {
                id: 2,
                pair: 'GBP/JPY',
                amount: 5000,
                openPrice: 150.67,
                currentPrice: 150.89
            }
        ];
    },

    closePosition: async (positionId) => {
        await mockDelay(400);
        return {
            message: `Position ${positionId} closed successfully`
        };
    },

    getTradeHistory: async (token, startDate, endDate) => {
        await mockDelay(300);
        return [
            {
                id: 1,
                pair: 'EUR/USD',
                amount: 10000,
                openPrice: 1.1234,
                closePrice: 1.1256,
                profit: 220,
                date: '2023-05-01T10:30:00Z',
                type: 'Buy',
                status: 'Closed'
            },
            {
                id: 2,
                pair: 'GBP/JPY',
                amount: 5000,
                openPrice: 150.67,
                closePrice: 150.89,
                profit: 110,
                date: '2023-05-02T14:45:00Z',
                type: 'Sell',
                status: 'Closed'
            }
        ];
    },

    getUserAccount: async () => {
        await mockDelay(300);
        return {
            id: 1,
            username: 'johndoe',
            email: 'john@example.com',
            balance: 50000
        };
    },

    updateUserAccount: async (accountData) => {
        await mockDelay(400);
        return { message: 'Account updated successfully' };
    },

    fetchCurrencyPairs: async () => {
        await mockDelay(200);
        return ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'];
    },

    fetchAccountBalance: async () => {
        await mockDelay(300);
        return { balance: 50000 };
    },

    getChartData: async (currencyPair, timeframe) => {
        await mockDelay(500);
        return Array.from({ length: 100 }, (_, i) => ({
            timestamp: Date.now() - i * 60000,
            open: Math.random() + 1,
            high: Math.random() + 1.1,
            low: Math.random() + 0.9,
            close: Math.random() + 1
        }));
    },

    getRiskMetrics: async (token) => {
        await mockDelay(400);
        return {
            totalExposure: 100000,
            maxDrawdown: 5.2,
            sharpeRatio: 1.8
        };
    },

    getRiskLimits: async (token) => {
        await mockDelay(300);
        return {
            maxExposure: 150000,
            stopLossPercentage: 2
        };
    },

    updateRiskLimits: async (riskLimits, token) => {
        await mockDelay(300);
        return { message: 'Risk limits updated successfully' };
    },

    getNotifications: async () => {
        await mockDelay(300);
        return [
            { id: 1, message: 'New market update available', read: false },
            { id: 2, message: 'Your order has been executed', read: true }
        ];
    },

    markNotificationAsRead: async (notificationId) => {
        await mockDelay(200);
        return {
            message: `Notification ${notificationId} marked as read`
        };
    },

    getDashboardData: async () => {
        await mockDelay(500);
        return {
            accountBalance: 50000,
            openPositions: 2,
            dailyPnL: 350,
            notifications: 1,
            widgets: ['positions', 'orders', 'chart']
        };
    },

    updateDashboardLayout: async (layout) => {
        await mockDelay(300);
        return {
            message: 'Dashboard layout updated successfully'
        };
    },

    getMarketNews: async (page = 1) => {
        await mockDelay(400);
        const newsPerPage = 6;
        const startIndex = (page - 1) * newsPerPage;
        const endIndex = startIndex + newsPerPage;
        const allNews = [
            {
                id: 1,
                title: 'Fed announces interest rate decision',
                date: '2023-05-01',
                imageUrl:
                    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                summary:
                    'The Federal Reserve announced its latest interest rate decision...',
                publishedAt: '2023-05-01T14:30:00Z'
            },
            {
                id: 2,
                title: 'ECB to hold press conference on monetary policy',
                date: '2023-05-02',
                imageUrl:
                    'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                summary:
                    'The European Central Bank is set to hold a press conference...',
                publishedAt: '2023-05-02T10:00:00Z'
            },
            {
                id: 3,
                title: 'Bank of Japan maintains ultra-low interest rates',
                date: '2023-05-03',
                imageUrl:
                    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                summary:
                    'The Bank of Japan has decided to maintain its ultra-low interest rates...',
                publishedAt: '2023-05-03T06:45:00Z'
            },
            {
                id: 4,
                title: 'US Dollar strengthens against major currencies',
                date: '2023-05-04',
                imageUrl:
                    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                summary:
                    'The US Dollar has shown significant strength against major currencies...',
                publishedAt: '2023-05-04T18:20:00Z'
            },
            {
                id: 5,
                title: 'Oil prices surge amid geopolitical tensions',
                date: '2023-05-05',
                summary:
                    'Oil prices have surged in response to escalating geopolitical tensions...',
                publishedAt: '2023-05-05T09:15:00Z'
            },
            {
                id: 6,
                title: 'Global stock markets react to economic data',
                date: '2023-05-06',
                imageUrl:
                    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                summary:
                    'Global stock markets have shown mixed reactions to the latest economic data...',
                publishedAt: '2023-05-06T16:00:00Z'
            },
            {
                id: 7,
                title: 'Cryptocurrency market experiences high volatility',
                date: '2023-05-07',
                imageUrl:
                    'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
                summary:
                    'The cryptocurrency market has experienced significant volatility in recent trading...',
                publishedAt: '2023-05-07T11:30:00Z'
            },
            {
                id: 8,
                title: 'IMF releases global economic outlook report',
                date: '2023-05-08',
                imageUrl:
                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1415&q=80',
                summary:
                    'The International Monetary Fund has released its latest global economic outlook report...',
                publishedAt: '2023-05-08T13:45:00Z'
            }
        ];
        return allNews.slice(startIndex, endIndex);
    },

    getEconomicCalendar: async (startDate, endDate) => {
        await mockDelay(400);
        return [
            {
                id: 1,
                event: 'US Non-Farm Payrolls',
                date: '2023-05-05',
                time: '12:30 GMT',
                currency: 'USD',
                importance: 'High',
                actual: '253K',
                forecast: '180K',
                previous: '236K'
            },
            {
                id: 2,
                event: 'UK GDP',
                date: '2023-05-10',
                time: '06:00 GMT',
                currency: 'GBP',
                importance: 'Medium',
                actual: null,
                forecast: '0.1%',
                previous: '0.3%'
            },
            {
                id: 3,
                event: 'ECB Interest Rate Decision',
                date: '2023-05-15',
                time: '11:45 GMT',
                currency: 'EUR',
                importance: 'High',
                actual: null,
                forecast: '3.75%',
                previous: '3.50%'
            },
            {
                id: 4,
                event: 'Australia Employment Change',
                date: '2023-05-18',
                time: '01:30 GMT',
                currency: 'AUD',
                importance: 'Medium',
                actual: null,
                forecast: '20.0K',
                previous: '-4.3K'
            },
            {
                id: 5,
                event: 'Canada CPI',
                date: '2023-05-20',
                time: '12:30 GMT',
                currency: 'CAD',
                importance: 'Medium',
                actual: null,
                forecast: '0.5%',
                previous: '0.4%'
            }
        ];
    },

    getRealTimeFXRates: async () => {
        await mockDelay(300);
        const currencyPairs = [
            'EUR/USD',
            'GBP/USD',
            'USD/JPY',
            'AUD/USD',
            'USD/CAD'
        ];
        return currencyPairs.map((pair) => ({
            pair,
            bid: (Math.random() * 0.5 + 1).toFixed(5),
            ask: (Math.random() * 0.5 + 1.01).toFixed(5),
            timestamp: new Date().toISOString()
        }));
    },

    getCandleData: async (currencyPair, interval = '1m', limit = 100) => {
        await mockDelay(500);
        const now = Date.now();
        const intervalMs = {
            '1m': 60000,
            '5m': 300000,
            '15m': 900000,
            '1h': 3600000,
            '4h': 14400000,
            '1d': 86400000
        }[interval];

        return Array.from({ length: limit }, (_, i) => {
            const timestamp = now - (limit - 1 - i) * intervalMs;
            const open = Math.random() * 0.5 + 1;
            const close = Math.random() * 0.5 + 1;
            const high = Math.max(open, close) + Math.random() * 0.1;
            const low = Math.min(open, close) - Math.random() * 0.1;
            return {
                timestamp,
                open: open.toFixed(5),
                high: high.toFixed(5),
                low: low.toFixed(5),
                close: close.toFixed(5),
                volume: Math.floor(Math.random() * 1000000)
            };
        });
    }
};

export default apiService;
