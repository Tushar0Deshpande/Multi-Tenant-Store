require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. MIDDLEWARE (Must come BEFORE routes)
app.use(express.json());

// Configure CORS properly for your Vercel deployment
app.use(cors({
    origin: 'https://multi-tenant-store-5nssba5bd-tushars-projects-0b3a396a.vercel.app', 
    credentials: true
}));

// 2. DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err));

// 3. ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// 4. SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));