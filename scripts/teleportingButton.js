document.addEventListener("DOMContentLoaded", function () {
    const teleportButton = document.getElementById("teleportButton");
    let counter = 0;

    teleportButton.addEventListener("click", function () {
        if (counter < 4) {
            teleportButton.style.position = "absolute";
            teleportButton.style.left = Math.random() * (window.innerWidth - teleportButton.offsetWidth) + "px";
            teleportButton.style.top = Math.random() * (window.innerHeight - teleportButton.offsetHeight) + "px";
            counter++;
        } else {
            window.location.href = "relaxingVideo.html";
        }
    });

    setInterval(function () {
        if (counter < 5) {
            teleportButton.style.left = Math.random() * (window.innerWidth - teleportButton.offsetWidth) + "px";
            teleportButton.style.top = Math.random() * (window.innerHeight - teleportButton.offsetHeight) + "px";
        }
    }, 1000);
});
