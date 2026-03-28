import axios from 'axios';

// Create an Axios instance pointing to our FastAPI backend
const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
