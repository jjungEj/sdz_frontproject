import React, { useState, useEffect } from 'react';
import { Box, HStack, VStack, Text, Input, Link, Button } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { signUpProcess } from '../services/UserAPI';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [nickname, setNickname] = useState('');
    const [contact, setContact] = useState('');
    const navigate = useNavigate();

    const handleSignUp = (event) => {
        event.preventDefault();
        signUpProcess(email, password, userName, nickname, contact)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Box>
            <Text>회원가입</Text>
            <Text>SNS 계정으로 간단하게 회원가입</Text>
            <div>로고가 들어갈 자리</div>
            <hr></hr>
            <Field label='Email' invalid errorText='This is an error text'>
                <Input value= {email} onChange={e => setEmail(e.target.value)}
                placeholder='이메일을 입력하세요' />
            </Field>
            <Field label='Password' invalid errorText='This is an error text'>
                <Input value= {password} onChange={e => setPassword(e.target.value)}
                placeholder='비밀번호를 입력하세요' />
            </Field>
            <Field label='이름' invalid errorText='This is an error text'>
                <Input value= {userName} onChange={e => setUserName(e.target.value)}
                placeholder='이름을 입력하세요' />
            </Field>
            <Field label='닉네임' invalid errorText='This is an error text'>
                <Input value= {nickname} onChange={e => setNickname(e.target.value)}
                placeholder='비밀번호를 입력하세요' />
            </Field>
            <Field label='연락처' invalid errorText='This is an error text'>
                <Input value= {contact} onChange={e => setContact(e.target.value)}
                placeholder='연락처를 입력하세요' />
            </Field>
            <Box>
                <Checkbox>
                    전체 동의
                </Checkbox>
                <hr></hr>
                <Checkbox>
                    만 14세 이상입니다 (필수)
                </Checkbox>
                <Checkbox>
                    이용약관 (필수)
                </Checkbox>
                <Checkbox>
                    개인정보수집 및 이용동의 (필수)
                </Checkbox>
            </Box>
            <Button onClick={ handleSignUp }>회원가입하기</Button>
            <Text>이미 아이디가 있으신가요? <Link href="/login">로그인</Link></Text>
        </Box>
    );
}

export default SignUp;