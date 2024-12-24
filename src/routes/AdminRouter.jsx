import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { useAuth } from '../services/AuthContext';

import {
    AdminDashboard,
    UserManagement,
    OrderManagement,
    CategoryManagement,
    ProductManagement,
    ProductForm
} from '@/pages/admin';

function AdminRouter() {
    const { isLoggedIn, auth } = useAuth();

    if (!isLoggedIn || auth !== "admin") {
        return <Navigate to="/" />
    }

    return (
        <Routes>
            <Route path="/" element={<AdminDashboard />} >
                <Route path="users" element={<UserManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="products/create" element={<ProductForm />} />
                <Route path="products/update/:productId" element={<ProductUpdateForm />} />
            </Route>
            {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
    )
}

export default AdminRouter;