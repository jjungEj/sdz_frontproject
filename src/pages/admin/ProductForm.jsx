import React, { useState, useEffect } from "react";
import { getCategoriesAPI } from "@/services/CategoryAPI";
import { createProductAPI } from "@/services/ProductAPI";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Grid, GridItem, Input, Button, Textarea, Text, Flex } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";

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
        const subCategories = data.filter(category => category.parentId !== null);
        setCategories(subCategories );
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
        userId: "",
        categoryId: selectedCategory,
      })
    );

    images.forEach((image) => {
      formData.append("images", image.file);
    });

    formData.append("thumbnail", thumbnail ? thumbnail.file : null);

    try {
      await createProductAPI(formData);
      toaster.create({
        title: "상품이 등록되었습니다.",
        type: "success"
      });
      navigate("/admin/products");
    } catch (error) {
      console.error("Product creation failed:", error);
      toaster.create({
        title: "상품 등록을 실패했습니다..",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
      <Box display="flex" flexDirection="column" alignItems="center" w="100%">
        <Heading as="h1" size="xl" mb={6}>
          상품 등록
        </Heading>
        <Flex direction="column" w="90%" maxWidth="800px" p={5} boxShadow="lg" borderRadius="lg" bg="white">
          {/* 상품 등록 폼 */}
          <Grid templateRows="repeat(6, auto)" templateColumns="repeat(6, 1fr)" gap={4}>
            {/* 상품명 */}
            <GridItem colSpan={1} display="flex" alignItems="center" justifyContent="center">
              <Text fontWeight="bold">상품명</Text>
            </GridItem>
            <GridItem colSpan={5}>
              <Input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="상품명을 입력하세요"
              />
            </GridItem>

            {/* 상품 가격 */}
            <GridItem colSpan={1} display="flex" alignItems="center" justifyContent="center">
              <Text fontWeight="bold">상품 가격</Text>
            </GridItem>
            <GridItem colSpan={2}>
              <Input
                  id="productAmount"
                  type="number"
                  value={productAmount}
                  onChange={(e) => setProductAmount(Number(e.target.value))}
                  placeholder="가격을 입력하세요"
              />
            </GridItem>

            {/* 상품 수량 */}
            <GridItem colSpan={1} display="flex" alignItems="center" justifyContent="center">
              <Text fontWeight="bold">상품 수량</Text>
            </GridItem>
            <GridItem colSpan={2}>
              <Input
                  id="productCount"
                  type="number"
                  value={productCount}
                  onChange={(e) => setProductCount(Number(e.target.value))}
                  placeholder="수량을 입력하세요"
              />
            </GridItem>

            {/* 카테고리 */}
            <GridItem colSpan={1} display="flex" alignItems="center" justifyContent="center">
              <Text fontWeight="bold">카테고리</Text>
            </GridItem>
            <GridItem colSpan={5}>
              <Box as="select" id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} w="100%" p={2}>
                <option value="" disabled>
                  선택하세요
                </option>
                {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                ))}
              </Box>
            </GridItem>

            {/* 이미지 */}
            <GridItem colSpan={1} display="flex" alignItems="center" justifyContent="center">
              <Text fontWeight="bold">이미지</Text>
            </GridItem>
            <GridItem colSpan={5}>
              <Box display="flex" flexDirection="column" gap={4}>
                <Flex gap={4} wrap="wrap" border="1px solid #ccc" p={3} borderRadius="md" bg="gray.50">
                  {images.map((image, index) => (
                      <Box
                          key={index}
                          p={2}
                          border={thumbnail === image ? "2px solid blue" : "1px solid #ccc"}
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => handleThumbnailSelect(image)}
                          textAlign="center"
                      >
                        <img
                            src={image.preview}
                            alt={image.name}
                            style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
                        />
                        <Text fontSize="sm" mt={1}>
                          {image.name}
                        </Text>
                        {thumbnail === image && (
                            <Text fontSize="xs" color="blue">
                              썸네일
                            </Text>
                        )}
                      </Box>
                  ))}
                </Flex>
                <Input id="ProductImage" type="file" multiple onChange={handleFileChange} accept="image/*" />
              </Box>
            </GridItem>

            {/* 색상 */}
            <GridItem colSpan={1} display="flex" alignItems="center" justifyContent="center">
              <Text fontWeight="bold">색상</Text>
            </GridItem>
            <GridItem colSpan={5}>
              <Box as="select" id="productContent" value={productContent} onChange={(e) => setProductContent(e.target.value)} w="100%" p={2}>
                <option value="" disabled>
                  선택하세요
                </option>
                <option value="웜그레이">웜그레이</option>
                <option value="챠콜">챠콜</option>
                <option value="딥그린">딥그린</option>
                <option value="아이보리">아이보리</option>
              </Box>
            </GridItem>
          </Grid>

          {/* 버튼 */}
          <Flex mt={6} justify="flex-end" gap={3}>
            <Button onClick={handleSubmit} isLoading={loading} colorScheme="blue" boxShadow="md">
              상품 등록
            </Button>
            <Button onClick={handleCancel} colorScheme="red" boxShadow="md">
              등록 취소
            </Button>
          </Flex>
        </Flex>
      </Box>
  );

};

export default ProductForm;
