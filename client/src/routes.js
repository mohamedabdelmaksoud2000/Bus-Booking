import {Navigate, createBrowserRouter} from "react-router-dom";
import Home from './pages/Traveler/Home';
import Login from "./pages/Auth/Login";
import App from "./App";
import Travelers from "./pages/Admin/Travelers/Travelers";
import AddTraveler from "./pages/Admin/Travelers/manage/AddTraveler";
import UpdateTraveler from "./pages/Admin/Travelers/manage/UpdateTraveler";
import Appoinment from "./pages/Admin/Appointments/Appoinment";
import AddAppointment from "./pages/Admin/Appointments/Manage/AddAppointment";
import UpdateAppointment from "./pages/Admin/Appointments/Manage/UpdateAppointment";
import Bus from "./pages/Admin/Bus/Bus";
import AddBus from "./pages/Admin/Bus/manage/AddBus";
import UpdateBus from "./pages/Admin/Bus/manage/UpdateBus";
import Guest from "./middleware/Guest";
import Auth from "./middleware/Auth";
import Admin from "./middleware/Admin";
import Traveler from "./middleware/Admin";
import Request from "./pages/Admin/Request/Request";
import StatusRequest from "./pages/Admin/Request/manage/StatusRequest";
import UpdateRequest from "./pages/Admin/Request/manage/UpdateRequest";

export const routes = createBrowserRouter([
    {
        path:"",
        element: <App/>,
        children:[
            {
                path: "",
                element:<Home/>,
            },
            {
                
                element: <Guest />,
                children:[
                    {
                        path: "/login",
                        element:<Login />
                    }
                ]
            },
            {
                element:<Auth />,
                children:[
                    {
                        element:<Admin />,
                        children:[
                            // Start Dashboard
                            {
                                path: "/dashboard",
                                children:[
                                    // Start Manage Travelers 
                                    {
                                        path: "traveler",
                                        children:[
                                            {
                                                path: "",
                                                element: <Travelers />,
                                            },
                                            {
                                                path: "add",
                                                element: <AddTraveler />,
                                            },
                                            {
                                                path: "update/:id",
                                                element: <UpdateTraveler />,
                                            }
                                        ]
                                    },
                                    // End Manage Travelers

                                    // Start Manage Appointments 
                                    {
                                        path: "appoint",
                                        children:[
                                            {
                                                path: "",
                                                element: <Appoinment />,
                                            },
                                            {
                                                path: "add",
                                                element: <AddAppointment />,
                                            },
                                            {
                                                path: "update/:id",
                                                element: <UpdateAppointment />,
                                            }
                                        ]
                                    },
                                    // End Manage Appointments

                                    // Start Manage Bus Destination 
                                    {
                                        path: "bus",
                                        children:[
                                            {
                                                path: "",
                                                element: <Bus />,
                                            },
                                            {
                                                path: "add",
                                                element: <AddBus />,
                                            },
                                            {
                                                path: "update/:id",
                                                element: <UpdateBus />,
                                            }
                                        ]
                                    },
                                    // End Manage Bus Destination

                                    // Start Manage Bus Destination 
                                    {
                                        path: "request",
                                        children:[
                                            {
                                                path: "",
                                                element: <Request />,
                                            },
                                            {
                                                path: "status",
                                                element: <StatusRequest />,
                                            },
                                            {
                                                path: "update/:id",
                                                element: <UpdateRequest />,
                                            }
                                        ]
                                    },
                                    // End Manage Bus Destination
                                ]
                            },
                            // End Dashboard         
                        ]
                    },
                    {
                        element:<Traveler />,
                        children:
                        [

                        ]
                    }  
                ]
            }   
        ]
    },
    {
        path:"*",
        element: <Navigate to={"/"} />
    }  
]);