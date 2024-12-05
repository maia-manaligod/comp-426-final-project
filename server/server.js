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

app.post('/question', async (req, res)  => {
    let question = await QuestionSet.postQuestion(req.body)
    if (!question) res.status(500).send('Error')
    else res.status(201).send(question)
})

app.post('/signup', async (req, res) => {
    console.log("request",req.body)
    
    let user = await User.createUser(req.body)
    console.log(user)
    if (user == 'exists') res.status(400).send('Username already exists.');
    else if (!user) res.status(500).send('Error processing request');
    else {
        res.status(201).json(user)
    }
}) 

app.post('/login', async(req, res) => {
    const {username, password} = req.body
    console.log("req", req, req.body, username, password)
    if (!username || !password) res.status(404).statusMessage('Please fill out both fields')
    
    let user = await User.login(req.body)
    if (user == 'does_not_exist'){ res.status(404).statusMessage('User Does Not Exist')}
    else if (user == 'incorrect_password'){res.status(400).statusMessage('Incorrect Password')}
    else if (!user.userID) { res.status(500).statusMessage("Error processing request")}
    else {
        res.cookie("userID", user.userID, {
            maxAge: 3600000,
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax' 
        });
        res.cookie("username", user.username, {
            maxAge: 3600000,
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax' 
        });
        console.log("user logged in", user)
        res.status(201).send(`${user}`)
    }
    
})

app.get('/loggedin', async (req, res) => {
    const user = {
        "userID":  req.cookies.userID,
        "username" : req.cookies.username
    }
    if (user.userID) {
        console.log("user", user)
        res.send(user)
    } else {
        res.status(404).send(`Session Expired`)
    }
})

app.post('/logout', async (req, res) => {
    let userID = req.cookies.userID
    res.clearCookie('userID')
    res.clearCookie('username')
    res.status(200).send(`${userID}`)
})


app.get(`/questionHistory`, async (req, res) => {
    console.log(req.query)
    const questionHistory = await QuestionSet.getQuestionHistory(req.query)
    if (!questionHistory) res.status(500).send('bad')
    else res.status(201).json(questionHistory)

})

app.get(`/userStats`, async (req, res) => {
    const userStats = await User.getUserStats(req.query)
    if (!userStats) res.status(500).send('bad')
    else res.status(201).json(userStats)
})


app.listen(8080, () => {
      console.log('server listening on port 8080')
})
