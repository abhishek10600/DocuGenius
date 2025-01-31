import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken"); // Check for authentication token

  // Redirect to dashboard if user is authenticated
  return authToken ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
