const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
// Ensure models are loaded and associations are defined before sync
require('./models/User');
require('./models/Category');
require('./models/Product');
require('./models/Rating');
require('./models/Cart');
require('./models/History');
require('./models/associations');
const routes = require('./routes/Routes');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5000',
    'http://aduhay-sulitnyo-v2-0.hackathon.sev-2.com',
    'https://aduhay-sulitnyo-v2-0.hackathon.sev-2.com'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Start the server first
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Then try to connect to the database
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Don't exit the process, let the server continue running
  }
};

startServer(); 