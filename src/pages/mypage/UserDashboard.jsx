import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, Link as ChakraLink, HStack, VStack, Card, Button, Heading, Stack, Text, Table } from '@chakra-ui/react';
import { Avatar } from "@/components/ui/avatar"
import {
    TimelineConnector,
    TimelineContent,
    TimelineDescription,
    TimelineItem,
    TimelineRoot,
    TimelineTitle,
} from "@/components/ui/timeline"
import { LuCheck, LuPackage, LuShip } from "react-icons/lu"

function UserDashboard() {
    const [selectLink, setSelectLink] = useState("");

    const onClick = (link) => {
        setSelectLink(link);
    }

    return (
        <Box marginTop="-10">
            <HStack justify="center">
                <ChakraLink
                    onClick={() => onClick("mypage")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "mypage" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/mypage">마이 페이지</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => onClick("orderItem")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "orderItem" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/mypage/order-item">장바구니</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => onClick("order")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "order" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/mypage/orders">주문내역 조회</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => onClick("edit")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "edit" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/mypage/edit">회원정보 변경</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => onClick("delete")}
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
                        <VStack width="100%" maxWidth="500px" align="flex-start">
                        <Heading as="h3" size="lg" mb={3}>내 프로필</Heading>
                            <Card.Root variant='subtle' width="100%">
                                <Card.Body gap="2">
                                    <HStack>
                                        <Stack>
                                            <Avatar size="2xl" shape="rounded" />
                                            <Button>수정</Button>
                                        </Stack>
                                        <Stack gap="1" ml={10}>
                                            <Card.Title>() 님</Card.Title>
                                            <Text fontSize="sm">닉네임 : ()</Text>
                                            <Text fontSize="sm">전화번호 : ()</Text>
                                            <Text fontSize="sm">이메일 : ()</Text>
                                        </Stack>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                            <Heading as="h3" size="lg" mt={10} mb={3}>최근 주문 내역</Heading>
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
                        </VStack>
                        <VStack width="100%" maxWidth="500px" align="flex-start">
                        <Heading as="h3" size="lg" mb={3}>배송지 관리</Heading>
                        </VStack>
                        </HStack>
                    </Box>
            )}

            <Outlet />

        </Box>
    );
}

export default UserDashboard;