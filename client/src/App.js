import axios from 'axios';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Questions from './pages/questions';
import Login from './pages/login';
import QuestionHistory from './pages/questionHistory';
import User from './pages/user';
import { Logout } from './actions/logout';
import { NavBar } from './components/navbar';


export default function App() {
  return (
    <>
      <NavBar/>


    </>
    
  );
}

/*
      <div className="App">
        <header className="App-header">

          <button onClick={apiCall}>Make API Call</button>

        </header>
      </div>
*/