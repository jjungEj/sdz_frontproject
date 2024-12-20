const url = "http://localhost:8080/api/user/";

export const signUpProcess = (email, password, userName, nickname, contact) => {
  const payload = {
    email: email,
    userPassword: password,
    userName: userName,
    nickname: nickname,
    contact: contact
  };
  return fetch(`${url}sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
}

export const UserInfo = () => {
    return fetch(`${url}my-page`)
    .then(response => {
        return response.json();
    });
}

export const updateLocal = (email, password, userName, nickname, contact) => {
  const payload = {
    email: email,
    userPassword: password,
    userName: userName,
    nickname: nickname,
    contact: contact
  };
  return fetch(`${url}local/${email}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
      },
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
}

export const updateSocail = (email, userName, nickname, contact) => {
  const payload = {
    email: email,
    userName: userName,
    nickname: nickname,
    contact: contact
  };
  return fetch(`${url}social/${email}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
      },
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
}

export const deleteUser = (email) => {
    return fetch(`${url}/${email}`, {
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
}