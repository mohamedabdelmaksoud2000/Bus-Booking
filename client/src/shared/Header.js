import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { getAuthUser, removeAuthUser } from '../helper/Storage';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = () => {
    const navigate = useNavigate();
    const auth = getAuthUser();
    const Logout = () =>
    {
        removeAuthUser();
        navigate("/login");
    };

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Bus Booking</Navbar.Brand>
                    <Nav className="me-auto">
                        
                        {/* Admin Route */}
                        {
                            auth && auth.role === 1 && (
                                <>
                                    <Link className="nav-link" to={"/dashboard/appoint"}>Manage appoint</Link>
                                    <Link className="nav-link" to={"/dashboard/bus"}>Manage bus destinations</Link>
                                    <Link className="nav-link" to={"/dashboard/traveler"}>Manage Traveler</Link>
                                    
                                    <NavDropdown title="Requests" id="basic-nav-dropdown">
                                        <Link className="dropdown-item" to={"/dashboard/request"}>List requests</Link>
                                        <Link className="dropdown-item" to={"/dashboard/request/status"}>Accept or Rejected of requests</Link>
                                    </NavDropdown>
                                </>
                            )
                        }

                        {/* Travelers Route */}

                        {
                            auth && auth.role === 0 && (
                                <>

                                </>
                            )
                        }
                    </Nav>
                    

                    {/* unauthentication */}
                    {
                        auth && (
                            <Nav className='ms-auto'>
                                <Nav.Link onClick={Logout}>Logout</Nav.Link>
                            </Nav>
                        )
                    }

                    {/* // authentication */}
                    {
                        !auth && (
                            <Nav className='ms-auto'>
                                <Link className="nav-link" to={"/login"}>Login</Link>
                            </Nav>
                        )
                    }
                    
                </Container>
            </Navbar>
        </>
    )
}

export default Header
