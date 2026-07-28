/**
 * Mandi Price API Configuration
 * Dynamically resolves base URL from VITE_API_URL or defaults to localhost in dev
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const SUPPORTED_STATES = [
  'Maharashtra',
  'Uttar Pradesh',
  'Punjab',
  'Madhya Pradesh',
  'Karnataka'
];
