// ProductAPI.js
const apiUrl = import.meta.env.VITE_API_URL;
const endpoint = "/products";

const url = `${apiUrl}${endpoint}`;

export const fetchProductsByCategory = async (categoryId, page , size) => {
  const response = await fetch(`${url}/category/${categoryId}?page=${page}&size=${size}`);
  if (!response.ok) {
    throw new Error("상품 데이터를 가져오는 데 실패했습니다.");
  }
  return response.json();
};


export const fetchProducts = async (page, pageSize, keyword = "") => {
  try {
      const response = await fetch(
          `${url}?page=${page}&size=${pageSize}&keyword=${encodeURIComponent(keyword)}`,
          { method: "GET" }
      );

      if (!response.ok) {
          throw new Error("상품 목록을 불러오는 데 오류가 발생했습니다.");
      }

      return await response.json();
  } catch (error) {
      console.error(error);
      throw new Error("상품 목록을 불러오는 데 오류가 발생했습니다.");
  }
};




export const deleteProduct = async (productId) => {
    try {
        const response = await fetch(`${url}/${productId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("상품 삭제에 실패했습니다.");
        }
    } catch (error) {
        throw new Error("상품 삭제에 실패했습니다.");
    }
};

export const deleteSelectedProducts = async (productIds) => {
    try {
        for (const productId of productIds) {
            const response = await fetch(`${url}/${productId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("선택된 상품 삭제에 실패했습니다.");
            }
        }
    } catch (error) {
        throw new Error("선택된 상품 삭제에 실패했습니다.");
    }
};

export const fetchProductAPI = async (productId) => {
    try {
      const response = await fetch(`${url}/${productId}`);
  
      if (!response.ok) {
        throw new Error("상품 데이터를 가져오는 데 실패했습니다.");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in fetchProductAPI:", error);
      throw error;
    }
  };
  
  // services/ProductAPI.js
export const createProductAPI = async (formData) => {
    const response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  };

  export const getProductByIdAPI = async (productId) => {
    const response = await fetch(`${url}/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product with ID: ${productId}`);
    }
    return response.json();
  };
  
  export const updateProductAPI = async (productId, formData) => {
    const response = await fetch(`${url}/${productId}`, {
      method: "PUT",
      headers: {
        
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    return response.json();
  };

