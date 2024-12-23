import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Stack } from '@chakra-ui/react';
import { Field } from '@/components/ui/field'
import { PasswordInput } from '@/components/ui/password-input'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../services/AuthContext';
import { UserInfo, updateLocal, updateSocial } from '../../services/UserAPI';
import { checkPassword } from '../../services/VerificationAPI';


const  Social = ({ userInfo, onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm({ defaultValues: userInfo || {} });

    useEffect(() => {
        if (userInfo) {
            console.log("useEffect", userInfo);
            setValue('nickname', userInfo.nickname);
            setValue('contact', userInfo.contact);
            console.log("useEffect", userInfo);
        }
    }, [userInfo, setValue]);

    const submitForm = handleSubmit((data) => {
        onSubmit(data);
    });

    return (
        <form onSubmit={submitForm}>
        <Stack gap='4' align='flex-start' maxW='sm'>
            <Field label='Email'>
            <Input
            value={userInfo?.email || ''}
            type='hidden'
            />
            </Field>

            <Field>
            <Input
            value={userInfo?.userName || ''}
            readOnly 
            />
            </Field>

            <Field
            label='Nickname'
            invalid={!!errors.nickname}
            errorText={errors.nickname?.message}
            >
            <Input
                value={userInfo?.nickname || ''}
                {...register('nickname', { required: 'Nickname is required' })}
            />
            </Field>

            <Field
            label='Contact'
            invalid={!!errors.contact}
            errorText={errors.contact?.message}
            >
            <Input
                value={userInfo?.contact || ''}
                {...register('contact', { required: 'Contact is required' })}
            />
            </Field>

            <Button type='submit'>Submit</Button>
        </Stack>
        </form>
    )
}

const  Local = ({ userInfo, onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm({ defaultValues: userInfo || {} });

    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const password = watch('password');

    useEffect(() => {
        if (userInfo) {
            console.log("useEffect", userInfo);
            setValue('nickname', userInfo.nickname);
            setValue('contact', userInfo.contact);
            console.log("useEffect", userInfo);
        }
        }, [userInfo, setValue]);

        const checkExistingPassword = (existingPassword) => {
        checkPassword(userInfo.email, existingPassword)
            .then(() => setIsPasswordValid(true))
            .catch(() => setIsPasswordValid(false));
        };

        const submitForm = handleSubmit((data) => {
        if (!isPasswordValid) {
            alert('기존 비밀번호가 올바르지 않습니다.');
            return;
        }
        onSubmit(data);
    });

    return (
        <form onSubmit={submitForm}>
        <Stack gap='4' align='flex-start' maxW='sm'>
            <Field label='Email'>
            <Input
            value={userInfo?.email || ''}
            readOnly 
            />
            </Field>

            <Field label='Username'>
            <Input
            value={userInfo?.username || ''}
            readOnly 
            />
            </Field>

            <Field
            label='Nickname'
            invalid={!!errors.nickname}
            errorText={errors.nickname?.message}
            >
            <Input
                value={userInfo?.username || ''}
                {...register('nickname', { required: 'Nickname is required' })}
            />
            </Field>

            <Field
            label='Contact'
            invalid={!!errors.contact}
            errorText={errors.contact?.message}
            >
            <Input
                value={userInfo?.contact || ''}
                {...register('contact', { required: 'Contact is required' })}
            />
            </Field>

            <Field
            label='Existing Password'
            invalid={!!errors.existingPassword}
            errorText={errors.existingPassword?.message}
            >
            <PasswordInput
            {...register('existingPassword', {
                required: 'Existing password is required',
                onBlur: (e) => checkExistingPassword(e.target.value),
            })}
            />
            </Field>

            <Field
            label='New Password'
            invalid={!!errors.password}
            errorText={errors.password?.message}
            >
            <PasswordInput
                {...register('password')}
            />
            </Field>

            <Field
            label='Confirm Password'
            invalid={!!errors.confirmPassword}
            errorText={errors.confirmPassword?.message}
            >
            <PasswordInput
                {...register('confirmPassword', {
                validate: value => value === password || 'Passwords do not match'
                })}
            />
            </Field>

            <Button type='submit'>Submit</Button>
        </Stack>
        </form>
    )
}

function UserInfoEdit() {
    const { email, loginType } = useAuth();
    const [userInfo, setUserInfo] = useState({});
    console.log("base useEffect", email);
    useEffect(() => {
        if (email) {
            UserInfo(email)
                .then((data) => {
                    console.log("base useEffect", data);
                    setUserInfo(data);
                })
                .catch((error) => {
                });
        }
    }, [email]);

    const handleUpdateSocial = (data) => {
        const { nickname, contact } = data;
    
        updateLocal(userInfo.email, userInfo.username, nickname, contact)
        .then(() => alert('회원정보 수정이 완료되었습니다.'))
        .catch((error) => {});
    };

    const handleUpdateLocal = (data) => {
        const { nickname, contact, password } = data;
    
        if (!isPasswordValid) {
            console.error('Existing password is incorrect');
            return;
        }
    
        updateLocal(userInfo.email, password, userInfo.username, nickname, contact)
        .then(() => alert('회원정보 수정이 완료되었습니다.'))
        .catch((error) => {});
    };

    return (
        <Box>
            { loginType === 'social' ? (
                <>
                    <Social initialValues={userInfo} onSubmit={handleUpdateSocial} />
                </>
            ) : loginType === 'local' ? (
                <>
                    <Local initialValues={userInfo} onSubmit={handleUpdateLocal} />
                </>
            ) : null }
        </Box>
    );
}

export default UserInfoEdit;