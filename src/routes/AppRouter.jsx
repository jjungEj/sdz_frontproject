import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { useAuth } from '../services/AuthContext';

import Home from '../pages/Home';
import ProductList from '../pages/ProductList';
import ProductDetail from '../pages/ProductDetail';
import OrderItem from '../pages/OrderItem';
import Checkout from '../pages/Checkout';
import OrderConfirmation from '../pages/OrderConfirmation';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';

import AdminRouter from './AdminRouter';
import UserRouter from './UserRouter';

function AppRouter() {
    const { isLoggedIn, auth } = useAuth();

    return (
        <Routes>
            {/* 퍼블릭 */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/order-item" element={<OrderItem />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:id" element={<OrderConfirmation />} />

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