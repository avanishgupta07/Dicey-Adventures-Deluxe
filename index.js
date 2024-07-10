let player1Name = "Player 1";
let player2Name = "Player 2";
let score1 = 0;
let score2 = 0;
let bestOf = 1;
let gamesPlayed = 0;
let leaderboard = [];

const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.3;

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play();
}

function updateScores() {
    document.getElementById('score1').textContent = score1;
    document.getElementById('score2').textContent = score2;
}

function resetGame() {
    score1 = 0;
    score2 = 0;
    gamesPlayed = 0;
    updateScores();
    document.getElementById('gameStatus').innerHTML = "Let's Roll!";
    document.getElementById('winnerAnnouncement').innerHTML = "";
    document.getElementById('rollButton').disabled = false;
    document.getElementById('fireworks').style.display = 'none';
}

function checkGameEnd() {
    gamesPlayed++;
    const maxScore = Math.ceil(bestOf / 2);
    if (score1 >= maxScore || score2 >= maxScore) {
        const winner = score1 > score2 ? player1Name : player2Name;
        document.getElementById('winnerAnnouncement').innerHTML = `${winner} Wins the Series!`;
        playSound('winSound');
        document.getElementById('rollButton').disabled = true;
        document.getElementById('fireworks').style.display = 'block';
        updateLeaderboard(winner);
    }
}

function rollDice() {
    playSound('rollSound');
    
    const dice = document.querySelectorAll('.dice img');
    dice.forEach(die => die.classList.add('rolling'));
    
    gsap.to(dice, {duration: 0.5, rotationY: 360, ease: "power2.out"});
    
    setTimeout(() => {
        dice.forEach(die => die.classList.remove('rolling'));
        
        var randomNumber1 = Math.floor(Math.random() * 6) + 1;
        var randomNumber2 = Math.floor(Math.random() * 6) + 1;

        gsap.to(".img1", {duration: 0.3, scale: 1.2, yoyo: true, repeat: 1});
        gsap.to(".img2", {duration: 0.3, scale: 1.2, yoyo: true, repeat: 1});

        document.querySelector(".img1").setAttribute("src", "images/dice" + randomNumber1 + ".png");
        document.querySelector(".img2").setAttribute("src", "images/dice" + randomNumber2 + ".png");

        if (randomNumber1 > randomNumber2) {
            document.getElementById('gameStatus').innerHTML = `${player1Name} Wins!`;
            score1++;
        } else if (randomNumber2 > randomNumber1) {
            document.getElementById('gameStatus').innerHTML = `${player2Name} Wins!`;
            score2++;
        } else {
            document.getElementById('gameStatus').innerHTML = "It's a Draw!";
        }

        updateScores();
        checkGameEnd();
    }, 500);
}

function startNewGame() {
    document.getElementById('playerSetup').style.display = 'block';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'none';
    resetGame();
}

function updateLeaderboard(winner) {
    const winnerIndex = leaderboard.findIndex(player => player.name === winner);
    if (winnerIndex !== -1) {
        leaderboard[winnerIndex].wins++;
    } else {
        leaderboard.push({ name: winner, wins: 1 });
    }
    leaderboard.sort((a, b) => b.wins - a.wins);
    displayLeaderboard();
}

function displayLeaderboard() {
    const leaderboardBody = document.querySelector("#leaderboardTable tbody");
    leaderboardBody.innerHTML = "";
    leaderboard.forEach((player, index) => {
        const row = leaderboardBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = player.name;
        row.insertCell(2).textContent = player.wins;
    });
    document.getElementById('leaderboard').style.display = 'block';
}

document.getElementById('rollButton').addEventListener('click', rollDice);
document.getElementById('newGameButton').addEventListener('click', startNewGame);

document.getElementById('bestOf').addEventListener('change', (e) => {
    bestOf = parseInt(e.target.value);
    resetGame();
});

document.getElementById('startGame').addEventListener('click', () => {
    player1Name = document.getElementById('player1Name').value || "Player 1";
    player2Name = document.getElementById('player2Name').value || "Player 2";
    bestOf = parseInt(document.getElementById('bestOf').value);
    
    document.getElementById('player1Display').textContent = player1Name;
    document.getElementById('player2Display').textContent = player2Name;
    
    document.getElementById('playerSetup').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('leaderboard').style.display = 'none';
    
    resetGame();
    bgMusic.play();
});

document.getElementById('modeToggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    document.getElementById('modeText').textContent = this.checked ? 'Light Mode' : 'Dark Mode';
});

// Initialize the game
resetGame();