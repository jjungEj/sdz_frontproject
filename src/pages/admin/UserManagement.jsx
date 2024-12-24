import React, { useState, useEffect } from 'react';
import { getUserList } from '../../services/AdminAPI';
import { Box, Heading, Table, Button, HStack, Stack, Input, createListCollection } from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { Checkbox } from '@/components/ui/checkbox'
import {
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from '@/components/ui/select'
import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
} from '@/components/ui/pagination'
import { useSearchParams } from 'react-router-dom';
import { ToggleTip } from "@/components/ui/toggle-tip"
import { LuInfo } from "react-icons/lu"
import { Switch } from "@/components/ui/switch"
import { HiCheck, HiX } from "react-icons/hi"
import { updateLoginLock, updateAuth, deleteUser, deleteUsers } from '../../services/AdminAPI';
import { color } from 'framer-motion';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [selection, setSelection] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [type, setType] = useState('all');
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);

    const hasSelection = selection.length > 0
    const indeterminate = hasSelection && selection.length < users.length
    
    const types = createListCollection({
        items: [
            { label: '전체', value: 'all' },
            { label: '일반 회원', value: 'local' },
            { label: '소셜 회원', value: 'social' },
        ],
    });

    useEffect(() => {
        loadUsers();
    }, [page, keyword, type]);

    const loadUsers = () => {
        getUserList(page, pageSize, type, keyword)
        .then((data) => {
            setUsers(data.dtoList);
            setTotalPages(data.total);
        }).catch((error) => {
            console.error('회원 목록을 가져오는 중 오류가 발생했습니다:', error);
        });
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSearchParams({ page: newPage });
    };

    const handleUpdateLoginLock = (email) => {
        updateLoginLock(email)
            .then(() => {
                loadUsers();
            })
            .catch((error) => {
            });
    };

    const handleUpdateAuth = (email) => {
        updateAuth(email)
            .then(() => {
                loadUsers();
            })
            .catch((error) => {
            });
    };

    const handleDeleteUser = (email) => {
        deleteUser(email)
            .then(() => {
                loadUsers();
            })
            .catch((error) => {
            });
    };

    const handleDeleteUsers = () => {
        if (selection.length === 0) {
            alert('삭제할 사용자를 선택하세요.');
            return;
        }
        
        deleteUsers(selection)
            .then(() => {
                loadUsers();
            })
            .catch((error) => {
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, '');
    };

    return (
        <Box>
            <Toaster />
            <Box display='flex' justifyContent='space-between' alignItems='center' mb='3'>
                <HStack gap='0' alignItems='center'>
                    <Heading as='h1' size='xl' mr='5'>회원 관리</Heading>
                    <SelectRoot size='sm' width='110px' collection={types} onChange={(e) => setType(e.target.value)}
                    style={{ height: '36px' }}
                    >
                        <SelectTrigger>
                            <SelectValueText placeholder='검색 유형' />
                        </SelectTrigger>
                        <SelectContent>
                        {types.items.map((type) => (
                            <SelectItem item={type} key={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </SelectRoot>
                    <Input
                        placeholder='검색 키워드 입력'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        height='36px'
                        width='250px'
                    />
                </HStack>
                <HStack>
                    <ToggleTip content="선택한 회원을 탈퇴 시킬 수 있습니다.">
                                <Button size="xs" variant="ghost">
                                    <LuInfo />
                                </Button>
                    </ToggleTip>
                    <Button colorScheme='red' onClick={() => handleDeleteUsers()}>탈퇴</Button>
                </HStack>
            </Box>
            <Box borderBottom={{ base: '1px solid black', _dark: '1px solid white' }} mb='3' />
            <Box display='flex' justifyContent='center'>
                <Table.Root width='100%'>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>
                                <Checkbox
                                    top='1'
                                    aria-label='Select all rows'
                                    checked={indeterminate ? 'indeterminate' : selection.length > 0}
                                    onCheckedChange={(changes) => {
                                        setSelection(
                                            changes.checked ? users.map((user) => user.email) : [],
                                        )
                                    }}
                                />
                            </Table.ColumnHeader>
                            <Table.ColumnHeader fontSize='md'>가입유형</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize='md'>아이디</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize='md'>이름</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize='md'>가입일</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize='md'>로그인
                                <ToggleTip content="
                                로그인 잠금 상태를 변경 할 수 있습니다.">
                                    <Button size="xs" variant="ghost">
                                        <LuInfo />
                                    </Button>
                                </ToggleTip>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader fontSize='md'>관리자
                                <ToggleTip content="회원 권한을 변경 할 수 있습니다."
                                >
                                    <Button size="xs" variant="ghost">
                                        <LuInfo />
                                    </Button>
                                </ToggleTip>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader fontSize='md'>회원탈퇴</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {(users.length > 0 ? users : []).map((user) =>
                            <Table.Row key={user.email} data-selected={selection.includes(user.email) ? '' : undefined}>
                                <Table.Cell>
                                    <Checkbox
                                        top='1'
                                        aria-label='Select row'
                                        checked={selection.includes(user.email)}
                                        onCheckedChange={(changes) => {
                                            setSelection((prev) =>
                                                changes.checked
                                                    ? [...prev, user.email]
                                                    : selection.filter((email) => email !== user.email),
                                            )
                                        }}
                                    />
                                </Table.Cell>
                                <Table.Cell>{user.social==false?'일반':'소셜'}</Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>{user.userName}</Table.Cell>
                                <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
                                <Table.Cell>
                                    <Switch
                                        size="lg"
                                        variant="raised"
                                        checked={user.loginLock==true}
                                        onChange={() => handleUpdateLoginLock(user.email)}
                                        thumbLabel={{ on: <HiCheck color="white" />,
                                                    off: <HiX /> }}>
                                    </Switch>
                                </Table.Cell>
                                <Table.Cell>
                                    <Switch
                                        size="lg"
                                        variant="raised"
                                        checked={user.userAuth == 'ROLE_ADMIN'}
                                        onChange={() => handleUpdateAuth(user.email)}
                                        thumbLabel={{ on: <HiCheck color="white" />,
                                                    off: <HiX /> }}>
                                    </Switch>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button onClick={() => handleDeleteUser(user.email)}>탈퇴</Button>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table.Root>
            </Box>
            <Stack gap='4' alignItems='center' mt='3' mb='3'>
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
            <Box borderBottom={{ base: '1px solid black', _dark: '1px solid white' }} mb={3} />
        </Box>
    );
}

export default UserManagement;