import { CategoryStats } from "../components/categoryStats";
import { execute_get } from "../actions/crud";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function User(){
    const [userID, setUserID] = useState(null)
    const [categories, setCategories] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
   
    useEffect(() => {
        if (!userID){
            execute_get('/loggedin').then((data) => {
                console.log(data)
                if (data) {
                    setUserID(data)
                    getStats(data)           
                }   
                else navigate('/login')
            })
        }
    }, [])

    function getStats (id){
        execute_get(`/userStats?userID=${id}`).then((data) => {
            console.log(data)
            if (data)  {
                setCategories(data)
                setLoading(false)
            }
            else navigate('/login')
        })
    }

    return (
        <>
            {
                !loading && 
                <>
                    {
                        categories.map((c) => 
                            <CategoryStats 
                                category = {c.category} 
                                correct_answers = {c.correct_answers} 
                                total_answered = {c.total_answered} 
                                accuracy = {c.accuracy}
                            />
                        )
                    }
                    
                </>
            }
        </>
    )


}