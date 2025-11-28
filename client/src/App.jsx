import { Route, Routes } from 'react-router-dom';
import Resident from './Resident/Resident';
import Provider from './Provider/Provider';
import Login from './Auth/Login';
import SignUp from './Auth/SignUp';
import { useState } from 'react';
import './index.css';
import Loader from './Layouts/Loader';
import ProtectedRoute from './Auth/ProtectedRoute';
import ReportIssue from './Resident/ReportIssue';


function App() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <Loader/>}
      <Routes>
        <Route path='/' element={<Login setLoading={setLoading}/>}/>
        
        <Route path='/signup' element={<SignUp setLoading={setLoading} />}/>

        <Route path='/dashboard' element={
          <ProtectedRoute role={'resident'}>
            <Resident setLoading={setLoading}/>
          </ProtectedRoute>
          }/>

        <Route path='/provider-dashboard' element={
          <ProtectedRoute role={'provider'}>
            <Provider setLoading={setLoading}/>
          </ProtectedRoute>
          }/>
        <Route path='/report-issue' element={
          <ProtectedRoute role={'resident'}>
            <ReportIssue setLoading={setLoading}/>
          </ProtectedRoute>
        }/>
      </Routes>
    </>
  );
}

export default App;
