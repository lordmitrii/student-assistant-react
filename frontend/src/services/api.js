import axios from 'axios';

function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrftoken') {
        return decodeURIComponent(value);
      }
    }
    return null;
  }
  
  const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  api.interceptors.request.use((config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
        config.headers['X-CSRFToken'] = csrfToken;
        console.log('CSRF Token added to headers:', csrfToken);
      }
      
    return config;
  });

export const fetchCourses = () => api.get('courses/');
export const fetchCourseDetail = (slug) => api.get(`courses/${slug}/`);
export const fetchGrades = () => api.get('grades/');
export const fetchAssignments = () => api.get('assignments/');
export const fetchNews = () => api.get('news/');
export const getCSRF = () => api.get('csrf/');
export const login = (username, password) =>
    api.post('login/', { username, password });

export default api;