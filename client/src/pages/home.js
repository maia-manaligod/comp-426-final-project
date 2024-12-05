import { useState, useEffect } from "react"
import { execute_get } from "../actions/crud"
import { useNavigate } from "react-router-dom"
import '../App.css'
import './pages.css'
import { PercentageBar } from "../components/percentageBar"
export default function Home() {

    const [userID, setUserID] = useState(null)
    const [stats, setStats] = useState(null)
    const [username, setUsername] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
   
    useEffect(() => {
        if (!userID && !stats){
            execute_get('/loggedin').then((data) => {
                console.log(data)
                if ("data:", data) {
                    setUserID(data.userID)
                    getStats(data.userID)           
                }   
                else navigate('/login')
            })
        }
    }, [])

    function getStats (id){
        execute_get(`/userStats?userID=${id}`).then((data) => {
            console.log("@getStats:", data)
            if (data)  {
                setUsername(data.username)
                setStats(data.overallStats)
                setLoading(false)
            }
            else {
                console.log("login!!", data)
                navigate('/login')
            }
        })
    }

    return (
        <>
        { !loading  && 
            <div className = "home-page-stats">
                <h2>Braniac</h2>
                <h1>{username}</h1>
                {   stats.total_answered > 0 ? 
                    <div>
                        <div className = "category-properties">
                            <p>{stats.correct_answers}/{stats.total_answered} questions answered correctly</p>
                            <p>{Math.round(stats.accuracy * 100)}% accuracy rate</p>
                        </div>
                        <PercentageBar percentage = {Math.round(stats.accuracy * 100)} />
                       
                        <p> <a href = "/user">See detailed user stats &gt;&gt;</a></p>
                        <button className = "play-button"><a href = "/play">Play another round&gt;&gt;</a> </button>
                    </div>
                    : 
                    <div className = "no-questions">
                        <p>You haven't answered any questions yet.</p>
                        <button className = "play-button"><a href = "/play">Play a round&gt;&gt;</a> </button>
                    </div> 
                }
            </div>
        }
        </>
    )
}