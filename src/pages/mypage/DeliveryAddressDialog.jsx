import React, { useState, useEffect, useRef  } from 'react';
import { Stack, HStack, Button, Input } from '@chakra-ui/react'
import { Field } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogActionTrigger, DialogBody, DialogCloseTrigger,
  DialogContent, DialogFooter, DialogHeader, DialogRoot,
  DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { VscAdd, VscSymbolProperty } from 'react-icons/vsc';
import DaumPostcode from 'react-daum-postcode';
import { createNewAddress, AddressInfo, updateAddress } from '../../services/DeliveryAdressAPI';

export const DeliveryAddressDialog = ({ fetchDeliveryAddresses }) => {
  const [deliveryAddress1, setDeliveryAddress1] = useState('');
  const [deliveryAddress2, setDeliveryAddress2] = useState('');
  const [deliveryAddress3, setDeliveryAddress3] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverContact, setReceiverContact] = useState('');
  const [deliveryRequest, setDeliveryRequest] = useState('');
  const [defaultCheck, setDefaultCheck] = useState(false);


  const cancelButtonRef = useRef(null);

  const handleDialogOpen = () => {
    setDeliveryAddress1('');
    setDeliveryAddress2('');
    setDeliveryAddress3('');
    setReceiverName('');
    setReceiverContact('');
    setDeliveryRequest('');
    setDefaultCheck(false);
  };

  const handleAddressSelect = (zoneCode, roadAddress) => {
    setDeliveryAddress1(zoneCode);
    setDeliveryAddress2(roadAddress);
  };
  
  const isFormValid = receiverName && receiverContact && deliveryAddress1 && deliveryAddress2 && deliveryAddress3;

  const handleNewAddress = () => {
    const newAddress  = {
      deliveryAddress1,
      deliveryAddress2,
      deliveryAddress3,
      receiverName,
      receiverContact,
      deliveryRequest,
      defaultCheck
    };
    console.log(newAddress);
    createNewAddress(newAddress)
    .then(() => {
      alert('배송지 추가가 완료되었습니다.');
      if (cancelButtonRef.current) {
        cancelButtonRef.current.click();
      }
      fetchDeliveryAddresses();
    })
    .catch((error) => {
    });
  }

  return (
    <HStack wrap='wrap' gap='4'>
      <DialogRoot
        size='full'
        motionPreset='slide-in-bottom'
      >
        <DialogTrigger asChild>
          <Button 
            variant='plain'
            onClick={handleDialogOpen}  
          >
            <VscAdd  />
          </Button>
        </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>신규 배송지 추가</DialogTitle>
              </DialogHeader>
              <DialogBody>
              <Stack gap='4' align='flex-start' maxW='sm'>
                <Field label='수령인 이름'>
                    <Input 
                      value= {receiverName}
                      onChange={e => setReceiverName(e.target.value)}
                    />
                </Field>
                <Field label='수령인 연락처'>
                    <Input 
                      value= {receiverContact} 
                      onChange={e => { 
                        const filteredValue = e.target.value.replace(/[^0-9]/g, '');
                        setReceiverContact(filteredValue);
                      }}
                    />
                </Field>
                <Field label='우편번호'>
                  <HStack>
                    <Input
                      readOnly
                      value= {deliveryAddress1}
                      onChange={e => setDeliveryAddress1(e.target.value)}
                    />
                    <DaumAddress onAddressSelect={handleAddressSelect} />
                  </HStack>
                </Field>
                <Field label='주소'>
                    <Input
                      readOnly
                      value= {deliveryAddress2} 
                      onChange={e => setDeliveryAddress2(e.target.value)}
                    />
                </Field>
                <Field label='상세주소'>
                    <Input
                      value= {deliveryAddress3}
                      onChange={e => setDeliveryAddress3(e.target.value)}
                    />
                </Field>
                <Field label='베송 요청 사항'>
                    <Input 
                      value= {deliveryRequest} 
                      onChange={e => setDeliveryRequest(e.target.value)}
                    />
                </Field>
                <Checkbox
                  checked={defaultCheck}
                  onCheckedChange={(e) => setDefaultCheck(!!e.checked)}>
                  기본 배송지 설정
                </Checkbox>
              </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant='outline'>취소</Button>
                </DialogActionTrigger>
                <Button
                  onClick={ handleNewAddress }
                  disabled={!isFormValid}
                >
                  저장
                </Button>
              </DialogFooter>
              <DialogCloseTrigger ref={cancelButtonRef} />
            </DialogContent>
          </DialogRoot>
    </HStack>
  )
}

export const DeliveryAddressUpdateDialog = ({ selectedAddressId,       fetchDeliveryAddresses }) => {
  const [deliveryAddress1, setDeliveryAddress1] = useState('');
  const [deliveryAddress2, setDeliveryAddress2] = useState('');
  const [deliveryAddress3, setDeliveryAddress3] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverContact, setReceiverContact] = useState('');
  const [deliveryRequest, setDeliveryRequest] = useState('');
  const [defaultCheck, setDefaultCheck] = useState(false);

  const cancelButtonRef = useRef(null);

  useEffect(() => {
      if (selectedAddressId) {
          AddressInfo(selectedAddressId)
              .then((data) => {
                  console.log('base useEffect', data);
                  setDeliveryAddress1(data.deliveryAddress1);
                  setDeliveryAddress2(data.deliveryAddress2);
                  setDeliveryAddress3(data.deliveryAddress3);
                  setReceiverName(data.receiverName);
                  setReceiverContact(data.receiverContact);
                  setDeliveryRequest(data.deliveryRequest);
                  setDefaultCheck(data.defaultCheck);
              })
              .catch((error) => {
              });
      }
  }, [selectedAddressId]);

  const handleAddressSelect = (zoneCode, roadAddress) => {
    setDeliveryAddress1(zoneCode);
    setDeliveryAddress2(roadAddress);
  };

  const isFormValid = receiverName && receiverContact && deliveryAddress1 && deliveryAddress2 && deliveryAddress3;

  const handleUpdateAddress = () => {
    const address  = {
      deliveryAddressId : selectedAddressId,
      deliveryAddress1,
      deliveryAddress2,
      deliveryAddress3,
      receiverName,
      receiverContact,
      deliveryRequest,
      defaultCheck
  };
  console.log(address);
    updateAddress(address)
    .then(() => {
      alert('배송지 수정이 완료되었습니다.');
      if (cancelButtonRef.current) {
        cancelButtonRef.current.click();
      }
      fetchDeliveryAddresses();
    })
    .catch((error) => {
    });
  };

  return (
    <HStack wrap='wrap' gap='4'>
      <DialogRoot
        size='full'
        motionPreset='slide-in-bottom'
      >
        <DialogTrigger asChild>
          <Button 
            variant='plain'
            disabled={!selectedAddressId}
          >
            <VscSymbolProperty />
          </Button>
        </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>배송지 수정</DialogTitle>
              </DialogHeader>
              <DialogBody>
              <Stack gap='4' align='flex-start' maxW='sm'>
                <Field label='수령인 이름'>
                    <Input 
                      value= {receiverName} 
                      onChange={e => setReceiverName(e.target.value)}
                    />
                </Field>
                <Field label='수령인 연락처'>
                    <Input 
                    value= {receiverContact}
                    onChange={e => { 
                        const filteredValue = e.target.value.replace(/[^0-9]/g, '');
                        setReceiverContact(filteredValue);
                      }}
                    />
                </Field>
                <Field label='우편번호'>
                  <HStack>
                    <Input
                      readOnly
                      value= {deliveryAddress1}
                      onChange={e => setDeliveryAddress1(e.target.value)}
                    />
                    <DaumAddress onAddressSelect={handleAddressSelect} />
                  </HStack>
                </Field>
                <Field label='주소'>
                    <Input
                      readOnly
                      value= {deliveryAddress2} 
                      onChange={e => setDeliveryAddress2(e.target.value)}
                    />
                </Field>
                <Field label='상세주소'>
                    <Input value= {deliveryAddress3} onChange={e => setDeliveryAddress3(e.target.value)}
                    />
                </Field>
                <Field label='베송 요청 사항'>
                    <Input value= {deliveryRequest} onChange={e => setDeliveryRequest(e.target.value)}
                    />
                </Field>
                <Checkbox
                  checked={defaultCheck}
                  onCheckedChange={(e) => setDefaultCheck(!!e.checked)}>
                  기본 배송지 설정
                </Checkbox>
              </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant='outline'>취소</Button>
                </DialogActionTrigger>
                <Button
                  onClick={ handleUpdateAddress }
                  disabled={!isFormValid} 
                >
                  저장
                </Button>
              </DialogFooter>
              <DialogCloseTrigger ref={cancelButtonRef} />
            </DialogContent>
          </DialogRoot>
    </HStack>
  )
}

export const DaumAddress = ({ onAddressSelect }) => {

  const cancelButtonRef = useRef(null);

  const handleComplete = (data) => {
    onAddressSelect(data.zonecode, data.roadAddress );
    console.log(data);
    if (cancelButtonRef.current) {
      cancelButtonRef.current.click();
    }
  };

  return (
    <HStack wrap='wrap' gap='4'>
      <DialogRoot
        placement='center'
        motionPreset='slide-in-bottom'
      >
        <DialogTrigger asChild>
          <Button 
            variant='outline'>
            우편번호
          </Button>
        </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>주소 조회</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <DaumPostcode onComplete={handleComplete}/>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant='outline'>취소</Button>
                </DialogActionTrigger>
              </DialogFooter>
              <DialogCloseTrigger ref={cancelButtonRef} />
            </DialogContent>
          </DialogRoot>
    </HStack>
  )
}