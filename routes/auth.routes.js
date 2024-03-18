const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const passport = require('passport');
const bcrypt = require('bcrypt');
const ensureLogin = require('connect-ensure-login');

const bcryptSalt = 10;

// TODO: Require user model

// TODO: Add bcrypt to encrypt passwords

// TODO: Add the /signup routes (GET and POST)
router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.get('/login', (req, res, next) => res.render('auth/login'));

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/private", { user: req.user });
});

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) { return next(err) };
    res.redirect('/');
  });
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', {
      errorMessage: 'Indicate a username and a password to sign up'
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        console.log('passei 0');
        res.render('auth/signup', {
          errorMessage: "The username already exists!"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      console.log('passei');
      return newUser.save();
    })
    .then(() => {
      console.log('passei 1');
      res.redirect('/');
    })
    .catch(error => {
      console.log('passei 2');
      res.render('auth/signup', {
        errorMessage: 'Something went wrong'
      });
    });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/private-page',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  })
);

module.exports = router;
