import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { useAuth } from '../services/AuthContext';

import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import OrderManagement from '../pages/admin/OrderManagement';
import CategoryManagement from '../pages/admin/CategoryManagement';
import ProductManagement from '../pages/admin/ProductManagement';
import ProductForm from '../pages/admin/ProductForm';

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
            </Route>
            {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
    )
}

export default AdminRouter;