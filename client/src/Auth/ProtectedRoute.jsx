import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Layouts/Loader";
import { verifyUser } from "../api/users";
export default function ProtectedRoute({children, role}){
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(()=>{
     verifyUser()
     .then((response)=>{
        console.log(response);
        if(response.data.role === role){
            setIsAuth(true);
            localStorage.setItem("username", response.data.username);
        }else{
            navigate("/");
        }
     })
     .catch(()=>{
      navigate("/");
     })
     .finally(()=> setAuthChecked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(!authChecked) return <Loader/>;
    return isAuth? children:null;
}