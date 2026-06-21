require('dotenv').config();

const express = require('express');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');


connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/admin', adminRoutes);
const port = process.env.PORT || 8000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Real Estate Marketplace API is running successfully");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
