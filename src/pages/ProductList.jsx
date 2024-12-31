import React, { useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom'; // Link 추가
import { Box, Text, Heading, Spinner, Grid, GridItem, Highlight, Card, Image, Button, HStack } from "@chakra-ui/react";

import useSearchStore from "@/store/SearchStore";
import { getCategoryAPI } from "@/services/CategoryAPI";
import { fetchProductsByCategory, fetchProducts } from "@/services/ProductAPI";
import { modifyOrderItem } from "@/services/OrderItemAPI"; // 장바구니 API 추가

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
    const fetchAllProducts = async () => {
      try {
        const data = categoryId
          ? await fetchProductsByCategory(categoryId)
          : await fetchProducts();

        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('상품을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
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

  // 장바구니에 상품 추가
  const handleAddToCart = (productId) => {
    try {
      const quantity = 1; // 추가하려는 수량

      // 상품 데이터 가져오기
      const product = products.find(p => p.productId === productId);
      if (!product) {
        alert("상품 정보를 찾을 수 없습니다.");
        return;
      }

      // 재고 확인
      if (product.productCount <= 0) {
        alert("해당 상품은 재고가 없습니다.");
        return;
      }

      // 로컬스토리지에서 현재 장바구니 가져오기
      const guestOrderItem = JSON.parse(localStorage.getItem('guestOrderItem')) || { orderItemDetails: [] };
      const existingItem = guestOrderItem.orderItemDetails.find(item => item.productId === productId);
      const currentQuantity = existingItem ? existingItem.quantity : 0;

      // 재고 초과 확인
      if (currentQuantity + quantity > product.productCount) {
        alert("재고 수량을 초과하여 상품을 추가할 수 없습니다.");
        return;
      }

      // 장바구니 업데이트
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        guestOrderItem.orderItemDetails.push({
          productId: product.productId,
          productName: product.productName,
          productAmount: product.productAmount,
          thumbnailPath: product.thumbnailPath,
          quantity: quantity,
        });
      }

      localStorage.setItem('guestOrderItem', JSON.stringify(guestOrderItem));
      alert("장바구니에 상품이 추가되었습니다!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("장바구니에 상품을 추가하는 데 실패했습니다.");
    }
  };



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
      <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={6} />
      <HStack wrap="wrap" justify="flex-start" margin="5" ml="20">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Box key={product.productId} width="calc(33.33% - 20px)" mb="5">
              <Card.Root borderRadius="2xl" maxW="300px" overflow="hidden" cursor="pointer">
                <Link to={`/product/${product.productId}`}>
                  <Image
                    src={`http://localhost:8080${product.thumbnailPath}`}
                    alt={product.productName}
                    style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                    bgColor="gray.100"
                  />
                  <Card.Body gap="2">
                    <Card.Title>{product.productName}</Card.Title>
                    <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
                      &#8361;{product.productAmount}
                    </Text>
                  </Card.Body>
                </Link>
                <Card.Footer gap="2">
                  <Button variant="solid">Buy now</Button>
                  <Button
                      variant="ghost"
                      onClick={() => handleAddToCart(product.productId)} // 장바구니 추가 버튼 동작
                  >
                    Add to cart
                  </Button>
                </Card.Footer>
              </Card.Root>
            </Box>
          ))
        ) : (
          <Text>상품이 없습니다.</Text>
        )}
      </HStack>
    </Box>
    //   <Grid templateColumns="repeat(5, 1fr)" gap={6}>
    //     {filteredProducts.length > 0 ? (
    //       filteredProducts.map((product) => (
    //         <GridItem key={product.productId}>
    //           <Link to={`/product/${product.productId}`}> {/* Link를 사용하여 상세 페이지로 이동 */}
    //             <Box borderWidth="1px" borderRadius="md" p={4} boxShadow="md">
    //               <Heading as="h3" size="md" mb={2}>
    //                 {product.productName}
    //               </Heading>
    //               <Text>가격: {product.productAmount} 원</Text>
    //               <Text>재고: {product.productCount} 개</Text>
    //               <Text mt={2}>{product.productContent}</Text>
    //             </Box>
    //           </Link>
    //         </GridItem>
    //       ))
    //     ) : (
    //       <Text>상품이 없습니다.</Text>
    //     )}
    //   </Grid>
    // </Box>
  );
};

export default ProductList;
