const url = 'http://localhost:8080/api/check';

export const checkEmailExists = (email) => {
  const payload = { 
    email
  };
  return fetch(`${url}/email`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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

export const checkNickname = (userData) => {
  return fetch(`${url}/nickname`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
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

export const checkAccountLimit = (userName, contact) => {
  const payload = { 
    userName,
    contact
  };
  return fetch(`${url}/userLimit`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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

export const validateEmailExists = (account) => {
  return fetch(`${url}/userInfo`, {
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

export const checkPassword = (email, userPassword) => {
  const payload = { 
    email, 
    userPassword 
  };
  return fetch(`${url}/password`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(payload),
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
