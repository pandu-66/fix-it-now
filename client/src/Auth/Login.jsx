import './auth.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { loginUser } from '../api/users';

export default function Login({ setLoading }){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "resident"
    });
    const [formErrors, setFormErrors] = useState({});

    const updateForm = (e)=>{
        let {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            const res = await loginUser(formData);
            console.log(res);
            navigate(res.data.role==='resident'?"/dashboard":"/provider-dashboard");
        }catch(error){
            console.log(error);
            let errors = error.response.data;
            let formatted = {};
            errors.forEach((err)=>{
                formatted[err.field] = err.message;
            });
            setFormErrors(formatted);
        }
        finally{setLoading(false)};
    }
    return(
        <main className="container">
            <div className="card bla">
                <h2 className="section-title">Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>Login as:</label>
                    <select className={`selector ${formErrors.role && "input-error"}`} name='role' value={formData.role} onChange={updateForm}>
                        <option value="resident">Resident</option>
                        <option value="provider">Service Provider</option>
                    </select>

                    {formErrors.role && <p className="error-text">{formErrors.role}</p>}

                    <input className={`input ${formErrors.email && "input-error"}`} name='email' value={formData.email} onChange={updateForm} type="email" placeholder='Email'/>

                    {formErrors.email && <p className="error-text">{formErrors.email}</p>}

                    <input className={`input ${formErrors.password && "input-error"}`} name='password' value={formData.password} onChange={updateForm} type="password" placeholder='Password'/>

                    {formErrors.password && <p className="error-text">{formErrors.password}</p>}

                    <button className="btn btn-primary btn-block" style={{marginTop: "15px"}} type='submit'>Login</button>
                </form>
                <p className='comp-text'>Don't have an account? <span className='comp-span' onClick={()=> navigate("/signup")}>Sign up</span></p>
            </div>
        </main>
    )
}