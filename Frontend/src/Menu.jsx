import React from "react";
import { useNavigate } from "react-router-dom";

function Menu({ menu, addToCart, cartCount }) {
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Menu</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menu.map((item) => (
          <li
            key={item.id}
            className="flex flex-col md:flex-row items-center bg-gray-50 rounded-lg shadow p-4"
          >
            <img
              src={item.image}
              alt={item.name}
              width={120}
              height={90}
              className="object-cover rounded-lg mb-4 md:mb-0 md:mr-6 border"
            />
            <div className="flex-1">
              <strong className="block text-lg text-gray-900">
                {item.name}
              </strong>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <span className="text-blue-700 font-semibold">
                ${item.price.toFixed(2)}
              </span>
              <button
                onClick={() => addToCart(item)}
                className="ml-4 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 focus:outline focus:ring-2 focus:ring-green-400"
                aria-label={`Add ${item.name} to cart`}
              >
                Add to Cart
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate("/cart")}
        aria-label="View cart"
        style={{
          marginTop: 24,
          padding: "10px 24px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        View Cart ({cartCount})
      </button>
    </div>
  );
}

export default Menu;
