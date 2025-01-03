import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import MainSlider from '@/components/MainSlider';
import { cards } from '@/data/slideCards';
import SubCategoryCard from '@/components/SubCategoryCard';
import useCategoryStore from '@/store/CategoryStore';


import { Box, HStack, VStack, Heading, Link as ChakraLink } from '@chakra-ui/react';

function Home() {
  const { categories, getCategories } = useCategoryStore();

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Box marginBottom="20">
        <MainSlider cards={cards} />
      </Box>
      <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
      {categories
        .filter(category => category.parentId === null)
        .map((category) => {
          const subCategories = categories.filter(subCategory => subCategory.parentId === category.categoryId);
          return (
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
                    color="#5526cc"
                  >
                    <Link to={`/products?categoryId=${category.categoryId}`}>
                      ALL PRODUCTS
                    </Link>
                  </ChakraLink>
                </VStack>
              </HStack>
              <SubCategoryCard categories={subCategories} />
              <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} mt={10} />
            </Box>
          );
        }
        )}
    </>
  );
}

export default Home;
