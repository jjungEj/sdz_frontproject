import React, { useEffect, useState } from 'react';
import { Box, VStack, Text, Button } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();

    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const orderInfo = location.state?.orderData; // 전달된 orderData 확인
        if (orderInfo) {
            setOrderData(orderInfo);
        } else {
            console.error("주문 정보가 없습니다:", location.state); // 디버깅을 위한 로그 추가
        }
    }, [location]);

    const handleGoToOrderList = () => {
        navigate('/mypage/orders'); // 주문 목록으로 이동
    };

    return (
        <Box maxW="800px" mx="auto" p={8}>
            {orderData ? (
                <VStack spacing={6} align="stretch">
                    <Text fontSize="2xl" fontWeight="bold" textAlign="center">주문 완료</Text>

                    <Box p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
                        <Text fontSize="xl" fontWeight="bold" mb={2}>주문 정보</Text>
                        <Box borderBottom="1px solid" my={4}/>
                        <VStack align="start">
                            <Text><strong>주문번호:</strong> {orderData.orderId}</Text>
                            <Text><strong>이름:</strong> {orderData.deliveryAddress.receiverName}</Text>
                            <Text><strong>연락처:</strong> {orderData.deliveryAddress.receiverContact}</Text>
                            <Text><strong>주소:</strong> {orderData.deliveryAddress.deliveryAddress1} {orderData.deliveryAddress.deliveryAddress2} {orderData.deliveryAddress.deliveryAddress3}</Text>
                            <Text><strong>배송 요청사항:</strong> {orderData.deliveryAddress.deliveryRequest}</Text>
                            <Text><strong>결제 방법:</strong> {orderData.paymentMethod}</Text>
                            <Text><strong>총 결제금액:</strong> {orderData.totalAmount.toLocaleString()} 원</Text>
                        </VStack>
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
