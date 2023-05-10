import React ,{useState ,useEffect} from 'react';
import Table from 'react-bootstrap/Table';  
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import '../../../css/Traveler.css';
import { getHeader } from '../../../helper/Storage';

const Travelers = () => {

    const [travelers , setTraveler] = useState({
        loading:true,
        results:[],
        err:null,
        reload:0
    });

    const headers = getHeader();

    useEffect(() => {
        setTraveler({...travelers,loading:true});
        axios.get('http://localhost:7000/appointment/traveler-shows',headers)
        .then( resp => {
            setTraveler({...travelers,loading:false, results:resp.data,err:null});
        })
        .catch( err => {
            setTraveler({...travelers,loading:false,err:"something went worng"});
        });
    },[travelers.reload]);


    const deleteTravel = (id) =>{
        setTraveler({...travelers,loading:true});
        axios.delete('http://localhost:7000/appointment/delete_user/'+ id,headers)
        .then( resp => {
            setTraveler({...travelers,loading:false,err:null,reload: travelers.reload + 1});
        })
        .catch( err => {});
    }


    return (
        <div className="travelers-index">
            {travelers.loading === true && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )}

            {travelers.loading === false && travelers.err === null && (
            <>
                <h2>Show Travelers</h2>
                <Link className="btn btn-success px-5 mb-2" to={"/dashboard/traveler/add"}>add traveler</Link>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>name</th>
                            <th>email</th>
                            <th>phone</th>
                            <th>status</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            travelers.results.map((trave) => (
                                <tr key={trave.id} >
                                    <td>{trave.id}</td>
                                    <td>{trave.name}</td>
                                    <td>{trave.email}</td>
                                    <td>{trave.phone}</td>
                                    <td>{trave.status}</td>
                                    <td className='d-flex justify-content-around'>
                                        <Button className='btn btn-danger' onClick={(e) => {deleteTravel(trave.id)}}>Delete</Button>
                                        <Link className='btn btn-primary' to={"/dashboard/traveler/update/"+ trave.id}>update</Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </>
            )}

            {
                travelers.loading === false && travelers.err != null && (
                    <Alert variant="danger" className='p-2'>
                        something went worng
                    </Alert>
                )
            }

        </div>
    )
}

export default Travelers
