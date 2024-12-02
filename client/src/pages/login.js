import { useState, useEffect} from "react"
import {useNavigate} from 'react-router-dom'
import { execute_post, execute_get } from "../actions/crud";
import "./pages.css"



export default function Login(){

    const [loading, setLoading] = useState(true)
    const [login, setLogin] = useState(true)
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
        
            formData.append('username', username)
            formData.append('password', password)
            console.log(formData, formData.password, formData.username)
        
            try {
                execute_post("/login", {'username': username, 'password' : password})
                navigate('/')
            //const result = await axios.post('http://localhost:8080/login', )
            //navigate('/')
            } catch (error) {
            console.log("error", error.message)
            }
        }
        return (
            <>
                <h4>Login with your account</h4>
                <form id = "loginForm" onSubmit = {loginSubmit}>
                    <p>username</p>
                    <input name = "username" value = {username} onChange={(e) => setUsername(e.target.value)} ></input>
                    <p>password</p>
                    <input name = "password" value = {password} onChange={(e) => setPassword(e.target.value)}></input>
                    <p></p>
                    <input type="submit" className = "submit"></input>
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
            //const result = await axios.post('http://localhost:8080/login', )
            //navigate('/')
            } catch (error) {
            console.log("error", error.message)
        }
    }
        return (
            <>
                <h4>Sign Up to Register Your Account</h4>
                <form id = "signupForm" onSubmit={signupSubmit}> 
                    <p>username</p>
                    <input name = "username" value = {username} onChange={(e) => setUsername(e.target.value)} ></input>
                    <p>password</p>
                    <input name = "password" value = {password} onChange={(e) => setPassword(e.target.value)}></input>
                    <p></p>
                    <input type="submit"></input>
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
                <div className = "column center-elements">
                    <div className = "row">
                        <button onClick = {setLoginTrue}>Login</button>
                        <button onClick = {setLoginFalse}>Sign Up</button>
                    </div>
                <div className = "login-box column">
                    {login ? <LoginForm/> : <SignUpForm/>}
                </div>
               
            </div>
        }
        </div>
    )
}
