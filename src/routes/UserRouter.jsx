import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { useAuth } from '../services/AuthContext';

import {
    UserDashboard,
    UserInfoEdit,
    OrderHistory,
    DeleteAccount
} from '@/pages/mypage';

function UserRouter() {
    const { isLoggedIn, auth } = useAuth();

    if (!isLoggedIn || auth !== "user") {
        return <Navigate to="/" />
    }

    return (
        <Routes>
            <Route path="/" element={<UserDashboard />} >
                <Route path="orders" element={<OrderHistory />} />
                <Route path="edit" element={<UserInfoEdit />} />
                <Route path="delete" element={<DeleteAccount />} />
            </Route>
            {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
    )
}

export default UserRouter;