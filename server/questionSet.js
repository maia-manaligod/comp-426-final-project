import {db} from './db.js';

export class QuestionSet{

    index
    questionSet

    constructor(data){
        this.index = 1
        this.questionSet = data
    }

    

    static async fetchQuestions(){
        let response = await fetch('https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple')
        let data = await response.json()

        let questions = []


        data.results.forEach((q) => {
            let res = {}
            if (q.category.indexOf(':') > -1){
                q.category = q.category.slice(q.category.indexOf(':') + 2)  
            }
            res.category = this.decodeHtml(q.category)

            res.question = this.decodeHtml(q.question)

            q.incorrect_answers.map((i) => this.decodeHtml(i))
            res.incorrect_answers = [...q.incorrect_answers]

            res.correct_answer = this.decodeHtml(q.correct_answer)

            let answers = [...res.incorrect_answers]
            answers.push(res.correct_answer)
            for (let i = answers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [answers[i], answers[j]] = [answers[j], answers[i]];
            }
            res.answers = answers

            questions.push(res)
        })

        let questionSet = new QuestionSet(questions)
        return questionSet
        
    }

    static async postQuestion(data){
        //post question
        console.log("question data:, ", data)

        try {
            const result1 = await db.run(
                'insert into questions (question, user_id, correct_answer, user_answer, category) values (?, ?, ?, ?, ?)',
                data.question,
                data.userID,
                data.correct_answer,
                data.user_answer,
                data.category
            );

            const question_id = result1.lastID

            //post answers
            const result2 = await db.run(
                'insert into answers (question_id, answer_1, answer_2, answer_3, answer_4) values (?, ?, ?, ?, ?)',
                question_id, 
                data.answers[0], 
                data.answers[1], 
                data.answers[2], 
                data.answers[3]
            );

            //put user
            const row = await db.get(
                'select answered, correct from users where id = ? limit 1', data.userID
            )
            console.log("correct? ", data.user_answer, data.correct_answer, data.user_answer == data.correct_answer)
            console.log((row.answered + 1), (row.correct + ((data.correct_answer == data.user_answer) ? 1 : 0)))

            const result3 = await db.run(
                `update users
                set answered = ${(row.answered + 1)}, correct = ${(row.correct + ((data.user_answer == data.correct_answer) ? 1 : 0))}
                where id = ${data.userID}`
            )
        } catch (e) {
            console.log('error', e)
            return null
        }

        return data
    }

    static async getQuestionHistory(data){
        let {userID, offset, category} = data
        console.log(userID, offset, category)

        try {
                const questions = await db.all(
                    `select * from questions left join answers on questions.id = answers.question_id
                    where user_id = ${userID}
                    order by id desc
                    limit 10 offset ${offset}`
                )

                let res = {}

                res.questions = questions.map((q) => {
                    return {
                        "question": q.question, 
                        "correct_answer": q.correct_answer, 
                        "user_answer": q.user_answer,
                        "answers": [q.answer_1, q.answer_2, q.answer_3, q.answer_4],
                        "category" : q.category
                    }
                })

                if (offset != 0) res.prev = true
                let {count: total} = await db.get(
                    `select count(*) as count from questions where user_id = ?`, userID
                )


                
                if ((parseInt(offset) + 10) < total) res.next = true
                console.log("fin", (parseInt(offset) + 10),total, res)
                return res
        } catch (e) {
            console.log("error", e)
            return null
        }
    }

    static async getMyQuestions(data){
        let {userID} = data
        console.log(userID, data)

        const questions = await db.all(
            `select my_questions.id AS question_id, my_questions.category, my_questions.question, my_questions.correct_answer, 
                    my_question_answers.answer_1, my_question_answers.answer_2, my_question_answers.answer_3, my_question_answers.answer_4
             from my_questions 
             left join my_question_answers ON my_questions.id = my_question_answers.question_id
             where my_questions.user_id = ?
             order by my_questions.id desc`,
            userID
        );

        console.log("questions!!!!", questions)

        let res = {}

        res = questions.map((q) => {
            return {
                "id" : q.question_id,
                "question": q.question, 
                "correct_answer": q.correct_answer, 
                "answers": [q.answer_1, q.answer_2, q.answer_3, q.answer_4],
                "category" : q.category
            }
        })

        console.log("q:", questions, "r", res)

        return res
    }

    static async createMyQuestion(data){
        console.log(data)

        const result1 = await db.run(
            'insert into my_questions (question, user_id, correct_answer, category) values (?, ?, ?, ?)',
            data.question,
            data.userID,
            data.correctAnswer,
            data.category
        );

        const question_id = result1.lastID



        //post answers
        const result2 = await db.run(
            'insert into my_question_answers (question_id, answer_1, answer_2, answer_3, answer_4) values (?, ?, ?, ?, ?)',
            question_id, 
            data.correctAnswer, 
            data.incorrectAnswers[0], 
            data.incorrectAnswers[1], 
            data.incorrectAnswers[2]
        ); 
    }

    static async updateMyQuestion(data){
        let {editableQuestion, userID, question} = data
        console.log(question, question.question, question.id)


        if (question.question != editableQuestion.question || question.correct_answer != editableQuestion.correct_answer){
            let result = await db.run(
                'update my_questions set question = ?, correct_answer = ? where id = ?',  editableQuestion.question, editableQuestion.correct_answer, question.id, userID
            )
    
        }
        
        let result2 = await db.run(
            'update my_question_answers set answer_1 = ?, answer_2 = ?, answer_3 = ?, answer_4 = ?  where question_id = ?',  
            editableQuestion.answers[0], editableQuestion.answers[1], editableQuestion.answers[2], editableQuestion.answers[3], question.id,
        )

        return result2

        
    }

    static async deleteMyQuestion(data){
        console.log("data:", data.id, data)

        await db.run(
            `DELETE FROM my_questions
            WHERE id = ?`,
            data.id
        );

        await db.run(
            `DELETE FROM my_question_answers
            WHERE question_id = ?`,
            data.id
        );

        return true

    }



    static decodeHtml (html) {
    html = html.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
    html = html.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

    const namedEntities = {
        '&quot;': '"',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#39;': "'",
        '&#039;': "'",
        '&apos;': "'",
        '&deg;': '°',
        '&uuml;': 'ü',
        '&auml;': 'ä',
        '&ouml;': 'ö',
        '&Uuml;': 'Ü',
        '&Auml;': 'Ä',
        '&Ouml;': 'Ö',
        '&aacute;': 'á',
        '&Aacute;': 'Á',
        '&eacute;': 'é',
        '&Eacute;': 'É',
        '&lt;' : '<',
        '&gt;' : '>',
        '&ldquo;' : '"',
        '&rdquo;' : '"'
    };

    html = html.replace(/&[a-zA-Z0-9#]+;/g, (match) => namedEntities[match] || match);

    return html;
    };

    

}