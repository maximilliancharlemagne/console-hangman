//The main file for the game

//TO DO:
//Style correct/incorrect answers with chalk
//Verify the user is getting 10 questions -- DONE/fixed
//Change the # of points you get for a question based on the difficulty
//Change the JSON write to parse the file, append the new score, then save the file -- DONE

//Require dependencies
inquirer = require('inquirer')
chalk = require('chalk')
fs = require('fs') //we <3 builtins
axios = require('axios')
he = require('he')

//Define global vars
let userScore = 0
let myBigFatJSONArray = []

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
          newBadAnswers = anArrOfQuestions[i].incorrect_answers.map(val => {
            return he.decode(val)})
          let allAnswersArr = newBadAnswers
          //insert the correct answer at a random index
          //if we add it to a consistent place, attentive users can cheat
          //and I
          // WRITE
          // RESPECTABLE
          // JAVASCRIPT
          myIndex = Math.floor(Math.random() * allAnswersArr.length) //fixed this - Math.random() missing parentheses
          allAnswersArr.splice(myIndex,0,he.decode(anArrOfQuestions[i].correct_answer))
          let myNewQuestionObject = {
            type: 'list',
            name: 'userAnswer',
            message: `${he.decode(anArrOfQuestions[i].question)}`,
            choices: allAnswersArr
          }
          inquirer.prompt(myNewQuestionObject)
          .then(({userAnswer}) => {
            console.log(`Your answer was: ${userAnswer}`)
            if(userAnswer == anArrOfQuestions[i].correct_answer){
              console.log(chalk.green(`That answer was correct!`)) //style this with chalk later
              userScore++
              console.log(`Your new score is ${userScore} points`)
            }
            else{
              console.log(chalk.red(`That answer was incorrect.`))
            }
            return userAnswer
            })
          //depending on whether the answer was correct or incorrect
          //show the appropriate screen
          //then add one to i
          .then(data => {
            i++
            if (i < questionArr.length ) {
              questionAsker(questionArr)
            }
            else{
              console.log(`Your final score was ${userScore} points out of a possible 10`)
              let userNamePromptObject = {
                type: 'input',
                name: 'userName',
                message: 'Enter a username for your high score to be recorded'
              }
              inquirer.prompt(userNamePromptObject)
              .then(({userName}) => {
                let myNewScoreObject = {
                  name: userName,
                  score: userScore
                }
                let rawdata = fs.readFileSync('leaderboard.json')
                myBigFatJSONArray = JSON.parse(rawdata);
                myBigFatJSONArray.push(myNewScoreObject)
                fs.writeFileSync('leaderboard.json', JSON.stringify(myBigFatJSONArray), err => {if(err)console.log(err)})
                mainScreenDisplayer()
              })
            }
          })
        }
        questionAsker(questionArr)
      })
    })
  })
}

//Display the LeaderBoard
const viewLeaderBoard = () => {
  let rawdata = fs.readFileSync('leaderboard.json')
  let scores = JSON.parse(rawdata);
  let sortedScores = scores.sort((a,b) => {
    return b.score - a.score
  })
  for(let index in sortedScores){
    console.log(`#${parseInt(index) + 1} || ${sortedScores[index].name} || ${sortedScores[index].score} points`)
  }
  let myFakePromptObject = {
    type: 'input',
    name: 'doesntMatter',
    message: 'Press Enter to return to the main menu...'
  }
  inquirer.prompt(myFakePromptObject)
  .then(data => {
    mainScreenDisplayer()
  })
}

//Run the main menu to start the game
mainScreenDisplayer()