import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { getHeader } from '../../../../helper/Storage';

const UpdateRequest = () => {

    const navigate = useNavigate();
    const headers = getHeader();
    const { id }= useParams("id");

    const [request, setRequest] = useState({
        name:"",
        request:"",
        status:"active",
        loading:false,
        reload:false,
        err:null
    })

    useEffect(() => {
        axios.get("http://localhost:7000/appointment/request-shows",headers)
        .then((resp)=>{
            const oneReq = resp.data.find((trav)=>{
                return trav.id == id;
            })
            setRequest({
                ...request,
                name:oneReq.name,
                request:oneReq.request,
                status:oneReq.status,
                loading:true
            })
        })
        .catch((error)=>{});
    },[request.reload]);


    const updateReq = (e) => {

        e.preventDefault();
        setRequest({...request, loading:false});
        axios.put("http://localhost:7000/appointment/update_request/"+id,
        {
            status:request.status,
        },headers)
        .then((resp)=>{
            setRequest({...request, loading:true});
            navigate("/dashboard/request");
        })
        .catch((error)=>{
            setRequest({...request, loading:true ,err:error.response.data.errors});
        })
    }

    return (
        <div className="login">
            <h2>update request for traveler { request.name }</h2>
            { request.err != null && request.err.map((error,index)=>(
                <Alert key={index} variant="danger" className='p-2'>
                    {error.msg}
                </Alert>
            ))}

            {request.loading === false && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )}


            {request.loading === true && (
            <>
            <Form onSubmit={updateReq} >
                <Form.Select aria-label="status"
                    value={request.status}
                    onChange={(e)=>{setRequest({...request, status:e.target.value})}}>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                </Form.Select>
                <Button className="btn btn-success w-100" variant="primary" type="submit" disabled={request.loading === false}>
                    update Bus Destination
                </Button> 
            </Form>
            </>
            )}
        </div>
    )
}

export default UpdateRequest
