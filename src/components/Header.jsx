import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/services/AuthContext';
import { logout } from '@/services/LogoutAPI';
import Search from './Search';
import CartDrawer from './CartDrawer';
import useCategoryStore from '@/store/CategoryStore';

import { Box, HStack, VStack, Link as ChakraLink, Button } from '@chakra-ui/react';
import { ColorModeButton } from "@/components/ui/color-mode"

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, email, auth, handleContextLogout } = useAuth();
  const { categories, getCategories } = useCategoryStore();

  useEffect(() => {
    getCategories();
  }, []);

  const handleLogout = () => {
    logout(navigate);
    handleContextLogout();
  };

  return (
    <Box maxWidth="1200px" width="100%" margin="0 auto" p={5}>
      <HStack justify="space-between" align="center">
        <ColorModeButton />
        <HStack justify="flex-end">
          {!isLoggedIn ? (
            <>
              <ChakraLink asChild _focus={{ outline: "none" }} fontSize="sm" margin="3">
                <Button as={Link} to="/login" variant="link" fontSize="sm" margin="3" padding="0">
                  로그인
                </Button>
              </ChakraLink>
              <ChakraLink asChild _focus={{ outline: "none" }} fontSize="sm" margin="3">
                <Button as={Link} to="/signUp" variant="link" fontSize="sm" margin="3" padding="0">
                  회원가입
                </Button>
              </ChakraLink>
            </>
          ) : (
            <>
              <ChakraLink asChild _focus={{ outline: "none" }} fontSize="sm" margin="3">
                <Button onClick={handleLogout} variant="link" fontSize="sm" margin="3" padding="0">
                  로그아웃
                </Button>
              </ChakraLink>
              {auth === 'admin' ? (
                <ChakraLink asChild _focus={{ outline: "none" }} fontSize="sm" margin="3">
                  <Button as={Link} to="/admin" variant="link" fontSize="sm" margin="3" padding="0">
                    관리자페이지
                  </Button>
                </ChakraLink>
              ) : (
                <ChakraLink asChild _focus={{ outline: "none" }} fontSize="sm" margin="3">
                  <Button as={Link} to="/mypage" variant="link" fontSize="sm" margin="3" padding="0">
                    마이페이지
                  </Button>
                </ChakraLink>
              )}
            </>
          )}
          <CartDrawer />
        </HStack>
      </HStack>
      <HStack justify="flex-end" mb={3}>
        <Search />
      </HStack>
      <VStack justify="center" mb={3}>
        <Link to="/" _focus={{ outline: "none" }} fontSize="4xl">
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
            <Link key={index} to={`/products?categoryId=${category.categoryId}`} >
              {category.categoryName}
            </Link>
          </ChakraLink>
        ))}
      </HStack>
    </Box>
  );
}

export default Header;