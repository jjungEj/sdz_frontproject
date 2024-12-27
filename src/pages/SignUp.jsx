import React, { useState, useEffect } from 'react';
import { Box, HStack, VStack, Stack, Text, Input, Link, Button, Heading } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordInput } from "@/components/ui/password-input"
import { useNavigate } from 'react-router-dom';
import { SocialLoginButtons } from '../components/SocialLoginButtons';
import { NativeSelectField, NativeSelectRoot } from '@/components/ui/native-select'
import { useForm } from 'react-hook-form'
import { VscChromeMinimize } from 'react-icons/vsc';
import { signUpProcess } from '../services/UserAPI';
import { checkEmailExists, checkNickname, checkAccountLimit } from '../services/VerificationAPI';

function SignUp() {
    const [email, setEmail] = useState('');
    const [userId, setuserId] = useState('');
    const [domain, setDomain] = useState('');
    const [userPassword, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [nickname, setNickname] = useState('');
    const [contact, setContact] = useState('');
    const [contactPrefix, setContactPrefix] = useState('');
    const [contactMid, setContactMid] = useState('');
    const [contactLast, setContactLast] = useState('');
    const [selection, setSelection] = useState([]);
    const [consent1, setConsent1] = useState(false);
    const [consent2, setConsent2] = useState(false);
    const [consent3, setConsent3] = useState(false);
    const navigate = useNavigate();

    // const [errors, setErrors] = useState({});
        const { register, handleSubmit, formState: { errors }, setError  } = useForm();

    // const handleBlurEmail = (e) => {
    //     const emailValue = e.target.value;
    //     checkEmailExists(email)
    //         .then((response) => {
    //             if(response.exists){
    //                 setErrors((prev) => ({ ...prev, email: '이미 가입되어있는 이메일입니다.' }));
    //             } else {
    //                 setErrors((prev) => ({ ...prev, email: '' }));
    //             }
    //         })
    //         .catch((error) => {
    //         });
    // };

    const handleCheckEmail = (e) => {
        const userValue = e.target.value;
        const emailValue = `${userValue}@${domain}`;
            setEmail(emailValue)
            checkEmailExists(email)
            .then((response)=>{
                if (response.exists) {
                    setError('email', { message: response.message });
                } else {
                    setError('email', { message: '' });
                }
            })
            .catch((error) => {
                console.error('이메일 확인 과정에서 오류가 발생하였습니다.:', error);
            });
    }

    const handleCheckNickname = (e) => {
        const nicknameValue  = e.target.value;
        setNickname(nicknameValue)
        const userData = {
            nickname: nicknameValue,
        }
        console.log(userData);
        checkNickname(userData)
        .then((response)=>{
            if (response.exists) {
                setError('nickname', { message: response.message });
            } else {
                setError('nickname', { message: '' });
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
        console.log('data',data);
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
                console.log('newAccountData',newAccount);
                signUpProcess(newAccount)
                    .then(() => {
                        alert('회원 가입이 완료되었습니다.');
                        navigate('/');
                    })
                    .catch((error) => {
                        console.error('회원 가입 과정에서 오류가 발생하였습니다.:', error);
                    });
            } else {
                alert(response.message);
            }
        })
        .catch((error) => {
            console.error('이메일 확인 과정에서 오류가 발생하였습니다.:', error);
        });
    };

    return (
        <Box>
            <VStack
                maxWidth='600px'
                margin='0 auto'
                align='center'
            >
                <Heading alignSelf='flex-start'>
                    회원가입
                </Heading>
                <Text>SNS 계정으로 간단하게 회원가입</Text>
                <SocialLoginButtons />
                <hr></hr>
                <form onSubmit={handleSubmit(handleSignUp)}>
                    <Stack
                    gap='5'
                    align='center' 
                    width='100%'
                    >
                        <Field 
                            label='이메일' 
                            invalid={!!errors.email} 
                            errorText={errors.email}
                        >
                            <HStack>
                            <Input
                                id='userId'
                                {...register('userId', {
                                    required: '이메일은 필수 입력 사항입니다.',
                                    validate: value => {
                                        // const emailPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{8,10}$/;
                                        // return emailPattern.test(value) || '이메일에는 형식으로 입력해주세요.';
                                    }
                                })}
                                defaultValue={userId}
                                onBlur={ e => handleCheckEmail(e) }
                                maxLength='25'
                            />
                            <Text>@</Text>
                            <NativeSelectRoot>
                                <NativeSelectField 
                                        defaultValue={domain}
                                    {...register('domain', { 
                                        required: '이메일은 필수 입력 사항입니다.'
                                    })}>
                                        <option value='naver.com'>naver.com</option>
                                        <option value='google.com'>google.com</option>
                                        <option value='daum.net'>daum.net</option>
                                        <option value='nate.com'>nate.com</option>
                                    </NativeSelectField>
                            </NativeSelectRoot>
                            {/* <Input
                                {...register('Email', {
                                    required: '이메일은 필수 입력 사항입니다.',
                                    validate: value => {
                                        const emailPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{8,10}$/;
                                        return emailPattern.test(value) || '이메일에는 형식으로 입력해주세요.';
                                    }
                                })}
                                defaultValue={email}
                                onBlur={ e => handleBlurEmail(e) }
                                maxLength='25'
                            /> */}
                            </HStack>
                        </Field>
                        <Field 
                            label='Password' 
                            invalid={!!errors.userPassword}
                            errorText={errors.userPassword}
                        >
                            <PasswordInput 
                                {...register('userPassword', {
                                    required: '패스워드는 필수 입력 사항입니다.',
                                    validate: value => {
                                        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,13}$/;
                                        return passwordPattern.test(value) || '비밀번호는 알파벳과 숫자를 포함하여 8자 이상 13자 이하로 입력해야 합니다.';
                                    }
                                })}
                                defaultValue= {userPassword} 
                                onChange={e => setPassword(e.target.value)}
                                placeholder='비밀번호를 입력하세요' 
                            />
                        </Field>
                        {/* <Field 
                            label='이름' 
                            invalid={!!errors.userName}
                            errorText={errors.userName}
                        >
                            <Input 
                                value= {userName} 
                                onChange={e => setUserName(e.target.value)}
                                placeholder='이름을 입력하세요' 
                            />
                        </Field> */}
                        <Field 
                            label='이름' 
                            invalid={!!errors.email} 
                            errorText={errors.email}
                        >
                            <Input
                                {...register('userName', {
                                    required: '이름은 필수 입력 사항입니다.',
                                    validate: value => {
                                        // const nicknamePattern = /^[a-zA-Z0-9가-힣]+$/;
                                        // return nicknamePattern.test(value) || '닉네임에는 특수문자를 사용할 수 없습니다.';
                                    }
                                })}
                                defaultValue={userName}
                                onChange={e => setUserName(e.target.value)}
                                maxLength='30'
                            />
                        </Field>
                        {/* <Field 
                            label='닉네임' 
                            invalid={!!errors.nickname} 
                            errorText={errors.nickname}
                        >
                            <Input 
                                value= {nickname} 
                                onChange={e => setNickname(e.target.value)}
                                placeholder='닉네임을 입력하세요' 
                                onBlur={handleBlurNickname}
                            />
                        </Field> */}
                        <Field
                            label='닉네임'
                            invalid={!!errors.nickname}
                            errorText={errors.nickname?.message}
                        >
                            <Input
                                {...register('nickname', {
                                    required: '닉네임은 필수 입력 사항입니다.',
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
                        >
                            <HStack>
                                <Input
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
                                <VscChromeMinimize />
                                <Input
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
                                <VscChromeMinimize />
                                <Input
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
                        {/* <Field 
                            label='연락처' 
                            invalid={!!errors.contact} 
                            errorText={errors.contact}
                        >
                            <Input 
                                value= {contact} 
                                onChange={e => setContact(e.target.value)}
                                placeholder='연락처를 입력하세요' 
                            />
                        </Field> */}
                        <VStack
                            width='100%'
                            align='justify-start'
                            gap='20px'
                        >
                            <Checkbox
                                checked={selection}
                                onChange={e => { handleConsent }}
                            >
                                전체 동의
                            </Checkbox>
                            <hr />
                            <Checkbox
                                checked={consent1}
                                onChange={e => { setConsent1(e.target.checked); }}
                            >
                                만 14세 이상입니다 (필수)
                            </Checkbox>
                            <Checkbox
                                checked={consent2} 
                                onChange={e => { setConsent2(e.target.checked); }}
                            >
                                이용약관 (필수)
                            </Checkbox>
                            <Checkbox
                                checked={consent3}
                                onChange={e => { setConsent3(e.target.checked); }}
                            >
                                개인정보수집 및 이용동의 (필수)
                            </Checkbox>
                        </VStack>
                        <Button
                            type='submit'
                        >
                            회원가입하기
                        </Button>
                        <Text>
                            이미 아이디가 있으신가요?
                            <Link href="/login">로그인</Link>
                        </Text>
                        </Stack>
                    </form>
            </VStack>
        </Box>
    );
}

export default SignUp;

// const SignUp = () => {
//     const navigate = useNavigate();
//     const [userName, setUserName] = useState('');
//     const [nickname, setNickname] = useState('');
//     const [contact, setContact] = useState('');
//     const [contactPrefix, setContactPrefix] = useState('');
//     const [contactMid, setContactMid] = useState('');
//     const [contactLast, setContactLast] = useState('');
//     const [existingPassword, setExistingPassword] = useState('');
//     const [userPassword, setUserPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const { register, handleSubmit, formState: { errors }, setError  } = useForm();

//     const handleCheckEmail = (e) => {
//         const passwordValue = e.target.value;
//         if (passwordValue.length >= 8) {
//             setExistingPassword(passwordValue)
//             checkPassword(email, existingPassword)
//             .then((response)=>{
//                 if (response.valid) {
//                     setError('existingPassword', { message: '' });
//                 } else {
//                     setError('existingPassword', { message: response.message });
//                 }
//             })
//             .catch((error) => {
//                 console.error('패스워드 확인 과정에서 오류가 발생하였습니다.:', error);
//             });
//         }
//     }

//     const handleCheckNickname = (e) => {
//         const nicknameValue  = e.target.value;
//         setNickname(nicknameValue)
//         checkNickname(nicknameValue)
//         .then((response)=>{
//             if (response.exists) {
//                 setError('nickname', { message: response.message });
//             } else {
//                 setError('nickname', { message: '' });
//             }
//         })
//         .catch((error) => {
//             console.error('닉네임 확인 과정에서 오류가 발생하였습니다.:', error);
//         });
//     }

//     const handleUpdateLocalUser = (data) => {
//         if (userPassword !== confirmPassword) {
//             setError('confirmPassword', { message: '패스워드가 일치하지 않습니다.' });
//             return;
//         }
//         console.log('data',data);
//         const contact = `${contactPrefix}${contactMid}${contactLast}`;
//         const userData = {
//             email,
//             userName,
//             nickname,
//             contact,
//             userPassword: data.existingPassword,
//         }
//         console.log('userData',userData);
//         updateLocal(userData)
//         .then(() => {
//             alert('회원정보 수정이 완료되었습니다.');
//             handleContextLogout();
//             navigate('/');
//         })
//         .catch((error) => {
//             console.error('회원정보 수정 과정에서 오류가 발생하였습니다.:', error);
//         });
//     };

//     return (
//             <Box>           
//                 <Stack
//                     gap='10'
//                     align='center' 
//                     width='100%'
//                 >
//                     <form onSubmit={handleSubmit(handleUpdateLocalUser)}>
//                         <Field label='Email'>
//                             <Input
//                                 value={email}
//                                 readOnly 
//                             />
//                         </Field>

//                         <Field label='Username'>
//                             <Input
//                                 value={userName}
//                                 readOnly 
//                             />
//                         </Field>

//                         <Field
//                             label='Nickname'
//                             invalid={!!errors.nickname}
//                             errorText={errors.nickname?.message}
//                         >
//                             <Input
//                                 {...register('nickname', {
//                                     required: '닉네임은 필수 입력 사항입니다.',
//                                     validate: value => {
//                                         if (!value) return true;
//                                         const nicknamePattern = /^[a-zA-Z0-9가-힣]+$/;
//                                         return nicknamePattern.test(value) || '닉네임에는 특수문자를 사용할 수 없습니다.';
//                                     }
//                                 })}
//                                 defaultValue={nickname}
//                                 onBlur={ e => handleCheckNickname(e) }
//                                 maxLength='10'
//                             />
//                         </Field>

//                         <Field
//                             label='Contact'
//                             invalid={!!errors.contact}
//                             errorText={errors.contact?.message}
//                         >
//                             <HStack>
//                                 <Input
//                                     id='contactPrefix'
//                                     {...register('contactPrefix', { required: '연락처는 필수 입력 사항입니다.' })}
//                                     defaultValue={contactPrefix}
//                                     onChange={e => {
//                                         const value = e.target.value.replace(/[^0-9]/g, '');
//                                         setContactPrefix(value);
//                                     }}
//                                     maxLength='3'
//                                 />
//                                 <VscChromeMinimize />
//                                 <Input
//                                     id='contactMid'
//                                     {...register('contactMid', { required: '연락처는 필수 입력 사항입니다.' })}
//                                     defaultValue={contactMid}
//                                     onChange={e => {
//                                         const value = e.target.value.replace(/[^0-9]/g, '');
//                                         setContactMid(value);
//                                     }}
//                                     maxLength='4'
//                                 />
//                                 <VscChromeMinimize />
//                                 <Input
//                                     id='contactLast'
//                                     {...register('contactLast', { required: '연락처는 필수 입력 사항입니다.' })}
//                                     defaultValue={contactLast}
//                                     onChange={e => {
//                                         const value = e.target.value.replace(/[^0-9]/g, '');
//                                         setContactLast(value);
//                                     }}
//                                     maxLength='4'
//                                 />
//                             </HStack>
//                         </Field>

//                         <Field
//                             label='Existing Password'
//                             invalid={!!errors.existingPassword}
//                             errorText={errors.existingPassword?.message}
//                         >
//                         <PasswordInput
//                             {...register('existingPassword', {
//                                 required: '기존 비밀번호는 회원정보 변경시 필수 인증 사항입니다.' })}
//                                 onBlur= { e => handleCheckPassword(e) }
//                                 maxLength='15'
//                         />
//                         </Field>

//                         <Field
//                             label='New Password'
//                             invalid={!!errors.userPassword}
//                             errorText={errors.userPassword?.message}
//                         >
//                         <PasswordInput
//                             {...register('userPassword', {
//                                 validate: value => {
//                                     if (!value) return true;
//                                     const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,13}$/;
//                                     return passwordPattern.test(value) || '비밀번호는 알파벳과 숫자를 포함하여 8자 이상 13자 이하로 입력해야 합니다.';
//                                 }
//                             })}
//                             onChange={e => setUserPassword(e.target.value)}
//                             maxLength='15'
//                         />
//                         </Field>

//                         <Field
//                             label='Confirm Password'
//                             invalid={!!errors.confirmPassword}
//                             errorText={errors.confirmPassword?.message}
//                         >
//                         <PasswordInput
//                             {...register('confirmPassword', {
//                             validate: value => value === userPassword || '패스워드가 일치하지 않습니다.'
//                             })}
//                             onChange={e => setConfirmPassword(e.target.value)}
//                             maxLength='15'
//                         />
//                         </Field>
//                         <HStack
//                             justifySelf='center'
//                             gap='20px'
//                             mt='20px'
//                         >
//                             <Button
//                                 type='submit'
//                             >
//                                 회원정보 수정
//                             </Button>
//                             <Button 
//                                 onClick={() => navigate('/mypage')}
//                                 style={{ border: '1px solid black',
//                                         background: 'none',
//                                         cursor: 'pointer',
//                                         color: 'black'
//                                 }}
//                             >
//                                 다음에 변경하기
//                             </Button>
//                         </HStack>
//                     </form>
//                 </Stack>
//             </Box>
//     )
// }