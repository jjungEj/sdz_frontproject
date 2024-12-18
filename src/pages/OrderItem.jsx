import React, { useEffect, useState } from "react";

function Cart() {
    const [cartData, setCartData] = useState(null); // 장바구니 데이터 상태
    const [error, setError] = useState(null); // 에러 상태
    const [selectedItems, setSelectedItems] = useState([]); // 선택된 상품 ID 상태
    const userId = "testuser@example.com"; // 사용자 ID (고정값)

    // 장바구니 조회
    useEffect(() => {
        fetchCartData();
    }, []);

    const fetchCartData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/order-item/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch cart data");
            const data = await response.json();
            setCartData(data);
            setError(null);
            setSelectedItems([]); // 선택 초기화
        } catch (err) {
            console.error("Error fetching cart data:", err);
            setError("장바구니 정보를 불러오는 데 실패했습니다.");
        }
    };

    const handleSelectItem = (productId) => {
        setSelectedItems((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
    };

    const handleDeleteSelectedItems = async () => {
        try {
            for (const productId of selectedItems) {
                const item = cartData.orderItemDetails.find((item) => item.productId === productId);
                if (item) {
                    await fetch(`http://localhost:8080/api/order-item/modify/${userId}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ productId: productId, quantity: -item.quantity }),
                    });
                }
            }
            fetchCartData();
        } catch (err) {
            console.error("Error deleting selected items:", err);
            setError("선택된 상품 삭제에 실패했습니다.");
        }
    };

    const handleAddItem = async (productId) => {
        try {
            await fetch(`http://localhost:8080/api/order-item/modify/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: productId, quantity: 1 }),
            });
            fetchCartData();
        } catch (err) {
            console.error("Error adding item:", err);
            setError("상품 추가에 실패했습니다.");
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await fetch(`http://localhost:8080/api/order-item/modify/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: productId, quantity: -1 }),
            });
            fetchCartData();
        } catch (err) {
            console.error("Error removing item:", err);
            setError("상품 제거에 실패했습니다.");
        }
    };

    // 장바구니 전체 삭제
    const handleClearCart = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/order-item/clear/${userId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to clear cart");
            fetchCartData();
        } catch (err) {
            console.error("Error clearing cart:", err);
            setError("장바구니 비우기에 실패했습니다.");
        }
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
            <header style={{ textAlign: "center", fontSize: "1.5em", padding: "20px 0" }}>header</header>

            <h1 style={{ textAlign: "left", margin: "20px 0" }}>장바구니</h1>
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            {cartData && cartData.orderItemDetails.length > 0 ? (
                <>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                        <thead>
                        <tr style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>
                            <th style={{ padding: "10px" }}>선택</th>
                            <th style={{ padding: "10px" }}>제품정보</th>
                            <th style={{ padding: "10px" }}>판매가격</th>
                            <th style={{ padding: "10px" }}>수량</th>
                            <th style={{ padding: "10px" }}>주문금액</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartData.orderItemDetails.map((item) => (
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
                        <strong>총 결제금액: {cartData.orderItemDetails
                            .reduce((total, item) => total + item.productAmount * item.quantity, 0)
                            .toLocaleString()} 원</strong>
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <button onClick={handleDeleteSelectedItems} style={{ marginRight: "10px", padding: "10px" }}>
                            선택상품 삭제하기
                        </button>
                        <button style={{ marginRight: "10px", padding: "10px" }}>선택상품 주문하기</button>
                        <button onClick={handleClearCart} style={{ padding: "10px", backgroundColor: "blue", color: "white" }}>
                            장바구니 비우기
                        </button>
                    </div>
                </>
            ) : (
                <p style={{ textAlign: "center" }}>장바구니에 담긴 상품이 없습니다.</p>
            )}

            <footer style={{ textAlign: "center", fontSize: "1.2em", padding: "20px 0", marginTop: "20px" }}>
                footer
            </footer>
        </div>
    );
}

export default Cart;
