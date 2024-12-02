import { useState, useEffect } from "react"
import { execute_get } from "../actions/crud"
import { useNavigate } from "react-router-dom"
export default function Home() {

    const [userID, setUserID] = useState(null)
    const [stats, setStats] = useState(null)
    const [username, setUsername] = useState(null)
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
                setUsername(data.username)
                setStats(data.categoryStats[0])
                setLoading(false)
            }
            else navigate('/login')
        })
    }

    return (
        <>
        { !loading  && 
            <>
                <h2>{username}</h2>
                <p>{stats.correct_answers}/{stats.total_answered} questions answered correctly.</p>
                <p>{Math.round(stats.accuracy * 100)}% accuracy rate</p>
                <button><a href = "/play">Play another round&gt;&gt;</a> </button>

            </>
        }
        </>
    )
}