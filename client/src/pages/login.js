import { useState, useEffect} from "react"
import {useNavigate} from 'react-router-dom'
import { execute_post, execute_get } from "../actions/crud";
import "./pages.css"



export default function Login(){

    const [loading, setLoading] = useState(true)
    const [login, setLogin] = useState(true)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        execute_get('/loggedin').then((data) => {
            console.log(data)
            if (!data)  setLoading(false)
            else navigate('/')
        })

    }, [])
    
    const LoginForm = () => {

        const [username, setUsername] = useState('')
        const [password, setPassword] = useState('')


        

        const loginSubmit = async (event) => {
            event.preventDefault()
            event.stopPropagation()
        
            const formData = new FormData()

            let button = document.getElementById('loginSubmit')
            button.classList.add('pressed')
        
            formData.append('username', username)
            formData.append('password', password)
            console.log(formData, formData.password, formData.username)
        
            try {
                execute_post("/login", {'username': username, 'password' : password})
                setTimeout(() => navigate('/'), 500)
            } catch (error) {
            console.log("error", error.message)
            }
        }
        return (
            <>
                <form id = "loginForm" onSubmit = {loginSubmit}>
                    <p>Username</p>
                    <input name = "username" value = {username} onChange={(e) => setUsername(e.target.value)} ></input>
                    <p>Password</p>
                    <input type = "password" name = "password" value = {password} onChange={(e) => setPassword(e.target.value)}></input>
                    <p></p>
                    <div className="center-elements">
                        <input id = "loginSubmit" className = "submit" type="submit" value = "Log In"></input>
                    </div>
                    
                </form>
            </>
            
        )
    }
    
    
    const SignUpForm = () => {

        const [username, setUsername] = useState('')
        const [password, setPassword] = useState('')

        const navigate = useNavigate()

        const signupSubmit = async (event) => {
            event.preventDefault()
            event.stopPropagation()
        
            const formData = new FormData()
        
            formData.append('username', username)
            formData.append('password', password)
            console.log(formData, formData.password, formData.username)
        
            try {
                execute_post("/signup", {'username': username, 'password' : password})
            } catch (error) {
            console.log("error", error.message)
        }
    }
        return (
            <>
                <form id = "signupForm" onSubmit={signupSubmit}> 
                    <p>Username</p>
                    <input name = "username" value = {username} onChange={(e) => setUsername(e.target.value)} ></input>
                    <p>Password</p>
                    <input name = "password" value = {password} onChange={(e) => setPassword(e.target.value)}></input>
                    <p></p>
                    <div className="center-elements">
                        <input className = "submit" type="submit" value = "Sign Up"></input>
                    </div>
                    
                </form>
            </>
            
        )
    
    }


    function setLoginTrue() {
        if (!login){ setLogin(true)}
    }
    function setLoginFalse(){
        if (login) { setLogin(false)}
    }

    return (
        <div className = "loginbg">
        {!loading && 
            <div className = "login-page">
                <h1>BRAINIAC</h1>
                <p>Answer trivia and track your progress!</p>
                <div className = "login-box-container">
                    <div className = "space-between">
                        <button className = {login ? "tab-button" : "tab-button-deselected"} onClick = {setLoginTrue}>Login</button>
                        <button className =  {!login ? "tab-button" : "tab-button-deselected"} onClick = {setLoginFalse}>Sign Up</button>
                    </div>
                    <div className = "login-box column">
                        {login ? <LoginForm/> : <SignUpForm/>}
                    </div>
                </div>
                <div className = {message ? "notification" : ""}>
                    <p>{message}fsdfs</p>
                </div>
            </div>
        }
        </div>
    )
}
