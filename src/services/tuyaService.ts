import { TUYA_CONFIG } from '../config/tuya';
import CryptoJS from 'crypto-js';

class TuyaService {
  private accessId: string;
  private accessSecret: string;
  private apiEndpoint: string;
  private accessToken: string | null = null;

  constructor() {
    this.accessId = TUYA_CONFIG.ACCESS_ID;
    this.accessSecret = TUYA_CONFIG.ACCESS_SECRET;
    this.apiEndpoint = TUYA_CONFIG.API_ENDPOINT;
    console.log('Initialized TuyaService with:', {
      accessId: this.accessId,
      apiEndpoint: this.apiEndpoint
    });
  }

  private getSignature(path: string, method: string, body?: any, timestamp?: string, nonce?: string): string {
    const t = timestamp || Date.now().toString();
    const n = nonce || Math.random().toString(36).substring(2);
    
    // Calculate content hash - empty string if no body
    const contentHash = body ? CryptoJS.SHA256(JSON.stringify(body)).toString().toLowerCase() : '';

    // Handle the full URL path including query parameters
    let fullUrl = path;
    if (path === '/token') {
      fullUrl = '/token?grant_type=1';
    }

    // Headers to sign (empty in our case)
    const headers = '';

    // Construct the string to sign according to Tuya docs
    const stringToSign = method.toUpperCase() + '\n' +
                        contentHash + '\n' +
                        headers + '\n' +
                        fullUrl;

    // For token endpoint, we need to sign differently
    const signStr = this.accessId + t + n + stringToSign;
    
    // Calculate signature using HMAC-SHA256
    const sign = CryptoJS.HmacSHA256(signStr, this.accessSecret).toString().toLowerCase();
    
    // Debug logging
    console.log('Signature calculation:', {
      method: method.toUpperCase(),
      contentHash,
      headers,
      fullUrl,
      stringToSign,
      signStr: this.accessId + t + n + stringToSign,
      sign
    });
    
    return sign;
  }

  private async getAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      const timestamp = Date.now().toString();
      const nonce = Math.random().toString(36).substring(2);
      const signature = this.getSignature('/token', 'GET', undefined, timestamp, nonce);

      const headers = {
        'client_id': this.accessId,
        'sign': signature,
        't': timestamp,
        'sign_method': 'HMAC-SHA256',
        'nonce': nonce,
        'Content-Type': 'application/json'
      };

      const url = `${this.apiEndpoint}/v1.0/token?grant_type=1`;
      console.log('Token request:', {
        url,
        headers,
        timestamp,
        nonce,
        accessId: this.accessId,
        accessSecret: this.accessSecret.substring(0, 4) + '...'
      });

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      const data = await response.json();
      console.log('Token response:', data);

      if (!response.ok || !data.success) {
        throw new Error(`Failed to get access token: ${JSON.stringify(data)}`);
      }

      this.accessToken = data.result.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  private async makeRequest(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any) {
    // Remove /v1.0 prefix if present for signature calculation
    const signPath = path.startsWith('/v1.0/') ? path.substring(5) : path;
    
    const timestamp = Date.now().toString();
    const nonce = Math.random().toString(36).substring(2);
    const signature = this.getSignature(signPath, method, body, timestamp, nonce);

    // Get access token first (will throw if token can't be obtained)
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      throw new Error('Failed to get access token');
    }

    const headers = {
      'client_id': this.accessId,
      'sign': signature,
      't': timestamp,
      'sign_method': 'HMAC-SHA256',
      'nonce': nonce,
      'Content-Type': 'application/json',
      'access_token': accessToken
    };

    // Ensure path starts with /v1.0 for the actual request
    const url = `${this.apiEndpoint}${path.startsWith('/v1.0') ? path : `/v1.0${path}`}`;
    console.log('API request:', {
      url,
      method,
      headers,
      body
    });

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (!response.ok || !responseData.success) {
        throw new Error(`API error! status: ${response.status}, message: ${JSON.stringify(responseData)}`);
      }

      return responseData;
    } catch (error) {
      console.error('Error making Tuya API request:', error);
      throw error;
    }
  }

  async listDevices() {
    try {
      const response = await this.makeRequest(
        '/devices',
        'GET'
      );
      return response.result;
    } catch (error) {
      console.error('Error listing devices:', error);
      throw error;
    }
  }

  async getCameraStream(deviceId: string) {
    try {
      const response = await this.makeRequest(
        `/devices/${deviceId}/stream/actions/allocate`,
        'POST',
        {
          type: 'rtmp',
          quality: 'HD',
        }
      );
      return response.result;
    } catch (error) {
      console.error('Error getting camera stream:', error);
      throw error;
    }
  }

  async getPTZControl(deviceId: string) {
    try {
      const response = await this.makeRequest(
        `/devices/${deviceId}/functions`,
        'GET'
      );
      return response.result;
    } catch (error) {
      console.error('Error getting PTZ control:', error);
      throw error;
    }
  }

  async controlPTZ(deviceId: string, direction: 'up' | 'down' | 'left' | 'right') {
    try {
      const response = await this.makeRequest(
        `/devices/${deviceId}/commands`,
        'POST',
        {
          code: `move_${direction}`,
          value: true,
        }
      );
      return response.result;
    } catch (error) {
      console.error('Error controlling PTZ:', error);
      throw error;
    }
  }
}

export const tuyaService = new TuyaService();

// Test the connection immediately
tuyaService.listDevices()
  .then(devices => {
    console.log('Successfully connected to Tuya! Found devices:', devices);
  })
  .catch(error => {
    console.error('Failed to connect to Tuya:', error);
  }); 