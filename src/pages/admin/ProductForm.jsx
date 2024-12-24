import React, { useState, useEffect } from "react";
import { getCategoriesAPI } from "../../services/CategoryAPI";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Grid, GridItem, Input, Button, Textarea, Text } from '@chakra-ui/react';

const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [productAmount, setProductAmount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [productContent, setProductContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]); // 추가: 첨부파일 관리
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesAPI();
        setCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        alert("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  // 파일 변경 핸들러 (추가)
  const handleFileChange = (e) => {
    setImages([...e.target.files]); // 여러 파일 선택 가능
  };

  const handleSubmit = async () => {
    if (loading) return; // Disable further submissions if already loading
    setLoading(true);

    const formData = new FormData(); // 추가: FormData 객체 생성

    // JSON 데이터를 FormData에 추가
    formData.append(
        "productDTO",
        JSON.stringify({
          productName,
          productAmount,
          productCount,
          productContent,
          userId: "admin@example.com",
          categoryId: selectedCategory,
        })
    );

    // 첨부된 파일 추가 (추가)
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        body: formData, // FormData를 전송
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Product successfully created.");
      navigate("/");
    } catch (error) {
      console.error("Product creation failed:", error);
      alert("An error occurred while creating the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Clear the form data
    setProductName("");
    setProductAmount(0);
    setProductCount(0);
    setProductContent("");
    setSelectedCategory("");
    setImages([]); // 추가: 파일 입력 초기화
  };

  return (
      <Box>
        <Heading as="h1" size="xl" mb={3}>상품 등록</Heading>
        <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        <Box>
          <Grid
              h="300px"
              templateRows="repeat(5, 1fr)"
              templateColumns="repeat(6, 1fr)"
          >

            {/* 1번째 줄 */}
            <GridItem
                colSpan={1}
                border="1px solid black"
                display="flex"
                alignItems="center"
                justifyContent="center">
              <label htmlFor="productName">상품명</label>
            </GridItem>
            <GridItem colSpan={2} border="1px solid black">
              <Input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  width="97%"
                  border="1px solid #ccc"
                  borderRadius="2px"
                  margin="5px"
              />
            </GridItem>

            <GridItem colSpan={1} border="1px solid black"></GridItem>
            <GridItem colSpan={2} border="1px solid black"></GridItem>

            {/* 2번째 줄 */}
            <GridItem
                colSpan={1}
                border="1px solid black"
                display="flex"
                alignItems="center"
                justifyContent="center">
              <label htmlFor="productAmount">상품가격</label>
            </GridItem>
            <GridItem colSpan={2} border="1px solid black">
              <Input
                  id="productAmount"
                  type="text"
                  pattern="\d*"
                  value={productAmount}
                  onChange={(e) => setProductAmount(Number(e.target.value))}
                  required
                  min="0"
              />
            </GridItem>

            <GridItem
                colSpan={1}
                border="1px solid black"
                display="flex"
                alignItems="center"
                justifyContent="center">
              <label htmlFor="productCount">상품수량</label>
            </GridItem>

            <GridItem colSpan={2} border="1px solid black">
              <Input
                  id="productCount"
                  type="number"
                  value={productCount}
                  onChange={(e) => setProductCount(Number(e.target.value))}
                  required
                  min="0"
              />
            </GridItem>

            {/* 3번째 줄 */}
            <GridItem
                colSpan={1}
                border="1px solid black"
                display="flex"
                alignItems="center"
                justifyContent="center">
              <label htmlFor="category">카테고리</label>
            </GridItem>

            <GridItem colSpan={5} border="1px solid black">
              <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
              >
                <option value="" disabled>선택하세요</option>
                {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                ))}
              </select>
            </GridItem>

            {/* 4번째 줄 */}
            <GridItem
                colSpan={1}
                border="1px solid black"
                display="flex"
                alignItems="center"
                justifyContent="center">
              <label htmlFor="ProductImage">이미지</label>
            </GridItem>
            <GridItem colSpan={5} border="1px solid black">
              {/* 추가: 파일 입력 필드 */}
              <Input
                  id="ProductImage"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*" // 이미지 파일만 선택 가능
                  required
              />
            </GridItem>

            {/* 5번째 줄 */}
            <GridItem
                colSpan={1}
                border="1px solid black"
                display="flex"
                alignItems="center"
                justifyContent="center">
              <Text as="label" htmlFor="ProductContent">상품 소개</Text>
            </GridItem>
            <GridItem colSpan={5} border="1px solid black">
              <Textarea
                  id="productContent"
                  value={productContent}
                  onChange={(e) => setProductContent(e.target.value)}
                  required
                  rows="2"
                  margin="10px"
                  width="97%"
              />
            </GridItem>

          </Grid>

          <Box mt={4} textAlign="right">
            <Button
                onClick={handleSubmit}
                style={{
                  display: "inline",
                  width: "100px",
                  margin: "10px",
                  color: "white",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
            >
              {loading ? "Submitting..." : "상품 등록"}
            </Button>

            <Button
                onClick={handleCancel}
                style={{
                  display: "inline",
                  width: "100px",
                  height: "40px",
                  margin: "10px",
                  color: "white",
                }}
            >
              등록 취소
            </Button>
          </Box>
        </Box>
        <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
      </Box>
  );
};

export default ProductForm;
