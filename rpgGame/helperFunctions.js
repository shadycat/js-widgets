export function closeToPlayer(playerX, playerY, inputX, inputY, bufferDistance) {
	if (bufferDistance < 1) {
		console.log("Error: bufferDistance should be greater than 2")
	}
	//To few chess cases see if in a box wit h4 checks 
	if ( (inputX < playerX + bufferDistance) &&
		 (inputX > playerX - bufferDistance) &&
		 (inputY < playerY + bufferDistance) &&
		 (inputY > playerY - bufferDistance)) {
		return true;
	}
	else {
		return false;
	}
}