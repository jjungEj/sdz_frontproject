import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Heading, Grid, GridItem, Input, Button, Text, Flex } from "@chakra-ui/react";
import { getProductByIdAPI, updateProductAPI } from "@/services/ProductAPI";
import { getCategoriesAPI } from "@/services/CategoryAPI";
import { Toaster, toaster } from "@/components/ui/toaster";
import colorOptions from "@/data/colorOptions.js";

const ProductUpdateForm = () => {
  const { productId } = useParams();
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
  const [availableColors, setAvailableColors] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductByIdAPI(productId);
        setProductName(product.productName);
        setProductAmount(product.productAmount);
        setProductCount(product.productCount);
        setProductContent(product.productContent || ""); // 컬러 필드
        setSelectedCategory(product.categoryId);

        const fetchedImages = product.imagePaths || [];
        const imageObjects = fetchedImages.map((path) => ({
          path: `${path}`,
          isNew: false,
          markedForDeletion: false,
        }));
        setImages(imageObjects);

        setThumbnail(product.thumbnailPath);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        alert("상품 정보를 불러오는 데 실패했습니다.");
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getCategoriesAPI();
        const subCategories = data.filter(category => category.parentId !== null);
        setCategories(subCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        alert("카테고리를 불러오는 데 실패했습니다.");
      }
    };

    fetchProduct();
    fetchCategories();
  }, [productId]);

  useEffect(() => {
    // 카테고리가 선택될 때마다 색상 업데이트
    if (selectedCategory) {
      setAvailableColors(colorOptions[selectedCategory] || []);
      console.log(selectedCategory);
    } else {
      setAvailableColors([]);
    }
  }, [selectedCategory]);

  const validateForm = () => {
    if (!productName.trim()) {
      toaster.create({
        title: "상품명은 필수입니다.",
        type: "error",
      });
      return false;
    }

    if (productCount < 0) {
      toaster.create({
        title: "상품 수량은 음수일 수 없습니다.",
        type: "error",
      });
      return false;
    }

    if (productAmount < 0) {
      toaster.create({
        title: "상품 가격은 음수일 수 없습니다.",
        type: "error",
      });
      return false;
    }

    // 카테고리가 선택되지 않은 경우
    if (!selectedCategory) {
      toaster.create({
        title: "카테고리를 선택해주세요.",
        type: "error",
      });
      return false;
    }

    // 색상이 선택되지 않은 경우
    if (!productContent) {
      toaster.create({
        title: "색상을 선택해주세요.",
        type: "error",
      });
      return false;
    }

    // 썸네일이 선택되지 않은 경우
    if (!thumbnail) {
      toaster.create({
        title: "썸네일을 선택해주세요.",
        type: "error",
      });
      return false;
    }

    return true;
  };

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

  const handleThumbnailSelect = (image) => {
    if (image.markedForDeletion) {
      toaster.create({
        title: "삭제 예정인 이미지는 썸네일로 선택할 수 없습니다.",
        type: "error"
      });
      return;
    }

    setThumbnail(thumbnail === image.path ? null : image.path); // 썸네일 토글
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = (image, e) => {
    e.stopPropagation(); // 이벤트 전파 방지

    // 썸네일로 설정된 이미지는 삭제 불가
    if (thumbnail === image.path) {
      toaster.create({
        title: "썸네일로 설정된 이미지는 삭제할 수 없습니다.",
        type: "error"
      });
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

  const handleSubmit = async () => {
    if (loading) return;
    if (!validateForm()) return;
    setLoading(true);

    console.log(thumbnail);
    if (!thumbnail) {
      toaster.create({
              title: "썸네일을 선택해야 합니다.",
              type: "error"
            });
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
          productContent, // 컬러 필드 추가
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
      console.log("Submitting data:", formData); // 요청 데이터 확인
      await updateProductAPI(productId, formData);
      toaster.create({
              title: "상품이 성공적으로 수정되었습니다.",
              type: "success"
            });
      navigate("/admin/products");
    } catch (error) {
      console.error("Product update failed:", error);
      toaster.create({
              title: "상품 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
              type: "error"
            });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
      <Box display="flex" flexDirection="column" alignItems="center" w="100%">
        <Toaster />
        <Heading as="h1" size="xl" mb={6}>
          상품 수정
        </Heading>
        <Flex
            direction="column"
            w="90%"
            maxWidth="800px"
            p={5}
            boxShadow="lg"
            borderRadius="lg"
            bg="white"
        >
          {/* 상품 정보 섹션 */}
          <Grid templateColumns="repeat(6, 1fr)" gap={4}>
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

            {/* 색상 */}
            <GridItem colSpan={1} display="flex" alignItems="center" justifyContent="center">
              <Text fontWeight="bold">색상</Text>
            </GridItem>
            <GridItem colSpan={5}>
              <Box
                  as="select"
                  id="productContent"
                  value={productContent}
                  onChange={(e) => setProductContent(e.target.value)}
                  w="100%"
                  p={2}
              >
                <option value="" disabled>
                  선택하세요
                </option>
                {availableColors.map((color, index) => (
                    <option key={index} value={color}>
                      {color}
                    </option>
                ))}
              </Box>
            </GridItem>

            {/* 이미지 */}
            <GridItem colSpan={1} display="flex" alignItems="center" justifyContent="center">
              <Text fontWeight="bold">이미지</Text>
            </GridItem>
            <GridItem colSpan={5}>
              <Flex wrap="wrap" gap={4} border="1px solid #ccc" p={3} borderRadius="md" bg="gray.50">
                {images.map((image, index) => (
                    <Box
                        key={index}
                        position="relative"
                        p={2}
                        border={thumbnail === image.path ? "2px solid blue" : "1px solid #ccc"}
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => handleThumbnailSelect(image)}
                        textAlign="center"
                    >
                      <img
                          src={image.path}
                          alt={`image-${index}`}
                          style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
                      />
                      <Button
                          position="absolute"
                          top="0"
                          right="0"
                          size="xs"
                          colorScheme={image.markedForDeletion ? "gray" : "red"}
                          onClick={(e) => handleImageDelete(image, e)}
                      >
                        {image.markedForDeletion ? "복원" : "삭제"}
                      </Button>
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
          </Grid>

          {/* 버튼 섹션 */}
          <Flex justifyContent="flex-end" mt={6} gap={3}>
            <Button onClick={handleSubmit} colorScheme="blue" isLoading={loading}>
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
