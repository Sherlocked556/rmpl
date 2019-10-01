var express=require('express'),
    app=express(),
    expressSession=require("express-session");
    server=require('http').createServer(app),
    io=require('socket.io').listen(server);
    app.set("view engine","ejs");
    router.use(expressSession({
        secret: 'sab ladkiyan rajput ki behen hai',
        resave: true,
        saveUninitialized: true
      }));
users=[];
connections=[];
app.listen(process.env.PORT||5000);
console.log("server");
app.get("/",(req,res)=>{
res.render("index");
});
io.sockets.on('connection',(socket)=>{
    connections.push(socket);
    console.log("connected: %s sockets connected",connections.length);

    connections.splice(connections.indexOf(socket),1);
    console.log("Disconnected: %s sockets connected",connections.length);
})
router.post('/login', function (req, res) {
    if(req.body.email.includes('@')){
      res.redirect(307, '/in/login');
    } else {
      res.redirect(307, '/help/login');
    }
  });
router.post("/login",(req,res)=>{
    var uname=req.body.email;
    var pass=req.body.password;
   
    if(req.params.type=='help')
    {
      Help.findOne({usernam:uname},(err,found)=>{
        if (err||found==null) {
          res.send("user not found"+uname+pass);
        } else {
          var hash=found.password;
          if (crypto.createHash('md5').update(pass).digest("hex") == hash) {
            req.session.eventdetails = found;
            req.session.loggedin=true;
            res.redirect('/help/dashboard');
          } else {
            req.session.loginerror = 'Wrong password help xD'
            console.log("here");
            res.redirect('/login');            }
        }
        
      }) 
     
    }
    else if(req.params.type=='in'){
      In.findOne({username:uname},(err,found)=>{
        if (err) {
          res.send("not found");
        } else {
          var hash=found.password;
          console.log(hash);
          console.log(found.name);
       if (crypto.createHash('md5').update(pass).digest("hex") == hash) {
         req.session.eventdetails = found;
         req.session.loggedin=true;
         res.redirect('/in/'+found.name+'/dashboard');
       } else {
         req.session.loginerror = 'Wrong password in xD'
         res.redirect('/login');            }
        }
        
     }) 
    }
    else{
      res.redirect("/");
    }
  });
  function isLoggedin(req,res,next){
    if(req.session.loggedin==true){
    next();}
    else{
      res.redirect("/login");
    }
  }
  router.get('/in/create/', function (req, res) {
    var inte = req.query
    for (var keys in inte) {
      if (inte[keys] == undefined || inte[keys] == '') {
        var incomplete = keys;
        break;
      }
    }
    if (incomplete != undefined) {
      res.send('Some parameters are missing including ' + incomplete.toUpperCase());
    } else {
      
      inte['queue'] = [];
      inte['password'] = crypto.createHash('md5').update(req.query.password).digest("hex");
      
      In.create(inte, (err, createdEvent) => {
        if (err) {
          console.log(err);
        } else {
          res.send('Interviewee saved successfully');
        }
      })
    }
  })