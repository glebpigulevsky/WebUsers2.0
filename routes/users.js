const {Router} = require('express');
const User = require('../models/Users');
const router = Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


router.get('/', async (req, res) => {
  const user = await User.find({});
  res.render('index', {
    user,
  });
})

router.get('/register', (req, res) => {
  const exist = req.query.exist;
  res.render('register', {
    exist,
    title: 'Register',
    isRegister: true
  });
})

router.get('/login', (req, res) => {
  const incorrect = req.query.incorrect;
  const blocked = req.query.blocked;
  res.render('login', {
    blocked,
    incorrect,
    title: 'Login',
    isRegister: true
  });
})

router.get('/users', async (req, res) => {
  const user = await User.find({});
  const user_id = await req.query.user_id;
  await res.render('users', {
    user_id,
    user,
    title: 'Users list',
    isRegister: true,
    isAuth: true,
  });
})

router.post('/register', async (req, res) => {
  User.findOne({ email: req.body.email}, async function( error, user) {
  if (user){
    res.redirect('/register?exist=true');
    } else{
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })
  console.log(user);
  //Hash Password
  
   await bcrypt.genSalt(10, async (err, salt) => {
    
    await bcrypt.hash(user.password, salt, async (err, hash) => {
      if(err) throw err;
      
      user.password = await hash;
      user.save()

      .then(user => {
        res.redirect('/login');
      })
      .catch( err => console.log(err));
    })
  })
  
    

  
  
  
}
  })
})


// router.post('/login', (req, res) => {
//   const password = req.body.loginPassword;
//   User.findOne({
//       $and: [
//         { email: req.body.loginEmail },
//         { password: password },
//       ]
//     }, function( error, user) {
//     if (user){
//       if(user.blocked) {
//         res.redirect('/login?blocked=true');
//       } else{
//          let date = new Date();
//          let lastLogin = getTime(date);
//         user.lastLogin = lastLogin;
//         user.save();
//         res.redirect('/users?user_id=' + user.id);
//       }
//     } else if( user === null){
//       res.redirect('/login?incorrect=true');
//     } 
//   })
// });

router.post('/login', async (req, res, next) => {
  const user = await User.find({});
  //const actUser = user.findOne({email: req.body.email });
  console.log(user);
  passport.authenticate('local', {
    successRedirect: '/users?user_id=' + user[0].id,
    failureRedirect: '/login?',
    failureFlash: false
  })(req, res, next);
});

router.post('/delete', async (req, res) => {
  let usersDelete = req.body.id;
  if (usersDelete == undefined ){
    res.redirect('/users');
  } else {
    if (usersDelete[0] == ''){
      usersDelete = usersDelete.slice(1);
    }
    const activeLogin = req.body.actLogin;
    await User.findById(usersDelete).deleteMany();
    if (usersDelete.includes(activeLogin)) {
        res.redirect('/');
      } else {
        res.redirect('/users');
    }
  }
})

router.post('/block', async (req, res) => {
  let activeLogin = req.body.actLogin;
  let usersBlock = req.body.id;
  if (usersBlock == undefined){
    res.redirect('/users?user_id=' + activeLogin);
  } else {
    if (usersBlock.length == 24) {
      const userToBLock = await User.findById(usersBlock);
      userToBLock.blocked = true;
      await userToBLock.save();
      if (usersBlock == activeLogin) {
        res.redirect('/');
      } else {
        res.redirect('/users?user_id=' + activeLogin);
      }
    } else {
      if (usersBlock[0] == ''){
        usersBlock = usersBlock.slice(1);
      }
  
      for (i = 0; i < usersBlock.length; i += 1){
        const userToBLock = await User.findById(usersBlock[i]);
        userToBLock.blocked = true;
        await userToBLock.save();
      }
      if (usersBlock.includes(activeLogin)) {
        res.redirect('/');
      } else {
        res.redirect('/users?user_id=' + activeLogin);
      }
    }
  }
})

router.post('/unblock', async (req, res) => {
  let activeLogin = req.body.actLogin;
  let usersBlock = req.body.id;
  if (usersBlock == undefined){
    res.redirect('/users?user_id=' + activeLogin);
  } else {
    if (usersBlock.length == 24){
      const userToBLock = await User.findById(usersBlock);
      userToBLock.blocked = false;
      await userToBLock.save();
      res.redirect('/users?user_id=' + activeLogin);
    }
    if (usersBlock[0] == ''){
      usersBlock = usersBlock.slice(1);
    }
    for (i = 0; i < usersBlock.length; i += 1){
      const userToBLock = await User.findById(usersBlock[i]);
      userToBLock.blocked = false;
      await userToBLock.save();
    }
    res.redirect('/users?user_id=' + activeLogin);
  }
})


function getTime(date){
  let month = date.getMonth();
  let day = date.getDay();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const dayOfMonth = date.getDate();
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  return `${day} ${dayOfMonth} ${month} ${hours}:${minutes}`;
}

module.exports = router;

