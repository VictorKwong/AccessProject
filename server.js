var express = require("express");
var path = require("path");
const exphbs = require('express-handlebars');
var clientSessions = require('client-sessions');


var app = express();
var blogService = require('./blog-service.js');
var authData = require('./auth-service.js');

var HTTP_PORT = process.env.PORT || 8080;


//express-handlebars
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: { 
        strong: function(options){
            return '<strong>' + options.fn(this) + '</strong>';
        },
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '" class="btn btn-primary">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        safeHTML: function(context){
            return stripJs(context);
        },
        formatDate: function(dateObj){
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString();
            let day = dateObj.getDate().toString();
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
        }
        
    },
    // partialsDir: path.join(__dirname, "/views/partials/"),
    layoutsDir: path.join(__dirname, "/views/layouts/")
 }));

 app.set('view engine', '.hbs');

 app.use("/public", express.static(path.join(__dirname, "/public")));

 app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

 app.use(clientSessions({
    cookieName: "session",
    secret: "nightCodeActionRequired",
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(express.urlencoded({extended: true}));

function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
}


function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function(req,res){
    res.render('index', {
        // data: someData,
    });
});

app.get("/login", function(req,res){
    res.render('login');
});

app.post("/login", function(req, res) {
    return new Promise((resolve, reject) => {
        authData.loginAccount(req.body).then((user) => {
            req.session.user = {
                userName: user.userName,
                Actor: {
                    Iron: user.Actor.Iron,
                    Crystal: user.Actor.Crystal,
                    Petroleum: user.Actor.Petroleum,
                },
                IronMine_1: {
                    "Name": user.IronMine_1.Name,
                    "Level": user.IronMine_1.Level,
                    "ProduceRate": user.IronMine_1.ProduceRate,
                    "Capacity": user.IronMine_1.Capacity,
                    "UpgradeCost": user.IronMine_1.UpgradeCost
                }
            }
            res.redirect('/information');
        }).catch((err) => {
            res.render('login', {errorMessage: err, userName: req.body.userName});
        })
    })    
})


app.get("/register", function(req,res){
    res.render('register');
});

app.post("/register", function(req, res) {
    authData.registerAccount(req.body).then(function(data){
        res.render('register', {successMessage: "User created"});
    })
    .catch(function(err){
        res.render('register', {errorMessage: err, userName: req.body.userName});
    });
});

app.get("/account", ensureLogin, function(req,res){
    res.render('account', {
        data: req.session.user,
        Actor: req.session.user.Actor,
        IronMine_1: req.session.user.IronMine_1
    });
})

app.get("/information", ensureLogin, function(req,res){
    res.render("information");
})

app.get('/logout', function(req, res){
    req.session.reset();
    res.redirect('/');
})


blogService.initialize()
.then(authData.initialize)
.then(function() {
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    console.log(err);
})