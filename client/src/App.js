import axios from 'axios';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Questions from './pages/questions';
import Login from './pages/login';
//data will be the string we send from our server
const apiCall = () => {
  axios.get('http://localhost:8080').then((data) => {
    //this console.log will be in our frontend console
    console.log(data)
  })
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">logout</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Questions />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>


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