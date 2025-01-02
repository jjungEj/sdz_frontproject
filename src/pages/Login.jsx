import React, { useState, useEffect } from 'react'
import { Box, HStack, VStack, Text, Input, Button } from '@chakra-ui/react'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { useNavigate } from 'react-router-dom'
import { PasswordInput } from '@/components/ui/password-input'
import { loginProcess } from '@/services/LoginAPI'
import { FindId, FindPassword } from './AccountDialog'
import useAuthStore from '@/store/AuthStore';
import { SocialLoginButtons } from '@/components/SocialLoginButtons'

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
    const [rememberId, setRememberId] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const { handleLogin } = useAuthStore();

    useEffect(() => {
        const encodedUserId = getCookie('remember-id');
        if (encodedUserId) {
            const decodedUserId = atob(encodedUserId);
            setEmail(decodedUserId);
            setRememberId(true);
        }
    }, []);

    const isLoginButtonDisabled = !email || !password;

    const handleLoginSubmit = () => {
        const LoginAcount = {
            email, 
            password, 
            rememberId, 
            rememberMe
        };
        loginProcess(LoginAcount)
            .then((response) => {
                if (response.httpStatus === 'OK') {
                    handleLogin();
                    navigate('/');
                } else if (response.httpStatus === 'FORBIDDEN') {
                    alert(response.message + "\n비밀번호 찾기를 통해 임시 비밀번호를 발급하세요.");
                    return;
                } else if (response.httpStatus === 'UNAUTHORIZED') {
                    alert(response.message + "\n아이디 또는 비밀번호를 확인하세요.");
                    return;
                } else if (response.httpStatus === 'NOT_FOUND') {
                    alert("아이디 또는 비밀번호를 확인하세요.");
                    return;
                }
            })
            .catch((error) => {
            });
    };

    return (
        <Box>
            <VStack
                maxWidth='600px'
                margin='0 auto'
                padding='30px'
                align='center'
                gap='20px'
            >
                <Field
                    label='아이디'
                >
                    <Input
                        value= {email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </Field>
                <Field
                    label='비밀번호'
                >
                    <PasswordInput 
                        value= {password} 
                        onChange={e => setPassword(e.target.value)}
                    />
                </Field>
                <HStack
                    width='100%'
                    align='start'
                    alignItems='center'
                    justifyContent= 'space-between'
                >
                    <HStack gap='5'>
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
                    <HStack gap='0'>
                        <FindId />
                        <FindPassword />
                    </HStack>
                </HStack>
                <Button 
                    onClick={ handleLoginSubmit }
                    style={{ width: '100%', height: '60px' }}
                    disabled={isLoginButtonDisabled}
                >
                    로그인
                </Button>
                <Button 
                    onClick={() => navigate('/signUp')}
                    style={{ width: '100%',
                            height: '60px',
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