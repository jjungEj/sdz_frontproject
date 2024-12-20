export const loginProcess = (email, password, rememberId, rememberMe) => {
  const url = 'http://localhost:8080/api/user/loginProcess';
  const payload = { email, password, rememberId, rememberMe };
      return fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify(payload),
          credentials: 'include'
      })
      .then(response => {
          if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            });
          }
          return response.json().then((data) => {
          const accessToken = response.headers.get('Authorization');
          if (accessToken && accessToken.startsWith('Bearer ')) {
              localStorage.setItem('access', accessToken.split(' ')[1]);
          }
          return data;
        });
      })
      .catch(error => {
        setErrorMessage(error.message);
        throw error;
      });
}