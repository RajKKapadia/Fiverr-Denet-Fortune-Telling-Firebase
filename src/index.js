const express = require('express');

const webApp = express();
const cors = require('cors')

webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());
webApp.use(cors());

const PORT = process.env.PORT || 5000;

const homeRoute = require('../routes/home_route');
const firebaseRoute = require('../routes/firebase_route');

webApp.use(homeRoute.router);
webApp.use(firebaseRoute.router);

webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});