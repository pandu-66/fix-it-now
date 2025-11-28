import UserMenu from "./UserMenu";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavBar(){
  const navigate = useNavigate();
  const location = useLocation();
  
    return(
        <header>
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <img src="/fix-it-now.png" alt="Fix It Icon" width="48px" />
            </div>
            <span>Fix It Now</span>
          </div>

          <nav>
            <ul>
              <li className={`${location.pathname==='/dashboard'?"active":""}`} onClick={()=>navigate("/dashboard")}>Dashboard</li>
              <li className={`${location.pathname==='/report-issue'?"active":""}`} onClick={()=>navigate("/report-issue")}>Report Issue</li>
              <li>Find Provider</li>
              <li>My Issues</li>
              <li>Messages</li>
            </ul>
          </nav>

          <div className="user-menu">
            <div className="notification-icon">
              <i><img src="/notifications.png" alt="" /></i>
              <span className="notification-badge">3</span>
            </div>
            <UserMenu/>
          </div>
        </div>
      </header>
    )
}