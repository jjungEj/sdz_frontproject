import React, { useState, useEffect } from 'react';
import { getAllOrders } from "../../services/OrderAPI";
import { Box, Heading, Table, } from '@chakra-ui/react';
import { Toaster } from "@/components/ui/toaster";

function OrderManagement() {
    const [orders, setOrders] = useState([]);

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
            <Box display="flex" justifyContent="center">
                <Table.Root width="100%" mt={3}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader fontSize="md">주문 번호</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md">아이디</Table.ColumnHeader>
                            {/* <Table.ColumnHeader fontSize="md">이름</Table.ColumnHeader> */}
                            {/* <Table.ColumnHeader fontSize="md">연락처</Table.ColumnHeader> */}
                            <Table.ColumnHeader fontSize="md">배송 주소</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md">결제 금액</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md">주문일</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md">주문 상태</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {orders.map((order) => ( 
                            <Table.Row >
                                <Table.Cell>{order.orderId}</Table.Cell>
                                <Table.Cell>{order.email}</Table.Cell>
                                {/* <Table.Cell>{order.user.userName}</Table.Cell> */}
                                {/* <Table.Cell>{order.user.contact}</Table.Cell> */}
                                <Table.Cell>{order.deliveryAdrres.deliveryAddress1} {order.deliveryAdrres.deliveryAddress2} {order.deliveryAdrres.deliveryAddress3}</Table.Cell>
                                <Table.Cell>{order.totalPrice}</Table.Cell>
                                <Table.Cell>{order.regDate}</Table.Cell>
                                <Table.Cell>{order.orderStatus}</Table.Cell>
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