import { QuestionSet } from './questionSet.js';
import express from 'express';
import cors from 'cors'

const app = express();
app.use(cors());

app.get('/questions', async (req, res) => {
    let questionSet = await QuestionSet.fetchQuestions()
    console.log("questionSet", questionSet)
    res.status(201).json(questionSet)
})

app.listen(8080, () => {
      console.log('server listening on port 8080')
})
