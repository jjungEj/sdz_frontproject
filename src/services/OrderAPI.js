// API의 기본 URL 설정
const baseUrl = "http://localhost:8080/api/orders";

/**
 * 사용자의 주문 목록을 조회하는 함수
 * @param {string} userId - 사용자 ID
 * @returns {Promise} - 주문 목록 데이터
 */
function getUserOrders(userId) {
    return fetch(`${baseUrl}/user/${userId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    })
    .then(handleResponse);
}
function getOrderDetail(orderId) {
    return fetch(`${baseUrl}/${orderId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    })
    .then(handleResponse);
}
/**
 * 새로운 주문을 생성하는 함수
 * @param {string} userId - 사용자 ID
 * @param {Object} orderData - 주문 정보 객체
 * @param {Array} orderData.orderItems - 주문 상품 목록
 * @param {Object} orderData.shippingInfo - 배송 정보
 * @param {string} orderData.paymentMethod - 결제 방법
 * @returns {Promise} - 생성된 주문 데이터
 */
function createOrder(userId, orderData) {
    const formattedData = {
        ...orderData,
        shippingInfo: {
            receiverName: orderData.shippingInfo.name,
            receiverContact: orderData.shippingInfo.phone,
            deliveryAddress1: orderData.shippingInfo.address,
            deliveryAddress2: orderData.shippingInfo.detailAddress,
            deliveryAddress3: '',  // 데이터베이스 스키마에 있는 필드
            deliveryRequest: orderData.shippingInfo.request,
            userId, // delivery_address 테이블의 user_id 필드
            defaultCheck: false  // delivery_address 테이블의 default_check 필드
        },
        deliveryStatus: 'PENDING'
    };

    return fetch(`${baseUrl}/user/${userId}`, { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(formattedData)
    })
    .then(handleResponse);
}

/**
 * 기존 주문을 수정하는 함수
 * @param {string} orderId - 주문 ID
 * @param {Object} orderData - 수정할 주문 정보
 * @returns {Promise} - 수정된 주문 데이터
 */
function updateOrder(orderId, orderData) {
    return fetch(`${baseUrl}/${orderId}`, { 
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(orderData),
    })
    .then(handleResponse);
}

/**
 * 주문을 취소(삭제)하는 함수
 * @param {string} orderId - 취소할 주문 ID
 * @returns {Promise} - 성공 시 undefined 반환
 */
function deleteOrder(orderId) {
    return fetch(`${baseUrl}/${orderId}`, { 
        method: "DELETE",
        credentials: 'include'
    })
    .then(handleResponse);
}
// 관리자용 함수 추가
function getAllOrders() {
    return fetch(`${baseUrl}/admin`, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    })
    .then(handleResponse);
}

function updateOrderStatus(orderId, status) {
    return fetch(`${baseUrl}/admin/${orderId}/status?status=${status}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    })
    .then(handleResponse);
}

function deleteOrderByAdmin(orderId) {
    return fetch(`${baseUrl}/admin/${orderId}`, {
        method: "DELETE",
        credentials: 'include'
    })
    .then(handleResponse);
}

// 공통 응답 처리 함수
function handleResponse(response) {
    if (!response.ok) {
        return response.json().then(errorData => {
            throw new Error(errorData.message);
        });
    }
    return response.status === 204 ? undefined : response.json();
}

export { 
    getUserOrders, 
    getOrderDetail,
    createOrder, 
    updateOrder, 
    deleteOrder,
    getAllOrders,
    updateOrderStatus,
    deleteOrderByAdmin 
};