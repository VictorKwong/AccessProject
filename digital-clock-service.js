function ticTok(){
    setInterval(function() {
        let today = new Date();
        let hour = today.getHours();
        let min = today.getMinutes();
        let sec = today.getSeconds();
        let ampm;
        if(hour > 12){
          hour = hour - 12;
          ampm = "PM";
        }else{
          ampm = "AM";
        }
        document.querySelector('.clock-js').textContent = addZero(hour) + ":" + addZero(min) + ":" + addZero(sec) + " " + ampm;
          sec = sec + 1;
          if(sec >= 60){
            sec = 0;
            min = min + 1;
          }
          if(min >= 60){
            min = 0;
            hour = hour + 1;
          }
          if(hour > 12){
            hour = 0;
            if(ampm === "AM"){
              ampm = "PM";
            }else{
              ampm = "AM";
            }
          }
        }, 1000);
}
function addZero(){
    if(num < 10){
      num = "0" + num;
    }
    return num;
}

ticTok();