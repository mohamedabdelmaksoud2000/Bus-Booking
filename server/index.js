const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static("upload"));
const cors = require("cors");
app.use(cors());

const auth = require("./Routes/Auth");
const appointment = require("./Routes/movies");

app.use("/auth", auth);
app.use("/appointment", appointment);

app.listen(7000, "localhost", () => {
    console.log("Server is Running");

});



