import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";



const Home = () =>
{
    const logout = useLogout();
    const navigate = useNavigate();
    const signOut = async () => {
        await logout();
        navigate('/login');
    }
    return(
        <>
        
        
        <h1>Welcome</h1>
        <Button style={{color:"inherit" , font:"blue"}}onClick={signOut}>Log Out</Button>
        </>
    )
}

export default Home