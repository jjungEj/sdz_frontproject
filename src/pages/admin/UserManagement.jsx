import React, { useState, useEffect } from 'react';
import { getUserList } from "../../services/AdminAPI";
import { Box, Heading, Table, } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster";
import { Checkbox } from "@/components/ui/checkbox"

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

    return (
        <Box>
            <Toaster />
            <Heading as="h1" size="xl" mb={3}>회원 관리</Heading>
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
                                <Table.Cell>{user.social}</Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>{user.userName}</Table.Cell>
                                <Table.Cell>{user.createdAt}</Table.Cell>
                                <Table.Cell>{user.loginLock}</Table.Cell>
                                <Table.Cell>{user.userAuth}</Table.Cell>
                                <Table.Cell>탈퇴 버튼</Table.Cell>
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