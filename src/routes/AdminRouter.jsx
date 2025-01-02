import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import useAuthStore from '@/store/AuthStore';
import { useShallow } from 'zustand/react/shallow'

import {
    AdminDashboard,
    UserManagement,
    OrderManagement,
    CategoryManagement,
    ProductManagement,
    ProductForm,
    ProductUpdateForm
} from '@/pages/admin';

function AdminRouter() {
    const { isLoggedIn, auth } = useAuthStore(
        useShallow((state) => ({ 
            isLoggedIn: state.isLoggedIn,
            auth: state.auth
        })),
    )
    
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
                {/* <Route path="products/update/:productId" element={<ProductUpdateForm />} /> */}
            </Route>
            {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
    )
}

export default AdminRouter;