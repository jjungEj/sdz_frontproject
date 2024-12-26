import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { fetchOrderItemData, modifyOrderItem, clearOrderItem } from "../services/OrderItemAPI";
import { Box, Stack, HStack, VStack, Link, Heading, Table, Button, Text, } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster"
import { Checkbox } from "@/components/ui/checkbox"
// import { Button } from "@/components/ui/button"

function OrderItem() {
    const [OrderItemData, setOrderItemData] = useState(null); // 장바구니 데이터 상태
    const [error, setError] = useState(null); // 에러 상태
    const [selectedItems, setSelectedItems] = useState([]); // 선택된 상품 ID 상태
    const navigate = useNavigate();
    const hasSelection = selectedItems.length > 0;
    const indeterminate = hasSelection && selectedItems.length < OrderItemData.orderItemDetails.length;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await fetchOrderItemData();
            setOrderItemData(data);
            setError(null);

            // 기존 체크 상태와 데이터 비교
            const newProductIds = data.orderItemDetails.map((item) => item.productId);

            // 새 데이터에도 존재하는 기존 선택 항목 유지
            const preservedSelection = selectedItems.filter((id) => newProductIds.includes(id));

            // 첫 로딩 시에는 전체 선택, 이후에는 유지된 선택 항목만 유지
            setSelectedItems(preservedSelection.length === 0 ? newProductIds : preservedSelection);
        } catch (err) {
            toaster.create({
                title: error.message,
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
                title: error.message,
                type: "error",
                isClosable: true,
                duration: 3000,
            });
        }
    };

    const handleAddItem = async (productId) => {
        try {
            await modifyOrderItem(
                productId, 1);
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
                title: error.message,
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
                title: error.message,
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
        <Table.Row
            key={item.productId}
            data-selected={selectedItems.includes(item.productId) ? "" : undefined}
        >
            <Table.Cell>
                <Checkbox
                    top="1"
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
                    {/* 추가: 썸네일 이미지 표시 */}
                    <img
                        src={`http://localhost:8080${item.thumbnailPath}`} // 썸네일 경로 사용
                        alt={item.productName}
                        style={{
                            width: "75px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    />
                    <Text>{item.productName} ({item.productId})</Text>
                </HStack>
            </Table.Cell>
            <Table.Cell>
                {item.productAmount.toLocaleString()} 원
            </Table.Cell>
            <Table.Cell >
                <HStack>
                    <Button onClick={() => handleRemoveItem(item.productId)} variant="plain" size="xs">-</Button>
                    <Text >{item.quantity}</Text>
                    <Button onClick={() => handleAddItem(item.productId)} variant="plain" size="xs">+</Button>
                </HStack>
            </Table.Cell>
            <Table.Cell>
                {(item.productAmount * item.quantity).toLocaleString()} 원
            </Table.Cell>
        </Table.Row>
    )

    return (
        <Box>
            <Toaster />
            <Heading as="h1" size="xl" mb={3}>장바구니</Heading>
                                <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
            {OrderItemData?.orderItemDetails.length > 0 ? (
                <>
                    <Table.Root style={{ width: "100%", marginBottom: "20px" }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>
                                    <Checkbox
                                        top="1"
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
                                <Table.ColumnHeader>수량</Table.ColumnHeader>
                                <Table.ColumnHeader>주문금액</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {rows}
                            {}
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
                            총 결제금액 : {OrderItemData.orderItemDetails.reduce((total, item) => {
                            return selectedItems.includes(item.productId)
                                ? total + item.productAmount * item.quantity
                                : total;
                        }, 0).toLocaleString()} 원
                        </Heading>
                    </HStack>
                    <Button w="100%" onClick={handleCheckout}>
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
