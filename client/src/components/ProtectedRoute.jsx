import React from 'react';
import  {Navigate, Outlet} from 'react-router-dom';

const ProtectedRoutes = () => {
    const isAuthenticated = localStorage.getItem('token'); // Check if token exists in localStorage
    
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace/>;
  };
  
  export default ProtectedRoutes;