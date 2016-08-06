var _ = require('lodash');

const PLAYER = 'PLAYER';
const ENEMY = 'ENEMY';
const BOSS = 'BOSS';
const WEAPON = 'WEAPON';
const HEALTH = 'HEALTH';
const BLANK_VALUE = 0;
const WALL_VALUE = 1;

export function GameState(size) {
  this.size = size;
  this.world = createWorld(size);
  this.playerXLocation = 0;
  this.playerYLocation = 0;
  this.playerHealth = 0;
  this.playerAttack = 0;
  this.enemyHealth = 0;
  this.enemyAttack = 0;
};

export function createWorld(size) {
  var gameWorld = [];     
  for (var i = 0; i < size; i++) {
    gameWorld[i] = [];
    for (var j = 0; j < size; j++) {
      gameWorld[i][j] = 0;
    }   
  }   
  return gameWorld
};

var addObject = function(gameState, xLocation, yLocation, objectToAdd) {
  gameState.world[xLocation][yLocation] = objectToAdd;
};
var removeObject = function(gameState, xLocation, yLocation) {
  gameState.world[xLocation][yLocation] = BLANK_VALUE;
};

var addWallBlock = function(gameState, topLeftX, topLeftY, bottomRightX, bottomRightY) {
  for (var x = topLeftX; x < bottomRightX; x++) {
    for (var y = topLeftY; y < bottomRightY; y++) {
      addWall(gameState, x, y);
    };
  };
};
var addWall = function(gameState, xLocation, yLocation) {
  addObject(gameState, xLocation, yLocation, WALL_VALUE);
};
var addEnemy = function(gameState, xLocation, yLocation, attackStat, healthStat) {
  addObject(gameState, xLocation, yLocation, {type: ENEMY, attack: attackStat, health: healthStat});
};
var addBoss = function(gameState, xLocation, yLocation, attackStat, healthStat) {
  addObject(gameState, xLocation, yLocation, {type: BOSS, attack: attackStat, health: healthStat});
};
var addHealth = function(gameState, xLocation, yLocation, healthValue) {
  addObject(gameState, xLocation, yLocation, {type: HEALTH, stats: healthValue});
};
var addWeapon = function(gameState, xLocation, yLocation, attackValue) {
  addObject(gameState, xLocation, yLocation, {type: WEAPON, stats: attackValue});
};

var addPlayer = function(gameState, xLocation, yLocation, attackStat, healthStat) {
  gameState.playerXLocation = xLocation;
  gameState.playerYLocation = yLocation;
  gameState.playerAttack = attackStat;
  gameState.playerHealth = healthStat;
  addObject(gameState, xLocation, yLocation, {type: PLAYER, attack: attackStat, health: healthStat});
}

export function seedWorld(gameState) {
  addWallBlock(gameState, 0, 0, gameState.size/6, gameState.size/6);
  addPlayer(gameState, gameState.size/2, gameState.size/2, 10, 100);
  addHealth(gameState, gameState.size/2 + 3, gameState.size/2 + 3, 10);
  addWeapon(gameState, gameState.size/2 + 7, gameState.size/2 + 7, 10);
  addEnemy(gameState, gameState.size/2 - 5, gameState.size/2 - 5, 10, 40);
  addBoss(gameState, gameState.size/2 - 8, gameState.size/2 - 8, 30, 50);
  addWeapon(gameState, 12, 10, 10);
  addEnemy(gameState, 17, 16, 40);
}

//Reset the game - This is an interesting approach, need to clear interval too
export function resetGame(gameState) {
  alert("reset game is called")
  resetGameState = new GameState(gameState.size);
  seedWorld(GameState);
  gameState = resetGameState;
}

//Player Interaction Methods - Chech if its a vaild game state?
export function interact(gameState, oldX, oldY, newX, newY) {
  var target = gameState.world[newX][newY];
  var current = gameState.world[oldX][oldY];
   if (target.hasOwnProperty('type') === true) {
     switch (target['type']) {
       case ('WEAPON'):
         current['attack'] = current['attack'] + target['stats'];
         removeObject(gameState, newX, newY);
         movePlayer(gameState, oldX, oldY, newX, newY);
         break;
       case ('HEALTH'):
         current['health'] = current['health'] + target['stats'];
         removeObject(gameState, newX, newY);
         movePlayer(gameState, oldX, oldY, newX, newY);
         break;
       case ('ENEMY'):
         attack(gameState, oldX, oldY, newX, newY);
         if (gameState.world[newY][newX] === BLANK_VALUE) {
          movePlayer(gameState, oldX, oldY, newX, newY);
         }
         break;
       case ('BOSS'):
         attack(gameState, oldX, oldY, newX, newY);
         if (gameState.world[newY][newX] === BLANK_VALUE) {
           alert("The game is over!")
         }
         break;
       default:
         alert("Error not a recogized NPC");
     }
   }
   else if (target.hasOwnProperty('type') === false) {
     switch (target) {
       case BLANK_VALUE:
         movePlayer(gameState, oldX, oldY, newX, newY);
         break;
       case WALL_VALUE:
         console.log("Cannot move, run into a wall");
         break;
       default:
         alert("Not a recognized Non NPC world object");
     }
   }
   else {
     alert("Property of the target is not recognized this could be wall");
   }
}

var movePlayer = function(gameState, oldX, oldY, newX, newY) {
  if (newX >= gameState.size || newX < 0) {
    console.log("out of bounds on X")
  }
  else if (newY >= gameState.size || newY < 0) {
    console.log("out of bounds on Y")
  }
  else if (gameState.world[newX][newY] !== BLANK_VALUE) {
    console.log("cannot move here, there is something in the way")
  }
  else if (typeof gameState.world[oldX][oldY] === 'number') {
    alert("Throw a large error")
  }
  else {
    //This should be synch here
    gameState.world[newX][newY] = gameState.world[oldX][oldY];
    removeObject(gameState, oldX, oldY);
    gameState.playerXLocation = newX;
    gameState.playerYLocation = newY;
  }
}

var attack = function(gameState, oldX, oldY, newX, newY) {
  //Make sure the attack object is valid
  var playerHealth = gameState.world[oldX][oldY].health;
  var playerAttack = gameState.world[oldX][oldY].attack;
  var enemyHealth = gameState.world[newX][newX].health;
  var enemyAttack = gameState.world[newX][newY].attack;
  var afterEnemyHealth = enemyHealth - playerAttack;
  var afterPlayerHealth = playerHealth - enemyAttack;
  if (playerHealth > 0) {
   gameState.world[oldX][oldY].health = afterPlayerHealth;
   gameState.playerAttack = playerAttack;
   gameState.playerHealth = afterPlayerHealth;
  }
  else {
    alert("Player is dead")
    gameState.enemyAttack = "None";
    gameState.enemyHealth = "None";
    alert("Reset Game need to add this")
  }
  if (enemyHealth > 0) {
    gameState.world[newX][newY].health = afterEnemyHealth;
    gameState.enemyAttack = enemyAttack;
    gameState.enemyHealth = afterEnemyHealth;
  }
  else {
    removeObject(gameState, newX, newY);
    gameState.enemyAttack = "None";
    gameState.enemyHealth = "None";
  }
}
