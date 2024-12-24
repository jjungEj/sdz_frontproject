import React,  { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { Button, Fieldset, Input, Stack } from '@chakra-ui/react'
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field'
import {
  NativeSelectField,
  NativeSelectRoot,
} from '@/components/ui/native-select'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { deleteUser } from '../../services/UserAPI';


function DeleteAccount() {
    const { email, handleContextLogout } = useAuth();
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleDelete = () => {
        console.log();
        deleteUser(email);
        handleContextLogout();
        navigate('/');
    };
    
    return (
        <Box>
            <Fieldset.Root size='lg' maxW='md'>
            <Stack>
                <Fieldset.Legend>유의사항</Fieldset.Legend>
                <Fieldset.HelperText>
                    회원탈퇴 유의사항 <br/>
                    탈퇴 시 회원님의 이용정보가 삭제되며 복구가 불가능하오니 신중히 선택하시기 바랍니다. <br/>
                    회원 탈퇴와 함께 등록된 모든 개인정보는 삭제, 폐기 처리되며 복구되지 않습니다.
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
                        '탙퇴 후 재가입',
                    ]}
                    />
                </NativeSelectRoot>
                </Field>
            </Fieldset.Content>

            <Checkbox checked={rememberMe}
                    onCheckedChange={(e) => setRememberMe(!!e.checked)}>
                        해당 내용을 모두 확인했으며, 회원탈퇴에 동의합니다.
            </Checkbox>

            <Button onClick={ handleDelete } alignSelf='flex-start'>
                회원탈퇴
            </Button>
            </Fieldset.Root>
        </Box>
    );
}

export default DeleteAccount;