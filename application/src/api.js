const DEV_API_URL = 'http://mekanxsari.ru:3000/api';
const PROD_API_URL = '/api';

export const API_URL = process.env.NODE_ENV === 'production' ? PROD_API_URL : DEV_API_URL;
export const SITE_URL = 'https://www.mekanxsari.ru';