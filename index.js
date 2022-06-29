const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// users routes
const usersRouter = require('./routes/usersRouter.js');

// auth routes
const authRouter = require('./routes/authRouter.js');

// post routes

const postRouter = require('./routes/postRouter.js');

// middleware 
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// database connection 
mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser:true,
        useUnifiedTopology: true
    })
   .then(()=>{
    console.log("Database connection has been successfully done.");
})
   .catch((err)=>{
    console.log(err);
})

// routing middleware
app.use('/api/users',usersRouter);
app.use('/api/auth',authRouter);
app.use('/api/posts',postRouter);

// wrong url middleware
app.use("/", (req, res, next) => {
    res.status("404").json({message: "URL not found"});
  })

// server listen 
app.listen(process.env.PORT,()=>{
    console.log(`Backend run at http://localhost:${process.env.PORT}`);
});