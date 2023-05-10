import React, { useState , useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { getHeader } from '../../../helper/Storage';

const Request = () => {
    const [request , setRequest] = useState({
        loading:true,
        results:[],
        err:null,
        reload:0,
    });

    const headers = getHeader();

    useEffect(() => {
        setRequest({...request,loading:true});
        axios.get('http://localhost:7000/appointment/request-shows',headers)
        .then( resp => {
            console.log(resp.data);
            setRequest({...request,loading:false, results:resp.data,err:null});
        })
        .catch( err => {
            setRequest({...request,loading:false,err:"something went worng"});
        });
    },[request.reload]);

    const deleteRequest = (id) =>{
        setRequest({...request,loading:true});
        console.log(id);
        axios.delete('http://localhost:7000/appointment/delete_request/'+id,headers)
        .then( resp => {
            setRequest({...request,loading:false,err:null,reload: request.reload + 1});
        })
        .catch( err => {});
    }

    return (
        <div className="travelers-index">
        {request.loading === true && (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )}

        {request.loading === false && request.err === null && (
            <>
                <h2>Show request</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>request desc</th>
                            <th>name traveler</th>
                            <th>phone traveler</th>
                            <th>email traveler</th>
                            <th>price appointment</th>
                            <th>time appointment</th>
                            <th>status</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            request.results.map((req,index) => (
                                <tr key={index}>
                                    <th>{index}</th>
                                    <th>{req.request}</th>
                                    <th>{req.name}</th>
                                    <th>{req.phone}</th>
                                    <th>{req.email}</th>
                                    <th>{req.Ticket_price}</th>
                                    <th>{req.day_and_time}</th>
                                    <td>{req.status}</td>
                                    <td className='d-flex justify-content-around'>
                                        <Button className='btn btn-danger'  onClick={(e) => {deleteRequest(req.id)}} >Delete</Button>
                                        <Link className='btn btn-primary' to={"/dashboard/request/update/"+req.id}>update</Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </>
        )}

        {
            request.loading === false && request.err != null && (
                <Alert variant="danger" className='p-2'>
                    something went worng
                </Alert>
            )
        }
        
    </div>
    )
}

export default Request
