const baseUrl = "http://localhost:8080/api/orders"; // 기본 API URL

// 사용자 주문 목록 조회
function getUserOrders(userId) {
    return fetch(`${baseUrl}/user/${userId}`) // 사용자 ID를 포함한 URL로 GET 요청
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message); // 오류 발생 시 메시지 반환
                });
            }
            return response.json(); // 성공적으로 응답 받으면 JSON으로 변환하여 반환
        })
        .catch(error => {
            throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
        });
}

// 사용자 주문 추가
function createOrder(userId, orderData) {
    return fetch(`${baseUrl}/user/${userId}`, { 
        method: "POST", // POST 요청으로 새로운 주문 생성
        headers: {
            "Content-Type": "application/json", // 요청 본문의 형식 지정
        },
        body: JSON.stringify(orderData), // 주문 데이터를 JSON 문자열로 변환하여 전송
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

// 사용자 주문 수정
function updateOrder(orderId, orderData) {
    return fetch(`${baseUrl}/${orderId}`, { 
        method: "PUT", // PUT 요청으로 기존 주문 수정
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData), 
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

// 사용자 주문 취소
function deleteOrder(orderId) {
    return fetch(`${baseUrl}/${orderId}`, { 
        method: "DELETE", // DELETE 요청으로 특정 주문 삭제
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message); 
            });
        }
        return; // 성공적으로 삭제되면 아무것도 반환하지 않음
    })
    .catch(error => {
        throw error; 
    });
}

// API 호출 함수를 export하여 다른 파일에서 사용할 수 있도록 함.
export { getUserOrders, createOrder, updateOrder, deleteOrder };