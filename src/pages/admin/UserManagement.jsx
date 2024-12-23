import React, { useState, useEffect } from 'react';
import { getUserList } from "../../services/AdminAPI";
import { Box, Heading, Table, Button, HStack  } from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { Checkbox } from '@/components/ui/checkbox'
import { updateLoginLock, updateAuth, deleteUser, deleteUsers } from '../../services/AdminAPI';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [selection, setSelection] = useState([]);

    const hasSelection = selection.length > 0
    const indeterminate = hasSelection && selection.length < users.length

    useEffect(() => {
        loadUsers();
    }, []);

    function loadUsers() {
        getUserList()
            .then(data => {
                setUsers(data.dtoList);
            });
            
    }

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
            alert("삭제할 사용자를 선택하세요.");
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
        return date.toLocaleDateString("ko-KR", { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, '');
    };

    return (
        <Box>
            <Toaster />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Heading as="h1" size="xl" mb={3}>회원 관리</Heading>
                <Button colorScheme="red" onClick={() => handleDeleteUsers()}>선택한 사용자 삭제</Button>
            </Box>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
            <Box display="flex" justifyContent="center">
                <Table.Root width="100%" mt={3}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>
                                <Checkbox
                                    top="1"
                                    aria-label="Select all rows"
                                    checked={indeterminate ? "indeterminate" : selection.length > 0}
                                    onCheckedChange={(changes) => {
                                        setSelection(
                                            changes.checked ? users.map((user) => user.email) : [],
                                        )
                                    }}
                                />
                            </Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md">가입유형</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md">아이디</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md">이름</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md">가입일</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md">로그인 잠금</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md">관리자 여부</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize="md">회원탈퇴</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {(users.length > 0 ? users : []).map((user) =>
                            <Table.Row key={user.email} data-selected={selection.includes(user.email) ? "" : undefined}>
                                <Table.Cell>
                                    <Checkbox
                                        top="1"
                                        aria-label="Select row"
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
                                    <Button onClick={() => handleUpdateLoginLock(user.email)}>{user.loginLock==false?'로그인잠금':'로그인잠금해제'}</Button>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button onClick={() => handleUpdateAuth(user.email)}>{user.userAuth=='ROLE_USER'?'관리자임명':'회원변경'}</Button>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button onClick={() => handleDeleteUser(user.email)}>탈퇴</Button>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table.Root>
            </Box>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box>
    );
}

export default UserManagement;