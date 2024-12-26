import React, { useState, useEffect } from 'react';

import useCategoryStore from '@/store/CategoryStore';

import { Box, HStack, VStack, Text } from '@chakra-ui/react';

function Footer() {
  const { categories, getCategories } = useCategoryStore();

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Box maxWidth="1200px" width="100%" margin="0 auto" p={5}>
      <HStack align="flex-start" spacing={4}>
        <VStack align="flex-start" width="400px">
          <Text fontWeight="bold" fontSize="sm">Copyright (c) 2024 SDZ</Text>
          <Text fontSize="2xs">repository: kdt-gitlab.elice.io/cloud_track/class_05/web_project2/team02</Text>
        </VStack>
        <VStack align="flex-start" width="100px">
          <Text fontWeight="bold" fontSize="sm">제품</Text>
          {categories
          .filter(category => category.parentId === null)
          .map((category, index) => (
            <Text key={index} fontSize="xs">{category.categoryName}</Text>
          ))}
        </VStack>
        <VStack align="flex-start" spacing={4}>
          <Text fontWeight="bold" fontSize="sm">문의</Text>
          <Text fontSize="xs">문의내용보기</Text>
          <Text fontSize="xs">문의하기</Text>
          <Text fontSize="xs">평일 | 09:30 ~ 17:30</Text>
          <Text fontSize="xs">점심시간 | 12:30 ~ 13:30</Text>
          <Text fontSize="xs">토요일, 일요일, 공휴일 휴무</Text>
        </VStack>
      </HStack>
    </Box>
  );
}

export default Footer;