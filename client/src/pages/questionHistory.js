import { AnsweredQuestion } from "../components/answeredQuestion";
import { execute_get } from "../actions/crud";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function QuestionHistory(){

    const [userID, setUserID] = useState(null)
    const [loading, setLoading] = useState(true)
    const [questionList, setQuestionList] = useState([])
    const [offset, setOffset] = useState(0)
    const navigate = useNavigate()


    useEffect(() => {
        if (!userID){
            execute_get('/loggedin').then((data) => {
                console.log("@questionHistory, loggedin", data)
                if (data)  {
                    setUserID(data)
                    getQuestions(data)
                    setLoading(false)
                }
                else navigate('/login')
            })
        }

    }, [])

    function getQuestions(id){
        execute_get(`/questionHistory?userID=${id}&offset=${offset}`).then((data) => {
            console.log("data retrieved:", data)
            setQuestionList(data)
        })
    }

    return (
        <div>
            { !loading && 
                <>
                    <h1>Question History</h1>
                    {questionList.map((q) => { 
                        return (
                        <div>
                            <AnsweredQuestion id = {q.id} question = {q}/>

                        </div>
                        )
                    })}
                </>
            }
           
        </div>
    )

   










}