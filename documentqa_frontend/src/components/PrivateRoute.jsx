import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken"); // Check for authentication token

  // Redirect to login page if user is not authenticated
  return authToken ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
