const url = "http://localhost:8080/api/order-item";

async function fetchOrderItemData(userId) {
    try {
        const response = await fetch(`${url}/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function modifyOrderItem(userId, productId, quantity) {
    try {
        const response = await fetch(`${url}/modify/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        throw error;
    }
}

async function clearOrderItem(userId) {
    try {
        const response = await fetch(`${url}/clear/${userId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        throw error;
    }
}

export { fetchOrderItemData, modifyOrderItem, clearOrderItem };
