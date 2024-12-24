const url = 'http://localhost:8080/api/admin/';

export const getUserList = (page, size, type, keyword) => {
  return fetch(`${url}user-management?page=${page}&size=${size}&type=${type}&keyword=${keyword}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', },
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

export const updateLoginLock = (email) => {
  return fetch(`${url}${email}/login-lock`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.message);
        });
      }
    })
    .catch((error) => {
      throw error;
    });
};

export const updateAuth = (email) => {
  return fetch(`${url}${email}/auth`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.message);
        });
      }
    })
    .catch((error) => {
      throw error;
    });
};

export const deleteUser = (email) => {
  return fetch(`${url}${email}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.message);
        });
      }
    })
    .catch((error) => {
      throw error;
    });
};

export const deleteUsers = (emails) => {
  return fetch(`${url}users`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emails),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.message);
        });
      }
    })
    .catch((error) => {
      throw error;
    });
};