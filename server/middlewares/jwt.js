const jwt = require('jsonwebtoken');
const usersModel = require('../models/users.model');

module.exports = async (req,res,next) => {    
    
    try {        
        let token = null;
        //If missing a token
        if(!req.headers.authorization) {
            throw "Missing Authorization header";
        }
        else {
            //Make sure the token is correct
            let broken = req.headers.authorization.split(" "); 
            if(broken.length!=2 || broken[0]!='Bearer' || broken[1]=='') {
                throw "Invalid Authorization header";
            }
            else {
                //Extracts the data from the token
                token = req.headers.authorization.split(" ")[1]; 
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                let u = await usersModel.getRole(decoded.id);
                //Adds on the request the user's data of the functions will have access to the information
                req.userData = {
                    id: decoded.id,
                    name: decoded.name,
                    role: u.role
                }
                if(req.userData.level<1) {
                    throw "banned user"
                }
                next(); 
            }
        }
    }
    catch(e) {
        console.log('Error',e.name);
        return res.status(403).end(e.message);
    }        
}
