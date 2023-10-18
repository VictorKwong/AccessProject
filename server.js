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
        firstArrayElement: function (array){
            let flag = false;
            for (const obj in array){
                //#Name, Amount
                if(array[obj].Amount){
                    flag = true;
                }
            }
            return flag;
        },
        firstArrayElementName: function (array){
            for (const obj in array){
                if(array[obj].Amount){
                    return array[obj].Name;
                }
            }
            return null;
        },
        firstArrayElementAmount: function (array){
            for (const obj in array){
                if(array[obj].Amount){
                    return array[obj].Amount;
                }
            }
            return null;
        },
        andOperator: function (cond1,cond2){
            let flag = false;
            if(cond1 && cond2){
                flag = true;
            }
            return flag;
        },
        
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
    res.render('index');
});

app.get("/login", function(req,res){
    res.render('login');
});

app.post("/login", function(req, res) {
    return new Promise((resolve, reject) => {
        authData.loginAccount(req.body).then((user) => {
            reqSessionUserData(req,user);
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
            reqSessionUserData(req,user);
            res.render('account', returnRender(req));
        }).catch((err) => {
            res.render('login', {errorMessage: err});
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
                
                res.render('account', returnRender(req,"Daily Reward Claimed! Iron +" + 7000 * user.loginBonus +", Crystal +" + 7000 * user.loginBonus + ", Petroleum +" + 3500 * user.loginBonus));
            }).catch((err) => {
                res.render('account', returnRender(req,undefined,err));
            })
        })
    }else if(req.params.upgrade === "Iron1000"){
        return new Promise((resolve, reject) => {
            authData.iron1000Test(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum
                res.render('account', returnRender(req,"Collect all Resource! Iron +" + user.IronMine.CollectedResource));
            }).catch((err) => {
                res.render('account', returnRender(req,undefined,err));
            })
        })
    }else if(req.params.upgrade === "Reduce100"){
        return new Promise((resolve, resject) => {
            authData.spend100Test(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum
                res.render('account', returnRender(req,"Reduce All Resource 100"));
            }).catch((err) => {
                res.render('account', returnRender(req,undefined,err));
            })
        })
    }else if(req.params.upgrade === "upgradeIronMine"){
        return new Promise((resolve, reject) => {
            authData.upgradeIronMine(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum

                res.redirect('/account')
            }).catch((err) => {
                res.render('account', returnRender(req,undefined,err));
            })
        })
    }else if(req.params.upgrade === "upgradeCrystalMine"){
        return new Promise((resolve, reject) => {
            authData.upgradeCrystalMine(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum

                res.redirect('/account')
            }).catch((err) => {
                res.render('account', returnRender(req,undefined,err));
            })
        })
    }else if(req.params.upgrade === "upgradePetroleumMine"){
        return new Promise((resolve, reject) => {
            authData.upgradePetroleumMine(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum

                res.redirect('/account')
            }).catch((err) => {
                res.render('account', returnRender(req,undefined,err));
            })
        })
    }else if(req.params.upgrade === "upgradeIronStorage"){
        return new Promise((resolve, reject) => {
            authData.upgradeIronStorage(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum

                res.redirect('/account')
            }).catch((err) => {
                res.render('account', returnRender(req,undefined,err));
            })
        })
    }else if(req.params.upgrade === "upgradeCrystalStorage"){
        return new Promise((resolve, reject) => {
            authData.upgradeCrystalStorage(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum

                res.redirect('/account')
            }).catch((err) => {
                res.render('account', returnRender(req,undefined,err));
            })
        })
    }else if(req.params.upgrade === "upgradePetroleumStorage"){
        return new Promise((resolve, reject) => {
            authData.upgradePetroleumStorage(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum

                res.redirect('/account')
            }).catch((err) => {
                res.render('account', returnRender(req,undefined,err));
            })
        })
    }else if(req.params.upgrade === "upgradeTrainingAcademy"){
        return new Promise((resolve, reject) => {
            authData.upgradeTrainingAcademy(req.session.user).then((user) => {
                req.session.user.Resource.Iron = user.Resource.Iron
                req.session.user.Resource.Crystal = user.Resource.Crystal
                req.session.user.Resource.Petroleum = user.Resource.Petroleum

                res.redirect('/account')
            }).catch((err) => {
                res.render('account', returnRender(req,undefined,err));
            })
        })
    }
})


app.get("/information", ensureLogin, function(req,res){
    res.render('information', returnRender(req));
})

app.get("/Pet", ensureLogin, function(req,res){
    res.render('pet', returnRender(req));
})

app.get("/Mission", ensureLogin, function(req,res){
    res.render('mission', returnRender(req));
})


app.post("/information", function(req, res) {
    if(req.body.displayName === undefined && req.body.password === undefined && req.body.newPassword === undefined && req.body.confirmNewPassword === undefined){
        //reset
        authData.resetAccount(req.session.user).then(function(user){
            reqSessionUserData(req,user);
            res.render('account', returnRender(req,"Successful reset account!"));
        })
        .catch(function(err){
            res.render('information', {errorMessage: err});
        });
    }
    else if(req.body.displayName === undefined){
        //change password - can be the same
        authData.changePasswordAccount(req.body, req.session.user._id, req.session.user.userName).then(function(data){
            res.render('information', {successMessage: "Successful change Password!"});
        })
        .catch(function(err){
            res.render('information', {errorMessage: err});
        });
    }else{
        //change displayName
        
        authData.changeDisplayNameAccount(req.body, req.session.user._id, req.session.user.userName).then(function(data){
            req.session.user.displayName = data.displayName;
            res.render('information', {successMessage: "Successful change name!"});
        })
        .catch(function(err){
            res.render('information', {errorMessage: err});
        });
    }

});

app.get('/logout', function(req, res){
    authData.refreshAccount(req.session.user).then(function(data){
        req.session.reset();
        res.redirect('/');
    })
    .catch(function(err){
        res.render('login', {errorMessage: err});
    });
})


blogService.initialize()
.then(authData.initialize)
.then(function() {
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    console.log(err);
})

//Helper function
function reqSessionUserData(req,user){
    return req.session.user = {
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
            Gem: user.Resource.Gem
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
            "UpgradeCost_Crystal": user.IronStorage.UpgradeCost_Crystal,
            "UpgradeCost_Time": user.IronStorage.UpgradeCost_Time,
            "UpgradeCost_TimeStart": user.IronStorage.UpgradeCost_TimeStart,
            "UpgradeCost_Status": user.IronStorage.UpgradeCost_Status
        },
        CrystalMine: {
            "Name": user.CrystalMine.Name,
            "Level": user.CrystalMine.Level,
            "ProduceRate": user.CrystalMine.ProduceRate,
            "CollectedResource": user.CrystalMine.CollectedResource,
            "HistoryCollectedResource": user.CrystalMine.HistoryCollectedResource,
            "UpgradeCost_Iron": user.CrystalMine.UpgradeCost_Iron,
            "UpgradeCost_Crystal": user.CrystalMine.UpgradeCost_Crystal,
            "UpgradeCost_Time": user.CrystalMine.UpgradeCost_Time,
            "UpgradeCost_TimeStart": user.CrystalMine.UpgradeCost_TimeStart,
            "UpgradeCost_Status": user.CrystalMine.UpgradeCost_Status
        },
        CrystalStorage: {
            "Name": user.CrystalStorage.Name,
            "Level": user.CrystalStorage.Level,
            "Capacity": user.CrystalStorage.Capacity,
            "UpgradeCost_Iron": user.CrystalStorage.UpgradeCost_Iron,
            "UpgradeCost_Crystal": user.CrystalStorage.UpgradeCost_Crystal,
            "UpgradeCost_Time": user.CrystalStorage.UpgradeCost_Time,
            "UpgradeCost_TimeStart": user.CrystalStorage.UpgradeCost_TimeStart,
            "UpgradeCost_Status": user.CrystalStorage.UpgradeCost_Status
        },
        PetroleumMine: {
            "Name": user.PetroleumMine.Name,
            "Level": user.PetroleumMine.Level,
            "ProduceRate": user.PetroleumMine.ProduceRate,
            "CollectedResource": user.PetroleumMine.CollectedResource,
            "HistoryCollectedResource": user.PetroleumMine.HistoryCollectedResource,
            "UpgradeCost_Iron": user.PetroleumMine.UpgradeCost_Iron,
            "UpgradeCost_Crystal": user.PetroleumMine.UpgradeCost_Crystal,
            "UpgradeCost_Time": user.PetroleumMine.UpgradeCost_Time,
            "UpgradeCost_TimeStart": user.PetroleumMine.UpgradeCost_TimeStart,
            "UpgradeCost_Status": user.PetroleumMine.UpgradeCost_Status
        },
        PetroleumStorage: {
            "Name": user.PetroleumStorage.Name,
            "Level": user.PetroleumStorage.Level,
            "Capacity": user.PetroleumStorage.Capacity,
            "UpgradeCost_Iron": user.PetroleumStorage.UpgradeCost_Iron,
            "UpgradeCost_Crystal": user.PetroleumStorage.UpgradeCost_Crystal,
            "UpgradeCost_Time": user.PetroleumStorage.UpgradeCost_Time,
            "UpgradeCost_TimeStart": user.PetroleumStorage.UpgradeCost_TimeStart,
            "UpgradeCost_Status": user.PetroleumStorage.UpgradeCost_Status
        },
        TrainingAcademy: {
            "Name": user.TrainingAcademy.Name,
            "Level": user.TrainingAcademy.Level,
            "TrainingMax": user.TrainingAcademy.TrainingMax,
            "TrainingCost_Iron": user.TrainingAcademy.TrainingCost_Iron,
            "TrainingCost_Crystal": user.TrainingAcademy.TrainingCost_Crystal,
            "TrainingCost_Petroleum": user.TrainingAcademy.TrainingCost_Petroleum,
            "TrainingCost_Time": user.TrainingAcademy.TrainingCost_Time,
            "TrainingCost_TimeStart": user.TrainingAcademy.TrainingCost_TimeStart,
            "TrainingCost_Status": user.TrainingAcademy.TrainingCost_Status,

            "UpgradeCost_Iron": user.TrainingAcademy.UpgradeCost_Iron,
            "UpgradeCost_Crystal": user.TrainingAcademy.UpgradeCost_Crystal,
            "UpgradeCost_Petroleum": user.TrainingAcademy.UpgradeCost_Petroleum,
            "UpgradeCost_Time": user.TrainingAcademy.UpgradeCost_Time,
            "UpgradeCost_TimeStart": user.TrainingAcademy.UpgradeCost_TimeStart,
            "UpgradeCost_Status": user.TrainingAcademy.UpgradeCost_Status
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
        },
        Mission:{
            "SpendIron100":{
                "Task": user.Mission.SpendIron100.Task,
                "Bool": user.Mission.SpendIron100.Bool,
            },
            "SpendCrystal100":{
                "Task": user.Mission.SpendCrystal100.Task,
                "Bool": user.Mission.SpendCrystal100.Bool,
            },
            "CompleteTask":{
                "Bool": user.Mission.CompleteTask.Bool
            }
        }
    }
}

function returnRender(req,successMessageVar,errorMessageVar){

    if(successMessageVar != undefined){
        return {
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
            Mission: req.session.user.Mission,
            TrainingAcademy: req.session.user.TrainingAcademy,
            DexterityAcademy: req.session.user.DexterityAcademy,
            successMessage: successMessageVar
            }
    }else if(errorMessageVar != undefined){
        return {
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
            Mission: req.session.user.Mission,
            TrainingAcademy: req.session.user.TrainingAcademy,
            DexterityAcademy: req.session.user.DexterityAcademy,
            errorMessage: errorMessageVar
            }
    }else{
        return {
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
            Mission: req.session.user.Mission,
            TrainingAcademy: req.session.user.TrainingAcademy,
            DexterityAcademy: req.session.user.DexterityAcademy,
            }
    }

}