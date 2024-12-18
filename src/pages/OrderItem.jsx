import React, { useEffect, useState } from "react";
import { fetchOrderItemData, modifyOrderItem, clearOrderItem } from "../services/OrderItemAPI";

function OrderItem() {
    const [OrderItemData, setOrderItemData] = useState(null); // 장바구니 데이터 상태
    const [error, setError] = useState(null); // 에러 상태
    const [selectedItems, setSelectedItems] = useState([]); // 선택된 상품 ID 상태
    const userId = "testuser@example.com"; // 사용자 ID (임시 고정값)

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await fetchOrderItemData(userId);
            setOrderItemData(data);
            setError(null);
            setSelectedItems([]); // 선택 초기화
        } catch (err) {
            setError("장바구니 정보를 불러오는 데 실패했습니다.");
        }
    };

    const handleSelectItem = (productId) => {
        setSelectedItems((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === OrderItemData.orderItemDetails.length) {
            // 이미 전체 선택 상태인 경우 선택 해제
            setSelectedItems([]);
        } else {
            // 전체 선택
            setSelectedItems(OrderItemData.orderItemDetails.map((item) => item.productId));
        }
    };

    const handleDeleteSelectedItems = async () => {
        try {
            for (const productId of selectedItems) {
                const item = OrderItemData.orderItemDetails.find((item) => item.productId === productId);
                if (item) {
                    await modifyOrderItem(userId, productId, -item.quantity);
                }
            }
            fetchData();
        } catch (err) {
            setError("선택된 상품 삭제에 실패했습니다.");
        }
    };

    const handleAddItem = async (productId) => {
        try {
            await modifyOrderItem(userId, productId, 1);
            fetchData();
        } catch (err) {
            setError("상품 추가에 실패했습니다.");
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await modifyOrderItem(userId, productId, -1);
            fetchData();
        } catch (err) {
            setError("상품 제거에 실패했습니다.");
        }
    };

    const handleClearOrderItem = async () => {
        try {
            await clearOrderItem(userId);
            fetchData();
        } catch (err) {
            setError("장바구니 비우기에 실패했습니다.");
        }
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ textAlign: "left", margin: "20px 0" }}>장바구니</h1>
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            {OrderItemData && OrderItemData.orderItemDetails.length > 0 ? (
                <>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                        <thead>
                        <tr style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>
                            <th style={{ padding: "10px" }}>
                                <input
                                    type="checkbox"
                                    checked={
                                        selectedItems.length === OrderItemData.orderItemDetails.length &&
                                        selectedItems.length > 0
                                    }
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th style={{ padding: "10px" }}>제품정보</th>
                            <th style={{ padding: "10px" }}>판매가격</th>
                            <th style={{ padding: "10px" }}>수량</th>
                            <th style={{ padding: "10px" }}>주문금액</th>
                        </tr>
                        </thead>
                        <tbody>
                        {OrderItemData.orderItemDetails.map((item) => (
                            <tr key={item.productId} style={{ textAlign: "center" }}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.productId)}
                                        onChange={() => handleSelectItem(item.productId)}
                                    />
                                </td>
                                <td>상품명 ({item.productId})</td>
                                <td>{item.productAmount.toLocaleString()} 원</td>
                                <td>
                                    <button onClick={() => handleRemoveItem(item.productId)}>-</button>
                                    <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                                    <button onClick={() => handleAddItem(item.productId)}>+</button>
                                </td>
                                <td style={{ fontWeight: "bold", color: "#007BFF" }}>
                                    {(item.productAmount * item.quantity).toLocaleString()} 원
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{ textAlign: "right", marginBottom: "20px" }}>
                        <strong>총 결제금액: {OrderItemData.orderItemDetails
                            .reduce((total, item) => total + item.productAmount * item.quantity, 0)
                            .toLocaleString()} 원</strong>
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <button onClick={handleDeleteSelectedItems} style={{ marginRight: "10px", padding: "10px" }}>
                            선택상품 삭제하기
                        </button>
                        <button style={{ marginRight: "10px", padding: "10px" }}>선택상품 주문하기</button>
                        <button onClick={handleClearOrderItem} style={{ padding: "10px", backgroundColor: "#007BFF", color: "white" }}>
                            장바구니 비우기
                        </button>
                    </div>
                </>
            ) : (
                <p style={{ textAlign: "center" }}>장바구니에 담긴 상품이 없습니다.</p>
            )}

        </div>
    );
}

export default OrderItem;
