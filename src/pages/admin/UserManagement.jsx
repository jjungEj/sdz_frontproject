import { useState, useEffect } from 'react';
import { Box, Heading, Button, Input, VStack, HStack, Table } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster"

function UserManagement() {
    return (
        <Box>
            <Toaster />
            <Heading as="h1" size="xl" mb={3}>회원 관리</Heading>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />

        </Box>
    );
}

export default UserManagement;