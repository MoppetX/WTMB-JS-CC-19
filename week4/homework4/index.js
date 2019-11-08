/* eslint-disable */
const Chalk = require('chalk');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const userRoute = require('./routes/user');

const app = express();
// const router = express.Router();
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(bodyParser.json());

// MIDDLEWARE: the order of functions here matters
// middleware funcs use three parameters
// next is reference to the next func in the pipeline
// app.use((req, res, next) => {
//   console.log(`${new Date().toString()} => ${req.originalUrl}`);
//
//   // if you don't respond to req, you have to call next()
//   next();
// });

// registering the custom route
app.use(userRoute);

// will render the index.html file if nothing else is specified
app.use(express.static(__dirname + 'public'));
// app.use(express.static(path.join(__dirname, 'public')));


const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.info(`server has started on port ${PORT === DEFAULT_PORT ? PORT : Chalk.bgYellowBright(PORT)}`);
});

app.get('/', (req, res) => {
  res.render('index');
});


// those two should be at the BOTTOM of this page
// Handler for 404 error
app.use((req, res, next) => {
  res.status(404).render('404');
  // res.status(404).render(path.join(__dirname, './views/404'));

  // next();
});

// Handler for 500 error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.sendFile(path.join(__dirname, './public/500.html'));
  // next();
});
