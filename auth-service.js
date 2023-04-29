
function Rock() {
    console.log("reset")
    return new Promise(function(resolve, reject){
        resolve();
    })
}

module.exports = { Rock };