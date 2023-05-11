var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

var userSchema = new Schema({
    "userName":  {
      type: String,
      unique: true
    },
    "password": String,
    "Actor": {
      "Iron": {
        type: Number,
        default: 500,
        min: 0
      },
      "Crystal": {
        type: Number,
        default: 100,
        min: 0
      },
      "Petroleum": {
        type: Number,
        default: 50,
        min: 0
      }
    },
    "IronMine_1": {
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
      "Capacity":{
        type: Number,
        default: 1000,
      },
      "UpgradeCost":{
        type: Number,
        default: 10,
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
            User.updateOne(
              { userName: account[0].userName,
                Actor: {
                  Iron: account[0].Actor.Iron,
                  Crystal: account[0].Actor.Crystal,
                  Petroleum: account[0].Actor.Petroleum
                },
                IronMine_1: {
                  Name: account[0].IronMine_1.Name,
                  Level: account[0].IronMine_1.Level,
                  ProduceRate: account[0].IronMine_1.ProduceRate,
                  Capacity: account[0].IronMine_1.Capacity,
                  UpgradeCost: account[0].IronMine_1.UpgradeCost
                }
              }
            ).exec().then(() => {
                resolve(account[0]);
            }).catch((err) => {
                reject("There was an error verifying the user:" + err);
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
        reject(`Unable to find user - ${userData.userName}: ${err}`);
    });

  });
}


module.exports = { initialize, registerAccount, loginAccount};