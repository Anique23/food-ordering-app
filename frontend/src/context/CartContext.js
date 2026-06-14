import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (food) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === food.id);
            if (existing) {
                return prev.map(item =>
                    item.id === food.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...food, quantity: 1 }];
        });
    };

    const removeFromCart = (foodId) => {
        setCartItems(prev => prev.filter(item => item.id !== foodId));
    };

    const updateQuantity = (foodId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(foodId);
            return;
        }
        setCartItems(prev =>
            prev.map(item => item.id === foodId ? { ...item, quantity } : item)
        );
    };

    const clearCart = () => setCartItems([]);

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity, 0
    );

    const totalItems = cartItems.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, removeFromCart,
            updateQuantity, clearCart, totalPrice, totalItems
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);