const url = "http://localhost:8080/api/order-item";

async function fetchOrderItemData() {
    try {
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
    } catch (error) {
        throw error;
    }
}

async function modifyOrderItem(productId, quantity) {
    try {
        const response = await fetch(`${url}/modify`, {
            method: "POST",
            headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('access')}`,
            },
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

async function clearOrderItem() {
    try {
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
    } catch (error) {
        throw error;
    }
}

export { fetchOrderItemData, modifyOrderItem, clearOrderItem };
