
const router=require("express").Router();
const conn= require("../db/connection");
const { body, validationResult } =require( "express-validator");
const authorized = require("../MiddleWare/authorized");
const admin=require("../MiddleWare/admin");
const upload= require("../MiddleWare/uploadimages");
const { query } = require("express");
const util=require("util"); //helper function
const fs=require("fs");
const crypto=require("crypto");
const bcrypt= require("bcrypt");
const { request } = require("http");


// get Appointment

router.get("/shows",admin,async (req,res)=>{
    const query=util.promisify(conn.query).bind(conn);
    const appointments = await query("select * from appointment");
    res.status(200).json(appointments);
});

router.get("/bus-shows",admin,async (req,res)=>{
    const query=util.promisify(conn.query).bind(conn);
    const buses = await query("select * from movies");
    res.status(200).json(buses);
});

router.get("/traveler-shows",admin,async (req,res)=>{
    const query=util.promisify(conn.query).bind(conn);
    const travelers = await query("select * from users where role=0");
    res.status(200).json(travelers);
}); 

router.get("/request-shows",authorized,async (req,res)=>{
    const query=util.promisify(conn.query).bind(conn);
    const requests = await query("select user_movie_review.id, user_movie_review.request ,user_movie_review.status, users.name, users.email, users.phone, appointment.Ticket_price, appointment.day_and_time  from user_movie_review INNER JOIN users ON user_movie_review.user_id=users.id INNER JOIN appointment ON appointment.appointment_id = user_movie_review.appointment_id");
    res.status(200).json(requests);
});


//ADMIN [CREATE APPOINTEMENT] 
router.post("/create_app", admin ,
body("Fromm")
.isString().
withMessage("PLEASE ENTER VALID PICKUP"),
body("Too")
.isString().
withMessage("PLEASE ENTER VALID DESTINATION"),
body("Ticket_price")
.isString().
withMessage("PLEASE ENTER VALID Price"),
body("day_and_time")
.isString().
withMessage("PLEASE ENTER VALID date and time"),
body("max_num_trav")
.isString().
withMessage("PLEASE ENTER VALID Number"),
async (req,res)=>{
    try {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()} );
    }
    //3-PREPARE APPOINTMENT OBJECT
    const appointment={
        Fromm:req.body.Fromm,
        Too:req.body.Too,
        Ticket_price:req.body.Ticket_price,
        day_and_time:req.body.day_and_time,
        max_num_trav:req.body.max_num_trav,
    }; 
    //4-INSERT APPOINTMENT IN DB
    const query=util.promisify(conn.query).bind(conn);
    await query("insert into appointment set ?",appointment)
    res.status(200).json({
    msg: "appointment created"
    });
}
catch (err) {
   res.status(500).json(err);  
}
} 
);


//UPDATE APPOINTMENT
router.put("/update_app/:Appointment_id", admin ,//params 
body("Fromm")
.isString().
withMessage("PLEASE ENTER VALID PICKUP"),
body("Too")
.isString().
withMessage("PLEASE ENTER VALID DESTINATION"),
body("Ticket_price")
.isString().
withMessage("PLEASE ENTER VALID Price"),
body("day_and_time")
.isString().
withMessage("PLEASE ENTER VALID date and time"),
body("max_num_trav")
.isNumeric().
withMessage("PLEASE ENTER VALID Number"),
async (req,res)=>{
    //1-VAIDATION REQUEST
    try {
        const query=util.promisify(conn.query).bind(conn);
        const errors= validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //2-APPOITNEMT EXISTS OR NOT
    const appointment= await query ("select * from appointment where Appointment_id=?",[req.params.Appointment_id]);

    if(!appointment[0]){
        res.status(404).json({msg:"NOT FOUND Appointment"});
    }
        //3-PREPARE APPOINTMENT OBJECT
    const appointmentObj={
        Fromm:req.body.Fromm,
         Too:req.body.Too,
        Ticket_price:req.body.Ticket_price,
        day_and_time:req.body.day_and_time,
        max_num_trav:req.body.max_num_trav
    };
    
    //4-UPDATE APPOINTMENT
    await query("update appointment set ? where Appointment_id=?",
    [appointmentObj,appointment[0].Appointment_id]);
    res.status(200).json({msg:"appointment updated successfully"});
    }
catch (err) {
   res.status(500).json(err);     
}
} 
);


//DELETE APPOINTMENT
router.delete("/delete_app/:Appointment_id", admin ,//params 
async (req,res)=>{

    try {
    //1-APPOINTMENT EXISTS OR NOT
    const query=util.promisify(conn.query).bind(conn);
    const appointment= await query ("select * from appointment where Appointment_id=?",[req.params.Appointment_id]);

    if(!appointment[0]){
        res.status(404).json({msg:"NOT FOUND Appointment"});
    }
    await query("delete from appointment where Appointment_id=?",
    [appointment[0].Appointment_id]);
    res.status(200).json({msg:"Appointment deleted successfully"});
    }
catch (err) {
   res.status(500).json(err);     
}
} 
);

//CREATE USER
router.post("/create_user", admin ,
body("name")
.isString().
withMessage("PLEASE ENTER VALID NAME"),
body("email")
.isEmail().
withMessage("PLEASE ENTER VALID EMAIL"),
body("password")
.isString().
withMessage("PLEASE ENTER VALID PASSWORD"),
body("phone")
.isNumeric().
withMessage("PLEASE ENTER VALID PHONE NUMBER"),
async (req,res)=>{
    try {
        
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //CREATE USER
    const userOBJ={
        name:req.body.name,
        email:req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        token: crypto.randomBytes(16).toString("hex"),
        phone:req.body.phone,
        // status:Joi.valid(['active', 'inactive']).required(),
    };

    //4-INSERT USER IN DB
    const query=util.promisify(conn.query).bind(conn);
    await query ("insert into users set ?",userOBJ);
    delete userOBJ.password;
    res.status(200).json({
    msg: "user created"
    });

}
catch (err) {
   res.status(500).json(err);     
}
} 
);


//UPDATE USER
router.put("/update_user/:id", admin ,//params 
body("name")
.isString().
withMessage("PLEASE ENTER VALID NAME"),
body("email")
.isEmail().
withMessage("PLEASE ENTER VALID EMAIL"),
body("password")
.isString().
withMessage("PLEASE ENTER VALID PASSWORD"),
body("phone")
.isNumeric().
withMessage("PLEASE ENTER VALID PHONE NUMBER"),
async (req,res)=>{
    //1-VAIDATION REQUEST
    try {
        const query=util.promisify(conn.query).bind(conn);
        const errors= validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //2-USER EXISTS OR NOT
    const users= await query ("select * from users where id=?",[req.params.id]);

    if(!users[0]){
        res.status(404).json({msg:"NOT FOUND user"});
    }
        //3-PREPARE APPOINTMENT OBJECT
        const userOBJ={
            name:req.body.name,
            email:req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            token: crypto.randomBytes(16).toString("hex"),
            phone:req.body.phone,
        };
    
    
    //4-UPDATE APPOINTMENT
    await query("update users set ? where id=?",
    [userOBJ,users[0].id]);
    res.status(200).json({msg:"USER updated successfully"});
    }
catch (err) {
   res.status(500).json(err);     
}
} 
);


//DELETE USER
router.delete("/delete_user/:id", admin ,//params 
async (req,res)=>{

    try {
    //1-USER EXISTS OR NOT
    const query=util.promisify(conn.query).bind(conn);
    const users= await query ("select * from users where id=?",[req.params.id]);

    if(!users[0]){
        res.status(404).json({msg:"NOT FOUND USER"});
    }
    await query("delete from users where id=?",
    [users[0].id]);
    res.status(200).json({msg:"user deleted successfully"});
    }
catch (err) {
   res.status(500).json(err);     
}
} 
);


//ADMIN [Add Bus] 
router.post("/create_bus", admin ,
body("busNumber")
.isString().
withMessage("PLEASE ENTER VALID BusNumber"),
body("seatsBooked")
.isString().
withMessage("PLEASE ENTER VALID seatsBooked"),
body("status")
.isString().
withMessage("PLEASE ENTER VALID Status"),
async (req,res)=>{
    try {  
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //3-PREPARE Bus OBJECT
    const movies={
        busNumber:req.body.busNumber,
        seatsBooked:req.body.seatsBooked,
        status:req.body.status,  
    };
    //4-INSERT Bus IN DB
    const query=util.promisify(conn.query).bind(conn);
    await query ("insert into movies set ?",movies)
    res.status(200).json({
    msg: "Bus has been added"
    });

}
catch (err) {
   res.status(500).json(err);  
}
} 
);


//UPDATE Bus
router.put("/update_bus/:id", admin ,//params 
body("busNumber")
.isNumeric().
withMessage("PLEASE ENTER VALID BusNumber"),
body("seatsBooked")
.isNumeric().
withMessage("PLEASE ENTER VALID seatsBooked"),
body("status")
.isString().
withMessage("PLEASE ENTER VALID Status"),
async (req,res)=>{
    //1-VAIDATION REQUEST
    try {
        const query=util.promisify(conn.query).bind(conn);
        const errors= validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //2-Bus EXISTS OR NOT
    const movies= await query ("select * from movies where id =?",[req.params.id]);

    if(!movies[0]){
        res.status(404).json({msg:"BUS NOT FOUND"});
    }
        //3-PREPARE Bus OBJECT
    const moviesObj={
        busNumber:req.body.busNumber,
        seatsBooked:req.body.seatsBooked,
        status:req.body.status,
    };
    
    //4-UPDATE Bus
    await query("update movies set ? where id=?",
    [moviesObj,movies[0].id]);
    res.status(200).json({msg:"Bus updated successfully"});
    }
catch (err) {
   res.status(500).json(err);     
}
} 
);


//DELETE Bus
router.delete("/delete_bus/:id", admin ,//params 
async (req,res)=>{

    try {
    //1-Bus EXISTS OR NOT
    const query=util.promisify(conn.query).bind(conn);
    const movies= await query ("select * from movies where id=?",[req.params.id]);

    if(!movies[0]){
        res.status(404).json({msg:"NOT FOUND BUS"});
    }
    await query("delete from movies where id=?",
    [movies[0].id]);
    res.status(200).json({msg:"BUS deleted successfully"});
    }
    catch (err) {
        res.status(500).json(err);     
    }
} 
);

//DELETE requests
router.delete("/delete_request/:id", admin ,//params 
async (req,res)=>{

    try {
    //1-Bus EXISTS OR NOT
    const query=util.promisify(conn.query).bind(conn);
    const movies= await query ("select * from user_movie_review where id=?",[req.params.id]);

    if(!movies[0]){
        res.status(404).json({msg:"NOT FOUND BUS"});
    }
    await query("delete from user_movie_review where id=?",
    [movies[0].id]);
    res.status(200).json({msg:"BUS deleted successfully"});
    }
    catch (err) {
        res.status(500).json(err);     
    }
} 
);


// ADMIN can search for empty status

router.get("/search_status",async (req,res)=>{
    const query=util.promisify(conn.query).bind(conn);
    let search ="";
    if(req.query.search){
         //QUEREY PARAMS
        search=`where status LIKE '' '%${req.query.search}`;
    }
    const status = await query(`select * from user_movie_review ${search}`);
    res.status(200).json(status);
});


// ADMIN can Accept or decline req by traveler

router.put("/update_request/:id", admin ,//params 
body("status")
.isString().
withMessage("PLEASE ENTER VALID String"),
async (req,res)=>{
    //1-VAIDATION REQUEST
    try {
        const query=util.promisify(conn.query).bind(conn);
        const errors= validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //2-Bus EXISTS OR NOT
    const request= await query ("select * from user_movie_review where id =?",[req.params.id]);

    if(!request[0]){
        res.status(404).json({msg:"Request NOT FOUND"});
    }
        //3-PREPARE Bus OBJECT
    const moviesObj={
        status:req.body.status,
    };
    //4-UPDATE Bus
    await query("update user_movie_review set ? where id=?",
    [moviesObj,request[0].id]);
    res.status(200).json({msg:"Status updated successfully"});
    }
catch (err) {
   res.status(500).json(err);     
}
} 
);


//ADMIN can LIST travelers appointment


router.get("/admin_list/:id",async (req,res)=>{
    const query=util.promisify(conn.query).bind(conn);
    const appointment = await query("select * from user_movie_review where user_id=?",[req.params.id]);
    const appointments = await query("select * from user_movie_review where user_id=?",[req.params.id]);

    if(!appointments[0]){
        res.status(404).json({msg:"user id Not Found"});
    }
    res.status(200).json(appointment);
}); 

// show for empty Status

router.get("/empty_status/",admin,async (req,res)=>{
    const query=util.promisify(conn.query).bind(conn);
    const appointments = await query("select user_movie_review.id, user_movie_review.request,user_movie_review.status, users.name, users.email from user_movie_review INNER JOIN users ON user_movie_review.user_id=users.id where status=''");
    if(!appointments){ 
        res.status(200).json({msg:"Appointment Not Found",data:[]});
    }
    res.status(200).json(appointments);
});


// USER View and filter appointments

router.get("/user_filter/:id",async (req,res)=>{
    const query=util.promisify(conn.query).bind(conn);
    const appointment = await query("select * from appointment where Appointment_id=?",req.params.id);
    const appointments = await query("select * from appointment where Appointment_id=?",[req.params.id]);

    if(!appointments[0]){
        res.status(404).json({msg:"Appointment Not Found"});
    }
    res.status(200).json(appointment);
});



// USER can request to the admin with required appointments

router.post("/request",authorized, body("appointment_id").isNumeric().withMessage("PLZ ENTER VALID ID")
,body("request").isString().withMessage("plz enter valid String"),
async (req,res)=>{
    try{
    const query=util.promisify(conn.query).bind(conn);
    //1-VAIDATION REQUEST
        const errors= validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
          }
          const appointment= await query ("select * from appointment where Appointment_id=?",[req.body.appointment_id]);

          if(!appointment[0]){
              res.status(404).json({msg:"NOT FOUND appointment"});
          }

          //3-PREPARE appointment request OBJECT
          const requestObj={
            user_id: res.locals.user.id,
            appointment_id: appointment[0].Appointment_id,
            request:req.body.request,
          };
          res.json({
            msg : "Request has been sent successfully"
          });

        //   4-INSER appointment OBJECT IN DB
          await query("insert into user_movie_review set?", requestObj);
        res.status(200).json({msg:"Request Sent Successfully"});
         } 
         catch(err){
          res.status(500).json(err);
         }
        }
        );


// USER can show history of appointments searches on his account

router.get("/user_history/:id",authorized,async (req,res)=>{
    const query=util.promisify(conn.query).bind(conn);
    const appointment = await query("select * from user_movie_review where user_id=?",req.params.id);
    const appointments = await query("select * from user_movie_review where user_id=?",[req.params.id]);

    if(!appointments[0]){
        res.status(404).json({msg:"user id Not Found"});
    }
    res.status(200).json(appointment);
});



// router.get("/user_history", authorized ,async (req,res)=>{
//     const query=util.promisify(conn.query).bind(conn);
//     let search ="";
//     if(req.query.search){
//          //QUEREY PARAMS
//         search=`where status LIKE '' '%${req.query.search}`;
//     }
//     const status = await query(`select * from user_movie_review ${search}`);
//     res.status(200).json(status);
// });








module.exports=router;
