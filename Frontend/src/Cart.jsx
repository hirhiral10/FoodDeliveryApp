import React from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cart, updateQuantity, removeFromCart }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Cart</h2>
      {cart.length === 0 ? (
        <div>
          <p className="mb-4 text-gray-600">Your cart is empty.</p>
          <button
            onClick={() => navigate("/menu")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline focus:ring-2 focus:ring-blue-400"
          >
            Back to Menu
          </button>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-4">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center py-3">
                <span className="flex-1 font-medium">{item.name}</span>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value, 10))
                  }
                  aria-label={`Quantity for ${item.name}`}
                  className="w-16 mx-2 border rounded px-2 py-1"
                />
                <button
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline focus:ring-2 focus:ring-red-400"
                >
                  Remove
                </button>
                <span className="ml-4 text-gray-700">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mb-4">
            <strong className="text-lg">Total: ${total.toFixed(2)}</strong>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline focus:ring-2 focus:ring-green-400 mr-2"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={() => navigate("/menu")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline focus:ring-2 focus:ring-blue-400"
          >
            Back to Menu
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
