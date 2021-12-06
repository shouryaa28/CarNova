const express = require('express');
const passport = require('passport');
const router = express.Router();
const localStrategy=require('passport-local')
const userModel=require('./users')
const carModel=require('./carSchema')
const multer=require('multer');
const { populate } = require('./users');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/',redirectToProfile,function(req,res) {
  res.render('index',{isLoggedInval: false});
});


router.post('/reg', function(req,res){
  var data=new userModel({
    name: req.body.name,
    email:req.body.email,
    username:req.body.username
  })
  userModel.register(data,req.body.password)
  .then(function(u){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile');
    })
  })
});
 
router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/'
}),function(req,res,next){});


router.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});

router.get('/profile',isLoggedIn, function(req,res){
  userModel.findOne({username:req.session.passport.user})
  .populate('cars')
  .exec(function(err,foundUser){
    console.log(foundUser)
    res.render('profile',{foundUser, isLoggedInval:true});
  })
});


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/');
}


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads/')
  },
  filename: function (req, file, cb) {
    var filenaam=Math.floor(Math.random()*100000);
    filenaam=filenaam+ file.originalname;
    cb(null, filenaam)
  }
})

function fileFilterfnc(req,file,cb){
  if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg')
  cb(null,true)
  else cb(null,false)
}
var upload = multer({ storage: storage,fileFilter: fileFilterfnc })



router.post('/upload',upload.single('image'),function(req,res){
  userModel.findOne({username: req.session.passport.user})
  .then(function(foundUser){
    foundUser.profileImage = `../images/uploads/${req.file.filename}`
    foundUser.save().then(function(savedUser){
      res.redirect('/profile');
    })
  })
})


router.post('/addcar',isLoggedIn, upload.single('fileimg'),function(req,res){
  userModel.findOne({username: req.session.passport.user})
  .then(function(loggedinuser){
    console.log(loggedinuser)
    var carImgAddress=`../images/uploads/${req.file.filename}`;
    carModel.create({
      sellerid :  loggedinuser._id,
      carname  :  req.body.carsname,
      carprice :  req.body.carsprice,
      contact  :  req.body.contact,
      carimg   :  carImgAddress
    }).then(function(createdCar){
      loggedinuser.cars.push(createdCar);
      loggedinuser.save().then(function(){
        res.redirect('/profile');
      })
    })
  })
})


router.get('/sell/:page',isLoggedIn, function(req,res){
  var perPage = 3
  , page = Math.max(0, req.param('page'))
carModel.find()
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, cars) {
        carModel.count().exec(function(err, count) {
            res.render('sellingapp', {
                cars: cars,
                page: page,
                pages: count / perPage,
                isLoggedInval: true
                //Math.seal() se max value aati h
            })
        })
    })
})

function redirectToProfile(req,res,next){
  if(req.isAuthenticated()) res.redirect('/profile');
  return next();
}

module.exports = router;
