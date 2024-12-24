import React, { useState, useEffect } from "react";
import { Box, Heading, Button, Input, HStack, Table } from "@chakra-ui/react";
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toaster } from "@/components/ui/toaster";

function ProductManagement() {
    const navigate = useNavigate();
    const [allItems, setAllItems] = useState([]); // 모든 상품 목록 상태
    const [filteredItems, setFilteredItems] = useState([]); // 검색된 상품 목록 상태
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
    const [selection, setSelection] = useState([]); // 선택된 상품 목록 상태
    const hasSelection = selection.length > 0;
    const indeterminate = hasSelection && selection.length < filteredItems.length;

    // 상품 목록 불러오기
    useEffect(() => {
        axios.get("http://localhost:8080/api/products")
            .then(response => {
                setAllItems(response.data);
                setFilteredItems(response.data); // 초기에는 전체 목록을 표시
            })
            .catch(error => {
                console.error("상품 목록을 불러오는 데 오류가 발생했습니다:", error);
            });
    }, []);

    // 검색 처리 함수
    const handleSearch = () => {
        if (searchTerm) {
            const filtered = allItems.filter(item =>
                item.productName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredItems(filtered);
        } else {
            setFilteredItems(allItems); // 검색어가 없으면 전체 목록을 표시
        }
    };

    // 상품 삭제 함수
    const handleDelete = (productId) => {
        axios.delete(`http://localhost:8080/api/products/${productId}`)
            .then(() => {
                setFilteredItems(filteredItems.filter(item => item.productId !== productId));
                toaster.success("상품이 삭제되었습니다.");
            })
            .catch((error) => {
                console.error("상품 삭제 중 오류 발생:", error);
                toaster.error("상품 삭제에 실패했습니다.");
            });
    };

    // 선택된 상품 삭제
    const handleSelectedDelete = () => {
        if (selection.length > 0) {
            // 선택된 상품들을 하나씩 삭제
            selection.forEach((productId) => {
                axios.delete(`http://localhost:8080/api/products/${productId}`)
                    .then(() => {
                        setFilteredItems(filteredItems.filter(item => item.productId !== productId)); // 삭제된 상품 제외
                    })
                    .catch((error) => {
                        console.error("상품 삭제 중 오류 발생:", error);
                        toaster.error("상품 삭제에 실패했습니다.");
                    });
            });
            toaster.success("선택된 상품들이 삭제되었습니다.");
            setSelection([]); // 삭제 후 선택 초기화
        }
    };

    return (
        <Box>
            <Toaster />
            <Heading as="h1" size="xl" mb={3}>상품 관리</Heading>
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
                                        setSelection(changes.checked ? filteredItems.map((product) => product.productId) : []);
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
                            <Table.Row key={product.productId} data-selected={selection.includes(product.productId) ? "" : undefined}>
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
                                <Table.Cell>{product.category}</Table.Cell>
                                <Table.Cell>{product.productName}</Table.Cell>
                                <Table.Cell>{product.productName}</Table.Cell>
                                <Table.Cell>{product.productAmount}</Table.Cell>
                                <Table.Cell>{product.productCount}</Table.Cell>
                                <Table.Cell>
                                    <Button size="sm" onClick={() => navigate(`/admin/products/update/${product.productId}`)}>
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
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
        </Box>
    );
}

export default ProductManagement;
