import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from './Loading';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    const location = useLocation();

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
