import React, { useState, useEffect } from "react";
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

function ProductManagement() {
    const navigate = useNavigate();
    const [allItems, setAllItems] = useState([]); // 전체 상품 데이터
    const [filteredItems, setFilteredItems] = useState([]); // 검색된 상품 데이터
    const [searchTerm, setSearchTerm] = useState(""); // 검색어
    const [selection, setSelection] = useState([]); // 선택된 항목
    const [page, setPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
    const [pageSize] = useState(10); // 페이지 크기
    const hasSelection = selection.length > 0; // 선택 여부
    const indeterminate = hasSelection && selection.length < allItems.length;

    const loadProducts = async (currentPage, currentPageSize, currentSearchTerm) => {
        try {
            const data = await fetchProducts(currentPage, currentPageSize, currentSearchTerm);
            setAllItems(data.dtoList); // 전체 상품 데이터 설정
            setFilteredItems(data.dtoList); // 초기 상태로 전체 상품 설정
            setTotalPages(data.total); // 총 페이지 수 설정
        } catch (error) {
            console.error(error);
            toaster.error("상품 목록을 불러오는 데 오류가 발생했습니다.");
        }
    };

    // 검색 버튼 클릭 시 필터링 처리
    const handleSearch = () => {
        if (searchTerm) {
            const filtered = allItems.filter((item) =>
                item.productName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredItems(filtered); // 검색 결과 설정
             // 첫 페이지로 이동
        } else {
            setFilteredItems(allItems); // 검색어가 없으면 전체 목록 표시
        }
    };

    // 페이지, 검색어, 페이지 크기가 변경될 때 데이터 로드
    useEffect(() => {
        loadProducts(page, pageSize, searchTerm);
    }, [page, searchTerm, pageSize]);

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
        const safePage = Math.max(1, Math.min(newPage, totalPages)); // 범위 내 페이지로 제한
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
                    <Input
                        type="text"
                        placeholder="상품명 입력"
                        size="sm"
                        maxWidth="300px"
                        w="100%"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button size="sm" ml={2} onClick={handleSearch}>
                        검색
                    </Button>
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
            <Box display="flex" justifyContent="center" mb={4}>
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
                    <Table.Body>
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



