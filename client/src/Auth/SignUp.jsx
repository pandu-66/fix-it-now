import './auth.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signupUser } from '../api/users';

export default function SignUp({ setLoading }){
    const navigate = useNavigate();
    // const [selectedRole, setSelectedRole] = useState('resident');
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        role: "resident",
    });

    const [formErrors, setFormErrors] = useState({});

    const updateFormData = (e)=>{
        let {name, value} = e.target;

        if (name === "phoneNumber") {
            value = value.replace(/\D/g, ''); // Remove all non-digits
            value = value.slice(0, 10);       // Enforce max 10 digits
        }

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();

        setLoading(true);
        try {
            let response = await signupUser(formData);
            console.log(response.data);
            navigate(response.data.role==='resident'?"/dashboard":"/provider-dashboard");
        } catch (error) {
            console.log(error.response.data)
            let errors = error.response.data;
            let formatted = {};
            errors.forEach((err)=>{
                formatted[err.field] = err.message;
            });
            setFormErrors(formatted);
        }finally{
            setLoading(false);
        }
    }
    return(
        <main className="container">
            <div className="card bla">
                <h2 className="section-title">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <label>Sign up as:</label>
                    <select className={`selector ${formErrors.role&& "input-error"}`} name='role' value={formData.role} onChange={updateFormData}>
                        <option value="resident">Resident</option>
                        <option value="provider">Service Provider</option>
                    </select>
                    {formErrors.role && <p className="error-text">{formErrors.role}</p>}

                    <input
                    className={`input ${formErrors.username && "input-error"}`}
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={updateFormData}
                    placeholder="Full Name"
                    />
                    {formErrors.username && <p className="error-text">{formErrors.username}</p>}

                    <input
                    className={`input ${formErrors.email && "input-error"}`}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={updateFormData}
                    placeholder="Email"
                    />
                    {formErrors.email && <p className="error-text">{formErrors.email}</p>}

                    {formData.role === 'provider' && (
                        <select className={`selector ${formErrors.category&& "input-error"}`} name='category' value={(formData.category)?formData.category:""} onChange={updateFormData} style={{ marginBottom: "15px"}}>
                            <option value="" disabled hidden>
                                Select category
                            </option>
                            <option value="plumber">Plumber</option>
                            <option value="electrician">Electrician</option>
                            <option value="carpenter">Carpenter</option>
                            <option value="painter">Painter</option>
                            <option value="technician">Technician</option>
                            <option value="other">Other</option>
                        </select>
                    )}
                    {formErrors.category && <p className="error-text">{formErrors.category}</p>}

                    <input
                    className={`input ${formErrors.phoneNumber && "input-error"}`}
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={updateFormData}
                    pattern="^[0-9]{10}$"
                    maxLength="10"
                    placeholder="Phone Number"
                    />
                    {formErrors.phoneNumber && <p className="error-text">{formErrors.phoneNumber}</p>}

                    {formData.role==='resident'&&
                    <input className={`input ${formErrors.roomNo && "input-error"}`} type="text" name='roomNo' value={(formData.roomNo)?formData.roomNo:""} onChange={updateFormData} placeholder='Room Number Ex: B-410'/>
                    }
                    {formErrors.roomNo && <p className="error-text">{formErrors.roomNo}</p>}

                    <input
                    className={`input ${formErrors.password && "input-error"}`}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={updateFormData}
                    placeholder="Password"
                    />
                    {formErrors.password && <p className="error-text">{formErrors.password}</p>}

                    <input
                    className={`input ${formErrors.confirmPassword && "input-error"}`}
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={updateFormData}
                    placeholder="Confirm Password"
                    />
                    {formErrors.confirmPassword && <p className="error-text">{formErrors.confirmPassword}</p>}

                    
                    <button className="btn btn-primary btn-block" style={{marginTop: "15px"}} type='submit'>Sign Up</button>
                </form>
                <p className='comp-text'>Already have an account? <span className='comp-span' onClick={()=> navigate("/")}>Login</span></p>
            </div>
        </main>
    )
}