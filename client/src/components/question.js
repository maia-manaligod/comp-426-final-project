import '../App.css';
import './components.css'
import { execute_post } from '../actions/crud';


export default function Question({q, onAnswer, userID, index}) {

    function check(answer){
        let question =  {...q}
        question["user_answer"] = answer
        question["userID"] = userID

        execute_post("/question", question).then((data) => {
            console.log("data", data)
        })
        

        if (answer == q.correct_answer){
            console.log('correct!')
            onAnswer(true)
        }
        else {
            console.log("incorrect")
            onAnswer(false)
        }

        q.answers.forEach((a) => {
            let ans = document.getElementById(a)
            if (a == q.correct_answer){
                ans.classList.add('correct-answer')
            }
            else if (a == answer){
                ans.classList.add('incorrect-answer')
            }
        })

        
        //change color
        //send data to database
    }

    return (
      <div>
        <div className = "question-container"> 
            <div className = "full-width question-top">
                <div className = "question-header">
                    <p>Question {index} of 10</p>
                    <p>Category: {q.category}</p>
                </div>

                <div className = "full-width center-text">
                    <h3>{q.question}</h3>
                </div>
            </div>
            
            
            
            
            {
            q.answers.map((a) => 
                <button className = "answer-button" key = {a} id = {a} onClick = {() => check(a)}>
                    <p>{a}</p>
                </button>
            )
            }
        </div>

      </div>
    );
}