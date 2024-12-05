import '../App.css';
import './components.css';
import { useState } from 'react';

export const MyQuestion = ({ id, question, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableQuestion, setEditableQuestion] = useState({ ...question });

    const handleEditChange = (field, value) => {
        setEditableQuestion({ ...editableQuestion, [field]: value });
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...editableQuestion.answers];
        newAnswers[index] = value;
        setEditableQuestion({ ...editableQuestion, answers: newAnswers });
    };

    const handleSubmit = () => {
        onUpdate({question, editableQuestion}, id);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditableQuestion({ ...question });
        setIsEditing(false);
    };

    return (
        <div className="answered-question-container">
            {isEditing ? (
                <div className="question-header">
                    <label>
                        Category:
                        <select
                            value={question.category}
                            onChange={(e) => handleEditChange('category', e.target.value)}
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
                    <div>
                        <button onClick={handleSubmit}>Submit</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="question-header">
                    <p>Category: {question.category}</p>
                    <div className = 'edit-button-container'>
                        <button className = "my-question-button" onClick={() => setIsEditing(true)}>Edit</button>
                        <button className = "my-question-button" onClick={() => onDelete(question, id)}>Delete</button>
                    </div>
                </div>
            )}

            {isEditing ? (
                <div>
                    <label>
                        Question:
                        <input
                            type="text"
                            value={editableQuestion.question}
                            onChange={(e) => handleEditChange('question', e.target.value)}
                        />
                    </label>
                    {editableQuestion.answers.map((a, index) => (
                        <div key={index}>
                            <label>
                                Answer {index + 1}:
                                <input
                                    type="text"
                                    value={a}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                />
                            </label>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <h3>{question.question}</h3>
                    {question.answers.map((a) => (
                        <button
                            key={a}
                            id={a}
                            className={
                                a === question.correct_answer
                                    ? 'answer-button correct-answer'
                                    : a === question.user_answer
                                    ? 'answer-button incorrect-answer'
                                    : 'answer-button disabled'
                            }
                        >
                            <p>{a}</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
