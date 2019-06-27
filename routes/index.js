var express = require('express');
var router = express.Router();
const passport=require('passport');
/* GET home page. */
// router.get('/',isLoggedIn, function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/' ,isSession, function(req , res) {
  res.render('index', { title: 'Express' }); 
});

router.get('/profile', isLoggedIn, function(req, res){
  console.log("req.user",req.user)
  res.render('profile.ejs', { user: req.user });
});
router.get('/auth/google' , passport.authenticate('google' , {scope: ['profile' , 'email']}));

router.get('/oauth/google/redirect' , passport.authenticate('google' , { 
  successRedirect: '/profile',
  failureRedirect: '/'
}));
router.get('/auth/facebook' , passport.authenticate('facebook'));

router.get('/auth/facebook/callback' , passport.authenticate('facebook' , { 
  successRedirect: '/profile',
  failureRedirect: '/'
}));

router.get('/logout',function(req,res,next){
    req.logout();
    res.redirect('/');
})
function isLoggedIn(req , res , next) {
  if(req.isAuthenticated()) {
      return  next();
  }
  res.redirect('/');
}
function isSession(req,res,next){
  if(req.isAuthenticated()){
    res.redirect('/profile');
  }else{
    res.render('index', { title: 'Express' });
  }
}

module.exports = router;
