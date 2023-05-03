var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

var userSchema = new Schema({
    "userName":  {
      type: String,
      "unique": true
    },
    "password": String
});

let User;

function initialize () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://Victor:7OkL03vI5PTE9FlJ@lentil.1fev0.mongodb.net/access-project");
  
        db.on('error', (err)=>{
            reject(err);
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
  };

module.exports = { initialize };