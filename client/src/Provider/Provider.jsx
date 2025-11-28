import { acceptIssue, getMyIssues, getBroadcastIssues, getRequestedIssues, resolveIssue, cancelIssue } from '../api/issues';
import ProviderNav from '../Layouts/ProviderNav'
import { useEffect, useState } from 'react';
import './index.css';
import Footer from '../Layouts/Footer';



export default function Provider({ setLoading }) {
  const [availableIssues, setavailableIssues] = useState([]);
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [completedIssues, setCompletedIssues] = useState([]);
  const [requestedIssues, setRequestedIssues] = useState([]);
  const [overlayIssueId, setOverlayIssueId] = useState(null);


  const fetchIssues = async()=>{
    try {
      setLoading(true);
      const [availableRes, myIssueRes, requestedRes] = await Promise.all([
        getBroadcastIssues(),
        getMyIssues(),
        getRequestedIssues()
      ]);
      console.log(requestedRes);
      setavailableIssues(availableRes.data);
      setRequestedIssues(requestedRes.data);
      setAssignedIssues(myIssueRes.data.filter((el)=> el.status==="in-progress"));
      setCompletedIssues(myIssueRes.data.filter((el)=> el.status==="resolved"));
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchIssues();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const markInProgress = async (id)=>{
    try {
      await acceptIssue(id);
      fetchIssues();
    } catch (error) {
      console.log(error)
    }
  }
  const markAsResolved = async (id)=>{
    try {
      await resolveIssue(id);
      fetchIssues();
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancelIssue = async (id)=>{
    try {
      await cancelIssue(id);
      fetchIssues();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <ProviderNav/>
    <main>
      <div className="container">
        <section className="active-section">
          <h2 className="section-title">Service Provider Dashboard</h2>

          <div className="card">
            <div className="card-body">
              <h3>Welcome, {localStorage.getItem("username")}!</h3>
              <p>You have {assignedIssues.length} active jobs today</p>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">Requests :</div>
            <div className="card-body">
              {requestedIssues.map((issue) => (
                <div key={issue._id} className="issue-card">
                  <div className="issue-details">
                    <div className="issue-title">{issue.title} - from <i>{issue.residentId.username}</i></div>
                    <div className="issue-description">{issue.residentId.roomNo} • {issue.description}</div>
                  </div>
                  <div className="issue-actions">
                    <button className="sq-btn btn-primary" onClick={()=>markInProgress(issue._id)} >Accept</button>&nbsp;&nbsp;
                    <button className="sq-btn btn-outline" onClick={()=>markInProgress(issue._id)} >Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">Assigned Issues</div>
            <div className="card-body">
              {assignedIssues.map((issue) => (
                <div key={issue._id} className="issue-card">
                  <div className="issue-details">
                    <div className="issue-title">{issue.title} - from <i>{issue.residentId.username}</i></div>
                    <div className="issue-description">{issue.residentId.roomNo} • {issue.description}</div>
                  </div>
                  <div className="issue-actions">
                    <button className="btn btn-primary btn-small" onClick={()=> setOverlayIssueId(issue._id)}>Mark Completed</button> &nbsp;
                    <button className="btn btn-outline btn-small" onClick={()=> handleCancelIssue(issue._id)}>Cancel</button>
                    
                    {(overlayIssueId===issue._id) && 
                    <div className='overlay'>
                      <div className='overlay-content'>
                        <span>Do you want to confirm?</span>
                        <div style={{display:'flex', justifyContent:'space-around', alignItems:'center'}}>
                        <button className='btn btn-outline' onClick={()=> setOverlayIssueId(null)}>Cancel</button> &nbsp;
                        <button className='btn btn-primary' onClick={()=>markAsResolved(issue._id)}>Sure</button>
                        </div>
                      </div>
                    </div>}

                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">Broadcasted Issues</div>
            <div className="card-body">
              {availableIssues.map((issue) => (
                <div key={issue._id} className="issue-card">
                  <div className="issue-details">
                    <div className="issue-title">{issue.title} - from <i>{issue.residentId.username}</i></div>
                    <div className="issue-description">{issue.residentId.roomNo} • {issue.description}</div>
                  </div>
                  <div className="issue-actions">
                    <button className="btn btn-outline btn-small" onClick={()=>markInProgress(issue._id)} >Take this job</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">Completed Jobs</div>
            <div className="card-body">
              {completedIssues.map((job) => (
                <div key={job._id} className="issue-card">
                  <div className="issue-details">
                    <div className="issue-title">{job.title}</div>
                    <div className="issue-description">Completed on {new Date(job.completedAt).toLocaleDateString()} • {job.rating? `★ ${job.rating}`: "Resident yet to give rating."}</div>
                  </div>
                  <div className="issue-actions">
                    <button className="btn btn-outline btn-small">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
    <Footer/>
    </>
  );
}