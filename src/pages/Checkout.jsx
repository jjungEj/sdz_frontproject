import React, { useState } from 'react';
import { 
    Box, 
    VStack, 
    HStack, 
    Grid,
    GridItem,
    Text, 
    Input, 
    Button,
    Image
} from '@chakra-ui/react';
// import { useToast } from '@chakra-ui/toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { createOrder } from '../services/OrderAPI';

function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const orderData = location.state?.orderData || [];
    
    const [paymentMethod, setPaymentMethod] = useState('');
    const [userInfo, setUserInfo] = useState({
        name: '',
        address: '',
        detailAddress: '',
        phone: '',
        request: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handlePayment = async () => {
        if (!paymentMethod) {
            toast({
                title: "결제 방법을 선택해주세요",
                status: "error",
                duration: 3000,
            });
            return;
        }

        if (!userInfo.name || !userInfo.address || !userInfo.phone) {
            toast({
                title: "배송 정보를 모두 입력해주세요",
                status: "error",
                duration: 3000,
            });
            return;
        }

        try {
            const orderPayload = {
                userId: "testuser@example.com",
                orderItems: orderData.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.productAmount
                })),
                shippingInfo: {
                    receiverName: userInfo.name,
                    receiverContact: userInfo.phone,
                    deliveryAddress1: userInfo.address,
                    deliveryAddress2: userInfo.detailAddress,
                    deliveryRequest: userInfo.request
                },
                paymentMethod: paymentMethod,
                totalAmount: orderData.reduce((total, item) => 
                    total + (item.productAmount * item.quantity), 0)
            };
    
            const response = await createOrder(orderPayload.userId, orderPayload);
            if (response?.orderId) {
                navigate(`/order/${response.orderId}`);
            }
        } catch (error) {
            console.error('주문 생성 실패:', error);
            toast({
                title: "주문 처리 중 오류가 발생했습니다",
                status: "error",
                duration: 3000,
            });
        }
    };

    return (
        <Box maxW="800px" mx="auto" p={8}>
            <Text fontSize="2xl" fontWeight="bold" mb={8}>주문 결제</Text>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Box borderWidth="1px" borderRadius="lg">
                        <Grid
                            templateColumns="2fr 1fr 1fr 1fr"
                            bg="gray.50"
                            p={4}
                            gap={4}
                            borderBottomWidth="1px"
                        >
                            <Text textAlign="center">제품정보</Text>
                            <Text textAlign="center">판매가격</Text>
                            <Text textAlign="center">수량</Text>
                            <Text textAlign="center">주문금액</Text>
                        </Grid>

                        {orderData.map((item) => (
                            <Grid key={item.productId} templateColumns="2fr 1fr 1fr 1fr" bg="gray.50" p={4} gap={4} borderBottomWidth="1px" alignItems="center">
                                
                                <HStack>
                                    <Box w="60px" h="60px" bg="gray.100" borderWidth="1px">
                                        <Image src={item.productImage} alt="상품이미지" fallbackSrc="placeholder.jpg"
                                        objectFit="cover" w="100%" h="100%"/> 
                                    </Box>
                                    <Text>{item.productName || item.productId}</Text>
                                </HStack>
                                <Text textAlign="center">
                                    {item.productAmount.toLocaleString()}원
                                </Text>
                                <Text textAlign="center">
                                    {item.quantity}
                                </Text>
                                <Text textAlign="center">
                                    {(item.productAmount * item.quantity).toLocaleString()}원
                                </Text>
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
            {/* 왼쪽 박스: 배송 정보 */}
            <Box maxWidth="400px" borderWidth="1px"  p={4} ml="auto">
                <Field label="이름" >
                    <Input placeholder="입력해주세요"/>
                </Field>
                <Field label="이메일" mt={4}>
                    <Input placeholder="입력해주세요"/>
                </Field>
                <Field label="휴대전화" mt={4}>
                    <Input placeholder="입력해주세요"/>
                </Field>
            </Box>
            <Box maxWidth="400px" borderWidth="1px"  p={4} ml="auto">
                <Field label="받는 사람" >
                    <Input placeholder="입력해주세요"/>
                </Field>
                <Field label="주소" mt={4}>
                    <Input placeholder="입력해주세요"/>
                </Field>
                <Field label="휴대전화" mt={4}>
                    <Input placeholder="입력해주세요"/>
                </Field>
                <Field label="배송 요청사항" mt={4}>
                    <Input placeholder="입력해주세요"/>
                </Field>
                <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4}>
                        결제금액: {orderData
                            .reduce((total, item) => total + (item.productAmount * item.quantity), 0)
                            .toLocaleString()}원
                </Text>
                
            </Box>
            
            {/* 오른쪽 박스: 추가 정보 또는 글 입력 */}
            <Box maxWidth="400px" borderWidth="1px"  p={4} ml="auto">
                <Text fontSize="xl" fontWeight="bold" mb={4}>결제 동의사항</Text>
                <Text fontSize="ㅣ" >동의 하십니까?</Text>
                
            </Box>
            
            
        </HStack>
            

                <Box maxW="600px" mx="auto" textAlign="center">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>결제 방법</Text>
                    <HStack spacing={4}>
                        <Checkbox
                            checked={paymentMethod === 'credit'}
                            onCheckedChange={() => setPaymentMethod(prev => prev === 'credit' ? '' : 'credit')}
                        >
                            신용카드
                        </Checkbox>
                        <Checkbox
                            checked={paymentMethod === 'bank'}
                            onCheckedChange={() => setPaymentMethod(prev => prev === 'bank' ? '' : 'bank')}
                        >
                            계좌이체
                        </Checkbox>
                        <Checkbox
                            checked={paymentMethod === 'virtual'}
                            onCheckedChange={() => setPaymentMethod(prev => prev === 'virtual' ? '' : 'virtual')}
                        >
                            무통장입금
                        </Checkbox>
                    </HStack>
                </Box>

                <Box>
                    <Button
                        w="100%"
                        colorScheme="blue"
                        onClick={handlePayment}
                    >
                        결제하기
                    </Button>
                </Box>
            </VStack>
        </Box>
    );
}

export default Checkout;
