import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow'
import useAuthStore from '@/store/AuthStore';
import { logout } from '@/services/LogoutAPI';
import Search from './Search';
import CartDrawer from './CartDrawer';
import useCategoryStore from '@/store/CategoryStore';

import { Box, HStack, VStack, Link as ChakraLink, Button } from '@chakra-ui/react';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu"
import { ColorModeButton } from "@/components/ui/color-mode"

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, auth,  handleLogout, updateAuthState }
  = useAuthStore(
      useShallow((state) => ({ 
        isLoggedIn: state.isLoggedIn,
        auth: state.auth,
        handleLogout: state.handleLogout,
        updateAuthState: state.updateAuthState
      })),
  )
  const [openMenu, setOpenMenu] = useState(null);
  const { categories, getCategories } = useCategoryStore();

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
        updateAuthState();
    }
  }, [isLoggedIn, updateAuthState]);

  const handleLogoutClick = async() => {
    await logout();
    await handleLogout();
    navigate('/');
  };

  const handleMouseEnter = (categoryId) => {
    setOpenMenu(categoryId);
  };

  const handleMouseLeave = () => {
    setOpenMenu(null);
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
                <Button onClick={handleLogoutClick} variant="link" fontSize="sm" margin="3" padding="0">
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
        {categories
          .filter(category => category.parentId === null)
          .map((category) => (
            <MenuRoot key={category.categoryId} open={openMenu === category.categoryId}>
              <MenuTrigger asChild>
                <ChakraLink asChild _focus={{ outline: "none" }} fontSize="2xl" margin="3">
                  <Button
                    as={Link}
                    to={`/products?categoryId=${category.categoryId}`}
                    variant="link"
                    fontSize="2xl"
                    padding="0"
                    onMouseEnter={() => handleMouseEnter(category.categoryId)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {category.categoryName}
                  </Button>
                </ChakraLink>
              </MenuTrigger>
              <MenuContent
                onMouseEnter={() => handleMouseEnter(category.categoryId)}
                onMouseLeave={handleMouseLeave}
              >
                {category.subCategories.length > 0 ? (
                  category.subCategories.map((subCategory) => (
                    <MenuItem key={subCategory.categoryId}>
                      <ChakraLink asChild _focus={{ outline: "none" }} fontSize="md">
                        <Link to={`/products?categoryId=${subCategory.categoryId}`}>
                          {subCategory.categoryName}
                        </Link>
                      </ChakraLink>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>
                    서브 카테고리가 없습니다.
                  </MenuItem>
                )}
              </MenuContent>
            </MenuRoot>
          ))}
      </HStack>
    </Box>
  );
}

export default Header;