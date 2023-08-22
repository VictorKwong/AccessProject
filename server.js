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
        },
        sum: function(a, b) {
            return a + b;
        },
        addCommas: function(num) {
            return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        },
        toAbbr: function(number, precision) {
            precision = 3;
            number = Number(number);
   
            // 2 decimal places => 100, 3 => 1000, etc.
            precision = Math.pow(10, precision);
            var abbr = ['k', 'm', 'b', 't', 'q'];
            var len = abbr.length - 1;
          
            while (len >= 0) {
              var size = Math.pow(10, (len + 1) * 3);
              if (size <= (number + 1)) {
                number = Math.round(number * precision / size) / precision;
                number += abbr[len];
                break;
              }
              len--;
            }
            return number;
        },
        calDuration: function(startTime, duration) {
            const dateNow = Math.floor(Date.now() / 1000);
            return (duration - (dateNow - startTime));
        },
        produceStatus: function(){

        }
        
    },
    // partialsDir: path.join(__dirname, "/views/partials/"),
    layoutsDir: path.join(__dirname, "/views/layouts/")
 }));

 //Image plug
 app.use(express.static("images"));

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
        // data: req.session.user,
        // Resource: req.session.user.Resource,
        // IronMine: req.session.user.IronMine,
        // IronStorage: req.session.user.IronStorage,
        // CrystalMine: req.session.user.CrystalMine,
        // CrystalStorage: req.session.user.CrystalStorage,
        // PetroleumMine: req.session.user.PetroleumMine,
        // PetroleumStorage: req.session.user.PetroleumStorage,
        // ItemBag: req.session.user.ItemBag
    });
});

app.get("/login", function(req,res){
    res.render('login');
});

app.post("/login", function(req, res) {
    return new Promise((resolve, reject) => {
        authData.loginAccount(req.body).then((user) => {
            req.session.user = {
                _id: user._id,
                userName: user.userName,
                displayName: user.displayName,
                loginBonus: user.loginBonus,
                rewardDate: user.rewardDate,
                rewardCollect: user.rewardCollect,
                previousCollectTime: user.previousCollectTime,
                Resource: {
                    Iron: user.Resource.Iron,
                    Crystal: user.Resource.Crystal,
                    Petroleum: user.Resource.Petroleum,
                },
                Pet:{
                    name: user.Pet.name,
                    level: user.Pet.level,
                    experience: user.Pet.experience,
                    maxHealth: user.Pet.maxHealth,
                    currentHealth: user.Pet.currentHealth,
                    strength: user.Pet.strength,
                    dexterity: user.Pet.dexterity,
                    intelligence: user.Pet.intelligence,
                },
                IronMine: {
                    "Name": user.IronMine.Name,
                    "Level": user.IronMine.Level,
                    "ProduceRate": user.IronMine.ProduceRate,
                    "Capacity": user.IronMine.Capacity,
                    "CollectedResource": user.IronMine.CollectedResource,
                    "HistoryCollectedResource": user.IronMine.HistoryCollectedResource,
                    "UpgradeCost_Iron": user.IronMine.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.IronMine.UpgradeCost_Crystal,
                    "UpgradeCost_Time": user.IronMine.UpgradeCost_Time,
                    "UpgradeCost_TimeStart": user.IronMine.UpgradeCost_TimeStart,
                    "UpgradeCost_Status": user.IronMine.UpgradeCost_Status
                },
                IronStorage: {
                    "Name": user.IronStorage.Name,
                    "Level": user.IronStorage.Level,
                    "Capacity": user.IronStorage.Capacity,
                    "UpgradeCost_Iron": user.IronStorage.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.IronStorage.UpgradeCost_Crystal
                },
                CrystalMine: {
                    "Name": user.CrystalMine.Name,
                    "Level": user.CrystalMine.Level,
                    "ProduceRate": user.CrystalMine.ProduceRate,
                    "UpgradeCost_Iron": user.CrystalMine.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.CrystalMine.UpgradeCost_Crystal
                },
                CrystalStorage: {
                    "Name": user.CrystalStorage.Name,
                    "Level": user.CrystalStorage.Level,
                    "Capacity": user.CrystalStorage.Capacity,
                    "UpgradeCost_Iron": user.CrystalStorage.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.CrystalStorage.UpgradeCost_Crystal
                },
                PetroleumMine: {
                    "Name": user.PetroleumMine.Name,
                    "Level": user.PetroleumMine.Level,
                    "ProduceRate": user.PetroleumMine.ProduceRate,
                    "UpgradeCost_Iron": user.PetroleumMine.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.PetroleumMine.UpgradeCost_Crystal
                },
                PetroleumStorage: {
                    "Name": user.PetroleumStorage.Name,
                    "Level": user.PetroleumStorage.Level,
                    "Capacity": user.PetroleumStorage.Capacity,
                    "UpgradeCost_Iron": user.PetroleumStorage.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.PetroleumStorage.UpgradeCost_Crystal
                },
                ItemBag: {
                    Resource : {
                        "Iron1000" : { "Name": user.ItemBag.Resource.Iron1000.Name, "Amount": user.ItemBag.Resource.Iron1000.Amount },
                        "Crystal1000" : { "Name": user.ItemBag.Resource.Crystal1000.Name, "Amount": user.ItemBag.Resource.Crystal1000.Amount },
                        "Petroleum200" : { "Name": user.ItemBag.Resource.Petroleum200.Name, "Amount": user.ItemBag.Resource.Petroleum200.Amount }
                    },
                    Materials : {
                        "TextileFibers" : { "Name": user.ItemBag.Materials.TextileFibers.Name, "Amount": user.ItemBag.Materials.TextileFibers.Amount },
                        "CarbonSteel" : { "Name": user.ItemBag.Materials.CarbonSteel.Name, "Amount": user.ItemBag.Materials.CarbonSteel.Amount }
                    }
                },
                Achievement: {
                    Resource : {
                        "FirstCollect" : {
                            "Name": user.Achievement.Resource.FirstCollect.Name,
                            "Bool": user.Achievement.Resource.FirstCollect.Bool,
                            "Description": user.Achievement.Resource.FirstCollect.Description
                        },
                        "Bonus": user.Achievement.Resource.Bonus,
                    }
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
    return new Promise((resolve, reject) => {
        authData.refreshAccount(req.session.user).then((user) => {
            req.session.user = {
                _id: user._id,
                userName: user.userName,
                displayName: user.displayName,
                loginBonus: user.loginBonus,
                rewardDate: user.rewardDate,
                rewardCollect: user.rewardCollect,
                previousCollectTime: user.previousCollectTime,
                Resource: {
                    Iron: user.Resource.Iron,
                    Crystal: user.Resource.Crystal,
                    Petroleum: user.Resource.Petroleum,
                },
                Pet:{
                    name: user.Pet.name,
                    level: user.Pet.level,
                    experience: user.Pet.experience,
                    maxHealth: user.Pet.maxHealth,
                    currentHealth: user.Pet.currentHealth,
                    strength: user.Pet.strength,
                    dexterity: user.Pet.dexterity,
                    intelligence: user.Pet.intelligence,
                },
                IronMine: {
                    "Name": user.IronMine.Name,
                    "Level": user.IronMine.Level,
                    "ProduceRate": user.IronMine.ProduceRate,
                    "Capacity": user.IronMine.Capacity,
                    "CollectedResource": user.IronMine.CollectedResource,
                    "HistoryCollectedResource": user.IronMine.HistoryCollectedResource,
                    "UpgradeCost_Iron": user.IronMine.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.IronMine.UpgradeCost_Crystal,
                    "UpgradeCost_Time": user.IronMine.UpgradeCost_Time,
                    "UpgradeCost_TimeStart": user.IronMine.UpgradeCost_TimeStart,
                    "UpgradeCost_Status": user.IronMine.UpgradeCost_Status
                },
                IronStorage: {
                    "Name": user.IronStorage.Name,
                    "Level": user.IronStorage.Level,
                    "Capacity": user.IronStorage.Capacity,
                    "UpgradeCost_Iron": user.IronStorage.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.IronStorage.UpgradeCost_Crystal
                },
                CrystalMine: {
                    "Name": user.CrystalMine.Name,
                    "Level": user.CrystalMine.Level,
                    "ProduceRate": user.CrystalMine.ProduceRate,
                    "UpgradeCost_Iron": user.CrystalMine.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.CrystalMine.UpgradeCost_Crystal
                },
                CrystalStorage: {
                    "Name": user.CrystalStorage.Name,
                    "Level": user.CrystalStorage.Level,
                    "Capacity": user.CrystalStorage.Capacity,
                    "UpgradeCost_Iron": user.CrystalStorage.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.CrystalStorage.UpgradeCost_Crystal
                },
                PetroleumMine: {
                    "Name": user.PetroleumMine.Name,
                    "Level": user.PetroleumMine.Level,
                    "ProduceRate": user.PetroleumMine.ProduceRate,
                    "UpgradeCost_Iron": user.PetroleumMine.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.PetroleumMine.UpgradeCost_Crystal
                },
                PetroleumStorage: {
                    "Name": user.PetroleumStorage.Name,
                    "Level": user.PetroleumStorage.Level,
                    "Capacity": user.PetroleumStorage.Capacity,
                    "UpgradeCost_Iron": user.PetroleumStorage.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.PetroleumStorage.UpgradeCost_Crystal
                },
                ItemBag: {
                    Resource : {
                        "Iron1000" : { "Name": user.ItemBag.Resource.Iron1000.Name, "Amount": user.ItemBag.Resource.Iron1000.Amount },
                        "Crystal1000" : { "Name": user.ItemBag.Resource.Crystal1000.Name, "Amount": user.ItemBag.Resource.Crystal1000.Amount },
                        "Petroleum200" : { "Name": user.ItemBag.Resource.Petroleum200.Name, "Amount": user.ItemBag.Resource.Petroleum200.Amount }
                    },
                    Materials : {
                        "TextileFibers" : { "Name": user.ItemBag.Materials.TextileFibers.Name, "Amount": user.ItemBag.Materials.TextileFibers.Amount },
                        "CarbonSteel" : { "Name": user.ItemBag.Materials.CarbonSteel.Name, "Amount": user.ItemBag.Materials.CarbonSteel.Amount }
                    }
                },
                Achievement: {
                    Resource : {
                        "FirstCollect" : {
                            "Name": user.Achievement.Resource.FirstCollect.Name,
                            "Bool": user.Achievement.Resource.FirstCollect.Bool,
                            "Description": user.Achievement.Resource.FirstCollect.Description
                        },
                        "Bonus": user.Achievement.Resource.Bonus,
                    }
                }
            }
            res.render('account', {
                data: req.session.user,
                Resource: req.session.user.Resource,
                Pet: req.session.user.Pet,
                IronMine: req.session.user.IronMine,
                IronStorage: req.session.user.IronStorage,
                CrystalMine: req.session.user.CrystalMine,
                CrystalStorage: req.session.user.CrystalStorage,
                PetroleumMine: req.session.user.PetroleumMine,
                PetroleumStorage: req.session.user.PetroleumStorage,
                ItemBag : req.session.user.ItemBag,
                Achievement: req.session.user.Achievement
            });
        }).catch((err) => {
            res.render('login', {errorMessage: err, userName: req.session.user.userName});
        })
    })
})

/*Upgrade*/
app.post("/account/:upgrade", ensureLogin, function(req, res) {
    if(req.params.upgrade === "claimDailyReward"){
        return new Promise((resolve, reject) => {
            authData.claimDailyReward(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum
                req.session.user.loginBonus = user.loginBonus
                
                res.render('account', {
                    data: req.session.user,
                    Resource: req.session.user.Resource,
                    Pet: req.session.user.Pet,
                    IronMine: req.session.user.IronMine,
                    IronStorage: req.session.user.IronStorage,
                    CrystalMine: req.session.user.CrystalMine,
                    CrystalStorage: req.session.user.CrystalStorage,
                    PetroleumMine: req.session.user.PetroleumMine,
                    PetroleumStorage: req.session.user.PetroleumStorage,
                    ItemBag: req.session.user.ItemBag,
                    Achievement: req.session.user.Achievement,
                    successMessage: "Daily Reward Claimed! Iron +" + 7000 * user.loginBonus +", Crystal +" + 7000 * user.loginBonus + ", Petroleum +" + 3500 * user.loginBonus
                })
            }).catch((err) => {
                res.render('account', {
                    data: req.session.user,
                    Resource: req.session.user.Resource,
                    Pet: req.session.user.Pet,
                    IronMine: req.session.user.IronMine,
                    IronStorage: req.session.user.IronStorage,
                    CrystalMine: req.session.user.CrystalMine,
                    CrystalStorage: req.session.user.CrystalStorage,
                    PetroleumMine: req.session.user.PetroleumMine,
                    PetroleumStorage: req.session.user.PetroleumStorage,
                    ItemBag: req.session.user.ItemBag,
                    Achievement: req.session.user.Achievement,
                    errorMessage: err
                })
            })
        })
    }else if(req.params.upgrade === "collectAllResource"){
        return new Promise((resolve, reject) => {
            authData.collectAllResource(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum
                
                
                res.render('account', {
                    data: req.session.user,
                    Resource: req.session.user.Resource,
                    Pet: req.session.user.Pet,
                    IronMine: req.session.user.IronMine,
                    IronStorage: req.session.user.IronStorage,
                    CrystalMine: req.session.user.CrystalMine,
                    CrystalStorage: req.session.user.CrystalStorage,
                    PetroleumMine: req.session.user.PetroleumMine,
                    PetroleumStorage: req.session.user.PetroleumStorage,
                    ItemBag: req.session.user.ItemBag,
                    Achievement: req.session.user.Achievement,
                    successMessage: "Collect all Resource! Iron +" + user.IronMine.CollectedResource
                })
            }).catch((err) => {

                res.render('account', {
                    data: req.session.user,
                    Resource: req.session.user.Resource,
                    Pet: req.session.user.Pet,
                    IronMine: req.session.user.IronMine,
                    IronStorage: req.session.user.IronStorage,
                    CrystalMine: req.session.user.CrystalMine,
                    CrystalStorage: req.session.user.CrystalStorage,
                    PetroleumMine: req.session.user.PetroleumMine,
                    PetroleumStorage: req.session.user.PetroleumStorage,
                    ItemBag: req.session.user.ItemBag,
                    Achievement: req.session.user.Achievement,
                    errorMessage: err
                })
            })
        })
    }else if(req.params.upgrade === "upgradeIronMine"){
        return new Promise((resolve, reject) => {
            authData.upgradeIronMine(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum

                req.session.user.IronMine.Level = user.IronMine.Level
                req.session.user.IronMine.ProduceRate = user.IronMine.ProduceRate
                req.session.user.IronMine.UpgradeCost_Iron = user.IronMine.UpgradeCost_Iron
                req.session.user.IronMine.UpgradeCost_Crystal = user.IronMine.UpgradeCost_Crystal
                
                res.redirect('/account')
            }).catch((err) => {
                res.render('account', {
                    data: req.session.user,
                    Resource: req.session.user.Resource,
                    Pet: req.session.user.Pet,
                    IronMine: req.session.user.IronMine,
                    IronStorage: req.session.user.IronStorage,
                    CrystalMine: req.session.user.CrystalMine,
                    CrystalStorage: req.session.user.CrystalStorage,
                    PetroleumMine: req.session.user.PetroleumMine,
                    PetroleumStorage: req.session.user.PetroleumStorage,
                    ItemBag: req.session.user.ItemBag,
                    Achievement: req.session.user.Achievement,
                    errorMessage: err
                })
            })
        })
    }else if(req.params.upgrade === "upgradeCrystalMine"){
        return new Promise((resolve, reject) => {
            authData.upgradeCrystalMine(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum

                req.session.user.CrystalMine.Level = user.CrystalMine.Level
                req.session.user.CrystalMine.ProduceRate = user.CrystalMine.ProduceRate
                req.session.user.CrystalMine.UpgradeCost_Iron = user.CrystalMine.UpgradeCost_Iron
                req.session.user.CrystalMine.UpgradeCost_Crystal = user.CrystalMine.UpgradeCost_Crystal
                res.redirect('/account')
            }).catch((err) => {
                res.render('account', {
                    data: req.session.user,
                    Resource: req.session.user.Resource,
                    Pet: req.session.user.Pet,
                    IronMine: req.session.user.IronMine,
                    IronStorage: req.session.user.IronStorage,
                    CrystalMine: req.session.user.CrystalMine,
                    CrystalStorage: req.session.user.CrystalStorage,
                    PetroleumMine: req.session.user.PetroleumMine,
                    PetroleumStorage: req.session.user.PetroleumStorage,
                    ItemBag: req.session.user.ItemBag,
                    Achievement: req.session.user.Achievement,
                    errorMessage: err
                })
            })
        })
    }else if(req.params.upgrade === "upgradePetroleumMine"){
        return new Promise((resolve, reject) => {
            authData.upgradePetroleumMine(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum

                req.session.user.PetroleumMine.Level = user.PetroleumMine.Level
                req.session.user.PetroleumMine.ProduceRate = user.PetroleumMine.ProduceRate
                req.session.user.PetroleumMine.UpgradeCost_Iron = user.PetroleumMine.UpgradeCost_Iron
                req.session.user.PetroleumMine.UpgradeCost_Crystal = user.PetroleumMine.UpgradeCost_Crystal
                res.redirect('/account')
            }).catch((err) => {
                res.render('account', {
                    data: req.session.user,
                    Resource: req.session.user.Resource,
                    Pet: req.session.user.Pet,
                    IronMine: req.session.user.IronMine,
                    IronStorage: req.session.user.IronStorage,
                    CrystalMine: req.session.user.CrystalMine,
                    CrystalStorage: req.session.user.CrystalStorage,
                    PetroleumMine: req.session.user.PetroleumMine,
                    PetroleumStorage: req.session.user.PetroleumStorage,
                    ItemBag: req.session.user.ItemBag,
                    Achievement: req.session.user.Achievement,
                    errorMessage: err
                })
            })
        })
    }else if(req.params.upgrade === "upgradeIronStorage"){
        return new Promise((resolve, reject) => {
            authData.upgradeIronStorage(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum

                req.session.user.IronStorage.Level = user.IronStorage.Level
                req.session.user.IronStorage.Capacity = user.IronStorage.Capacity
                req.session.user.IronStorage.UpgradeCost_Iron = user.IronStorage.UpgradeCost_Iron
                req.session.user.IronStorage.UpgradeCost_Crystal = user.IronStorage.UpgradeCost_Crystal
                res.redirect('/account')
            }).catch((err) => {
                res.render('account', {
                    data: req.session.user,
                    Resource: req.session.user.Resource,
                    Pet: req.session.user.Pet,
                    IronMine: req.session.user.IronMine,
                    IronStorage: req.session.user.IronStorage,
                    CrystalMine: req.session.user.CrystalMine,
                    CrystalStorage: req.session.user.CrystalStorage,
                    PetroleumMine: req.session.user.PetroleumMine,
                    PetroleumStorage: req.session.user.PetroleumStorage,
                    ItemBag: req.session.user.ItemBag,
                    Achievement: req.session.user.Achievement,
                    errorMessage: err
                })
            })
        })
    }else if(req.params.upgrade === "upgradeCrystalStorage"){
        return new Promise((resolve, reject) => {
            authData.upgradeCrystalStorage(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum

                req.session.user.CrystalStorage.Level = user.CrystalStorage.Level
                req.session.user.CrystalStorage.Capacity = user.CrystalStorage.Capacity
                req.session.user.CrystalStorage.UpgradeCost_Iron = user.CrystalStorage.UpgradeCost_Iron
                req.session.user.CrystalStorage.UpgradeCost_Crystal = user.CrystalStorage.UpgradeCost_Crystal
                res.redirect('/account')
            }).catch((err) => {
                res.render('account', {
                    data: req.session.user,
                    Resource: req.session.user.Resource,
                    Pet: req.session.user.Pet,
                    IronMine: req.session.user.IronMine,
                    IronStorage: req.session.user.IronStorage,
                    CrystalMine: req.session.user.CrystalMine,
                    CrystalStorage: req.session.user.CrystalStorage,
                    PetroleumMine: req.session.user.PetroleumMine,
                    PetroleumStorage: req.session.user.PetroleumStorage,
                    ItemBag: req.session.user.ItemBag,
                    Achievement: req.session.user.Achievement,
                    errorMessage: err
                })
            })
        })
    }else if(req.params.upgrade === "upgradePetroleumStorage"){
        return new Promise((resolve, reject) => {
            authData.upgradePetroleumStorage(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum

                req.session.user.PetroleumStorage.Level = user.PetroleumStorage.Level
                req.session.user.PetroleumStorage.Capacity = user.PetroleumStorage.Capacity
                req.session.user.PetroleumStorage.UpgradeCost_Iron = user.PetroleumStorage.UpgradeCost_Iron
                req.session.user.PetroleumStorage.UpgradeCost_Crystal = user.PetroleumStorage.UpgradeCost_Crystal
                res.redirect('/account')
            }).catch((err) => {
                res.render('account', {
                    data: req.session.user,
                    Resource: req.session.user.Resource,
                    Pet: req.session.user.Pet,
                    IronMine: req.session.user.IronMine,
                    IronStorage: req.session.user.IronStorage,
                    CrystalMine: req.session.user.CrystalMine,
                    CrystalStorage: req.session.user.CrystalStorage,
                    PetroleumMine: req.session.user.PetroleumMine,
                    PetroleumStorage: req.session.user.PetroleumStorage,
                    ItemBag: req.session.user.ItemBag,
                    Achievement: req.session.user.Achievement,
                    errorMessage: err
                })
            })
        })
    }
})


app.get("/information", ensureLogin, function(req,res){
    res.render("information", {
        data: req.session.user,
        Resource: req.session.user.Resource,
        Pet: req.session.user.Pet,
        IronMine: req.session.user.IronMine,
        IronStorage: req.session.user.IronStorage,
        CrystalMine: req.session.user.CrystalMine,
        CrystalStorage: req.session.user.CrystalStorage,
        PetroleumMine: req.session.user.PetroleumMine,
        PetroleumStorage: req.session.user.PetroleumStorage,
        ItemBag: req.session.user.ItemBag,
        Achievement: req.session.user.Achievement});
})

app.get("/Pet", ensureLogin, function(req,res){
    res.render("pet", {
        data: req.session.user,
        Resource: req.session.user.Resource,
        Pet: req.session.user.Pet,
        IronMine: req.session.user.IronMine,
        IronStorage: req.session.user.IronStorage,
        CrystalMine: req.session.user.CrystalMine,
        CrystalStorage: req.session.user.CrystalStorage,
        PetroleumMine: req.session.user.PetroleumMine,
        PetroleumStorage: req.session.user.PetroleumStorage,
        ItemBag: req.session.user.ItemBag,
        Achievement: req.session.user.Achievement});
})

app.post("/information", function(req, res) {
    if(req.body.displayName === undefined && req.body.password === undefined && req.body.newPassword === undefined && req.body.confirmNewPassword === undefined){
        //reset
        authData.resetAccount(req.session.user).then(function(user){
            req.session.user = {
                _id: user._id,
                userName: user.userName,
                displayName: user.displayName,
                loginBonus: user.loginBonus,
                rewardDate: user.rewardDate,
                rewardCollect: user.rewardCollect,
                previousCollectTime: user.previousCollectTime,
                Resource: {
                    Iron: user.Resource.Iron,
                    Crystal: user.Resource.Crystal,
                    Petroleum: user.Resource.Petroleum,
                },
                Pet:{
                    name: user.Pet.name,
                    level: user.Pet.level,
                    experience: user.Pet.experience,
                    maxHealth: user.Pet.maxHealth,
                    currentHealth: user.Pet.currentHealth,
                    strength: user.Pet.strength,
                    dexterity: user.Pet.dexterity,
                    intelligence: user.Pet.intelligence,
                },
                IronMine: {
                    "Name": user.IronMine.Name,
                    "Level": user.IronMine.Level,
                    "ProduceRate": user.IronMine.ProduceRate,
                    "Capacity": user.IronMine.Capacity,
                    "CollectedResource": user.IronMine.CollectedResource,
                    "HistoryCollectedResource": user.IronMine.HistoryCollectedResource,
                    "UpgradeCost_Iron": user.IronMine.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.IronMine.UpgradeCost_Crystal,
                    "UpgradeCost_Time": user.IronMine.UpgradeCost_Time,
                    "UpgradeCost_TimeStart": user.IronMine.UpgradeCost_TimeStart,
                    "UpgradeCost_Status": user.IronMine.UpgradeCost_Status
                },
                IronStorage: {
                    "Name": user.IronStorage.Name,
                    "Level": user.IronStorage.Level,
                    "Capacity": user.IronStorage.Capacity,
                    "UpgradeCost_Iron": user.IronStorage.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.IronStorage.UpgradeCost_Crystal
                },
                CrystalMine: {
                    "Name": user.CrystalMine.Name,
                    "Level": user.CrystalMine.Level,
                    "ProduceRate": user.CrystalMine.ProduceRate,
                    "UpgradeCost_Iron": user.CrystalMine.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.CrystalMine.UpgradeCost_Crystal
                },
                CrystalStorage: {
                    "Name": user.CrystalStorage.Name,
                    "Level": user.CrystalStorage.Level,
                    "Capacity": user.CrystalStorage.Capacity,
                    "UpgradeCost_Iron": user.CrystalStorage.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.CrystalStorage.UpgradeCost_Crystal
                },
                PetroleumMine: {
                    "Name": user.PetroleumMine.Name,
                    "Level": user.PetroleumMine.Level,
                    "ProduceRate": user.PetroleumMine.ProduceRate,
                    "UpgradeCost_Iron": user.PetroleumMine.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.PetroleumMine.UpgradeCost_Crystal
                },
                PetroleumStorage: {
                    "Name": user.PetroleumStorage.Name,
                    "Level": user.PetroleumStorage.Level,
                    "Capacity": user.PetroleumStorage.Capacity,
                    "UpgradeCost_Iron": user.PetroleumStorage.UpgradeCost_Iron,
                    "UpgradeCost_Crystal": user.PetroleumStorage.UpgradeCost_Crystal
                },
                ItemBag: {
                    Resource : {
                        "Iron1000" : { "Name": user.ItemBag.Resource.Iron1000.Name, "Amount": user.ItemBag.Resource.Iron1000.Amount },
                        "Crystal1000" : { "Name": user.ItemBag.Resource.Crystal1000.Name, "Amount": user.ItemBag.Resource.Crystal1000.Amount },
                        "Petroleum200" : { "Name": user.ItemBag.Resource.Petroleum200.Name, "Amount": user.ItemBag.Resource.Petroleum200.Amount }
                    },
                    Materials : {
                        "TextileFibers" : { "Name": user.ItemBag.Materials.TextileFibers.Name, "Amount": user.ItemBag.Materials.TextileFibers.Amount },
                        "CarbonSteel" : { "Name": user.ItemBag.Materials.CarbonSteel.Name, "Amount": user.ItemBag.Materials.CarbonSteel.Amount }
                    }
                },
                Achievement: {
                    Resource : {
                        "FirstCollect" : {
                            "Name": user.Achievement.Resource.FirstCollect.Name,
                            "Bool": user.Achievement.Resource.FirstCollect.Bool,
                            "Description": user.Achievement.Resource.FirstCollect.Description
                        },
                        "Bonus": user.Achievement.Resource.Bonus,
                    }
                }
            }
            res.render("information", {
                data: req.session.user,
                Resource: req.session.user.Resource,
                Pet: req.session.user.Pet,
                IronMine: req.session.user.IronMine,
                IronStorage: req.session.user.IronStorage,
                CrystalMine: req.session.user.CrystalMine,
                CrystalStorage: req.session.user.CrystalStorage,
                PetroleumMine: req.session.user.PetroleumMine,
                PetroleumStorage: req.session.user.PetroleumStorage,
                ItemBag: req.session.user.ItemBag,
                Achievement: req.session.user.Achievement,
                successMessage: "Successful reset account!"
            });
        })
        .catch(function(err){
            res.render('information', {errorMessage: err, userName: req.session.user.userName});
        });
    }
    else if(req.body.displayName === undefined){
        //change password - can be the same
        authData.changePasswordAccount(req.body, req.session.user._id, req.session.user.userName).then(function(data){
            res.render('information', {successMessage: "Successful change Password!"});
        })
        .catch(function(err){
            res.render('information', {errorMessage: err, userName: req.session.user.userName});
        });
    }else{
        //change displayName
        
        authData.changeDisplayNameAccount(req.body, req.session.user._id, req.session.user.userName).then(function(data){
            req.session.user.displayName = data.displayName;
            res.render('information', {successMessage: "Successful change name!"});
        })
        .catch(function(err){
            res.render('information', {errorMessage: err, userName: req.session.user.userName});
        });
    }

});

app.get('/logout', function(req, res){
    authData.refreshAccount(req.session.user).then(function(data){
        req.session.reset();
        res.redirect('/');
    })
    .catch(function(err){
        res.render('login', {errorMessage: err, userName: req.session.user.userName});
    });
})


blogService.initialize()
.then(authData.initialize)
.then(function() {
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    console.log(err);
})