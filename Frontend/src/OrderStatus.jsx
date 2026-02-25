import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function OrderStatus() {
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState([]);
  const [delivered, setDelivered] = useState(false);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    const fetchStatus = () => {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          setHistory(data.statusHistory);
          if (data.status === "Delivered") {
            setDelivered(true);
            clearInterval(interval);
          }
        });
    };
    fetchStatus();
    interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="bg-gray-50 rounded-lg shadow p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Order Status
      </h2>
      <div className="mb-4">
        <strong>Status:</strong>{" "}
        <span className="text-blue-700 font-semibold">{status}</span>
      </div>
      <ul className="mb-4">
        {history.map((h, idx) => (
          <li key={idx} className="text-gray-700">
            {h.status} -{" "}
            <span className="text-gray-500">
              {new Date(h.timestamp).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
      {delivered && (
        <button
          onClick={() => {
            navigate("/menu");
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline focus:ring-2 focus:ring-blue-400"
        >
          Back to Menu
        </button>
      )}
    </div>
  );
}

export default OrderStatus;
