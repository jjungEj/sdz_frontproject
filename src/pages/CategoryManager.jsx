import { useState, useEffect } from 'react';
import { createCategoty, getCategories, updateCategory, deleteCategoty } from "../services/CategoryAPI";
import { Box, Heading, Button, Input, VStack, HStack, Table } from '@chakra-ui/react';

function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    function loadCategories() {
        getCategories()
            .then(data => {
                setCategories(data);
            });
    }

    function handleCreateCategory() {
        if (newCategoryName.trim()) {
            createCategoty(newCategoryName.trim())
                .then(data => {
                    setCategories([...categories, data]);
                    setNewCategoryName('');
                });
        }
    }

    function handleUpdateCategory() {
        if (editingCategory?.categoryName.trim()) {
            updateCategory(editingCategory.categoryId, editingCategory.categoryName.trim())
                .then(() => {
                    setCategories(categories.map(category =>
                        category.categoryId === editingCategory.categoryId ? {
                            ...category, categoryName: editingCategory.categoryName.trim()
                        }
                            : category
                    ));
                    setEditingCategory(null);
                });
        }
    }

    function handleDeleteCategory(categoryId) {
        deleteCategoty(categoryId)
            .then(() => {
                setCategories(categories.filter(category =>
                    category.categoryId !== categoryId)
                );
            });
    }

    return (
        <Box p={5}>
            <Heading as="h1" size="lg" mb={5}>카테고리 관리</Heading>
            <Box borderBottom="2px solid teal" mb={5} />
            <Box w="auto" >
                <VStack align="flex-start" spacing={3} maxWidth="300px" w="100%" mb={5}>
                    <HStack spacing={3} w="100%">
                        <Input
                            type="text"
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            placeholder="카테고리 이름"
                            size="sm"
                        />
                        <Button colorScheme="teal" onClick={handleCreateCategory} size="sm">
                            추가
                        </Button>
                    </HStack>
                </VStack>
                <Table.Root size="sm" w="100%">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader pl={5}>카테고리명</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="end">수정</Table.ColumnHeader>
                            <Table.ColumnHeader >삭제</Table.ColumnHeader>
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
                                                onChange={e => setEditingCategory({
                                                    ...editingCategory,
                                                    categoryName: e.target.value
                                                })}
                                                placeholder="카테고리 이름"
                                                size="sm"
                                                maxWidth="300px"
                                                w="100%"
                                            />
                                        </Table.Cell>
                                        <Table.Cell textAlign="end" >
                                            <Button onClick={handleUpdateCategory} colorScheme="blue" size="sm">
                                                수정 완료
                                            </Button>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button onClick={() => setEditingCategory(null)} colorScheme="gray" size="sm">
                                                취소
                                            </Button>
                                        </Table.Cell>
                                    </>
                                ) : (
                                    <>
                                        <Table.Cell>{category.categoryName}</Table.Cell>
                                        <Table.Cell textAlign="end">
                                            <HStack spacing={3} justify="flex-end">
                                                <Button
                                                    onClick={() => setEditingCategory({
                                                        categoryId: category.categoryId,
                                                        categoryName: category.categoryName
                                                    })}
                                                    colorScheme="blue"
                                                    size="sm"
                                                >
                                                    수정
                                                </Button>
                                            </HStack>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button
                                                onClick={() => handleDeleteCategory(category.categoryId)}
                                                colorScheme="red"
                                                size="sm"
                                            >
                                                삭제
                                            </Button>
                                        </Table.Cell>
                                    </>
                                )}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Box>
    );
}

export default CategoryManager;