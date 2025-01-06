import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Button } from '@chakra-ui/react';
import { getUserOrders, deleteOrder } from '@/services/OrderAPI';
import { useNavigate } from 'react-router-dom';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    // 주문 데이터 가져오기
    const fetchOrders = async () => {
        try {
            const orderData = await getUserOrders();
            if (Array.isArray(orderData)) {
                setOrders(orderData); // 데이터가 배열 형식인 경우만 설정
            } else {
                console.error('Invalid data format');
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
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
    }, []);

    const handleDeleteOrder = async (orderId) => {
      try {
        if (window.confirm('주문을 취소하시겠습니까?')) {
          await deleteOrder(orderId);
          // 현재 orders 상태에서 취소된 주문을 필터링하여 즉시 반영
          setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
          alert("주문이 취소되었습니다.");
        }
      } catch (error) {
        console.error('주문 취소 실패:', error);
        alert("주문 취소에 실패했습니다.");
      }
    };

    return (
        <Box p={10}>
          <Text fontSize="2xl" mb={5} fontWeight="bold">주문내역 조회</Text>
          <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
          <Flex direction="column" align="center" >
          {orders.map((orderData) => (
            <Flex 
              key={orderData.orderId}
              borderWidth="1px"
              borderRadius="lg"
              p={8}
              mb={6}
              alignItems="center"
              Width="800px"
              minWidth="800px"
            >
            <img
              src={orderData.orderItems[0].orderItemDetails[0].thumbnailPath} 
              alt={orderData.orderItems[0].orderItemDetails[0].productName}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginRight: "80px"
              }}
            />
            <Box width="100%" position="relative">
              <Flex justify="space-between" align="flex-start" mb={2}>
                <Text fontSize="lg" fontWeight="bold">주문번호: {orderData.orderId}</Text>
              </Flex>
              <Text fontSize="m" mb={1}>주문날짜: {orderData.regDate}</Text>
              <Text fontSize="m" mb={1}>
                배송지: {orderData.deliveryAddress?.deliveryAddress1} {orderData.deliveryAddress?.deliveryAddress2} {orderData.deliveryAddress?.deliveryAddress3}
              </Text>
              <Text fontSize="m" mb={1}>주문금액: {orderData.totalPrice.toLocaleString()}원</Text>
              <Text fontSize="m" fontWeight="semibold">{getOrderStatus(orderData.orderStatus)}</Text>

            </Box>
            {(orderData.orderStatus === "PENDING" || orderData.orderStatus === "PAYMENTPROCESSED")&&  (
              
              <Button 
              colorScheme="blackAlpha"
              size="sm"
              ml={2}
              onClick={() => handleDeleteOrder(orderData.orderId)}
              alignSelf="flex-end"
            >

              주문취소
            </Button>
           
            )}
            
            </Flex>
          ))}

          </Flex>
          <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box>
    );
}

export default OrderHistory;
