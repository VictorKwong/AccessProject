var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

//Set daily reward-----------
var todayDate = new Date();
todayDate.setDate(todayDate.getDate() - 1);
var previousDate = todayDate.toLocaleDateString();
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
        default: 1000000,
        min: 0
      },
      "Petroleum": {
        type: Number,
        default: 50,
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
      "Capacity":{
        type: Number,
        default: 1000 
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
      }
    },
    "CrystalMine": {
      "Name": {
        type: String,
        default: "Crystal Mine"
      },
      "Level": {
        type: Number,
        default: 1,
      },
      "ProduceRate":{
        type: Number,
        default: 100,
      },
      "UpgradeCost_Iron":{
        type: Number,
        default: 50,
      },
      "UpgradeCost_Crystal":{
        type: Number,
        default: 50,
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
        default: 1000,
      },
      "UpgradeCost_Iron":{
        type: Number,
        default: 10,
      },
      "UpgradeCost_Crystal":{
        type: Number,
        default: 10,
      }
    },
    "PetroleumMine": {
      "Name": {
        type: String,
        default: "Petroleum Mine"
      },
      "Level": {
        type: Number,
        default: 1,
      },
      "ProduceRate":{
        type: Number,
        default: 100,
      },
      "UpgradeCost_Iron":{
        type: Number,
        default: 50,
      },
      "UpgradeCost_Crystal":{
        type: Number,
        default: 50
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
        default: 10,
      },
      "UpgradeCost_Crystal":{
        type: Number,
        default: 10,
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
          "Amount": { type: Number, default: 0 }
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
           User = db.model("UserAccount", userSchema);
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
            let duration = currentTimeInSeconds - account[0].previousCollectTime;

            account[0].IronMine.CollectedResource = 0;
            if(account[0].Resource.Iron >= account[0].IronStorage.Capacity){
              account[0].IronMine.CollectedResource = 0;
            }else if(((account[0].Resource.Iron + parseInt(account[0].IronMine.ProduceRate * duration/3600 * account[0].Achievement.Resource.Bonus)) <= account[0].IronStorage.Capacity)){
              //determine how many thing that we can collect
              account[0].IronMine.CollectedResource = parseInt(account[0].IronMine.ProduceRate * duration/3600 * account[0].Achievement.Resource.Bonus);
            }else if(((account[0].Resource.Iron + parseInt(account[0].IronMine.ProduceRate * duration/3600 * account[0].Achievement.Resource.Bonus)) > account[0].IronStorage.Capacity)){
              account[0].IronMine.CollectedResource = account[0].IronStorage.Capacity - account[0].Resource.Iron;
            }
            //determine how many things that can store
            //update accountData.Resource.Iron
            (account[0].Resource.Iron + account[0].IronMine.CollectedResource) <= account[0].IronStorage.Capacity ? account[0].Resource.Iron += account[0].IronMine.CollectedResource : account[0].Resource.Iron = account[0].IronStorage.Capacity
            
            account[0].previousCollectTime = currentTimeInSeconds
            account[0].IronMine.HistoryCollectedResource += account[0].IronMine.CollectedResource


            resolve(account[0]);
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
            accountData.IronMine.Capacity = 1000
            accountData.IronMine.CollectedResource = 0
            accountData.IronMine.HistoryCollectedResource = 0
            accountData.IronMine.UpgradeCost_Iron = 100
            accountData.IronMine.UpgradeCost_Crystal = 10
            accountData.IronMine.UpgradeCost_Time = 5
            accountData.IronMine.UpgradeCost_TimeStart = Math.floor(Date.now() / 1000)
            accountData.IronMine.UpgradeCost_Status = false
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
        let duration = currentTimeInSeconds - account[0].previousCollectTime;
        //clear out the current resource first
        accountData.IronMine.CollectedResource = 0;

        if(account[0].Resource.Iron >= account[0].IronStorage.Capacity){
          accountData.IronMine.CollectedResource = 0;
        }else if(((account[0].Resource.Iron + parseInt(account[0].IronMine.ProduceRate * duration/3600 * account[0].Achievement.Resource.Bonus)) <= account[0].IronStorage.Capacity)){
          //determine how many thing that we can collect
          accountData.IronMine.CollectedResource = parseInt(account[0].IronMine.ProduceRate * duration/3600 * account[0].Achievement.Resource.Bonus);
        }else if(((account[0].Resource.Iron + parseInt(account[0].IronMine.ProduceRate * duration/3600 * account[0].Achievement.Resource.Bonus)) > account[0].IronStorage.Capacity)){
          accountData.IronMine.CollectedResource = account[0].IronStorage.Capacity - account[0].Resource.Iron;
        }
        //determine how many things that can store
        //update accountData.Resource.Iron
        if(accountData.Resource.Iron >= account[0].IronStorage.Capacity){
          //do nothing
        }else if((accountData.Resource.Iron + accountData.IronMine.CollectedResource) <= account[0].IronStorage.Capacity){
          accountData.Resource.Iron += accountData.IronMine.CollectedResource
        }else{
          //remain
          accountData.Resource.Iron = account[0].IronStorage.Capacity
        }
        accountData.previousCollectTime = currentTimeInSeconds
        accountData.IronMine.HistoryCollectedResource += accountData.IronMine.CollectedResource

        if(((currentTimeInSeconds - accountData.IronMine.UpgradeCost_TimeStart) >= accountData.IronMine.UpgradeCost_Time) && accountData.IronMine.UpgradeCost_Status){
          //collect calculation
          let firstDuration = accountData.IronMine.UpgradeCost_TimeStart + accountData.IronMine.UpgradeCost_Time - account[0].previousCollectTime;
          let secondDuration = currentTimeInSeconds - firstDuration;
          //continue========================================================

          if(account[0].Resource.Iron >= account[0].IronStorage.Capacity){
            accountData.IronMine.CollectedResource = 0;
          }else if(((account[0].Resource.Iron + parseInt(account[0].IronMine.ProduceRate * duration/3600 * account[0].Achievement.Resource.Bonus)) <= account[0].IronStorage.Capacity)){
            //determine how many thing that we can collect
            accountData.IronMine.CollectedResource = parseInt(account[0].IronMine.ProduceRate * duration/3600 * account[0].Achievement.Resource.Bonus);
          }else if(((account[0].Resource.Iron + parseInt(account[0].IronMine.ProduceRate * duration/3600 * account[0].Achievement.Resource.Bonus)) > account[0].IronStorage.Capacity)){
            accountData.IronMine.CollectedResource = account[0].IronStorage.Capacity - account[0].Resource.Iron;
          }

          //finished upgrade
          accountData.IronMine.UpgradeCost_Status = false;

          accountData.IronMine.Level += 1;
          accountData.IronMine.ProduceRate = account[0].IronMine.ProduceRate + account[0].IronMine.ProduceRate;
          accountData.IronMine.Capacity = account[0].IronMine.Capacity + account[0].IronMine.Capacity;
          accountData.IronMine.UpgradeCost_Iron = account[0].IronMine.UpgradeCost_Iron + account[0].IronMine.UpgradeCost_Iron;
          accountData.IronMine.UpgradeCost_Crystal = account[0].IronMine.UpgradeCost_Crystal + account[0].IronMine.UpgradeCost_Crystal;
          accountData.IronMine.UpgradeCost_Time = account[0].IronMine.UpgradeCost_Time + account[0].IronMine.UpgradeCost_Time;
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
                accountData.CrystalMine.Level += 1;
                accountData.CrystalMine.ProduceRate = account[0].CrystalMine.ProduceRate + account[0].CrystalMine.ProduceRate;
                accountData.CrystalMine.UpgradeCost_Iron = account[0].CrystalMine.UpgradeCost_Iron + account[0].CrystalMine.UpgradeCost_Iron;
                accountData.CrystalMine.UpgradeCost_Crystal = account[0].CrystalMine.UpgradeCost_Crystal + account[0].CrystalMine.UpgradeCost_Crystal;
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
                accountData.PetroleumMine.Level += 1;
                accountData.PetroleumMine.ProduceRate = account[0].PetroleumMine.ProduceRate + account[0].PetroleumMine.ProduceRate;
                accountData.PetroleumMine.UpgradeCost_Iron = account[0].PetroleumMine.UpgradeCost_Iron + account[0].PetroleumMine.UpgradeCost_Iron;
                accountData.PetroleumMine.UpgradeCost_Crystal = account[0].PetroleumMine.UpgradeCost_Crystal + account[0].PetroleumMine.UpgradeCost_Crystal;

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
                accountData.IronStorage.Level += 1;
                accountData.IronStorage.ProduceRate = account[0].IronStorage.ProduceRate + account[0].IronStorage.ProduceRate;
                accountData.IronStorage.UpgradeCost_Iron = account[0].IronStorage.UpgradeCost_Iron + account[0].IronStorage.UpgradeCost_Iron;
                accountData.IronStorage.UpgradeCost_Crystal = account[0].IronStorage.UpgradeCost_Crystal + account[0].IronStorage.UpgradeCost_Crystal;

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
                accountData.CrystalStorage.Level += 1;
                accountData.CrystalStorage.ProduceRate = account[0].CrystalStorage.ProduceRate + account[0].CrystalStorage.ProduceRate;
                accountData.CrystalStorage.UpgradeCost_Iron = account[0].CrystalStorage.UpgradeCost_Iron + account[0].CrystalStorage.UpgradeCost_Iron;
                accountData.CrystalStorage.UpgradeCost_Crystal = account[0].CrystalStorage.UpgradeCost_Crystal + account[0].CrystalStorage.UpgradeCost_Crystal;

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
                accountData.PetroleumStorage.Level += 1;
                accountData.PetroleumStorage.ProduceRate = account[0].PetroleumStorage.ProduceRate + account[0].PetroleumStorage.ProduceRate;
                accountData.PetroleumStorage.UpgradeCost_Iron = account[0].PetroleumStorage.UpgradeCost_Iron + account[0].PetroleumStorage.UpgradeCost_Iron;
                accountData.PetroleumStorage.UpgradeCost_Crystal = account[0].PetroleumStorage.UpgradeCost_Crystal + account[0].PetroleumStorage.UpgradeCost_Crystal;

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
            //---------------------
            // const updateAccount = { 
            //   _id: account[0]._id,
            //   userName: account[0].userName,
            //   rewardDate: today,
            //   loginBonus: bonusCount,
            //   Resource: {
            //     Iron: account[0].Resource.Iron + (7000 * bonusCount),
            //     Crystal: account[0].Resource.Crystal + (7000 * bonusCount),
            //     Petroleum: account[0].Resource.Petroleum + (3500 * bonusCount)
            //   },
            //   IronMine: {
            //     Name: account[0].IronMine.Name,
            //     Level: account[0].IronMine.Level,
            //     ProduceRate: account[0].IronMine.ProduceRate,
            //     UpgradeCost_Iron: account[0].IronMine.UpgradeCost_Iron,
            //     UpgradeCost_Crystal: account[0].IronMine.UpgradeCost_Crystal,
            //   },
            //   IronStorage: {
            //     Name: account[0].IronStorage.Name,
            //     Level: account[0].IronStorage.Level,
            //     Capacity: account[0].IronStorage.Capacity,
            //     UpgradeCost_Iron: account[0].IronStorage.UpgradeCost_Iron,
            //     UpgradeCost_Crystal: account[0].IronStorage.UpgradeCost_Crystal
            //   },
            //   CrystalMine: {
            //     Name: account[0].CrystalMine.Name,
            //     Level: account[0].CrystalMine.Level,
            //     ProduceRate: account[0].CrystalMine.ProduceRate,
            //     UpgradeCost_Iron: account[0].CrystalMine.UpgradeCost_Iron,
            //     UpgradeCost_Crystal: account[0].CrystalMine.UpgradeCost_Crystal
            //   },
            //   CrystalStorage: {
            //     Name: account[0].CrystalStorage.Name,
            //     Level: account[0].CrystalStorage.Level,
            //     Capacity: account[0].CrystalStorage.Capacity,
            //     UpgradeCost_Iron: account[0].CrystalStorage.UpgradeCost_Iron,
            //     UpgradeCost_Crystal: account[0].CrystalStorage.UpgradeCost_Crystal 
            //   },
            //   PetroleumMine: {
            //     Name: account[0].PetroleumMine.Name,
            //     Level: account[0].PetroleumMine.Level,
            //     ProduceRate: account[0].PetroleumMine.ProduceRate,
            //     UpgradeCost_Iron: account[0].PetroleumMine.UpgradeCost_Iron,
            //     UpgradeCost_Crystal: account[0].PetroleumMine.UpgradeCost_Crystal
            //   },
            //   PetroleumStorage: {
            //     Name: account[0].PetroleumStorage.Name,
            //     Level: account[0].PetroleumStorage.Level,
            //     Capacity: account[0].PetroleumStorage.Capacity,
            //     UpgradeCost_Iron: account[0].PetroleumStorage.UpgradeCost_Iron,
            //     UpgradeCost_Crystal: account[0].PetroleumStorage.UpgradeCost_Crystal
            //   },
            //   ItemBag: {
            //     Resource : {
            //         "Iron1000" : { "Name": account[0].ItemBag.Resource.Iron1000.Name, "Amount": account[0].ItemBag.Resource.Iron1000.Amount },
            //         "Crystal1000" : { "Name": account[0].ItemBag.Resource.Crystal1000.Name, "Amount": account[0].ItemBag.Resource.Crystal1000.Amount },
            //         "Petroleum200" : { "Name": account[0].ItemBag.Resource.Petroleum200.Name, "Amount": account[0].ItemBag.Resource.Petroleum200.Amount }
            //     },
            //     Materials : {
            //         "TextileFibers" : { "Name": account[0].ItemBag.Materials.TextileFibers.Name, "Amount": account[0].ItemBag.Materials.TextileFibers.Amount },
            //         "CarbonSteel" : { "Name": account[0].ItemBag.Materials.CarbonSteel.Name, "Amount": account[0].ItemBag.Materials.CarbonSteel.Amount }
            //     }
            //   }
            // }
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

//Need QC
function collectAllResource(accountData){
  return new Promise(function (resolve, reject) {
    User.find({ _id: accountData._id }).exec()
    .then((account) => {

            let currentTime = Date.now();
            let currentTimeInSeconds = Math.floor(currentTime / 1000);

            let duration = currentTimeInSeconds - account[0].previousCollectTime;

            accountData.IronMine.CollectedResource = 0;

            if((accountData.Resource.Iron < account[0].IronStorage.Capacity) && parseInt(account[0].IronMine.ProduceRate * duration/3600) > 0){
              //Achievement
              if(!account[0].Achievement.Resource.FirstCollect.Bool){
                accountData.Achievement.Resource.FirstCollect.Bool = true;
                accountData.Achievement.Resource.Bonus *= 10;
              }
              //determine how many thing that we can collect
              parseInt(account[0].IronMine.ProduceRate * duration/3600 * accountData.Achievement.Resource.Bonus) <= account[0].IronMine.Capacity ? accountData.IronMine.CollectedResource = parseInt(account[0].IronMine.ProduceRate * duration/3600 * accountData.Achievement.Resource.Bonus) : accountData.IronMine.CollectedResource = account[0].IronMine.Capacity;

              //determine how many things that can store
              //update accountData.Resource.Iron
              (accountData.Resource.Iron + accountData.IronMine.CollectedResource) <= account[0].IronStorage.Capacity ? accountData.Resource.Iron += accountData.IronMine.CollectedResource : accountData.Resource.Iron = account[0].IronStorage.Capacity
              //update accountData.IronMine.CollectedResource
              (accountData.Resource.Iron + accountData.IronMine.CollectedResource) <= account[0].IronStorage.Capacity ? accountData.IronMine.CollectedResource : accountData.IronMine.CollectedResource = account[0].IronStorage.Capacity - accountData.Resource.Iron
              //update
              accountData.previousCollectTime = currentTimeInSeconds
              accountData.IronMine.HistoryCollectedResource += accountData.IronMine.CollectedResource
              User.updateOne(
                { _id: accountData._id }, accountData
              ).exec().then(() => {
                  resolve(accountData);
              }).catch((err) => {
                  reject("Can't collect resource: " + err);
              })
            } else if(parseInt(account[0].IronMine.ProduceRate * duration/3600) <= 0){
              //No resource to collect
              resolve(accountData);
            }else{
              //Storage is full bug
              reject("Storage is full, please upgrade it!");
            }
    }).catch((err) => {
        reject(`Unable to find user - ${accountData.userName}: ${err}`);
    });

  });
}

//Non-Export function
function collectAllResourceNonExport(accountData, accountZero){
  let currentTime = Date.now();
  let currentTimeInSeconds = Math.floor(currentTime / 1000);
  let duration = currentTimeInSeconds - accountZero.previousCollectTime;
  //clear out the current resource first
  accountData.IronMine.CollectedResource = 0;

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
  (accountData.Resource.Iron + accountData.IronMine.CollectedResource) <= accountZero.IronStorage.Capacity ? accountData.Resource.Iron += accountData.IronMine.CollectedResource : accountData.Resource.Iron = accountZero.IronStorage.Capacity

  accountData.previousCollectTime = currentTimeInSeconds
  accountData.IronMine.HistoryCollectedResource += accountData.IronMine.CollectedResource
}


module.exports = { initialize, registerAccount, loginAccount, changePasswordAccount, changeDisplayNameAccount, resetAccount, refreshAccount, upgradeIronMine, upgradeCrystalMine, upgradePetroleumMine, upgradeIronStorage, upgradeCrystalStorage, upgradePetroleumStorage, claimDailyReward, collectAllResource};