import React from 'react';
import { Image, Link, HStack, Text } from '@chakra-ui/react';
import categoryCards from '@/data/categoryCards';

function CategoryContent({ category }) {
    const data = categoryCards[category.categoryName] ?? [];

    return (
        <HStack justify="space-between" margin="10">
            {data.length > 0 ? (
                data.map((item, index) => (
                    <Link key={index} to={item.link}>
                        <Image
                            src={item.imageUrl}
                            alt={item.altText}
                            width="280px"
                            height="400px"
                            objectFit="cover"
                            borderRadius="2xl"
                        />
                    </Link>
                ))
            ) : (
                <Text>카테고리 콘텐츠가 없습니다.</Text>
            )}
        </HStack>
    );
}

export default CategoryContent;