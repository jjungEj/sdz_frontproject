import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Text, Heading, Spinner, Flex, Image, VStack, Button, Grid, GridItem } from "@chakra-ui/react";
import { fetchProductAPI } from "@/services/ProductAPI";

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
        const data = await fetchProductAPI(productId);
        setProduct(data);
      } catch (err) {
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
    <Box p={6}>
      <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
      {product ? (
        <Flex gap={8} alignItems="flex-start">
          {/* 상품 이미지 */}
          <Box flex="2">
            <Image
              src={product.productImage || "/placeholder-image.png"} // 이미지가 없을 경우 기본 이미지 표시
              alt={product.productName}
              borderRadius="md"
              objectFit="cover"
              width="100%"
              height="500px"
              boxShadow="lg"
            />
          </Box>

          {/* 상품 정보 */}
          <VStack flex="1" align="flex-start" spacing={4}>
            <Text fontWeight="bold" fontSize="xl">
              상품명: {product.productName}
            </Text>
            <Text fontSize="lg">상품 ID: {product.productId}</Text>
            <Text fontSize="lg" color="teal.500" fontWeight="bold">
              가격: {product.productAmount} 원
            </Text>
            <Text fontSize="lg">재고: {product.productCount} 개</Text>
            <Box>
              <Button>장바구니</Button>
              <Button ml={4}>구매하기</Button>
            </Box>
          </VStack>
        </Flex>
      ) : (
        <Text>상품 데이터를 찾을 수 없습니다.</Text>
      )}
      <Box>
        네모 박스들 둘곳
      </Box>
      <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} my={6} />

      {/* 추가 컨텐츠 영역 */}
      <Box>
        <Text>{product.productContent}</Text>
      </Box>

      <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} my={6} />
      <Box>
        <Text>특징</Text>
      </Box>
    </Box>
  );
};

export default ProductDetail;



