import React from 'react';
import { Link } from 'react-router-dom';

import subCategoryImage from '@/data/subCategoryImage';

import { Box, Image, Link as ChakraLink, HStack, Text, VStack, Heading } from '@chakra-ui/react';

function SubCategoryCard({ categories }) {
    const subCategoriesImage = categories
        .filter(category => category.parentId)
        .map(category => ({
            ...category,
            imageUrl: subCategoryImage[category.categoryName]
        }));

    return (
        <HStack wrap="wrap" justify="center" margin="5" ml="20">
            {subCategoriesImage.length > 0 ? (
                subCategoriesImage?.map((category) => (
                    <Box key={category.categoryId} width="calc(33.33% - 20px)" mb="5">
                        <ChakraLink asChild _focus={{ outline: "none" }}>
                            <Link to={`/products?categoryId=${category.categoryId}`}>
                            <VStack>
                                <Image
                                    src={category.imageUrl}
                                    alt={category.categoryName}
                                    width="300px"
                                    height="400px"
                                    objectFit="cover"
                                    borderRadius="2xl"
                                    mb="5"
                                />
                                
                                    <Heading color="grey" fontSize="2xl" ml="-5">{category.categoryName}</Heading>
                                </VStack>
                            </Link>
                        </ChakraLink>
                    </Box>
                ))
            ) : (
                <Text>카테고리 콘텐츠가 없습니다.</Text>
            )}
        </HStack>
    );
}

export default SubCategoryCard;