const BASE_URL = "http://localhost:8080/api/check";

const createUrl = (endpoint) => `${BASE_URL}${endpoint}`;

export const checkEmailExists = (email) => {
  const payload = { email };
  return fetch(createUrl("/email"), {
    method: "POST",
    headers: { "Content-Type": "application/json", },
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

export const checkNickname = (nickname) => {
  const payload = { nickname };
  return fetch(createUrl("/nickname"), {
    method: "POST",
    headers: { "Content-Type": "application/json", },
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

export const checkAccountLimit = (userName, contact) => {
  const payload = { userName, contact };
  return fetch(createUrl("/userLimit"), {
    method: "POST",
    headers: { "Content-Type": "application/json", },
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

export const validateEmailExists = (userName, email) => {
  const payload = { userName, email };
  return fetch(createUrl("/userInfo"), {
    method: "POST",
    headers: { "Content-Type": "application/json", },
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

export const checkPassword = (email, userPassword) => {
  const payload = { email, userPassword };
  return fetch(createUrl("/password"), {
    method: "POST",
    headers: { "Content-Type": "application/json", },
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
