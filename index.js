//The main file for the game

//Require dependencies
inquirer = require('inquirer')
chalk = require('chalk')
fs = require('fs') //we <3 builtins
axios = require('axios')

//Display the main screen
const mainScreenDisplayer = () => {
  //Prompt the user with a menu
  let mainMenuObject = {
    type: 'list',
    name: 'userChoice',
    message: 'Please select an option',
    choices: ['Start New Game','View Leader Board']
  }
  inquirer.prompt(mainMenuObject)
  .then(({ userChoice }) => {
    if(userChoice == 'Start New Game'){
      newGame()
    }
    else if(userChoice == 'View Leader Board'){
      viewLeaderBoard()
    }
  })
}

//Start a new game
const newGame = () => {console.log('new Game')}

//Display the LeaderBoard
const viewLeaderBoard = () => {console.log('leader Board')}

//Run the main menu to start the game
mainScreenDisplayer()