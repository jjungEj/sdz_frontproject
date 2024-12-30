export const loginProcess = (LoginAcount) => {
  const url = 'http://localhost:8080/api/user/loginProcess';
  return fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(LoginAcount),
      credentials: 'include'
  })
    .then(response => {
      const authorizationHeader = response.headers.get('Authorization');
      if (authorizationHeader) {
        const token = authorizationHeader.split(' ')[1];
        localStorage.setItem('access', token);
      }
      if (!response.ok) {
        return response.json().then(errorData => {
            throw new Error(errorData.message);
        });
      }
    })
    .catch(error => {
      setErrorMessage(error.message);
      throw error;
    });
}