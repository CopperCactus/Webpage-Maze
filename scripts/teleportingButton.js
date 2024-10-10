document.addEventListener("DOMContentLoaded", function () {
    const teleportButton = document.getElementById("teleportButton");
    const pressedMessage = document.getElementById("pressedMessage");
    let clickerCounter = 0;
    let timer = 0;
    let messageTimer = 0;

    teleportButton.addEventListener("click", function () {
        pressedMessage.innerHTML = randomMessage();
        messageTimer = 0;
        if (clickerCounter < 4) {
            teleportButton.style.position = "absolute";
            teleportButton.style.left = Math.random() * (window.innerWidth - teleportButton.offsetWidth) + "px";
            teleportButton.style.top = Math.random() * (window.innerHeight - teleportButton.offsetHeight) + "px";
            clickerCounter++;
        } else {
            pressedMessage.innerHTML = "";
            messageTimer = -1000;
            window.location.href = "relaxingVideo.html";
        }
    });

    setInterval(function () {
        timer++;
        messageTimer++;
        if(messageTimer > 3){
            pressedMessage.innerHTML = "";
            messageTimer = -1000;
        }
        if(timer >= 15)
            window.location.href = "untimelyEnd.html";
        if (clickerCounter < 5 || (timer % 5) == 0) {
            teleportButton.style.left = Math.random() * (window.innerWidth - teleportButton.offsetWidth) + "px";
            teleportButton.style.top = Math.random() * (window.innerHeight - teleportButton.offsetHeight) + "px";
        }
    }, 1000);

    function randomMessage(){
        let rand = Math.floor(Math.random() * 10);
        switch(rand){
            case(0):
            case(1):
            case(2):
                return "Nice Job!";
            case(3):
            case(4):
                return "You got this!";
            case(5):
            case(6):
                return "Relax!";
            case(7):
            case(8):
                return "Only ${clicksLeft} more times!";
            case(9):
                return "I don't know who will see this, but you have to get out. Get off this site, or it'll get you. I've barely stayed out of its reach for this long but I don't know how much more I can tell, just remeber that you can't trus-";
        }
        return "Huh?";
    };
});
