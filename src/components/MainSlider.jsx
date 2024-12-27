import React, { useState } from 'react';
import Slider from 'react-slick';

import { cards } from '@/data/slideCards';

import { Box, Container, Stack, Heading, Text, Image } from '@chakra-ui/react';

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

function MainSlider() {
    return (
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
            <Slider {...settings}>
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
                            <Stack position="absolute" top="50%" transform="translate(0, -50%)">
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
    )
}

export default MainSlider;
