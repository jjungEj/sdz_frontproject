import React, { useState, useEffect } from 'react';
import { Box, Image, Text, Flex, Button, HStack, VStack } from '@chakra-ui/react';
import { getUserOrders, deleteOrder } from '@/services/OrderAPI';
import { useNavigate } from 'react-router-dom';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;
    const navigate = useNavigate();
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
    const handleDeleteOrder = async (orderId) => {
        try {
          if (window.confirm('주문을 취소하시겠습니까?')) {
            await deleteOrder(orderId);
            setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
            toast({
              title: "주문이 취소되었습니다.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
        } catch (error) {
          console.error('주문 취소 실패:', error);
          toast({
            title: "주문 취소에 실패했습니다.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      };

    return (
        <Box p={8}>
          <Text fontSize="2xl" mb={5} fontWeight="bold">주문내역 조회</Text>
          <Flex direction="column" align="center" maxW="flex">
          {getCurrentPageOrders().map((order) => (
            <Flex 
              key={order.orderId}
              borderWidth="1px"
              borderRadius="lg"
              p={8}
              mb={6}
              alignItems="center"
              maxW="flex" 
            >
              
              <img
                src={`${item.thumbnailPath}`}
                alt={item.productName}
                style={{
                  width: "75px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              
              <Box flex="1" position="relative">
                <Flex justify="space-between" align="flex-start" mb={2}>
                  <Text fontSize="lg" fontWeight="bold">주문번호: {order.orderId}</Text>
                </Flex>
                <Text fontSize="m" mb={1}>주문날짜: {order.regDate}</Text>
                <Text fontSize="m" mb={1}>배송지: {order.deliveryAddress?.deliveryAddress1} {order.deliveryAddress?.deliveryAddress2} {order.deliveryAddress?.deliveryAddress3}</Text>
                <Text fontSize="m" mb={1}>주문금액: {order.totalPrice.toLocaleString()}원</Text>
                <Text fontSize="m" fontWeight="semibold">{getOrderStatus(order.orderStatus)}</Text>
              </Box>
              <Button 
                colorScheme="blackAlpha"
                size="sm"
                ml={2}
                onClick={() => handleDeleteOrder(order.orderId)}
                alignSelf="flex-end"
              >주문취소</Button>
            </Flex>
          ))}
          </Flex>
        </Box>
      
    );
}

export default OrderHistory;
