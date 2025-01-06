import React, { useState, useEffect } from 'react';
import { getAllOrders, deleteOrderByAdmin, updateOrderStatus } from "@/services/OrderAPI";
import { Box, Button, Heading, Table, createListCollection } from '@chakra-ui/react';
import { Toaster } from "@/components/ui/toaster";

function OrderManagement() {
    const [orders, setOrders] = useState([]);

    const orderStatusOptions = createListCollection({
        items: [
            { value: 'PENDING', label: '주문 대기' },
            { value: 'PAYMENTPROCESSED', label: '결제 완료' },
            { value: 'DELIVERYPROCESSED', label: '배송 완료' },
            { value: 'REFUNDPROCESSED', label: '환불 완료' }
        ],
    });

    const getOrderStatusInKorean = (status) => {
        const statusMap = {
            'PENDING': '주문 대기',
            'PAYMENTPROCESSED': '결제 완료',
            'DELIVERYPROCESSED': '배송 완료',
            'REFUNDPROCESSED': '환불 완료'
        };
        return statusMap[status] || status;
    };

    const handleStatusChange = async (event, orderId) => {
        const orderStatus = event.target.value;
        console.log('orderId:', orderId, 'orderStatus:', orderStatus);
        try {
            await updateOrderStatus(orderId, orderStatus); // API 호출
            alert("주문 상태가 변경되었습니다.");

            // 상태 업데이트 후 주문 목록 새로고침
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.orderId === orderId
                        ? { ...order, orderStatus }
                        : order
                )
            );
        } catch (error) {
            console.error("주문 상태 변경 실패:", error);
            alert("주문 상태 변경에 실패했습니다.");
        }
    };
    
    const handleDeleteOrder = async (orderId) => {
        if (!orderId) {
            alert("주문 정보를 찾을 수 없습니다.");
            return;
        }
        try {
            const confirmed = window.confirm('주문을 삭제하시겠습니까?');
            if (confirmed) {
                await deleteOrderByAdmin(orderId); // deleteOrder API 호출
                // 성공적으로 삭제된 경우
                alert("주문이 삭제되었습니다.");
                // 주문 목록 새로고침
                loadOrders(); // 주문 목록을 다시 불러오는 함수
            }
        } catch (error) {
            console.error('주문 삭제 실패:', error);
            alert("주문 삭제에 실패했습니다.");
        }
    };
    useEffect(() => {
        loadOrders();
    }, []);

    function loadOrders() {
        getAllOrders()
            .then(data => {
                console.log("Fetched orders:", data); // 데이터 확인
                setOrders(data);
            })
            .catch(error => {
                console.error('Failed to fetch orders:', error);
            });
    }

    return (
        <Box>
            <Toaster />
            <Heading as="h1" size="xl" mb={3}>주문 관리</Heading>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
            <Box display="flex" justifyContent="center" margin="5">
                <Table.Root width='100%' variant="outline"  borderRadius='2xl'>
                    <Table.Header>
                        <Table.Row >
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">주문번호</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">아이디</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">이름</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">연락처</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">배송주소</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">결제 금액</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">주문일</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">주문 상태</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">주문 삭제</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {orders.map((order) => ( 
                            <Table.Row >
                                <Table.Cell>{order.orderId}</Table.Cell>
                                <Table.Cell>{order.email}</Table.Cell>
                                <Table.Cell>{order.deliveryAddress.receiverName}</Table.Cell> 
                                <Table.Cell>{order.deliveryAddress.receiverContact}</Table.Cell> 
                                <Table.Cell>{order.deliveryAddress ? order.deliveryAddress.deliveryAddress1+" "+order.deliveryAddress.deliveryAddress2+" "+order.deliveryAddress.deliveryAddress3 :" "}</Table.Cell>
                                <Table.Cell>{order.totalPrice.toLocaleString()}원</Table.Cell>
                                <Table.Cell>{order.regDate}</Table.Cell>
                                <Table.Cell>{getOrderStatusInKorean(order.orderStatus)}</Table.Cell>
                                <Table.Cell>
                                    <Button 
                                    variant='outline'
                                    onClick={() => handleDeleteOrder(order.orderId)}>
                                        삭제
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box>
    );
}

export default OrderManagement;