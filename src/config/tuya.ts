export const TUYA_ENDPOINTS = {
  CN: '/api/tuya',      // China
  EU: '/api/tuya',      // Western Europe
  EU_CENTRAL: '/api/tuya', // Central Europe
  IN: '/api/tuya',      // India
  US_WEST: '/api/tuya', // Western America
  US_EAST: '/api/tuya'  // Eastern America
} as const;

// Using Central Europe Data Center
const REGION = 'EU_CENTRAL';

export const TUYA_CONFIG = {
  ACCESS_ID: import.meta.env.VITE_TUYA_ACCESS_ID || '',
  ACCESS_SECRET: import.meta.env.VITE_TUYA_ACCESS_SECRET || '',
  API_ENDPOINT: TUYA_ENDPOINTS[REGION as keyof typeof TUYA_ENDPOINTS],
}; 