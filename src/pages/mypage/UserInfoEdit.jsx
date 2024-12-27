import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Stack, HStack, VStack } from '@chakra-ui/react';
import { VscChromeMinimize } from 'react-icons/vsc';
import { Field } from '@/components/ui/field'
import { PasswordInput } from '@/components/ui/password-input'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { UserInfo, updateLocal, updateSocial } from '../../services/UserAPI';
import { checkPassword, checkNickname } from '../../services/VerificationAPI';

// const ContactField = ({ register, errors, defaultValues }) => {
//     const contactPrefix = defaultValues?.slice(0, 3) || '';
//     return (
//         <Field label='Contact' invalid={!!errors.contact} errorText={errors.contact?.message}>
//             <HStack spacing={2}>
//                 <NativeSelectRoot>
//                     <NativeSelectField 
//                         defaultValue={contactPrefix}
//                         {...register('contactPrefix', { required: 'Prefix is required' })}>
//                         <option value='010'>010</option>
//                         <option value='011'>011</option>
//                     </NativeSelectField>
//                 </NativeSelectRoot>
//                 <Input
//                     {...register('contactMid', { required: 'Middle part is required', maxLength: 4 })}
//                     defaultValue={defaultValues?.slice(3, 7) || ''}
//                 />
//                 <Input
//                     {...register('contactLast', { required: 'Last part is required', maxLength: 4 })}
//                     defaultValue={defaultValues?.slice(7) || ''}
//                 />
//             </HStack>
//         </Field>
//     );
// };

// const  Social = ({ userInfo, onSubmit, navigate }) => {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         setValue
//     } = useForm({ defaultValues: userInfo || {} });

//     useEffect(() => {
//         if (userInfo) {
//             setValue('nickname', userInfo.nickname);
//             setValue('contact', userInfo.contact);
//         }
//     }, [userInfo, setValue]);

//     const submitForm = handleSubmit((data) => {
//         const contact = `${data.contactPrefix}${data.contactMid}${data.contactLast}`;
//         onSubmit({ ...data, contact });
//         // onSubmit(data);
//     });

//     return (
//         <form onSubmit={submitForm}>
//             <Stack
//                 gap='4'
//                 align='center' 
//                 width='100%'
//             >
//             <Field>
//                 <Input
//                     value={userInfo?.email || ''}
//                     type='hidden'
//                 />
//             </Field>

//             <Field label='Name'>
//                 <Input
//                     value={userInfo?.userName || ''}
//                     readOnly 
//                 />
//             </Field>

//             <Field
//                 label='Nickname'
//                 invalid={!!errors.nickname}
//                 errorText={errors.nickname?.message}
//             >
//                 <Input
//                     {...register('nickname', { required: 'Nickname is required' })}
//                     defaultValue={userInfo?.nickname || ''}
//                 />
//             </Field>

//             {/* <Field
//                 label='Contact'
//                 invalid={!!errors.contact}
//                 errorText={errors.contact?.message}
//             >
//                 <Input
//                     {...register('contact', { required: 'Contact is required' })}
//                     defaultValue={userInfo?.contact || ''}
//                 />
//             </Field> */}

//             <ContactField
//                 register={register}
//                 errors={errors}
//                 defaultValues={userInfo?.contact}
//             />


//             <HStack>
//                 <Button type='submit'>
//                     회원정보 수정
//                 </Button>
//                 <Button 
//                     onClick={() => navigate('/mypage')}
//                     style={{ border: '1px solid black',
//                             background: 'none',
//                             cursor: 'pointer',
//                             color: 'black'
//                     }}
//                 >
//                     다음에 변경하기
//                 </Button>
//             </HStack>
//         </Stack>
//         </form>
//     )
// }

// const  Local = ({ userInfo, onSubmit, isPasswordValid, setIsPasswordValid, navigate }) => {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         setValue,
//         watch
//     } = useForm({ defaultValues: userInfo || {} });

//     const userPassword = watch('userPassword');

//     useEffect(() => {
//         if (userInfo) {
//             setValue('nickname', userInfo.nickname);
//             setValue('contact', userInfo.contact);
//         }
//         }, [userInfo, setValue]);

//         const checkExistingPassword = (existingPassword) => {
//             checkPassword(userInfo.email, existingPassword)
//             .then((response) => {
//                 if (response.valid) {
//                     setIsPasswordValid(true);
//                 } else {
//                     setIsPasswordValid(false);
//                 }
//             })
//             .catch(() => setIsPasswordValid(false));
//         };

//         const submitForm = handleSubmit((data) => {
//         if (!isPasswordValid) {
//             alert('기존 비밀번호가 올바르지 않습니다.');
//             return;
//         }
//         onSubmit(data);
//     });

//     return (
//         <form onSubmit={submitForm}>
//             <Stack
//                 gap='4'
//                 align='center' 
//                 width='100%'
//             >
//             <Field label='Email'>
//                 <Input
//                     value={userInfo?.email || ''}
//                     readOnly 
//                 />
//             </Field>

//             <Field label='Username'>
//                 <Input
//                     value={userInfo?.userName || ''}
//                     readOnly 
//                 />
//             </Field>

//             <Field
//                 label='Nickname'
//                 invalid={!!errors.nickname}
//                 errorText={errors.nickname?.message}
//             >
//                 <Input
//                     {...register('nickname', { required: 'Nickname is required' })}
//                     defaultValue={userInfo?.nickname || ''}
//                 />
//             </Field>

//             <Field
//                 label='Contact'
//                 invalid={!!errors.contact}
//                 errorText={errors.contact?.message}
//             >
//                 <Input
//                     {...register('contact', { required: 'Contact is required' })}
//                     defaultValue={userInfo?.contact || ''}
//                 />
//             </Field>

//             <Field
//                 label='Existing Password'
//                 invalid={!!errors.existingPassword}
//                 errorText={errors.existingPassword?.message}
//             >
//             <PasswordInput
//                 {...register('existingPassword', {
//                     required: 'Existing password is required',
//                     onBlur: (e) => checkExistingPassword(e.target.value),
//                 })}
//             />
//             </Field>

//             <Field
//                 label='New Password'
//                 invalid={!!errors.userPassword}
//                 errorText={errors.userPassword?.message}
//             >
//             <PasswordInput
//                 {...register('userPassword')}
//             />
//             </Field>

//             <Field
//                 label='Confirm Password'
//                 invalid={!!errors.confirmPassword}
//                 errorText={errors.confirmPassword?.message}
//             >
//             <PasswordInput
//                 {...register('confirmPassword', {
//                 validate: value => value === userPassword || 'Passwords do not match'
//                 })}
//             />
//             </Field>

//             <HStack>
//                 <Button type='submit'>회원정보 수정</Button>
//                 <Button 
//                     onClick={() => navigate('/mypage')}
//                     style={{ border: '1px solid black',
//                             background: 'none',
//                             cursor: 'pointer',
//                             color: 'black'
//                     }}
//                 >
//                     다음에 변경하기
//                 </Button>
//             </HStack>
//         </Stack>
//         </form>
//     )
// }

// function UserInfoEdit() {
//     const { email, loginType, handleContextLogout } = useAuth();
//     const navigate = useNavigate();
//     const [userInfo, setUserInfo] = useState({});
//     const [isPasswordValid, setIsPasswordValid] = useState(true);

//     console.log('base useEffect', email);
//     useEffect(() => {
//         if (email) {
//             UserInfo(email)
//                 .then((data) => {
//                     console.log('base useEffect', data);
//                     setUserInfo(data);
//                 })
//                 .catch((error) => {
//                 });
//         }
//     }, [email]);

//     const handleUpdateSocial = (data) => {
//         updateSocial(userInfo.email, userInfo.userName, data)
//         .then(() => {
//             alert('회원정보 수정이 완료되었습니다.');
//             handleContextLogout();
//             navigate('/');
//         })
//         .catch((error) => {});
//     };

//     const handleUpdateLocal = (data) => {
//         if (!isPasswordValid) {
//             console.error('패스워드가 일치하지 않습니다.');
//             return;
//         }
    
//         updateLocal(userInfo.email, userInfo.userName, data)
//         .then(() => {
//             alert('회원정보 수정이 완료되었습니다.');
//             handleContextLogout();
//             navigate('/');
//         })
//         .catch((error) => {});
//     };

//     return (
//         <Box
//             maxWidth='450px'
//             align='center'
//             margin='0 auto'
//         >
//             { loginType === 'social' ? (
//                 <>
//                     <Social
//                         userInfo={userInfo}
//                         onSubmit={handleUpdateSocial}
//                         navigate={useNavigate()}
//                     />
//                 </>
//             ) : loginType === 'local' ? (
//                 <>
//                     <Local
//                         userInfo={userInfo}
//                         onSubmit={handleUpdateLocal}
//                         isPasswordValid={isPasswordValid}
//                         setIsPasswordValid={setIsPasswordValid}
//                         navigate={useNavigate()}
//                     />
//                 </>
//             ) : null }
//         </Box>
//     );
// }

// export default UserInfoEdit;




const  UserInfoEdit = () => {
    const { email, loginType, handleContextLogout } = useAuth();

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
                            handleContextLogout={handleContextLogout}
                        />
                    </>
                ) : loginType === 'local' ? (
                    <>
                        <UpdateLocal
                            email={email}
                            handleContextLogout={handleContextLogout}
                        />
                    </>
                ) : null }
            </Box>
        );
}
export default UserInfoEdit;

const UpdateSocial = ({email, handleContextLogout}) => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [userName, setUserName] = useState('');
    const [nickname, setNickname] = useState('');
    const [contact, setContact] = useState('');
    const [contactPrefix, setContactPrefix] = useState('');
    const [contactMid, setContactMid] = useState('');
    const [contactLast, setContactLast] = useState('');
    const { register, handleSubmit, formState: { errors }, setError  } = useForm();

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

    const handleUpdateSocialUser = (data) => {
        console.log('data',data);
        const contact = `${contactPrefix}${contactMid}${contactLast}`;
        const userData = {
            email,
            userName,
            nickname,
            contact,
        }
        console.log('userData',userData);
        updateSocial(userData, email)
        .then(() => {
            alert('회원정보 수정이 완료되었습니다.');
            handleContextLogout();
            navigate('/');
        })
        .catch((error) => {
            console.error('회원정보 수정 과정에서 오류가 발생하였습니다.:', error);
        });
    };

    return (
            <Box>           
                <Stack
                    gap='10'
                    align='center' 
                    width='100%'
                >
                    <form onSubmit={handleSubmit(handleUpdateSocialUser)}>
                        <Field>
                            <Input
                                value={email}
                                readOnly
                                hidden  
                            />
                        </Field>

                        <Field label='Username'>
                            <Input
                                value={userName}
                                readOnly 
                            />
                        </Field>

                        <Field
                            label='Nickname'
                            invalid={!!errors.nickname}
                            errorText={errors.nickname?.message}
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
                            label='Contact'
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
                        <HStack
                            justifySelf='center'
                            gap='20px'
                            mt='20px'
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

const UpdateLocal = ({email, handleContextLogout}) => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [userName, setUserName] = useState('');
    const [nickname, setNickname] = useState('');
    const [contact, setContact] = useState('');
    const [contactPrefix, setContactPrefix] = useState('');
    const [contactMid, setContactMid] = useState('');
    const [contactLast, setContactLast] = useState('');
    const [existingPassword, setExistingPassword] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register, handleSubmit, formState: { errors }, setError  } = useForm();

    console.log('user in useEffect:', email);
    useEffect(() => {
        if (email) {
            UserInfo(email)
            .then((data) => {
                console.log('UserInfo data:', data);
                setUserName(data.userName);
                setNickname(data.nickname);
                setContact(data.contact);
                setContactPrefix(data.contact.slice(0, 3));
                setContactMid(data.contact.slice(3, 7));
                setContactLast(data.contact.slice(7));
                console.log('UserInfo Set data:', data);
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
                setError('existingPassword', { message: '' });
            } else {
                setError('existingPassword', { message: response.message });
            }
        })
        .catch((error) => {
            console.error('패스워드 확인 과정에서 오류가 발생하였습니다.:', error);
        });
        
    }

    const handleCheckNickname = (e) => {
        const nicknameValue  = e.target.value;
        setNickname(nicknameValue)
        const userData = {
            email,
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

    const handleUpdateLocalUser = (data) => {
        if (userPassword !== confirmPassword) {
            setError('confirmPassword', { message: '패스워드가 일치하지 않습니다.' });
            return;
        }
        console.log('data',data);
        const contact = `${contactPrefix}${contactMid}${contactLast}`;
        const userData = {
            email,
            userName,
            nickname,
            contact,
            userPassword: data.existingPassword,
        }
        console.log('userData',userData);
        updateLocal(userData)
        .then(() => {
            alert('회원정보 수정이 완료되었습니다.');
            handleContextLogout();
            navigate('/');
        })
        .catch((error) => {
            console.error('회원정보 수정 과정에서 오류가 발생하였습니다.:', error);
        });
    };

    return (
            <Box>           
                <Stack
                    gap='10'
                    align='center' 
                    width='100%'
                >
                    <form onSubmit={handleSubmit(handleUpdateLocalUser)}>
                        <Field label='Email'>
                            <Input
                                value={email}
                                readOnly 
                            />
                        </Field>

                        <Field label='Username'>
                            <Input
                                value={userName}
                                readOnly 
                            />
                        </Field>

                        <Field
                            label='Nickname'
                            invalid={!!errors.nickname}
                            errorText={errors.nickname?.message}
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
                            label='Contact'
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

                        <Field
                            label='Existing Password'
                            invalid={!!errors.existingPassword}
                            errorText={errors.existingPassword?.message}
                        >
                        <PasswordInput
                            {...register('existingPassword', {
                                required: '기존 비밀번호는 회원정보 변경시 필수 인증 사항입니다.' })}
                                onBlur= { e => handleCheckPassword(e) }
                                maxLength='15'
                        />
                        </Field>

                        <Field
                            label='New Password'
                            invalid={!!errors.userPassword}
                            errorText={errors.userPassword?.message}
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
                            label='Confirm Password'
                            invalid={!!errors.confirmPassword}
                            errorText={errors.confirmPassword?.message}
                        >
                        <PasswordInput
                            {...register('confirmPassword', {
                            validate: value => value === userPassword || '패스워드가 일치하지 않습니다.'
                            })}
                            onChange={e => setConfirmPassword(e.target.value)}
                            maxLength='15'
                        />
                        </Field>
                        <HStack
                            justifySelf='center'
                            gap='20px'
                            mt='20px'
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