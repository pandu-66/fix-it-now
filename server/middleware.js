const {userSignupSchema, userLoginSchema, issueSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const jwt = require('jsonwebtoken');

module.exports.authenticateUser = (req, res, next)=>{
    const token = req.cookies.token;
    if(!token) throw new ExpressError(401, "User Not Logged In");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        throw new ExpressError(401, "Invalid token");
    }
}


module.exports.validateUserSignUp = (req, res, next)=>{
    let {error, value} = userSignupSchema.validate(req.body, {abortEarly: false});
    if(error){
        let message = error.details.map((el)=>({field: el.path[0], message: el.message}));
        console.log(message);
        throw new ExpressError(400, message);
    }else{
        req.body = value;
        next();
    }
}

module.exports.validateLogIn = (req, res, next)=>{
    let {error} = userLoginSchema.validate(req.body, {abortEarly: false});
    if(error){
        let message = error.details.map((el)=>({field: el.path[0], message: el.message}));
        console.log(message);
        throw new ExpressError(400, message);
    }else{
        next();
    }
}

module.exports.validateIssue = (req, res, next)=>{
    let {error} = issueSchema.validate(req.body, {abortEarly: false});

    if(error){
        let message = error.details.map((el)=>({field: el.path[0], message: el.message}));
        console.log(error);
        throw new ExpressError(400, message);
    }else{
        next();
    }
}