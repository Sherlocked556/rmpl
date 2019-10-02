var express=require('express'),
    app=express(),
    path=require('path'),
    expressSession=require("express-session");
    router = express.Router(),
    mongoose=require('mongoose'),
    server=require('http').createServer(app),
    io=require('socket.io').listen(server);
    app.set("view engine","ejs");
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));
   mongoose.connect("mongodb+srv://severus:jcb@cluster0-ewize.mongodb.net/test?retryWrites=true&w=majority");
   mongoose.set('useFindAndModify', false);
    router.use(expressSession({
        secret: 'sab ladkiyan rajput ki behen hai',
        resave: true,
        saveUninitialized: true
      }));
  var Book=require("./models/book");
  var Chat=require("./models/chats");
  var User=require("./models/users");
users=[];
connections=[];
app.listen(process.env.PORT||5000);
console.log("server");
app.get("/",(req,res)=>{
  
})
app.get("/:id/home",isLoggedin,(req,res)=>{
res.render("index");
});

router.get("/login",(req,res)=>{
  res.render("landing");
})

router.post("/login",(req,res)=>{
    var uname=req.body.username;
    var pass=req.body.password;
   
    
      User.findOne({username:uname},(err,found)=>{
        if (err||found==null) {
          res.send("user not found"+uname+pass);
        } else {
          var hash=found.password;
          if (crypto.createHash('md5').update(pass).digest("hex") == hash) {
            req.session.eventdetails = found;
            req.session.loggedin=true;
            res.redirect("/"+found.id+"/home");
          } else {
            req.session.loginerror = 'Wrong password xD'
            res.redirect('/login');            }
        }
        
      }) 
  });

  function isLoggedin(req,res,next){
    if(req.session.loggedin==true){
    next();}
    else{
      res.redirect("/login");
    }
  }
  router.post("/register",(req,res)=>{
    var inte = req.body.details;
    if(User.findOne(inte['username'])){
      req.session.loginerror="Username already exists";
      res.redirect("/login");
    }
    else{
    inte['password'] = crypto.createHash('md5').update(req.query.password).digest("hex");
    User.create(inte, (err, created) => {
            if (err) {
              console.log(err);
            } else {
              res.redirect("/"+created.id+"/home");
            }
          })
        }

  });
router.get('/:id/home/add',isLoggedin,(req,res)=>{
  User.findById(req.params.id,(err,found)=>{
    res.render("list",{profile:found});
  })
 
});
router.post('/:id/home/add',isLoggedin,(req,res)=>{
if(Book.findOne({name:req.body.book.name})){
User.findById(req.params.id,(err,found)=>{
  var booking={
    bookname:req.body.book.name,
    genere:req.body.book.genere
  }
found.book.push(booking);
found.save();
})}
else{
  Book.create(req.body.book,(err,found)=>{
    User.findById(req.params.id,(err,found)=>{
      var booking={
        bookname:req.body.book.name,
        genere:req.body.book.genere
      }
    found.book.push(booking);
    found.save();
    })
  })
}
})
router.get("/:id/home/match",(req,res)=>{
    User.findById(req.params.id,(err,found)=>{
      res.render("match",{profile:found});
    })
});
router.post("/:id/home/match/:type",(req,res)=>{
  User.findById(req.params.id,(err,found)=>{
    User.find({location:found.location},(err,matchloc)=>{
      var l=matchloc.length;
      var b=[];
      for (let index = 0; index < l; index++) {
         for (let i = 0; i < matchloc[index].length; i++) {
           
           if(matchloc[index].book[i].bookname==req.params.type)
              b.push(matchloc[index]);
           
         }
        
      }
      
      var obj={
        matches:b
      }
      res.render("match",{profile1:found,profile2:obj})
    })
  })
})
  