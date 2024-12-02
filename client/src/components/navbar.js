import { BrowserRouter, Link, Routes, Route } from "react-router-dom"
import '../App.css';
import Questions from '../pages/questions';
import Login from '../pages/login';
import QuestionHistory from '../pages/questionHistory';
import User from '../pages/user';
import Home from "../pages/home";
import { Logout } from '../actions/logout';

export const NavBar = () => {
    return (
    <BrowserRouter>
        <nav>
          <Link to="/">Home</Link>
          <Link to = "/play">Play</Link>
          <div className = "align-right">
            <Link to="/questionHistory">Question History</Link>
            <Link to="/user">User</Link>
            <Link to="/logout">Logout</Link>
          </div>
          
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path = "/play" element = {<Questions /> } />
          <Route path="/login" element={<Login />} />
          <Route path = "/questionHistory" element = {<QuestionHistory/>}/>
          <Route path = "/user" element = {<User/>}/>
          <Route path = "/logout" element = {<Logout/>} />
        </Routes>
      </BrowserRouter>
    )
}