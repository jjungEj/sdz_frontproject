import React, { useState } from 'react';
import { Stack, HStack, Button, Input, Box, Text } from '@chakra-ui/react'
import { Field } from '@/components/ui/field';
import { DialogActionTrigger, DialogBody, DialogCloseTrigger,
  DialogContent, DialogFooter, DialogHeader, DialogRoot,
  DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { findId, findPw } from '../services/AccountAPI';
import { validateEmailExists} from '../services/VerificationAPI';

export const FindId = () => {
  const [userName, setUserName] = useState('');
  const [contact, setContact] = useState('');
  const [foundIds, setFoundIds] = useState([]);
  const [isResultVisible, setIsResultVisible] = useState(false);

  const handleDialogOpen = () => {
    setUserName('');
    setContact('');
    setFoundIds([]);
    setIsResultVisible(false);
  };

  const isFindIdButtonDisabled = !userName || !contact;
  
  const handleContactChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    setContact(newValue);
  };

  const handleFindId = () => {
    const account  = {
      userName,
      contact
    };
    console.log(account);
    findId(account)
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const emails = data.map((item) => item.email);
        setFoundIds(emails);
      } else {
        setFoundIds([]);
      }
      setIsResultVisible(true)
    })
    .catch((error) => {
    });
  }

  return (
    <HStack wrap='wrap' gap='4'>
      <DialogRoot
        placement='center'
        motionPreset='slide-in-bottom'
      >
        <DialogTrigger asChild>
          <Button 
            variant='plain'
            onClick={handleDialogOpen}  
          >
            아이디 찾기
          </Button>
        </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>아이디 찾기</DialogTitle>
              </DialogHeader>
              <DialogBody>
              <Stack gap='4' align='flex-start' maxW='sm'>
                <Field label='이름'>
                    <Input 
                      value= {userName} 
                      onChange={e => setUserName(e.target.value)}
                    />
                </Field>
                <Field label='연락처'>
                    <Input 
                      value= {contact} 
                      onChange={handleContactChange}
                    />
                </Field>
              </Stack>
              {isResultVisible && (
                <Box mt='4' p='4' bg='gray.100' borderRadius='md' w='full'>
                {foundIds.length > 0 ? (
                  <Stack spacing='2'>
                    {foundIds.map((id, index) => (
                      <Text key={index}>{id}</Text>
                    ))}
                  </Stack>
                ) : (
                  <Text>조회 결과가 없습니다.</Text>
                )}
              </Box>
            )}
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant='outline'>취소</Button>
                </DialogActionTrigger>
                <Button
                  onClick={ handleFindId }
                  disabled={isFindIdButtonDisabled}
                >
                  조회
                </Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
    </HStack>
  )
}

export const FindPassword = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  const handleDialogOpen = () => {
    setUserName('');
    setEmail('');
  };

  const isFindPasswordButtonDisabled = !userName || !email;

  const handleFindPassword = () => {
    const account  = {
      userName,
      email
    };
    validateEmailExists(account)
      .then((response) => {
        if(response.exists){
          const userConfirmed = window.confirm('비밀번호가 초기화 됩니다 진행하시겠습니까?');
          if (userConfirmed) {
            findPw(account)
              .then((response) => {
                alert(response.message);
              })
              .catch((error) => {
                console.error('비밀번호 찾기 과정에서 오류가 발생하였습니다.:', error);
              });
          } else {
            alert('취소되었습니다.');
          }
        } else {
          alert(response.message);
        }
      })
      .catch((error) => {
        console.error('이메일 확인 과정에서 오류가 발생하였습니다.:', error);
      });
  }

  return (
    <HStack wrap='wrap' gap='4'>
      <DialogRoot
        placement='center'
        motionPreset='slide-in-bottom'
      >
        <DialogTrigger asChild>
          <Button 
            variant='plain'
            onClick={handleDialogOpen}  
          >
            비밀번호 찾기
          </Button>
        </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>비밀번호 찾기</DialogTitle>
              </DialogHeader>
              <DialogBody>
              <Stack gap='4' align='flex-start' maxW='sm'>
                <Field label='이름'>
                    <Input 
                      value= {userName} 
                      onChange={e => setUserName(e.target.value)}
                    />
                </Field>
                <Field label='이메일'>
                    <Input 
                      value= {email} 
                      onChange={e => setEmail(e.target.value)}
                    />
                </Field>
              </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant='outline'>취소</Button>
                </DialogActionTrigger>
                <Button 
                  onClick={ handleFindPassword }
                  disabled={isFindPasswordButtonDisabled}
                >
                  조회
                </Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
    </HStack>
  )
}