document.addEventListener("DOMContentLoaded", function () {
    let timer = 0;
    setTimeout(function() {
        //Play car pull-up sound
        var carSound = document.getElementById("car-pulling-up-sound");
        carSound.play();
        setTimeout(() => {
            //Play defibrillator sound
            var defibSound = document.getElementById("defibrillator-sound");
            defibSound.play();
            setTimeout(function() {
                //TODO: Revival
                window.location.href = "revivalChoice.html";
            }, 20000);
        }, 44000);
    }, 5000)
});