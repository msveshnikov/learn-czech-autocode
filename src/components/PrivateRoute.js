import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from './Loading';

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const location = useLocation();

    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // TODO: Implement token validation with the backend
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default PrivateRoute;
