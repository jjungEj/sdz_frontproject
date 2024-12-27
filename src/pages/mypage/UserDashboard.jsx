import React, { useState, useEffect } from 'react';
import { Outlet, Link, useSearchParams } from 'react-router-dom';
import { Box, Link as ChakraLink, HStack, VStack, Card, Button, Heading, Stack, Text, Group, Table, Badge } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar'
import { TimelineConnector, TimelineContent, TimelineDescription, TimelineItem, TimelineRoot, TimelineTitle } from '@/components/ui/timeline'
import { RadioCardItem, RadioCardRoot } from '@/components/ui/radio-card'
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger,
PaginationRoot } from '@/components/ui/pagination'
import { LuCheck, LuPackage, LuShip } from 'react-icons/lu'
import { useAuth } from '../../services/AuthContext';
import { VscPinned, VscPinnedDirty, VscTrash } from 'react-icons/vsc';
import { UserInfo } from '../../services/UserAPI';
import { getDeliveryAddressList, updateDefaultAddress, deleteAddress } from '../../services/DeliveryAdressAPI';
import { DeliveryAddressDialog, DeliveryAddressUpdateDialog } from './DeliveryAddressDialog';

function UserDashboard() {
    const [selectLink, setSelectLink] = useState('');
    const { email, loginType } = useAuth();
    const [userInfo, setUserInfo] = useState({});
    const [deliveryAddress, setDeliveryAddress] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(5);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    useEffect(() => {
        if (email) {
            UserInfo(email)
                .then((data) => {
                    setUserInfo(data);
                })
                .catch((error) => {
                });
        }
    }, [email]);

    useEffect(() => {
        fetchDeliveryAddresses();
    }, [page]);

    const fetchDeliveryAddresses = () => {
        getDeliveryAddressList(page, pageSize)
        .then((data) => {
            setDeliveryAddress(data.dtoList);
            setTotalPages(data.total);
        }).catch((error) => {
            console.error('배송지 목록을 가져오는 중 오류가 발생했습니다:', error);
        });
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSearchParams({ page: newPage });
    };    

    const handleAddressSelect = (addressId) => {
        setSelectedAddressId(addressId);
    };

    const handleDefaultAddress = () => {
        console.log(selectedAddressId);
        updateDefaultAddress(selectedAddressId)
        .then(() => {
            fetchDeliveryAddresses();
        })
        .catch((error) => {
        });
    };
    
    const handleDeleteAddress = () => {
        console.log(selectedAddressId);
        deleteAddress(selectedAddressId)
            .then(() => {
                fetchDeliveryAddresses();
            })
            .catch((error) => {
            });
    };

    const handleClick = (link) => {
        setSelectLink(link);
    }

    return (
        <Box marginTop='-10'>
            <HStack justify='center'>
                <ChakraLink
                    onClick={() => handleClick('mypage')}
                    asChild
                    _focus={{ outline: 'none' }}
                    fontWeight={selectLink === 'mypage' ? 'bold' : 'none'}
                    margin='3'
                >
                    <Link to='/mypage'>마이 페이지</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => handleClick('order')}
                    asChild
                    _focus={{ outline: 'none' }}
                    fontWeight={selectLink === 'order' ? 'bold' : 'none'}
                    margin='3'
                >
                    <Link to='/mypage/orders'>주문내역 조회</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => handleClick('edit')}
                    asChild
                    _focus={{ outline: 'none' }}
                    fontWeight={selectLink === 'edit' ? 'bold' : 'none'}
                    margin='3'
                >
                    <Link to='/mypage/edit'>회원정보 변경</Link>
                </ChakraLink>
                <ChakraLink
                    onClick={() => handleClick('delete')}
                    asChild
                    _focus={{ outline: 'none' }}
                    fontWeight={selectLink === 'delete' ? 'bold' : 'none'}
                    margin='3'
                >
                    <Link to='/mypage/delete'>회원 탈퇴</Link>
                </ChakraLink>
            </HStack>
            {location.pathname === '/mypage' && (
                <Box>
                    <Heading as='h1' size='xl' mb={3}>마이 페이지</Heading>
                    <Box borderBottom={{ base: '1px solid black', _dark: '1px solid white' }} mb={3} />
                    <HStack justify='space-between' alignItems='flex-start'>
                        <VStack width='100%' maxWidth='550px' align='flex-start'>
                            <Heading as='h3' size='lg'>내 프로필</Heading>
                            <Card.Root variant='subtle' width='100%'>
                                <Card.Body gap='2'>
                                    <HStack>
                                        <Stack>
                                            <Avatar size='2xl' shape='rounded' />
                                            <Button>수정</Button>
                                        </Stack>
                                        <Stack gap='1' ml={10}>
                                            <Card.Title>{userInfo.userName} 님</Card.Title>
                                            <Text fontSize='sm'>닉네임 : {userInfo?.nickname || '설정 전 입니다'}</Text>
                                            <Text fontSize='sm'>전화번호 : {userInfo?.contact || '설정 전 입니다'}</Text>
                                            {loginType === 'local' ? (
                                                <Text fontSize='sm'>이메일 : {userInfo.email}</Text>
                                            ) : null}
                                        </Stack>
                                    </HStack>
                                </Card.Body>
                            </Card.Root>
                            <Heading as='h3' size='lg' mt={10}>최근 주문 내역</Heading>
                            <Card.Root variant='subtle' width='100%'>
                                <Card.Body gap='2'>
                                    <TimelineRoot maxW='400px'>
                                        <TimelineItem>
                                            <TimelineConnector>
                                                <LuShip />
                                            </TimelineConnector>
                                            <TimelineContent>
                                                <TimelineTitle>상품 주문</TimelineTitle>
                                                <TimelineDescription>13th May 2021</TimelineDescription>
                                                <Text textStyle='sm'>
                                                    (해당 주문에 있는 상품 리스트)
                                                </Text>
                                            </TimelineContent>
                                        </TimelineItem>

                                        <TimelineItem>
                                            <TimelineConnector>
                                                <LuCheck />
                                            </TimelineConnector>
                                            <TimelineContent>
                                                <TimelineTitle textStyle='sm'>주문 확인</TimelineTitle>
                                                <TimelineDescription>18th May 2021</TimelineDescription>
                                                <Text textStyle='sm'>
                                                    (해당 주문)의 상품이 발송되었습니다.
                                                </Text>
                                            </TimelineContent>
                                        </TimelineItem>

                                        <TimelineItem>
                                            <TimelineConnector>
                                                <LuPackage />
                                            </TimelineConnector>
                                            <TimelineContent>
                                                <TimelineTitle textStyle='sm'>배송 완료</TimelineTitle>
                                                <TimelineDescription>20th May 2021, 10:30am</TimelineDescription>
                                            </TimelineContent>
                                        </TimelineItem>
                                    </TimelineRoot>
                                </Card.Body>
                            </Card.Root>
                        </VStack>
                        <VStack width='100%' maxWidth='550px' height='600px' align='center'>
                            <HStack justify="space-between" width="100%" align="center">
                                <Heading as='h3' size='lg'>배송지 관리</Heading>
                                <HStack>
                                <DeliveryAddressDialog
                                fetchDeliveryAddresses={fetchDeliveryAddresses}
                                />
                                <DeliveryAddressUpdateDialog
                                    selectedAddressId={selectedAddressId}
                                    fetchDeliveryAddresses={fetchDeliveryAddresses} 
                                />
                                <Button
                                    variant='plain'
                                    onClick={ handleDeleteAddress }
                                    disabled={!selectedAddressId}
                                >
                                    <VscTrash />
                                </Button>
                                <Button
                                    variant='plain'
                                    onClick={ handleDefaultAddress }
                                    disabled={!selectedAddressId}
                                >
                                    <VscPinned />
                                </Button>
                                </HStack>
                            </HStack>
                            <RadioCardRoot defaultValue='next' gap='4' width='100%'>
                                <Group attached orientation='vertical'>
                                    {deliveryAddress.map((item) => (
                                        <RadioCardItem
                                            key={item.deliveryAddressId}
                                            width='full'
                                            indicatorPlacement='start'
                                            label = {
                                                    <Box display='flex' alignItems='center' gap='2'>
                                                    <Text as='span'>
                                                        {`${item.receiverName} (${item.receiverContact})`}
                                                    </Text>
                                                    {item.defaultCheck === true && (
                                                        <Badge variant='solid' colorPalette='yellow'>
                                                        <VscPinnedDirty /> 기본배송지
                                                        </Badge>
                                                    )}
                                                    </Box>
                                                    }
                                            description={
                                            <>  
                                                {item.deliveryAddress1} {item.deliveryAddress2} {item.deliveryAddress3}                                         
                                                <br />
                                                {item.deliveryRequest}
                                            </>}
                                            value={item.deliveryAddressId}
                                            checked={selectedAddressId === item.defaultCheck==true}
                                            onChange={() => handleAddressSelect(item.deliveryAddressId)}
                                        />
                                    ))}
                                </Group>
                            </RadioCardRoot>
                            <Stack gap='4' mt='3'>
                                <PaginationRoot
                                    page={page}
                                    count={totalPages}
                                    pageSize={pageSize}
                                    onPageChange={(e) => handlePageChange(e.page)}
                                >
                                    <HStack>
                                        <PaginationPrevTrigger />
                                        <   PaginationItems />
                                        <PaginationNextTrigger />
                                    </HStack>
                                </PaginationRoot>
                            </Stack>
                        </VStack>
                    </HStack>
                </Box>
            )}

            <Outlet />

        </Box>
    );
}

export default UserDashboard;