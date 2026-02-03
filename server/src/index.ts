import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from './models/Product'; 
import Lead from './models/Lead';
import authRoutes from './routes/auth'; 
import User from './models/User';
import bcrypt from 'bcrypt';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Database Connection
const MONGO_URI = process.env.MONGO_URI || '';
mongoose.connect(MONGO_URI)
  .then(() => console.log(' MongoDB Connected Successfully'))
  .catch((err) => console.error(' MongoDB Connection Error:', err));

// --- ROUTES ---

// 1. Test Route
app.get('/', (req, res) => {
  res.send('MediMove API is Running...');
});

// 2. Get All Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch everything from DB
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product' });
  }
});

// 5. UPDATE PRODUCT (e.g. Change Stock Status)
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated version
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

// 6. DELETE PRODUCT
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// 7. GET ALL LEADS
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }); // Newest first
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leads' });
  }
});

// 8. UPDATE LEAD STATUS
app.put('/api/leads/:id', async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: 'Error updating lead' });
  }
});

// 9. DELETE LEAD
app.delete('/api/leads/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lead' });
  }
});// 10. DASHBOARD STATS (The Aggregator)
app.get('/api/stats', async (req, res) => {
  try {
    // 1. Count Inventory
    const totalProducts = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ stockStatus: 'Low Stock' });

    // 2. Count Leads
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const pendingQuotes = await Lead.countDocuments({ type: 'Quote Request', status: 'New' });
    
    // 3. Chart Data: Group Leads by Status
    // We want to know: How many New vs Contacted vs Closed?
    const leadsByStatus = await Lead.aggregate([
      {
        $group: {
          _id: '$status', // Group by 'New', 'Contacted', 'Closed'
          count: { $sum: 1 }
        }
      }
    ]);

    // Format for Frontend
    res.json({
      inventory: { total: totalProducts, low: lowStock },
      leads: { total: totalLeads, new: newLeads, quotes: pendingQuotes },
      chartData: leadsByStatus
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});


// CREATE ADMIN USER (Run once)
app.get('/seed-admin', async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: 'admin' });
    if (existingUser) return res.send('Admin already exists');

    // Create "admin" with password "admin123"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const newUser = new User({
      username: 'admin',
      password: hashedPassword
    });

    await newUser.save();
    res.send('✅ Admin Account Created: admin / admin123');
  } catch (error) {
    res.status(500).send('Error creating admin');
  }
});

// 3. POST: Create a New Lead (The Money Maker)
app.post('/api/leads', async (req, res) => {
  try {
    const { name, phone, type, items } = req.body;

    // Simple Validation
    if (!name || !phone) {
      res.status(400).json({ message: 'Name and Phone are required' });
      return;
    }

    // Save to Database
    const newLead = new Lead({
      name,
      phone,
      type,
      items: items || [] // Empty array if no items
    });

    await newLead.save();

    console.log(`New Lead: ${name} (${type})`);
    res.status(201).json({ message: 'Lead captured successfully!' });

  } catch (error) {
    console.error("Error saving lead:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// 3. SEED ROUTE (Run this once to fill DB)
app.get('/seed', async (req, res) => {
  const sampleData = [
    // --- RADIOLOGY ---
    {
      name: "Mindray DP-50 Expert",
      category: "Radiology", // Matched exact string
      condition: "New",
      stockStatus: "In Stock",
      image: "/products/ultrasound.jpg",
      specs: ["15\" LCD Monitor", "Color Doppler", "2 Transducer Ports", "Battery Backup"],
    },
    {
      name: "GE Logiq P9",
      category: "Radiology",
      condition: "Refurbished",
      stockStatus: "Low Stock",
      image: "/products/radiology.jpg",
      specs: ["Touch Panel", "Cardiac Application", "4D Imaging", "Gel Warmer"],
    },
    {
      name: "Siemens Acuson X300",
      category: "Radiology",
      condition: "Refurbished",
      stockStatus: "In Stock",
      image: "/products/radiology.jpg",
      specs: ["Multi-frequency", "3 Active Ports", "Cardiology Preset", "15-inch Monitor"],
    },
    
    // --- ICU ---
    {
      name: "Philips InteliVue MX450",
      category: "ICU", // Matched exact string
      condition: "New",
      stockStatus: "In Stock",
      image: "/products/monitor.jpg",
      specs: ["12\" Touchscreen", "ECG/SpO2/NIBP", "Portable", "EWS Scoring"],
    },
    {
      name: "Hamilton C1 Ventilator",
      category: "ICU",
      condition: "Refurbished",
      stockStatus: "Pre-Order",
      image: "/products/anesthesia.jpg",
      specs: ["Neonatal to Adult", "Turbine driven", "Non-invasive", "Compact"],
    },
    {
      name: "Mindray BeneView T5",
      category: "ICU",
      condition: "New",
      stockStatus: "In Stock",
      image: "/products/monitor.jpg",
      specs: ["Modular Design", "12.1\" Display", "Arrhythmia Analysis", "Data Storage"],
    },

    // --- OT ---
    {
      name: "Drager Fabius GS",
      category: "OT", // Matched exact string
      condition: "Refurbished",
      stockStatus: "Pre-Order",
      image: "/products/anesthesia.jpg",
      specs: ["Ventilator Integrated", "Color Screen", "O2 Monitoring", "Compact Design"],
    },
    {
      name: "Maquet Alphamaxx Table",
      category: "OT",
      condition: "Refurbished",
      stockStatus: "Low Stock",
      image: "/products/anesthesia.jpg",
      specs: ["Electric Control", "500kg Load", "Longitudinal Shift", "Kidney Bridge"],
    },

    // --- FURNITURE ---
    {
      name: "Hill-Rom Electric Bed",
      category: "Furniture", // Matched exact string
      condition: "Refurbished",
      stockStatus: "In Stock",
      image: "/products/ultrasound.jpg", // Placeholder
      specs: ["Remote Control", "CPR Release", "Scale Integrated", "Side Rails"],
    }
  ];

  try {
    await Product.deleteMany({}); // Clear old data
    await Product.insertMany(sampleData); // Insert new data
    res.send('Database Seeded Successfully!');
  } catch (error) {
    res.status(500).send('Error Seeding DB');
  }
});

app.listen(PORT, () => {
  console.log(`\nSERVER STARTED on Port ${PORT}`);
});
