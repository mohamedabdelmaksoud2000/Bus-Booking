const conn = require("../db/connection");
const util = require("util");

const authorized = async (req, res, next) => {

    const query = util.promisify(conn.query).bind(conn);
    const {token} = req.headers;
    const user = await query("select * from users where token = ?", [token]);
    if (user) {
        res.locals.user = user;
        next();
    } else {
        res.status(403).json({
            msg:"you are not authorized to access this route! "+ token 
        });
    }
};

module.exports = authorized;