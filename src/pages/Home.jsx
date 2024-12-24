import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Stack, HStack, VStack, Heading, Link as ChakraLink, Container, Text } from '@chakra-ui/react';
import { getCategoriesAPI } from "../services/CategoryAPI";
import Slider from 'react-slick'

const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
}

function Home() {
  const [categories, setCategories] = useState([]);
  const [slider, setSlider] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  function loadCategories() {
    getCategoriesAPI()
      .then(data => {
        setCategories(data);
      })
      .catch(error => {
        console.error("Failed to fetch categories:", error);
      });
  }

  return (
    <Box>
      <Box marginBottom="20">
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        <Slider {...settings} ref={(slider) => setSlider(slider)}>
        {cards.map((card, index) => (
          <Box
            key={index}
            position="relative"
            backgroundPosition="right"
            backgroundRepeat="no-repeat"
            backgroundSize="contain"
            backgroundImage={`url(${card.image})`}
            borderRadius="2xl"
            marginBottom="5"
            >
            <Container width="sm" height="600px" marginLeft="0">
              <Stack
                position="absolute"
                top="50%"
                transform="translate(0, -50%)"
                >
                <Heading fontSize="4xl" fontWeight="bold">{card.title1}</Heading>
                <Heading fontSize="4xl" fontWeight="bold" marginBottom="5">{card.title2}</Heading>
                <Heading color="teal.600" fontSize="5xl" fontWeight="bold" marginBottom="5">{card.title3}</Heading>
                <Text fontSize="lg" color="GrayText">{card.text1}</Text>
                <Text fontSize="lg" color="GrayText">{card.text2}</Text>
                <Text fontSize="lg" color="GrayText">{card.text3}</Text>
              </Stack>
            </Container>
          </Box>
        ))}
      </Slider>
      </Box>
      <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
      {categories.map((category) => (
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
          <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box>
      ))}
    </Box>
  );
}

const cards = [
  {
    title1: "바퀴는 빼고",
    title2: "집중력은 더하다",
    title3: "ible",
    text1: "대학 도서관, 프리미엄 독서실에",
    text2: "앉아있는 것처럼 집에서도",
    text3: "'집중하는 분위기'를 만들어 줍니다",
    image: "src/assets/main_contents_5.jpg"
  },
  {
    title1: "국민 아이들 의자",
    title2: "NO.1",
    title3: "ringo",
    text1: "앉아있는 시간만큼",
    text2: "자라는 생각의 힘을",
    text3: "더 크게 키워주세요",
    image: "src/assets/main_contents_3.jpg"
  },
  {
    title1: "좋은 의자의 ",
    title2: "기준을 세우다",
    title3: "T50",
    text1: "좋은 의자는",
    text2: "모두가 알아보는 법",
    text3: "밀리언셀러 의자",
    image: "src/assets/main_contents_6.jpg"
  },
  {
    title1: "하이엔드 의자의",
    title2: "새로운 차원",
    title3: "T90",
    text1: "인간공학 의자, 그다음",
    text2: "멀티 디바이스 시대가 기다린",
    text3: "퍼포먼스 공학 의자",
    image: "src/assets/main_contents_1.jpg"
  }
]

export default Home;
