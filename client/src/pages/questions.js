
import axios from 'axios';
import {useState, useEffect} from "react"
import Question from '../components/question';
import '../App.css'
import './pages.css'
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
            if (data)  {
                setUserID(data.userID)
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
        <div className = "page center-elements">{!loading && 
            <>
            { questionSet === null ? 
                    <div className = "column center-elements">
                        <h2>Answer 10 trivia questions from various categories!</h2>
                        <button className = "play-button" onClick = {() => getQuestions()}>Get Questions</button>
                    </div>
                     : 
                    index < 10 ? 
                    <>
                     <Question key = {index} q = {currentQuestion} onAnswer = {onAnswer} userID = {userID} index = {index + 1}/>
                    </>
                    : 
                    <div className = "column center-elements">
                        <h4>You got {score}/10 questions correct.</h4>
                        <button 
                            className = "play-button"
                            onClick = {() => {
                            getQuestions()
                        }
                        }>Play Another Round</button>
                    </div>
            }
            </>
        }
            
        </div>
    )
}

export default Questions