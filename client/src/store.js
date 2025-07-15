import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice';
import productReducer from './features/product/productSlice';
import cartReducer from './features/cart/cartSlice';
import wishlistReducer from './features/wishlist/wishlistSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
    }
});

export default store