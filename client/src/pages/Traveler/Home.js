import React, { useEffect, useState } from 'react'
import { getHeader } from '../../helper/Storage';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';

const Home = () => {

    const [appoints , setAppoint] = useState({
        loading:true,
        results:[],
        err:null,
        reload:false,
    });

    const headers = getHeader();

    useEffect(() => {
        setAppoint({...appoints,loading:true});
        axios.get('http://localhost:7000/appointment/shows',headers)
        .then( resp => {
            console.log(resp.data);
            setAppoint({...appoints,loading:false, results:resp.data,err:null});
        })
        .catch( err => {
            console.log(headers);

            setAppoint({...appoints,loading:false,err:"something went worng"});
        });
    },[appoints.reload]);

    return (
        <div className='container'>
            <div className='row'>
                <Form className="d-flex col-12 m-3">
                    <Form.Group className="col-11" controlId="formBasicEmail">
                        <Form.Control 
                        className="rounded-0" 
                        type="text" 
                        placeholder="Enter email" 
                        
                        />
                    </Form.Group>
                    <Button className='btn btn-dark rounded-0' type="submit">
                        search
                    </Button>
                </Form>

            </div>
        </div>
    )
}

export default Home
