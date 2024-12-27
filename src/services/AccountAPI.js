const url = 'http://localhost:8080/api/account';

export const findId = (account) => {
  return fetch(`${url}/find-id`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(account),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.message);
        });
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const findPw = (account) => {
  return fetch(`${url}/find-pw`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(account),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.message);
        });
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};
