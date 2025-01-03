import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Heading, Grid, GridItem, Input, Button, Textarea, Text, Flex } from "@chakra-ui/react";
import { getProductByIdAPI, updateProductAPI } from "@/services/ProductAPI";
import { getCategoriesAPI } from "@/services/CategoryAPI";

const ProductUpdateForm = () => {
  const { productId } = useParams();
  const [productName, setProductName] = useState("");
  const [productAmount, setProductAmount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [productContent, setProductContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState(null); // 썸네일 경로 저장
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 데이터 초기화
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductByIdAPI(productId);
        setProductName(product.productName);
        setProductAmount(product.productAmount);
        setProductCount(product.productCount);
        setProductContent(product.productContent);
        setSelectedCategory(product.categoryId);

        const fetchedImages = product.imagePaths || [];
        const imageObjects = fetchedImages.map((path) => ({
          path: `${path}`,
          isNew: false,
          markedForDeletion: false,
        }));
        setImages(imageObjects);

        // 썸네일 초기화
        setThumbnail(product.thumbnailPath); // 썸네일 경로 설정
      } catch (error) {
        console.error("Failed to fetch product:", error);
        alert("상품 정보를 불러오는 데 실패했습니다.");
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getCategoriesAPI();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        alert("카테고리를 불러오는 데 실패했습니다.");
      }
    };

    fetchProduct();
    fetchCategories();
  }, [productId]);

  // 파일 업로드 핸들러
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      path: URL.createObjectURL(file),
      file,
      isNew: true,
      markedForDeletion: false,
    }));
    setImages((prev) => [...prev, ...newFiles]);
  };

  // 썸네일 선택 핸들러
  const handleThumbnailSelect = (image) => {
    if (image.markedForDeletion) {
      alert("삭제 예정 이미지는 썸네일로 선택할 수 없습니다.");
      return;
    }

    setThumbnail(thumbnail === image.path ? null : image.path); // 썸네일 토글
  };

  const handleImageDelete = (image, e) => {
    e.stopPropagation(); // 이벤트 전파 방지

    // 썸네일로 설정된 이미지는 삭제 불가
    if (thumbnail === image.path) {
      alert("썸네일로 설정된 이미지는 삭제할 수 없습니다.");
      return;
    }

    // 삭제 상태 토글
    setImages((prev) =>
        prev.map((img) =>
            img === image
                ? { ...img, markedForDeletion: !img.markedForDeletion }
                : img
        )
    );
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    if (!thumbnail) {
      alert("썸네일을 선택해야 합니다.");
      setLoading(false);
      return;
    }

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

    images
        .filter((image) => image.isNew)
        .forEach((image) => {
          formData.append("newImages", image.file);
        });

    const deletedPaths = images
        .filter((image) => image.markedForDeletion && !image.isNew)
        .map((image) => image.path.replace("", ""));

    formData.append("deletedImagePaths", JSON.stringify(deletedPaths));
    formData.append("newThumbnail", thumbnail);

    try {
      await updateProductAPI(productId, formData);
      alert("상품이 성공적으로 수정되었습니다.");
      navigate("/admin/products");
    } catch (error) {
      console.error("Product update failed:", error);
      alert("상품 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
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
          상품 수정
        </Heading>
        <Box borderBottom="1px solid #ccc" mb={3} w="100%" />
        <Flex direction="column" w="90%" maxWidth="800px">
          <Grid templateRows="repeat(6, auto)" templateColumns="repeat(6, 1fr)" gap={4} p={4}>
            <GridItem colSpan={1}>
              <label htmlFor="productName">상품명</label>
            </GridItem>
            <GridItem colSpan={5}>
              <Input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
              />
            </GridItem>

            <GridItem colSpan={1}>
              <label htmlFor="productAmount">상품 가격</label>
            </GridItem>
            <GridItem colSpan={2}>
              <Input
                  id="productAmount"
                  type="text"
                  pattern="\d*"
                  value={productAmount}
                  onChange={(e) => setProductAmount(Number(e.target.value))}
                  required
              />
            </GridItem>

            <GridItem colSpan={1}>
              <label htmlFor="productCount">상품 수량</label>
            </GridItem>
            <GridItem colSpan={2}>
              <Input
                  id="productCount"
                  type="number"
                  value={productCount}
                  onChange={(e) => setProductCount(Number(e.target.value))}
                  required
              />
            </GridItem>

            <GridItem colSpan={1}>
              <label htmlFor="category">카테고리</label>
            </GridItem>
            <GridItem colSpan={5}>
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

            <GridItem colSpan={1}>
              <label>이미지</label>
            </GridItem>
            <GridItem colSpan={5}>
              <Flex wrap="wrap" gap="10px">
                {images.map((image, index) => (
                    <Box
                        key={index}
                        textAlign="center"
                        position="relative"
                        border={thumbnail === image.path ? "2px solid blue" : "1px solid #ccc"}
                        borderRadius="5px"
                        padding="5px"
                        cursor="pointer"
                        onClick={() => handleThumbnailSelect(image)} // 썸네일 선택
                    >
                      <img src={image.path} alt={`image-${index}`} style={{ maxWidth: "100px" }} />

                      {/* 삭제 버튼 */}
                      <Button
                          position="absolute"
                          top="0"
                          right="0"
                          size="xs"
                          colorScheme={image.markedForDeletion ? "gray" : "red"}
                          onClick={(e) => handleImageDelete(image, e)} // 이벤트 전파 방지
                      >
                        {image.markedForDeletion ? "복원" : "삭제"}
                      </Button>

                      {/* 썸네일 표시 */}
                      {thumbnail === image.path && (
                          <Text fontSize="xs" color="blue">
                            썸네일
                          </Text>
                      )}
                    </Box>
                ))}
              </Flex>

              <Input type="file" multiple onChange={handleFileChange} />
            </GridItem>

            <GridItem colSpan={1}>
              <label htmlFor="productContent">상품 설명</label>
            </GridItem>
            <GridItem colSpan={5}>
              <Textarea
                  id="productContent"
                  value={productContent}
                  onChange={(e) => setProductContent(e.target.value)}
                  required
                  rows="4"
              />
            </GridItem>
          </Grid>

          <Flex justifyContent="flex-end" mt={4}>
            <Button colorScheme="blue" isLoading={loading} onClick={handleSubmit} mr={3}>
              수정
            </Button>
            <Button onClick={handleCancel} colorScheme="red">
              취소
            </Button>
          </Flex>
        </Flex>
      </Box>
  );
};

export default ProductUpdateForm;
