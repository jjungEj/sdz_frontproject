import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Text, Heading, Spinner } from "@chakra-ui/react";
import axios from "axios";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setError("유효하지 않은 상품 ID입니다.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("상품 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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
        상품 상세 정보
      </Heading>
      <Text fontWeight="bold">상품 ID: {product.productId}</Text>
      <Text fontWeight="bold">상품명: {product.productName}</Text>
      <Text>가격: {product.productAmount} 원</Text>
      <Text>재고: {product.productCount} 개</Text>
      <Text mt={4}>{product.productContent}</Text>
    </Box>
  );
};

export default ProductDetail;
