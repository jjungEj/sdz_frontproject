import React, { useState, useEffect } from 'react';
import { getAllOrders, deleteOrderByAdmin, updateOrderStatus, deleteOrder } from "@/services/OrderAPI";
import { Box, Button, HStack, Heading, Table, createListCollection,Stack } from '@chakra-ui/react';
import { VscCircleSlash, VscTrash } from 'react-icons/vsc';
import { useSearchParams } from 'react-router-dom';
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from '@/components/ui/pagination';
import { Checkbox } from '@/components/ui/checkbox';
import { Toaster } from '@/components/ui/toaster';
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
    const [selection, setSelection] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);

    const hasSelection = selection.length > 0
    const indeterminate = hasSelection && selection.length < orders.length

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
                await deleteOrder(orderId); // deleteOrder API 호출
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
    const handleDeleteOrders = () => {
        if (selection.length === 0) {
            alert('삭제할 주문을 선택하세요.');
            return;
        }
        const confirmed = window.confirm('삭제하시겠습니까?');
        if (confirmed) {
            deleteOrderByAdmin(selection)
                .then(() => {
                    loadOrders();
                })
                .catch((error) => {
                });
        } else {
            alert('취소되었습니다.');
        }
    };
    useEffect(() => {
        loadOrders();
    }, [page]);

    const loadOrders = () => {
        getAllOrders(page, pageSize)
            .then((data) => {
                setOrders(data.dtoList);
                setTotalPages(data.total);
            }).catch((error) => {
                console.error('회원 목록을 가져오는 중 오류가 발생했습니다:', error);
            });
        };
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSearchParams({ page: newPage });
    };

    return (
        <Box>
            <Toaster />
            <Box display='flex' justifyContent='space-between'          
                alignItems='center'mt='5' mb='3'> 
            <HStack gap='0' alignItems='center'>
                <Heading as="h1" size="xl" mb={3}>주문 관리</Heading>
            </HStack>
            <HStack gap='0'>
                <Button
                    variant='plain'
                    onClick={() => handleDeleteOrders()}
                >
                    <VscTrash />
                </Button>
            </HStack>
            </Box>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb="3" />
            <Box display="flex" justifyContent="center" margin="5">
                <Table.Root width='100%' variant="outline"  borderRadius='2xl'>
                    <Table.Header>
                        <Table.Row >
                            <Table.ColumnHeader textAlign='center'>
                                <Checkbox
                                    top='1'
                                    aria-label='Select all rows'
                                    checked={indeterminate ? 'indeterminate' : selection.length > 0}
                                    onCheckedChange={(changes) => {
                                        setSelection(
                                            changes.checked ? orders.map((order) => order.orderId) : [],
                                        )
                                    }}
                                />
                            </Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md" textAlign='center'>주문번호</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md" textAlign='center'>아이디</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md" textAlign='center'>이름</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md" textAlign='center'>연락처</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md" textAlign='center'>배송주소</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md" textAlign='center'>결제 금액</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md" textAlign='center'>주문일</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md" textAlign='center'>주문 상태</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md" textAlign='center'>주문 삭제</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {orders.map((order) => ( 
                            <Table.Row key={order.orderId}>
                                <Table.Cell textAlign='center'>
                                    <Checkbox
                                        top='1'
                                        aria-label='Select row'
                                        checked={selection.includes(order.orderId)}
                                        onCheckedChange={(changes) => {
                                            setSelection((prev) =>
                                                changes.checked ? [...prev, order.orderId]
                                                : selection.filter((orderId) => orderId !== order.orderId),
                                            )
                                        }}
                                    />
                                </Table.Cell>
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
            <Stack
                gap='4'
                alignItems='center'
                mt='3'
                mb='3'
            >
                    <PaginationRoot
                        page={page}
                        count={totalPages}
                        pageSize={pageSize}
                        onPageChange={(e) => handlePageChange(e.page)}
                    >
                        <HStack>
                            <PaginationPrevTrigger />
                            <   PaginationItems />
                            <PaginationNextTrigger />
                        </HStack>
                    </PaginationRoot>
                </Stack>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box>
    );

}
export default OrderManagement;