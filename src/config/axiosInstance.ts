import axios from 'axios';
import { env } from './app.config';

export const Axios = axios.create({
  baseURL: `${env.BASE_URL}${env.VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// Document and file upload
export const AxiosDoc = axios.create({
  baseURL: `${env.BASE_URL}${env.VERSION}`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

AxiosDoc.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token') as string;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosDoc.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const AxiosOffline = axios.create({
  baseURL: `${env.BASE_URL}${env.VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// AxiosOffline.interceptors.request.use(
//   async (config) => {
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// AxiosOffline.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     return Promise.reject(error);
//   }
// );
