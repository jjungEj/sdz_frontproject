import React, { useState, useEffect } from 'react'
import { Box, HStack, VStack, Stack, Text, Input, Link, Button, Heading } from '@chakra-ui/react'
import { Field } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { PasswordInput } from '@/components/ui/password-input'
import { useNavigate } from 'react-router-dom'
import { SocialLoginButtons } from '@/components/SocialLoginButtons'
import { NativeSelectField, NativeSelectRoot } from '@/components/ui/native-select'
import { useForm } from 'react-hook-form'
import { VscChromeMinimize } from 'react-icons/vsc'
import { signUpProcess } from '@/services/UserAPI'
import { checkEmailExists, checkNickname, checkAccountLimit } from '@/services/VerificationAPI'

function SignUp() {
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [domain, setDomain] = useState('naver.com');
    const [userPassword, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [nickname, setNickname] = useState('');
    const [contact, setContact] = useState('');
    const [contactPrefix, setContactPrefix] = useState('');
    const [contactMid, setContactMid] = useState('');
    const [contactLast, setContactLast] = useState('');
    const [selection, setSelection] = useState([]);
    const [consent1, setConsent1] = useState(true);
    const [consent2, setConsent2] = useState(true);
    const [consent3, setConsent3] = useState(true);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();

    const isFormValid = userId && domain && userPassword && userName && nickname && contactPrefix && contactMid && contactLast;

    useEffect(() => {
        if (userId && domain) {
            const email = `${userId}@${domain}`;
            checkEmailExists(email)
                .then((response) => {
                if (response.exists) {
                    setError('email', { message: response.message });
                } else {
                    clearErrors('email');
                }
            })
            .catch((error) => {
                console.error('아이디 확인 과정에서 오류가 발생하였습니다.:', error);
            });
        }
    }, [userId, domain, setError])

    const handleCheckNickname = (e) => {
        const nicknameValue  = e.target.value;
        setNickname(nicknameValue)
        const userData = {
            nickname: nicknameValue,
        }
        checkNickname(userData)
            .then((response)=>{
                if (response.exists) {
                    setError('nickname', { message: response.message });
                } else {
                    clearErrors('nickname');
                }
            })
            .catch((error) => {
                console.error('닉네임 확인 과정에서 오류가 발생하였습니다.:', error);
            });
    }

    const handleConsent = (e) => {
        const isChecked = e.target.checked;
        setSelection(isChecked);
        setConsent1(isChecked);
        setConsent2(isChecked);
        setConsent3(isChecked);
    }

    const handleSignUp = (data) => {
        if (!consent1 || !consent2 || !consent3) {
            alert('모든 동의를 완료해야 회원가입이 가능합니다.');
            return;
        }
        const email = `${userId}@${domain}`;
        const contact = `${contactPrefix}${contactMid}${contactLast}`;
        checkAccountLimit(userName, contact)
            .then((response) => {
                if(response.userLimit < 3){
                    const newAccount = {
                        email,
                        userPassword,
                        userName,
                        nickname,
                        contact,
                    };
                    signUpProcess(newAccount)
                        .then((response) => {
                            if(response.success){
                                alert(response.userName+"님 환영합니다!\n"+response.message);
                                navigate('/');
                            } else {
                                alert(response.message);
                            }
                        })
                        .catch((error) => {
                            console.error('회원 가입 과정에서 오류가 발생하였습니다.:', error);
                        });
                } else {
                    alert(response.message);
                }
            })
            .catch((error) => {
                console.error('아이디 확인 과정에서 오류가 발생하였습니다.:', error);
            });
    };

    return (
        <Box>
            <VStack
                maxWidth='450px'
                margin='0 auto'
                align='center'
            >
                <Heading alignSelf='flex-start' fontSize='25px' mb='5'>
                    회원가입
                </Heading>
                <Text mb='3'>SNS 계정으로 간단하게 회원가입</Text>
                <SocialLoginButtons />
                <hr></hr>
                <form onSubmit={handleSubmit(handleSignUp)}>
                    <Stack
                    align='center' 
                    width='100%'
                    gap='2'
                    >
                    <Text
                        alignSelf='start'
                    >
                    아이디
                    </Text>
                        <HStack>
                            <Input
                                width='400px'
                                id='userId'
                                {...register('userId', {
                                    required: '아이디는 필수 입력 사항입니다.',
                                    onChange: (e) => {
                                        const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                                        setUserId(value);
                                    }
                                })}
                                value={userId}
                                maxLength='25'
                            />
                            <Text>@</Text>
                            <NativeSelectRoot>
                                <NativeSelectField 
                                        {...register('domain', { 
                                            required: '아이디는 필수 입력 사항입니다.'
                                        })}
                                        value={domain}
                                        onChange={ e => setDomain(e.target.value)}
                                >
                                        <option value='naver.com'>naver.com</option>
                                        <option value='gmail.com'>gmail.com</option>
                                        <option value='daum.net'>daum.net</option>
                                        <option value='nate.com'>nate.com</option>
                                    </NativeSelectField>
                            </NativeSelectRoot>
                        </HStack>
                        <Field 
                            invalid={!!errors.email} 
                            errorText={errors.email?.message}
                        >
                            <Input
                                {...register('email')}
                                value={email}
                                hidden
                            />
                        </Field>
                        <Field 
                            label='비밀번호' 
                            invalid={!!errors.userPassword}
                            errorText={errors.userPassword?.message}
                        >
                            <PasswordInput 
                                {...register('userPassword', {
                                    required: '비밀번호는 필수 입력 사항입니다.',
                                    validate: value => {
                                        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,13}$/;
                                        return passwordPattern.test(value) || '비밀번호는 알파벳과 숫자를 포함하여 8자 이상 13자 이하로 입력해야 합니다.';
                                    }
                                })}
                                defaultValue= {userPassword} 
                                onChange={e => setPassword(e.target.value)}
                            />
                        </Field>
                        <Field 
                            label='이름' 
                            invalid={!!errors.userName} 
                            errorText={errors.userName?.message}
                            gap='0'
                        >
                            <Input
                                {...register('userName', {
                                    onChange: (e) => {
                                        const value = e.target.value.replace(/[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
                                        setUserName(value);
                                    }
                                })}
                                value={userName}
                                maxLength='30'
                            />
                        </Field>
                        <Field
                            label='닉네임'
                            invalid={!!errors.nickname}
                            errorText={errors.nickname?.message}
                            gap='0'
                        >
                            <Input
                                {...register('nickname', {
                                    onChange: (e) => {
                                        const value = e.target.value.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
                                        setNickname(value);
                                    }
                                })}
                                value={nickname}
                                onBlur={ e => handleCheckNickname(e) }
                                maxLength='10'
                            />
                        </Field>
                        <Field
                            label='연락처'
                            invalid={!!errors.contact}
                            errorText={errors.contact?.message}
                            gap='0'
                        >
                            <HStack>
                                <Input
                                    width='160px'
                                    id='contactPrefix'
                                    {...register('contactPrefix', { 
                                        required: '연락처는 필수 입력 사항입니다.',
                                        onChange: (e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        setContactPrefix(value);
                                        },
                                    })}
                                    value={contactPrefix}
                                    maxLength='3'
                                />
                                <VscChromeMinimize style={{ fontSize: '15px', fontWeight: 'bold' }}/>
                                <Input
                                    width='160px'
                                    id='contactMid'
                                    {...register('contactMid', {
                                        required: '연락처는 필수 입력 사항입니다.',
                                        onChange: (e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        setContactMid(value);
                                        },
                                    })}
                                    value={contactMid}
                                    maxLength='4'
                                />
                                <VscChromeMinimize style={{ fontSize: '15px', fontWeight: 'bold' }}/>
                                <Input
                                    width='160px'
                                    id='contactLast'
                                    {...register('contactLast', {
                                        required: '연락처는 필수 입력 사항입니다.',
                                        onChange: (e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        setContactLast(value);
                                        },
                                    })}
                                    value={contactLast}
                                    maxLength='4'
                                />
                            </HStack>
                        </Field>
                        <VStack
                            width='100%'
                            align='justify-start'
                            gap='20px'
                            mt='30px'
                        >
                            <Checkbox
                                checked={selection}
                                onChange={handleConsent}
                            >
                                전체 동의
                            </Checkbox>
                            <hr />
                            <Checkbox
                                checked={consent1}
                                onChange={e => setConsent1(e.target.checked)}
                            >
                                만 14세 이상입니다
                            </Checkbox>
                            <Checkbox
                                checked={consent2} 
                                onChange={e => setConsent2(e.target.checked)}
                            >
                                이용약관
                            </Checkbox>
                            <Checkbox
                                checked={consent3}
                                onChange={e => setConsent3(e.target.checked)}
                            >
                                개인정보수집 및 이용동의
                            </Checkbox>
                        </VStack>
                        <Button
                            type='submit'
                            disabled={!isFormValid}
                            mt='20px'
                            mb='20px'
                        >
                            회원가입하기
                        </Button>
                        <Text>
                            이미 아이디가 있으신가요?
                            <Link href='/login' ml='3'>로그인</Link>
                        </Text>
                        </Stack>
                    </form>
            </VStack>
        </Box>
    );
}

export default SignUp;