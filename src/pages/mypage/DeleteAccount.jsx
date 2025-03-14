import React,  { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { Button, Fieldset, Stack } from '@chakra-ui/react'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { NativeSelectField, NativeSelectRoot } from '@/components/ui/native-select'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/AuthStore'
import { useShallow } from 'zustand/react/shallow'
import { deleteUser } from '@/services/UserAPI'


function DeleteAccount() {
    const { email, handleLogout } = useAuthStore(
        useShallow((state) => ({
            email: state.email,
            handleLogout: state.handleLogout
        })),
    )
    const [consent, setConsent] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async() => {
        if (!consent) {
            alert('회원탈퇴에 동의하셔야 탈퇴할 수 있습니다.');
            return;
        }
        const confirmed = window.confirm('정말 탈퇴하시겠습니까?');
        if (confirmed) {
            await deleteUser(email);
            handleLogout();
            navigate('/');
        } else {
            alert('취소되었습니다.');
        }
    };
    
    return (
        <Box 
            maxWidth='450px'
            align='center'
            margin='0 auto'
            padding='30px'
        >
            <Fieldset.Root size='lg' maxW='md'>
            <Stack>
                <Fieldset.Legend>유의사항</Fieldset.Legend>
                <Fieldset.HelperText>
                    탈퇴 시 회원님의 이용정보가 삭제되며 <br/>
                    복구가 불가능하오니 신중히 선택하시기 바랍니다. <br/><br/>
                    회원 탈퇴와 함께 등록된 모든 개인정보는 <br/>
                    삭제, 폐기 처리되며 복구되지 않습니다.
                </Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
                <Field label='탈퇴사유'>
                <NativeSelectRoot>
                    <NativeSelectField
                    name='탈퇴사유'
                    items={[
                        '이용빈도 낮음',
                        '사이트 이용 불편',
                        '배송 불만',
                        '탈퇴 후 재가입',
                    ]}
                    />
                </NativeSelectRoot>
                </Field>
            </Fieldset.Content>

            <Checkbox
                onCheckedChange={(e) => setConsent(!!e.checked)}
            >
                해당 내용을 모두 확인했으며, 회원탈퇴에 동의합니다.
            </Checkbox>

            <Button
                variant='outline'
                onClick={ handleDelete }
                alignSelf='flex-end'
            >
                회원탈퇴
            </Button>
            </Fieldset.Root>
        </Box>
    );
}

export default DeleteAccount;