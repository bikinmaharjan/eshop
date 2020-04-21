const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileuplod = require('express-fileupload');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const cors = require('cors');

//Load config files
dotenv.config({ path: './config/config.env' });

//Connect DB
connectDB();

//Route Files
const products = require('./routes/products');
const app = express();

app.use(cors());

//Body parser
app.use(express.json());

//DEV logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//File uploading
app.use(fileuplod());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount Routers
app.get('/', (req, res) => {
  res.send('Site under Development');
});

app.use('/api/v1/products', products);

//Call Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//Handle Unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});
