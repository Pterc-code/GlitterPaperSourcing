import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL, // Your Django backend base URL
	timeout: 5000,
});

// ✅ Single request interceptor with proper token logic
axiosInstance.interceptors.request.use(
	config => {
		const token = localStorage.getItem('access_token');

		// Define public endpoints that should NOT receive token
		const publicEndpoints = [
			'/api/accounts/register/',
			'/api/auth/password/reset/',
			'/api/auth/password/reset/confirm/',
			'/api/auth/login/',
		];

		// Normalize config.url to start with '/' for clean matching
		const normalizedUrl = config.url.startsWith('/')
			? config.url
			: '/' + config.url;

		const isPublic = publicEndpoints.includes(normalizedUrl);

		if (token && !isPublic) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}

		// Debug log
		console.log(`[AXIOS DEBUG] ${normalizedUrl} → token attached?`, !!config.headers.Authorization);

		return config;
	}
);

// ✅ Response interceptor for refresh logic (no changes here)
axiosInstance.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const refreshToken = localStorage.getItem('refreshToken');

			try {
				const res = await axios.post(
					`${process.env.REACT_APP_API_BASE_URL}/api/accounts/refresh/`,
					{ refresh: refreshToken }
				);
				const newAccessToken = res.data.access;
				localStorage.setItem('access_token', newAccessToken);
				originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
				return axiosInstance(originalRequest);
			} catch (err) {
				window.location.href = '/';
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
