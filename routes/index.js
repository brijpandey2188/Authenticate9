const express = require("express");
const authRouter = require("./auth/authRoute");
const userRouter = require("./user/userRoute");

module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); 

    app.use('/api/v1', authRouter);
    app.use('/api/v1', userRouter);
}