
function initialize() {
    console.log("test")
    return new Promise(function(resolve, reject){
        resolve();
    })
}

module.exports = { initialize };