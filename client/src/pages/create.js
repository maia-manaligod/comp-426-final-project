import React, { useState, useEffect } from 'react';
import QuestionForm from '../components/QuestionForm';
import { execute_get } from '../actions/crud';
import { useNavigate } from 'react-router-dom';

export const Create = () => {

    const [message, setMessage] = useState(null)


    const [userID, setUserID] = useState(null)
    const [stats, setStats] = useState(null)
    const navigate = useNavigate()
   
    useEffect(() => {
        if (!userID && !stats){
            execute_get('/loggedin').then((data) => {
                console.log(data)
                if (!data.error) {
                    setUserID(data.userID)        
                }   
                else navigate('/login')
            })
        }
    }, [])


    return (
        <div className = "page">
            { !message && <QuestionForm setMessage = {setMessage} userID = {userID}/>}
            {message && 
                <div className = "center-message">
                    <p>Question Created</p>
                    <button onClick = {() => setMessage(null)}>New Question</button>
                </div>
            }
           
        </div>
        
    )

}
