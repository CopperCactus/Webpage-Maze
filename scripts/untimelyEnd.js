document.addEventListener("DOMContentLoaded", function () {
    let timer = 0;
    var carSound = document.getElementById("car-pulling-up-sound");
    var defibSound = document.getElementById("defibrillator-sound");
    setTimeout(function() {
        //Play car pull-up sound
        carSound.play();
        setTimeout(() => {
            //Play defibrillator sound
            defibSound.play();
            setTimeout(function() {
                //TODO: Revival
                window.location.href = "revivalChoice.html";
            }, 16000);
        }, 44000);
    }, 5000)
});