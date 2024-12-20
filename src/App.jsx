import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider } from "@/components/ui/provider";
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import OrderItem from './pages/mypage/OrderItem';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserDashboard from './pages/mypage/UserDashboard';
import OrderHistory from './pages/mypage/OrderHistory';
import UserInfoEdit from './pages/mypage/UserInfoEdit';
import DeleteAccount from './pages/mypage/DeleteAccount';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import ProductManagement from './pages/admin/ProductManagement';
import ProductForm from './pages/admin/ProductForm';

function App() {

    return (
        <Provider>
            <Header />
            <Main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order/:id" element={<OrderConfirmation />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signUp" element={<SignUp />} />

                    <Route path="/mypage" element={<UserDashboard />} >
                        <Route path="order-item" element={<OrderItem />} />    
                        <Route path="orders" element={<OrderHistory />} />
                        <Route path="edit" element={<UserInfoEdit />} />
                        <Route path="delete" element={<DeleteAccount />} />
                    </Route>

                    <Route path="/admin" element={<AdminDashboard />} >
                        <Route path="users" element={<UserManagement />} />
                        <Route path="orders" element={<OrderManagement />} />
                        <Route path="categories" element={<CategoryManagement />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="products/create" element={<ProductForm />} />
                    </Route>
                </Routes>
            </Main>
            <Footer />
        </Provider>
    );
}

export default App
