import React, { useState } from "react";
import axios from "axios";
import { login } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const UserAuthenticationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState(false);
  const [showSignupError, setShowSignupError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/accounts/google-login/`,
        { token }
      );
      localStorage.setItem("authToken", res.data.tokens.access_token);
      dispatch(login(res.data));
      toast.success("Logged In With Google!");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Google Login Failed.");
    }
  };

  const handleGoogleFailure = () => {
    toast.error("Google login failed. Please try again.");
  };

  const handleSignupButtonClick = async (ev) => {
    ev.preventDefault();
    setSignupLoading(true);
    setSignupError(false);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/accounts/register/`,
        {
          first_name: firstName,
          last_name: lastName,
          email: signupEmail,
          username: signupUsername,
          password: signupPassword,
        }
      );
      localStorage.setItem("authToken", res.data.token.access_token);
      const userData = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/accounts/current_user/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (userData) {
        setSignupLoading(false);
        setSignupError(false);
        dispatch(login(userData.data));
        toast.success(res.data.response_message);
        navigate("/dashboard");
      }
      console.log(res.data.response_message);
    } catch (error) {
      setSignupLoading(false);
      setShowSignupError(true);
      setSignupError("This username or email already exists.");
    }
    setSignupLoading(false);
  };

  const handleLoginButtonClick = async (ev) => {
    ev.preventDefault();
    setLoginLoading(true);
    setLoginError(false);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/accounts/token/`,
        {
          username: loginUsername,
          password: loginPassword,
        }
      );
      localStorage.setItem("authToken", res.data.access);
      const userData = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/accounts/current_user/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (userData) {
        setLoginLoading(false);
        setLoginError(false);
        dispatch(login(userData.data));
        toast.success("Logged In Successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      setSignupLoading(false);
      setLoginLoading(false);
      if (
        error.response.data.detail ===
        "No active account found with the given credentials"
      ) {
        setLoginError("Invalid username or password");
      }
      setShowLoginError(true);
    }
    setLoginLoading(false);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="container mt-5">
        <div className="mx-auto col-md-6 col-12 border shadow">
          {/* Tab navigation */}
          <div className="d-flex justify-content-center mb-4">
            <button
              className={`tab-button ${
                activeTab === "login" ? "tab-active" : ""
              }`}
              onClick={() => handleTabChange("login")}
            >
              Login
            </button>
            <button
              className={`tab-button ${
                activeTab === "signup" ? "tab-active" : ""
              }`}
              onClick={() => handleTabChange("signup")}
            >
              Signup
            </button>
          </div>
          {/* Form content */}
          <div className="mx-4 my-2">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              text="signin_with"
            />
          </div>
          <div>
            {activeTab === "login" && (
              <form className="px-4 pb-4" onSubmit={handleLoginButtonClick}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(ev) => setLoginUsername(ev.target.value)}
                    className="form-control"
                    id="loginEmail"
                    placeholder="Enter your username"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(ev) => setLoginPassword(ev.target.value)}
                    className="form-control"
                    id="loginPassword"
                    placeholder="Enter your password"
                  />
                </div>
                {showLoginError && <p className="text-danger">{loginError}</p>}
                {!loginLoading && (
                  <button type="submit" className="btn button-custom w-100">
                    Login
                  </button>
                )}
                {loginLoading && (
                  <button type="submit" className="btn w-100">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </button>
                )}
              </form>
            )}
            {activeTab === "signup" && (
              <form className="px-4 pb-4" onSubmit={handleSignupButtonClick}>
                <div className="mb-3">
                  <label htmlFor="signupEmail" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(ev) => setFirstName(ev.target.value)}
                    className="form-control"
                    id="firstName"
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="signupEmail" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(ev) => setLastName(ev.target.value)}
                    className="form-control"
                    id="firstName"
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="signupUsername" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    value={signupUsername}
                    onChange={(ev) => setSignupUsername(ev.target.value)}
                    className="form-control"
                    id="signupUsername"
                    placeholder="Create a username"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="signupEmail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(ev) => setSignupEmail(ev.target.value)}
                    className="form-control"
                    id="signupEmail"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="signupPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(ev) => setSignupPassword(ev.target.value)}
                    className="form-control"
                    id="signupPassword"
                    placeholder="Enter your password"
                  />
                </div>
                {showSignupError && (
                  <p className="text-danger">{signupError}</p>
                )}
                {!signupLoading && (
                  <button type="submit" className="btn button-custom w-100">
                    Signup
                  </button>
                )}
                {signupLoading && (
                  <button type="submit" className="btn w-100">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default UserAuthenticationForm;
