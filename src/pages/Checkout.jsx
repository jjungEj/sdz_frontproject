import React, { useState } from 'react';
import { Box, VStack, HStack, Grid, GridItem, Text, Input, Button, Image } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { createOrder } from '../services/OrderAPI.js';

function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const orderData = location.state?.orderData || [];
    const [paymentMethod, setPaymentMethod] = useState('');
    const [existingAddressId, setExistingAddressId] = useState(null);
    const [userInfo, setUserInfo] = useState({
        email: '',
        name: '',
        phone: '',
        receiverName: '',
        detailAddress1: '',
        detailAddress2: '',
        detailAddress3: '',
        request: '',
        isDefaultAddress: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handlePayment = async () => {
        // 입력 검증
        if (!userInfo.email) {
            toast({ title: "이메일을 입력해주세요", status: "error", duration: 3000 });
            return;
        }
        if (!paymentMethod) {
            toast({ title: "결제 방법을 선택해주세요", status: "error", duration: 3000 });
            return;
        }
        if (!userInfo.name || !userInfo.detailAddress1 || !userInfo.detailAddress2 || !userInfo.detailAddress3 || !userInfo.phone) {
            toast({ title: "배송 정보를 모두 입력해주세요", status: "error", duration: 3000 });
            return;
        }
        if (!userInfo.request) {
            toast({ title: "배송 요청사항을 입력해주세요", status: "error", duration: 3000 });
            return;
        }
    
        try {
            // 주문 데이터 생성
            const orderPayload = {
                orderItems: orderData.map((item) => ({
                    orderItemId: item.orderItemId,
                    orderItemDetails: [{
                        productId: item.productId,
                        quantity: item.quantity,
                        productName: item.productName,
                        productAmount: item.productAmount,
                        thumbnailPath: item.productImage
                    }]
                })),
                deliveryAddress: {
                    deliveryAddressId: null,
                    email: userInfo.email,
                    receiverName: userInfo.receiverName,
                    receiverContact: userInfo.phone,
                    deliveryAddress1: userInfo.detailAddress1,
                    deliveryAddress2: userInfo.detailAddress2,
                    deliveryAddress3: userInfo.detailAddress3,
                    deliveryRequest: userInfo.request,
                    defaultCheck: userInfo.isDefaultAddress
                },
                paymentMethod: paymentMethod,
                totalPrice: orderData.reduce((total, item) => total + (item.productAmount * item.quantity), 0),
                refundStatus: false
            };
    
            console.log("주문 데이터:", orderPayload);
            
            // 주문 생성 API 호출
            const response = await createOrder(orderPayload);
            console.log("주문 생성 성공:", response);
    
            // API 응답에서 orderId 확인
            if (response && response.orderId) {
                // 주문 완료 메시지와 확인 버튼을 가진 팝업창 생성
                toast({
                    title: "주문이 완료되었습니다.",
                    status: "success",
                    duration: 3000,
                    onCloseComplete: () => {
                        // 팝업이 닫힌 후 주문 완료 화면으로 이동
                        navigate(`/order/44`, { state: { orderId: 44 } });
                    }
                });
            } else {
                console.error("주문 ID가 없습니다:", response);
                toast({
                    title: "주문 생성 실패",
                    description: "주문 ID를 찾을 수 없습니다.",
                    status: "error",
                    duration: 3000,
                });
            }
    
        } catch (error) {
            console.error('주문 생성 실패:', error);
            
            // 오류 메시지 표시
            toast({
                title: "주문 처리 중 오류",
                description: error.response?.data?.message || error.message || "문제가 발생했습니다.",
                status: "error",
                duration: 3000
            });
        }
    };
    

    return (
        <Box maxW="800px" mx="auto" p={8}>
            <Text fontSize="2xl" fontWeight="bold" mb={8}>주문 결제</Text>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Box borderWidth="1px" borderRadius="lg">
                        <Grid templateColumns="2fr 1fr 1fr 1fr" bg="gray.50" p={4} gap={4} borderBottomWidth="1px">
                            <Text textAlign="center">제품정보</Text>
                            <Text textAlign="center">판매가격</Text>
                            <Text textAlign="center">수량</Text>
                            <Text textAlign="center">주문금액</Text>
                        </Grid>
                        {orderData.map((item) => (
                            <Grid key={item.productId} templateColumns="2fr 1fr 1fr 1fr" bg="gray.50" p={4} gap={4} borderBottomWidth="1px" alignItems="center">
                                <HStack>
                                    <Box w="60px" h="60px" bg="gray.100" borderWidth="1px">
                                        <Image src={item.productImage} alt="상품이미지" fallbackSrc="placeholder.jpg" objectFit="cover" w="100%" h="100%"/>
                                    </Box>
                                    <Text>{item.productName || item.productId}</Text>
                                </HStack>
                                <Text textAlign="center">{item.productAmount.toLocaleString()}원</Text>
                                <Text textAlign="center">{item.quantity}</Text>
                                <Text textAlign="center">{(item.productAmount * item.quantity).toLocaleString()}원</Text>
                            </Grid>
                        ))}
                        <Grid templateColumns="2fr 1fr 1fr 1fr" bg="gray.50" p={4} gap={4}>
                            <GridItem colSpan={3}>
                                <Text textAlign="right" fontWeight="bold">총 결제금액</Text>
                            </GridItem>
                            <Text textAlign="center" fontWeight="bold">
                                {orderData.reduce((total, item) => total + (item.productAmount * item.quantity), 0).toLocaleString()}원
                            </Text>
                        </Grid>
                    </Box>
                </Box>
                <HStack spacing={8} align="flex-start">
                    <Box maxWidth="400px" borderWidth="1px" p={4}>
                        <Field label="이름">
                            <Input name="name" value={userInfo.name} onChange={handleInputChange} placeholder="입력해주세요"/>
                        </Field>
                        <Field label="이메일" mt={4}>
                            <Input name="email" value={userInfo.email} onChange={handleInputChange} placeholder="입력해주세요"/>
                        </Field>
                        <Field label="휴대전화" mt={4}>
                            <Input name="phone" value={userInfo.phone} onChange={handleInputChange} placeholder="입력해주세요"/>
                        </Field>
                    </Box>
                    <Box maxWidth="400px" borderWidth="1px" p={4}>
                        <Field label="받는 사람">
                            <Input name="receiverName" value={userInfo.receiverName} onChange={handleInputChange} placeholder="입력해주세요"/>
                        </Field>
                        <Field label="우편번호" mt={4}>
                            <Input name="detailAddress1" value={userInfo.detailAddress1} onChange={handleInputChange} placeholder="입력해주세요"/>
                        </Field>
                        <Field label="주소" mt={4}>
                            <Input name="detailAddress2" value={userInfo.detailAddress2} onChange={handleInputChange} placeholder="입력해주세요"/>
                        </Field>
                        <Field label="상세주소" mt={4}>
                            <Input name="detailAddress3" value={userInfo.detailAddress3} onChange={handleInputChange} placeholder="입력해주세요"/>
                        </Field>
                        <Field label="배송 요청사항" mt={4}>
                            <Input name="request" value={userInfo.request} onChange={handleInputChange} placeholder="입력해주세요"/>
                        </Field>
                        <Field label="기본 배송지로 설정" mt={4}>
                            <Checkbox
                                isChecked={userInfo.isDefaultAddress}
                                onChange={(e) => setUserInfo(prev => ({ ...prev, isDefaultAddress: e.target.checked }))}
                            >
                                기본 배송지로 설정
                            </Checkbox>
                        </Field>
                    </Box>
                </HStack>
                <Box maxW="600px" mx="auto" textAlign="center">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>결제 방법</Text>
                    <HStack spacing={4}>
                        <Checkbox checked={paymentMethod === 'credit'} onCheckedChange={() => setPaymentMethod(prev => prev === 'credit' ? '' : 'credit')}>
                            신용카드
                        </Checkbox>
                        <Checkbox checked={paymentMethod === 'bank'} onCheckedChange={() => setPaymentMethod(prev => prev === 'bank' ? '' : 'bank')}>
                            계좌이체
                        </Checkbox>
                        <Checkbox checked={paymentMethod === 'virtual'} onCheckedChange={() => setPaymentMethod(prev => prev === 'virtual' ? '' : 'virtual')}>
                            무통장입금
                        </Checkbox>
                    </HStack>
                </Box>
                <Box>
                    <Button w="100%" colorScheme="blue" size="sm" onClick={handlePayment}>
                        결제하기
                    </Button>
                </Box>
            </VStack>
        </Box>
    );
}

export default Checkout;
