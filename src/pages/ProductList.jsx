import React, { useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom'; // Link 추가
import { Box, Text, Heading, Spinner, Grid, GridItem, Highlight } from "@chakra-ui/react";

import useSearchStore from "@/store/SearchStore";
import { getCategoryAPI } from "@/services/CategoryAPI";
import { fetchProductsByCategory, fetchAllProducts } from "@/services/ProductAPI";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState(null);

  const searchTerm = useSearchStore(state => state.search);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("categoryId");
  const searchQuery = queryParams.get("search");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = categoryId
          ? await fetchProductsByCategory(categoryId)
          : await fetchAllProducts();

        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('상품을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  useEffect(() => {
    const filterProducts = () => {
      let filtered = products;

      if (searchQuery) {
        filtered = filtered.filter(product =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [products, searchQuery]);

  useEffect(() => {
    const fetchCategoryName = async () => {
      if (categoryId) {
        try {
          const data = await getCategoryAPI(categoryId);
          setCategoryName(data.categoryName);
        } catch (error) {
          setError("카테고리 정보를 가져올 수 없습니다.");
        }
      }
    };
    fetchCategoryName();
  }, [categoryId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        <Highlight query={[categoryName, searchTerm]} styles={{ color: "teal.600", fontSize: 23 }}>
          {categoryId ? `${categoryName} 상품 목록` : searchTerm ? `"${searchTerm}" 검색 결과` : "전체 상품 목록"}
        </Highlight>
      </Heading>
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <GridItem key={product.productId}>
              <Link to={`/product/${product.productId}`}> {/* Link를 사용하여 상세 페이지로 이동 */}
                <Box borderWidth="1px" borderRadius="md" p={4} boxShadow="md">
                  <Heading as="h3" size="md" mb={2}>
                    {product.productName}
                  </Heading>
                  <Text>가격: {product.productAmount} 원</Text>
                  <Text>재고: {product.productCount} 개</Text>
                  <Text mt={2}>{product.productContent}</Text>
                </Box>
              </Link>
            </GridItem>
          ))
        ) : (
          <Text>상품이 없습니다.</Text>
        )}
      </Grid>
    </Box>
  );
};

export default ProductList;
