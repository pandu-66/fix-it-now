import { useNavigate } from 'react-router-dom';
import NavBar from '../Layouts/NavBar'
import { useState, useEffect } from 'react';
import { getMyIssues, postIssueRating } from '../api/issues';
import { getRecommendedProviders } from '../api/users';
import Footer from '../Layouts/Footer';

export default function Resident({ setLoading }){
  const navigate = useNavigate();
  const [activeIssues, setActiveIssues] = useState([]);
  const [completedIssues, setCompletedIssues] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [providers, setProviders] = useState([]);
  const [overlayIssueId, setOverlayIssueId] = useState(null);
  const [rating, setRating] = useState(null);
  const [tempRating, setTempRating] = useState(null);

  const statusRep = {
    "in-progress": "In Progress",
    "pending": "Pending",
    "resolved": "Completed"
  };
  const formatTimelineMessage = (issue)=>{
    switch (issue.status) {
      case "pending":
        return "You reported a new issue";
      case "in-progress":
        return `${issue.providerId.username} accepted your request`;
      case "resolved":
        return `${issue.providerId?.username} completed your request`;
    
      default:
        break;
    }
  };
  const formatDate = (date)=>{
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  const fetchData = async ()=>{
    try {
      setLoading(true);
      const {data} = await getMyIssues();
      const {data: resProviders} = await getRecommendedProviders();
      setProviders(resProviders);
      setRecentIssues(data.slice(0,4));
      setActiveIssues(data.filter((el)=> el.status==='in-progress'||el.status==='pending'));
      setCompletedIssues(data.filter((el)=> el.status==='resolved'));
    } catch (error) {
     console.log(error); 
    } finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitRating = async (id, rating)=>{
    try {
      await postIssueRating(id, rating);
      fetchData();
      setOverlayIssueId(null);
    } catch (error) {
      console.log(error)
    }
  }

    return(
        <div>
          <NavBar/>
      <main>
        <div className="container">
      {/* <!-- Resident Dashboard --> */}
      <section id="dashboard" className="active-section">
        <h2 className="section-title">Dashboard</h2>
        
        <div className="dashboard-grid">
          <div className="left-sidebar">
            <div className="card">
              <div className="welcome-card">
                <h3>Welcome back, {localStorage.getItem("username")}!</h3>
                <p>Everything in your home running smoothly?</p>
              </div>
              
              <div className="card-body">
                <span className="btn btn-primary btn-block" onClick={()=> navigate('/report-issue')}>Report New Issue</span>
                
                <div style={{marginTop: "20px"}}>
                  <h4 style={{ marginBottom: '10px' }}>My Active Issues</h4>
                  
                  {activeIssues.map((issue)=>(
                    <div key={issue._id} className="issue-card">
                      <div className="issue-status">
                        <div className={`status-indicator status-${issue.status}`}></div>
                      </div>
                      <div className="issue-details">
                        <div className="issue-title">{issue.title}</div>
                        <div className="issue-description">{statusRep[issue.status]} • {issue.category}</div>
                      </div>
                      {/* <div className="issue-actions">
                        <button className="btn btn-outline btn-small">Track</button>
                      </div> */}
                    </div>))
                  }
                  {activeIssues.length===0 && <p>No reports</p>}
                </div>

                <div style={{marginTop: '20px'}}>
                  <h4 style={{ marginBottom: '10px' }}>Completed Issues</h4>

                  {completedIssues.map((issue)=>(
                    <div key={issue._id} className="issue-card">
                      <div className="issue-status">
                        <div className="status-indicator status-resolved"></div>
                      </div>
                      <div className="issue-details">
                        <div className="issue-title">{issue.title}{issue.rating&&<> • <span className='provider-rating'>★ {issue.rating}</span></>}</div>
                        <div className="issue-description">{statusRep[issue.status]} • {issue.category} • {new Date(issue.completedAt).toLocaleDateString()}</div>
                      </div>

                      {!issue.rating&&
                      <div className="issue-actions">
                        <button className="btn btn-outline btn-small" onClick={()=> setOverlayIssueId(issue._id)}>Rate Now</button>
                      </div>}

                      {overlayIssueId===issue._id &&
                      <div className='overlay'>
                        <div className='overlay-content' style={{padding: '16px'}}>
                          <span>how much would you rate this provider?</span>

                          <div>
                            {[1, 2, 3, 4, 5].map((star)=>(
                              <i key={star} className={(star<=(tempRating||rating))?"fa-solid fa-star":"fa-regular fa-star"}
                              style={{
                                color: (star<=(tempRating||rating))?"var(--warning)":"black",
                                marginRight: "5px",
                                fontSize: "1.25rem",
                                cursor: "pointer"
                              }}
                              onClick={()=> setRating(star)}
                              onMouseEnter={()=> setTempRating(star)}
                              onMouseLeave={()=> setTempRating(rating)}
                              ></i>
                            ))}
                          </div>

                          <div style={{display:'flex', justifyContent:'space-around', alignItems:'center'}}>
                          <button className='btn btn-outline' onClick={()=> setOverlayIssueId(null)}>Close</button> &nbsp;
                          <button className='btn btn-primary' disabled={rating===0} onClick={()=> submitRating(issue._id, rating)}>Rate</button>
                          </div>
                        </div>
                      </div>}
                    </div>))
                  }
                  {completedIssues.length===0 && <p>No reports</p>}
                </div>
              </div>
            </div>
          </div>
          
          <div className="main-content">
            <div className="card">
              <div className="card-header">
                Recent Activity
              </div>
              <div className="card-body">
                <div className="timeline">
                  {recentIssues.map((issue)=>(
                    <div key={issue._id} className="timeline-item">
                      <div className="timeline-point completed"></div>
                      <div className="timeline-content">
                        <div className="timeline-title">{formatTimelineMessage(issue)}</div>
                        <div className="timeline-subtitle">{formatDate(issue.updatedAt)} • {issue.title}</div>
                      </div>
                    </div>))
                  }
                  {recentIssues.length===0 && <p>No Recent Activity</p>}
                </div>
              </div>
            </div>
            
            <div className="card" style={{marginTop: '20px'}}>
              <div className="card-header">
                Recommended Providers Near You
              </div>
              <div className="card-body">

                {providers.map((prov)=>(
                  <div key={prov._id} className="provider-card">
                    <div className="provider-avatar">{prov.username[0].toUpperCase()}</div>
                    <div className="provider-info">
                      <div className="provider-name">
                        {prov.username}
                        <span className="verified-badge">✓</span>
                      </div>
                      <div className="provider-rating">{prov.averageRating?"★".repeat(prov.averageRating)+"☆".repeat(5-prov.averageRating): "☆".repeat(5)} ({prov.totalRating? prov.totalRating: 0})</div>
                      <div className="provider-details">{prov.category.charAt(0).toUpperCase()+prov.category.slice(1)} • Available Today</div>
                    </div>
                    <button className="btn btn-secondary btn-small">Contact</button>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
      </main>
      <Footer/>
    </div>
    );
}