document.getElementById("magic").addEventListener("click", function() {
    this.style.display = "none";
});

document.addEventListener("DOMContentLoaded", function() {
    const option3Button = document.getElementById("option3");
    option3Button.addEventListener("click", function() {
        window.open("https://option3.com", "_blank"); 
    });
});