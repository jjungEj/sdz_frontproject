import { useState, useEffect } from 'react';
import { Box, HStack, VStack, Text, Input, Link, Button } from '@chakra-ui/react';
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { useNavigate } from 'react-router-dom';
import { loginProcess } from "../services/LoginAPI";
import { useAuth } from "../services/AuthContext";

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0] === name) {
            return decodeURIComponent(cookie[1]);
        }
    }
    return null;
}

function SNS({ imgSrc, altText, url }) {
    const handleClick = () => {
        window.location.href = url;
    };

    return (
        <button onClick={handleClick} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <img src={imgSrc} alt={altText} style={{ width: '30px', height: '30px' }} />
        </button>
    );
}

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { handleContextLogin } = useAuth;
    const [rememberId, setRememberId] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const encodedUserId = getCookie("remember-id");
        if (encodedUserId) {
            const decodedUserId = atob(encodedUserId);
            setEmail(decodedUserId);
            setRememberId(true);
        }
    }, []);

    const handleLogin = (event) => {
        event.preventDefault();
        loginProcess(email, password, rememberId, rememberMe)
            .then(() => {
                handleContextLogin();
                navigate('/');
            })
            .catch((error) => {
            });
    };

    const snsButtons = [
        { imgSrc: "/path/to/google-icon.png", altText: "Google", 
            url: "http://localhost:8080/oauth2/authorization/google" },
        { imgSrc: "/path/to/kakao-icon.png", altText: "Kakao", 
            url: "http://localhost:8080/oauth2/authorization/kakao" },
        { imgSrc: "/path/to/naver-icon.png", altText: "Naver", 
            url: "http://localhost:8080/oauth2/authorization/naver" },
    ];

    return (
        <Box>
            <div>로고가 들어갈 자리</div>
            <Field label="Email" invalid errorText="This is an error text">
                <Input value= {email} onChange={e => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요" />
            </Field>
            <Field label="Password" invalid errorText="This is an error text">
                <Input value= {password} onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요" />
            </Field>
            <Checkbox checked={rememberMe}
                    onCheckedChange={(e) => setRememberMe(!!e.checked)}>
                        로그인 상태 유지
            </Checkbox>
            <Checkbox checked={rememberId}
                    onCheckedChange={(e) => setRememberId(!!e.checked)}>
                        아이디 기억하기
            </Checkbox>
            <Button onClick={ handleLogin }>로그인</Button>
            <Button onClick={() => navigate('/signUp')}>회원가입</Button>
            <Text>SNS 계정으로 간편 로그인/회원가입</Text>
            <HStack spacing={4}>
                {snsButtons.map((sns, index) => (
                    <SNS
                        key={index}
                        imgSrc={sns.imgSrc}
                        altText={sns.altText}
                        url={sns.url}
                    />
                ))}
            </HStack>
        </Box>
    );
}

export default Login;