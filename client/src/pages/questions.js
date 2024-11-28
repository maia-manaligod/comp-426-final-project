
import axios from 'axios';
import {useState, useEffect} from "react"
import Question from '../components/question';
import '../App.css'




const Questions = () =>  {
    const [questionSet, setQuestionSet] = useState(null)
    const [index, setIndex] = useState(0)
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const[score, setScore] = useState(0)
    
    
    const getQuestions = () => {
        axios.get('http://localhost:8080/questions').then((data) => {
          console.log(data.data)
          setQuestionSet(data.data.questionSet)
          console.log(data.data.questionSet[0])
          setCurrentQuestion(data.data.questionSet[0])
          setIndex(0)
          setScore(0)
        }) 

        
    }

    useEffect(() => {
        if (index >= 10) { setCurrentQuestion(null)}
        else if (questionSet != null) setCurrentQuestion(questionSet[index]);
        
    }, [index]);

    function onAnswer(correct) {
        console.log("answered", index)
        if (correct) { setScore((s) => s + 1)}
        setTimeout(() => {setIndex((i) => i + 1)}, 1000); 
    }
    
    return (
        <>
            { questionSet === null ? 
                    <button onClick = {() => getQuestions()}>get Questions</button> : 
                    index < 10 ? 
                    <>
                    <p>Question {index + 1} of 10</p>
                     <Question key = {index} q = {currentQuestion} onAnswer = {onAnswer}/>
                    </>
                    : 
                    <div>
                        <p>You got {score}/10 questions correct.</p>
                        <button onClick = {() => {
                            getQuestions()
                        }
                        }>Play Another Round</button>
                    </div>
            }
            
        </>
    )
}

export default Questions