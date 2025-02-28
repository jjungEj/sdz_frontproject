import React, { useState, useEffect } from 'react';
import { HStack, Button } from '@chakra-ui/react';

export const SocialLoginButtons = () => {
    const [snsButtons, setSnsButtons] = useState([]);

    useEffect(() => {
        const buttons = [
            {
                imgSrc: 'assets/login_contents_google.png',
                altText: 'Google',
                url: 'https://elice-sdz.duckdns.org/oauth2/authorization/google'
            },
            {
                imgSrc: 'assets/login_contents_kakao.png',
                altText: 'Kakao',
                url: 'https://elice-sdz.duckdns.org/oauth2/authorization/kakao'
            },
            {
                imgSrc: 'assets/login_contents_naver.png',
                altText: 'Naver',
                url: 'https://elice-sdz.duckdns.org/oauth2/authorization/naver'
            },
        ];
        setSnsButtons(buttons);
    }, []);

    return (
        <HStack spacing={4}>
            {snsButtons.map((sns, index) => (
                <Button
                    key={index}
                    onClick={() => window.location.href = sns.url}
                    style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                >
                    <img
                        src={sns.imgSrc}
                        alt={sns.altText}
                        style={{ width: '45px', height: '45px' }}
                    />
                </Button>
            ))}
        </HStack>
    );
};