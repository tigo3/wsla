
/**
 * API Service for making requests to the backend
 */

const API_URL = 'http://localhost:5000/api';

export const testApiConnection = async (): Promise<{ message: string, timestamp: string }> => {
  try {
    const response = await fetch(`${API_URL}/test`);
    if (!response.ok) {
      throw new Error('API connection failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error testing API connection:', error);
    throw error;
  }
};
