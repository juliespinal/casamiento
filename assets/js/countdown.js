var date = document.getElementById("countdown").getAttribute('data-init-value');
var end = new Date(date);

var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;
var timer;

function showRemaining() {
    var now = new Date();
    var distance = end - now;
    var days = Math.floor(distance / _day);
    var hours = Math.floor((distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);
    if (distance < 0) {
        document.getElementById("days").innerHTML = 0;
        document.getElementById("hs").innerHTML = 0;
        document.getElementById("min").innerHTML = 0;
        document.getElementById("seg").innerHTML = 0;
    } else {
        document.getElementById("days").innerHTML = days;
        document.getElementById("hs").innerHTML = hours;
        document.getElementById("min").innerHTML = minutes;
        document.getElementById("seg").innerHTML = seconds;
    }

}

timer = setInterval(showRemaining, 1000);