const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';

const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (!cell.textContent) {
            cell.textContent = currentPlayer;
            if (checkWin(currentPlayer)) {
                setTimeout(() => {
                    window.location.href = 'fakeHTML.html';
                }, 1000);
            } else if (checkTie()) {
                setTimeout(() => {
                    window.location.href = 'credits.html';
                }, 1000);
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                computerMove();
            }
        }
    });
});

function computerMove() {
        const emptyCells = Array.from(cells).filter(cell => !cell.textContent);
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        emptyCells[randomIndex].textContent = 'O';
        if (checkWin('O')) {
            setTimeout(() => {
                window.location.href = 'dunceEnding.html';
            }, 1000);
        } else if (checkTie()) {
            setTimeout(() => {
                window.location.href = 'credits.html';
            }, 1000);
        } else {
            currentPlayer = 'X';
        }
}

function checkWin(player) {
    return winningPatterns.some(combo => {
        return combo.every(index => {
            return cells[index].textContent === player;
        });
    });
}

function checkTie() {
    return Array.from(cells).every(cell => {
        return cell.textContent !== '';
    });
}