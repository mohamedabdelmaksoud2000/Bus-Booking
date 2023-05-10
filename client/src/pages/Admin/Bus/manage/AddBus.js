import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getHeader } from '../../../../helper/Storage';

const AddBus = () => {

    const navigate = useNavigate();
    const headers = getHeader();

    const [bus , setBus] = useState({
        busNumber:"",
        seatsBooked:"",
        status:"active",
        loading:false,
        err:null
    })
    const createBus = (e) => {

        e.preventDefault();
        setBus({...bus , loading:true});
        axios.post("http://localhost:7000/appointment/create_bus",
        {
            busNumber:bus.busNumber,
            seatsBooked:bus.seatsBooked,
            status:bus.status,
        },headers)
        .then((resp)=>{
            setBus({...bus , loading:false});
            navigate("/dashboard/bus");
        })
        .catch((error)=>{
            setBus({...bus , loading:false ,err:error.response.data.errors});
        })
    }

    return (
        <div className="login">
            <h2>Add Bus Destination</h2>

            {bus.err !==null && bus.err.map((error,index)=>(
                <Alert key={index} variant="danger" className='p-2'>
                    {error.msg}
                </Alert>
            ))}

            <Form onSubmit={createBus}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control 
                    type="text" 
                    placeholder="Bus Number"
                    value={bus.busNumber}
                    onChange={(e)=>{setBus({...bus , busNumber:e.target.value})}}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control 
                    type="text" 
                    placeholder="seats Booked"
                    value={bus.seatsBooked}
                    onChange={(e)=>{setBus({...bus , seatsBooked:e.target.value})}}
                    />
                </Form.Group>
                <Form.Select aria-label="status"
                    value={bus.status}
                    onChange={(e)=>{setBus({...bus , status:e.target.value})}}>
                    <option value="active">active</option>
                    <option value="in-active">in-active</option>
                </Form.Select>
                <Button className="btn btn-success w-100 mt-2" variant="primary" type="submit" disabled={bus.loading === true}>
                    Add Bus Destination
                </Button> 
            </Form>
        </div>
    )
}

export default AddBus
