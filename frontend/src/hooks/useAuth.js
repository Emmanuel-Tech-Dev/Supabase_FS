import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../services/PostRequests/apis";
import axios from "axios";

const useAuth = (endpoint) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to log in the user
  const logIn = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(endpoint, formData);

      if (response.status === 200) {
        console.log("Login successful.");
        return { success: true };
      } else {
        throw new Error("Login failed.");
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Invalid email or password"
          : "An error occurred during login"
      );
      return { success: false };
    } finally {
      setLoading(false);
    }
  };
  // Function to log out and clear the session
  const logOut = useCallback(() => {
    axiosInstance.post("/auth/logout").then(() => {
      console.log("User logged out.");
    });
  }, [axiosInstance]);

  return {
    logIn,
    logOut,
    loading,
    error,
  };
};

export default useAuth;
