import React, { useState, useEffect } from 'react';
import OrderItem from '../pages/OrderItem';
import { Box, HStack, VStack, Text, Input, Link, Button } from '@chakra-ui/react';
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
      <HStack justify="space-between" align="center" mb={3}>
        <ColorModeButton />
        <HStack justify="flex-end">
          <Link
            href="http://localhost:5173/login"
            _focus={{ outline: "none" }}
            margin="3"
          >
            로그인
          </Link>
          <Link
            href="http://localhost:5173/signUp"
            _focus={{ outline: "none" }}
            margin="3"
          >
            회원가입
          </Link>
          <Link
            href="http://localhost:5173/mypage"
            _focus={{ outline: "none" }}
            margin="3"
          >
            마이페이지
          </Link>
          <Link
            href="http://localhost:5173/admin"
            _focus={{ outline: "none" }}
            margin="3"
          >
            관리자페이지
          </Link>
          <DrawerRoot size="md" open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DrawerBackdrop />
            <DrawerTrigger asChild>
              <Button variant="plain">
                장바구니
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>장바구니</DrawerTitle>
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
          href="http://localhost:5173/"
          _focus={{ outline: "none" }}
          fontSize="4xl"
        >
          LOGO
        </Link>
      </VStack>
      <HStack justify="center" mb={3}>
        {categories.map((category, index) => (
          <Text key={index} fontSize="xl" margin="5">{category.categoryName}</Text>
        ))}
      </HStack>
    </Box>
  );
}

export default Header;