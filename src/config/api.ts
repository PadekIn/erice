
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  endpoints: {
    products: '/products',
    auth: '/auth',
    orders: '/orders',
    testimonials: '/testimonials',
    blog: '/blogs',
    contact: '/contacts',
    categories: '/categories',
    carts: '/carts',
  }
};
