import React, { useState, useEffect } from 'react';
import { getAllOrders } from "@/services/OrderAPI";
import { Box, Heading, Table, createListCollection } from '@chakra-ui/react';
import { Toaster } from "@/components/ui/toaster";
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
  } from "@/components/ui/select"

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const getOrderStatus = (status) => {
        const statusMap = {
            'PENDING': '주문 대기',
            'PAYMENTPROCESSED': '결제 완료',
            'DELIVERYPROCESSED': '배송 완료',
            'REFUNDPROCESSED': '환불 완료'
        };
        return statusMap[status] || status;
    };
    
    const orderStatusOptions = createListCollection({
        items: [
            { value: 'PENDING', label: '주문 대기' },
            { value: 'PAYMENTPROCESSED', label: '결제 완료' },
            { value: 'DELIVERYPROCESSED', label: '배송 완료' },
            { value: 'REFUNDPROCESSED', label: '취소 완료' }
        ],
    })
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
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">아이디</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md">이름</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md">연락처</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">배송 주소</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">결제 금액</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">주문일</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md"fontWeight="bold">주문 상태</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {orders.map((order) => ( 
                            <Table.Row >
                                <Table.Cell>{order.email}</Table.Cell>
                                <Table.Cell>{order.deliveryAddress.receiverName}</Table.Cell> 
                                <Table.Cell>{order.deliveryAddress.receiverContact}</Table.Cell> 
                                <Table.Cell>{order.deliveryAddress ? order.deliveryAddress.deliveryAddress1+" "+order.deliveryAddress.deliveryAddress2+" "+order.deliveryAddress.deliveryAddress3 :" "}</Table.Cell>
                                <Table.Cell>{order.totalPrice.toLocaleString()}원</Table.Cell>
                                <Table.Cell>{order.regDate}</Table.Cell>
                                <Table.Cell>
                                <SelectRoot collection={orderStatusOptions} size="xs" width="100px">
                                    <SelectTrigger>
                                        <SelectValueText placeholder="주문상태" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orderStatusOptions.items.map((movie) => (
                                            <SelectItem item={movie} key={movie.value}>
                                                {movie.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </SelectRoot>
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