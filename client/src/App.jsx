import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetails from './pages/ProductDetails'
import AdminRoute from './components/AdminRoute'
import ProductList from './pages/admin/ProductList'
import EditProduct from './pages/admin/EditProduct'
import AddProduct from './pages/admin/AddProduct'

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