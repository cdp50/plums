const apiUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : 'https://plums-olive.vercel.app/';

export default apiUrl;
