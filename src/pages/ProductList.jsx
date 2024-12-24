import React, { useState, useEffect } from "react"; 
import { Box, Text, Heading, Spinner, Grid, GridItem, Link } from "@chakra-ui/react"; 
import { Link as RouterLink, useLocation } from "react-router-dom"; // Link와 useLocation import
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL의 쿼리 파라미터를 가져오기
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // 쿼리 파라미터 파싱
  const categoryId = queryParams.get("categoryId"); // categoryId 파라미터 가져오기

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) {
        setError("카테고리 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        // 카테고리 ID를 포함한 URL로 상품 데이터 요청
        const response = await axios.get(`http://localhost:8080/api/products/category/${categoryId}`);
        
        // 응답 데이터 로깅
        console.log('Fetched products:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data); // 상품 목록 업데이트
        } else {
          setProducts([]); // 상품 목록이 비었을 때
          setError("상품 데이터를 가져올 수 없습니다.");
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('상품을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);  // categoryId가 변경될 때마다 상품 목록을 다시 가져옴

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
        {categoryId ? `카테고리 ID: ${categoryId}의 상품 목록` : '카테고리 선택되지 않음'}
      </Heading>
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        {products.map((product) => (
          <GridItem key={product.productId}>
            {/* 상품 클릭 시 ProductDetail 페이지로 이동 */}
            <Link as={RouterLink} to={`/product/${product.productId}`} style={{ textDecoration: "none" }}>
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
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;

