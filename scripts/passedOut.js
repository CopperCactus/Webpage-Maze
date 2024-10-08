function heartbeat() {
    var elements = document.querySelectorAll('*');
    elements.forEach(function (element) {
        element.classList.toggle('heartbeat');
    });
}

function drowning() {
    var fillScreen = document.createElement('div');
    fillScreen.classList.add('fill-screen');
    document.body.appendChild(fillScreen);

    setTimeout(function () {
        fillScreen.style.height = '100vh';
        fillScreen.style.backgroundColor = 'skyblue';
    }, 100);
    setTimeout(function () {
        window.location.href = "drownedEnding.html";
    }, 6000);
}

function eat() {
    var eatingSound = document.getElementById("eating-sound");
    eatingSound.play();

    var food = document.querySelector(".eating");
    food.style.animation = "moveUpDown 1s ease-in-out infinite, disappear 2s forwards";

    food.addEventListener("animationend", function() {
        food.remove();
    });
}