import React, { useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice.js";
import PublicRoute from "./components/PublicRoute.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import DashbaordLayout from "./components/DashbaordLayout.jsx";

// importing pages
import UserAuthenticationPage from "./pages/UserAuthenticationPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      dispatch(logout);
    } else {
      axios
        .get(`${import.meta.env.VITE_BACKEND_API_URL}/accounts/current_user`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((res) => {
          const userData = res.data;
          dispatch(login(userData));
        });
    }
  }, [dispatch]);
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <UserAuthenticationPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashbaordLayout>
                <DashboardPage />
              </DashbaordLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/document/:document_id"
          element={
            <PrivateRoute>
              <DashbaordLayout>
                <ChatPage />
              </DashbaordLayout>
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
