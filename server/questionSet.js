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
        let {userID, offset} = data
        console.log(userID, offset)

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



    static decodeHtml (html) {
    html = html.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
    html = html.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

    const namedEntities = {
        '&quot;': '"',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#39;': "'",
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
        '&gt;' : '>'
    };

    html = html.replace(/&[a-zA-Z0-9#]+;/g, (match) => namedEntities[match] || match);

    return html;
    };

    

}