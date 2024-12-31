import React, { useState, useEffect } from 'react';
import { Box, Image, Text, Flex, Button, HStack, VStack } from '@chakra-ui/react';
import { getUserOrders } from '@/services/OrderAPI';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);S
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;

    // 주문 데이터 가져오기
    const fetchOrders = async () => {
        try {
            const response = await getUserOrders();
            if (Array.isArray(response)) {
                setOrders(response); // 데이터가 배열 형식인 경우만 설정
                setTotalPages(Math.ceil(response.length / itemsPerPage)); // 전체 페이지 수 계산
            } else {
                console.error('Invalid data format');
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const getCurrentPageOrders = () => {
        if (!orders || orders.length === 0) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        return orders.slice(startIndex, startIndex + itemsPerPage);
    };

    const getOrderStatus = (status) => {
        const statusMap = {
            'PENDING': '주문 대기',
            'PAYMENTPROCESSED': '결제 완료',
            'DELIVERYPROCESSED': '배송 완료',
            'REFUNDPROCESSED': '환불 완료'
        };
        return statusMap[status] || status;
    };
    useEffect(() => {
        fetchOrders();
    }, [currentPage]);
    return (
        <Box p={5}>
            <Text fontSize="2xl" mb={5} fontWeight="bold">주문내역 조회</Text>
            
            {getCurrentPageOrders().map((order) => (
                <Box 
                    key={order.orderId}
                    borderWidth="1px"
                    borderRadius="lg"
                    p={4}
                    mb={4}
                    shadow="md"
                >
                    <Text fontSize="lg" fontWeight="bold" mb={3}>
                        주문번호: {order.orderId}
                    </Text>
                    
                    {order.orderDetails && order.orderDetails.map((detail, index) => (
                        <Flex key={detail.orderDetailId} alignItems="center" mb={3}>
                            <Image 
                                src={detail.product?.imageUrl || 'default-image.jpg'} 
                                boxSize="100px"
                                objectFit="cover"
                                mr={4}
                            />
                            <VStack align="start" spacing={1}>
                                <Text>상품 수량: {detail.orderCount}개</Text>
                                <Text>상품 금액: {detail.orderAmount}원</Text>
                            </VStack>
                        </Flex>
                    ))}
                    
                    <Box mt={3} p={3} bg="gray.50" borderRadius="md">
                        <Text>배송지: {order.deliveryAddress?.deliveryAddress1} 
                            {order.deliveryAddress?.deliveryAddress2} {order.deliveryAddress?.deliveryAddress3}</Text>
                        <Text>총 주문금액: {order.totalPrice}원</Text>
                        <Text>주문상태: {getOrderStatus(order.orderStatus)}</Text>
                        <Text>환불가능여부: {order.refundStatus ? '가능' : '불가능'}</Text>
                    </Box>
                </Box>
            ))}

        </Box>
    );
}

export default OrderHistory;
