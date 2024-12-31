const apiUrl = import.meta.env.VITE_API_URL;
const endpoint = "/account";

const url = `${apiUrl}${endpoint}`;

const fetchAccountData = async (endpoint, account, actionName) => {
  try {
    const response = await fetch(`${url}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(account),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return response.json();
  } catch (error) {
    console.error(`${actionName}에 실패하였습니다.:`, error.message);
    throw error;
  }
};

export const findId = async (account) => {
  return fetchAccountData('find-id', account, '아이디 찾기');
};

export const findPw = async (account) => {
  return fetchAccountData('find-pw', account, '비밀번호 찾기');
};