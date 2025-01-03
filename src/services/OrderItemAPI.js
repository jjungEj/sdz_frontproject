const apiUrl = import.meta.env.VITE_API_URL;
const endpoint = "/order-item";

const url = `${apiUrl}${endpoint}`;

async function fetchOrderItemData() {
    try {
        const isLoggedIn = !!localStorage.getItem('access');
        if (isLoggedIn) {
            // 로그인된 사용자
            const response = await fetch(`${url}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('access')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            return await response.json();
        } else {
            // 비로그인 사용자
            const guestOrderItem = JSON.parse(localStorage.getItem('guestOrderItem')) || { orderItemDetails: [] };
            return guestOrderItem;
        }
    } catch (error) {
        throw error;
    }
}

async function modifyOrderItem(productId, quantity) {
    try {
        const isLoggedIn = !!localStorage.getItem('access');
        if (isLoggedIn) {
            // 로그인된 사용자 처리
            const response = await fetch(`${url}/modify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('access')}`,
                },
                body: JSON.stringify({ productId, quantity }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } else {
            // 비로그인 사용자 처리
            const guestOrderItem = JSON.parse(localStorage.getItem('guestOrderItem')) || { orderItemDetails: [] };
            const existingItem = guestOrderItem.orderItemDetails.find(item => item.productId === productId);

            if (existingItem) {
                // 이미 있는 상품의 수량을 업데이트
                existingItem.quantity += quantity;
                if (existingItem.quantity <= 0) {
                    guestOrderItem.orderItemDetails = guestOrderItem.orderItemDetails.filter(item => item.productId !== productId);
                }
            } else if (quantity > 0) {
                // 새로운 상품 추가: 서버에서 상품 데이터 가져오기
                const productResponse = await fetch(`${apiUrl}/product/${productId}`);
                if (!productResponse.ok) {
                    const errorData = await productResponse.json();
                    throw new Error(errorData.message);
                }
                const productData = await productResponse.json();

                guestOrderItem.orderItemDetails.push({
                    productId: productData.productId,
                    productName: productData.productName,
                    productAmount: productData.productAmount,
                    thumbnailPath: productData.thumbnailPath,
                    quantity: quantity,
                });
            }

            // 로컬스토리지에 저장
            localStorage.setItem('guestOrderItem', JSON.stringify(guestOrderItem));
        }
    } catch (error) {
        throw error;
    }
}



async function clearOrderItem() {
    try {
        const isLoggedIn = !!localStorage.getItem('access');
        if (isLoggedIn) {
            // 로그인된 사용자
            const response = await fetch(`${url}/clear`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('access')}`,
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } else {
            // 비로그인 사용자
            localStorage.removeItem('guestOrderItem');
        }
    } catch (error) {
        throw error;
    }
}

// 게스트 장바구니 병합
async function mergeGuestOrderItem() {
    const guestOrderItem = JSON.parse(localStorage.getItem("guestOrderItem")) || { orderItemDetails: [] };

    if (guestOrderItem.orderItemDetails.length > 0) {
        try {
            const response = await fetch(`${apiUrl}/order-item/merge`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access")}`,
                },
                body: JSON.stringify(guestOrderItem),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            // 병합 성공 시 로컬스토리지 비우기
            localStorage.removeItem("guestOrderItem");
        } catch (error) {
            console.error("Error merging guest cart:", error);
            throw error;
        }
    }
}
export { fetchOrderItemData, modifyOrderItem, clearOrderItem, mergeGuestOrderItem };
