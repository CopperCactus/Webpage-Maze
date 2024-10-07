function fightWizard() {
    document.body.classList.add('fadeOutAnimation');
    setTimeout(function() {
      window.location.href = 'slimedeath.html';
    }, 3000);
  }

  function surrender() {
    document.getElementById('encounterText').innerText = "You surrendered! Though the slime wizard is distrustful. Through a magical power, he rewinds time!";
    document.getElementById('wizardphoto').src = "images/wizardsurrender.png";
    document.getElementById('buttonContainer').classList.add('hidden');
    setTimeout(function() {
      document.body.classList.add('fadeOutAnimation');
    }, 5000);
    setTimeout(function() {
      window.location.href = 'moodle.html';
    }, 9000);
  }
  