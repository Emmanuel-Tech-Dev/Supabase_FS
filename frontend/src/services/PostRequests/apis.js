import axios from "axios";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true, // Allow sending cookies with requests
});

// Axios response interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Return response directly if successful
  async (error) => {
    const originalRequest = error.config;

    // If the response status is 401 (Unauthorized) and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent multiple retries for the same request

      try {
        // Attempt to refresh the session by calling the refresh token endpoint
        const refreshResponse = await refreshToken(); // Call the refresh token API

        if (refreshResponse.status === 200) {
          console.log("Session refreshed, retrying original request.");

          // The new access token is stored in the cookies (server-side), so no need to manually set headers.

          // Retry the original request
          return axiosInstance(originalRequest); // Axios will automatically send cookies
        } else {
          throw new Error("Failed to refresh session.");
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError); // Handle refresh token failure (e.g., log out user)
      }
    }

    return Promise.reject(error); // Reject the promise if not 401 or retry fails
  }
);

// Function to log in a user
const login = async (formData) => {
  try {
    const response = await axiosInstance.post("/auth/login", formData);

    if (response.status === 200) {
      console.log("Login successful.");
      return { success: true };
    } else {
      throw new Error("Login failed.");
    }
  } catch (err) {
    console.log(err.message);
    return { success: false };
  }
};

// Function to refresh the token
const refreshToken = async () => {
  try {
    const response = await axiosInstance.post("/auth/token/refresh"); // Calls the refresh endpoint
    return response; // Return the response to check the status
  } catch (err) {
    console.log("Error refreshing token:", err.message);
    throw err; // Rethrow the error to be handled by the interceptor
  }
};

export { login, axiosInstance };
