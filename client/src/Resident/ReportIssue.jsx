import { useMemo, useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { postNewIssue } from '../api/issues';
import NavBar from '../Layouts/NavBar';
import { getProviders } from '../api/users';
import {debounce} from 'lodash';

export default function ReportIssue({ setLoading }){
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        urgency: "medium",
        category: "",
        selectedOpt: "",
        selectedProvider: "",
    });
    const [step, setStep] = useState(1);
    const [formErrors, setFormErrors] = useState({});
    const [providers, setProviders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProv, setFilteredProv] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const navigate = useNavigate();

    const handleNext = ()=>{
        if(!formData.category) return;
        setStep(2);
    }

    const handleCategoryChange = (e)=>{
        setFormData({...formData, category: e.target.name});
    }

    const handleFormData = (e)=>{
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleFormSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true);
        try {
            const response = await postNewIssue(formData);
            console.log(response);
            navigate("/dashboard");
        } catch (error) {
            console.log(error);
            let errMsgs = error.response.data;
            let formatted = {};
            errMsgs.forEach((err)=>{
                formatted[err.field] = err.message;
            });
            setFormErrors(formatted);
        } finally{
            setLoading(false);
        }

    }

    const handleOptChange = async(e)=>{
        
        if(e.target.value==="yes"){
            try {
                const response = await getProviders(formData.category);
                setProviders(response.data);
            } catch{
                window.location.reload();
            }
        }
        setFormData({...formData, selectedOpt: e.target.value});
    }

    const handleClick = (id)=>{
        setFormData({...formData, selectedProvider: id});
    }

    const handleSearch = useMemo(()=>
        debounce((query)=>{
            const filterQuery = query.trim().toLowerCase();
            if(filterQuery==="") {
                setFilteredProv(providers);
                return
            }
            const filtered = providers.filter((prov)=>(prov.username.toLowerCase().includes(filterQuery)));
            setFilteredProv(filtered);
            setVisibleCount(5);
        }, 300)
    ,[providers])

    const handleSearchChange = (e)=>{
        const {value} = e.target;
        setSearchQuery(value);
        handleSearch(value);
    }

    return(
        <>
            <NavBar/>
            <div className="report-form">
                <h2>Report an issue:</h2>
                    {step===1 && 
                    (<div>
                        <h3 className='h2'>Select Issue Category</h3>
                        <div className="report-issues">
                            <button className={`issue ${(formData.category==="plumber")&&"selected-issue"}`} name='plumber' onClick={handleCategoryChange}><span className='category-icon'><img src="plumber.png" alt="x" /></span>Plumbing</button>

                            <button className={`issue ${(formData.category==="electrician")&&"selected-issue"}`} name='electrician' onClick={handleCategoryChange}><span className='category-icon'><img src="electrician.png" alt="x" /></span>Electrical</button>

                            <button className={`issue ${(formData.category==="carpenter")&&"selected-issue"}`} name='carpenter' onClick={handleCategoryChange}><span className='category-icon'><img src="carpenter.png" alt="x" /></span>Carpentry</button>

                            <button className={`issue ${(formData.category==="painter")&&"selected-issue"}`} name='painter' onClick={handleCategoryChange}><span className='category-icon'><img src="painter.png" alt="x" /></span>Painter</button>

                            <button className={`issue ${(formData.category==="technician")&&"selected-issue"}`} name='technician' onClick={handleCategoryChange}><span className='category-icon'><img src="technician.png" alt="x" /></span>Technician</button>

                            <button className={`issue ${(formData.category==="other")&&"selected-issue"}`} name='other' onClick={handleCategoryChange}><span className='category-icon'><img src="other.png" alt="x" /></span>Other</button>
                        </div>
                        <div className="actions">
                            <button className="btn btn-outline" onClick={()=>navigate("/dashboard")}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleNext} disabled={formData.category===""}>Next</button>
                        </div>
                    </div>)}

                    {step===2 && 
                    (<div>
                        <form onSubmit={handleFormSubmit}>
                            <label htmlFor="urgency">Urgency:</label><br/>
                            <select className={`selector ${formErrors.urgency && "input-error"}`} name="urgency" value={formData.urgency} onChange={handleFormData}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            {formErrors.urgency && <p className="error-text">{formErrors.urgency}</p>}

                            <label htmlFor="name">Title:</label><br/>
                            <input className={`input ${formErrors.title&& "input-error"}`} name="title" value={formData.title} onChange={handleFormData} placeholder='Ex: Leaking kitchen tap'/>
                            
                            {formErrors.title && <p className="error-text">{formErrors.title}</p>}

                            <label htmlFor="description">Description:</label><br/>
                            <input className={`input ${formErrors.description&& "input-error"}`} name="description" value={formData.description} onChange={handleFormData} placeholder='Details about the problem'/>

                            {formErrors.description && <p className="error-text">{formErrors.description}</p>}

                            {/* <label htmlFor="location">Location:</label><br/>
                            <input className={`input ${formErrors.location&& "input-error"}`} name="location" value={formData.location} onChange={handleFormData} placeholder='Ex: B-410'/>
                            {formErrors.location && <p className="error-text">{formErrors.location}</p>} */}

                            <p>Do you want to select the provider?</p>
                            <input type="radio" name='selectedOpt' checked={formData.selectedOpt==="yes"} id='yes' value="yes" onChange={handleOptChange} required/>
                            <label htmlFor="yes">Yes</label>
                            &nbsp;&nbsp;&nbsp;
                            <input type="radio" name='selectedOpt' checked={formData.selectedOpt==="no"} id='no' value="no" onChange={handleOptChange}/>
                            <label htmlFor="no">No</label><br />

                            {formData.selectedOpt==="yes"&&(
                                <div className="card-body prov-div">
                                    <div className="search-bar">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search providers..."/>
                                    </div>

                                    {(filteredProv.length>0?filteredProv:providers)
                                    .slice(0, visibleCount)
                                    .map((prov)=>(
                                    <div key={prov._id} className="provider-card" onClick={()=>handleClick(prov._id)} style={formData.selectedProvider===prov._id?{backgroundColor:"var(--light-bg)"}:{}}>
                                        {
                                            formData.selectedProvider===prov._id?
                                            <div className='selected-prov'>✓</div>
                                            :<div className="provider-avatar">{prov.username[0].toUpperCase()}</div>
                                        }
                                        <div className="provider-info">
                                        <div className="provider-name">
                                            {prov.username}
                                        </div>
                                        <div className="provider-rating">{prov.averageRating?"★".repeat(prov.averageRating)+"☆".repeat(5-prov.averageRating): "☆".repeat(5)} ({prov.totalRating? prov.totalRating: 0})</div>
                                        {/* <div className="provider-details">{prov.category.charAt(0).toUpperCase()+prov.category.slice(1)} • Available Today</div> */}
                                        </div>
                                        {/* <button className="btn btn-secondary btn-small">Contact</button> */}
                                    </div>
                                ))}
                                {(filteredProv.length>0?filteredProv:providers).length>visibleCount &&
                                    <button className='btn btn-secondary btn-small' onClick={()=>setVisibleCount((prev)=>prev+5)}>Show More</button>
                                }

                                </div>
                            )}
                            
                            <button type='submit' className='btn btn-primary' style={{marginTop: "15px"}}>Submit</button>
                        </form>
                    </div>)}
            </div>
        </>

    )
}