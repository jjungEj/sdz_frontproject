import { useState, useEffect } from 'react';

import useCategoryStore from '@/store/CategoryStore';

import { Box, Heading, Button, Input, HStack, Table } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster"

function CategoryManagement() {
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const { categories, getCategories, createCategory, updateCategory, deleteCategory, error, setError } = useCategoryStore();

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        if (error) {
            toaster.create({
                title: error,
                type: "error",
                isClosable: true,
                duration: 3000,
            });
            setError(null);
        }
    }, [error]);

    async function handleCreateCategory() {
        if (newCategoryName?.trim()) {
            await createCategory(newCategoryName.trim());
            setNewCategoryName("");
        }
    };


    async function handleUpdateCategory() {
        if (editingCategory?.categoryName.trim()) {
            await updateCategory(editingCategory);
            setEditingCategory(null);
        }
    };

    async function handleDeleteCategory(categoryId) {
        await deleteCategory(categoryId);
    };

    return (
        <Box>
            <Toaster />
            <Heading as="h1" size="xl" mb={3}>카테고리 관리</Heading>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
            <Box display="flex" justifyContent="center">
                <Table.Root width="100%" >
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader fontSize="md">카테고리명</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="end">
                                <HStack justify="flex-end">
                                    <Input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        placeholder="카테고리명 입력"
                                        size="sm"
                                        maxWidth="300px"
                                        w="100%"
                                    />
                                    <Button
                                        colorScheme="teal"
                                        onClick={handleCreateCategory}
                                        size="sm" pl={5} pr={5}
                                    >
                                        카테고리 생성
                                    </Button>
                                </HStack>
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {categories.map(category => (
                            <Table.Row key={category.categoryId}>
                                {editingCategory?.categoryId === category.categoryId ? (
                                    <>
                                        <Table.Cell>
                                            <Input
                                                type="text"
                                                value={editingCategory.categoryName}
                                                onChange={e => setEditingCategory({ ...editingCategory, categoryName: e.target.value })}
                                                placeholder="카테고리 이름"
                                                size="sm"
                                                maxWidth="300px"
                                                w="100%"
                                            />
                                        </Table.Cell>
                                        <Table.Cell textAlign="end" >
                                            <HStack justify="flex-end">
                                                <Button
                                                    onClick={handleUpdateCategory}
                                                    colorScheme="blue"
                                                    size="sm"
                                                >
                                                    수정 완료
                                                </Button>
                                                <Button
                                                    onClick={() => setEditingCategory(null)}
                                                    colorScheme="gray"
                                                    size="sm"
                                                >
                                                    취소
                                                </Button>
                                            </HStack>
                                        </Table.Cell>
                                    </>
                                ) : (
                                    <>
                                        <Table.Cell pl={5}>{category.categoryName}</Table.Cell>
                                        <Table.Cell textAlign="end">
                                            <HStack justify="flex-end">
                                                <Button
                                                    onClick={() => setEditingCategory({ categoryId: category.categoryId, categoryName: category.categoryName })}
                                                    colorScheme="blue"
                                                    size="sm"
                                                >
                                                    수정
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteCategory(category.categoryId)}
                                                    colorScheme="red"
                                                    size="sm"
                                                >
                                                    삭제
                                                </Button>
                                            </HStack>
                                        </Table.Cell>
                                    </>
                                )}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box>

    );
}

export default CategoryManagement;