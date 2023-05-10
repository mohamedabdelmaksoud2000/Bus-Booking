import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getHeader } from '../../../../helper/Storage';
import { Spinner } from 'react-bootstrap';

const UpdateBus = () => {

    const navigate = useNavigate();
    const headers = getHeader();
    const { id }= useParams("id");

    const [bus , setBus] = useState({
        busNumber:"",
        seatsBooked:"",
        status:"active",
        loading:false,
        reload:false,
        err:null
    })

    useEffect(() => {
        axios.get("http://localhost:7000/appointment/bus-shows",headers)
        .then((resp)=>{
            const oneBus = resp.data.find((trav)=>{
                return trav.id == id;
            })
            setBus({
                ...bus,
                busNumber:oneBus.busNumber,
                seatsBooked:oneBus.seatsBooked,
                status:oneBus.status,
                loading:true
            })
        })
        .catch((error)=>{});
    },[bus.reload]);


    const updateBus = (e) => {

        e.preventDefault();
        setBus({...bus , loading:true});
        axios.put("http://localhost:7000/appointment/update_bus/"+id,
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
            { bus.err != null && bus.err.map((error,index)=>(
                <Alert key={index} variant="danger" className='p-2'>
                    {error.msg}
                </Alert>
            ))}

            {bus.loading === false && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )}


            {bus.loading === true && (
            <>
            <Form onSubmit={updateBus} >
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
                <Button className="btn btn-success w-100" variant="primary" type="submit" disabled={bus.loading === true}>
                    update Bus Destination
                </Button> 
            </Form>
            </>
            )}
        </div>
    )
}

export default UpdateBus
