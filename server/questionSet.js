
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

        //let questions = data.results
        let questions = []


        data.results.forEach((q) => {
            let res = {}
            if (q.category.indexOf(':') > -1){
                q.category = q.category.slice(q.category.indexOf(':') + 2)  
            }
            res.category = this.decodeHtml(q.category)

            res.question = this.decodeHtml(q.question)

            q.incorrect_answers.forEach((i) => {
                i = this.decodeHtml(i)
            })
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
/*
        questions.forEach((q) => {
            if (q.category.indexOf(':') > -1){
                q.category = q.category.slice(q.category.indexOf(':') + 2)
                q.category = this.decodeHtml(q.category)
            }
            let answers = [...q.incorrect_answers]
            answers.push(q.correct_answer)

            answers.forEach((a) => a = this.decodeHtml(a))

            for (let i = answers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [answers[i], answers[j]] = [answers[j], answers[i]];
            }

            q.answers = answers
        })

        let questionSet = new QuestionSet(questions)
*/
        return questionSet
        
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
    };

    html = html.replace(/&[a-zA-Z0-9#]+;/g, (match) => namedEntities[match] || match);

    return html;
    };

    

}