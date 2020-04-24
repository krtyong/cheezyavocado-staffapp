import React, { useState, useEffect } from "react";
// import axios from 'axios'
import cheezyavocado from "../unnamed.png";
// import axios from "axios";
import api_axios from "../api.js";


function Authentication(props) {

    const [values, setValues] = useState({department: "", password: ""});
    // const [error, setError] = useState({department: "", password: ""});
    
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrected, setIsCorrected] = useState(false);

    useEffect(()=> {
        setIsCorrected(true);
    },[])

    function handleChange(event) {
        const { name, value } = event.target;
        setValues({
            ...values, 
            [name]: value
        });
        console.log(values);
    }

    function handleSelect(event) {
        const { name, value } = event.target;
        setValues({
            ...values, 
            [name]: value
        });
        console.log(values);
    }


    function handleSubmit(event) {
        event.preventDefault();
        console.log(values);
        setIsSubmitted(true);
        console.log(isSubmitted);
        

        api_axios.post('/authen/staff', values)
        .then(response => {
            console.log(response);
            console.log(response.data);

            if(response.data === "Incorrect data"){
                setIsCorrected(false);
            } else if (response.data.accessToken && values.department === 'Kitchen'){
                setIsCorrected(true);
                props.history.push("/kitchen");
            } else if (response.data.accessToken && values.department === 'Housekeeping'){
                setIsCorrected(true);
                props.history.push("/housekeeping");
            }

        });

    }

    // useEffect(() => {
    //     if (values.department === 'department') {
    //         setIsSelected(false);
    //     } else {
    //         setIsSelected(true);
    //     }
    // }, [isSubmitted])

    return (
        <div className="container">
            <h1>Cheezy Avocado</h1>
            <img className='cheezyavocado' src={cheezyavocado} />
            <form onSubmit={handleSubmit}>
                <label>Select Department: </label>
                    <div className="custom-select">
                        <select   
                            name='department'
                            onChange={handleSelect} 
                            value={values.department}
                        >
                            <option selected value="">Choose your Department</option>
                            <option value="Kitchen">KITCHEN</option>
                            <option value="Housekeeping">HOUSE KEEPING</option>
                        </select>
                    </div> 
                    {/* <div>{isSelected ? <p>Please select your department.</p> : null}</div> */}
                <label>Enter department's password</label>
                <input 
                    name="password"
                    type="password"
                    onChange={handleChange}
                    value={values.password}
                    placeholder="Department's Password"        
                />
                <div>{isCorrected ? null : <p className="error">Please select your department or enter the correct password.</p>}</div>
                <div className='buttonmargin'>
                    <button className='enterbutton' type="submit">Enter</button>
                </div>
            </form>
        </div>
    )

}

export default Authentication;