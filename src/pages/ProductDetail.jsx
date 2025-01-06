import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Text, Heading, Spinner, Image, VStack, Button, HStack, Card, Flex } from "@chakra-ui/react";
import { NumberInputField, NumberInputRoot } from "@/components/ui/number-input";
import { fetchProductAPI } from "@/services/ProductAPI";
import { modifyOrderItem } from "@/services/OrderItemAPI"; // 장바구니 API 추가
import Slider from "react-slick"; // Slider를 사용하기 위해 import 추가
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    // 페이지 이동시 스크롤 초기화
      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    

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
    const handleAddToCart = async () => {
        try {
            const isLoggedIn = localStorage.getItem("access") !== null;

            if (isLoggedIn) {
                await modifyOrderItem(productId, quantity);
            } else {
                const guestOrderItem = JSON.parse(localStorage.getItem("guestOrderItem")) || { orderItemDetails: [] };
                const existingItem = guestOrderItem.orderItemDetails.find(item => String(item.productId) === productId);
                const currentQuantity = existingItem ? existingItem.quantity : 0;

                if (currentQuantity + quantity > product.productCount) {
                    alert("재고 수량을 초과하여 상품을 추가할 수 없습니다.");
                    return;
                }

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

                localStorage.setItem("guestOrderItem", JSON.stringify(guestOrderItem));
            }

            alert(`${quantity}개의 상품이 장바구니에 추가되었습니다!`);
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

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };

    return (
        <Box>
            {product ? (
                <>
                    {/* 상품 상세 카드 */}
                    <Card.Root flexDirection="row" overflow="hidden" margin="5" bgColor="gray.100" borderRadius="2xl" height="600px">
                        {/* 슬라이더 섹션 */}
                        <Box width="50%" padding="5">
                            <Slider {...sliderSettings}>
                                {/* 이미지 경로를 숫자 순으로 정렬 */}
                                {[...product.imagePaths]
                                    .sort((a, b) => {
                                        const getNumber = (str) => parseInt(str.match(/\d+/)?.[0], 10) || 0;
                                        return getNumber(a) - getNumber(b);
                                    })
                                    .map((imagePath, index) => (
                                        <Box key={index} display="flex" justifyContent="center">
                                            <Image
                                                src={imagePath}
                                                alt={`상품 이미지 ${index + 1}`}
                                                objectFit="contain"
                                                maxHeight="500px"
                                            />
                                        </Box>
                                    ))}
                            </Slider>
                        </Box>

                        {/* 상세 정보 섹션 */}
                        <Box display="flex" flexDirection="column" justifyContent="space-between" flex="1" padding="5">
                            <Card.Body>
                                <Card.Title fontSize="3xl" fontWeight="bold" mb="2">{product.productName}</Card.Title>
                                <Heading fontSize="md" fontWeight="semibold" marginBottom="5" color="GrayText">
                                    CODE : #SDZ{String(product.productId).padStart(5, "0")}
                                </Heading>
                                <Heading fontSize="2xl" fontWeight="bold" marginBottom="5">
                                    &#8361; {new Intl.NumberFormat("ko-KR").format(product.productAmount)}
                                </Heading>
                            </Card.Body>
                            <Card.Footer>
                                <VStack align="flex-start">
                                    <Heading fontSize="sm" fontWeight="semibold" color="GrayText" mb="-2">QUANTITY</Heading>
                                    <NumberInputRoot
                                        defaultValue={1}
                                        min={1}
                                        max={product.productCount}
                                        value={quantity}
                                        onValueChange={(e) => {
                                            setQuantity(e.valueAsNumber);
                                        }}
                                        width="205px"
                                        mb="3"
                                    >
                                        <NumberInputField fontWeight="semibold" />
                                    </NumberInputRoot>
                                    <HStack>
                                        <Button 
                                            variant="solid"
                                            onClick={() => handleBuyNow(product)}
                                        >
                                            Buy now
                                        </Button>
                                        <Button
                                            variant="solid"
                                            onClick={handleAddToCart}
                                        >
                                            Add to cart
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Card.Footer>
                        </Box>
                    </Card.Root>

                    {/* 기본 정보 테이블 */}
                    <Box margin="5">
                        <Box borderBottom={{ base: "1px solid gray", _dark: "1px solid white" }} my={6} />
                        <Heading fontSize="lg" marginBottom="4" textAlign="center">
                            BASIC INFORMATION
                        </Heading>
                        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                        <Flex borderBottom="1px solid #e2e8f0" p="4">
                            <Box flex="0.7" fontWeight="bold" fontSize="sm">품명 및 모델명</Box>
                            <Box borderLeft="1px solid #e2e8f0" mx="2" />
                            <Box flex="2" fontSize="sm">{product.productName}, #SDZ{String(product.productId).padStart(5, "0")}</Box>
                        </Flex>
                        <Flex borderBottom="1px solid #e2e8f0" p="4">
                            <Box flex="0.7" fontWeight="bold" fontSize="sm">색상</Box>
                            <Box borderLeft="1px solid #e2e8f0" mx="2" />
                            <Box flex="2" fontSize="sm">{product.productContent}</Box>
                        </Flex>
                        <Flex borderBottom="1px solid #e2e8f0" p="4">
                            <Box flex="0.7" fontWeight="bold" fontSize="sm">사이즈</Box>
                            <Box borderLeft="1px solid #e2e8f0" mx="2" />
                            <Box flex="2" fontSize="sm">상세이미지 참조</Box>
                        </Flex>
                        <Flex borderBottom="1px solid #e2e8f0" p="4">
                            <Box flex="0.7" fontWeight="bold" fontSize="sm">구성품</Box>
                            <Box borderLeft="1px solid #e2e8f0" mx="2" />
                            <Box flex="2" fontSize="sm">의자</Box>
                        </Flex>
                        <Flex borderBottom="1px solid #e2e8f0" p="4">
                            <Box flex="0.7" fontWeight="bold" fontSize="sm">주요 소재</Box>
                            <Box borderLeft="1px solid #e2e8f0" mx="2" />
                            <Box flex="2" fontSize="sm">메쉬, 패브릭, 발포스폰지, PP, 나일론, 플라스틱, STEEL</Box>
                        </Flex>
                        <Flex borderBottom="1px solid #e2e8f0" p="4">
                            <Box flex="0.7" fontWeight="bold" fontSize="sm">제조사</Box>
                            <Box borderLeft="1px solid #e2e8f0" mx="2" />
                            <Box flex="2" fontSize="sm">사다줘</Box>
                        </Flex>
                        <Flex borderBottom="1px solid #e2e8f0" p="4">
                            <Box flex="0.7" fontWeight="bold" fontSize="sm">제조국</Box>
                            <Box borderLeft="1px solid #e2e8f0" mx="2" />
                            <Box flex="2" fontSize="sm">대한민국</Box>
                        </Flex>
                        <Flex borderBottom="1px solid #e2e8f0" p="4">
                            <Box flex="0.7" fontWeight="bold" fontSize="sm">품질보증기준</Box>
                            <Box borderLeft="1px solid #e2e8f0" mx="2" />
                            <Box flex="2" fontSize="sm">
                                기본 1년, 일부 품목은 최대 15년, 단 일부 부품 제외
                                (품목 별 상이, 원활한 서비스 제공을 위해 사다줘 닷컴 내 제품 등록 필요)
                            </Box>
                        </Flex>
                        <Flex p="4">
                            <Box flex="0.7" fontWeight="bold" fontSize="sm">A/S 책임자</Box>
                            <Box borderLeft="1px solid #e2e8f0" mx="2" />
                            <Box flex="2" fontSize="sm">사다줘 고객센터</Box>
                        </Flex>

                        </Box>
                        <Box borderBottom={{ base: "1px solid gray", _dark: "1px solid white" }} my={6} />

                    </Box>

                </>
            ) : (
                <Text>상품 데이터를 찾을 수 없습니다.</Text>
            )}
        </Box>
    );
};

export default ProductDetail;
