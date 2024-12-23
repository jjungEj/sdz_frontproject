import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, Link as ChakraLink, HStack, VStack, Card, Button, Heading, Stack, Text, Group } from '@chakra-ui/react';
import { Avatar } from "@/components/ui/avatar"
import {
    TimelineConnector,
    TimelineContent,
    TimelineDescription,
    TimelineItem,
    TimelineRoot,
    TimelineTitle,
} from "@/components/ui/timeline"
import {
    RadioCardItem,
    RadioCardLabel,
    RadioCardRoot,
} from "@/components/ui/radio-card"

import { LuCheck, LuPackage, LuShip } from "react-icons/lu"
import { useAuth } from '../../services/AuthContext';
import { UserInfo } from '../../services/UserAPI';
import { getDeliveryAddressList, createNewAddress, updateAddress, updateDefaultAddress, deleteAddress } from '../../services/DeliveryAdressAPI';

function UserDashboard() {
    const [selectLink, setSelectLink] = useState("");
    const { email, loginType } = useAuth();
    const [userInfo, setUserInfo] = useState({});
    const [deliveryAddress, setDeliveryAddress] = useState({});

    useEffect(() => {
        if (email) {
            UserInfo(email)
                .then((data) => {
                    setUserInfo(data);
                })
                .catch((error) => {
                });
            getDeliveryAddressList(email)
                .then((data) => {
                    setDeliveryAddress(data);
                })
                .catch((error) => {
                });
        }
    }, [email]);

    const handleClick = (link) => {
        setSelectLink(link);
    }

    return (
        <Box marginTop="-10">
            <HStack justify="center">
                <ChakraLink
                    onClick={() => handleClick("mypage")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "mypage" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/mypage">마이 페이지</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => handleClick("orderItem")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "orderItem" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/mypage/order-item">장바구니</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => handleClick("order")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "order" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/mypage/orders">주문내역 조회</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => handleClick("edit")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "edit" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/mypage/edit">회원정보 변경</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => handleClick("delete")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "delete" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/mypage/delete">회원 탈퇴</Link>
                </ChakraLink>
            </HStack>
            {location.pathname === "/mypage" && (
                <Box>
                    <Heading as="h1" size="xl" mb={3}>마이 페이지</Heading>
                    <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
                    <HStack justify="space-between" alignItems="flex-start">
                        <VStack width="100%" maxWidth="550px" align="flex-start">
                            <Heading as="h3" size="lg">내 프로필</Heading>
                            <Card.Root variant='subtle' width="100%">
                                <Card.Body gap="2">
                                    <HStack>
                                        <Stack>
                                            <Avatar size="2xl" shape="rounded" />
                                            <Button>수정</Button>
                                        </Stack>
                                        <Stack gap="1" ml={10}>
                                            <Card.Title>{userInfo.userName} 님</Card.Title>
                                            <Text fontSize="sm">닉네임 : {userInfo?.nickname || '설정 전 입니다'}</Text>
                                            <Text fontSize="sm">전화번호 : {userInfo?.contact || '설정 전 입니다'}</Text>
                                            { loginType === 'local' ? (
                                                <Text fontSize="sm">이메일 : {userInfo.email}</Text>
                                            ) : null }
                                        </Stack>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                            <Heading as="h3" size="lg" mt={10}>최근 주문 내역</Heading>
                            <Card.Root variant='subtle' width="100%">
                                <Card.Body gap="2">
                                    <TimelineRoot maxW="400px">
                                        <TimelineItem>
                                            <TimelineConnector>
                                                <LuShip />
                                            </TimelineConnector>
                                            <TimelineContent>
                                                <TimelineTitle>상품 주문</TimelineTitle>
                                                <TimelineDescription>13th May 2021</TimelineDescription>
                                                <Text textStyle="sm">
                                                    (해당 주문에 있는 상품 리스트)
                                                </Text>
                                            </TimelineContent>
                                        </TimelineItem>

                                        <TimelineItem>
                                            <TimelineConnector>
                                                <LuCheck />
                                            </TimelineConnector>
                                            <TimelineContent>
                                                <TimelineTitle textStyle="sm">주문 확인</TimelineTitle>
                                                <TimelineDescription>18th May 2021</TimelineDescription>
                                                <Text textStyle="sm">
                                                    (해당 주문)의 상품이 발송되었습니다.
                                                </Text>
                                            </TimelineContent>
                                        </TimelineItem>

                                        <TimelineItem>
                                            <TimelineConnector>
                                                <LuPackage />
                                            </TimelineConnector>
                                            <TimelineContent>
                                                <TimelineTitle textStyle="sm">배송 완료</TimelineTitle>
                                                <TimelineDescription>20th May 2021, 10:30am</TimelineDescription>
                                            </TimelineContent>
                                        </TimelineItem>
                                    </TimelineRoot>
                                </Card.Body>
                            </Card.Root>
                        </VStack>
                        <VStack width="100%" maxWidth="550px" height="600px" align="flex-start">
                            <Heading as="h3" size="lg">배송지 관리</Heading>
                            {/* <Card.Root variant='subtle' width="100%" height="100%"> */}
                                {/* <Card.Body gap="2"> */}
                                    <RadioCardRoot defaultValue="next" gap="4" width="100%">
                                        {/* <RadioCardLabel>How well do you know React?</RadioCardLabel> */}
                                        <Group attached orientation="vertical">
                                            {items.map((item) => (
                                                <RadioCardItem
                                                    width="full"
                                                    indicatorPlacement="start"
                                                    label={`${item.name} (${item.contact})`}
                                                    description={`${item.addr1} ${item.addr2} ${item.addr3}`}
                                                    key={item.id}
                                                    value={item.id}
                                                />
                                            ))}
                                        </Group>
                                    </RadioCardRoot>
                                {/* </Card.Body> */}
                            {/* </Card.Root> */}
                        </VStack>
                    </HStack>
                </Box>
            )}

            <Outlet />

        </Box>
    );
}
const items = [
    {
      id: "1",
      name: "엘리스",
      contact: "010-1234-1234",
      addr1: "서울시",
      addr2: "강남구",
      addr3: "강남대로 123",
    },
    {
        id: "2",
        name: "스프링",
        contact: "010-9876-9876",
        addr1: "부산시",
        addr2: "해운대구",
        addr3: "해운대 해변로 45",
      },
  ]

export default UserDashboard;