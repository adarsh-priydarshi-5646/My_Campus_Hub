import axios from 'axios';

const PRODUCTION_API_URL = 'https://your-production-api-domain.com/api';
const DEVELOPMENT_API_URL = 'http://localhost:3001/api';

const API_URL = __DEV__ ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = global.__MCH_TOKEN__;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (__DEV__) console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    if (__DEV__) console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (__DEV__) console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  async (error) => {
    if (__DEV__) console.error('Response error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.multiRemove(['mch_user', 'mch_token']);
        global.__MCH_TOKEN__ = undefined;
      } catch (e) {
        if (__DEV__) console.error('Error clearing auth data:', e);
      }
    }
    
    return Promise.reject(error);
  }
);

export const apiLogin = (email, password) => api.post('/auth/login', { email, password });
export const apiRegister = (userData) => api.post('/auth/register', userData);
export const apiLogout = () => api.post('/auth/logout');
export const apiLogoutAll = () => api.post('/auth/logout-all');
export const apiGetCurrentUser = () => api.get('/auth/me');
export const apiUpdateProfile = (profileData) => api.put('/auth/profile', profileData);

export const fetchSemesters = () => api.get('/academics/semesters');
export const fetchSemesterDetails = (semesterId) => api.get(`/academics/details/${semesterId}`);
export const fetchSubjects = (semesterId) => api.get(`/academics/subjects/${semesterId}`);
export const fetchTimetable = (semesterId) => api.get(`/timetable/${semesterId}`);
export const fetchHostel = () => api.get('/hostel');
export const fetchMess = () => api.get('/mess');
export const fetchEvents = () => api.get('/events');
export const fetchFaculty = () => api.get('/faculty');
export const fetchTeacherById = (id) => api.get(`/faculty/${id}`);
export const fetchCollegeDetails = () => api.get('/college');
