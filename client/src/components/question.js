import '../App.css';
import { execute_post } from '../actions/crud';


export default function Question({q, onAnswer, userID}) {

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
            else {
                ans.classList.add('incorrect-answer')
            }
        })

        
        //change color
        //send data to database
    }

    return (
      <div>
        <div>
            <h4>{q.category}</h4>
            <h3>{q.question}</h3>
            {
            q.answers.map((a) => 
                <button key = {a} id = {a} onClick = {() => check(a)}>
                    <p>{a}</p>
                </button>
            )
            }
        </div>

      </div>
    );
}