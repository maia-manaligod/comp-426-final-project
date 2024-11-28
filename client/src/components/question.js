import '../App.css';


export default function Question({q, onAnswer}) {

    function check(answer){
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
                console.log(ans)
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
                <button id = {a} onClick = {() => check(a)}>
                    <p>{a}</p>
                </button>
            )
            }
        </div>

      </div>
    );
}