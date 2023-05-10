import React, { useState , useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { getHeader } from '../../../../helper/Storage';


const StatusRequest = () => {
    const [request , setRequest] = useState({
        loading:true,
        results:[],
        err:null,
        reload:0,
    });

    const headers = getHeader();

    useEffect(() => {
        setRequest({...request,loading:true});
        axios.get('http://localhost:7000/appointment/empty_status/',headers)
        .then( resp => {
            console.log(resp.data);
            setRequest({...request,loading:false, results:resp.data,err:null});
        })
        .catch( err => {
            setRequest({...request,loading:false,err:"something went worng"});
        });
    },[request.reload]);

    const acceptRequest = (id) =>{
        setRequest({...request,loading:true});
        axios.put('http://localhost:7000/appointment/update_request/'+ id,
        {
            status:"Accepted"
        }
        ,headers)
        .then( resp => {
            setRequest({...request,loading:false,err:null,reload: request.reload + 1});
        })
        .catch( err => {});
    }

    const rejectRequest = (id) =>{
        setRequest({...request,loading:true});
        axios.put('http://localhost:7000/appointment/update_request/'+ id,
        {
            status:"Rejected"
        }
        ,headers)
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
                <Link className="btn btn-success px-5 mb-2" to={"/dashboard/bus/add"}>add request</Link>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>request desc</th>
                            <th>name traveler</th>
                            <th>email traveler</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            request.results !== null && request.results.map((req,index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{req.request}</td>
                                    <td>{req.name}</td>
                                    <td>{req.email}</td>
                                    <td className='d-flex justify-content-around'>
                                        <Button className='btn btn-success'  onClick={(e) => {acceptRequest(req.id)}} >Accepte</Button>
                                        <Button className='btn btn-danger'  onClick={(e) => {rejectRequest(req.id)}} >Reject</Button>
                                    </td>
                                </tr>
                            ))
                        }
                        {
                            request.results == null && (
                               <tr>
                                    <td>not found</td>
                               </tr>
                            )
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

export default StatusRequest
