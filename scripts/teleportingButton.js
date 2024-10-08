document.addEventListener("DOMContentLoaded", function () {
    const teleportButton = document.getElementById("teleportButton");
    let clickerCounter = 0;
    let timer = 0;

    teleportButton.addEventListener("click", function () {
        if (clickerCounter < 4) {
            teleportButton.style.position = "absolute";
            teleportButton.style.left = Math.random() * (window.innerWidth - teleportButton.offsetWidth) + "px";
            teleportButton.style.top = Math.random() * (window.innerHeight - teleportButton.offsetHeight) + "px";
            clickerCounter++;
        } else {
            window.location.href = "relaxingVideo.html";
        }
    });

    setInterval(function () {
        timer++;
        if(timer == 60)
            window.location.href = "relaxingVideo.html";
        if (clickerCounter < 5 || (timer % 5) == 0) {
            teleportButton.style.left = Math.random() * (window.innerWidth - teleportButton.offsetWidth) + "px";
            teleportButton.style.top = Math.random() * (window.innerHeight - teleportButton.offsetHeight) + "px";
        }
    }, 1000);
});
