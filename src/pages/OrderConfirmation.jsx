import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Grid, GridItem, Text, Button, Image } from '@chakra-ui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getOrderDetail } from "@/services/OrderAPI";

function OrderConfirmation() {
    const { orderId } = useParams(); // URL 경로에서 orderId 추출
    const location = useLocation();
    const navigate = useNavigate();

    const [orderData, setOrderData] = useState(location.state?.orderData || null);
    const [loading, setLoading] = useState(!location.state?.orderData); // API 호출 여부
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!orderData) {
            async function fetchOrderDetail() {
                try {
                    const data = await getOrderDetail(orderId);
                    setOrderData(data);
                } catch (err) {
                    setError('주문 상세 정보를 불러오는 데 실패했습니다.');
                } finally {
                    setLoading(false);
                }
            }
            fetchOrderDetail();
        } else {
            setLoading(false);
        }
    }, [orderId, orderData]);

    const handleGoToOrderList = () => {
        navigate('/mypage/orders'); // 주문 목록 페이지로 이동
    };

    return (
        <Box maxW="800px" mx="auto" p={8}>
            <Text fontSize="2xl" fontWeight="bold" mb={8}>주문 확인</Text>
            {orderData ? (
                <VStack spacing={6} align="stretch">
                    {/* 상품 정보 테이블 */}
                    <Box>
                        <Box borderWidth="1px" borderRadius="lg">
                            <Grid templateColumns="2fr 1fr 1fr 1fr" bg="gray.100" p={4} gap={4} borderBottomWidth="1px" fontWeight="semibold">
                                <Text textAlign="center">제품정보</Text>
                                <Text textAlign="center">판매가격</Text>
                                <Text textAlign="center">수량</Text>
                                <Text textAlign="center">배송형태</Text>
                            </Grid>
                            {Array.isArray(orderData.items) && orderData.items.length > 0 ? (
    orderData.items.map((item) => (
        <Grid key={item.productId} templateColumns="2fr 1fr 1fr 1fr" bg="gray.50" p={4} gap={4} borderBottomWidth="1px" alignItems="center">
            <HStack>
                <Box w="60px" h="60px" bg="gray.100" borderWidth="1px">
                <img
                        src={`http://localhost:8080${item.thumbnailPath}`}
                        alt={item.productName}
                        style={{
                            width: "75px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    />
                </Box>
                <Text textAlign="center">{item.productName}</Text>
            </HStack>
            <Text textAlign="center">{item.productAmount?.toLocaleString()}원</Text>
            <Text textAlign="center">{item.quantity}</Text>
            <Text textAlign="center">택배 배송</Text>
        </Grid>
    ))
) : (
    <Grid templateColumns="2fr 1fr 1fr 1fr" bg="gray.50" p={4} gap={4} borderBottomWidth="1px" alignItems="center">
        <Text textAlign="center" gridColumn="span 4">주문 항목이 없습니다.</Text>
    </Grid>
)}
                            <Grid templateColumns="2fr 1fr 1fr 1fr" bg="gray.100" p={4} gap={4}>
                                <GridItem colSpan={3}>
                                    <Text textAlign="right" fontWeight="bold">총 결제금액</Text>
                                </GridItem>
                                <Text textAlign="center" fontWeight="bold">
                                {orderData.items && orderData.items.length > 0 ? orderData.items.reduce((total, item) => total + (item.productAmount * item.quantity), 0).toLocaleString(): 0}원
                                </Text>
                            </Grid>
                        </Box>
                    </Box>

                    {/* 주문정보 */}
                    <Box mb={8} borderWidth="1px" overflow="hidden">
                        <Box p={4} bg="gray.100">
                            <Text fontSize="lg" fontWeight="bold">주문정보</Text>
                        </Box>
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
                    <Box borderWidth="1px" overflow="hidden">
                        <Box p={4} bg="gray.100">
                            <Text fontSize="lg" fontWeight="bold">배송지정보</Text>
                        </Box>
                        <Box p={4}>
                            <VStack spacing={4} align="stretch">
                                <HStack>
                                    <Box w="150px" fontWeight="bold">받으시는 분</Box>
                                    <Box>{orderData.receiverName}</Box>
                                </HStack>
                                <HStack>
                                    <Box w="150px" fontWeight="bold">주소</Box>
                                    <Box>{`${orderData.detailAddress1} ${orderData.detailAddress2} ${orderData.detailAddress3}`}</Box>
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
