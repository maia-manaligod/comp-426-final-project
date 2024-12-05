import React, { useState } from 'react';
import './components.css'
import { execute_post } from '../actions/crud';

const QuestionForm = ({setMessage, userID}) => {
    const [question, setQuestion] = useState({
        category: '',
        question: '',
        correctAnswer: '',
        incorrectAnswers: ['', '', '']
    });

    const handleChange = (field, value) => {
        if (field.startsWith('incorrectAnswer')) {
            const index = parseInt(field.split('-')[1], 10);
            const newIncorrectAnswers = [...question.incorrectAnswers];
            newIncorrectAnswers[index] = value;
            setQuestion({ ...question, incorrectAnswers: newIncorrectAnswers });
        } else {
            setQuestion({ ...question, [field]: value });
        }
    };

    const validateForm = () => {
        return (
            question.category &&
            question.question &&
            question.correctAnswer &&
            question.incorrectAnswers.every((ans) => ans)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let body = {...question}
        body["userID"] = userID
        if (validateForm()) {
            execute_post("/myQuestions", body).then((data) => {
                if (!data.error) setMessage("Question created successfully.")
                else setMessage(data.error_message) ; console.log(data.error_message, data.body)
            })
        } else {
            alert('Please fill out all fields.');
        }
    };

    return (
        <div className = "question-form">
        <form onSubmit={handleSubmit}>
            <div>
                <div className = 'new-question-header'>
                    <h3>New Question</h3>
                    <div>
                        <label>
                            Category: 
                            <select
                                value={question.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                            >
                                <option value="">Select a category</option>
                                <option value="General Knowledge">General Knowledge</option>
                                <option value="Books">Books</option>
                                <option value="Film">Film</option>
                                <option value="Art">Art</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Sports">Sports</option>
                                <option value="Video Games">Video Games</option>
                                <option value="Animals">Animals</option>
                                <option value="Television">Television</option>
                                <option value="Sports">Sports</option>
                                <option value="History">History</option>
                                <option value="Geography">Geography</option>
                                <option value="Science & Nature">Science & Nature</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            Question:    
                            <input
                                type="text"
                                value={question.question}
                                onChange={(e) => handleChange('question', e.target.value)}
                            />
                        </label>
                    </div>
                </div>
                <div className = "separate-answers">
                    <div className = "answer-container">
                        <div>
                            <label>
                                Correct Answer:
                                <input
                                    type="text"
                                    value={question.correctAnswer}
                                    onChange={(e) => handleChange('correctAnswer', e.target.value)}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Incorrect Answer 1:
                                <input
                                    type="text"
                                    value={question.incorrectAnswers[0]}
                                    onChange={(e) => handleChange('incorrectAnswer-0', e.target.value)}
                                />
                            </label>
                        </div>
                    </div>
                    <div className = "answer-container">
                        <div>
                            <label>
                                Incorrect Answer 2:
                                <input
                                    type="text"
                                    value={question.incorrectAnswers[1]}
                                    onChange={(e) => handleChange('incorrectAnswer-1', e.target.value)}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Incorrect Answer 3:
                                <input
                                    type="text"
                                    value={question.incorrectAnswers[2]}
                                    onChange={(e) => handleChange('incorrectAnswer-2', e.target.value)}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <button type="submit">Submit</button>
        </form>
        </div>
    );
};

export default QuestionForm;
