
import axios from 'axios';
import {useState, useEffect} from "react"
import Question from '../components/question';
import '../App.css'
import { execute_get } from '../actions/crud';
import { useNavigate } from 'react-router-dom';




const Questions = () =>  {
    const [loading, setLoading] = useState(true)
    const [userID, setUserID] = useState(null)
    const navigate = useNavigate()

    const [questionSet, setQuestionSet] = useState(null)
    const [index, setIndex] = useState(0)
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const[score, setScore] = useState(0)

    if (!userID){
        execute_get('/loggedin').then((data) => {
            console.log("@question, loggedin", data)
            if (data)  {
                setUserID(data)
                setLoading(false)
            }
            else navigate('/login')
        })
    }
    
    
    const getQuestions = () => {
        execute_get('/questions').then((data) => {
          console.log("data.data" , data)
          setQuestionSet(data.questionSet)
          console.log(data.questionSet[0])
          setCurrentQuestion(data.questionSet[0])
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
        <>{!loading && 
            <>
            { questionSet === null ? 
                    <button onClick = {() => getQuestions()}>get Questions</button> : 
                    index < 10 ? 
                    <>
                    <p>Question {index + 1} of 10</p>
                     <Question key = {index} q = {currentQuestion} onAnswer = {onAnswer} userID = {userID}/>
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
        }
            
        </>
    )
}

export default Questions