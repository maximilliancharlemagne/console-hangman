//The main file for the game

//Require dependencies
inquirer = require('inquirer')
chalk = require('chalk')
fs = require('fs') //we <3 builtins
axios = require('axios')

//Define global vars
let userScore = 0

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
  userScore = 0 //reset score

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
      //get the id for that category
      userCategoryArr = myCategories.filter((val) => { //get name and id from just name
        return val.name == userCategory
      })
      userCategory = userCategoryArr[0] //get it out of the array
      //make another API call to get a list of 10 questions from that category
      axios.get(`https://opentdb.com/api.php?amount=10&category=${userCategory.id}`)
      .then(({data}) => {
        let responseCode = data.response_code
        let questionArr = data.results
        let i = 0
        const questionAsker = (anArrOfQuestions) => {
          //prompt the question
          //make an array of all the wrong answers
          let allAnswersArr = anArrOfQuestions[i].incorrect_answers
          //insert the correct answer at a random index
          //if we add it to a consistent place, attentive users can cheat
          //and I
          // WRITE
          // RESPECTABLE
          // JAVASCRIPT
          myIndex = Math.floor(Math.random() * allAnswersArr.length) //fixed this - Math.random() missing parentheses
          allAnswersArr.splice(myIndex,0,anArrOfQuestions[i].correct_answer)
          let myNewQuestionObject = {
            type: 'list',
            name: 'userAnswer',
            message: `${anArrOfQuestions[i].question}`,
            choices: allAnswersArr
          }
          inquirer.prompt(myNewQuestionObject)
          .then(({userAnswer}) => {
            console.log(`Your answer was: ${userAnswer}`)
            if(userAnswer == anArrOfQuestions[i].correct_answer){
              console.log(`That answer was correct!`) //style this with chalk later
              userScore++
              console.log(`Your new score is ${userScore} points`)
            }
            else{
              console.log(`That answer was incorrect.`)
              console.log(`Your score is still ${userScore} points`)
            }
            return userAnswer
            })
          //depending on whether the answer was correct or incorrect
          //show the appropriate screen
          //then add one to i
          .then(data => {
            i++
            if (i < questionArr.length - 1) {
              questionAsker(questionArr)
            }
          })
        }
        questionAsker(questionArr)
      })
    })
  })
}

//Display the LeaderBoard
const viewLeaderBoard = () => {console.log('leader Board')}

//Run the main menu to start the game
mainScreenDisplayer()