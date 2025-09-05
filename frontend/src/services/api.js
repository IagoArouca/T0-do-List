 import axios from 'axios';

const API_BASE_URL = 'https://t0-do-list-f8my.onrender.com'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token); 
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const updateMe = async (userData) => {
  try {
    const response = await api.put('/users/me', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const createTasklist = async (name) => {
  try {
    const response = await api.post('/tasklists', { name });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getAllTasklists = async () => {
  try {
    const response = await api.get('/tasklists');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getTasklistById = async (id) => {
  try {
    const response = await api.get(`/tasklists/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const updateTasklist = async (id, name) => {
  try {
    const response = await api.put(`/tasklists/${id}`, { name });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const deleteTasklist = async (id) => {
  try {
    const response = await api.delete(`/tasklists/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const inviteCollaborator = async (id, email) => {
  try {
    const response = await api.post(`/tasklists/${id}/invite`, { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const removeCollaborator = async (taskListId, userId) => {
  try {
    const response = await api.delete(`/tasklists/${taskListId}/collaborators/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const createTask = async (taskListId, description) => {
  try {
    const response = await api.post(`/tasks/lists/${taskListId}`, { description });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getAllTasksByList = async (taskListId) => {
  try {
    const response = await api.get(`/tasks/lists/${taskListId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getTaskById = async (id) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};