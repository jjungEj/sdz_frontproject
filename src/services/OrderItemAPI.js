const url = "http://localhost:8080/api/order-item";

// function fetchOrderItemData(userId) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await fetch(`${url}/${userId}`);
//             if (!response.ok) throw new Error("Failed to fetch OrderItem data");
//             const data = await response.json();
//             resolve(data);
//         } catch (err) {
//             console.error("Error fetching OrderItem data:", err);
//             reject(err);
//         }
//     });
// }
function fetchOrderItemData(userId) {
    return fetch(`${url}/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            return response.json();
        })
        .catch(error => {
            throw error;
        });
}

// function modifyOrderItem(userId, productId, quantity) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await fetch(`${url}/modify/${userId}`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ productId, quantity }),
//             });
//             if (!response.ok) throw new Error("Failed to modify OrderItem");
//             resolve();
//         } catch (err) {
//             console.error("Error modifying OrderItem:", err);
//             reject(err);
//         }
//     });
// }
function modifyOrderItem(userId, productId, quantity) {
    return fetch(`${url}/modify/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
        })
        .catch(error => {
            throw error;
        });
}

// function clearOrderItem(userId) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await fetch(`${url}/clear/${userId}`, {
//                 method: "DELETE",
//             });
//             if (!response.ok) throw new Error("Failed to clear OrderItem");
//             resolve();
//         } catch (err) {
//             console.error("Error clearing OrderItem:", err);
//             reject(err);
//         }
//     });
// }
function clearOrderItem(userId) {
    return fetch(`${url}/clear/${userId}`, {
        method: "DELETE",
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
        })
        .catch(error => {
            throw error;
        });
}

export { fetchOrderItemData, modifyOrderItem, clearOrderItem };
