import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default PrivateRoute;
