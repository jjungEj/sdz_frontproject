import { useState, useEffect } from 'react';

import useCategoryStore from '@/store/CategoryStore';

import { Box, Heading, Button, Input, HStack, Table, VStack, AbsoluteCenter, IconButton } from '@chakra-ui/react';
import { LuCheck, LuPencilLine, LuX, LuTrash2, LuCornerDownRight } from "react-icons/lu"
import { Toaster, toaster } from "@/components/ui/toaster"
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from "@/components/ui/accordion"

function CategoryManagement() {
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [selectedParentId, setSelectedParentId] = useState(null);
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
            await createCategory(newCategoryName.trim(), selectedParentId);
            getCategories();
            setNewCategoryName("");
            setSelectedParentId(null);
        }
    };


    async function handleUpdateCategory() {
        if (editingCategory?.categoryName.trim()) {
            await updateCategory(editingCategory);
            getCategories();
            setEditingCategory(null);
            setSelectedParentId(null);
        }
    };

    async function handleDeleteCategory(categoryId) {
        await deleteCategory(categoryId);
        setSelectedParentId(null);
    };

    return (
        <Box>
            <Toaster />
            <HStack justify="space-between">
                <Heading as="h1" size="xl" mb={3}>카테고리 관리</Heading>
                <HStack mb={3}>
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
                        onClick={handleCreateCategory}
                        size="sm"
                    >
                        카테고리 생성
                    </Button>
                </HStack>
            </HStack>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
            <Box display="flex" justifyContent="center" margin="5">
                <AccordionRoot spaceY="4" variant="subtle" collapsible>
                    {categories
                        .filter(category => category.parentId === null)
                        .map(category => (
                            <AccordionItem key={category.categoryId}>
                                <Box position="relative">
                                    {editingCategory?.categoryId === category.categoryId ? (
                                        <>
                                            <Input
                                                type="text"
                                                value={editingCategory.categoryName}
                                                onChange={e => setEditingCategory({ ...editingCategory, categoryName: e.target.value })}
                                                placeholder="카테고리 이름"
                                                size="md"
                                                fontSize="md"
                                                maxWidth="300px"
                                                w="100%"
                                                marginLeft="5"

                                            />
                                            <AbsoluteCenter axis="vertical" insetEnd="0">
                                                <HStack justify="flex-end">
                                                    <IconButton
                                                        variant="outline"
                                                        size="xs"
                                                        onClick={handleUpdateCategory}
                                                    >
                                                        <LuCheck />
                                                    </IconButton>
                                                    <IconButton
                                                        variant="outline"
                                                        size="xs"
                                                        onClick={() => setEditingCategory(null)}
                                                    >
                                                        <LuX />
                                                    </IconButton>
                                                </HStack>
                                            </AbsoluteCenter>
                                        </>
                                    ) : (
                                        <>
                                            <AccordionItemTrigger
                                                indicatorPlacement="start"
                                                onClick={() => setSelectedParentId(category.categoryId)}>
                                                {category.categoryName}
                                            </AccordionItemTrigger>
                                            <AbsoluteCenter axis="vertical" insetEnd="0">
                                                <HStack justify="flex-end">
                                                    <IconButton
                                                        variant="ghost"
                                                        size="xs"
                                                        onClick={() =>
                                                            setEditingCategory({ categoryId: category.categoryId, categoryName: category.categoryName })}
                                                    >
                                                        <LuPencilLine />
                                                    </IconButton>
                                                    <IconButton
                                                        variant="ghost"
                                                        size="xs"
                                                        onClick={() => handleDeleteCategory(category.categoryId)}
                                                    >
                                                        <LuTrash2 />
                                                    </IconButton>
                                                </HStack>
                                            </AbsoluteCenter>
                                        </>
                                    )}
                                </Box>
                                <AccordionItemContent>
                                    {selectedParentId === category.categoryId && (
                                        <Box>
                                            <HStack justify="flex-end">
                                                <Input
                                                    type="text"
                                                    value={newCategoryName}
                                                    onChange={e => setNewCategoryName(e.target.value)}
                                                    placeholder="카테고리명 입력"
                                                    size="sm"
                                                    maxWidth="200px"
                                                    w="100%"
                                                />
                                                <Button
                                                    colorScheme="blue"
                                                    onClick={handleCreateCategory}
                                                    size="sm"
                                                >
                                                    카테고리 추가
                                                </Button>
                                            </HStack>
                                            {categories
                                                .filter(child => child.parentId === category.categoryId)
                                                .map(child => (
                                                    <Box key={`${category.categoryId}-${child.categoryId}`} position="relative" mt={3}>
                                                        {editingCategory?.categoryId === child.categoryId ? (
                                                            <>
                                                                <Input
                                                                    type="text"
                                                                    value={editingCategory.categoryName}
                                                                    onChange={e => setEditingCategory({ ...editingCategory, categoryName: e.target.value })}
                                                                    placeholder="카테고리 이름"
                                                                    size="sm"
                                                                    maxWidth="300px"
                                                                    w="100%"
                                                                />
                                                                <AbsoluteCenter axis="vertical" insetEnd="0">
                                                                    <HStack justify="flex-end">
                                                                        <IconButton
                                                                            variant="outline"
                                                                            size="xs"
                                                                            onClick={handleUpdateCategory}
                                                                        >
                                                                            <LuCheck />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            variant="outline"
                                                                            size="xs"
                                                                            onClick={() => setEditingCategory(null)}
                                                                        >
                                                                            <LuX />
                                                                        </IconButton>
                                                                    </HStack>
                                                                </AbsoluteCenter>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {child.categoryName}
                                                                <AbsoluteCenter axis="vertical" insetEnd="0">
                                                                    <HStack justify="flex-end">
                                                                        <IconButton
                                                                            variant="ghost"
                                                                            size="xs"
                                                                            onClick={() =>
                                                                                setEditingCategory({ categoryId: child.categoryId, categoryName: child.categoryName })}>
                                                                            <LuPencilLine />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            variant="ghost"
                                                                            size="xs"
                                                                            onClick={() => handleDeleteCategory(child.categoryId)}
                                                                        >
                                                                            <LuTrash2 />
                                                                        </IconButton>
                                                                    </HStack>
                                                                </AbsoluteCenter>
                                                            </>
                                                        )}
                                                    </Box>
                                                ))}
                                        </Box>
                                    )}
                                </AccordionItemContent>
                            </AccordionItem>
                        ))
                    }
                </AccordionRoot >
            </Box>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box >
    );
}

export default CategoryManagement;