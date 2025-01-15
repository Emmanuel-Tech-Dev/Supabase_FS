import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Create Axios instance with credentials enabled to handle cookies
    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_HOST,
        withCredentials: true,  // This ensures that cookies are sent with every request
    });

    // Axios response interceptor for handling token refresh based on 403 response
    axiosInstance.interceptors.response.use(
        (response) => response,  // Return response directly if successful
        async (error) => {
            const originalRequest = error.config;
            let refreshing = false;
            let isRefreshed = null;

            // If the response status is 403 (forbidden), attempt to refresh the session
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;  // Prevent multiple retries for the same request

                try {
                    if (!isRefreshed) {
                        try {
                            // Attempt to refresh the session by calling the refresh token endpoint
                            const refreshResponse = await axiosInstance.post("/auth/token/refresh");

                            if (refreshResponse.status === 200) {
                                console.log("Session refreshed, retrying original request.");

                                // Retry the original request after refreshing the session
                                return axiosInstance(originalRequest);
                            } else {
                                throw new Error("Failed to refresh session.");
                            }
                        } catch (refreshError) {
                            console.error("Token refresh failed:", refreshError);
                            logOut();  // Log the user out if session refresh fails
                        }
                    }
                } catch (err) {
                    console.log(err);
                    return Promise.reject(err);
                }



            }

            return Promise.reject(error);  // Reject the promise if not 403 or retry fails
        }
    );

    // Function to log in the user
    const logIn = useCallback(async (formData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post("/auth/login", formData);

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
    }, []);

    // Function to log out and clear the session
    const logOut = useCallback(() => {
        axiosInstance.post("/auth/logout").then(() => {
            console.log("User logged out.");
        });
    }, []);

    return (
        <AuthContext.Provider value={{ logIn, logOut, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
