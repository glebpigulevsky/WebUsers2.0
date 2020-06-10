const express = require('express')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const path = require('path');
const todoRoutes = require('./routes/users');
var bodyparser = require('body-parser');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');


const PORT = process.env.PORT || 5060;

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars) //   важно!!! см. https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access
})


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
//app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // подключение стилей
app.use(todoRoutes);

app.use(function (req, res, next) {
  if (req.user) {
    res.locals.user = req.user.toObject();
  }
  
});
// app.use(express.urlencoded({
//   extended: true,
// }));   mongodb+srv://Casper:carver2017@cluster0-yboyt.mongodb.net/users

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