import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 4000;

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from React's build/dist folder
app.use(express.static(path.join(__dirname, 'Frontend', 'dist')));

app.use(cors());
app.use(express.json());

// In-memory data stores
const menu = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Classic pizza with tomato, mozzarella, and basil.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '2',
    name: 'Cheeseburger',
    description: 'Juicy beef patty with cheddar cheese, lettuce, and tomato.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan, and Caesar dressing.',
    price: 7.5,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
  }
];

const orders = {};
const ORDER_STATUSES = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

// --- API ROUTES (prefix with /api to avoid route conflicts) ---

app.get('/api/menu', (req, res) => {
  res.json(menu);
});

app.post('/api/orders', (req, res) => {
  const { items, customer } = req.body;
  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    !customer ||
    !customer.name ||
    !customer.address ||
    !customer.phone
  ) {
    return res.status(400).json({ error: 'Invalid order data.' });
  }
  for (const item of items) {
    if (
      !item.id ||
      typeof item.quantity !== 'number' ||
      item.quantity < 1 ||
      !menu.find((m) => m.id === item.id)
    ) {
      return res.status(400).json({ error: 'Invalid menu item in order.' });
    }
  }
  const orderId = uuidv4();
  const order = {
    id: orderId,
    items,
    customer,
    status: ORDER_STATUSES[0],
    statusHistory: [{ status: ORDER_STATUSES[0], timestamp: Date.now() }]
  };
  orders[orderId] = order;
  simulateOrderStatus(orderId);
  res.status(201).json({ orderId, status: order.status });
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders[req.params.id];
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  res.json({
    id: order.id,
    status: order.status,
    statusHistory: order.statusHistory
  });
});

function simulateOrderStatus(orderId) {
  let idx = 1;
  function nextStatus() {
    if (!orders[orderId] || idx >= ORDER_STATUSES.length) return;
    orders[orderId].status = ORDER_STATUSES[idx];
    orders[orderId].statusHistory.push({
      status: ORDER_STATUSES[idx],
      timestamp: Date.now()
    });
    idx++;
    if (idx < ORDER_STATUSES.length) {
      setTimeout(nextStatus, 4000);
    }
  }
  setTimeout(nextStatus, 4000);
}

// --- FALLBACK: Serve React index.html for all non-API routes ---
app.get('*', (req, res) => {
  // If the request starts with /api, return 404 (should never hit this fallback for API)
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found.' });
  }
  res.sendFile(path.join(__dirname, 'Frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Order Management API + React UI running on http://localhost:${PORT}`);
});