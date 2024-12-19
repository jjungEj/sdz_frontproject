import React, { useState, useEffect } from 'react';
import { Box, HStack, VStack, Heading, Link } from '@chakra-ui/react';
import { getCategories } from "../services/CategoryAPI";

function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  function loadCategories() {
    getCategories()
      .then(data => {
        setCategories(data);
      })
      .catch(error => {
        console.error("Failed to fetch categories:", error);
      });
  }

  return (
    <Box>
      {categories.map((category) => (
        <Box key={category.categoryId} mb={5}>
          <HStack justify="space-between" margin="5">
            <VStack>
              <Heading>{category.categoryName}</Heading>
            </VStack>
            <VStack>
              <Link 
                color="blue" 
                fontSize="sm" 
                href={`/products?categoryId=${category.categoryId}`}
              >
                ALL PRODUCTS
              </Link>
            </VStack>
          </HStack>
          <Box 
            borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} 
            mb={3} 
          />
        </Box>
      ))}
    </Box>
  );
}

export default Home;
