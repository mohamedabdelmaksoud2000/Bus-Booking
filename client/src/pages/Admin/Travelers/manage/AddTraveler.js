import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTraveler = () => {

    const navigate = useNavigate();

    const [traveler , setTraveler] = useState({
        name:"",
        email:"",
        password:"",
        phone:"",
        loading:false,
        err:null
    })
    const createTraveler = (e) => {

        e.preventDefault();
        setTraveler({...traveler , loading:true});
        axios.post("http://localhost:7000/auth/register",
        {
            name:traveler.name,
            email:traveler.email,
            password:traveler.password,
            phone:traveler.phone
        })
        .then((resp)=>{
            setTraveler({...traveler , loading:false});
            navigate("/dashboard/traveler");
        })
        .catch((error)=>{
            setTraveler({...traveler , loading:false ,err:error.response.data.errors});
        })
    }


    return (
        <div className="login">
            <h2>Add Traveler</h2>

            {traveler.err !==null && traveler.err.map((error,index)=>(
                <Alert key={index} variant="danger" className='p-2'>
                    {error.msg}
                </Alert>
            ))}

            <Form onSubmit={createTraveler}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control 
                        type="text" 
                        placeholder="Enter name"
                        value={traveler.name}
                        onChange={(e)=>{setTraveler({...traveler , name:e.target.value})}}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        value={traveler.email}
                        onChange={(e)=>{setTraveler({...traveler , email:e.target.value})}}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control 
                        type="password" 
                        placeholder="Enter Password" 
                        value={traveler.password}
                        onChange={(e)=>{setTraveler({...traveler , password:e.target.value})}}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control 
                        type="text" 
                        placeholder="Enter Phone"
                        value={traveler.phone}
                        onChange={(e)=>{setTraveler({...traveler , phone:e.target.value})}}
                    />
                </Form.Group>
                <Button className="btn btn-success w-100" variant="primary" type="submit" disabled={traveler.loading === true}>
                    Add traveler
                </Button> 
            </Form>
        </div>
    )
}

export default AddTraveler
