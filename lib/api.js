import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('nc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove('nc_token');
      Cookies.remove('nc_user');
    }
    return Promise.reject(err);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getOne: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${encodeURIComponent(slug)}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
};

export const blogAPI = {
  getPosts: (params) => api.get('/blog', { params }),
  getPost: (slug) => api.get(`/blog/${encodeURIComponent(slug)}`),
};

export const usersAPI = {
  toggleWishlist: (id) => api.put(`/users/wishlist/${id}`),
  getWishlist: () => api.get('/users/wishlist'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  createProduct: (formData) => api.post('/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProduct: (id, formData) => api.put(`/admin/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  deleteImage: (productId, imageId) => api.delete(`/admin/products/${productId}/images/${imageId}`),
  addVideo: (id, formData) => api.post(`/products/${id}/video`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getSiteSettings: () => api.get('/site/settings'),
  updateSiteSettings: (data) => api.put('/site/settings', data),
  getBlogPosts: () => api.get('/blog/admin/all'),
  createBlogPost: (data) => api.post('/blog/admin', data),
  updateBlogPost: (id, data) => api.put(`/blog/admin/${id}`, data),
  deleteBlogPost: (id) => api.delete(`/blog/admin/${id}`),
};
