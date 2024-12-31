import React, { useState, useEffect } from 'react';
import { HStack, Button } from '@chakra-ui/react';

export const SocialLoginButtons = () => {
    const [snsButtons, setSnsButtons] = useState([]);

    useEffect(() => {
        const buttons = [
            {
                imgSrc: 'src/assets/login_contents_google.png',
                altText: 'Google',
                url: 'http://34.64.176.77:8080/oauth2/authorization/google',
            },
            {
                imgSrc: 'src/assets/login_contents_kakao.png',
                altText: 'Kakao',
                url: 'http://34.64.176.77:8080/oauth2/authorization/kakao',
            },
            {
                imgSrc: 'src/assets/login_contents_naver.png',
                altText: 'Naver',
                url: 'http://34.64.176.77:8080/oauth2/authorization/naver',
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
                        style={{ width: '40px', height: '40px' }}
                    />
                </Button>
            ))}
        </HStack>
    );
};