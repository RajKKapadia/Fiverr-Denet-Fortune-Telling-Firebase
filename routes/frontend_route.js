const express  = require('express');
const router = express.Router();

const {
    detectIntent
} = require('../helper/dialogflow_api');

router.get('/', (req, res) => {

    res.status(200).json({ message: 'Use POST request for Dialogflow route.'});
});

router.post('/', async (req, res) => {
    if (!Object.keys(req.body).length) {
        
        return res.status(400).json({
            mesage: 'Request has no body'
        });

    } else {

        let intentData = await detectIntent('en-US', req.body.query, req.body.sessionId);
    
        res.status(200).json(intentData);
    }
});

module.exports = {
    router
};