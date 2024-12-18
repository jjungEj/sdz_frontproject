import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, Link as ChakraLink, HStack } from '@chakra-ui/react';

function AdminDashboard() {
    const [selectLink, setSelectLink] = useState("");

    const onClick = (link) => {
        setSelectLink(link);
    }

    return (
        <Box>
            <HStack justify="center">
                <ChakraLink
                    onClick={() => onClick("user")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "user" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/admin/users">회원 관리</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => onClick("order")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "order" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/admin/orders">주문 관리</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => onClick("category")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "category" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/admin/categories">카테고리 관리</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => onClick("product")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "product" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/admin/products">상품 관리</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => onClick("create")}
                    asChild
                    _focus={{ outline: "none" }}
                    fontWeight={selectLink === "create" ? "bold" : "none"}
                    margin="3"
                >
                    <Link to="/admin/products/create">상품 등록</Link>
                </ChakraLink>
            </HStack>


            <Outlet />
        </Box>
    );
}

export default AdminDashboard;