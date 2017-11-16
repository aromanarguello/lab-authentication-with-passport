const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});


router.post("/process-signup", (req, res, next) => {
  if(req.body.signupPassword === ""|| req.body.signupPassword.length < 6 || req.body.signupPassword.match(/[^a-z0-9]/i)===null)
  {
    res.locals.errorMessage= "password is invalid";
    res.render("passport/signup");
    //early return

    return;
  }
  //finds if email is taken, query the database
  User.findOne({email: req.body.signupUser})
  .then((userFromDb)=>{
    if(userFromDb !==null)
    {
      res.locals.errorMessage= "UserName is invalid";
      res.render("passport/signup");
      return;
    }
    //generate salt
    const salt= bcrypt.genSaltSync(10);

    //encrypt the password submitted from teh form
    const scrambledPassword= bcrypt.hashSync(req.body.signupPassword,salt);

    //create a new user

    const theUser= new User ({
      fullName:req.body.signupUser,
      encyptedPassword:scrambledPassword,

    });
    //return the promise of the next database query
    return theUser.save();
  })

    .then(()=>{
      res.redirect("/");

    })
    .catch((err)=>{
      next(err);
    });
});




module.exports = router;
