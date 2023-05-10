const router = require("express").Router();
const conn = require("../db/connection");
const { body, validationResult } = require("express-validator");
const util = require("util");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


// Register

router.post("/register", body("email").isEmail().withMessage("Please Enter a Valid E-mail!"),
body("name").isString().withMessage("Please Enter a Valid Name!").isLength({min:10, max:20}).withMessage("name should be between 10-20 chars"),
body("password").isLength({min:8, max:12}).withMessage("password should be between 8-12 chars!"),body("phone").isMobilePhone().withMessage('the feild phone is reqiured'),
async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array() });
        }
        const query = util.promisify(conn.query).bind(conn);
        const checkEmailExists = await query("select * from users where email = ?",
        [req.body.email]
        );
        if(checkEmailExists.length > 0) {
            res.status(400).json({
                errors: [
                    {
                        msg: "email already exists!",
                    },
                ],
            });
        }
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            phone: req.body.phone,
            role:0,
            token: crypto.randomBytes(16).toString("hex"),
        };
        await query("insert into users set ? ", userData);
        delete userData.password;
        res.status(200).json(userData);
    } catch(err) {
        res.status(500).json({err:err});
    }
});

// Login

router.post("/login", body("email").isEmail().withMessage("Please Enter a Valid E-mail!"),
body("password").isLength({min:8, max:12}).withMessage("password should be between 8-12 chars!"),
async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array() });
        }
        const query = util.promisify(conn.query).bind(conn);
        const user = await query("select * from users where email = ?",
        [req.body.email]
        );
        if(user.length == 0) {
            res.status(404).json({
                errors: [
                    {
                        msg: "email or password not found!",
                    },
                ],
            });
        }
        const checkPassword = await bcrypt.compare(req.body.password, user[0].password)
        if(checkPassword){
            delete user[0].password;
            res.status(200).json(user[0]);
        } else {
            res.status(404).json({
                errors: [
                    {
                        msg: "email or password not found!",
                    },
                ],
            });
        }
    } catch(err) {
        res.status(500).json({err:err});
    }
});



module.exports = router;