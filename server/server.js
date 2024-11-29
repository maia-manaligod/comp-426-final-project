import { QuestionSet } from './questionSet.js';
import { User } from './users.js';
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();
//const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your client origin
  credentials: true // Allow cookies to be sent
}));
app.use(cookieParser())
app.use(express.json());

app.get('/questions', async (req, res) => {
    let questionSet = await QuestionSet.fetchQuestions()
    console.log("questionSet", questionSet)
    res.status(201).json(questionSet)
})

app.post('/signup', async (req, res) => {
    console.log("request",req.body)
    
    let user = await User.createUser(req.body)
    console.log(user)
    if (user == 'exists') res.status(400).send('Username already exists.');
    else if (!user) res.status(500).send('Error processing request');
    else {
        res.status(201).send(user)
    }
}) 

app.post('/login', async(req, res) => {
    const {username, password} = req.body
    console.log("req", req, req.body, username, password)
    
    let userID = await User.login(req.body)
    console.log("id:", userID)
    if (userID == 'does_not_exist'){ res.status(404).send('User Does Not Exist')}
    else if (userID == 'incorrect_password'){res.status(400).send('Incorrect Password')}
    else if (!userID) { res.status(500).send("Error processing request")}
    else {
        res.cookie("userID", userID, {
            maxAge: 360000, // 1 hour in milliseconds
            httpOnly: true, // Prevents access to cookie from JavaScript
            secure: process.env.NODE_ENV === 'production', // Use HTTPS only in production
            sameSite: 'lax' // Can be 'strict', 'lax', or 'none'
        });
        console.log("user logged in", userID)
        res.status(201).send(`${userID}`)
    }
    
})

app.get('/loggedin', async (req, res) => {
    console.log("loggedin---", req.cookies, req.cookies.userID)
    const userID = req.cookies.userID
    if (userID) {
        res.send(`${userID}`)
    } else {
        res.status(404).send(`Session Expired`)
    }
})

app.listen(8080, () => {
      console.log('server listening on port 8080')
})
