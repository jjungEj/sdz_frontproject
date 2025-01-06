import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Grid, GridItem, Text, Input, Button, Stack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { Radio, RadioGroup } from "@/components/ui/radio"
import { useNavigate, useLocation } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { createOrder } from '../services/OrderAPI.js';
import useAuthStore from '@/store/AuthStore';
import { useShallow } from 'zustand/react/shallow';
import { UserInfo } from '@/services/UserAPI';
import { VscChromeMinimize } from 'react-icons/vsc';
import { DefaultAddressInfo } from '@/services/DeliveryAdressAPI.js';
import { DaumAddress } from '@/pages/mypage/DeliveryAddressDialog.jsx';

function Checkout() {
    const { email } = useAuthStore(
        useShallow((state) => ({ 
            email: state.email,
        })),
    )
    const navigate = useNavigate();
    const today = new Date();
    const location = useLocation();
    const orderData = location.state?.orderData || [];
    const [orderItem, setOrderItem] = useState(null);
    const [isSameAsCustomer, setIsSameAsCustomer] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [userInfo, setUserInfo] = useState({
        email: '',
        userName: '',
        phone: '',
        contactPrefix: '',
        contactMid: '',
        contactLast: '',

        receiverName: '',
        receiverContact: '',
        receiverContactPrefix: '',
        receiverContactMid: '',
        receiverContactLast: '',

        detailAddress1: '',
        detailAddress2: '',
        detailAddress3: '',
        request: '',
        isDefaultAddress: false,    

        paymentMethod: ''  
    });
    const [initialResponse, setInitialResponse] = useState({});

    useEffect(() => {
        if (email) {
            UserInfo(email)
                .then((data) => {
                    setUserInfo(prevState => ({
                        ...prevState,
                        userName: data.userName,
                        phone: data.contact,
                        contactPrefix: data.contact.slice(0, 3),
                        contactMid: data.contact.slice(3, 7),
                        contactLast: data.contact.slice(7),
                    }));
                })
                .catch((error) => {});
        }
    }, [email]);
    
    useEffect(() => {
        if (isSameAsCustomer) {
            DefaultAddressInfo()
                .then((response) => {
                    setInitialResponse({
                        deliveryAddressId: response.deliveryAddressId,
                        receiverName: response.receiverName,
                        receiverContact: response.receiverContact,
                        receiverContactPrefix: response.receiverContact.slice(0, 3),
                        receiverContactMid: response.receiverContact.slice(3, 7),
                        receiverContactLast: response.receiverContact.slice(7),
                        detailAddress1: response.deliveryAddress1,
                        detailAddress2: response.deliveryAddress2,
                        detailAddress3: response.deliveryAddress3,
                        request: response.deliveryRequest,
                        defaultCheck: response.defaultCheck,
                    });
    
                    setUserInfo(prevState => ({
                        ...prevState,
                        deliveryAddressId: response.deliveryAddressId,
                        receiverName: response.receiverName,
                        receiverContact: response.receiverContact,
                        receiverContactPrefix: response.receiverContact.slice(0, 3),
                        receiverContactMid: response.receiverContact.slice(3, 7),
                        receiverContactLast: response.receiverContact.slice(7),
                        detailAddress1: response.deliveryAddress1,
                        detailAddress2: response.deliveryAddress2,
                        detailAddress3: response.deliveryAddress3,
                        request: response.deliveryRequest,
                        defaultCheck: response.defaultCheck,
                    }));
                })
                .catch((error) => {});
        } else {
            setUserInfo(prevState => ({
                ...prevState,
                detailAddress1: '',
                detailAddress2: '',
                detailAddress3: '',
                receiverName: '',
                receiverContact: '',
                receiverContactPrefix: '',
                receiverContactMid: '',
                receiverContactLast: '',
                request: '',
                defaultCheck: false,
            }));
        }
    }, [isSameAsCustomer]);

    const handleContactChange = (prefix, mid, last) => {
        setUserInfo(prevState => {
            const updatedReceiverContact = prefix + mid + last;
            return {
                ...prevState,
                receiverContact: updatedReceiverContact,
                receiverContactPrefix: prefix,
                receiverContactMid: mid,
                receiverContactLast: last,
            };
        });
    };

    const hasChanges = (userInfo, initialResponse) => {
        if (!initialResponse) return false;
    
        return (
            userInfo.receiverName !== initialResponse.receiverName ||
            userInfo.receiverContactPrefix !== initialResponse.receiverContactPrefix ||
            userInfo.receiverContactMid !== initialResponse.receiverContactMid ||
            userInfo.receiverContactLast !== initialResponse.receiverContactLast ||
            userInfo.detailAddress1 !== initialResponse.detailAddress1 ||
            userInfo.detailAddress2 !== initialResponse.detailAddress2 ||
            userInfo.detailAddress3 !== initialResponse.detailAddress3 ||
            userInfo.request !== initialResponse.request ||
            userInfo.defaultCheck !== initialResponse.defaultCheck
        );
    };

    const handleAddressSelect = (zoneCode, roadAddress) => {
        setUserInfo(prevState => ({
            ...prevState,
            detailAddress1: zoneCode,
            detailAddress2: roadAddress
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => {
            const updatedUserInfo = { ...prev, [name]: value };
            
            if (name === 'receiverContactPrefix' || name === 'receiverContactMid' || name === 'receiverContactLast') {
                const updatedReceiverContact = updatedUserInfo.receiverContactPrefix + updatedUserInfo.receiverContactMid + updatedUserInfo.receiverContactLast;
                updatedUserInfo.receiverContact = updatedReceiverContact;
            }
            
            return updatedUserInfo;
        });
    };

    const handleSameAsCustomer = (e) => {
        setIsSameAsCustomer(e.target.checked);
    };
    const handlePayment = async () => {
        // 입력 검증
        if (!userInfo.paymentMethod) {
            alert("결제 방법을 선택해주세요");
            return;
        }
        if (!userInfo.userName || !userInfo.phone ||!userInfo.detailAddress1 || !userInfo.detailAddress2 || !userInfo.detailAddress3 || !userInfo.phone) {
            alert("배송 정보를 모두 입력해주세요");
            return;
        }
        if (!userInfo.request) {
            alert("배송 요청사항을 입력해주세요");
            return;
        }
        
        try {
            // 주문 데이터 생성
            const isNewAddress = !isSameAsCustomer
            const orderPayload = {
                orderItems: orderData.map((orderitem) => ({
                    orderItemId: orderitem.orderItemId,
                    orderItemDetails: [
                        {
                            productId: orderitem.productId,
                            quantity: orderitem.quantity,
                            productName: orderitem.productName,
                            productAmount: orderitem.productAmount,
                            thumbnailPath: orderitem.productImage,
                        },
                    ],
                })),
                deliveryAddress: isSameAsCustomer && !hasChanges(userInfo, initialResponse)
                ? { 
                    deliveryAddressId: initialResponse.deliveryAddressId,
                    email: email,
                    receiverName: initialResponse.receiverName,
                    receiverContact: initialResponse.receiverContact,
                    deliveryAddress1: initialResponse.detailAddress1,
                    deliveryAddress2: initialResponse.detailAddress2,
                    deliveryAddress3: initialResponse.detailAddress3,
                    deliveryRequest: initialResponse.request,
                    defaultCheck: initialResponse.defaultCheck,
                }
                : { 
                    deliveryAddressId: null,
                    email: email,
                    receiverName: userInfo.receiverName,
                    receiverContact: userInfo.receiverContact,
                    deliveryAddress1: userInfo.detailAddress1,
                    deliveryAddress2: userInfo.detailAddress2,
                    deliveryAddress3: userInfo.detailAddress3,
                    deliveryRequest: userInfo.request,
                    defaultCheck: userInfo.isDefaultAddress,
                },
                newAddress: isNewAddress,
                addressModified: hasChanges(userInfo, initialResponse),
                paymentMethod: userInfo.paymentMethod,
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
            alert("주문이 완료되었습니다.");
            navigate(`/order/${orderId}`, {
                state: {
                  orderData: {
                    orderId: orderId,
                    items: response.orderItems.map(item => ({
                      productId: item.orderItemDetails[0].productId,
                      productName: item.orderItemDetails[0].productName,
                      productAmount: item.orderItemDetails[0].productAmount,
                      quantity: item.orderItemDetails[0].quantity,
                      thumbnailPath: item.orderItemDetails[0].thumbnailPath
                    })),
                    totalPrice: orderPayload.totalPrice,
                    regDate: orderPayload.regDate,
                    orderStatus: "결제완료",
                    paymentMethod: orderPayload.paymentMethod,
                    receiverName: orderPayload.deliveryAddress.receiverName,
                    phone: orderPayload.deliveryAddress.receiverContact,
                    deliveryAddress: {
                      deliveryAddress1: orderPayload.deliveryAddress.deliveryAddress1,
                      deliveryAddress2: orderPayload.deliveryAddress.deliveryAddress2,
                      deliveryAddress3: orderPayload.deliveryAddress.deliveryAddress3
                    },
                    request: orderPayload.deliveryAddress.deliveryRequest
                  }
                }
              });
              console.log("Order orderData:", orderData);
              console.log("Order orderData:", JSON.stringify(orderData, null, 2));
              console.log("Order orderData:", orderData);

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
            <Text fontSize="2xl" mb={5} fontWeight="bold" >주문 결제</Text>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
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
                                <Box>
                                <img
                                    src={`${item.thumbnailPath}`}
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
                        <Input name="name" value={userInfo.userName} />
                    <Text>이메일</Text>
                        <Input name="email" value={email} />
                    <Text>휴대전화</Text>
                        <HStack>
                            <Input width='110px' name="phone" value={userInfo.contactPrefix} />
                            <VscChromeMinimize style={{ fontSize: '10px', fontWeight: 'bold' }}/>
                            <Input width='110px' name="phone" value={userInfo.contactMid} />
                            <VscChromeMinimize style={{ fontSize: '10px', fontWeight: 'bold' }}/>
                            <Input width='110px' name="phone" value={userInfo.contactLast} />
                        </HStack>
                </Grid>
                </Box>

          {/* 배송 정보 */}
          <Box borderWidth="1px" p={4} >
            <Text fontSize="xl" fontWeight="bold" mb={4}>배송 정보</Text>
            <Checkbox mb={4} onChange={handleSameAsCustomer}>
              기본 배송지로 배송
            </Checkbox>
            <Grid templateColumns="120px 1fr" gap={4} alignItems="center">
              <Text>받는 사람</Text>
              <Input 
                name="receiverName" 
                value={userInfo.receiverName}
                onChange={handleInputChange} />
              <Text>휴대전화</Text>
                <HStack>
                <Input width='110px' name="receiverContactPrefix" 
                    maxLength='3'
                    value={userInfo.receiverContactPrefix} 
                    onChange={handleInputChange} />
                    <VscChromeMinimize style={{ fontSize: '10px', fontWeight: 'bold' }}/>
                    <Input width='110px' name="receiverContactMid" 
                    maxLength='4'
                    value={userInfo.receiverContactMid} 
                    onChange={handleInputChange} />
                    <VscChromeMinimize style={{ fontSize: '10px', fontWeight: 'bold' }}/>
                    <Input width='110px' name="receiverContactLast" 
                    maxLength='4'
                    value={userInfo.receiverContactLast} 
                    onChange={handleInputChange} />
                </HStack>
              <Text>주소</Text>
              <VStack align="stretch">
                <HStack>
                    <Input name="detailAddress1" value={userInfo.detailAddress1} onChange={handleInputChange} readOnly />
                    <DaumAddress onAddressSelect={handleAddressSelect} />
                </HStack>
                <Input name="detailAddress2" value={userInfo.detailAddress2} onChange={handleInputChange} readOnly />
                <Input name="detailAddress3" value={userInfo.detailAddress3} onChange={handleInputChange} />
              </VStack>
              <Text>배송 요청사항</Text>
              <Input name="request" value={userInfo.request} onChange={handleInputChange} />
            </Grid>
          </Box>

          {/* 결제 방법 */} 
          <Box borderWidth="1px" p={4}>
    <Text fontSize="xl" fontWeight="bold" mb={4}>결제 방법</Text>
    <HStack spacing={4}>
        <Checkbox 
            isChecked={userInfo.paymentMethod === 'credit'}
            onChange={() => setUserInfo(prev => prev.paymentMethod !== 'credit' ? { ...prev, paymentMethod: 'credit' } : prev)}
        >
            신용카드
        </Checkbox>
        <Checkbox 
            isChecked={userInfo.paymentMethod === 'bank'}
            onChange={() => setUserInfo(prev => prev.paymentMethod !== 'bank' ? { ...prev, paymentMethod: 'bank' } : prev)}
        >
            계좌이체
        </Checkbox>
        <Checkbox 
            isChecked={userInfo.paymentMethod === 'virtual'}
            onChange={() => setUserInfo(prev => prev.paymentMethod !== 'virtual' ? { ...prev, paymentMethod: 'virtual' } : prev)}
        >
            가상계좌(무통장)
        </Checkbox>
    </HStack>
</Box>
        </VStack>

        {/* 결제 전 확인사항 */}
        <Box borderWidth="1px" p={3} maxWidth="800px" w="100%" mx="auto">
          <Text fontSize="xl" fontWeight="bold" mb={4}>결제 전 확인사항</Text>
          <Text fontSize="9px" >결제 시에는 가급적 주문하시는 분 명의의 카드나 계좌를 이용해 주세요.</Text>
          <Text fontSize="9px" mb={4}>주문정보와 결제정보가 다를 경우 주문내역 확인에 어려움이 있을 수 있습니다.</Text>
          
          <Text fontSize="14px" fontWeight="bold" mb={4}>반품 및 환불 정책</Text>
          <Text fontSize="9px" >사다줘 온라인 쇼핑몰에서 구매하신 상품은 공정거래 위원회가 인증한 표준약관에 의거, 상품 인도 후 7일 이내에 다음의 사유에 의한 교환, 반품 및 환불을 보장하고 있습니다.</Text>
          <Text fontSize="9px" >고객의 단순한 변심으로 교환, 반품 및 환불을 요구할 때 수반되는 배송비 및 소정의 수수료는 고객께서 부담하셔야 합니다.</Text>
          <Text fontSize="9px" mb={2}>또한, 상품을 개봉했거나 설치한 후에는 상품의 재판매가 불가능하므로 고객님의 변심에 의한 교환, 반품이 불가능함을 양지해주시기 바랍니다.</Text>
          <Text fontSize="9px" mb={2}>1. 교환 및 반품 문의: 사다줘 컨택센터 (1234-5678)</Text>
          <Text fontSize="9px" mb={4} >2. 주문취소는 주문진행 상황에 따라 즉시 주문취소, 상담 후 취소, 반품의 단계로 취소가 이루어집니다.</Text>
          
          <Text fontSize="14px" fontWeight="bold" mb={4}>교환 및 반품이 가능한 경우</Text>
          <Text fontSize="9px" >배송된 상품이 주문 내용과 상이하거나 사다줘에서 제공한 정보와 상이할 경우</Text>
          <Text fontSize="9px" >배송된 상품 자체에 이상 및 결함이 있을 경우</Text>
          <Text fontSize="9px" mb={4}>배송된 상품이 파손, 손상되었거나 오염되었을 경우</Text>
          
          <Text fontSize="14px" fontWeight="bold" mb={4}>교환 및 반품이 불가능한 경우</Text>
          <Text fontSize="9px" >고객님의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우</Text>
          <Text fontSize="9px" >고객님의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우</Text>
          <Text fontSize="9px" mb={4}>재판매가 곤란할 정도로 상품의 가치가 현저히 감소한 경우</Text>
          
          <Text fontSize="14px" fontWeight="bold" mb={4}>교환 및 반품 배송료가 부과되는 경우</Text>
          <Text fontSize="9px" >색상 및 소재에 대한 이해 착오로 인한 경우</Text>
          <Text fontSize="9px" >모니터 해상도로 인한 색상 차이가 발생한 경우</Text>
          <Text fontSize="9px" mb={4}>제품 하자 없는 단순변심인 경우</Text>
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
