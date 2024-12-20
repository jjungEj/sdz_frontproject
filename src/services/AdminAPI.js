const BASE_URL = "http://localhost:8080/api/admin";

const createUrl = (endpoint) => `${BASE_URL}${endpoint}`;

export const getUserList = (page, size, type, keyword) => {
  const params = new URLSearchParams({ page, size, type, keyword }).toString();
  return fetch(createUrl(`/user-management?${params}`), {
    method: "GET",
    headers: { "Content-Type": "application/json", },
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
  return fetch(createUrl(`/${email}/login-lock`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", },
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
  return fetch(createUrl(`/${email}/auth`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", },
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
  return fetch(createUrl(`/${email}`), {
    method: "DELETE",
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
  return fetch(createUrl(`/users`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
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