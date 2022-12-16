const express = require('express');

const webApp = express();
const cors = require('cors')

webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());
webApp.use(cors());
webApp.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});

const PORT = process.env.PORT || 5000;

const homeRoute = require('../routes/home_route');
const frontendRoute = require('../routes/frontend_route');
const dialogflowRoute = require('../routes/dialogflow_route');

webApp.use('/', homeRoute.router);
webApp.use('/frontend', frontendRoute.router);
webApp.use('/dialogflow', dialogflowRoute.router);

webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});