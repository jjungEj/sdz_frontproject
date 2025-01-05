const apiUrl = import.meta.env.VITE_API_URL;
const endpoint = "/orders";

const url = `${apiUrl}${endpoint}`;

// 사용자 인증 토큰을 가져오는 함수
function getAuthToken() {
    return localStorage.getItem('access'); // 'access'는 저장된 토큰의 키
}

// 사용자 주문 목록 조회
async function getUserOrders() {
    try {
        const response = await fetch(`${url}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getAuthToken()}`,
            },
        });
        if (!response.ok) throw new Error('주문 목록을 불러오지 못했습니다.');
        return await response.json();
    } catch (error) {
        console.error('getUserOrders 에러:', error);
        throw error;
    }
}

// 특정 주문 상세 조회
async function getOrderDetail(orderId) {
    try {
        const response = await fetch(`${url}/${orderId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getAuthToken()}`,
            },
        });
        if (!response.ok) throw new Error('주문 상세 정보를 불러오지 못했습니다.');
        return await response.json();
    } catch (error) {
        console.error('getOrderDetail 에러:', error);
        throw error;
    }
}

// 사용자 주문 생성
async function createOrder(orderData) {
    try {
        const response = await fetch(`${url}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error('주문 생성에 실패했습니다.');
        return await response.json();
    } catch (error) {
        console.error('createOrder 에러:', error);
        throw error;
    }
}

// 사용자 주문 수정
async function updateOrder(orderId, orderData) {
    try {
        const response = await fetch(`${url}/${orderId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error('주문 수정에 실패했습니다.');
        return await response.json();
    } catch (error) {
        console.error('updateOrder 에러:', error);
        throw error;
    }
}

// 사용자 주문 삭제
async function deleteOrder(orderId) {
    try {
        const response = await fetch(`${url}/${orderId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getAuthToken()}`,
            },
        });
        if (!response.ok) throw new Error('주문 삭제에 실패했습니다.');
    } catch (error) {
        console.error('deleteOrder 에러:', error);
        throw error;
    }
}

// 관리자 모든 주문 조회
async function getAllOrders(page, pageSize ) {
    try {
        const response = await fetch(`${url}/admin?page=${page}&size=${pageSize}`, {
             method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
        });
        if (!response.ok) throw new Error('모든 주문 목록을 불러오지 못했습니다.');
        const data = await response.json();
        return {
            dtoList: data, // 서버에서 받은 데이터를 dtoList로 설정
            total: data.length // 현재는 임시로 데이터 길이를 total로 설정
        };
    } catch (error) {
        console.error('getAllOrders 에러:', error);
        throw error;
    }
}


// 관리자 주문 상태 수정
async function updateOrderStatus(orderId, orderStatus) {
    try {
        const response = await fetch(`${url}/admin/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ status: orderStatus }), 
        });
        if (!response.ok) {
            throw new Error('주문 상태 수정에 실패했습니다.');
        }
        const responsedata = await response.json();
        console.log(responsedata);
        return responsedata;
    } catch (error) {
        console.error('updateOrderStatus 에러:', error);
        throw error;
    }
    
}


// 관리자 주문 삭제
async function deleteOrderByAdmin(orderIds) {
    try {
        const response = await fetch(`${url}/admin/orders`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ orderIds: orderIds })
        });
        if (!response.ok) {
            const errorText = await response.text();  // 에러 메시지 받기
            throw new Error(`관리자 주문 삭제에 실패했습니다: ${errorText}`);
        }
    } catch (error) {
        console.error('deleteOrderByAdmin 에러:', error);
        throw error;
    }
}

export { 
    createOrder,
    getUserOrders,
    getOrderDetail,
    updateOrder,
    deleteOrder,
    getAllOrders,
    updateOrderStatus,
    deleteOrderByAdmin
};
