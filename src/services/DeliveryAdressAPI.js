const url = 'http://localhost:8080/api/deliveryAddress';

export const getDeliveryAddressList = (page, size) => {
  return fetch(`${url}/list?page=${page}&size=${size}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
    },
  }).then((response) => {
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

export const AddressInfo = (deliveryAddressId) => {
    return fetch(`${url}/${deliveryAddressId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
    }).then(response => {
        return response.json();
    });
}

export const createNewAddress = ( newAddress ) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
    },
    body: JSON.stringify(newAddress),
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

export const updateAddress = ( address ) => {
  return fetch(`${url}/${address.deliveryAddressId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
    },
    body: JSON.stringify(address),
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

export const updateDefaultAddress = (deliveryAddressId) => {
  return fetch(`${url}/${deliveryAddressId}/default`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
    },
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

export const deleteAddress = (deliveryAddressId) => {
  return fetch(`${url}/${deliveryAddressId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
    },
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
