import { CategoryStats } from "../components/categoryStats";
import { execute_get } from "../actions/crud";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PercentageBar } from "../components/percentageBar";


export default function User(){
    const [userID, setUserID] = useState(null)
    const [username, setUsername] = useState(null)
    const [categories, setCategories] = useState(null)
    const [overallStats, setOverallStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [bestCategory, setBestCategory] = useState(null)
    const navigate = useNavigate()
   
    useEffect(() => {
        if (!userID){
            execute_get('/loggedin').then((data) => {
                console.log(data)
                if (data) {
                    setUserID(data.userID)
                    getStats(data.userID)           
                }   
                else navigate('/login')
            })
        }
    }, [])

    function getStats (id){
        execute_get(`/userStats?userID=${id}`).then((data) => {
            console.log(data)
            if (data)  {
                setUsername(data.username)
                setOverallStats(data.overallStats)
                setCategories(data.categoryStats)
                setBestCategory(data.categoryStats[0])
                setLoading(false)
            }
            else navigate('/login')
        })
    }

    const toggleSort = (event) => {
        const sortValue = event.target.value;
        const sortedCategories = [...categories].sort((a, b) => {
            if (sortValue === 'Questions Answered') {
                return b.total_answered - a.total_answered;
            } else { 
                return b.category_accuracy - a.category_accuracy;
            }
        });
        console.log(sortValue, sortedCategories)
        setCategories(sortedCategories);
    }



    return (
        <div className = "page">
            {
                !loading && 
                categories.length > 0 ? 
                <div>
                    <div className = "overallStats">
                        <h1>{username}</h1>
                        <div className = "category-properties">
                            <p>{overallStats.total_answered} questions answered, {overallStats.correct_answers} correct </p>
                            <p>{Math.round(overallStats.accuracy * 100)}% correct</p>
                        </div>
                        <PercentageBar percentage = {Math.round(overallStats.accuracy * 100)} />
                        <div>
                            <button className = "bestCategory">
                                <p>Best Category: {bestCategory.category}</p>
                            </button>
                        </div>
                    </div>

                    <div className = "category-header">
                        <h2>Categories</h2>
                        <div className = "sort-by">
                            <p>Sort by: </p>
                            <select id="dropdown"  onChange={toggleSort}>
                                <option value="Accuracy">
                                    Accuracy
                                </option>
                                <option value="Questions Answered">Questions Answered</option>
                                
                            </select>
                        </div>
                    </div>
                    
                    { 
                        categories.map((c) => 
                            <CategoryStats 
                                category = {c.category} 
                                correct_answers = {c.correct_answers} 
                                total_answered = {c.total_answered} 
                                accuracy = {c.category_accuracy}
                            />
                        )
                    }
                </div>
                : 
                <>
                    <h1>{username}</h1>
                    <div className = "no-questions">
                        <p>You haven't answered any questions yet.</p>
                        <button className = "play-button"><a href = "/play">Play a round&gt;&gt;</a> </button>
                    </div> 
                </>
            }
        </div>
    )


}