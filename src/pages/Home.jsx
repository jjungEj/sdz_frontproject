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
      });
  }

  return (
    <Box>
      {categories.length > 0 && categories[0] ? (
        <Box>
          <HStack justify="space-between" margin="5">
            <VStack>
              <Heading>{categories[0].categoryName}</Heading>
            </VStack>
            <VStack>
              <Link color="blue" fontSize="sm">ALL PRODUCTS</Link>
            </VStack>
          </HStack>
          <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box>
      ) : (
        <></>
      )}
      {categories.length > 0 && categories[1] ? (
        <Box>
          <HStack justify="space-between" margin="5">
            <VStack>
              <Heading>{categories[1].categoryName}</Heading>
            </VStack>
            <VStack>
              <Link color="blue" fontSize="sm">ALL PRODUCTS</Link>
            </VStack>
          </HStack>
          <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box>
      ) : (
        <></>
      )}
      {categories.length > 0 && categories[2] ? (
        <Box>
          <HStack justify="space-between" margin="5">
            <VStack>
              <Heading>{categories[2].categoryName}</Heading>
            </VStack>
            <VStack>
              <Link color="blue" fontSize="sm">ALL PRODUCTS</Link>
            </VStack>
          </HStack>
          <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box>
      ) : (
        <></>
      )}
      {categories.length > 0 && categories[3] ? (
        <Box>
          <HStack justify="space-between" margin="5">
            <VStack>
              <Heading>{categories[3].categoryName}</Heading>
            </VStack>
            <VStack>
              <Link color="blue" fontSize="sm">ALL PRODUCTS</Link>
            </VStack>
          </HStack>
          <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box>
      ) : (
        <></>
      )}
      {categories.length > 0 && categories[4] ? (
        <Box>
          <HStack justify="space-between" margin="5">
            <VStack>
              <Heading>{categories[4].categoryName}</Heading>
            </VStack>
            <VStack>
              <Link color="blue" fontSize="sm">ALL PRODUCTS</Link>
            </VStack>
          </HStack>
          <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
}

export default Home;