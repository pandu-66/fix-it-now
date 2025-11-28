import { useState, useEffect, useRef,  } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/users";

export default function UserMenu(){
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(()=>{
        function handleOutSideClick(e){
            if(menuRef.current && !menuRef.current.contains(e.target)){
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleOutSideClick);
        return ()=> document.removeEventListener('mousedown', handleOutSideClick);
    },[]);

    const handleLogOut = async()=>{
        try {
            const res = await logoutUser();
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
        finally{
            navigate("/");
        }
    }

    return(
        <div className="user-menu-dp" ref={menuRef}>
            <span className="avatar" onClick={() => setOpen(!open)}>
                {localStorage.getItem("username")[0].toUpperCase()}
            </span>

            {open && (
                <div className="dropdown">
                <ul>
                    <li><i className="fa-solid fa-user"></i>&nbsp;Profile</li>
                    <li><i className="fa-solid fa-gear"></i>&nbsp;Settings</li>
                    <li onClick={handleLogOut}><i className="fa-solid fa-right-from-bracket"></i>&nbsp;Logout</li>
                </ul>
                </div>
            )}
        </div>
    )
}