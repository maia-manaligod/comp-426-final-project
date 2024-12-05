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
    if (req.body.username == '' || req.body.password == '')  res.status(404).json('Please fill out both fields.')
    else {
        let user = await User.createUser(req.body)
        console.log(user)
        if (user == 'exists') res.status(400).json('Username already exists.');
        else if (!user) res.status(500).json('Error processing request');
        else {
            res.status(201).json(user)
        }
    }
}) 

app.post('/login', async(req, res) => {
    const {username, password} = req.body
    console.log("req", req, req.body, username, password)
    if (username == '' || password == '') res.status(404).json('Please fill out both fields.')
    
    else {
        let user = await User.login(req.body)
        console.log(user)
        if (user == 'does_not_exist'){ res.status(404).json('User does not exist.')}
        else if (user == 'incorrect_password'){res.status(400).json('Incorrect Password.')}
        else if (!user.userID) { res.status(500).json('Error processing request.')}
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
            res.status(201).send({"user": `${user}`})
        }
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

app.put('/user', async (req, res) => {
    const user = await User.update(req.body)
    if (req.body.username == '') res.status(404).json('Invalid username');
    else if (user == 'incorrect password') res.status(404).json('Incorrect Password');
    else if (!user) res.status(500).json('Internal Server Error')
    else {
        res.cookie('username', req.body.username, { maxAge: 3600000, httpOnly: true });
        res.status(200).json('Username Updated')
    }
})

app.delete('/user', async (req, res) => {
    const user = await User.delete(req.body)
    if (!user) res.status(500).json('Internal Server Error');
    else {
        res.clearCookie('username')
        res.clearCookie('userID')
        res.status(200).json("User Deleted")
    }
})

app.post('/myQuestions', async (req, res) => {
    const question = await QuestionSet.createMyQuestion(req.body)
    if (!question) res.status(500).json('Internal Server Error');
    else res.status(200).json("Question Created")
})

app.get('/myQuestions', async (req, res) => {
    const questions = await QuestionSet.getMyQuestions(req.query)
    if (!questions) res.status(500).json('Internal Server Error');
    else res.status(200).json(questions)
})

app.put('/myQuestions', async (req, res) => {
    const questions = await QuestionSet.updateMyQuestion(req.body)
    if (!questions) res.status(500).json('Internal Server Error');
    else res.status(200).json(questions) 
})

app.delete('/myQuestions', async (req, res) => {
    const questions = await QuestionSet.deleteMyQuestion(req.body)
    if (!questions) res.status(500).json('Internal Server Error');
    else res.status(200).json(questions)  
})


app.listen(8080, () => {
      console.log('server listening on port 8080')
})
