import { AnsweredQuestion } from "../components/answeredQuestion";
import { execute_get } from "../actions/crud";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function QuestionHistory(){

    const [userID, setUserID] = useState(null)
    const [loading, setLoading] = useState(true)
    const [questionListData, setQuestionListData] = useState([])
    const [offset, setOffset] = useState(0)
    const navigate = useNavigate()


    useEffect(() => {
        if (!userID){
            execute_get('/loggedin').then((data) => {
                console.log("@questionHistory, loggedin", data)
                if (data)  {
                    setUserID(data.userID)
                    getQuestions(data.userID, 0)
                    setLoading(false)
                }
                else navigate('/login')
            })
        }

    }, [])

    function getQuestions(id, offset){
        execute_get(`/questionHistory?userID=${id}&offset=${offset}`).then((data) => {
            console.log("data retrieved:", data)
            setQuestionListData(data)
            console.log(data.next, data.prev)
        })
    }

    return (
        <div className = "page">
            { !loading && 
                <>
                    <h1>Question History</h1>
                    {questionListData.questions && questionListData.questions.length > 0 ?
                    <div className = "questionsParent">
                        <div className = "questions-grid">
                        <div>
                            {questionListData.prev && 
                                <button className = 'nav-button-prev' onClick = {() => {
                                    getQuestions(userID, offset - 10)
                                    setOffset((o) => o-10)
                                }}
                                >&lt;&lt; prev</button>
                            }
                        </div>
                        <div>
                        {questionListData.next && 
                                <button className = 'nav-button-next' onClick = {() => {
                                    getQuestions(userID, offset + 10)
                                    setOffset((o) => o+10)
                                }}
                                >next &gt;&gt;</button>
                            }
                        </div>
                        {questionListData.questions && questionListData.questions.map((q) => { 
                            return (
                            <div key = {q.id} >  
                                <AnsweredQuestion id = {q.id} question = {q}/>

                            </div>
                            )
                        })}  
                        <div>
                            {questionListData.prev && 
                                <button className = 'nav-button-prev' onClick = {() => {
                                    getQuestions(userID, offset - 10)
                                    setOffset((o) => o-10)
                                }}
                                >&lt;&lt; prev</button>
                            }
                        </div>
                        <div>
                        {questionListData.next && 
                                <button className = 'nav-button-next' onClick = {() => {
                                    
                                    getQuestions(userID, offset + 10)
                                    setOffset((o) => o+10)
                                }}
                                >next &gt;&gt;</button>
                            }
                        </div>
                        </div>
                    </div>
                    :
                    <div className = "no-questions">
                        <p>You haven't answered any questions yet.</p>
                        <button className = "play-button"><a href = "/play">Play a round&gt;&gt;</a> </button>
                    </div>
                    }  
                </>
            } 
        </div>
    )

   










}