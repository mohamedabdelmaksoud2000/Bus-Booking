import React, { useState , useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { getHeader } from '../../../helper/Storage';

const Bus = () => {

    const [buses , setBus] = useState({
        loading:true,
        results:[],
        err:null,
        reload:0,
    });

    const headers = getHeader();

    useEffect(() => {
        setBus({...buses,loading:true});
        axios.get('http://localhost:7000/appointment/bus-shows',headers)
        .then( resp => {
            setBus({...buses,loading:false, results:resp.data,err:null});
        })
        .catch( err => {
            setBus({...buses,loading:false,err:"something went worng"});
        });
    },[buses.reload]);

    const deleteBus = (id) =>{
        setBus({...buses,loading:true});
        axios.delete('http://localhost:7000/appointment/delete_bus/'+ id,headers)
        .then( resp => {
            setBus({...buses,loading:false,err:null,reload: buses.reload + 1});
        })
        .catch( err => {});
    }

    return (
        <div className="travelers-index">
        {buses.loading === true && (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )}

        {buses.loading === false && buses.err === null && (
            <>
                <h2>Show Bus destinations</h2>
                <Link className="btn btn-success px-5 mb-2" to={"/dashboard/bus/add"}>add Bus destination</Link>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>busNumber</th>
                            <th>seatsBooked</th>
                            <th>status</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            buses.results.map((bus) => (
                                <tr key={bus.id}>
                                    <td >{bus.id}</td>
                                    <td>{bus.busNumber}</td>
                                    <td>{bus.seatsBooked}</td>
                                    <td>{bus.status}</td>
                                    <td className='d-flex justify-content-around'>
                                        <Button className='btn btn-danger'  onClick={(e) => {deleteBus(bus.id)}} >Delete</Button>
                                        <Link className='btn btn-primary' to={"/dashboard/bus/update/"+bus.id}>update</Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </>
        )}

        {
            buses.loading === false && buses.err != null && (
                <Alert variant="danger" className='p-2'>
                    something went worng
                </Alert>
            )
        }
        
    </div>
    )
}

export default Bus
