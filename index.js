const express = require('express')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const path = require('path');
const todoRoutes = require('./routes/users');
const flash = require('connect-flash');
const bodyparser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
//Passport config
require('./config/passport')(passport);

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');


const PORT = process.env.PORT || 9010;

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars) //   important!!! см. https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access
})


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
//app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // includes stylesheet
app.use(todoRoutes);

// Express Session
app.use(session({
  secret: 's',
  resave: true,
  saveUninitialized: true
}));

//Passport middleware


app.use(flash());

app.use(function (req, res, next) {
  if (req.user) {
    res.locals.user = req.user.toObject();
  }
});

// app.use(function(req, res, next) {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   next();
// });

async function start(){
  try {
    await mongoose.connect('mongodb+srv://Casper:carver2017@cluster0-yboyt.mongodb.net/users', {
      useNewUrlParser: true,
      useFindAndModify: false
    })
    app.listen(PORT, () => {
      console.log('Server has been started...');
    })
  } catch (e) {
    console.log('error to connect');
    console.log(e);
  }
}

start();