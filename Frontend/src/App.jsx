import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Menu from "./Menu";
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderStatus from "./OrderStatus";

function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("menu"); // menu | cart | checkout | status

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then(setMenu);
  }, []);

  const addToCart = (item, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <Router>
      <div className="max-w-3xl mx-auto p-6 bg-white min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
          Food Delivery App
        </h1>
        <Routes>
          <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route
            path="/menu"
            element={
              <Menu
                menu={menu}
                addToCart={addToCart}
                cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={<Checkout cart={cart} setCart={setCart} />}
          />
          <Route path="/order-status/:orderId" element={<OrderStatus />} />
          <Route path="*" element={<Navigate to="/menu" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
