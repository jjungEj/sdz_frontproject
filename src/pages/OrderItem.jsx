import React, { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {fetchOrderItemData, modifyOrderItem, clearOrderItem, mergeGuestOrderItem} from "@/services/OrderItemAPI";
import { Box, HStack, VStack, Heading, Table, Button, Text } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster";
import { Checkbox } from "@/components/ui/checkbox";

function OrderItem() {
    const [OrderItemData, setOrderItemData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();
    const hasSelection = selectedItems.length > 0;
    const indeterminate = hasSelection && selectedItems.length < OrderItemData?.orderItemDetails.length;

    useEffect(() => {
        const initializeCart = async () => {
            try {
                const isLoggedIn = !!localStorage.getItem("access");
                if (isLoggedIn) {
                    // 로그인된 사용자: 게스트 장바구니 병합
                    await mergeGuestOrderItem();
                }
                await fetchData();
            } catch (error) {
                console.error("Error initializing cart:", error);
            }
        };

        initializeCart();
    }, []);

    const fetchData = async () => {
        try {
            const data = await fetchOrderItemData();
            setOrderItemData(data);
            setError(null);

            const newProductIds = data.orderItemDetails.map((item) => item.productId);
            const preservedSelection = selectedItems.filter((id) => newProductIds.includes(id));
            setSelectedItems(preservedSelection.length === 0 ? newProductIds : preservedSelection);
        } catch (err) {
            toaster.create({
                title: err.message,
                type: "error",
                isClosable: true,
                duration: 3000,
            });
        }
    };

    const handleDeleteSelectedItems = async () => {
        try {
            for (const productId of selectedItems) {
                const item = OrderItemData.orderItemDetails.find((item) => item.productId === productId);
                if (item) {
                    await modifyOrderItem(productId, -item.quantity);
                }
            }
            fetchData();
        } catch (err) {
            toaster.create({
                title: err.message,
                type: "error",
                isClosable: true,
                duration: 3000,
            });
        }
    };

    const handleAddItem = async (productId) => {
        try {
            await modifyOrderItem(productId, 1);
            fetchData();
        } catch (error) {
            toaster.create({
                title: error.message,
                type: "error",
                isClosable: true,
                duration: 3000,
            });
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await modifyOrderItem(productId, -1);
            fetchData();
        } catch (err) {
            toaster.create({
                title: err.message,
                type: "error",
                isClosable: true,
                duration: 3000,
            });
        }
    };

    const handleClearOrderItem = async () => {
        try {
            await clearOrderItem();
            fetchData();
        } catch (err) {
            toaster.create({
                title: err.message,
                type: "error",
                isClosable: true,
                duration: 3000,
            });
        }
    };

    const handleCheckout = () => {
        if (!OrderItemData || !OrderItemData.orderItemDetails) {
            console.error("OrderItemData is not available");
            return;
        }
        const selectedProducts = OrderItemData.orderItemDetails.filter(item => selectedItems.includes(item.productId));
        navigate('/checkout', { state: { orderData: selectedProducts } });
    };

    const rows = (OrderItemData?.orderItemDetails ?? []).map((item) =>
        <Table.Row key={item.productId}>
            <Table.Cell>
                <Checkbox
                    aria-label="Select row"
                    checked={selectedItems.includes(item.productId)}
                    onCheckedChange={(changes) => {
                        setSelectedItems((prev) =>
                            changes.checked
                                ? [...prev, item.productId]
                                : selectedItems.filter((productId) => productId !== item.productId),
                        )
                    }}
                />
            </Table.Cell>
            <Table.Cell>
                <HStack spacing={3}>
                    <img
                        src={`http://34.64.176.77${item.thumbnailPath}`}
                        alt={item.productName}
                        style={{
                            width: "75px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    />
                    <VStack align="flex-start" spacing={1}>
                        <Text as={RouterLink} to={`/product/${item.productId}`} fontWeight="bold" color="teal.500">
                            {item.productName}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                            ({item.productId})
                        </Text>
                    </VStack>
                </HStack>
            </Table.Cell>
            <Table.Cell>{item.productAmount.toLocaleString()} 원</Table.Cell>
            <Table.Cell>
                <HStack spacing={3} align="center" justify="center" minW="100px">
                    <Button onClick={() => handleRemoveItem(item.productId)} variant="plain" size="xs" w="30px">-</Button>
                    <Text textAlign="center" w="40px" fontSize="sm">{item.quantity}</Text>
                    <Button onClick={() => handleAddItem(item.productId)} variant="plain" size="xs" w="30px">+</Button>
                </HStack>
            </Table.Cell>
            <Table.Cell>{(item.productAmount * item.quantity).toLocaleString()} 원</Table.Cell>
        </Table.Row>
    );

    return (
        <Box>
            <Toaster />
            <Heading as="h1" size="xl" mb={3}>장바구니</Heading>
            <Box borderBottom="1px solid black" mb={3} />
            {OrderItemData?.orderItemDetails.length > 0 ? (
                <>
                    <Table.Root style={{ width: "100%", marginBottom: "20px" }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>
                                    <Checkbox
                                        aria-label="Select all rows"
                                        checked={indeterminate ? "indeterminate" : selectedItems.length > 0}
                                        onCheckedChange={(changes) => {
                                            setSelectedItems(
                                                changes.checked ? OrderItemData.orderItemDetails.map((item) => item.productId) : [],
                                            )
                                        }}
                                    />
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>제품정보</Table.ColumnHeader>
                                <Table.ColumnHeader>판매가격</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center" w="100px">수량</Table.ColumnHeader>
                                <Table.ColumnHeader>주문금액</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>{rows}</Table.Body>
                    </Table.Root>
                    <HStack justify="space-between" mb={5}>
                        <HStack mt={-10}>
                            <Button onClick={handleDeleteSelectedItems} variant="plain" size="xs">선택삭제</Button>
                            <Button onClick={handleClearOrderItem} variant="plain" size="xs" ml={-3}>전체삭제</Button>
                        </HStack>
                        <Heading mr={1}>
                            총 결제금액: {OrderItemData.orderItemDetails.reduce((total, item) => {
                            return selectedItems.includes(item.productId)
                                ? total + item.productAmount * item.quantity
                                : total;
                        }, 0).toLocaleString()} 원
                        </Heading>
                    </HStack>
                    <Button w="100%" onClick={handleCheckout}>{selectedItems.length}개 상품 구매하기</Button>
                </>
            ) : (
                <VStack h="100%" justify="center" align="center">
                    <Heading>장바구니에 담긴 상품이 없습니다.</Heading>
                </VStack>
            )}
        </Box>
    );
}

export default OrderItem;
