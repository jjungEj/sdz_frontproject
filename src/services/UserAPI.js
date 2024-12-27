const url = 'http://localhost:8080/api/user';

export const signUpProcess = (newAccount) => {
  return fetch(`${url}/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAccount),
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
    return fetch(`${url}/my-page`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
    }).then(response => {
        return response.json();
    });
}

export const updateLocal = (userData) => {
  return fetch(`${url}/local/${userData.email}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
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

export const updateSocial = (userData) => {
  return fetch(`${url}/social/${userData.email}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
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
        method: 'DELETE',
        credentials: 'include',
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
    })
    .finally(() => {
      localStorage.removeItem('access');
    });
}