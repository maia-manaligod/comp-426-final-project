import { BrowserRouter, Link, Routes, Route, useLocation } from "react-router-dom"
import '../App.css';
import Questions from '../pages/questions';
import Login from '../pages/login';
import QuestionHistory from '../pages/questionHistory';
import User from '../pages/user';
import Home from "../pages/home";
import { Logout } from '../actions/logout';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { execute_get } from "../actions/crud";

export const NavBar = () => {
    const location = useLocation();
    console.log(location)


    const [userID, setUserID] = useState(null)
    const [username, setUsername] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!userID){
            execute_get('/loggedin').then((data) => {
                console.log("@question, loggedin", data)
                if (data)  {
                    setUserID(data.userID)
                    setUsername(data.username)
                }
                else navigate('/login')
            })
        }
    }, [])
   
    
    

    return (
        <>
        {location != null && location.pathname != '/login' && 
            <nav>
                <div className = "navbar-elements">
                <div className = "navbar-left">
                    <Link to="/">Home</Link>
                    <Link to = "/play">Play</Link>
                    <Link to="/questionHistory">Question History</Link>
                    <Link to="/user">User Stats</Link>
                </div>
                
                <div>
                    <Link to="/logout">Log Out</Link>
                </div>

                </div>
               
                
            </nav>
        }

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path = "/play" element = {<Questions /> } />
          <Route path="/login" element={<Login />} />
          <Route path = "/questionHistory" element = {<QuestionHistory/>}/>
          <Route path = "/user" element = {<User/>}/>
          <Route path = "/logout" element = {<Logout/>} />
        </Routes>
        </>

    )
}