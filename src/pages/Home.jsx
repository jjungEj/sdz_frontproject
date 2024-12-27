import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import MainSlider from '@/components/MainSlider';
import { cards } from '@/data/slideCards';
import CategoryContent from '@/components/CategoryContent';
import useCategoryStore from '@/store/CategoryStore';


import { Box, Stack, HStack, VStack, Heading, Link as ChakraLink, Image } from '@chakra-ui/react';

function Home() {
  const { categories, getCategories } = useCategoryStore();

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Box>
      <Box marginBottom="20">
        <MainSlider cards={cards} />
      </Box>
      <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
      {categories
      .filter(category => category.parentId === null)
      .map((category) => (
        <Box key={category.categoryId} mb={5}>
          <HStack justify="space-between" margin="5">
            <VStack>
              <Heading>{category.categoryName}</Heading>
            </VStack>
            <VStack>
              <ChakraLink
                asChild
                _focus={{ outline: "none" }}
                fontSize="xs"
                fontWeight="medium"
                color="teal.600"
              >
                <Link to={`/products?categoryId=${category.categoryId}`}>
                  ALL PRODUCTS
                </Link>
              </ChakraLink>
            </VStack>
          </HStack>
          <CategoryContent category={category} />
          <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} mt={10} />
        </Box>
      ))}
    </Box>
  );
}

export default Home;
