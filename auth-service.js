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
    "rewardDate" : {
      type: Date,
      default: previousDate
    },
    "loginBonus" : {
      type: Number,
      default: 0
    },
    "Actor": {
      "Iron": {
        type: Number,
        default: 2000000,
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
        default: 100,
      },
      "UpgradeCost_Iron":{
        type: Number,
        default: 100,
      },
      "UpgradeCost_Crystal":{
        type: Number,
        default: 10,
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
        default: 1000,
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

function refreshAccount(accountData){
  return new Promise(function (resolve, reject) {
    User.find({ _id: accountData._id }).exec()
    .then((account) => {
      if(account.length == 0){
        reject("Unable to find user: " + accountData.userName);
      }else{
        resolve(account[0]);
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
          if ((account[0].Actor.Iron - account[0].IronMine.UpgradeCost_Iron) >= 0 &&
              (account[0].Actor.Crystal - account[0].IronMine.UpgradeCost_Crystal) >= 0){
            const updateAccount = { 
              _id: account[0]._id,
              userName: account[0].userName,
              rewardDate: account[0].rewardDate,
              loginBonus: account[0].loginBonus,
              Actor: {
                Iron: account[0].Actor.Iron - account[0].IronMine.UpgradeCost_Iron,
                Crystal: account[0].Actor.Crystal - account[0].IronMine.UpgradeCost_Crystal,
                Petroleum: account[0].Actor.Petroleum
              },
              IronMine: {
                Name: account[0].IronMine.Name,
                Level: account[0].IronMine.Level + 1,
                ProduceRate: account[0].IronMine.ProduceRate + account[0].IronMine.ProduceRate,
                UpgradeCost_Iron: account[0].IronMine.UpgradeCost_Iron + account[0].IronMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronMine.UpgradeCost_Crystal + account[0].IronMine.UpgradeCost_Crystal,
              },
              IronStorage: {
                Name: account[0].IronStorage.Name,
                Level: account[0].IronStorage.Level,
                Capacity: account[0].IronStorage.Capacity,
                UpgradeCost_Iron: account[0].IronStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronStorage.UpgradeCost_Crystal
              },
              CrystalMine: {
                Name: account[0].CrystalMine.Name,
                Level: account[0].CrystalMine.Level,
                ProduceRate: account[0].CrystalMine.ProduceRate,
                UpgradeCost_Iron: account[0].CrystalMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalMine.UpgradeCost_Crystal
              },
              CrystalStorage: {
                Name: account[0].CrystalStorage.Name,
                Level: account[0].CrystalStorage.Level,
                Capacity: account[0].CrystalStorage.Capacity,
                UpgradeCost_Iron: account[0].CrystalStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalStorage.UpgradeCost_Crystal
              },
              PetroleumMine: {
                Name: account[0].PetroleumMine.Name,
                Level: account[0].PetroleumMine.Level,
                ProduceRate: account[0].PetroleumMine.ProduceRate,
                UpgradeCost_Iron: account[0].PetroleumMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumMine.UpgradeCost_Crystal
              },
              PetroleumStorage: {
                Name: account[0].PetroleumStorage.Name,
                Level: account[0].PetroleumStorage.Level,
                Capacity: account[0].PetroleumStorage.Capacity,
                UpgradeCost_Iron: account[0].PetroleumStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumStorage.UpgradeCost_Crystal
              }
            }
            User.updateOne(
              { _id: accountData._id }, updateAccount
            ).exec().then(() => {
                resolve(updateAccount);
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
          if ((account[0].Actor.Iron - account[0].CrystalMine.UpgradeCost_Iron) >= 0 &&
              (account[0].Actor.Crystal - account[0].CrystalMine.UpgradeCost_Crystal) >= 0){
            const updateAccount = { 
              _id: account[0]._id,
              userName: account[0].userName,
              rewardDate: account[0].rewardDate,
              loginBonus: account[0].loginBonus,
              Actor: {
                Iron: account[0].Actor.Iron - account[0].CrystalMine.UpgradeCost_Iron,
                Crystal: account[0].Actor.Crystal - account[0].CrystalMine.UpgradeCost_Crystal,
                Petroleum: account[0].Actor.Petroleum
              },
              IronMine: {
                Name: account[0].IronMine.Name,
                Level: account[0].IronMine.Level,
                ProduceRate: account[0].IronMine.ProduceRate,
                UpgradeCost_Iron: account[0].IronMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronMine.UpgradeCost_Crystal,
              },
              IronStorage: {
                Name: account[0].IronStorage.Name,
                Level: account[0].IronStorage.Level,
                Capacity: account[0].IronStorage.Capacity,
                UpgradeCost_Iron: account[0].IronStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronStorage.UpgradeCost_Crystal
              },
              CrystalMine: {
                Name: account[0].CrystalMine.Name,
                Level: account[0].CrystalMine.Level + 1,
                ProduceRate: account[0].CrystalMine.ProduceRate + account[0].CrystalMine.ProduceRate,
                UpgradeCost_Iron: account[0].CrystalMine.UpgradeCost_Iron + account[0].CrystalMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalMine.UpgradeCost_Crystal + account[0].CrystalMine.UpgradeCost_Crystal
              },
              CrystalStorage: {
                Name: account[0].CrystalStorage.Name,
                Level: account[0].CrystalStorage.Level,
                Capacity: account[0].CrystalStorage.Capacity,
                UpgradeCost_Iron: account[0].CrystalStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalStorage.UpgradeCost_Crystal
              },
              PetroleumMine: {
                Name: account[0].PetroleumMine.Name,
                Level: account[0].PetroleumMine.Level,
                ProduceRate: account[0].PetroleumMine.ProduceRate,
                UpgradeCost_Iron: account[0].PetroleumMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumMine.UpgradeCost_Crystal
              },
              PetroleumStorage: {
                Name: account[0].PetroleumStorage.Name,
                Level: account[0].PetroleumStorage.Level,
                Capacity: account[0].PetroleumStorage.Capacity,
                UpgradeCost_Iron: account[0].PetroleumStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumStorage.UpgradeCost_Crystal
              }
            }
            User.updateOne(
              { _id: accountData._id }, updateAccount
            ).exec().then(() => {
                resolve(updateAccount);
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
          if ((account[0].Actor.Iron - account[0].PetroleumMine.UpgradeCost_Iron) >= 0 &&
              (account[0].Actor.Crystal - account[0].PetroleumMine.UpgradeCost_Crystal) >= 0){
            const updateAccount = { 
              _id: account[0]._id,
              userName: account[0].userName,
              rewardDate: account[0].rewardDate,
              loginBonus: account[0].loginBonus,
              Actor: {
                Iron: account[0].Actor.Iron - account[0].PetroleumMine.UpgradeCost_Iron,
                Crystal: account[0].Actor.Crystal - account[0].PetroleumMine.UpgradeCost_Crystal,
                Petroleum: account[0].Actor.Petroleum
              },
              IronMine: {
                Name: account[0].IronMine.Name,
                Level: account[0].IronMine.Level,
                ProduceRate: account[0].IronMine.ProduceRate,
                UpgradeCost_Iron: account[0].IronMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronMine.UpgradeCost_Crystal,
              },
              IronStorage: {
                Name: account[0].IronStorage.Name,
                Level: account[0].IronStorage.Level,
                Capacity: account[0].IronStorage.Capacity,
                UpgradeCost_Iron: account[0].IronStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronStorage.UpgradeCost_Crystal
              },
              CrystalMine: {
                Name: account[0].CrystalMine.Name,
                Level: account[0].CrystalMine.Level,
                ProduceRate: account[0].CrystalMine.ProduceRate,
                UpgradeCost_Iron: account[0].CrystalMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalMine.UpgradeCost_Crystal
              },
              CrystalStorage: {
                Name: account[0].CrystalStorage.Name,
                Level: account[0].CrystalStorage.Level,
                Capacity: account[0].CrystalStorage.Capacity,
                UpgradeCost_Iron: account[0].CrystalStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalStorage.UpgradeCost_Crystal
              },
              PetroleumMine: {
                Name: account[0].PetroleumMine.Name,
                Level: account[0].PetroleumMine.Level + 1,
                ProduceRate: account[0].PetroleumMine.ProduceRate + account[0].PetroleumMine.ProduceRate,
                UpgradeCost_Iron: account[0].PetroleumMine.UpgradeCost_Iron + account[0].PetroleumMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumMine.UpgradeCost_Crystal + account[0].PetroleumMine.UpgradeCost_Crystal
              },
              PetroleumStorage: {
                Name: account[0].PetroleumStorage.Name,
                Level: account[0].PetroleumStorage.Level,
                Capacity: account[0].PetroleumStorage.Capacity,
                UpgradeCost_Iron: account[0].PetroleumStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumStorage.UpgradeCost_Crystal
              }
            }
            User.updateOne(
              { _id: accountData._id }, updateAccount
            ).exec().then(() => {
                resolve(updateAccount);
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
          if ((account[0].Actor.Iron - account[0].IronStorage.UpgradeCost_Iron) >= 0 &&
              (account[0].Actor.Crystal - account[0].IronStorage.UpgradeCost_Crystal) >= 0){
            const updateAccount = { 
              _id: account[0]._id,
              userName: account[0].userName,
              rewardDate: account[0].rewardDate,
              loginBonus: account[0].loginBonus,
              Actor: {
                Iron: account[0].Actor.Iron - account[0].IronStorage.UpgradeCost_Iron,
                Crystal: account[0].Actor.Crystal - account[0].IronStorage.UpgradeCost_Crystal,
                Petroleum: account[0].Actor.Petroleum
              },
              IronMine: {
                Name: account[0].IronMine.Name,
                Level: account[0].IronMine.Level,
                ProduceRate: account[0].IronMine.ProduceRate,
                UpgradeCost_Iron: account[0].IronMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronMine.UpgradeCost_Crystal,
              },
              IronStorage: {
                Name: account[0].IronStorage.Name,
                Level: account[0].IronStorage.Level + 1,
                Capacity: account[0].IronStorage.Capacity + account[0].IronStorage.Capacity,
                UpgradeCost_Iron: account[0].IronStorage.UpgradeCost_Iron + account[0].IronStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronStorage.UpgradeCost_Crystal + account[0].IronStorage.UpgradeCost_Crystal
              },
              CrystalMine: {
                Name: account[0].CrystalMine.Name,
                Level: account[0].CrystalMine.Level,
                ProduceRate: account[0].CrystalMine.ProduceRate,
                UpgradeCost_Iron: account[0].CrystalMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalMine.UpgradeCost_Crystal
              },
              CrystalStorage: {
                Name: account[0].CrystalStorage.Name,
                Level: account[0].CrystalStorage.Level,
                Capacity: account[0].CrystalStorage.Capacity,
                UpgradeCost_Iron: account[0].CrystalStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalStorage.UpgradeCost_Crystal
              },
              PetroleumMine: {
                Name: account[0].PetroleumMine.Name,
                Level: account[0].PetroleumMine.Level,
                ProduceRate: account[0].PetroleumMine.ProduceRate,
                UpgradeCost_Iron: account[0].PetroleumMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumMine.UpgradeCost_Crystal
              },
              PetroleumStorage: {
                Name: account[0].PetroleumStorage.Name,
                Level: account[0].PetroleumStorage.Level,
                Capacity: account[0].PetroleumStorage.Capacity,
                UpgradeCost_Iron: account[0].PetroleumStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumStorage.UpgradeCost_Crystal
              }
            }
            User.updateOne(
              { _id: accountData._id }, updateAccount
            ).exec().then(() => {
                resolve(updateAccount);
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
          if ((account[0].Actor.Iron - account[0].CrystalStorage.UpgradeCost_Iron) >= 0 &&
              (account[0].Actor.Crystal - account[0].CrystalStorage.UpgradeCost_Crystal) >= 0){
            const updateAccount = { 
              _id: account[0]._id,
              userName: account[0].userName,
              rewardDate: account[0].rewardDate,
              loginBonus: account[0].loginBonus,
              Actor: {
                Iron: account[0].Actor.Iron - account[0].CrystalStorage.UpgradeCost_Iron,
                Crystal: account[0].Actor.Crystal - account[0].CrystalStorage.UpgradeCost_Crystal,
                Petroleum: account[0].Actor.Petroleum
              },
              IronMine: {
                Name: account[0].IronMine.Name,
                Level: account[0].IronMine.Level,
                ProduceRate: account[0].IronMine.ProduceRate,
                UpgradeCost_Iron: account[0].IronMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronMine.UpgradeCost_Crystal,
              },
              IronStorage: {
                Name: account[0].IronStorage.Name,
                Level: account[0].IronStorage.Level,
                Capacity: account[0].IronStorage.Capacity,
                UpgradeCost_Iron: account[0].IronStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronStorage.UpgradeCost_Crystal
              },
              CrystalMine: {
                Name: account[0].CrystalMine.Name,
                Level: account[0].CrystalMine.Level,
                ProduceRate: account[0].CrystalMine.ProduceRate,
                UpgradeCost_Iron: account[0].CrystalMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalMine.UpgradeCost_Crystal
              },
              CrystalStorage: {
                Name: account[0].CrystalStorage.Name,
                Level: account[0].CrystalStorage.Level + 1,
                Capacity: account[0].CrystalStorage.Capacity + account[0].CrystalStorage.Capacity,
                UpgradeCost_Iron: account[0].CrystalStorage.UpgradeCost_Iron + account[0].CrystalStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalStorage.UpgradeCost_Crystal + account[0].CrystalStorage.UpgradeCost_Crystal
              },
              PetroleumMine: {
                Name: account[0].PetroleumMine.Name,
                Level: account[0].PetroleumMine.Level,
                ProduceRate: account[0].PetroleumMine.ProduceRate,
                UpgradeCost_Iron: account[0].PetroleumMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumMine.UpgradeCost_Crystal
              },
              PetroleumStorage: {
                Name: account[0].PetroleumStorage.Name,
                Level: account[0].PetroleumStorage.Level,
                Capacity: account[0].PetroleumStorage.Capacity,
                UpgradeCost_Iron: account[0].PetroleumStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumStorage.UpgradeCost_Crystal
              }
            }
            User.updateOne(
              { _id: accountData._id }, updateAccount
            ).exec().then(() => {
                resolve(updateAccount);
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
          if ((account[0].Actor.Iron - account[0].PetroleumStorage.UpgradeCost_Iron) >= 0 &&
              (account[0].Actor.Crystal - account[0].PetroleumStorage.UpgradeCost_Crystal) >= 0){
            const updateAccount = { 
              _id: account[0]._id,
              userName: account[0].userName,
              rewardDate: account[0].rewardDate,
              loginBonus: account[0].loginBonus,
              Actor: {
                Iron: account[0].Actor.Iron - account[0].PetroleumStorage.UpgradeCost_Iron,
                Crystal: account[0].Actor.Crystal - account[0].PetroleumStorage.UpgradeCost_Crystal,
                Petroleum: account[0].Actor.Petroleum
              },
              IronMine: {
                Name: account[0].IronMine.Name,
                Level: account[0].IronMine.Level,
                ProduceRate: account[0].IronMine.ProduceRate,
                UpgradeCost_Iron: account[0].IronMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronMine.UpgradeCost_Crystal,
              },
              IronStorage: {
                Name: account[0].IronStorage.Name,
                Level: account[0].IronStorage.Level,
                Capacity: account[0].IronStorage.Capacity,
                UpgradeCost_Iron: account[0].IronStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronStorage.UpgradeCost_Crystal
              },
              CrystalMine: {
                Name: account[0].CrystalMine.Name,
                Level: account[0].CrystalMine.Level,
                ProduceRate: account[0].CrystalMine.ProduceRate,
                UpgradeCost_Iron: account[0].CrystalMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalMine.UpgradeCost_Crystal
              },
              CrystalStorage: {
                Name: account[0].CrystalStorage.Name,
                Level: account[0].CrystalStorage.Level,
                Capacity: account[0].CrystalStorage.Capacity,
                UpgradeCost_Iron: account[0].CrystalStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalStorage.UpgradeCost_Crystal 
              },
              PetroleumMine: {
                Name: account[0].PetroleumMine.Name,
                Level: account[0].PetroleumMine.Level,
                ProduceRate: account[0].PetroleumMine.ProduceRate,
                UpgradeCost_Iron: account[0].PetroleumMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumMine.UpgradeCost_Crystal
              },
              PetroleumStorage: {
                Name: account[0].PetroleumStorage.Name,
                Level: account[0].PetroleumStorage.Level + 1,
                Capacity: account[0].PetroleumStorage.Capacity + account[0].PetroleumStorage.Capacity,
                UpgradeCost_Iron: account[0].PetroleumStorage.UpgradeCost_Iron + account[0].PetroleumStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumStorage.UpgradeCost_Crystal + account[0].PetroleumStorage.UpgradeCost_Crystal
              }
            }
            User.updateOne(
              { _id: accountData._id }, updateAccount
            ).exec().then(() => {
                resolve(updateAccount);
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
          if ((account[0].rewardDate !== previousDate) && (today === account[0].rewardDate.toLocaleDateString())){
            reject("You have already claimed the reward today.");
          }else{
            //----Count Bonus----
            let bonusCount = account[0].loginBonus
            if(account[0].rewardDate === previousDate){
              ++bonusCount;
            }else{
              bonusCount = 1;
            }
            //---------------------
            const updateAccount = { 
              _id: account[0]._id,
              userName: account[0].userName,
              rewardDate: today,
              loginBonus: bonusCount,
              Actor: {
                Iron: account[0].Actor.Iron + (125 * bonusCount),
                Crystal: account[0].Actor.Crystal + (125 * bonusCount),
                Petroleum: account[0].Actor.Petroleum + (125 * bonusCount)
              },
              IronMine: {
                Name: account[0].IronMine.Name,
                Level: account[0].IronMine.Level,
                ProduceRate: account[0].IronMine.ProduceRate,
                UpgradeCost_Iron: account[0].IronMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronMine.UpgradeCost_Crystal,
              },
              IronStorage: {
                Name: account[0].IronStorage.Name,
                Level: account[0].IronStorage.Level,
                Capacity: account[0].IronStorage.Capacity,
                UpgradeCost_Iron: account[0].IronStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronStorage.UpgradeCost_Crystal
              },
              CrystalMine: {
                Name: account[0].CrystalMine.Name,
                Level: account[0].CrystalMine.Level,
                ProduceRate: account[0].CrystalMine.ProduceRate,
                UpgradeCost_Iron: account[0].CrystalMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalMine.UpgradeCost_Crystal
              },
              CrystalStorage: {
                Name: account[0].CrystalStorage.Name,
                Level: account[0].CrystalStorage.Level,
                Capacity: account[0].CrystalStorage.Capacity,
                UpgradeCost_Iron: account[0].CrystalStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalStorage.UpgradeCost_Crystal 
              },
              PetroleumMine: {
                Name: account[0].PetroleumMine.Name,
                Level: account[0].PetroleumMine.Level,
                ProduceRate: account[0].PetroleumMine.ProduceRate,
                UpgradeCost_Iron: account[0].PetroleumMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumMine.UpgradeCost_Crystal
              },
              PetroleumStorage: {
                Name: account[0].PetroleumStorage.Name,
                Level: account[0].PetroleumStorage.Level,
                Capacity: account[0].PetroleumStorage.Capacity,
                UpgradeCost_Iron: account[0].PetroleumStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumStorage.UpgradeCost_Crystal
              }
            }
            User.updateOne(
              { _id: accountData._id }, updateAccount
            ).exec().then(() => {
                resolve(updateAccount);
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
          if ((account[0].Actor.Iron - account[0].PetroleumStorage.UpgradeCost_Iron) >= 0 &&
              (account[0].Actor.Crystal - account[0].PetroleumStorage.UpgradeCost_Crystal) >= 0){
            const updateAccount = { 
              _id: account[0]._id,
              userName: account[0].userName,
              rewardDate: account[0].rewardDate,
              loginBonus: account[0].loginBonus,
              Actor: {
                Iron: account[0].Actor.Iron - account[0].PetroleumStorage.UpgradeCost_Iron,
                Crystal: account[0].Actor.Crystal - account[0].PetroleumStorage.UpgradeCost_Crystal,
                Petroleum: account[0].Actor.Petroleum
              },
              IronMine: {
                Name: account[0].IronMine.Name,
                Level: account[0].IronMine.Level,
                ProduceRate: account[0].IronMine.ProduceRate,
                UpgradeCost_Iron: account[0].IronMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronMine.UpgradeCost_Crystal,
              },
              IronStorage: {
                Name: account[0].IronStorage.Name,
                Level: account[0].IronStorage.Level,
                Capacity: account[0].IronStorage.Capacity,
                UpgradeCost_Iron: account[0].IronStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].IronStorage.UpgradeCost_Crystal
              },
              CrystalMine: {
                Name: account[0].CrystalMine.Name,
                Level: account[0].CrystalMine.Level,
                ProduceRate: account[0].CrystalMine.ProduceRate,
                UpgradeCost_Iron: account[0].CrystalMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalMine.UpgradeCost_Crystal
              },
              CrystalStorage: {
                Name: account[0].CrystalStorage.Name,
                Level: account[0].CrystalStorage.Level,
                Capacity: account[0].CrystalStorage.Capacity,
                UpgradeCost_Iron: account[0].CrystalStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].CrystalStorage.UpgradeCost_Crystal 
              },
              PetroleumMine: {
                Name: account[0].PetroleumMine.Name,
                Level: account[0].PetroleumMine.Level,
                ProduceRate: account[0].PetroleumMine.ProduceRate,
                UpgradeCost_Iron: account[0].PetroleumMine.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumMine.UpgradeCost_Crystal
              },
              PetroleumStorage: {
                Name: account[0].PetroleumStorage.Name,
                Level: account[0].PetroleumStorage.Level + 1,
                Capacity: account[0].PetroleumStorage.Capacity + account[0].PetroleumStorage.Capacity,
                UpgradeCost_Iron: account[0].PetroleumStorage.UpgradeCost_Iron + account[0].PetroleumStorage.UpgradeCost_Iron,
                UpgradeCost_Crystal: account[0].PetroleumStorage.UpgradeCost_Crystal + account[0].PetroleumStorage.UpgradeCost_Crystal
              }
            }
            User.updateOne(
              { _id: accountData._id }, updateAccount
            ).exec().then(() => {
                resolve(updateAccount);
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

module.exports = { initialize, registerAccount, loginAccount, changePasswordAccount, refreshAccount, upgradeIronMine, upgradeCrystalMine, upgradePetroleumMine, upgradeIronStorage, upgradeCrystalStorage, upgradePetroleumStorage, claimDailyReward, collectAllResource};