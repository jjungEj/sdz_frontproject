import React, { useState, useEffect } from "react";
import { getCategoriesAPI } from "../../services/CategoryAPI";
import { createProductAPI } from "../../services/ProductAPI";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Grid, GridItem, Input, Button, Textarea, Text, Flex,} from "@chakra-ui/react";

const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [productAmount, setProductAmount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [productContent, setProductContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesAPI();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        alert("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => ({
      name: file.name,
      preview: URL.createObjectURL(file),
      file,
    }));
    setImages(filePreviews);
  };

  const handleThumbnailSelect = (image) => {
    setThumbnail(thumbnail === image ? null : image);
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    const formData = new FormData();
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

    images.forEach((image) => {
      formData.append("images", image.file);
    });

    formData.append("thumbnail", thumbnail ? thumbnail.file : null);

    try {
      await createProductAPI(formData);
      alert("Product successfully created.");
      navigate("/admin/products");
    } catch (error) {
      console.error("Product creation failed:", error);
      alert("An error occurred while creating the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
      <Box display="flex" flexDirection="column" alignItems="center" w="100%">
        <Heading as="h1" size="xl" mb={3}>
          상품 등록
        </Heading>
        <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} w="100%" />
        <Flex direction="column" w="90%" maxWidth="800px">
          <Grid
              templateRows="repeat(6, auto)"
              templateColumns="repeat(6, 1fr)"
              gap={4}
              border="1px solid #ccc" // 전체 Grid에 외곽선 추가
              borderRadius="5px"
              p={4}
          >
            {/* 상품명 */}
            <GridItem
                colSpan={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid #ccc"
                padding="5px"
            >
              <label htmlFor="productName">상품명</label>
            </GridItem>
            <GridItem colSpan={5} border="1px solid #ccc" padding="5px">
              <Input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
              />
            </GridItem>

            {/* 상품가격 */}
            <GridItem
                colSpan={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid #ccc"
                padding="5px"
            >
              <label htmlFor="productAmount">상품가격</label>
            </GridItem>
            <GridItem colSpan={2} border="1px solid #ccc" padding="5px">
              <Input
                  id="productAmount"
                  type="text"
                  pattern="\d*"
                  value={productAmount}
                  onChange={(e) => setProductAmount(Number(e.target.value))}
                  required
              />
            </GridItem>

            {/* 상품수량 */}
            <GridItem
                colSpan={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid #ccc"
                padding="5px"
            >
              <label htmlFor="productCount">상품수량</label>
            </GridItem>
            <GridItem colSpan={2} border="1px solid #ccc" padding="5px">
              <Input
                  id="productCount"
                  type="number"
                  value={productCount}
                  onChange={(e) => setProductCount(Number(e.target.value))}
                  required
              />
            </GridItem>

            {/* 카테고리 */}
            <GridItem
                colSpan={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid #ccc"
                padding="5px"
            >
              <label htmlFor="category">카테고리</label>
            </GridItem>
            <GridItem colSpan={5} border="1px solid #ccc" padding="5px">
              <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px" }}
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

            {/* 이미지 */}
            <GridItem
                colSpan={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid #ccc"
                padding="5px"
            >
              <label htmlFor="ProductImage">이미지</label>
            </GridItem>
            <GridItem colSpan={5} border="1px solid #ccc" padding="5px">
              <Box display="flex" flexDirection="column" gap={3}>
                <Input
                    id="ProductImage"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*"
                />
                <Box
                    display="flex"
                    flexWrap="wrap"
                    gap="10px"
                    padding="10px"
                    border="1px solid #ccc"
                    borderRadius="5px"
                    maxHeight="200px"
                    overflowY="auto"
                    backgroundColor="#f9f9f9"
                >
                  {images.map((image, index) => (
                      <Box
                          key={index}
                          textAlign="center"
                          minWidth="100px"
                          maxWidth="100px"
                          border={thumbnail === image ? "2px solid blue" : "1px solid #ccc"}
                          borderRadius="5px"
                          padding="5px"
                          cursor="pointer"
                          onClick={() => handleThumbnailSelect(image)}
                      >
                        <img
                            src={image.preview}
                            alt={image.name}
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                        />
                        <Text fontSize="sm" mt="5px" textAlign="center" isTruncated>
                          {image.name}
                        </Text>
                        {thumbnail === image && (
                            <Text fontSize="xs" color="blue">
                              썸네일
                            </Text>
                        )}
                      </Box>
                  ))}
                </Box>
              </Box>
            </GridItem>

            {/* 상품 소개 */}
            <GridItem
                colSpan={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid #ccc"
                padding="5px"
            >
              <label htmlFor="ProductContent">상품 소개</label>
            </GridItem>
            <GridItem colSpan={5} border="1px solid #ccc" padding="5px">
              <Textarea
                  id="productContent"
                  value={productContent}
                  onChange={(e) => setProductContent(e.target.value)}
                  required
                  rows="4"
              />
            </GridItem>
          </Grid>

          {/* 버튼 */}
          <Box mt={6} textAlign="right">
            <Button
                onClick={handleSubmit}
                isLoading={loading}
                colorScheme="blue"
                mr={3}
            >
              상품 등록
            </Button>
            <Button onClick={handleCancel} colorScheme="red">
              등록 취소
            </Button>
          </Box>
        </Flex>
      </Box>
  );
};

export default ProductForm;
