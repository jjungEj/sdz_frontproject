const BASE_URL = "http://localhost:8080/api/account";

const createUrl = (endpoint) => `${BASE_URL}${endpoint}`;

export const findId = (userName, contact) => {
  const payload = { userName, contact };
  return fetch(createUrl("/find-id"), {
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

export const findPw = (userName, email) => {
  const payload = { userName, email };
  return fetch(createUrl("/find-pw"), {
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
