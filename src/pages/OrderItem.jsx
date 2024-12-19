import React, { useEffect, useState } from "react";
import { fetchOrderItemData, modifyOrderItem, clearOrderItem } from "../services/OrderItemAPI";
import { Box, Stack, HStack, VStack, Link, Heading, Table, Button, Text } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster"
import { Checkbox } from "@/components/ui/checkbox"
// import { Button } from "@/components/ui/button"

function OrderItem() {
    const [OrderItemData, setOrderItemData] = useState(null); // 장바구니 데이터 상태
    const [error, setError] = useState(null); // 에러 상태
    const [selectedItems, setSelectedItems] = useState([]); // 선택된 상품 ID 상태
    const userId = "testuser@example.com"; // 사용자 ID (임시 고정값)

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await fetchOrderItemData(userId);
            setOrderItemData(data);
            setError(null);
            setSelectedItems([]); // 선택 초기화
        } catch (err) {
            setError("장바구니 정보를 불러오는 데 실패했습니다.");
            toaster.create({
                title: error,
                type: "error",
                isClosable: true,
                duration: 3000,
            });
        }
    };

    const handleSelectItem = (productId) => {
        setSelectedItems((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === OrderItemData.orderItemDetails.length) {
            // 이미 전체 선택 상태인 경우 선택 해제
            setSelectedItems([]);
        } else {
            // 전체 선택
            setSelectedItems(OrderItemData.orderItemDetails.map((item) => item.productId));
        }
    };

    const handleDeleteSelectedItems = async () => {
        try {
            for (const productId of selectedItems) {
                const item = OrderItemData.orderItemDetails.find((item) => item.productId === productId);
                if (item) {
                    await modifyOrderItem(userId, productId, -item.quantity);
                }
            }
            fetchData();
        } catch (err) {
            setError("선택된 상품 삭제에 실패했습니다.");
            toaster.create({
                title: error,
                type: "error",
                isClosable: true,
                duration: 3000,
            });
        }
    };

    const handleAddItem = async (productId) => {
        try {
            await modifyOrderItem(userId, productId, 1);
            fetchData();
        } catch (err) {
            setError("상품 추가에 실패했습니다.");
            toaster.create({
                title: error,
                type: "error",
                isClosable: true,
                duration: 3000,
            });
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await modifyOrderItem(userId, productId, -1);
            fetchData();
        } catch (err) {
            setError("상품 제거에 실패했습니다.");
            toaster.create({
                title: error,
                type: "error",
                isClosable: true,
                duration: 3000,
            });
        }
    };

    const handleClearOrderItem = async () => {
        try {
            await clearOrderItem(userId);
            fetchData();
        } catch (err) {
            setError("장바구니 비우기에 실패했습니다.");
            toaster.create({
                title: error,
                type: "error",
                isClosable: true,
                duration: 3000,
            });
        }
    };

    return (
        <Box style={{ fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
            {OrderItemData && OrderItemData.orderItemDetails.length > 0 ? (
                <>
                    <Table.Root style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>
                                    <Checkbox
                                        top="1"
                                        aria-label="Select all rows"
                                        checked={
                                            selectedItems.length === OrderItemData.orderItemDetails.length &&
                                            selectedItems.length > 0
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </Table.ColumnHeader>
                                <Table.ColumnHeader>제품정보</Table.ColumnHeader>
                                <Table.ColumnHeader>판매가격</Table.ColumnHeader>
                                <Table.ColumnHeader>수량</Table.ColumnHeader>
                                <Table.ColumnHeader>주문금액</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {OrderItemData.orderItemDetails.map((item) => (
                                <Table.Row key={item.productId} style={{ textAlign: "center" }}>
                                    <Table.Cell>
                                        <Checkbox
                                            top="1"
                                            aria-label="Select all rows"
                                            checked={selectedItems.includes(item.productId)}
                                            onChange={() => handleSelectItem(item.productId)}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.productName} ({item.productId})
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.productAmount.toLocaleString()} 원
                                    </Table.Cell>
                                    <Table.Cell>
                                        <HStack>
                                            <Button onClick={() => handleRemoveItem(item.productId)} variant="plain" size="xs" mr={-5}>-</Button>
                                            <Text style={{ margin: "0 10px" }}>{item.quantity}</Text>
                                            <Button onClick={() => handleAddItem(item.productId)} variant="plain" size="xs" ml={-5}>+</Button>
                                        </HStack>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {(item.productAmount * item.quantity).toLocaleString()} 원
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                    <HStack justify="space-between" mb={5}>
                        <HStack mt={-10}>
                            <Button onClick={handleDeleteSelectedItems} variant="plain" size="xs">
                                선택삭제
                            </Button>
                            <Button onClick={handleClearOrderItem} variant="plain" size="xs" ml={-3}>
                                전체삭제
                            </Button>
                        </HStack>
                        <Heading mr={1}>
                            총 결제금액 : {OrderItemData.orderItemDetails
                                .filter((item) => selectedItems.includes(item.productId)) // 체크된 상품만 필터링
                                .reduce((total, item) => total + item.productAmount * item.quantity, 0)
                                .toLocaleString()} 원
                        </Heading>
                    </HStack>
                    <Button w="100%">
                        {selectedItems.length}개 상품 구매하기
                    </Button>
                </>
            ) : (
                <>
                    <VStack h="100%" justify="center" align="center">
                        <Heading>장바구니에 담긴 상품이 없습니다.</Heading>
                    </VStack>
                </>
            )
            }
        </Box >
    )
}

export default OrderItem;
