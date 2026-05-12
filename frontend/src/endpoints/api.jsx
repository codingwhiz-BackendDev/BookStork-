import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

// =======================
// AXIOS INSTANCE
// =======================

const api = axios.create({
    baseURL: BASE_URL,
});


// =======================
// TOKEN HELPERS
// =======================

// Get access token
const getAccessToken = () => {
    return localStorage.getItem("access");
};

// Get refresh token
const getRefreshToken = () => {
    return localStorage.getItem("refresh");
};

// Save tokens
const setTokens = (access, refresh) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
};

// Clear tokens
const clearTokens = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};


// =======================
// REQUEST INTERCEPTOR
// =======================

// Automatically attach access token
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// =======================
// REFRESH ACCESS TOKEN
// =======================

const refreshAccessToken = async () => {
    try {
        const refresh = getRefreshToken();

        // No refresh token
        if (!refresh) {
            return null;
        }

        const response = await axios.post(
            `${BASE_URL}/api/token/refresh/`,
            {
                refresh: refresh,
            }
        );

        const newAccess = response.data.access;

        // Save new access token
        localStorage.setItem("access", newAccess);

        return newAccess;

    } catch (error) {
        clearTokens();
        return null;
    }
};


// =======================
// RESPONSE INTERCEPTOR
// =======================

api.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        // Routes that should NOT refresh token
        const excludedRoutes = [
            "/api/token/",
            "/register/",
        ];

        const isExcludedRoute =
            excludedRoutes.some((route) =>
                originalRequest.url.includes(route)
            );

        // If access token expired
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isExcludedRoute
        ) {

            originalRequest._retry = true;

            const newAccess =
                await refreshAccessToken();

            // Retry request
            if (newAccess) {

                originalRequest.headers.Authorization =
                    `Bearer ${newAccess}`;

                return api(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);


// =======================
// AUTH API
// =======================

// Register
export const register = async (userData) => {

    const response = await api.post(
        "/register/",
        userData
    );

    return response.data;
};


// Login
export const login = async (username, password) => {

    const response = await api.post(
        "/api/token/",
        {
            username,
            password,
        }
    );

    // Save tokens
    setTokens(
        response.data.access,
        response.data.refresh
    );

    return response.data;
};


// Logout
export const logout = () => {
    clearTokens();
};


// Check if logged in
export const isAuthenticated = () => {
    return !!getAccessToken();
};


// =======================
// BOOK API
// =======================

// Get all books
export const viewBooks = async () => {

    const response = await api.get(
        "/books/"
    );

    return response.data;
};


// Create book
export const createBook = async (bookData) => {

    const response = await api.post(
        "/books/create/",
        bookData
    );

    return response.data;
};


// Edit book
export const editBook = async (id, bookData) => {

    const response = await api.put(
        `/books/${id}/edit/`,
        bookData
    );

    return response.data;
};


// Delete book
export const deleteBook = async (id) => {

    const response = await api.delete(
        `/books/${id}/delete/`
    );

    return response.data;
};


export default api;