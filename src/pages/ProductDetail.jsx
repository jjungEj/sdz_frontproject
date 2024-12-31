import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Text, Heading, Spinner, Image, VStack, Button, HStack, Card } from "@chakra-ui/react";
import { NumberInputField, NumberInputRoot } from "@/components/ui/number-input";
import { fetchProductAPI } from "@/services/ProductAPI";
import { modifyOrderItem } from "@/services/OrderItemAPI"; // 장바구니 API 추가

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1); // 선택한 수량 상태

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

    const handleAddToCart = () => {
        try {
            // 상품 데이터 확인
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
            const existingItem = guestOrderItem.orderItemDetails.find(item => String(item.productId) === productId);
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

    return (
        <Box>
            {product ? (
                <Card.Root flexDirection="row" overflow="hidden" margin="5" bgColor="gray.100" borderRadius="2xl" height="600px">
                    <Image
                        objectFit="cover"
                        maxW="500px"
                        src={`http://localhost:8080${product.thumbnailPath}`}
                        alt={product.productName}
                        margin="20"
                    />
                    <Box display="flex" flexDirection="column" justifyContent="space-between" flex="1" margin="20">
                        <Card.Body>
                            <Card.Title fontSize="4xl" mb="2">{product.productName}</Card.Title>
                            <Heading fontSize="md" fontWeight="semibold" marginBottom="5" color="GrayText">CODE : {product.productId}</Heading>
                            <Heading fontSize="3xl" fontWeight="bold" marginBottom="5">&#8361;{product.productAmount}</Heading>
                        </Card.Body>
                        <Card.Footer>
                            <VStack align="flex-start">
                                <Heading fontSize="sm" fontWeight="semibold" color="GrayText" mb="-2">QUANTITY</Heading>
                                <NumberInputRoot
                                    defaultValue={1}
                                    min={1} // 최소값
                                    max={product.productCount} // 최대값 (재고)
                                    value={quantity}
                                    onValueChange={(e) => {
                                        setQuantity(e.valueAsNumber)
                                    }} // 수량 상태 업데이트
                                    width="205px"
                                    mb="3"
                                >
                                    <NumberInputField fontWeight="semibold" />
                                </NumberInputRoot>
                                <HStack>
                                    <Button variant="solid">Buy now</Button>
                                    <Button
                                        variant="solid"
                                        onClick={handleAddToCart} // 장바구니 추가 버튼 동작
                                    >
                                        Add to cart
                                    </Button>
                                </HStack>
                            </VStack>
                        </Card.Footer>
                    </Box>
                </Card.Root>
            ) : (
                <Text>상품 데이터를 찾을 수 없습니다.</Text>
            )}
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
