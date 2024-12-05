import '../App.css'
import './components.css'
export const AnsweredQuestion = ({question}) => {
    console.log(question.question)
    return (
        <div className = "answered-question-container">
            <div className = "question-header">
                    <p>Category: {question.category}</p>
                </div>
            <h3>{question.question}</h3>
            {
                question.answers.map((a) => 
                    <button key = {a} id = {a} 
                        className = {
                            (a == question.correct_answer) ? 'answer-button correct-answer' :
                            (a == question.user_answer) ? 'answer-button incorrect-answer' :
                            'answer-button disabled'
                        }
                       >
                        <p>{a}</p>
                    </button>
                )
            }
      </div>
    )
}

