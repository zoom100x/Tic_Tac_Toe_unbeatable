var origBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombins = [
    [0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
];

const cells = document.querySelectorAll('.cell');
resetGame();

function resetGame() {
    document.querySelector('.gameOver').style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for(var i=0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turn(squarId, player){
    origBoard[squarId] = player;
    cells[squarId].innerText = player;
    let gameWon = checkWin(origBoard, player);
    if(gameWon) gameOver(gameWon);
}

function turnClick(cell){
    if(typeof origBoard[cell.target.id] == 'number' ){
        turn(cell.target.id, humanPlayer);
        if(!checkWin(origBoard, humanPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
    }
}

function checkWin(board, player) {
    let plays = board.reduce((a,e,i) => (e === player) ? a.concat(i):a, []);
    let gameWon = null;
    for(let [index, win] of winCombins.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {index : index, player: player};
            break;
        }
    }
    
    return gameWon;
}

function gameOver(gameWon){
    for(var i=0; i<winCombins[gameWon.index].length; i++){
        document.getElementById(winCombins[gameWon.index][i]).style.backgroundColor = 
        gameWon.player === humanPlayer ? "green":"red";
    }
    for(var i=0; i<cells.length; i++){
        cells[i].removeEventListener('click', turnClick);
    }
    declarateWinner((gameWon.player === humanPlayer) ? "You win!":"You lose.");
}

function declarateWinner(sentence){
    document.querySelector(".gameOver").style.display = "block";
    document.querySelector(".text").innerText = sentence;
}

function emptySquare(){
    return origBoard.filter(elem => typeof elem === 'number');
}

function bestSpot(){
    return minimax(origBoard, aiPlayer).index;
}

function checkTie(){
    if(emptySquare().length == 0){
        for(var i=0; i < cells.length; i++){
            cells[i].style.backgroundColor = "yellow";
            cells[i].removeEventListener('click', turnClick);
        }
        declarateWinner("Tie !!");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquare();

	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}