const url = 'http://localhost:8080/api/deliveryAddress';

export const getDeliveryAddressList = async (page, size) => {
  try {
    const response = await fetch(`${url}/list?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};


export const AddressInfo = async (deliveryAddressId) => {
  try {
    const response = await fetch(`${url}/${deliveryAddressId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createNewAddress = async (newAddress) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },
      body: JSON.stringify(newAddress),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    throw error;
  }
};

export const updateAddress = async ( address ) => {
  try {
    const response = await fetch(`${url}/${address.deliveryAddressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },
      body: JSON.stringify(address),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    throw error;
  }
};

export const updateDefaultAddress = async (deliveryAddressId) => {
  try {
    const response = await fetch(`${url}/${deliveryAddressId}/default`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    throw error;
  }
};

export const deleteAddress = async (deliveryAddressId) => {
  try {
    const response = await fetch(`${url}/${deliveryAddressId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    throw error;
  }
};
