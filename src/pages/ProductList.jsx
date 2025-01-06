import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Box, Stack, Text, Heading, Spinner, Highlight, Card, Image, Button, HStack } from "@chakra-ui/react";
import useSearchStore from "@/store/SearchStore";
import { getCategoryAPI } from "@/services/CategoryAPI";
import { fetchProductsByCategory } from "@/services/ProductAPI"; // 카테고리별 상품을 가져오는 함수
import { fetchProducts } from "@/services/ProductAPI"; // 검색어로 상품을 가져오는 함수
import { modifyOrderItem } from "@/services/OrderItemAPI";
import {
  PaginationRoot,
  PaginationPrevTrigger,
  PaginationItems,
  PaginationNextTrigger,
} from "@/components/ui/pagination";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const navigate = useNavigate();

  const searchTerm = useSearchStore(state => state.search); // Search store에서 검색어 가져오기
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("categoryId");
  const searchQuery = queryParams.get("search");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(9);
  const abortControllerRef = useRef(null);

  // 페이지 이동시 스크롤 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 카테고리 이름 로드 함수
  const loadCategoryName = async (categoryId) => {
    try {
      const categoryData = await getCategoryAPI(categoryId);  // 카테고리 API 호출
      setCategoryName(categoryData.categoryName);
    } catch (error) {
      setError("카테고리 정보를 가져오는 데 실패했습니다.");
    }
  };

  // 카테고리별 상품 로드 함수
  const loadProductsByCategory = async (categoryId, currentPage, currentPageSize) => {
    try {
      const data = await fetchProductsByCategory(categoryId, currentPage, currentPageSize);
      setProducts(data.dtoList);
      setFilteredProducts(data.dtoList);
      setTotalPages(data.total);
    } catch (error) {
      setError("카테고리 상품을 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 검색어로 상품 로드 함수
  const loadProductsBySearch = async (searchTerm, currentPage, currentPageSize) => {
    try {
      const data = await fetchProducts(currentPage, currentPageSize, searchTerm, "");
      setProducts(data.dtoList);
      setFilteredProducts(data.dtoList);
      setTotalPages(data.total);
    } catch (error) {
      setError("검색 결과를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 상품 로딩 함수
  useEffect(() => {
    setLoading(true); // 로딩 시작
    if (categoryId) {
      // 카테고리 ID가 있을 경우 카테고리 이름을 로드
      loadCategoryName(categoryId);
      loadProductsByCategory(categoryId, page, pageSize);
    } else if (searchQuery) {
      // 검색어가 있을 경우 검색 결과 로드
      loadProductsBySearch(searchTerm, page, pageSize);
    } else {
      // 검색어와 카테고리 둘 다 없으면 전체 상품 로드 (기본값)
      loadProductsBySearch('', page, pageSize);
    }
  }, [page, searchTerm, categoryId]);

  // categoryId 또는 searchQuery가 변경될 때 페이지를 1로 리셋
  useEffect(() => {
    setPage(1);
  }, [categoryId, searchQuery]);

  const handlePageChange = (newPage) => {
    const safePage = Math.max(1, Math.min(newPage, totalPages));
    setPage(safePage);
  };
  //buy now 
  const handleBuyNow = (product) => {
    console.log("handleBuyNow called with product:", product);
    try {
      const orderItem = {
        orderItemDetails: [{
          productId: product.productId,
          productName: product.productName,
          productAmount: product.productAmount,
          thumbnailPath: product.thumbnailPath,
          quantity: 1,
        }]
      };
      console.log("Navigating to checkout with orderItem:", orderItem);
      // 체크아웃 페이지로 이동
      navigate('/checkout', { state: { orderData: orderItem.orderItemDetails } });
    } catch (error) {
      console.error("Error processing buy now:", error);
      // 에러 처리 로직
    }
  };
  const handleAddToCart = async (productId) => {
    try {
      const isLoggedIn = localStorage.getItem("access") !== null;

      if (isLoggedIn) {
        await modifyOrderItem(productId, 1);
      } else {
        const product = products.find(p => p.productId === productId);
        if (!product) {
          alert("상품 정보를 찾을 수 없습니다.");
          return;
        }

        const guestOrderItem = JSON.parse(localStorage.getItem('guestOrderItem')) || { orderItemDetails: [] };
        const existingItem = guestOrderItem.orderItemDetails.find(item => item.productId === productId);
        const currentQuantity = existingItem ? existingItem.quantity : 0;

        if (currentQuantity + 1 > product.productCount) {
          alert("재고 수량을 초과하여 상품을 추가할 수 없습니다.");
          return;
        }

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          guestOrderItem.orderItemDetails.push({
            productId: product.productId,
            productName: product.productName,
            productAmount: product.productAmount,
            thumbnailPath: product.thumbnailPath,
            quantity: 1,
          });
        }

        localStorage.setItem('guestOrderItem', JSON.stringify(guestOrderItem));
      }

      alert("상품이 장바구니에 추가되었습니다!");
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
        <Highlight query={[categoryName, searchTerm]} styles={{ color: "#5526cc", fontSize: 23 }}>
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
                    src={`${product.thumbnailPath}`}
                    alt={product.productName}
                    style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                    bgColor="gray.100"
                  />
                  <Card.Body gap="2">
                    <Card.Title>{product.productName}</Card.Title>
                    <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
                      &#8361; {new Intl.NumberFormat('ko-KR').format(product.productAmount)}
                    </Text>
                  </Card.Body>
                </Link>
                <Card.Footer gap="2">
                  <Button variant="solid"onClick={() => handleBuyNow(product)}>Buy now</Button>
                  <Button variant="ghost" onClick={() => handleAddToCart(product.productId)}>
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
      <Stack gap="4" alignItems="center" mt="3" mb="3">
        <PaginationRoot
          page={page}
          count={totalPages}
          pageSize={pageSize}
          onPageChange={(e) => handlePageChange(e.page)}
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Stack>
    </Box>
  );
};

export default ProductList;
