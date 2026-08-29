import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Collections from './components/Collections';
import Features from './components/Features';
import Story from './components/Story';
import Footer from './components/Footer';

// Pages
import AllCollections from './pages/AllCollections';
import Signup from './pages/Signup';
import Login from './pages/Login';
import TrackOrder from './pages/TrackOrder';
import CustomerDashboard from './pages/CustomerDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Products from './admin/Products';
import ProductForm from './admin/ProductForm';
import Categories from './admin/Categories';
import Orders from './admin/Orders';
import OrderDetail from './admin/OrderDetail';
import CustomerView from './admin/CustomerView';

function PublicLanding() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Collections />
        <Features />
        <Story />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLanding />} />
      <Route path="/collections/all" element={<AllCollections />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/track-order" element={<TrackOrder />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<CustomerDashboard />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
      
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="customers/:id" element={<CustomerView />} />
      </Route>
    </Routes>
  );
}

export default App;
