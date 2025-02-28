import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import useAuthStore from '@/store/AuthStore';
import { useShallow } from 'zustand/react/shallow'


import {
    Home,
    ProductList,
    ProductDetail,
    OrderItem,
    Checkout,
    OrderConfirmation,
    Login,
    SignUp
} from '@/pages';

import AdminRouter from './AdminRouter';
import UserRouter from './UserRouter';

function AppRouter() {
    const { isLoggedIn, auth } = useAuthStore(
        useShallow((state) => ({
            isLoggedIn: state.isLoggedIn,
            auth: state.auth
        })),
    )

    return (
        <Routes>
            {/* 퍼블릭 */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/order-item" element={<OrderItem />} />


            {isLoggedIn ? (
                <>
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order/:id" element={<OrderConfirmation />} />
                </>
            ) : (
                <>
                    <Route path="/checkout" element={<Navigate to="/login" />} />
                    <Route path="/order/:id" element={<Navigate to="/login" />} />
                </>
            )}

            {isLoggedIn ? (
                <>
                    {auth === "user" && (
                        <Route path="/mypage/*" element={<UserRouter />} />
                    )}

                    {auth === "admin" && (
                        <Route path="/admin/*" element={<AdminRouter />} />
                    )}

                    <Route path="/login" element={<Navigate to="/" />} />
                </>
            ) : (
                <>
                    <Route path="/mypage" element={<Navigate to="/login" />} />
                    <Route path="/admin" element={<Navigate to="/login" />} />
                </>
            )}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
    )
}

export default AppRouter;