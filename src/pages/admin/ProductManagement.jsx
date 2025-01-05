import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Heading,
    Button,
    Input,
    HStack,
    Table,
    Image,
    Stack,
} from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Toaster, toaster } from "@/components/ui/toaster";
import { fetchProducts, deleteProduct, deleteSelectedProducts } from "../../services/ProductAPI";
import {
    PaginationRoot,
    PaginationPrevTrigger,
    PaginationItems,
    PaginationNextTrigger,
} from "@/components/ui/pagination";
import { InputGroup } from "@/components/ui/input-group"
import { LuSearch } from 'react-icons/lu';

function ProductManagement() {
    const navigate = useNavigate();
    const [allItems, setAllItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [selection, setSelection] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);
    const abortControllerRef = useRef(null); // AbortController ref

    const hasSelection = selection.length > 0;
    const indeterminate = hasSelection && selection.length < allItems.length;

    const loadProducts = async (currentPage, currentPageSize, currentSearchTerm) => {
        // 이전 API 요청 취소
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        // 새로운 AbortController 생성
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const data = await fetchProducts(currentPage, currentPageSize, currentSearchTerm, {
                signal: abortController.signal, // Abort signal 전달
            });
            setAllItems(data.dtoList);
            setFilteredItems(data.dtoList);
            setTotalPages(data.total);
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("API 요청이 취소되었습니다.");
            } else {
                console.error(error);
                toaster.error("상품 목록을 불러오는 데 오류가 발생했습니다.");
            }
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 디바운스 딜레이 (500ms)
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        loadProducts(page, pageSize, debouncedSearchTerm);
    }, [page, pageSize, debouncedSearchTerm]);

    const handleDelete = async (productId) => {
        try {
            await deleteProduct(productId);
            const updatedItems = allItems.filter((item) => item.productId !== productId);
            setAllItems(updatedItems);
            setFilteredItems(updatedItems);
            toaster.success("상품이 삭제되었습니다.");
        } catch (error) {
            console.error(error);
            toaster.error("상품 삭제에 실패했습니다.");
        }
    };

    const handleSelectedDelete = async () => {
        if (selection.length > 0) {
            try {
                await deleteSelectedProducts(selection);
                const updatedItems = allItems.filter((item) => !selection.includes(item.productId));
                setAllItems(updatedItems);
                setFilteredItems(updatedItems);
                toaster.success("선택된 상품들이 삭제되었습니다.");
                setSelection([]);
            } catch (error) {
                console.error(error);
                toaster.error("선택된 상품 삭제에 실패했습니다.");
            }
        }
    };

    const handlePageChange = (newPage) => {
        const safePage = Math.max(1, Math.min(newPage, totalPages));
        setPage(safePage);
    };

    return (
        <Box>
            <Toaster />
            <Heading as="h1" size="xl" mb={3}>
                상품 관리
            </Heading>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box display="flex" alignItems="center">
                <InputGroup
                    flex="1"
                    maxWidth="300px"
                    w="100%"
                    endElement={<LuSearch />}
                >
                    <Input
                        placeholder="상품명 입력"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setDebouncedSearchTerm(searchTerm); // Enter 키를 눌렀을 때 검색어 적용
                            }
                        }}
                    />
                </InputGroup>

                </Box>

                <HStack>
                    <Button size="sm" onClick={() => navigate(`/admin/products/create`)}>
                        상품 등록
                    </Button>
                    <Button size="sm" onClick={handleSelectedDelete} colorScheme="red">
                        선택 삭제
                    </Button>
                </HStack>
            </Box>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
            <Box display="flex" justifyContent="center" mb={4} position="relative" style={{
                    scrollbarGutter: "stable", // 스크롤바가 없더라도 공간을 고정하여 UI 밀림 방지
                }}>
                <Table.Root width="100%">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>
                                <Checkbox
                                    top="1"
                                    aria-label="Select all rows"
                                    checked={indeterminate ? "indeterminate" : selection.length === filteredItems.length}
                                    onCheckedChange={(changes) => {
                                        setSelection(
                                            changes.checked ? filteredItems.map((product) => product.productId) : []
                                        );
                                    }}
                                />
                            </Table.ColumnHeader>
                            <Table.ColumnHeader>카테고리</Table.ColumnHeader>
                            <Table.ColumnHeader>상품명</Table.ColumnHeader>
                            <Table.ColumnHeader>상품 이미지</Table.ColumnHeader>
                            <Table.ColumnHeader>가격</Table.ColumnHeader>
                            <Table.ColumnHeader>재고수</Table.ColumnHeader>
                            <Table.ColumnHeader>수정</Table.ColumnHeader>
                            <Table.ColumnHeader>삭제</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body >
                        {filteredItems.map((product) => (
                            <Table.Row key={product.productId}>
                                <Table.Cell>
                                    <Checkbox
                                        top="1"
                                        aria-label="Select row"
                                        checked={selection.includes(product.productId)}
                                        onCheckedChange={(changes) => {
                                            setSelection((prev) =>
                                                changes.checked
                                                    ? [...prev, product.productId]
                                                    : prev.filter((id) => id !== product.productId)
                                            );
                                        }}
                                    />
                                </Table.Cell>
                                <Table.Cell>{product.categoryName}</Table.Cell>
                                <Table.Cell>{product.productName}</Table.Cell>
                                <Table.Cell>
                                    <Image
                                        src={`${product.thumbnailPath}`}
                                        alt={product.productName}
                                        boxSize="50px"
                                    />
                                </Table.Cell>
                                <Table.Cell>{product.productAmount}</Table.Cell>
                                <Table.Cell>{product.productCount}</Table.Cell>
                                <Table.Cell>
                                    <Button
                                        size="sm"
                                        onClick={() => navigate(`/admin/products/update/${product.productId}`)}
                                    >
                                        수정
                                    </Button>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button size="sm" colorScheme="red" onClick={() => handleDelete(product.productId)}>
                                        삭제
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
            <Stack gap="4" alignItems="center" mt="3" mb="3">
                <PaginationRoot
                    page={page}
                    count={totalPages}
                    pageSize={pageSize}
                    onPageChange={(e) => handlePageChange(e.page)}
                >
                    <HStack>
                        <PaginationPrevTrigger />
                        <PaginationItems />
                        <PaginationNextTrigger />
                    </HStack>
                </PaginationRoot>
            </Stack>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box>
    );
}

export default ProductManagement;




