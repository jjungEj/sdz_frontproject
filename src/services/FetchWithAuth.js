import { isAccessTokenValid } from '@/services/TokenUtil'

export const fetchWithAuth = async(url, options = {}) => {
    const token = localStorage.getItem('access');
    if (!isAccessTokenValid(token)) {
        throw new Error('토큰이 유효하지 않습니다. 로그인이 필요합니다.');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
      }

      return await response.json();
  } catch (error) {
      console.error('API 요청에 실패하였습니다.:', error);
      throw error;
  }
};