import React, { useState } from 'react'
import { Stack, HStack, Button, Input, Box, Text } from '@chakra-ui/react'
import { Field } from '@/components/ui/field'
import { DialogActionTrigger, DialogBody, DialogCloseTrigger,
  DialogContent, DialogFooter, DialogHeader, DialogRoot,
  DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { findId, findPw } from '@/services/AccountAPI'
import { validateEmailExists} from '@/services/VerificationAPI'
import { VscChromeMinimize } from 'react-icons/vsc'

export const FindId = () => {
  const [userName, setUserName] = useState('');
  const [contact, setContact] = useState('');
  const [contactPrefix, setContactPrefix] = useState('');
  const [contactMid, setContactMid] = useState('');
  const [contactLast, setContactLast] = useState('');
  const [foundIds, setFoundIds] = useState([]);
  const [isResultVisible, setIsResultVisible] = useState(false);

  const handleDialogOpen = () => {
    setUserName('');
    setContact('');
    setContactPrefix('');
    setContactMid('');
    setContactLast('');
    setFoundIds([]);
    setIsResultVisible(false);
  };

  const isFindIdButtonDisabled = !userName || !contactPrefix || !contactMid || !contactLast;
  
  const handleFindId = () => {
    const contact = `${contactPrefix}${contactMid}${contactLast}`;
    setContact(contact);
    const account  = {
      userName,
      contact
    };
    findId(account)
      .then((response) => {
        if (!response.emails || response.emails.length === 0) {
          setFoundIds([]);
          alert(response.message || '일치하는 회원정보가 존재하지 않습니다.');
        } else {
          const emails = response.emails.map((item) => item.email);
          setFoundIds(emails);
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
              <Stack align='flex-start' maxW='sm'>
                <Field label='이름'>
                    <Input 
                      width='400px'
                      value= {userName} 
                      onChange={e => setUserName(e.target.value)}
                    />
                </Field>
                <Field label='연락처'>
                    <Input 
                      value= {contact} 
                      hidden
                    />
                </Field>
                <HStack>
                  <Input
                      id='contactPrefix'
                      onChange = {(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setContactPrefix(value);
                        }}
                      width='110px'
                      value={contactPrefix}
                      maxLength='3'
                  />
                  <VscChromeMinimize style={{ fontSize: '17px', fontWeight: 'bold' }}/>
                  <Input
                      id='contactMid'
                      onChange = {(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setContactMid(value);
                        }}
                        width='110px'

                      value={contactMid}
                      maxLength='4'
                  />
                  <VscChromeMinimize style={{ fontSize: '17px', fontWeight: 'bold' }}/>
                  <Input
                      id='contactLast'
                      onChange = {(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setContactLast(value);
                      }}
                      width='110px'

                      value={contactLast}
                      maxLength='4'
                  />
              </HStack>
              </Stack>
              {isResultVisible && (
                <Box mt='5' p='4' bg='gray.100' borderRadius='md' width='400px'>
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
        console.error('아이디 확인 과정에서 오류가 발생하였습니다.:', error);
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
                <Field label='아이디'>
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