import React, { useState, useEffect } from "react";
import { Box, Heading, Button, Input, HStack, Grid, GridItem, Text, Table } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toaster } from "@/components/ui/toaster";

function ProductManagement() {
    const navigate = useNavigate(); // useHistory 대신 useNavigate
    const [allItems, setAllItems] = useState([]); // 모든 상품 목록 상태
    const [filteredItems, setFilteredItems] = useState([]); // 검색된 상품 목록 상태
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

    // 상품 목록 불러오기
    useEffect(() => {
        axios.get("http://localhost:8080/api/products")
            .then(response => {
                setAllItems(response.data); // 전체 상품 목록 저장
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
            setFilteredItems(filtered); // 검색된 상품 목록을 업데이트
        } else {
            setFilteredItems(allItems); // 검색어가 없으면 전체 목록을 표시
        }
    };

    // 상품 삭제 함수
    const handleDelete = (productId) => {
        axios.delete(`http://localhost:8080/api/products/${productId}`)
            .then(() => {
                setFilteredItems(filteredItems.filter(item => item.productId !== productId)); // 삭제된 상품 제외
                toaster.success("상품이 삭제되었습니다.");
            })
            .catch((error) => {
                console.error("상품 삭제 중 오류 발생:", error);
                toaster.error("상품 삭제에 실패했습니다.");
            });
    };

    return (
        <Box>
            <Toaster />
            <Heading as="h1" size="xl" mb={3}>상품 관리</Heading>
            <Box borderBottom={{ base: "1px solid black", _dark: "1px solid white" }} mb={3} />
            <Box display="flex" justifyContent="center" mb={4}>
                <Table.Root width="100%">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>
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
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="end">
                                <HStack justify="flex-end">
                                    <Button size="sm" ml={2} onClick={() => navigate(`/admin/products/create`)}>
                                        상품 등록
                                    </Button>
                                </HStack>
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Grid templateColumns="repeat(5, 1fr)" gap={6}>
                            {filteredItems.map((product) => (
                                <GridItem key={product.productId}>
                                    <Box borderWidth="1px" borderRadius="md" p={4} boxShadow="md">
                                        <Heading as="h3" size="md" mb={2}>
                                            {product.productName}
                                        </Heading>
                                        <Text>가격: {product.productAmount} 원</Text>
                                        <Text>재고: {product.productCount} 개</Text>
                                        <Text mt={2}>{product.productContent}</Text>
                                        <HStack spacing={4} mt={4}>
                                            <Button size="sm" onClick={() => navigate(`/admin/product/update/${product.productId}`)}>
                                                수정
                                            </Button>
                                            <Button size="sm" colorScheme="red" onClick={() => handleDelete(product.productId)}>
                                                삭제
                                            </Button>
                                        </HStack>
                                    </Box>
                                </GridItem>
                            ))}
                        </Grid>
                    </Table.Body>
                </Table.Root>
            </Box>
        </Box>
    );
}

export default ProductManagement;
