import UserMenu from "./UserMenu";

export default function ProviderNav() {
  return (
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
            <li className={`${location.pathname==='/provider-dashboard'?"active":""}`}>Dashboard</li>
            <li>Assigned Jobs</li>
            <li>Completed Jobs</li>
            <li>Profile</li>
          </ul>
        </nav>

        <div className="user-menu">
          <div className="notification-icon">
            <i><img src="/notifications.png" alt="Notifications" /></i>
            <span className="notification-badge">3</span>
          </div>
          <UserMenu/>
        </div>
      </div>
    </header>
  );
}
