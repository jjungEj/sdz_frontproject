import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Grid, GridItem, Text, Button, Image } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const orderInfo = location.state?.orderData;
        if (orderInfo) {
            setOrderData(orderInfo);
        } else {
            console.error("주문 정보가 없습니다:", location.state);
        }
    }, [location]);

    const handleGoToOrderList = () => {
        navigate('/mypage/orders');
    };
    
    return (
        <Box maxW="800px" mx="auto" p={8}>
            <Text fontSize="2xl" fontWeight="bold" mb={8}>주문 완료</Text>
            {orderData ? (
                <VStack spacing={6} align="stretch">
                    {/* 상품 정보 테이블 */}
                    <Box>
                        <Box borderWidth="1px" borderRadius="2g">
                            <Grid templateColumns="2fr 1fr 1fr 1fr" bg="gray.100" p={4} gap={4} borderBottomWidth="1px" fontWeight="semibold">
                                <Text textAlign="center">제품정보</Text>
                                <Text textAlign="center">판매가격</Text>
                                <Text textAlign="center">수량</Text>
                                <Text textAlign="center">배송형태</Text>
                            </Grid>
                            {orderData.map((item) => (
                                <Grid key={item.productId} templateColumns="2fr 1fr 1fr 1fr" bg="gray.10" p={4} gap={4} borderBottomWidth="1px" alignItems="center">
                                    <HStack>
                                        <Box w="60px" h="60px" bg="gray.100" borderWidth="1px">
                                            <Image src={item.productImage} alt="상품이미지" fallbackSrc="placeholder.jpg" objectFit="cover" w="100%" h="100%"/>
                                        </Box>
                                        <Text textAlign="center">{item.productName}</Text>
                                    </HStack>
                                    <Text textAlign="center">{item.productAmount.toLocaleString()}원</Text>
                                    <Text textAlign="center">{item.quantity}</Text>
                                    <Text textAlign="center">택배 배송</Text>
                                </Grid>
                            ))}
                            <Grid templateColumns="2fr 1fr 1fr 1fr" bg="gray.100" p={4} gap={4}>
                                <GridItem colSpan={3}>
                                    <Text textAlign="right" fontWeight="bold">총 결제금액</Text>
                                </GridItem>
                                <Text textAlign="center" fontWeight="bold">
                                    {orderData.reduce((total, item) => total + (item.productAmount * item.quantity), 0).toLocaleString()}원
                                </Text>
                            </Grid>
                        </Box>
                    </Box>

                    {/* 주문정보 */}
                    <Box mb={8} borderWidth="1px"  overflow="hidden">
                        <Box p={4} bg="gray.100">
                            <Text fontSize="lg" fontWeight="bold">주문정보</Text>
                        </Box>
                        <Box borderBottom="1px solid" borderColor="gray.200" />
                        <Box p={4}>
                            <VStack spacing={4} align="stretch">
                                <HStack>
                                    <Box w="150px" fontWeight="bold">주문번호</Box>
                                    <Box>{orderData.orderId}</Box>
                                </HStack>
                                <HStack>
                                    <Box w="150px" fontWeight="bold">주문일시</Box>
                                    <Box>{orderData.regDate}</Box>
                                </HStack>
                                <HStack>
                                    <Box w="150px" fontWeight="bold">주문상태</Box>
                                    <Box>{orderData.orderStatus}</Box>
                                </HStack>
                            </VStack>
                        </Box>
                    </Box>

                    {/* 결제정보 */}
                    <Box mb={8} borderWidth="1px" overflow="hidden">
                        <Box p={4} bg="gray.100">
                            <Text fontSize="lg" fontWeight="bold">결제정보</Text>
                        </Box>
                        <Box borderBottom="1px solid" borderColor="gray.200" />
                        <Box p={4}>
                            <VStack spacing={4} align="stretch">
                                <HStack>
                                    <Box w="150px" fontWeight="bold">결제방법</Box>
                                    <Box>{orderData.paymentMethod}</Box>
                                </HStack>
                                <HStack>
                                    <Box w="150px" fontWeight="bold">결제금액</Box>
                                    <Box>{orderData.totalPrice}</Box>
                                </HStack>
                            </VStack>
                        </Box>
                    </Box>

                    {/* 배송지정보 */}
                    <Box borderWidth="1px"  overflow="hidden">
                        <Box p={4} bg="gray.100">
                            <Text fontSize="lg" fontWeight="bold">배송지정보</Text>
                        </Box>
                        <Box borderBottom="1px solid" borderColor="gray.200" />
                        <Box p={4}>
                            <VStack spacing={4} align="stretch">
                                <HStack>
                                    <Box w="150px" fontWeight="bold">받으시는 분</Box>
                                    <Box>{orderData.receiverName}</Box>
                                </HStack>
                                <HStack>
                                    <Box w="150px" fontWeight="bold">주소</Box>
                                    <Box>{orderData.detailAddress1} {orderData.detailAddress2} {orderData.detailAddress3}</Box>
                                </HStack>
                                <HStack>
                                    <Box w="150px" fontWeight="bold">연락처</Box>
                                    <Box>{orderData.phone}</Box>
                                </HStack>
                                <HStack>
                                    <Box w="150px" fontWeight="bold">배송시 요청사항</Box>
                                    <Box>{orderData.request}</Box>
                                </HStack>
                            </VStack>
                        </Box>
                    </Box>
                            
                    <Button colorScheme="blue" onClick={handleGoToOrderList}>
                        주문 목록으로 가기
                    </Button>
                </VStack>
            ) : (
                <Text>주문 정보를 불러오는 중입니다...</Text>
            )}
        </Box>
    );
}

export default OrderConfirmation;
