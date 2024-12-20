const BASE_URL = "http://localhost:8080/api/user";

const createUrl = (path = "") => `${BASE_URL}${path}`;

export const signUpProcess = (email, password, userName, nickname, contact) => {
  const payload = { email, userPassword: password, userName, nickname, contact };
  return fetch(createUrl("/sign-up"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message);
        });
      }
      return response.json();
    })
    .catch(error => {
      throw error;
    });
};

export const UserInfo = () => {
  return fetch(createUrl("/my-page"))
    .then(response => response.json());
};

export const updateLocal = (email, password, userName, nickname, contact) => {
  const payload = { email, userPassword: password, userName, nickname, contact };
  return fetch(createUrl(`/local/${email}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message);
        });
      }
      return response.json();
    })
    .catch(error => {
      throw error;
    });
};

export const updateSocial = (email, userName, nickname, contact) => {
  const payload = { email, userName, nickname, contact };
  return fetch(createUrl(`/social/${email}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message);
        });
      }
      return response.json();
    })
    .catch(error => {
      throw error;
    });
};

export const deleteUser = (email) => {
  return fetch(createUrl(`/${email}`), {
    method: "DELETE",
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message);
        });
      }
    })
    .catch(error => {
      throw error;
    });
};
