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
import Account from "../pages/account";
import { Create } from "../pages/create";

export const NavBar = () => {
    const location = useLocation();
    console.log(location)


    const [userID, setUserID] = useState(null)
    const [username, setUsername] = useState(null)
    const navigate = useNavigate()
    

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
                    <Link to ="/create">Create</Link>
                </div>
                
                <div className = "navbar-right">
                    <Link to = "/account">Account</Link>
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
          <Route path = "/account" element = {<Account/>} />
          <Route path = "/create" element = {<Create/>} />
        </Routes>
        </>

    )
}