import React from 'react';
import { getAuthUser } from '../helper/Storage';
import { Navigate,Outlet } from 'react-router-dom';

const Auth = () => {

    const auth = getAuthUser();
    
    return (
        <>
            {auth ? <Outlet /> : <Navigate to={"/login"}/>}
        </>
    )
}

export default Auth
