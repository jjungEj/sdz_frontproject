// ProductAPI.js

const BASE_URL = "http://localhost:8080/api/products";


export const fetchProductsByCategory = async (categoryId) => {
  const response = await fetch(`${BASE_URL}/category/${categoryId}`);
  if (!response.ok) {
    throw new Error("상품 데이터를 가져오는 데 실패했습니다.");
  }
  return response.json();
};


export const fetchAllProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) {
    throw new Error("전체 상품 데이터를 가져오는 데 실패했습니다.");
  }
  return response.json();
};

export const fetchProducts = async () => {
    try {
        const response = await fetch(`${BASE_URL}`);
        if (!response.ok) {
            throw new Error("상품 목록을 불러오는 데 오류가 발생했습니다.");
        }
        return await response.json();
    } catch (error) {
        throw new Error("상품 목록을 불러오는 데 오류가 발생했습니다.");
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await fetch(`${BASE_URL}/${productId}`, {
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
            const response = await fetch(`${BASE_URL}/${productId}`, {
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
      const response = await fetch(`${BASE_URL}/${productId}`);
  
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
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  };

  export const getProductByIdAPI = async (productId) => {
    const response = await fetch(`${BASE_URL}/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product with ID: ${productId}`);
    }
    return response.json();
  };
  
  export const updateProductAPI = async (productId, formData) => {
    const response = await fetch(`${BASE_URL}/${productId}`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    return response.json();
  };

