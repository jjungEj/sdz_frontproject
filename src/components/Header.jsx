import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderItem from '../pages/mypage/OrderItem';
import { Box, HStack, VStack, Text, Input, Link as ChakraLink, Button } from '@chakra-ui/react';
import { ColorModeButton } from "@/components/ui/color-mode"
import { InputGroup } from "@/components/ui/input-group"
import { LuSearch } from "react-icons/lu"
import { getCategories } from "../services/CategoryAPI";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"


function Header() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  function loadCategories() {
    getCategories()
      .then(data => {
        setCategories(data);
      });
  }

  return (
    <Box maxWidth="1200px" width="100%" margin="0 auto" p={5}>
      <HStack justify="space-between" align="center">
        <ColorModeButton />
        <HStack justify="flex-end">
          <ChakraLink
            asChild
            _focus={{ outline: "none" }}
            fontSize="sm"
            margin="3"
          >
            <Link to="/login">
              로그인
            </Link>
          </ChakraLink>
          <ChakraLink
            asChild
            _focus={{ outline: "none" }}
            fontSize="sm"
            margin="3"
          >
            <Link to="/signUp">
              회원가입
            </Link>
          </ChakraLink>
          <ChakraLink
            asChild
            _focus={{ outline: "none" }}
            fontSize="sm"
            margin="3"
          >
            <Link to="/mypage">
              마이페이지
            </Link>
          </ChakraLink>
          <ChakraLink
            asChild
            _focus={{ outline: "none" }}
            fontSize="sm"
            margin="3"
          >
            <Link to="/admin">
              관리자페이지
            </Link>
          </ChakraLink>
          <DrawerRoot size="md" open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DrawerBackdrop />
            <DrawerTrigger asChild>
              <Button variant="plain" fontSize="sm">
                장바구니
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
              </DrawerHeader>
              <DrawerBody>
                <OrderItem />
              </DrawerBody>
              <DrawerCloseTrigger />
            </DrawerContent>
          </DrawerRoot>
        </HStack>
      </HStack>
      <HStack justify="flex-end" mb={3}>
        <InputGroup
          flex="1"
          endElement={<LuSearch />}
          maxWidth="300px"
          w="100%"
        >
          <Input placeholder="Search" />
        </InputGroup>
      </HStack>
      <VStack justify="center" mb={3}>
        <Link
          to="/"
          _focus={{ outline: "none" }}
          fontSize="4xl"
        >
          LOGO
        </Link>
      </VStack>
      <HStack justify="center" mb={3}>

        {categories.map((category, index) => (
          <ChakraLink
            key={index}
            asChild
            _focus={{ outline: "none" }}
            fontSize="2xl"
            fontWeight="medium"
            margin="5"
          >
            <Link
              key={index}
              to={`/products?categoryId=${category.categoryId}`}
            >
              {category.categoryName}
            </Link>
          </ChakraLink>
        ))}
      </HStack>
    </Box>
  );
}

export default Header;