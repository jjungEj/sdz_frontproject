import React, { useState, useEffect } from 'react';
import { Box, Image, Text, Flex, Button, HStack } from '@chakra-ui/react';
import { getUserOrders } from '../../services/OrderAPI';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 3; // 페이지당 보여줄 주문 수

    useEffect(() => {
        // 실제 구현시 로그인된 사용자의 ID를 사용
        const userId = "testuser@example.com"; 
        fetchOrders(userId);
    }, [currentPage]);

    const fetchOrders = async (userId) => {
        try {
            const response = await getUserOrders(userId);
            setOrders(response);
            setTotalPages(Math.ceil(response.length / itemsPerPage));
        } catch (error) {
            //console.error('주문 내역을 불러오는데 실패했습니다:', error);
        }
    };

    // 현재 페이지에 해당하는 주문만 표시
    const getCurrentPageOrders = () => {
        if (!orders || orders.length === 0) {
            //return [];
        }
        const startIndex = (currentPage - 1) * itemsPerPage;
        return orders.slice(startIndex, startIndex + itemsPerPage);
    };

    return (
        <Box p={5}>
            <Text fontSize="2xl" mb={5}>주문 내역</Text>
            
            {getCurrentPageOrders().map((order) => (
                <Box 
                    key={order.orderId}
                    borderWidth="1px"
                    borderRadius="lg"
                    p={4}
                    mb={4}
                    shadow="md"
                >
                    <Flex alignItems="center">
                        <Image 
                            src={order.imageUrl || 'default-image.jpg'} 
                            boxSize="100px"
                            objectFit="cover"
                            mr={4}
                        />
                        <Box>
                            <Text>주문번호: {order.orderId}</Text>
                            <Text>주문 수량: {order.orderCount}</Text>
                            <Text>주문 금액: {order.orderAmount}원</Text>
                            <Text>상태: {order.refundStatus ? '환불됨' : '주문완료'}</Text>
                        </Box>
                    </Flex>
                </Box>
            ))}

            {/* 페이지네이션 
            <Flex justify="center" mt={5}>
                <HStack spacing={2}>
                    <Button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        isDisabled={currentPage === 1}
                    >
                        이전
                    </Button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                        <Button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            colorScheme={currentPage === index + 1 ? "blue" : "gray"}
                        >
                            {index + 1}
                        </Button>
                    ))}
                    
                    <Button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        isDisabled={currentPage === totalPages}
                    >
                        다음
                    </Button>
                </HStack>
                
            </Flex>
            */}
        </Box>
    );
}

export default OrderHistory;