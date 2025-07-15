import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetails from './pages/ProductDetails'
import AdminRoute from './components/AdminRoute'
import ProtectedRoute from './components/ProtectedRoute'
import ProductList from './pages/admin/ProductList'
import EditProduct from './pages/admin/EditProduct'
import AddProduct from './pages/admin/AddProduct'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import SuccessPage from './pages/SuccessPage'
import MyOrdersPage from './pages/MyOrdersPage'
import WishlistPage from './pages/WishlistPage'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />

          <Route path="/my-orders" element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          } />

          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />

          <Route path="/success" element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          } />

          <Route path="/wishlist" element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <ProductList />
            </AdminRoute>
          } />
          <Route path="/admin/edit-product/:id" element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          } />
          <Route path="/admin/add-product" element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          } />

        </Routes>
      </main>
    </>
  )
}

export default App