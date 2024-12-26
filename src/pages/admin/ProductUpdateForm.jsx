import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Heading, Grid, GridItem, Input, Button, Textarea } from "@chakra-ui/react";
import { getCategoriesAPI } from "../../services/CategoryAPI"; // 카테고리 가져오기

const ProductUpdateForm = () => {
  const { productId } = useParams(); // URL 파라미터에서 상품 ID 받기
  const [productName, setProductName] = useState("");
  const [productAmount, setProductAmount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [productContent, setProductContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // 카테고리 ID
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 상품 정보와 카테고리 목록을 비동기적으로 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const product = await response.json();
        setProductName(product.productName);
        setProductAmount(product.productAmount);
        setProductCount(product.productCount);
        setProductContent(product.productContent);

        if (product.categoryId) {
          setSelectedCategory(product.categoryId); // 카테고리 ID 설정
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        alert("Failed to load product details. Please try again.");
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategoriesAPI();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        alert("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
    fetchProduct();
  }, [productId]);

  // 상품 수정 처리
  const handleSubmit = async () => {
    if (loading) return; // 중복 요청 방지
    setLoading(true);

    const formData = {
      productName,
      productAmount,
      productCount,
      productContent,
      userId: "admin@example.com",
      categoryId: selectedCategory,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Product successfully updated.");
      navigate(`/admin/products`); // 수정 후 관리자 상품 페이지로 이동
    } catch (error) {
      console.error("Product update failed:", error);
      alert("An error occurred while updating the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 등록 취소 처리
  const handleCancel = () => {
    setProductName("");
    setProductAmount(0);
    setProductCount(0);
    setProductContent("");
    setSelectedCategory("");
  };

  return (
    <Box>
      <Heading as="h1" size="xl" mb={3}>
        상품 수정
      </Heading>
      <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
      <Box>
        <Grid templateRows="repeat(4, 1fr)" templateColumns="repeat(6, 1fr)">
          {/* 상품명 */}
          <GridItem
            colSpan={1}
            border="1px solid black"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <label htmlFor="productName">상품명</label>
          </GridItem>
          <GridItem colSpan={5} border="1px solid black">
            <Input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </GridItem>

          {/* 상품 가격 */}
          <GridItem
            colSpan={1}
            border="1px solid black"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <label htmlFor="productAmount">상품 가격</label>
          </GridItem>
          <GridItem colSpan={5} border="1px solid black">
            <Input
              id="productAmount"
              type="number"
              value={productAmount}
              onChange={(e) => setProductAmount(Number(e.target.value))}
              required
              min="0"
            />
          </GridItem>

          {/* 상품 수량 */}
          <GridItem
            colSpan={1}
            border="1px solid black"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <label htmlFor="productCount">상품 수량</label>
          </GridItem>
          <GridItem colSpan={5} border="1px solid black">
            <Input
              id="productCount"
              type="number"
              value={productCount}
              onChange={(e) => setProductCount(Number(e.target.value))}
              required
              min="0"
            />
          </GridItem>

          {/* 카테고리 */}
          <GridItem
            colSpan={1}
            border="1px solid black"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <label htmlFor="category">카테고리</label>
          </GridItem>
          <GridItem colSpan={5} border="1px solid black">
            <select
              id="category"
              value={selectedCategory || ""} // 빈 문자열로 초기화하여 warning 방지
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                선택하세요
              </option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </GridItem>

          {/* 상품 설명 */}
          <GridItem
            colSpan={1}
            border="1px solid black"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <label htmlFor="productContent">상품 설명</label>
          </GridItem>
          <GridItem colSpan={5} border="1px solid black">
            <Textarea
              id="productContent"
              value={productContent}
              onChange={(e) => setProductContent(e.target.value)}
              required
            />
          </GridItem>
        </Grid>

        {/* 버튼 */}
        <Box display="flex" justifyContent="flex-end" marginTop="10px">
          <Button
            onClick={handleSubmit}
            colorScheme="blue"
            isLoading={loading}
            loadingText={loading ? "수정 중..." : "수정 완료"}
          >
            수정
          </Button>
          <Button
            onClick={handleCancel}
            style={{
              display: "inline",
              width: "100px",
              margin: "10px",
              color: "white",
              backgroundColor: "#dc3545",
            }}
          >
            취소
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductUpdateForm;

