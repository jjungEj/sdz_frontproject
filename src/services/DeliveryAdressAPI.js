const BASE_URL = "http://localhost:8080/api/deliveryAddress";

const createUrl = (endpoint) => `${BASE_URL}${endpoint}`;

export const getDeliveryAddressList = (page, size) => {
  const params = new URLSearchParams({ page, size }).toString();
  return fetch(createUrl(`/list?${params}`), {
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

export const createNewAddress = ( deliveryAddressId, email, deliveryAddress1, deliveryAddress2, deliveryAddress3, receiverName, receiverContact, deliveryRequest, defaultCheck ) => {
  const payload = { deliveryAddressId, email, deliveryAddress1, deliveryAddress2, deliveryAddress3, receiverName, receiverContact, deliveryRequest, defaultCheck };
  return fetch(createUrl(""), {
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
    })
    .catch((error) => {
      throw error;
    });
};

export const updateAddress = ( deliveryAddressId, email, deliveryAddress1, deliveryAddress2, deliveryAddress3, receiverName, receiverContact, deliveryRequest, defaultCheck ) => {
  const payload = { deliveryAddressId, email, deliveryAddress1, deliveryAddress2, deliveryAddress3, receiverName, receiverContact, deliveryRequest, defaultCheck };
  return fetch(createUrl(`/${deliveryAddressId}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify(payload),
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

export const updateDefaultAddress = (deliveryAddressId, email, defaultCheck) => {
  const payload = { deliveryAddressId, email, defaultCheck };
  return fetch(createUrl(`/${deliveryAddressId}/default`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify(payload),
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
  return fetch(createUrl(`/${deliveryAddressId}`), {
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
