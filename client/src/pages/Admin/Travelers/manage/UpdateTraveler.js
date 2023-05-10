import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getHeader } from '../../../../helper/Storage';
import { Spinner } from 'react-bootstrap';
const UpdateTraveler = () => {

    const headers = getHeader();

    const { id }= useParams("id");
    
    const navigate = useNavigate();

    const [traveler , setTraveler] = useState({
        name:"",
        email:"",
        password:"",
        phone:"",
        loading:false,
        err:null,
        reload:false
    });
    useEffect(() => {
        axios.get("http://localhost:7000/appointment/traveler-shows",headers)
        .then((resp)=>{
            const onetraveler = resp.data.find((trav)=>{
                return trav.id == id;
            })
            setTraveler({
                ...traveler,
                name:onetraveler.name,
                email:onetraveler.email,
                phone:onetraveler.phone,
                loading:true
            })
        })
        .catch((error)=>{});
    },[traveler.reload]);

    const updateTraveler = (e) => {

        e.preventDefault();

        setTraveler({...traveler , loading:true});
        axios.put("http://localhost:7000/appointment/update_user/"+id,
        {
            name:traveler.name,
            email:traveler.email,
            password:traveler.password,
            phone:traveler.phone
        },headers)
        .then((resp)=>{
            setTraveler({...traveler , loading:false});
            navigate("/dashboard/traveler");
        })
        .catch((error)=>{
            console.log(error);
            setTraveler({...traveler , loading:false , err:null});
        })
    }


    return (
        <div className="login">
            <h2>Add Traveler</h2>
            { traveler.err != null && traveler.err.map((error,index)=>(
                <Alert key={index} variant="danger" className='p-2'>
                    {error.msg}
                </Alert>
            ))}

            {traveler.loading === false && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )}

            {traveler.loading === true && (
            <>
                <Form onSubmit={updateTraveler}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Enter name" value={traveler.name} onChange={(e)=>{setTraveler({...traveler,name:e.target.value})}}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="Enter email" value={traveler.email} onChange={(e)=>{setTraveler({...traveler,email:e.target.value})}}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="password" placeholder="Enter email" required value={traveler.password} onChange={(e)=>{setTraveler({...traveler,password:e.target.value})}}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="text" placeholder="Enter Phone" value={traveler.phone} onChange={(e)=>{setTraveler({...traveler,phone:e.target.value})}}/>
                    </Form.Group>

                    <Button className="btn btn-success w-100" variant="primary" type="submit">
                        Add traveler
                    </Button> 
                </Form>
            </>
            )}
        </div>
    )
}

export default UpdateTraveler
