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
    message: 'Main Menu',
    choices: ['Start New Game','View Leader Board']
  }
  inquirer.prompt(mainMenuObject)
  .then(({ userChoice }) => {
    console.log(`You selected: ${userChoice}`)
    if(userChoice == 'Start New Game'){
      newGame()
    }
    else if(userChoice == 'View Leader Board'){
      viewLeaderBoard()
    }
  })
}

//Start a new game
const newGame = () => {
  //display a list of available categories
  //make dat API call
  axios.get('https://opentdb.com/api_category.php')
  .then(({ data }) => {
    myCategories = data.trivia_categories
    let myCategoryPromptObject = {
      type: 'list',
      name: 'userCategory',
      message: 'Please select a trivia category from the list below.',
      choices: myCategories
    }
    inquirer.prompt(myCategoryPromptObject)
    .then(({ userCategory }) => {
      //make another API call to get a list of 10 questions from that category
    })
  })
}

//Display the LeaderBoard
const viewLeaderBoard = () => {console.log('leader Board')}

//Run the main menu to start the game
mainScreenDisplayer()