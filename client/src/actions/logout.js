import { execute_post } from "./crud"
import { useNavigate } from "react-router-dom"
export const Logout = () => {
    const navigate = useNavigate()
    execute_post("/logout").then((d) => {
        console.log(d)
        navigate('/login', {replace: true})
    })
}