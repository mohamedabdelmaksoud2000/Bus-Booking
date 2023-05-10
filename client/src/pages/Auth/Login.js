import React , { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import '../../css/Login.css';
import { setAuthUser } from '../../helper/Storage';
import { useNavigate } from 'react-router-dom';
const Login = () => {

    const navigate = useNavigate();

    const [login , setLogin] = useState({
        email:"",
        password:"",
        loading:false,
        err:null
    })

    const userLogin = (e)=>{
        
        e.preventDefault();
        setLogin({...login , loading:true ,err:[]});
        axios.post("http://localhost:7000/auth/login",
        {
            email:login.email,
            password:login.password
        })
        .then((resp)=>{
            setLogin({...login,loading:false , err:null});
            setAuthUser(resp.data);
            navigate("/")
        })
        .catch((error)=>{
            setLogin({...login,loading:false , err:error.response.data.errors});
        });
    }

    return (
        <div className="login">
            <h2>Login user</h2>
            {login.err !==null && login.err.map((error,index)=>(
                <Alert key={index} variant="danger" className='p-2'>
                    {error.msg}
                </Alert>
            ))}
            <Form onSubmit={userLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control 
                        type="email" 
                        placeholder="please enter your email" 
                        value={login.email} 
                        onChange={(e) => {setLogin({ ...login , email:e.target.value})}} 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control 
                        type="password" 
                        placeholder="please enter your Password"
                        value={login.password} 
                        onChange={(e) => {setLogin({ ...login , password:e.target.value})}}  
                    />
                </Form.Group>
                <Button className="btn btn-dark w-100" variant="primary" type="submit" disabled={login.loading === true}>
                    login
                </Button>
            </Form>
        </div>
    )
}

export default Login
