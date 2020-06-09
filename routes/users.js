const {Router} = require('express');
const User = require('../models/Users');
const router = Router();



router.get('/', async (req, res) => {
  const user = await User.find({});
  res.render('index', {
    user,
  });
})

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register',
    isRegister: true
  });

})

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    isRegister: true
  });
})

router.get('/users', async (req, res) => {
  const user = await User.find({});
  res.render('users', {
    user,
    title: 'Users list',
    isRegister: true
  });
})

router.post('/register', async (req, res) => {
  console.log('yes');
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,

  })
  await user.save();
  console.log(user);
  res.redirect('/');
})

router.post('/login', async (req, res) => {
  const user_email = await User.findOne({email: req.body.loginEmail});
  user_email.lastLogin = Date.now();
  await user_email.save();
  console.log(user_email);
  res.redirect('/users');
})

router.post('/delete', async (req, res) => {
  const usersDelete = req.body.id;
  await User.findById(usersDelete).deleteMany();
  res.redirect('/users');
})

module.exports = router;



