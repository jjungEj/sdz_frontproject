import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Stack, HStack } from '@chakra-ui/react';
import { VscChromeMinimize } from 'react-icons/vsc';
import { Field } from '@/components/ui/field'
import { PasswordInput } from '@/components/ui/password-input'
import { useForm } from 'react-hook-form'
import { logout } from '@/services/LogoutAPI';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/AuthStore'
import { useShallow } from 'zustand/react/shallow'
import { UserInfo, updateLocal, updateSocial } from '@/services/UserAPI';
import { checkPassword, checkNickname } from '@/services/VerificationAPI';

const  UserInfoEdit = () => {
    const { email, loginType, handleLogout } = useAuthStore(
        useShallow((state) => ({ 
            email: state.email,
            loginType: state.loginType,
            handleLogout: state.handleLogout
        })),
    )
    return (
            <Box
                maxWidth='450px'
                align='center'
                margin='0 auto'
            >
                { loginType === 'social' ? (
                    <>
                        <UpdateSocial
                            email={email}
                            handleLogout={handleLogout}
                        />
                    </>
                ) : loginType === 'local' ? (
                    <>
                        <UpdateLocal
                            email={email}
                            handleLogout={handleLogout}
                        />
                    </>
                ) : null }
            </Box>
        );
}
export default UserInfoEdit;

const UpdateSocial = ({email, handleLogout}) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [nickname, setNickname] = useState('');
    const [contact, setContact] = useState('');
    const [contactPrefix, setContactPrefix] = useState('');
    const [contactMid, setContactMid] = useState('');
    const [contactLast, setContactLast] = useState('');
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();

    useEffect(() => {
        if (email) {
            UserInfo(email)
            .then((data) => {
                setUserName(data.userName);
                setNickname(data.nickname);
                setContact(data.contact);
                setContactPrefix(data.contact.slice(0, 3));
                setContactMid(data.contact.slice(3, 7));
                setContactLast(data.contact.slice(7));
            })
            .catch((error) => {
            });
        }
    }, [email]);

    const handleCheckNickname = (e) => {
        const nicknameValue  = e.target.value;
        setNickname(nicknameValue)
        const userData = {
            email,
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

    const handleUpdateSocialUser = async(data) => {
        try {
            const contact = `${contactPrefix}${contactMid}${contactLast}`;
            const userData = {
                email,
                userName,
                nickname,
                contact,
            };
    
            const response = await updateSocial(userData, email);
            if (response.success) {
                alert(response.message);
                await logout();
                handleLogout();
                navigate('/');
            }
        } catch (error) {
            console.error('회원정보 수정 과정에서 오류가 발생하였습니다.:', error);
        }
    };

    return (
            <Box>           
                <Stack
                    gap='10'
                    align='center' 
                    width='100%'
                    padding='30px'
                >
                    <form onSubmit={handleSubmit(handleUpdateSocialUser)}>
                        <Field>
                            <Input
                                value={email}
                                readOnly
                                hidden  
                            />
                        </Field>

                        <Field label='이름' gap='1' mt='2'>
                            <Input
                                value={userName}
                                readOnly 
                            />
                        </Field>

                        <Field
                            label='닉네임'
                            invalid={!!errors.nickname}
                            errorText={errors.nickname?.message}
                            gap='1' mt='2'
                        >
                            <Input
                                {...register('nickname', {
                                    onChange: (e) => {
                                        const value = e.target.value.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
                                        setNickname(value);
                                    }
                                })}
                                value={nickname|| ''}
                                onBlur={ e => handleCheckNickname(e) }
                                maxLength='10'
                            />
                        </Field>

                        <Field
                            label='연락처'
                            invalid={!!errors.contact|| ''}
                            errorText={errors.contact?.message}
                            gap='1' mt='2'
                        >
                            <HStack>
                                <Input
                                    width='110px'
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
                                    width='110px'
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
                                    width='110px'
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
                        <HStack
                            justifySelf='center'
                            gap='30px'
                            mt='30px'
                        >
                            <Button
                                type='submit'
                            >
                                회원정보 수정
                            </Button>
                            <Button 
                                onClick={() => navigate('/mypage')}
                                style={{ border: '1px solid black',
                                        background: 'none',
                                        cursor: 'pointer',
                                        color: 'black'
                                }}
                            >
                                다음에 변경하기
                            </Button>
                        </HStack>
                    </form>
                </Stack>
            </Box>
    )
}

const UpdateLocal = ({email, handleLogout}) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [nickname, setNickname] = useState('');
    const [contact, setContact] = useState('');
    const [contactPrefix, setContactPrefix] = useState('');
    const [contactMid, setContactMid] = useState('');
    const [contactLast, setContactLast] = useState('');
    const [existingPassword, setExistingPassword] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();

    useEffect(() => {
        if (email) {
            UserInfo(email)
                .then((data) => {
                    setUserName(data.userName);
                    setNickname(data.nickname);
                    setContact(data.contact);
                    setContactPrefix(data.contact.slice(0, 3));
                    setContactMid(data.contact.slice(3, 7));
                    setContactLast(data.contact.slice(7));
                })
                .catch((error) => {
                });
        }
    }, [email]);

    const handleCheckPassword = (e) => {
        const passwordValue = e.target.value;
        setExistingPassword(passwordValue)
        checkPassword(email, existingPassword)
            .then((response)=>{
                if (response.valid) {
                    clearErrors('existingPassword');
                } else {
                    setError('existingPassword', { message: response.message });
                }
            })
            .catch((error) => {
                console.error('비밀번호 확인 과정에서 오류가 발생하였습니다.:', error);
            });
        
    }

    const handleCheckNickname = (e) => {
        const nicknameValue  = e.target.value;
        setNickname(nicknameValue)
        const userData = {
            email,
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

    const handleUpdateLocalUser = async(data) => {
        if (userPassword !== confirmPassword) {
            setError('confirmPassword', { message: '비밀번호가 일치하지 않습니다.' });
            return;
        }
        const contact = `${contactPrefix}${contactMid}${contactLast}`;
        const userData = {
            email,
            userName,
            nickname,
            contact,
            userPassword,
        }
        try {
            const response = await updateLocal(userData);
            if (response.success) {
                alert(response.message);
                await logout();
                handleLogout();
                navigate('/');
            }
        } catch (error) {
            console.error('회원정보 수정 과정에서 오류가 발생하였습니다.:', error);
        }
    };

    return (
            <Box>           
                <Stack
                    gap='10'
                    align='center' 
                    width='100%'
                    padding='30px'
                >
                    <form onSubmit={handleSubmit(handleUpdateLocalUser)}>
                        <Field label='아이디' gap='1'>
                            <Input
                                value={email}
                                readOnly 
                            />
                        </Field>

                        <Field label='이름' gap='1' mt='2'>
                            <Input
                                value={userName}
                                readOnly 
                            />
                        </Field>

                        <Field
                            label='닉네임'
                            invalid={!!errors.nickname}
                            errorText={errors.nickname?.message}
                            gap='1' mt='2'
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
                            gap='1' mt='2'
                        >
                            <HStack>
                                <Input
                                    width='110px'
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
                                    width='110px'
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
                                    width='110px'
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

                        <Field
                            label='기존 비밀번호'
                            invalid={!!errors.existingPassword}
                            errorText={errors.existingPassword?.message}
                            gap='1' mt='2'
                        >
                        <PasswordInput
                            {...register('existingPassword', {
                                required: '기존 비밀번호는 회원정보 변경시 필수 인증 사항입니다.' })}
                                onBlur= { e => handleCheckPassword(e) }
                                maxLength='15'
                        />
                        </Field>

                        <Field
                            label='새로운 비밀번호'
                            invalid={!!errors.userPassword}
                            errorText={errors.userPassword?.message}
                            gap='1' mt='2'
                        >
                        <PasswordInput
                            {...register('userPassword', {
                                validate: value => {
                                    if (!value) return true;
                                    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,13}$/;
                                    return passwordPattern.test(value) || '비밀번호는 알파벳과 숫자를 포함하여 8자 이상 13자 이하로 입력해야 합니다.';
                                }
                            })}
                            onChange={e => setUserPassword(e.target.value)}
                            maxLength='15'
                        />
                        </Field>

                        <Field
                            label='비밀번호 확인'
                            invalid={!!errors.confirmPassword}
                            errorText={errors.confirmPassword?.message}
                            gap='1' mt='2'
                        >
                        <PasswordInput
                            {...register('confirmPassword', {
                            validate: value => value === userPassword || '비밀번호가 일치하지 않습니다.'
                            })}
                            onChange={e => setConfirmPassword(e.target.value)}
                            maxLength='15'
                        />
                        </Field>
                        <HStack
                            justifySelf='center'
                            gap='30px'
                            mt='30px'
                        >
                            <Button
                                type='submit'
                            >
                                회원정보 수정
                            </Button>
                            <Button 
                                onClick={() => navigate('/mypage')}
                                style={{ border: '1px solid black',
                                        background: 'none',
                                        cursor: 'pointer',
                                        color: 'black'
                                }}
                            >
                                다음에 변경하기
                            </Button>
                        </HStack>
                    </form>
                </Stack>
            </Box>
    )
}