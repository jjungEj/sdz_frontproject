import React, { useState } from 'react';
import { Box, VStack, HStack, Grid, GridItem, Text, Input, Button, Image } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { Radio, RadioGroup } from "@/components/ui/radio"
import { useNavigate, useLocation } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { createOrder } from '../services/OrderAPI.js';

function Checkout() {
    const navigate = useNavigate();
    const today = new Date();
    const location = useLocation();
    const toast = useToast();
    const orderData = location.state?.orderData || [];
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderId, setOrderId] = useState(null);
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

    const [isSameAsCustomer, setIsSameAsCustomer] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSameAsCustomer = (e) => {
        setIsSameAsCustomer(e.target.checked);
        if (e.target.checked) {
        setUserInfo(prev => ({
            ...prev,
            receiverName: userInfo.name,
            receiverPhone: userInfo.phone
        }));
        }
    };
    const handlePayment = async () => {
        // 입력 검증
        if (!userInfo.email) {
            alert("이메일을 입력해주세요");
            return;
        }
        if (!userInfo.paymentMethod) {
            alert("결제 방법을 선택해주세요");
            return;
        }
        if (!userInfo.name || !userInfo.detailAddress1 || !userInfo.detailAddress2 || !userInfo.detailAddress3 || !userInfo.phone) {
            alert("배송 정보를 모두 입력해주세요");
            return;
        }
        if (!userInfo.request) {
            alert("배송 요청사항을 입력해주세요");
            return;
        }
        
        try {
            // 주문 데이터 생성
            const orderPayload = {
                orderItems: orderData.map((item) => ({
                    orderItemId: item.orderItemId,
                    orderItemDetails: [
                        {
                            productId: item.productId,
                            quantity: item.quantity,
                            productName: item.productName,
                            productAmount: item.productAmount,
                            thumbnailPath: item.productImage,
                        },
                    ],
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
                    defaultCheck: userInfo.isDefaultAddress,
                },
                paymentMethod: paymentMethod,
                totalPrice: orderData.reduce(
                    (total, item) => total + item.productAmount * item.quantity,0
                ),
                refundStatus: false,
                regDate: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2,"0")}.${String(today.getDate()).padStart(2, "0")}`,
            };
    
            console.log("주문 데이터:", orderPayload);
    
            // 주문 생성 API 호출
            const response = await createOrder(orderPayload);
            console.log("주문 생성 성공:", response);
    
            const orderId = response.orderId;
            console.log("주문 ID:", orderId); // 추가된 로그
    
            if (!orderId) {
                throw new Error("주문 ID를 가져올 수 없습니다.");
            }
    
            setOrderId(orderId);
            navigate(`/order/${orderId}`, {
                state: { orderData },
            }); // 주문 상세 페이지로 이동
        } catch (error) {
            console.error("주문 생성 실패:", error);
    
            // 오류 메시지 표시
            alert(
                error.response?.data?.message ||
                    error.message ||
                    "주문 처리 중 문제가 발생했습니다."
            );
        }
    };


    return (
        <Box maxW="800px" mx="auto" p={1}>
            <Text fontSize="2xl" fontWeight="bold" >주문 결제</Text>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Box borderWidth="1px" borderRadius="2g">
                        <Grid templateColumns="2fr 1fr 1fr 1fr" bg="gray.50" p={4} gap={4} borderBottomWidth="1px">
                            <Text textAlign="center">제품정보</Text>
                            <Text textAlign="center">판매가격</Text>
                            <Text textAlign="center">수량</Text>
                            <Text textAlign="center">주문금액</Text>
                        </Grid>
                        {orderData.map((item) => (
                            <Grid key={item.productId} templateColumns="2fr 1fr 1fr 1fr" bg="gray.10" p={4} gap={4} borderBottomWidth="1px" alignItems="center">
                                <HStack>
                                    <Box w="60px" h="60px" bg="gray.100" borderWidth="1px">
                                    <img
                                        
                                        alt={item.productName}
                                        style={{
                                            width: "75px",
                                            height: "100px",
                                            objectFit: "cover",
                                            borderRadius: "5px",
                                            border: "1px solid #ccc",
                                        }}
                                    />
                                    </Box>
                                    <Text textAlign="center">{item.productName}</Text>
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
                <Box maxW="1200px" mx="auto" p={6}>
      <Grid templateColumns="2fr 1fr" gap={6}>
        <VStack align="stretch" spacing={8}>
          {/* 주문자 정보 */}
          <Box borderWidth="1px" p={4} >
            <Text fontSize="xl" fontWeight="bold" mb={4}>주문자 정보</Text>
            <Grid templateColumns="120px 1fr" gap={4} alignItems="center">
              <Text>이름</Text>
              <Input name="name" value={userInfo.name} onChange={handleInputChange} placeholder="이름"/>
              <Text>이메일</Text>
              <Input name="email" value={userInfo.email} onChange={handleInputChange} placeholder="이메일"/>
              <Text>휴대전화</Text>
              <Input name="phone" value={userInfo.phone} onChange={handleInputChange} placeholder="휴대전화"/>
            </Grid>
          </Box>

          {/* 배송 정보 */}
          <Box borderWidth="1px" p={4} >
            <Text fontSize="xl" fontWeight="bold" mb={4}>배송 정보</Text>
            <Checkbox mb={4} onChange={handleSameAsCustomer}>
              주문자 정보와 동일
            </Checkbox>
            <Grid templateColumns="120px 1fr" gap={4} alignItems="center">
              <Text>받는 사람</Text>
              <Input 
                name="receiverName" 
                value={isSameAsCustomer ? userInfo.name : userInfo.receiverName}
                onChange={handleInputChange} placeholder="받는사람"
              />
              <Text>휴대전화</Text>
              <Input name="receiverContact" value={isSameAsCustomer ? userInfo.phone : userInfo.receiverContact} onChange={handleInputChange} placeholder="휴대전화"/>
              <Text>주소</Text>
              <VStack align="stretch">
                <Input name="detailAddress1" value={userInfo.detailAddress1} onChange={handleInputChange} placeholder="우편번호" />
                <Input name="detailAddress2" value={userInfo.detailAddress2} onChange={handleInputChange} placeholder="기본주소" />
                <Input name="detailAddress3" value={userInfo.detailAddress3} onChange={handleInputChange} placeholder="상세주소" />
              </VStack>
              <Text>배송 요청사항</Text>
              <Input name="request" value={userInfo.request} onChange={handleInputChange} placeholder="입력해주세요" />
            </Grid>
          </Box>

          {/* 결제 방법 */} 
          <Box borderWidth="1px" p={4} >
    <Text fontSize="xl" fontWeight="bold" mb={4}>결제 방법</Text>
    <HStack spacing={4}>
        <Checkbox 
            isChecked={userInfo.paymentMethod === 'credit'}
            onChange={() => setUserInfo(prev => ({ ...prev, paymentMethod: 'credit' }))}
        >
            신용카드
        </Checkbox>
        <Checkbox 
            isChecked={userInfo.paymentMethod === 'bank'}
            onChange={() => setUserInfo(prev => ({ ...prev, paymentMethod: 'bank' }))}
        >
            계좌이체
        </Checkbox>
        <Checkbox 
            isChecked={userInfo.paymentMethod === 'virtual'}
            onChange={() => setUserInfo(prev => ({ ...prev, paymentMethod: 'virtual' }))}
        >
            가상계좌(무통장)
        </Checkbox>
    </HStack>
</Box>
        </VStack>

        {/* 결제 전 확인사항 */}
        <Box borderWidth="1px" p={4} >
          <Text fontSize="xl" fontWeight="bold" mb={4}>결제 전 확인사항</Text>
          <Text fontSize="xs" >결제 시에는 가급적 주문하시는 분 명의의 카드나 계좌를 이용해 주세요.
          주문정보와 결제정보가 다를 경우 주문내역 확인에 어려움이 있을 수 있습니다.</Text>
          {/* 여기에 확인사항 내용 추가 */}
        </Box>
      </Grid>
      <Box mt={8} textAlign="center">
        <Button colorScheme="blue" size="lg" onClick={handlePayment}>
          결제하기
        </Button>
      </Box>
    </Box>
            </VStack>
        </Box>
    );
}

export default Checkout;
