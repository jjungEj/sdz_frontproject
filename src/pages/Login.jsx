import React, { useState, useEffect } from 'react';
import { Box, HStack, VStack, Text, Input, Button } from '@chakra-ui/react';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { useNavigate } from 'react-router-dom';
import { PasswordInput } from '@/components/ui/password-input'
import { loginProcess } from '../services/LoginAPI';
import { FindId, FindPassword } from './AccountDialog';
import { useAuth } from '../services/AuthContext';
import { SocialLoginButtons } from '../components/SocialLoginButtons';

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === name) {
            return decodeURIComponent(cookie[1]);
        }
    }
    return null;
}

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { handleContextLogin } = useAuth();
    const [rememberId, setRememberId] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const encodedUserId = getCookie('remember-id');
        if (encodedUserId) {
            const decodedUserId = atob(encodedUserId);
            setEmail(decodedUserId);
            setRememberId(true);
        }
    }, []);

    const isLoginButtonDisabled = !email || !password;

    const handleLogin = () => {
        const LoginAcount = {
            email, 
            password, 
            rememberId, 
            rememberMe
        };
        loginProcess(LoginAcount)
            .then((response) => {
                handleContextLogin();
                navigate('/');
            })
            .catch((error) => {
            });
    };

    return (
        <Box>
            <VStack
                maxWidth='600px'
                margin='0 auto'
                align='center'
                gap='20px'
            >
                <Text>로고가 들어갈 자리</Text>
                <Field
                    label='Email'
                >
                    <Input
                        value= {email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </Field>
                <Field
                    label='Password'
                >
                    <PasswordInput 
                        value= {password} 
                        onChange={e => setPassword(e.target.value)}
                    />
                </Field>
                <HStack width='100%' align='start'>
                    <HStack gap={5}>
                        <Checkbox 
                            checked={rememberMe}
                            onCheckedChange={(e) => setRememberMe(!!e.checked)}>
                            로그인 상태 유지
                        </Checkbox>
                        <Checkbox 
                            checked={rememberId}
                            onCheckedChange={(e) => setRememberId(!!e.checked)}>
                            아이디 기억하기
                        </Checkbox>
                    </HStack>
                </HStack>
                <HStack>
                    <FindId />
                    <FindPassword />
                </HStack>
                <Button 
                    onClick={ handleLogin }
                    style={{ width: '100%', height: '50px' }}
                    disabled={isLoginButtonDisabled}
                >
                    로그인
                </Button>
                <Button 
                    onClick={() => navigate('/signUp')}
                    style={{ width: '100%',
                            height: '50px',
                            border: '1px solid black', background: 'none',
                            cursor: 'pointer',
                            color: 'black'
                    }}
                >
                    회원가입
                </Button>
                <Text>SNS 계정으로 간편 로그인/회원가입</Text>
                <SocialLoginButtons />
            </VStack>
        </Box>
    );
}

export default Login;