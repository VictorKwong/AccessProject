var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

//Set daily reward-----------
var todayDate = new Date();
var nowDate = todayDate.toLocaleDateString();
todayDate.setDate(todayDate.getDate() - 1);
var previousDate = todayDate.toLocaleDateString();
todayDate.setDate(todayDate.getDate() + 2);
var nextDate = todayDate.toLocaleDateString();
//---------------------------


var userSchema = new Schema({
    "userName":  {
      type: String,
      unique: true
    },
    "password": String,
    "displayName":  {
      type: String,
      unique: true,
      default: "player_" + Date.now() + Math.floor(Math.random() * 999)
    },
    "rewardDate" : {
      type: Date,
      default: previousDate
    },
    "loginBonus" : {
      type: Number,
      default: 0
    },
    "rewardCollect": {
      type: Boolean,
      default: false
    },
    "previousCollectTime": {
      type: Number,
      default: Math.floor(Date.now() / 1000)
    },
    "Resource": {
      "Iron": {
        type: Number,
        default: 200,
        min: 0
      },
      "Crystal": {
        type: Number,
        default: 100000,
        min: 0
      },
      "Petroleum": {
        type: Number,
        default: 50,
        min: 0
      },"Gem": {
        type: Number,
        default: 100,
        min: 0
      }
    },
    "Pet": {
      "name": {
        type: String,
        unique: true,
        default: "pet_" + Date.now() + Math.floor(Math.random() * 999)
      },
      "level":{
        type: Number,
        default: 1,
      },
      "experience":{
        type: Number,
        default: 0,
        min:0
      },
      "maxHealth": {
        type: Number,
        default: 100,
        min: 0
      },
      "currentHealth": {
        type: Number,
        default: 100,
        min: 0
      },
      "strength":{
        type: Number,
        default: 1,
      },
      "dexterity":{
        type: Number,
        default: 1,
      },
      "intelligence":{
        type: Number,
        default: 1,
      }
    },
    "IronMine": {
      "Name": {
        type: String,
        default: "Iron Mine"
      },
      "Level": {
        type: Number,
        default: 1,
      },
      "ProduceRate":{
        type: Number,
        default: 200,
      },
      "CollectedResource":{
        type: Number,
        default: 0
      },
      "HistoryCollectedResource":{
        type: Number,
        default: 0
      },
      "UpgradeCost_Iron":{
        type: Number,
        default: 100,
      },
      "UpgradeCost_Crystal":{
        type: Number,
        default: 10,
      },
      //duration
      "UpgradeCost_Time":{
        type: Number,
        default: 5
      },
      //When to start
      "UpgradeCost_TimeStart":{
        type: Number,
        default: Math.floor(Date.now() / 1000)
      },
      "UpgradeCost_Status":{
        type: Boolean,
        default: false
      }
    },
    "IronStorage": {
      "Name": {
        type: String,
        default: "Iron Storage"
      },
      "Level": {
        type: Number,
        default: 1,
      },
      "Capacity":{
        type: Number,
        default: 10000,
      },
      "UpgradeCost_Iron":{
        type: Number,
        default: 5,
      },
      "UpgradeCost_Crystal":{
        type: Number,
        default: 0,
      },
      //duration
      "UpgradeCost_Time":{
        type: Number,
        default: 5
      },
      //When to start
      "UpgradeCost_TimeStart":{
        type: Number,
        default: Math.floor(Date.now() / 1000)
      },
      "UpgradeCost_Status":{
        type: Boolean,
        default: false
      }
    },
    "CrystalMine": {
      "Name": {
        type: String,
        default: "Crystal Mine"
      },
      "Level": {
        type: Number,
        default: 0,
      },
      "ProduceRate":{
        type: Number,
        default: 0,
      },
      "CollectedResource":{
        type: Number,
        default: 0
      },
      "HistoryCollectedResource":{
        type: Number,
        default: 0
      },
      "UpgradeCost_Iron":{
        type: Number,
        default: 100,
      },
      "UpgradeCost_Crystal":{
        type: Number,
        default: 10,
      },
      "UpgradeCost_Time":{
        type: Number,
        default: 5
      },
      "UpgradeCost_TimeStart":{
        type: Number,
        default: Math.floor(Date.now() / 1000)
      },
      "UpgradeCost_Status":{
        type: Boolean,
        default: false
      }
    },
    "CrystalStorage": {
      "Name": {
        type: String,
        default: "Crystal Storage"
      },
      "Level": {
        type: Number,
        default: 1,
      },
      "Capacity":{
        type: Number,
        default: 400000,
      },
      "UpgradeCost_Iron":{
        type: Number,
        default: 10,
      },
      "UpgradeCost_Crystal":{
        type: Number,
        default: 10,
      },
      "UpgradeCost_Time":{
        type: Number,
        default: 5
      },
      "UpgradeCost_TimeStart":{
        type: Number,
        default: Math.floor(Date.now() / 1000)
      },
      "UpgradeCost_Status":{
        type: Boolean,
        default: false
      }
    },
    "PetroleumMine": {
      "Name": {
        type: String,
        default: "Petroleum Mine"
      },
      "Level": {
        type: Number,
        default: 0,
      },
      "ProduceRate":{
        type: Number,
        default: 0,
      },
      "CollectedResource":{
        type: Number,
        default: 0
      },
      "HistoryCollectedResource":{
        type: Number,
        default: 0
      },
      "UpgradeCost_Iron":{
        type: Number,
        default: 100,
      },
      "UpgradeCost_Crystal":{
        type: Number,
        default: 10,
      },
      "UpgradeCost_Time":{
        type: Number,
        default: 5
      },
      "UpgradeCost_TimeStart":{
        type: Number,
        default: Math.floor(Date.now() / 1000)
      },
      "UpgradeCost_Status":{
        type: Boolean,
        default: false
      }
    },
    "PetroleumStorage": {
      "Name": {
        type: String,
        default: "Petroleum Storage"
      },
      "Level": {
        type: Number,
        default: 1,
      },
      "Capacity":{
        type: Number,
        default: 1000,
      },
      "UpgradeCost_Iron":{
        type: Number,
        default: 20,
      },
      "UpgradeCost_Crystal":{
        type: Number,
        default: 20,
      },
      "UpgradeCost_Time":{
        type: Number,
        default: 10
      },
      "UpgradeCost_TimeStart":{
        type: Number,
        default: Math.floor(Date.now() / 1000)
      },
      "UpgradeCost_Status":{
        type: Boolean,
        default: false
      }
    },
    "ItemBag":{
      "Resource" : {
        "Iron1000": {
          "Name": { type: String, default: "1,000 Iron" },
          "Amount": { type: Number, default: 10 }
        },
        "Crystal1000": {
          "Name": { type: String, default: "1,000 Crystal" },
          "Amount": { type: Number, default: 25 }
        },
        "Petroleum200": {
          "Name": { type: String, default: "200 Petroleum" },
          "Amount": { type: Number, default: 50 }
        },
      },
      "Materials" : {
        "TextileFibers": {
          "Name": { type: String, default: "Textile Fibers" },
          "Amount": { type: Number, default: 0 }
        },
        "CarbonSteel": {
          "Name": { type: String, default: "Carbon Steel" },
          "Amount": { type: Number, default: 12 }
        },
      }
    },
    "Achievement": {
      "Resource":{
        "FirstCollect":{
          "Name": { type: String, default: "FirstCollect" },
          "Bool": { type: Boolean, default: false},
          "Description": { type: String, default: "Increase production Rate 1000%"}
        },
        "Bonus": { type: Number, default: 1},
      }
    },
    "Mission": {
      "NextDate": {type: Date, default: nextDate},
      "SpendIron100":{ 
        "Task": {type: Number, default: 0},
        "Bool": {type: Boolean, default: false}
      },
      "SpendCrystal100":{ 
        "Task": {type: Number, default: 0},
        "Bool": {type: Boolean, default: false}
      },
      "CompleteTask":{
        "Bool": {type: Boolean, default: false}
      }
    }
});

let User;

function initialize () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://Victor:7OkL03vI5PTE9FlJ@lentil.1fev0.mongodb.net/access_project");
        db.on('error', (err)=>{
            reject(err);
        });
        db.once('open', ()=>{
           User = db.model("account_register", userSchema);
           resolve();
        });
    });
};

function registerAccount(accountData){
  return new Promise(function (resolve, reject) {
      if(accountData.password !== accountData.password2){
        reject("Passwords do not match");
      }else{
        // Encrypt password, Salt = 10 rounds
        bcrypt.hash(accountData.password, 10).then( hashPassword =>{ 
          accountData.password = hashPassword;
          let newUser = new User(accountData);
          newUser.save().then((result)=>{
            resolve(result);
          }).catch((err)=>{
            if(err.code == 11000){
              reject("User Name already taken");
            }else{
              reject("There was an error creating the user: " + err);
            }
          }) 
        })
        .catch(err=>{
          reject("There was an error encrypting the password");
        });

      }
  });
}

function loginAccount(accountData){
  return new Promise(function (resolve, reject) {
    User.find({ userName: accountData.userName }).exec()
    .then((account) => {
      if(account.length == 0){
        reject("Unable to find user: " + accountData.userName);
      }else{
        bcrypt.compare(accountData.password, account[0].password).then((result) => {
          if (result) {
            //----Mission Check----
            if(nowDate === account[0].Mission.NextDate){
              account[0].Mission.NextDate = nextDate;
              account[0].Mission.SpendIron100.Task = 0;
              account[0].Mission.SpendIron100.Bool = false;
              account[0].Mission.SpendCrystal100.Task = 0;
              account[0].Mission.SpendCrystal100.Bool = false;
              account[0].Mission.CompleteTask.Bool = false;
            }
            //----Count Bonus, keep it as 20----
            let bonusCount = account[0].loginBonus
              if(account[0].rewardDate.toLocaleDateString() === previousDate && bonusCount < 20){
                //do nothing
              }else if(account[0].rewardDate.toLocaleDateString() === previousDate && bonusCount >= 20){
                account[0].loginBonus = 20;
              }else{
                account[0].loginBonus = 0;
              }
            let currentTime = Date.now();
            let currentTimeInSeconds = Math.floor(currentTime / 1000);
            if(
              (((currentTimeInSeconds - account[0].IronMine.UpgradeCost_TimeStart) >= account[0].IronMine.UpgradeCost_Time) && account[0].IronMine.UpgradeCost_Status) ||
              (((currentTimeInSeconds - account[0].IronStorage.UpgradeCost_TimeStart) >= account[0].IronStorage.UpgradeCost_Time) && account[0].IronStorage.UpgradeCost_Status) ||
              (((currentTimeInSeconds - account[0].CrystalMine.UpgradeCost_TimeStart) >= account[0].CrystalMine.UpgradeCost_Time) && account[0].CrystalMine.UpgradeCost_Status) ||
              (((currentTimeInSeconds - account[0].CrystalStorage.UpgradeCost_TimeStart) >= account[0].CrystalStorage.UpgradeCost_Time) && account[0].CrystalStorage.UpgradeCost_Status) ||
              (((currentTimeInSeconds - account[0].PetroleumMine.UpgradeCost_TimeStart) >= account[0].PetroleumMine.UpgradeCost_Time) && account[0].PetroleumMine.UpgradeCost_Status) ||
              (((currentTimeInSeconds - account[0].PetroleumStorage.UpgradeCost_TimeStart) >= account[0].PetroleumStorage.UpgradeCost_Time) && account[0].PetroleumStorage.UpgradeCost_Status)
            ){
              collectAllResourceUpgradeBuildingNonExport(account[0],account[0]);
            }else{
              collectAllResourceNonExport(account[0],account[0]);
            }

            //always update
            User.updateOne(
              { _id: account[0]._id }, account[0]
            ).exec().then(() => {
                resolve(account[0]);
            }).catch((err) => {
                reject("Upgrade cause error:" + err);
            })
          } else {
            // Passwords do not match, reject the promise with an error message
            reject(`Incorrect Password for user: ${accountData.userName}`);
          }
        }).catch((err) => {
          // Handle any errors that occur during the comparison
          reject(`Error checking password for user ${accountData.userName}: ${err}`);
        });
      }
    }).catch((err) => {
        reject(`Unable to find user - ${accountData.userName}: ${err}`);
    });

  });
}

function changePasswordAccount(accountData, userID, varName) {  
  return new Promise(function(resolve, reject) {
    // Find the user based on the provided userID
    User.find({ _id: userID }).exec()
      .then((account) => {
        if (account.length == 0) {
          reject("Unable to find user: " + varName);
        } else {
          // Compare the provided password with the stored hashed password
          bcrypt.compare(accountData.password, account[0].password)
            .then((result) => {
              if (result) {
                if (accountData.newPassword !== accountData.confirmNewPassword) {
                  reject("New passwords do not match");
                }
                // Hash the new password and update it in the database
                bcrypt.hash(accountData.confirmNewPassword, 10)
                  .then(hashPassword => {
                    User.updateOne(
                      { _id: userID },
                      { $set: { password: hashPassword } }
                    ).exec()
                      .then(() => {
                        resolve("Successfully changed password!");
                      })
                      .catch((err) => {
                        reject(`Error updating password for user ${varName}: ${err}`);
                      });
                  })
                  .catch((err) => {
                    reject(`Error hashing new password for user ${varName}: ${err}`);
                  });
              } else {
                reject("Old password does not match");
              }
            })
            .catch((err) => {
              reject(`Error comparing passwords for user ${varName}: ${err}`);
            });
        }
      })
      .catch((err) => {
        reject(`Unable to find user - ${accountData.userName}: ${err}`);
      });
  });
}
function changeDisplayNameAccount(accountData, userID, varName) {  
  return new Promise(function(resolve, reject) {
    // Find the user based on the provided userID
    User.find({ _id: userID }).exec()
    .then((account) => {
            User.updateOne(
              { _id: userID },
              { $set: { displayName: accountData.displayName } }
            ).exec().then(() => {
              resolve(accountData);
            }).catch((err) => {
                reject(accountData.displayName + " name has already been taken!");
            })
    }).catch((err) => {
        reject(`Unable to find user - ${varName}: ${err}`);
    });
  });
}
function resetAccount(accountData) {  
  return new Promise(function(resolve, reject) {
    // Find the user based on the provided userID
    User.find({ _id: accountData._id }).exec()
    .then((account) => {
            //reset only ironMine
            accountData.rewardDate = previousDate
            accountData.loginBonus = 0
            accountData.rewardCollect = false
            accountData.previousCollectTime = Math.floor(Date.now() / 1000)
            accountData.Resource.Iron = 200
            accountData.Resource.Crystal = 1000000
            accountData.Resource.Petroleum = 50
            accountData.IronMine.Level = 1
            accountData.IronMine.ProduceRate = 200
            accountData.IronMine.CollectedResource = 0
            accountData.IronMine.HistoryCollectedResource = 0
            accountData.IronMine.UpgradeCost_Iron = 100
            accountData.IronMine.UpgradeCost_Crystal = 10
            accountData.IronMine.UpgradeCost_Time = 5
            accountData.IronMine.UpgradeCost_TimeStart = Math.floor(Date.now() / 1000)
            accountData.IronMine.UpgradeCost_Status = false

            accountData.IronStorage.Level = 1
            accountData.IronStorage.Capacity = 1000
            accountData.IronStorage.UpgradeCost_Iron = 100
            accountData.IronStorage.UpgradeCost_Crystal = 10
            accountData.IronStorage.UpgradeCost_Time = 5
            accountData.IronStorage.UpgradeCost_TimeStart = Math.floor(Date.now() / 1000)
            accountData.IronStorage.UpgradeCost_Status = false

            accountData.CrystalMine.Level = 0
            accountData.CrystalMine.ProduceRate = 0
            accountData.CrystalMine.CollectedResource = 0
            accountData.CrystalMine.HistoryCollectedResource = 0
            accountData.CrystalMine.UpgradeCost_Iron = 100
            accountData.CrystalMine.UpgradeCost_Crystal = 10
            accountData.CrystalMine.UpgradeCost_Time = 5
            accountData.CrystalMine.UpgradeCost_TimeStart = Math.floor(Date.now() / 1000)
            accountData.CrystalMine.UpgradeCost_Status = false

            accountData.CrystalStorage.Level = 1
            accountData.CrystalStorage.Capacity = 400000
            accountData.CrystalStorage.UpgradeCost_Iron = 10
            accountData.CrystalStorage.UpgradeCost_Crystal = 10
            accountData.CrystalStorage.UpgradeCost_Time = 5
            accountData.CrystalStorage.UpgradeCost_TimeStart = Math.floor(Date.now() / 1000)
            accountData.CrystalStorage.UpgradeCost_Status = false

            accountData.PetroleumMine.Level = 0
            accountData.PetroleumMine.ProduceRate = 0
            accountData.PetroleumMine.CollectedResource = 0
            accountData.PetroleumMine.HistoryCollectedResource = 0
            accountData.PetroleumMine.UpgradeCost_Iron = 100
            accountData.PetroleumMine.UpgradeCost_Crystal = 10
            accountData.PetroleumMine.UpgradeCost_Time = 5
            accountData.PetroleumMine.UpgradeCost_TimeStart = Math.floor(Date.now() / 1000)
            accountData.PetroleumMine.UpgradeCost_Status = false

            accountData.PetroleumStorage.Level = 1
            accountData.PetroleumStorage.Capacity = 1000
            accountData.PetroleumStorage.UpgradeCost_Iron = 20
            accountData.PetroleumStorage.UpgradeCost_Crystal = 20
            accountData.PetroleumStorage.UpgradeCost_Time = 10
            accountData.PetroleumStorage.UpgradeCost_TimeStart = Math.floor(Date.now() / 1000)
            accountData.PetroleumStorage.UpgradeCost_Status = false

            User.updateOne(
              { _id: accountData._id }, accountData
            ).exec().then(() => {
              resolve(accountData);
            }).catch((err) => {
                reject("Error! cannot be reset!");
            })
    }).catch((err) => {
        reject(`Unable to find user - ${varName}: ${err}`);
    });
  });
}


function refreshAccount(accountData){
  return new Promise(function (resolve, reject) {
    User.find({ _id: accountData._id }).exec()
    .then((account) => {
      if(account.length == 0){
        reject("Unable to find user: " + accountData.userName);
      }else{
        let currentTime = Date.now();
        let currentTimeInSeconds = Math.floor(currentTime / 1000);
        if(
          (((currentTimeInSeconds - account[0].IronMine.UpgradeCost_TimeStart) >= account[0].IronMine.UpgradeCost_Time) && account[0].IronMine.UpgradeCost_Status) ||
          (((currentTimeInSeconds - account[0].IronStorage.UpgradeCost_TimeStart) >= account[0].IronStorage.UpgradeCost_Time) && account[0].IronStorage.UpgradeCost_Status) ||
          (((currentTimeInSeconds - account[0].CrystalMine.UpgradeCost_TimeStart) >= account[0].CrystalMine.UpgradeCost_Time) && account[0].CrystalMine.UpgradeCost_Status) ||
          (((currentTimeInSeconds - account[0].CrystalStorage.UpgradeCost_TimeStart) >= account[0].CrystalStorage.UpgradeCost_Time) && account[0].CrystalStorage.UpgradeCost_Status) ||
          (((currentTimeInSeconds - account[0].PetroleumMine.UpgradeCost_TimeStart) >= account[0].PetroleumMine.UpgradeCost_Time) && account[0].PetroleumMine.UpgradeCost_Status) ||
          (((currentTimeInSeconds - account[0].PetroleumStorage.UpgradeCost_TimeStart) >= account[0].PetroleumStorage.UpgradeCost_Time) && account[0].PetroleumStorage.UpgradeCost_Status)
        ){
          collectAllResourceUpgradeBuildingNonExport(accountData,account[0]);
        }else{
          collectAllResourceNonExport(accountData,account[0]);
        }
        
        //always update
        User.updateOne(
          { _id: accountData._id }, accountData
        ).exec().then(() => {
            resolve(accountData);
        }).catch((err) => {
            reject("Upgrade cause error:" + err);
        })
      }
    }).catch((err) => {
        reject(`Unable to find user - ${accountData.userName}: ${err}`);
    });

  });
}


function upgradeIronMine(accountData){
  return new Promise(function (resolve, reject) {
    User.find({ _id: accountData._id }).exec()
    .then((account) => {
          if ((account[0].Resource.Iron - account[0].IronMine.UpgradeCost_Iron) >= 0 &&
              (account[0].Resource.Crystal - account[0].IronMine.UpgradeCost_Crystal) >= 0){

            accountData.Resource.Iron -= account[0].IronMine.UpgradeCost_Iron;
            accountData.Resource.Crystal -= account[0].IronMine.UpgradeCost_Crystal;
            accountData.IronMine.UpgradeCost_Status = true;
            accountData.IronMine.UpgradeCost_TimeStart = Math.floor(Date.now() / 1000);

            collectAllResourceNonExport(accountData,account[0]);

            User.updateOne(
              { _id: accountData._id }, accountData
            ).exec().then(() => {
                resolve(accountData);
            }).catch((err) => {
                reject("Upgrade cause error:" + err);
            })
          } else {
            reject(`Not enough resource: ${accountData.userName}`);
          }
    }).catch((err) => {
        reject(`Unable to find user - ${accountData.userName}: ${err}`);
    });

  });
}

function upgradeCrystalMine(accountData){
  return new Promise(function (resolve, reject) {
    User.find({ _id: accountData._id }).exec()
    .then((account) => {
          if ((account[0].Resource.Iron - account[0].CrystalMine.UpgradeCost_Iron) >= 0 &&
              (account[0].Resource.Crystal - account[0].CrystalMine.UpgradeCost_Crystal) >= 0){

                accountData.Resource.Iron -= account[0].CrystalMine.UpgradeCost_Iron;
                accountData.Resource.Crystal -= account[0].CrystalMine.UpgradeCost_Crystal;
                accountData.CrystalMine.UpgradeCost_Status = true;
                accountData.CrystalMine.UpgradeCost_TimeStart = Math.floor(Date.now() / 1000);
            User.updateOne(
              { _id: accountData._id }, accountData
            ).exec().then(() => {
                resolve(accountData);
            }).catch((err) => {
                reject("Upgrade cause error:" + err);
            })
          } else {
            reject(`Not enough resource: ${accountData.userName}`);
          }
    }).catch((err) => {
        reject(`Unable to find user - ${accountData.userName}: ${err}`);
    });

  });
}

function upgradePetroleumMine(accountData){
  return new Promise(function (resolve, reject) {
    User.find({ _id: accountData._id }).exec()
    .then((account) => {
          if ((account[0].Resource.Iron - account[0].PetroleumMine.UpgradeCost_Iron) >= 0 &&
              (account[0].Resource.Crystal - account[0].PetroleumMine.UpgradeCost_Crystal) >= 0){

                accountData.Resource.Iron -= account[0].PetroleumMine.UpgradeCost_Iron;
                accountData.Resource.Crystal -= account[0].PetroleumMine.UpgradeCost_Crystal;
                accountData.PetroleumMine.UpgradeCost_Status = true;
                accountData.PetroleumMine.UpgradeCost_TimeStart = Math.floor(Date.now() / 1000);

            User.updateOne(
              { _id: accountData._id }, accountData
            ).exec().then(() => {
                resolve(accountData);
            }).catch((err) => {
                reject("Upgrade cause error:" + err);
            })
          } else {
            reject(`Not enough resource: ${accountData.userName}`);
          }
    }).catch((err) => {
        reject(`Unable to find user - ${accountData.userName}: ${err}`);
    });

  });
}


function upgradeIronStorage(accountData){
  return new Promise(function (resolve, reject) {
    User.find({ _id: accountData._id }).exec()
    .then((account) => {
          if ((account[0].Resource.Iron - account[0].IronStorage.UpgradeCost_Iron) >= 0 &&
              (account[0].Resource.Crystal - account[0].IronStorage.UpgradeCost_Crystal) >= 0){

                accountData.Resource.Iron -= account[0].IronStorage.UpgradeCost_Iron;
                accountData.Resource.Crystal -= account[0].IronStorage.UpgradeCost_Crystal;
                accountData.IronStorage.UpgradeCost_Status = true;
                accountData.IronStorage.UpgradeCost_TimeStart = Math.floor(Date.now() / 1000);
                collectAllResourceNonExport(accountData,account[0]);

                User.updateOne(
                  { _id: accountData._id }, accountData
                ).exec().then(() => {
                    resolve(accountData);
                }).catch((err) => {
                    reject("Upgrade cause error:" + err);
                })
          } else {
            reject(`Not enough resource: ${accountData.userName}`);
          }
    }).catch((err) => {
        reject(`Unable to find user - ${accountData.userName}: ${err}`);
    });

  });
}

function upgradeCrystalStorage(accountData){
  return new Promise(function (resolve, reject) {
    User.find({ _id: accountData._id }).exec()
    .then((account) => {
          if ((account[0].Resource.Iron - account[0].CrystalStorage.UpgradeCost_Iron) >= 0 &&
              (account[0].Resource.Crystal - account[0].CrystalStorage.UpgradeCost_Crystal) >= 0){

                accountData.Resource.Iron -= account[0].CrystalStorage.UpgradeCost_Iron;
                accountData.Resource.Crystal -= account[0].CrystalStorage.UpgradeCost_Crystal;
                accountData.CrystalStorage.UpgradeCost_Status = true;
                accountData.CrystalStorage.UpgradeCost_TimeStart = Math.floor(Date.now() / 1000);

            User.updateOne(
              { _id: accountData._id }, accountData
            ).exec().then(() => {
                resolve(accountData);
            }).catch((err) => {
                reject("Upgrade cause error:" + err);
            })
          } else {
            reject(`Not enough resource: ${accountData.userName}`);
          }
    }).catch((err) => {
        reject(`Unable to find user - ${accountData.userName}: ${err}`);
    });

  });
}

function upgradePetroleumStorage(accountData){
  return new Promise(function (resolve, reject) {
    User.find({ _id: accountData._id }).exec()
    .then((account) => {
          if ((account[0].Resource.Iron - account[0].PetroleumStorage.UpgradeCost_Iron) >= 0 &&
              (account[0].Resource.Crystal - account[0].PetroleumStorage.UpgradeCost_Crystal) >= 0){

                accountData.Resource.Iron -= account[0].PetroleumStorage.UpgradeCost_Iron;
                accountData.Resource.Crystal -= account[0].PetroleumStorage.UpgradeCost_Crystal;
                accountData.PetroleumStorage.UpgradeCost_Status = true;
                accountData.PetroleumStorage.UpgradeCost_TimeStart = Math.floor(Date.now() / 1000);

            User.updateOne(
              { _id: accountData._id }, accountData
            ).exec().then(() => {
                resolve(accountData);
            }).catch((err) => {
                reject("Upgrade cause error:" + err);
            })
          } else {
            reject(`Not enough resource: ${accountData.userName}`);
          }
    }).catch((err) => {
        reject(`Unable to find user - ${accountData.userName}: ${err}`);
    });

  });
}

// Claim the daily reward
function claimDailyReward(accountData) {
  return new Promise(function (resolve, reject) {
    User.find({ _id: accountData._id }).exec()
    .then((account) => {
          const today = new Date().toLocaleDateString();
          if ((account[0].rewardDate.toLocaleDateString() !== previousDate) && (today === account[0].rewardDate.toLocaleDateString())){
            reject("You have already claimed the reward today.");
          }else{
            //----Count Bonus, keep it as 20----
            let bonusCount = account[0].loginBonus
            if(account[0].rewardDate.toLocaleDateString() === previousDate && bonusCount < 20){
              ++bonusCount;
            }else if(account[0].rewardDate.toLocaleDateString() === previousDate && bonusCount >= 20){
              bonusCount = 20;
            }else{
              bonusCount = 1;
            }
            accountData.loginBonus = bonusCount;
            accountData.rewardDate = today;
            accountData.Resource.Iron += 7000 * bonusCount;
            accountData.Resource.Crystal += 7000 * bonusCount;
            accountData.Resource.Petroleum += 3500 * bonusCount;
            accountData.IronMine.HistoryCollectedResource += 7000 * bonusCount;
            accountData.CrystalMine.HistoryCollectedResource += 7000 * bonusCount;
            accountData.PetroleumMine.HistoryCollectedResource += 3500 * bonusCount;
            
            User.updateOne(
              { _id: accountData._id }, accountData
            ).exec().then(() => {
                //account, Iron Bonus, Crystal Bonus, Petroleum Bonus
                resolve(accountData);
            }).catch((err) => {
                reject("Claim reward cause error:" + err);
            })
          }
    }).catch((err) => {
        reject(`Unable to find user - ${accountData.userName}: ${err}`);
    });
  })
}

function spend100Test(accountData){
  return new Promise(function (resolve, reject) {
    User.find({ _id: accountData._id }).exec()
    .then((account) => {
      if(accountData.Resource.Iron >= 100 && accountData.Resource.Crystal >= 100 && accountData.Resource.Petroleum >= 100){
        accountData.Resource.Iron -= 100;
        accountData.Resource.Crystal -= 100;
        accountData.Resource.Petroleum -= 100;
        accountData.Mission.SpendIron100.Task += 100;
        accountData.Mission.SpendCrystal100.Task += 100;
        if(accountData.Mission.SpendIron100.Task >= 100){
          accountData.Mission.SpendIron100.Bool = true;
        }
        if(accountData.Mission.SpendCrystal100.Task >= 100){
          accountData.Mission.SpendCrystal100.Bool = true;
        }
        User.updateOne(
          { _id: accountData._id }, accountData
        ).exec().then(() => {
            resolve(accountData);
        }).catch((err) => {
            reject("Can't reduce resource: " + err);
        })
      }else{
        reject("Not enough resource: " + err);
      }
    }).catch((err) => {
      reject(`Unable to find user - ${accountData.userName}: ${err}`);
  });

});
}

//Need QC
function iron1000Test(accountData){
  return new Promise(function (resolve, reject) {
    User.find({ _id: accountData._id }).exec()
    .then((account) => {
              //Achievement
              if(!account[0].Achievement.Resource.FirstCollect.Bool){
                accountData.Achievement.Resource.FirstCollect.Bool = true;
                accountData.Achievement.Resource.Bonus *= 10;
              }
              accountData.IronMine.CollectedResource = 1000
              accountData.Resource.Iron += 1000
              accountData.IronMine.HistoryCollectedResource += 1000

              User.updateOne(
                { _id: accountData._id }, accountData
              ).exec().then(() => {
                  resolve(accountData);
              }).catch((err) => {
                  reject("Can't collect resource: " + err);
              })
    }).catch((err) => {
        reject(`Unable to find user - ${accountData.userName}: ${err}`);
    });

  });
}

//Non-Export function
function collectAllResourceNonExport(accountData, accountZero){
  let currentTime = Date.now();
  let currentTimeInSeconds = Math.floor(currentTime / 1000);
  collectIronMineResourceNonExport(accountData, accountZero,currentTimeInSeconds);
  collectCrystalMineResourceNonExport(accountData, accountZero,currentTimeInSeconds);
  collectPetroleumMineResourceNonExport(accountData, accountZero,currentTimeInSeconds);
  accountData.previousCollectTime = currentTimeInSeconds
}

function collectIronMineResourceNonExport(accountData, accountZero,currentTimeInSeconds){

  //=====================Iron Mine=====================
  //clear out the current resource first
  accountData.IronMine.CollectedResource = 0;
  let duration = currentTimeInSeconds - accountZero.previousCollectTime;
  if(accountZero.Resource.Iron >= accountZero.IronStorage.Capacity){
    accountData.IronMine.CollectedResource = 0;
  }else if(((accountZero.Resource.Iron + parseInt(accountZero.IronMine.ProduceRate * duration/3600 * accountZero.Achievement.Resource.Bonus)) <= accountZero.IronStorage.Capacity)){
    //determine how many thing that we can collect
    accountData.IronMine.CollectedResource = parseInt(accountZero.IronMine.ProduceRate * duration/3600 * accountZero.Achievement.Resource.Bonus);
  }else if(((accountZero.Resource.Iron + parseInt(accountZero.IronMine.ProduceRate * duration/3600 * accountZero.Achievement.Resource.Bonus)) > accountZero.IronStorage.Capacity)){
    accountData.IronMine.CollectedResource = accountZero.IronStorage.Capacity - accountZero.Resource.Iron;
  }
  //determine how many things that can store
  //update accountData.Resource.Iron
  if(accountData.Resource.Iron >= accountZero.IronStorage.Capacity){
    //do nothing
  }else if((accountData.Resource.Iron + accountData.IronMine.CollectedResource) <= accountZero.IronStorage.Capacity){
    accountData.Resource.Iron += accountData.IronMine.CollectedResource
  }else{
    //remain
    accountData.Resource.Iron = accountZero.IronStorage.Capacity
  }

  accountData.IronMine.HistoryCollectedResource += accountData.IronMine.CollectedResource
}

function collectCrystalMineResourceNonExport(accountData, accountZero,currentTimeInSeconds){
  //=====================Crystal Mine=====================
  accountData.CrystalMine.CollectedResource = 0;
  let duration = currentTimeInSeconds - accountZero.previousCollectTime;
  if(accountZero.CrystalMine.Level != 0){
    if(accountZero.Resource.Crystal >= accountZero.CrystalStorage.Capacity){
      accountData.CrystalMine.CollectedResource = 0;
    }else if(((accountZero.Resource.Crystal + parseInt(accountZero.CrystalMine.ProduceRate * duration/3600 * accountZero.Achievement.Resource.Bonus)) <= accountZero.CrystalStorage.Capacity)){
      //determine how many thing that we can collect
      accountData.CrystalMine.CollectedResource = parseInt(accountZero.CrystalMine.ProduceRate * duration/3600 * accountZero.Achievement.Resource.Bonus);
    }else if(((accountZero.Resource.Crystal + parseInt(accountZero.CrystalMine.ProduceRate * duration/3600 * accountZero.Achievement.Resource.Bonus)) > accountZero.CrystalStorage.Capacity)){
      accountData.CrystalMine.CollectedResource = accountZero.CrystalStorage.Capacity - accountZero.Resource.Crystal;
    }
  }
  if(accountData.Resource.Crystal >= accountZero.CrystalStorage.Capacity){
    //do nothing
  }else if((accountData.Resource.Crystal + accountData.CrystalMine.CollectedResource) <= accountZero.CrystalStorage.Capacity){
    accountData.Resource.Crystal += accountData.CrystalMine.CollectedResource
  }else{
    accountData.Resource.Crystal = accountZero.CrystalStorage.Capacity
  }

  accountData.CrystalMine.HistoryCollectedResource += accountData.CrystalMine.CollectedResource
}

function collectPetroleumMineResourceNonExport(accountData, accountZero,currentTimeInSeconds){
  //=====================Petroleum Mine=====================
  accountData.PetroleumMine.CollectedResource = 0;
  let duration = currentTimeInSeconds - accountZero.previousCollectTime;
  if(accountZero.PetroleumMine.Level != 0){
    if(accountZero.Resource.Petroleum >= accountZero.PetroleumStorage.Capacity){
      accountData.PetroleumMine.CollectedResource = 0;
    }else if(((accountZero.Resource.Petroleum + parseInt(accountZero.PetroleumMine.ProduceRate * duration/3600 * accountZero.Achievement.Resource.Bonus)) <= accountZero.PetroleumStorage.Capacity)){
      //determine how many thing that we can collect
      accountData.PetroleumMine.CollectedResource = parseInt(accountZero.PetroleumMine.ProduceRate * duration/3600 * accountZero.Achievement.Resource.Bonus);
    }else if(((accountZero.Resource.Petroleum + parseInt(accountZero.PetroleumMine.ProduceRate * duration/3600 * accountZero.Achievement.Resource.Bonus)) > accountZero.PetroleumStorage.Capacity)){
      accountData.PetroleumMine.CollectedResource = accountZero.PetroleumStorage.Capacity - accountZero.Resource.Petroleum;
    }
  }
  if(accountData.Resource.Petroleum >= accountZero.PetroleumStorage.Capacity){
    //do nothing
  }else if((accountData.Resource.Petroleum + accountData.PetroleumMine.CollectedResource) <= accountZero.PetroleumStorage.Capacity){
    accountData.Resource.Petroleum += accountData.PetroleumMine.CollectedResource
  }else{
    accountData.Resource.Petroleum = accountZero.PetroleumStorage.Capacity
  }

  accountData.PetroleumMine.HistoryCollectedResource += accountData.PetroleumMine.CollectedResource
}

function collectAllResourceUpgradeBuildingNonExport(accountData, accountZero){
  let currentTime = Date.now();
  let currentTimeInSeconds = Math.floor(currentTime / 1000);

  //=====================Iron Storage=====================
  if(((currentTimeInSeconds - accountData.IronStorage.UpgradeCost_TimeStart) >= accountData.IronStorage.UpgradeCost_Time) && accountData.IronStorage.UpgradeCost_Status){
    //finished upgrade
    accountData.IronStorage.UpgradeCost_Status = false;

    accountData.IronStorage.Level += 1;
    accountData.IronStorage.Capacity = accountZero.IronStorage.Capacity + accountZero.IronStorage.Capacity;
    accountData.IronStorage.UpgradeCost_Iron = parseInt(accountZero.IronStorage.UpgradeCost_Iron * 1.5);
    accountData.IronStorage.UpgradeCost_Crystal = parseInt(accountZero.IronStorage.UpgradeCost_Crystal * 1.5);
    accountData.IronStorage.UpgradeCost_Time = accountZero.IronStorage.UpgradeCost_Time + accountZero.IronStorage.UpgradeCost_Time;
    //In this case I want to make sure IronStorage Capacity is extract from database, not from website
    accountZero.IronStorage.Capacity = accountData.IronStorage.Capacity;
  }
  //=====================Crystal Storage=====================
  if(((currentTimeInSeconds - accountData.CrystalStorage.UpgradeCost_TimeStart) >= accountData.CrystalStorage.UpgradeCost_Time) && accountData.CrystalStorage.UpgradeCost_Status){
    //finished upgrade
    accountData.CrystalStorage.UpgradeCost_Status = false;

    accountData.CrystalStorage.Level += 1;
    accountData.CrystalStorage.Capacity = accountZero.CrystalStorage.Capacity + accountZero.CrystalStorage.Capacity;
    accountData.CrystalStorage.UpgradeCost_Iron = parseInt(accountZero.CrystalStorage.UpgradeCost_Iron * 1.5);
    accountData.CrystalStorage.UpgradeCost_Crystal = parseInt(accountZero.CrystalStorage.UpgradeCost_Crystal * 1.5);
    accountData.CrystalStorage.UpgradeCost_Time = accountZero.CrystalStorage.UpgradeCost_Time + accountZero.CrystalStorage.UpgradeCost_Time;
    accountZero.CrystalStorage.Capacity = accountData.CrystalStorage.Capacity;
  }
  //=====================Petroleum Storage=====================
  if(((currentTimeInSeconds - accountData.PetroleumStorage.UpgradeCost_TimeStart) >= accountData.PetroleumStorage.UpgradeCost_Time) && accountData.PetroleumStorage.UpgradeCost_Status){
    //finished upgrade
    accountData.PetroleumStorage.UpgradeCost_Status = false;

    accountData.PetroleumStorage.Level += 1;
    accountData.PetroleumStorage.Capacity = accountZero.PetroleumStorage.Capacity + accountZero.PetroleumStorage.Capacity;
    accountData.PetroleumStorage.UpgradeCost_Iron = parseInt(accountZero.PetroleumStorage.UpgradeCost_Iron * 1.5);
    accountData.PetroleumStorage.UpgradeCost_Crystal = parseInt(accountZero.PetroleumStorage.UpgradeCost_Crystal * 1.5);
    accountData.PetroleumStorage.UpgradeCost_Time = accountZero.PetroleumStorage.UpgradeCost_Time + accountZero.PetroleumStorage.UpgradeCost_Time;
    accountZero.PetroleumStorage.Capacity = accountData.PetroleumStorage.Capacity;
  }

  //=====================Iron Mine=====================

  if(((currentTimeInSeconds - accountData.IronMine.UpgradeCost_TimeStart) >= accountData.IronMine.UpgradeCost_Time) && accountData.IronMine.UpgradeCost_Status){
    //collect calculation
    let firstDuration = accountData.IronMine.UpgradeCost_TimeStart + accountData.IronMine.UpgradeCost_Time - accountZero.previousCollectTime;
    let secondDuration = currentTimeInSeconds - accountZero.previousCollectTime - firstDuration;

    if(accountZero.Resource.Iron >= accountZero.IronStorage.Capacity){
      accountData.IronMine.CollectedResource = 0;
    }else if(((accountZero.Resource.Iron + parseInt(accountZero.IronMine.ProduceRate * firstDuration/3600 * accountZero.Achievement.Resource.Bonus) + parseInt(accountZero.IronMine.ProduceRate * secondDuration/3600 * accountZero.Achievement.Resource.Bonus * 2)) <= accountZero.IronStorage.Capacity)){
      //determine how many thing that we can collect
      accountData.IronMine.CollectedResource = parseInt(accountZero.IronMine.ProduceRate * firstDuration/3600 * accountZero.Achievement.Resource.Bonus) + parseInt(accountZero.IronMine.ProduceRate * secondDuration/3600 * accountZero.Achievement.Resource.Bonus * 2);
    }else if(((accountZero.Resource.Iron + parseInt(accountZero.IronMine.ProduceRate * firstDuration/3600 * accountZero.Achievement.Resource.Bonus) + parseInt(accountZero.IronMine.ProduceRate * secondDuration/3600 * accountZero.Achievement.Resource.Bonus * 2)) > accountZero.IronStorage.Capacity)){
      accountData.IronMine.CollectedResource = accountZero.IronStorage.Capacity - accountZero.Resource.Iron;
    }
    if(accountData.Resource.Iron >= accountZero.IronStorage.Capacity){
      //do nothing
    }else if((accountData.Resource.Iron + accountData.IronMine.CollectedResource) <= accountZero.IronStorage.Capacity){
      accountData.Resource.Iron += accountData.IronMine.CollectedResource
    }else{
      //remain
      accountData.Resource.Iron = accountZero.IronStorage.Capacity
    }
    accountData.previousCollectTime = currentTimeInSeconds
    accountData.IronMine.HistoryCollectedResource += accountData.IronMine.CollectedResource

    //finished upgrade
    accountData.IronMine.UpgradeCost_Status = false;

    accountData.IronMine.Level += 1;
    accountData.IronMine.ProduceRate = accountZero.IronMine.ProduceRate + accountZero.IronMine.ProduceRate;
    accountData.IronMine.UpgradeCost_Iron = accountZero.IronMine.UpgradeCost_Iron + accountZero.IronMine.UpgradeCost_Iron;
    accountData.IronMine.UpgradeCost_Crystal = accountZero.IronMine.UpgradeCost_Crystal + accountZero.IronMine.UpgradeCost_Crystal;
    accountData.IronMine.UpgradeCost_Time = accountZero.IronMine.UpgradeCost_Time + accountZero.IronMine.UpgradeCost_Time;
  }else{
    collectIronMineResourceNonExport(accountData, accountZero,currentTimeInSeconds);
    accountData.previousCollectTime = currentTimeInSeconds
  }

  //=====================Crystal Mine=====================

  if(((currentTimeInSeconds - accountData.CrystalMine.UpgradeCost_TimeStart) >= accountData.CrystalMine.UpgradeCost_Time) && accountData.CrystalMine.UpgradeCost_Status){
    //collect calculation
    let firstDuration = accountData.CrystalMine.UpgradeCost_TimeStart + accountData.CrystalMine.UpgradeCost_Time - accountZero.previousCollectTime;
    let secondDuration = currentTimeInSeconds - accountZero.previousCollectTime - firstDuration;
    accountData.CrystalMine.CollectedResource = 0;

    if(accountZero.CrystalMine.Level != 0){
      if(accountZero.Resource.Crystal >= accountZero.CrystalStorage.Capacity){
        accountData.CrystalMine.CollectedResource = 0;
      }else if(((accountZero.Resource.Crystal + parseInt(accountZero.CrystalMine.ProduceRate * firstDuration/3600 * accountZero.Achievement.Resource.Bonus) + parseInt(accountZero.CrystalMine.ProduceRate * secondDuration/3600 * accountZero.Achievement.Resource.Bonus * 2)) <= accountZero.CrystalStorage.Capacity)){
        //determine how many thing that we can collect
        accountData.CrystalMine.CollectedResource = parseInt(accountZero.CrystalMine.ProduceRate * firstDuration/3600 * accountZero.Achievement.Resource.Bonus) + parseInt(accountZero.CrystalMine.ProduceRate * secondDuration/3600 * accountZero.Achievement.Resource.Bonus * 2);
      }else if(((accountZero.Resource.Crystal + parseInt(accountZero.CrystalMine.ProduceRate * firstDuration/3600 * accountZero.Achievement.Resource.Bonus) + parseInt(accountZero.CrystalMine.ProduceRate * secondDuration/3600 * accountZero.Achievement.Resource.Bonus * 2)) > accountZero.CrystalStorage.Capacity)){
        accountData.CrystalMine.CollectedResource = accountZero.CrystalStorage.Capacity - accountZero.Resource.Crystal;
      }
    }
    
    if(accountData.Resource.Crystal >= accountZero.CrystalStorage.Capacity){
      //do nothing
    }else if((accountData.Resource.Crystal + accountData.CrystalMine.CollectedResource) <= accountZero.CrystalStorage.Capacity){
      accountData.Resource.Crystal += accountData.CrystalMine.CollectedResource
    }else{
      //remain
      accountData.Resource.Crystal = accountZero.CrystalStorage.Capacity
    }
    accountData.previousCollectTime = currentTimeInSeconds
    accountData.CrystalMine.HistoryCollectedResource += accountData.CrystalMine.CollectedResource

    //finished upgrade
    accountData.CrystalMine.UpgradeCost_Status = false;

    accountData.CrystalMine.Level += 1;
    accountData.CrystalMine.ProduceRate === parseInt(0) ? accountData.CrystalMine.ProduceRate = 120 : accountData.CrystalMine.ProduceRate = accountZero.CrystalMine.ProduceRate + accountZero.CrystalMine.ProduceRate;
    accountData.CrystalMine.UpgradeCost_Iron = accountZero.CrystalMine.UpgradeCost_Iron + accountZero.CrystalMine.UpgradeCost_Iron;
    accountData.CrystalMine.UpgradeCost_Crystal = accountZero.CrystalMine.UpgradeCost_Crystal + accountZero.CrystalMine.UpgradeCost_Crystal;
    accountData.CrystalMine.UpgradeCost_Time = accountZero.CrystalMine.UpgradeCost_Time + accountZero.CrystalMine.UpgradeCost_Time;
  }else{
    collectCrystalMineResourceNonExport(accountData, accountZero,currentTimeInSeconds);
    accountData.previousCollectTime = currentTimeInSeconds
  }

    //=====================Petroleum Mine=====================

    if(((currentTimeInSeconds - accountData.PetroleumMine.UpgradeCost_TimeStart) >= accountData.PetroleumMine.UpgradeCost_Time) && accountData.PetroleumMine.UpgradeCost_Status){
      //collect calculation
      let firstDuration = accountData.PetroleumMine.UpgradeCost_TimeStart + accountData.PetroleumMine.UpgradeCost_Time - accountZero.previousCollectTime;
      let secondDuration = currentTimeInSeconds - accountZero.previousCollectTime - firstDuration;
      accountData.PetroleumMine.CollectedResource = 0;
  
      if(accountZero.PetroleumMine.Level != 0){
        if(accountZero.Resource.Petroleum >= accountZero.PetroleumStorage.Capacity){
          accountData.PetroleumMine.CollectedResource = 0;
        }else if(((accountZero.Resource.Petroleum + parseInt(accountZero.PetroleumMine.ProduceRate * firstDuration/3600 * accountZero.Achievement.Resource.Bonus) + parseInt(accountZero.PetroleumMine.ProduceRate * secondDuration/3600 * accountZero.Achievement.Resource.Bonus * 2)) <= accountZero.PetroleumStorage.Capacity)){
          //determine how many thing that we can collect
          accountData.PetroleumMine.CollectedResource = parseInt(accountZero.PetroleumMine.ProduceRate * firstDuration/3600 * accountZero.Achievement.Resource.Bonus) + parseInt(accountZero.PetroleumMine.ProduceRate * secondDuration/3600 * accountZero.Achievement.Resource.Bonus * 2);
        }else if(((accountZero.Resource.Petroleum + parseInt(accountZero.PetroleumMine.ProduceRate * firstDuration/3600 * accountZero.Achievement.Resource.Bonus) + parseInt(accountZero.PetroleumMine.ProduceRate * secondDuration/3600 * accountZero.Achievement.Resource.Bonus * 2)) > accountZero.PetroleumStorage.Capacity)){
          accountData.PetroleumMine.CollectedResource = accountZero.PetroleumStorage.Capacity - accountZero.Resource.Petroleum;
        }
      }
      
      if(accountData.Resource.Petroleum >= accountZero.PetroleumStorage.Capacity){
        //do nothing
      }else if((accountData.Resource.Petroleum + accountData.PetroleumMine.CollectedResource) <= accountZero.PetroleumStorage.Capacity){
        accountData.Resource.Petroleum += accountData.PetroleumMine.CollectedResource
      }else{
        //remain
        accountData.Resource.Petroleum = accountZero.PetroleumStorage.Capacity
      }
      accountData.previousCollectTime = currentTimeInSeconds
      accountData.PetroleumMine.HistoryCollectedResource += accountData.PetroleumMine.CollectedResource
  
      //finished upgrade
      accountData.PetroleumMine.UpgradeCost_Status = false;
  
      accountData.PetroleumMine.Level += 1;
      accountData.PetroleumMine.ProduceRate === parseInt(0) ? accountData.PetroleumMine.ProduceRate = 120 : accountData.PetroleumMine.ProduceRate = accountZero.PetroleumMine.ProduceRate + accountZero.PetroleumMine.ProduceRate;
      accountData.PetroleumMine.UpgradeCost_Iron = accountZero.PetroleumMine.UpgradeCost_Iron + accountZero.PetroleumMine.UpgradeCost_Iron;
      accountData.PetroleumMine.UpgradeCost_Crystal = accountZero.PetroleumMine.UpgradeCost_Crystal + accountZero.PetroleumMine.UpgradeCost_Crystal;
      accountData.PetroleumMine.UpgradeCost_Time = accountZero.PetroleumMine.UpgradeCost_Time + accountZero.PetroleumMine.UpgradeCost_Time;
    }else{
      collectPetroleumMineResourceNonExport(accountData, accountZero,currentTimeInSeconds);
      accountData.previousCollectTime = currentTimeInSeconds
    }

}


module.exports = { initialize, registerAccount, loginAccount, changePasswordAccount, changeDisplayNameAccount, resetAccount, refreshAccount, upgradeIronMine, upgradeCrystalMine, upgradePetroleumMine, upgradeIronStorage, upgradeCrystalStorage, upgradePetroleumStorage, claimDailyReward, iron1000Test, spend100Test};