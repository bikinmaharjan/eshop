const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileuplod = require('express-fileupload');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

//Load config files
dotenv.config({ path: './config/config.env' });

//Connect DB
connectDB();

//Route Files
const products = require('./routes/products');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

//Initialize app
const app = express();

app.use(cors());

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//DEV logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//File uploading
app.use(fileuplod());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount Routers
app.get('/', (req, res) => {
  res.send('Site under Development');
});

app.use('/api/v1/products', products);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

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
