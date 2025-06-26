// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL, // set this to your Django backend API
	timeout: 5000,
});

axiosInstance.interceptors.request.use(
	config => {
		const token = localStorage.getItem('access_token');
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	}
);

axiosInstance.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const refreshToken = localStorage.getItem('refreshToken');

			try {
				const res = await axios.post('/api/accounts/refresh/', { refresh: refreshToken });
				const new_access_token = res.data.access;
				localStorage.setItem('access_token', new_access_token);
				originalRequest.headers['Authorization'] = `Bearer ${new_access_token}`;
				return axiosInstance(originalRequest);
			} catch (err) {
				window.location.href = '/';
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
