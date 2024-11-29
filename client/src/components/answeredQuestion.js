import '../App.css'
export const AnsweredQuestion = ({question}) => {
    console.log("q", question)
    return (
        <div>
            <h4>{question.category}</h4>
            <h3>{question.question}</h3>
            {
                question.answers.map((a) => 
                    <button key = {a} id = {a} 
                        className = {
                            (a == question.correct_answer) ? 'correct-answer' :
                            (a == question.user_answer) ? 'incorrect-answer' :
                            'disabled'
                        }
                       >
                        <p>{a}</p>
                    </button>
                )
            }
      </div>
    )
}

