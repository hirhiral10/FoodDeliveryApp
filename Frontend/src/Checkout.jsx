import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ onSubmit, onBack, cart, setCart }) {
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d{10,15}$/;

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: [] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!customer.name.trim()) newErrors.name = ["Name is required."];
    if (!customer.email.trim()) newErrors.email = ["Email is required."];
    else if (!emailRegex.test(customer.email.trim()))
      newErrors.email = ["Please enter a valid email address."];
    if (!customer.phone.trim())
      newErrors.phone = ["Mobile number is required."];
    else if (!phoneRegex.test(customer.phone.trim()))
      newErrors.phone = ["Please enter a valid mobile number (10-15 digits)."];
    if (!customer.address.trim()) newErrors.address = ["Address is required."];
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(({ id, quantity }) => ({ id, quantity })),
          customer,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to place order.");
        setSubmitting(false);
        return;
      }
      const data = await res.json();
      setCart([]);
      navigate(`/order-status/${data.orderId}`);
    } catch (err) {
      console.log(err);
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Checkout form"
      className="bg-gray-50 rounded-lg shadow p-6 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Checkout</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1 font-medium">
          Name:
          <input
            id="name"
            name="name"
            value={customer.name}
            onChange={handleChange}
            className="block w-full mt-1 border rounded px-3 py-2 focus:outline focus:ring-2 focus:ring-blue-400"
          />
        </label>
        {errors.name &&
          errors.name.map((msg, idx) => (
            <div
              key={idx}
              style={{ color: "red" }}
              role="alert"
              aria-live="polite"
            >
              {msg}
            </div>
          ))}
      </div>
      <div className="mb-4">
        <label htmlFor="address" className="block mb-1 font-medium">
          Email:
          <input
            id="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            className="block w-full mt-1 border rounded px-3 py-2 focus:outline focus:ring-2 focus:ring-blue-400"
          />
        </label>
        {errors.email &&
          errors.email.map((msg, idx) => (
            <div
              key={idx}
              style={{ color: "red" }}
              role="alert"
              aria-live="polite"
            >
              {msg}
            </div>
          ))}
      </div>
      <div className="mb-4">
        <label htmlFor="address" className="block mb-1 font-medium">
          Address:
          <input
            id="address"
            name="address"
            value={customer.address}
            onChange={handleChange}
            className="block w-full mt-1 border rounded px-3 py-2 focus:outline focus:ring-2 focus:ring-blue-400"
          />
        </label>
        {errors.address &&
          errors.address.map((msg, idx) => (
            <div
              key={idx}
              style={{ color: "red" }}
              role="alert"
              aria-live="polite"
            >
              {msg}
            </div>
          ))}
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block mb-1 font-medium">
          Phone:
          <input
            id="phone"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
            className="block w-full mt-1 border rounded px-3 py-2 focus:outline focus:ring-2 focus:ring-blue-400"
          />
        </label>
        {errors.phone &&
          errors.phone.map((msg, idx) => (
            <div
              key={idx}
              style={{ color: "red" }}
              role="alert"
              aria-live="polite"
            >
              {msg}
            </div>
          ))}
      </div>
      {error && (
        <div className="mb-4 text-red-600 font-medium" role="alert">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline focus:ring-2 focus:ring-green-400 mr-2"
      >
        Place Order
      </button>
      <button
        type="button"
        onClick={() => {
          navigate("/cart");
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline focus:ring-2 focus:ring-blue-400"
      >
        Back to Cart
      </button>
    </form>
  );
}

export default Checkout;
