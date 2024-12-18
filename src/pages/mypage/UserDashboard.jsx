import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, Link as ChakraLink, HStack } from '@chakra-ui/react';

function UserDashboard() {
    const [selectLink, setSelectLink] = useState("");

    const onClick = (link) => {
        setSelectLink(link);
    }

    return (
        <Box>
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
            <Outlet />
        </Box>
    );
}

export default UserDashboard;