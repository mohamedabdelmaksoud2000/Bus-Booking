import React from 'react'
import { getAuthUser } from '../helper/Storage'

const traveler = () => {

    const auth = getAuthUser();

    return (
        <>
            { auth.role === 0 ? <Outlet/> : <Navigate to={"/"}/> }
        </>
    )
}

export default traveler
