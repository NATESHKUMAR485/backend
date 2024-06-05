require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

// Other middleware and routes here

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200
  }));

const app = express();
connectDB();

app.use(express.json({ extended: false }));
app.use('/api/recipients', require('./routes/recipients'));
app.use('/api/grafts', require('./routes/grafts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/graftsinfo', require('./routes/graftsinfo'));
app.use(errorHandler);
// Middleware for logging
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));





