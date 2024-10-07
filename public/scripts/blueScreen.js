document.addEventListener("keydown", function(event) {
    console.log(event);
    if (event.keyCode === 13) { 
        window.location.href = "window.html";
    }
    else{
        window.location.href = "continue.html";
    }
  });