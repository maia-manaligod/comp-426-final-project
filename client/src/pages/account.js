import { useState, useEffect } from "react"
import { execute_delete, execute_get, execute_put } from "../actions/crud"
import { useNavigate } from "react-router-dom"
import './pages.css'
import Question from "../components/question"
import { MyQuestion } from "../components/myQuestion"

export default function Account(){

    const [loading, setLoading] = useState(true)
    const [userID, setUserID] = useState(null)
    const [username, setUsername] = useState(null)
    const [form, setForm] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const [userQuestions, setUserQuestions] = useState(null)

    let id = 0; 

    useEffect(() => {
        try {
            execute_get('/loggedin').then((data) => {
                if (!data.error)  {
                    console.log(data)
                    setUserID(data.userID)
                    setUsername(data.username)
                    getUserQuestions(data.userID)
                    setLoading(false)
                }
                else navigate('/login')
            })
        } catch (e) {
            console.log("error retrieving loggedin")
        }
    }, [])

    function getUserQuestions(userID){
        execute_get(`/myQuestions?userID=${userID}`, userID).then((data)=> {
            if (!data.error)  {
                setUserQuestions(data)
                setLoading(false)
            }
        })
    }


    const EditForm = () => {
        const [newUsername, setNewUsername] = useState('')
        const [password, setPassword] = useState('')
        


        const editSubmit = async (event) => {
            event.preventDefault()
            event.stopPropagation()
        
            const formData = new FormData()

            let button = document.getElementById('loginSubmit')
            button.classList.add('pressed')
        
            formData.append('username', username)
            formData.append('password', password)
            console.log(formData, formData.password, formData.username)
        
            try {
                execute_put("/user", {'user_id' : userID, 'username': newUsername, 'password' : password}).then((data) => {
                    if (!data.error){
                        setMessage("Username successfully changed."); 
                        setUsername(newUsername);
                    } 
                    else setMessage(data.error_message) ; console.log(data.error_message, data.body)
                })
                
            } catch (error) {
            console.log("error", error.message)
            }
        }
        return (
            <>
                <form className = "editForm" id = "loginForm" onSubmit = {editSubmit}>
                    <p>New Username</p>
                    <input name = "username" value = {newUsername} onChange={(e) => setNewUsername(e.target.value)} ></input>
                    <p>Current Password</p>
                    <input type = "password" name = "password" value = {password} onChange={(e) => setPassword(e.target.value)}></input>
                    <p></p>
                    <div className = "edit-form-buttons">
                        <button className = "cancel-button" onClick = {() => {setForm(0); setMessage('')}}>cancel</button>
                        <input id = "loginSubmit" className = "submit" type="submit" value = "edit"></input>
                    </div>
                </form>
            </>
            
        )
    }
    
    const DeleteForm = () => {
        return (
            <div>
                <p>Are you sure you want to delete your account? This cannot be undone.</p>
                <div className = "account-button-container"> 
                    <button className = "cancel-button">Cancel</button>
                    <button className = "delete-button" onClick = {() => deleteAccount()}>Yes, I'm Sure</button>
                </div>
                
                
            </div>
        )
    }

    function deleteAccount(){
        execute_delete("/user", {'user_id' : userID}).then((data) => {
            if (!data.error){
                setTimeout(() => navigate("/login"))
            } 
            else setMessage(data.error_message) ; console.log(data.error_message, data.body)
        })
    }

    function editQuestion(q, id){
        q["userID"] = userID
        execute_put("/myQuestions", q).then((data) => {
            if (!data.error) {
                let questions = [...userQuestions]
                questions[id] = q.editableQuestion
                setUserQuestions(questions)
            }
        })
    }

    function deleteQuestion(q, id){
        execute_delete("/myQuestions", q).then((data) => {
            if (!data.error){
                let questions = [...userQuestions]
                questions.splice(id, 1)
                setUserQuestions(questions)
            }
        })

    }


    return (
        <div className = "page">
            <h1>{username}</h1>
            <div className = "account-button-container">
                <button className = "edit-button" onClick = {() => setForm(1)}>edit username</button>
                <button className = "delete-button" onClick = {() => setForm(2)}> delete account</button>

                
            </div>
            {form == 1 && <EditForm/>}
            {form == 2 && <DeleteForm/>}
            <div className = {message ? "notification" : ""}>
                    <p>{message}</p>
            </div>

            <div>
                <h2>User Created Questions</h2>
                {
                    userQuestions ? userQuestions.length == 0 ? 
                    <div>
                        <p>You have not created any questions.</p>
                    </div>
                    : 
                    <div className = "questions-grid">

                       { userQuestions.map((q) => {
                            id += 1
                        return  <MyQuestion id = {id - 1}question = {q} onUpdate = {editQuestion} onDelete = {deleteQuestion}/>
                        }) }
                    </div>
                    : 
                    <></>
                    
                }
            </div>
        </div>
        
    )

}