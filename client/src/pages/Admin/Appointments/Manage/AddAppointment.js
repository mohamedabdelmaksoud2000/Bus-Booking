import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { getHeader } from '../../../../helper/Storage';
import axios from 'axios';

const AddAppointment = () => {

    const navigate = useNavigate();
    const headers = getHeader();

    const [appoint , setAppoint] = useState({
        Fromm:"",
        Too:"",
        Ticket_price:"",
        day_and_time:"",
        max_num_trav:"",
        loading:false,
        err:null
    })
    const createAppoint = (e) => {
        e.preventDefault();

        setAppoint({...appoint , loading:true});
        axios.post("http://localhost:7000/appointment/create_app",
        {
            Fromm:appoint.Fromm,
            Too:appoint.Too,
            Ticket_price:appoint.Ticket_price,
            day_and_time:appoint.day_and_time,
            max_num_trav:appoint.max_num_trav,
        },headers)
        .then((resp)=>{
            setAppoint({...appoint , loading:false});
            navigate("/dashboard/appoint");
        })
        .catch((error)=>{
            setAppoint({...appoint , loading:false ,err:error.response.data.errors});
        })
    }

    return (
    <div className="login">
            <h2>Add Appoinment</h2>

            {appoint.err !==null && appoint.err.map((error,index)=>(
                <Alert key={index} variant="danger" className='p-2'>
                    {error.msg}
                </Alert>
            ))}

            <Form onSubmit={createAppoint}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control 
                    type="text" 
                    placeholder="From" 
                    value={appoint.Fromm}
                    onChange={(e)=>{setAppoint({...appoint , Fromm:e.target.value})}}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control 
                    type="text" 
                    placeholder="to"
                    value={appoint.Too}
                    onChange={(e)=>{setAppoint({...appoint , Too:e.target.value})}}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control 
                    type="text" 
                    placeholder='Ticket price'
                    value={appoint.Ticket_price}
                    onChange={(e)=>{setAppoint({...appoint , Ticket_price:e.target.value})}}
                    />
                </Form.Group>


                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control 
                    type="text" 
                    placeholder='Enter time exp (10/10/2010 - 5:00)'
                    value={appoint.day_and_time}
                    onChange={(e)=>{setAppoint({...appoint , day_and_time:e.target.value})}}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control 
                    type="text" 
                    placeholder="Enter Max Number" 
                    value={appoint.max_num_trav}
                    onChange={(e)=>{setAppoint({...appoint , max_num_trav:e.target.value})}}
                    />
                </Form.Group>
                <Button className="btn btn-success w-100" variant="primary" type="submit" disabled={appoint.loading === true}>
                    Add Appoinment
                </Button> 
            </Form>
        </div>
    )
}

export default AddAppointment
