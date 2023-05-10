import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';  
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AppointRow from '../componants/AppointRow';
import { Button } from 'react-bootstrap';
import { getHeader } from '../../../helper/Storage';

const Appoinment = () => {

    const headers = getHeader();

    const [appoints ,setAppoint] = useState({
        loading:true,
        results:[],
        err:null,
        reload: 0,
    });

    useEffect(() => {
        setAppoint({...appoints,loading:true});
        axios.get('http://localhost:7000/appointment/shows',headers)
        .then( resp => {
            setAppoint({...appoints,loading:false, results:resp.data,err:null});
        })
        .catch( err => {
            setAppoint({...appoints,loading:false,err:"something went worng"});
        });
    },[ appoints.reload]);


    const deleteAppoint = (id) =>{
        setAppoint({...appoints,loading:true});
        axios.delete('http://localhost:7000/appointment/delete_app/'+ id,headers)
        .then( resp => {
            setAppoint({...appoints,loading:false,err:null,reload: appoints.reload + 1});
        })
        .catch( err => {});
    }




    return (
        <div className="travelers-index">
            {
                appoints.loading === true && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                )
            }
            {
                appoints.loading === false && appoints.err == null && (
                    <>
                        <h2>Show Travelers</h2>
                        <Link className="btn btn-success px-5 mb-2" to={"/dashboard/appoint/add"}>add Appointment</Link>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>price ticket</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>time</th>
                                    <th>Max number</th>
                                    <th>actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {
                                        appoints.results.map((appoint) => (
                                            <tr key={appoint.Appointment_id} >
                                                <td>{appoint.Appointment_id}</td>
                                                <td>{appoint.Ticket_price}</td>
                                                <td>{appoint.fromm}</td>
                                                <td>{appoint.too}</td>
                                                <td>{appoint.day_and_time}</td>
                                                <td>{appoint.max_num_trav}</td>
                                                <td className='d-flex justify-content-around'>
                                                    <Button className='btn btn-danger' onClick={(e) => {deleteAppoint(appoint.Appointment_id)}}>Delete</Button>
                                                    <Link className='btn btn-primary' to={"/dashboard/appoint/update/"+appoint.Appointment_id}>update</Link>
                                                </td>
                                            </tr>
                                        ))
                                    }

                            </tbody>
                        </Table>
                    </>
                )
            }

            {
                appoints.loading === false && appoints.err != null && (
                    <Alert variant="danger" className='p-2'>
                        something went worng
                    </Alert>
                )
            }
        </div>
    )
}

export default Appoinment
