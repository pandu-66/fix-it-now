const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();

const {authenticateUser, validateUserSignUp, validateLogIn, validateIssue} = require("./middleware.js");
const User = require('./models/user.js');
const Issue = require('./models/issue.js');
const ExpressError = require('./utils/ExpressError.js');

dotenv.config();
app.use(express.json());
app.use(cookieParser());

async function main(){
    await mongoose.connect(process.env.ATLAS_URL);
}

main().then(()=>console.log("DB connected")).catch((err)=>console.log(err));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.post("/login", validateLogIn, async(req, res, next)=>{
    let {password, ...rest} = req.body;

    try {
        const dbUser = await User.findOne({email: rest.email});
        if(dbUser.role!==rest.role) throw new ExpressError(400, [{field: "role", message: "Invalid Role"}]);
        const compare = await bcrypt.compare(password, dbUser.password);
        if(compare && dbUser){
            const token = jwt.sign({id: dbUser._id, role: dbUser.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false
            });
            res.send({role: dbUser.role});
        }else{
            throw new ExpressError(401, [{field: "password", message: "Invalid Email or Password"}]);
        }
    } catch (error) {
        throw new ExpressError(401, [{field: "password", message: "Invalid Email or Password"}]);
    }
});

app.post("/signup", validateUserSignUp, async(req, res, next)=>{
    console.log(req.body);
    try {
        let user = req.body;

        const existingUser = await User.findOne({email: user.email});
        if(existingUser) throw new ExpressError(400, [{field: "email", message: "Email already exists"}]);

        let hashedPass = await bcrypt.hash(user.password, 10);
        let newUser = new User({...user, password: hashedPass});
        await newUser.save();

        const token = jwt.sign({id: newUser._id, role: newUser.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        });
        res.status(200).send({role: newUser.role});
    } catch (error) {
        console.log(error)
        next(error);
    }
});

app.post("/logout", authenticateUser, (req, res)=>{
    res.clearCookie('token',{
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    });
    res.send({message: "Logout successful"});
});

app.get("/verify", authenticateUser, async(req, res)=>{
    try {
        const {username} = await User.findOne({_id: req.user.id}, {username: 1});
        const response = {...req.user, username: username};
        res.send(response);
    } catch (error) {
        next(error);
    }
    
});

app.post("/issues", authenticateUser, validateIssue, async(req, res, next)=>{
    try{
        const userData = req.user;
        if(userData.role!=="resident") throw new ExpressError(403, "Forbidden");
        const formData = req.body;
        const newIssue = new Issue({
            title: formData.title,
            description: formData.description,
            urgency: formData.urgency,
            category: formData.category,
            residentId: userData.id,
            selectedOpt: formData.selectedOpt,
            providerId: formData.selectedProvider || null
        });
        console.log(newIssue);
        await newIssue.save();
        res.sendStatus(201);
    }catch(err){
        next(err);
    }
});

app.get("/issues", authenticateUser, async(req, res, next)=>{
    try {
        const userData = req.user;
        if(userData.role!=="provider") throw new ExpressError(403, "Forbidden");
        const curUser = await User.findOne({_id: userData.id}, {category: 1});
        const issues = await Issue.find({category: curUser.category, status: "pending", selectedOpt: "no"}).populate({path: "residentId", select: {username: 1, roomNo: 1, phoneNumber: 1, email: 1}});;
        res.send(issues);
    } catch (error) {
        next(error);
    }
});

app.get("/issues/requests", authenticateUser, async(req, res, next)=>{
    try {
        const userData = req.user;
        if(userData.role!=="provider") throw new ExpressError(403, "Forbidden");
        const curUser = await User.findOne({_id: userData.id});
        const issues = await Issue.find({providerId: curUser._id, selectedOpt: "yes", category: curUser.category, status: "pending"}).populate({path: "residentId", select: {username: 1, roomNo: 1, phoneNumber: 1, email: 1}});
        res.send(issues);
    } catch (error) {
        next(error);
    }
});

app.get("/issues/self", authenticateUser, async(req, res, next)=>{
    try{
        const userData = req.user;
        const filter = {};
        if(userData.role==="resident"){
            filter.residentId = userData.id;
        }else if(userData.role==="provider"){
            filter.providerId = userData.id;
        }else{
            throw new ExpressError(403, "Forbidden");
        }

        const myIssues = await Issue.find(filter).sort({updatedAt: -1}).populate({path: "providerId", select: "username"}).populate({path: "residentId", select: {username: 1, roomNo: 1, phoneNumber: 1, email: 1}});;
        res.send(myIssues);
    }catch(err){
        next(err);
    }
});

app.patch("/issues/:id/accept", authenticateUser, async(req, res, next)=>{
    try {
        const userData = req.user;
        if(userData.role!=="provider") throw new ExpressError(403, "Forbidden");

        const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, {status: req.body.status, providerId: userData.id}, {new: true});
        console.log(updatedIssue);
        if (!updatedIssue) throw new ExpressError(404, "Issue not found");
        res.send(updatedIssue);
    } catch (error) {
        console.log(error)
        next(error);
    }
});

app.patch("/issues/:id/status", authenticateUser, async(req, res, next)=>{
    try {
        const userData = req.user;
        if(userData.role!=="provider") throw new ExpressError(403, "Forbidden");

        const filter = {status: req.body.status};
        if(req.body.status==='resolved'){
            filter.completedAt = Date.now();
        }

        if(req.body.status==='pending'){
            filter.providerId = null;
        }

        const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, filter, {new: true});
        console.log(updatedIssue);
        if (!updatedIssue) throw new ExpressError(404, "Issue not found");
        res.send(updatedIssue);
    } catch (error) {
        console.log(error)
        next(error);
    }
});

app.post("/issues/:id/rate", authenticateUser, async (req, res, next)=>{
    try {
        const {rating} = req.body;
        const issue = await Issue.findOne({_id: req.params.id});
        if(!issue) throw new ExpressError(404, "Issue Not Found");
        if(issue.status!=="resolved") throw new ExpressError(400, "Issue not completed");
        if(issue.residentId.toString() !== req.user.id) throw new ExpressError(403, "Not allowed");

        issue.rating = rating;
        await issue.save();

        const provider = await User.findOne({_id: issue.providerId});
        if(provider){
            const oldAverage = provider.averageRating||0;
            provider.averageRating = Math.round(((oldAverage * provider.totalRating) + rating)/(provider.totalRating+1));
            provider.totalRating = (provider.totalRating) + 1;
        }
        await provider.save();
        res.send("Good");
    } catch (error) {
        next(error)
    }
});

app.get("/providers/recommended", authenticateUser, async(req, res, next)=>{
    try {
        const recommended = await User.aggregate([
            {
                $match: {
                    role: "provider"
                }
            },
            {
                $addFields: {
                    weightedScore: {
                        $multiply: ["$averageRating", {$ln: {$add: ["$totalRating", 1]}}]
                    }
                }
            },
            {
                $sort: {weightedScore: -1}
            },
            {
                $limit: 3
            },
            {
                $project: {
                    username: 1,
                    averageRating: 1,
                    totalRating: 1,
                    weightedScore: 1,
                    category: 1
                }
            }
        ]);
        res.send(recommended);
    } catch (error) {
        next(error)
    }
});

app.get("/providers", authenticateUser, async(req, res, next)=>{
   const {category} = req.query;
   try {
        const providers = await User.aggregate([
            {
                $match:{
                    role: "provider",
                    category: `${category}`
                }
            },
            {
                $project:{
                    username: 1,
                    averageRating: 1,
                    totalRating: 1,
                    category: 1
                }
            }
        ]);
        res.send(providers);
   } catch (error) {
        next(error);
   } 
});

app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    console.log(err);
    res.status(statusCode).send(message);
})

//mongodb+srv://ejjineniraju:<db_password>@cluster0.gng4oyy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
app.listen(3000, ()=> console.log("listening at 3000"));