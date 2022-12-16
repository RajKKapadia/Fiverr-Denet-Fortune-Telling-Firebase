const express = require('express');
const router = express.Router();


const {
    formatResponseForDialogflow
} = require('../helper/utils');
const {
    confirmsDataPrivacy,
    userProvidesName,
    userProvidesSelfie,
    confirmsSendReport,
    guestUserProvidesPassword,
    registeredUserProvidesPassword
} = require('../controller/dialogflow_controller');


router.post('/', async (req, res) => {

    let action = req.body.queryResult.action;
    console.log(`Action -> ${action}`);

    let responseData = {};

    if (action === 'confirmsDataPrivacy') {
        responseData = confirmsDataPrivacy(req);
    } else if (action === 'userProvidesName') {
        responseData = userProvidesName(req);
    } else if (action === 'userProvidesSelfie') {
        responseData = userProvidesSelfie(req);
    } else if (action === 'confirmsSendReport') {
        responseData = confirmsSendReport(req);
    } else if (action === 'guestUserProvidesPassword') {
        responseData = await guestUserProvidesPassword(req);
    } else if (action === 'registeredUserProvidesPassword') {
        responseData = await registeredUserProvidesPassword(req);
    } else {
        responseData = formatResponseForDialogflow(
            `No handler for  the action -> ${action}.`,
            []
        );
    }

    res.send(responseData);
});

module.exports = {
    router
};